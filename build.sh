#!/usr/bin/env bash
set -e

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# Handle arguements
VERBOSE=false
if [[ "$*" == *"-v"* ]]; then
    VERBOSE=true
fi

run_quiet() {
    local OUTPUT
    OUTPUT=$("$@" 2>&1) || {
        # non-zero return code
        echo "$OUTPUT"

        return 1
    }
    if [ "$VERBOSE" = true ]; then
        echo "$OUTPUT"
    fi
}

build_android() {
    echo "cleaning from previous android build"
    rm -rf "${SCRIPT_DIR}/build/android"

    echo "build android docker image"
    # as of 2026, google still do not release the AAPT2 tool (which is part of the android commandline tools) on 
    # linux for the arm64 platform so need to use the amd64 linux image :(
    run_quiet docker build --tag "android" --platform=linux/amd64 "${SCRIPT_DIR}/android"

    echo "compile android app"
    run_quiet docker run --tty --rm --name "android_container" \
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
    echo "ensure android emulator is installed"
    run_quiet sdkmanager "platform-tools" "emulator" "system-images;android-36;default;arm64-v8a"
    echo "ensure myEmu avd exists"
    if ! avdmanager list avd | grep -q "Name: myEmu"; then
        echo "can't find a avd. Must be first time. Creating one"
        run_quiet avdmanager create avd -n myEmu -k "system-images;android-36;default;arm64-v8a" --device "pixel"
    fi
    echo "start the android emulator"
    if ! adb devices | grep -q emulator; then
        echo "avd is not detected. Starting it up"
        run_quiet /opt/homebrew/share/android-commandlinetools/emulator/emulator -avd myEmu &
    fi
    echo "wait for emulator to respond"
    adb wait-for-device
    echo "uninstall old android app"
    run_quiet adb uninstall com.example.retreattime
    echo "install new android app"
    run_quiet adb install "${SCRIPT_DIR}/build/android/debug/app-debug.apk"
    echo "launch new android app"

    # Copied from android studio
    run_quiet adb shell am start -n com.example.retreattime/com.example.retreattime.MainActivity -a android.intent.action.MAIN -c android.intent.category.LAUNCHER --splashscreen-show-icon
}

android() {
    build_frontend
    build_android
    run_android
}

build_frontend() {
    echo "cleaning from previous frontend build"
    rm -rf "${SCRIPT_DIR}/build/frontend"

    echo "update npm packages"
    run_quiet npm run --prefix frontend update_packages

    echo "build frontend docker image"
    run_quiet docker build --tag "frontend" "${SCRIPT_DIR}/frontend"
    
    echo "compile frontend"
    run_quiet docker run --rm --tty --name "frontend_container" \
        -v "${SCRIPT_DIR}/build/frontend:/dist" \
        frontend build
}

run_frontend() {
    echo "serving on: http://localhost:8000"
    run_quiet python3 -m http.server -d ./build/frontend/ 8000
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

setup_dev() {
    echo "install Node packages for frontend"
    run_quiet npm run --prefix frontend setup
}

clean() {
    rm -rf "${SCRIPT_DIR}/build"
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