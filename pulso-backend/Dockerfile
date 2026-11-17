# Multi-stage build for Pulso Backend
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copy Maven files
COPY pom.xml .
COPY src ./src

# Install Maven and build package
RUN apk add --no-cache maven && \
    mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=build /app/target/pulso-backend-1.0.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-Xmx256m", "-XX:MaxMetaspaceSize=128m", "-jar", "app.jar"]
