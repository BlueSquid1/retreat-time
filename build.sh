#!/usr/bin/env bash
set -e

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

if [[ "$*" == *"-v"* ]]; then
    # if ran with -v then print out all logs
    OUTPUT_FD=/dev/stdout
else
    # Silence all process logs
    OUTPUT_FD=/dev/null
fi

build_android() {
    echo "build android docker image"
    # as of 2026, google still do not release the AAPT2 tool (which is part of the android commandline tools) on 
    # linux for the arm64 platform so need to use the amd64 linux image :(
    docker build --tag "android" --quiet --platform=linux/amd64 "${SCRIPT_DIR}/android" > ${OUTPUT_FD}

    echo "compile android app"
    docker run --tty --quiet --rm --name "android_container" \
        --platform=linux/amd64 \
        -v "${SCRIPT_DIR}/build/frontend:/android/app/src/main/assets" \
        -v "${SCRIPT_DIR}/build/android:/build/outputs/apk" \
        android assembleDebug > ${OUTPUT_FD}
    # docker start -a android_container
}

run_android() {
    if ! brew list --cask | grep -q "android-commandlinetools"; then
        echo "android-commandlinetools is not installed. Please run: brew install --cask android-commandlinetools"
        exit 1
    fi
    echo "ensure android emulator is installed"
    sdkmanager "platform-tools" "emulator" "system-images;android-36;default;arm64-v8a" 1> ${OUTPUT_FD}
    echo "ensure myEmu avd exists"
    if ! avdmanager list avd | grep -q "Name: myEmu"; then
        echo "can't find a avd. Must be first time. Creating one"
        avdmanager create avd -n myEmu -k "system-images;android-36;default;arm64-v8a" --device "pixel" 1> ${OUTPUT_FD}
    fi
    echo "start the android emulator"
    if ! adb devices | grep -q emulator; then
        echo "avd is not detected. Starting it up"
        /opt/homebrew/share/android-commandlinetools/emulator/emulator -avd myEmu 1> ${OUTPUT_FD} &
    fi
    echo "uninstall old android app"
    adb uninstall com.example.retreattime > ${OUTPUT_FD}
    echo "install new android app"
    adb install "${SCRIPT_DIR}/build/android/debug/app-debug.apk" > ${OUTPUT_FD}
    echo "launch new android app"
    adb shell am start -n com.example.retreattime/com.example.retreattime.MainActivity -a android.intent.action.MAIN -c android.intent.category.LAUNCHER --splashscreen-show-icon > ${OUTPUT_FD}
}

android() {
    build_frontend
    build_android
    run_android
}

build_frontend() {
    echo "Update npm packages"
    npm run --prefix frontend setup 1> ${OUTPUT_FD}

    echo "Build frontend docker image"
    docker build --tag "frontend" --quiet "${SCRIPT_DIR}/frontend" 1> ${OUTPUT_FD}
    
    echo "Compile frontend"
    docker run --rm --tty --quiet --name "frontend_container" \
        -v "${SCRIPT_DIR}/build/frontend:/dist" \
        frontend build 1> ${OUTPUT_FD}
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

all() {
    clean
    build
}

"$@"