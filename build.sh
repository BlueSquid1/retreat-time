set -e
build_android() {
    # as of 2025, google only release the AAPT2 tool (which is part of the android commandline tools) on linux for 
    # the amd64 platform so need to use the amd64 linux image :(
    docker build --platform=linux/amd64  --tag android_compiler ./android
    docker run --platform=linux/amd64 --rm --name android_compiler -v $(pwd)/android:/android android_compiler assembleDebug #assembleRelease
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
        /opt/homebrew/share/android-commandlinetools/emulator/emulator -avd myEmu &
    fi
    adb install android/app/build/outputs/apk/debug/app-debug.apk
    adb shell am start -n com.example.retreattime/com.example.retreattime.MainActivity -a android.intent.action.MAIN -c android.intent.category.LAUNCHER --splashscreen-show-icon
}

android() {
    build_android
    run_android
}

"$@"