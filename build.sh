set -e

# first time. no old image, no old container
# image didn't change, old container exists
# image did change, old container exists

generate_container() {
    DOCKERFILE_PATH="${1}"
    IMAGE_NAME="${2}"
    CONTAINER_NAME="${IMAGE_NAME}"

    # capture the remaining parameters as container arguments
    shift 2
    CONTAINER_ARGS=$@

    # Rebuild the image and see if the ID changes. First need current image ID.
    OLD_IMAGE_ID="$(docker images -q "${IMAGE_NAME}" 2> /dev/null || true)"

    docker build ${DOCKER_ARGS}  --tag "${IMAGE_NAME}" "${DOCKERFILE_PATH}"
    NEW_IMAGE_ID="$(docker images -q "${IMAGE_NAME}")"

    # or rebuild if container arguements have changed
    OLD_CONTAINER_ARGS=$(docker inspect "${IMAGE_NAME}" | jq -r '.[].Config.Cmd | select(. != null) | join(" ")')

    if [[ "${OLD_IMAGE_ID}" != "${NEW_IMAGE_ID}" ]] || [[ "${OLD_CONTAINER_ARGS}" != "${CONTAINER_ARGS}" ]]; then
        # need to regenerate a new container
        echo "docker image has changed or container args have changed. Invalid the any old containers"
        docker rm -f "${CONTAINER_NAME}" 2> /dev/null
    fi

    # Create a new container if it doesn't already exist
    CONTAINER_EXISTS="$(docker ps -a --filter "name=^/${CONTAINER_NAME}$" --format '{{.ID}}')"
    if [[ -z "${CONTAINER_EXISTS}" ]]; then
        docker create ${DOCKER_ARGS} --name "${CONTAINER_NAME}" "${IMAGE_NAME}" ${CONTAINER_ARGS}
    fi
}

build_android() {
    # as of 2026, google still do not release the AAPT2 tool (which is part of the android commandline tools) on 
    # linux for the arm64 platform so need to use the amd64 linux image :(
    DOCKER_ARGS="--platform=linux/amd64" generate_container ./android android assembleDebug #assembleDebug #assembleRelease

    docker cp ./android/. android:/android/

    docker cp frontend:/dist/. /tmp/frontend/
    docker cp /tmp/frontend/ android:/android/app/src/main/assets/

    docker start -ia android

    #docker cp android:/
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

build_frontend() {
    #cd frontend; npm run setup; cd ..
    generate_container ./frontend frontend build
    docker cp ./frontend/. frontend:/frontend/
    docker start -ia frontend
}

build() {
    build_frontend
    build_android
}

clean() {
    docker rm -f android
    docker rm -f frontend
    docker image rm -f android
    docker image rm -f frontend
}

"$@"