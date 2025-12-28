clean() {
    bazel clean --expunge
}

build_android() {
    # bazel doesn't manage android SDK so need to install it manually :(
    brew install --cask android-commandlinetools
    sdkmanager "platforms;android-36" "build-tools;36.0.0"
    export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools
    bazel build //src/main:app
}

build() {
    build_android
}


"$@"