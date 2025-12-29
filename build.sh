set -e
build_android() {
    # as of 2025, google only release the AAPT2 tool (which is part of the android commandline tools) on linux for 
    # the amd64 platform so need to use the amd64 linux image :(
    docker build --platform=linux/amd64  --tag android_compiler ./android
    docker run --platform=linux/amd64 -it -v $(pwd)/android:/android --rm android_compiler assembleDebug #assembleRelease
}

"$@"