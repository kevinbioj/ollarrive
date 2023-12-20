ARG GRADLE_VERSION=8.5-jdk21
ARG JAVA_DISTRIBUTION=azul/zulu-openjdk
ARG JAVA_VERSION=21.0.1-jre-headless

# Stage 1 – Build application
FROM gradle:8.5-jdk21 AS builder
WORKDIR /app
COPY build.gradle settings.gradle ./
RUN gradle build || return 0
COPY src/ ./src/
RUN gradle bootJar

# Stage 2 – Run application
FROM ${JAVA_DISTRIBUTION}:${JAVA_VERSION}
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar ./application.jar
CMD ["java", "-jar", "application.jar"]
