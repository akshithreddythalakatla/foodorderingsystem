# Multi-stage build for Java 21 Spring Boot
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy dependency definition and source files
COPY pom.xml .
COPY src ./src

# Build the executable jar without running unit tests
RUN mvn clean package -DskipTests

# Lean runtime container
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy built artifact
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
