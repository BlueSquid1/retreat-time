FROM gradle:8.13-jdk21-noble AS buildenv

RUN apt update && apt install -y curl unzip

# Define Android SDK home and install required platforms/build-tools
ENV ANDROID_HOME=/android-sdk
RUN curl https://dl.google.com/android/repository/commandlinetools-linux-13114758_latest.zip \
    -o /tmp/cmdline-tools.zip
RUN unzip /tmp/cmdline-tools.zip -d "/tmp"

RUN mkdir -p "${ANDROID_HOME}/cmdline-tools"
RUN cp -r "/tmp/cmdline-tools" "${ANDROID_HOME}/cmdline-tools/latest"
ENV PATH="${PATH}:${ANDROID_HOME}/cmdline-tools/latest/bin"

RUN yes | sdkmanager --licenses
RUN sdkmanager "build-tools;36.0.0" "platforms;android-36"

WORKDIR /android
COPY . .

# Cache the plugins needed to build the apk
RUN ./gradlew --no-daemon --build-cache --configuration-cache assemble || true
ENTRYPOINT ["./gradlew", "--no-daemon", "--no-rebuild", "--offline"]
#CMD ["/bin/sh"]