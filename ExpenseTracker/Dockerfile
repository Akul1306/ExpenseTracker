# ---------- Stage 1: Build ----------
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
  
  # Copy only pom.xml first to leverage Docker layer caching for dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B
  
  # Now copy source and build
COPY src ./src
RUN mvn clean package -DskipTests -B
  
  # ---------- Stage 2: Run ----------
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN mkdir -p /app/uploads

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]