#!/usr/bin/env bash
set -e

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

build_android() {
    # as of 2026, google still do not release the AAPT2 tool (which is part of the android commandline tools) on 
    # linux for the arm64 platform so need to use the amd64 linux image :(
    docker build --tag "android" --platform=linux/amd64 "${SCRIPT_DIR}/android"

    docker run -t --rm --name "android_container" \
        --platform=linux/amd64 \
        -v "${SCRIPT_DIR}/build/frontend:/android/app/src/main/assets" \
        -v "${SCRIPT_DIR}/build/android:/build/outputs/apk" \
        android assembleDebug
    # docker start -a android_container
}

run_android() {
    if ! brew list --cask | grep -q "android-commandlinetools"; then
        echo "android-commandlinetools is not installed. Please run: brew install --cask android-commandlinetools"
        exit 1
    fi
    sdkmanager "platform-tools" "emulator" "system-images;android-36;default;arm64-v8a"
    if ! avdmanager list avd | grep -q "Name: myEmu"; then
        echo "can't find a avd. Must be first time. Creating one"
        avdmanager create avd -n myEmu -k "system-images;android-36;default;arm64-v8a" --device "pixel"
    fi
    if ! adb devices | grep -q emulator; then
        echo "avd is not detected. Start it up"
        /opt/homebrew/share/android-commandlinetools/emulator/emulator -avd myEmu > /dev/null &
    fi
    adb uninstall com.example.retreattime
    adb install "${SCRIPT_DIR}/build/android/debug/app-debug.apk"
    adb shell am start -n com.example.retreattime/com.example.retreattime.MainActivity -a android.intent.action.MAIN -c android.intent.category.LAUNCHER --splashscreen-show-icon
}

android() {
    build_frontend
    build_android
    run_android
}

build_frontend() {
    cd frontend; npm run setup; cd ..
    docker build --tag "frontend" "${SCRIPT_DIR}/frontend"
    docker run --rm -t --name "frontend_container" \
        -v "${SCRIPT_DIR}/build/frontend:/dist" \
        frontend build
}

run_frontend() {
    python3 -m http.server -d ./build/frontend/ 8000
}

frontend() {
    build_frontend
    run_frontend
}

build() {
    mkdir -p "${SCRIPT_DIR}/build"
    build_frontend
    build_android
}

clean() {
    rm -f ./build
    docker rm -f android_container
    docker rm -f frontend_container
    docker image rm -f android
    docker image rm -f frontend
}

"$@"