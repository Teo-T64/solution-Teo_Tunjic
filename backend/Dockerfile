
FROM maven:3.9.6-eclipse-temurin-21 AS build
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-jammy
COPY --from=build /target/*.jar app.jar

ENTRYPOINT ["java", "-Xmx400m", "-Xss512k", "-XX:+UseSerialGC", "-jar", "/app.jar"]