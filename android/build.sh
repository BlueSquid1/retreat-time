set -e

export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools

clean() {
    bazel clean --expunge
}

build_android() {
    # bazel doesn't manage android SDK so need to install it manually :(
    brew install --cask android-commandlinetools
    sdkmanager "platforms;android-36" "build-tools;36.0.0"
    bazel build //src/main:app
}

run_android() {
    sdkmanager "platform-tools" "emulator" "system-images;android-36;default;arm64-v8a"
    if ! avdmanager list avd | grep -q "Name: myEmu"; then
        avdmanager create avd -n myEmu -k "system-images;android-36;default;arm64-v8a" --device "pixel"
    fi
    if ! adb devices | grep -q emulator; then
        ${ANDROID_HOME}/emulator/emulator -avd myEmu &
    fi
    adb install bazel-bin/src/main/app.apk
    adb shell am start -a android.intent.action.MAIN -n com.example.bazel/.MainActivity
}

build() {
    build_android
}

run() {
    run_android
}


"$@"