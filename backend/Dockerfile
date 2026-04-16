# --- Stage 1: The "Builder" Stage ---
# We use the full Maven image because it has the 'mvn' command and a full JDK.
# We name this stage 'build' so we can refer to it in the next stage.
FROM maven:3.9.6-eclipse-temurin-17 AS build

# WORKDIR creates a folder inside the container where our commands will run.
WORKDIR /app

# STEP A: Optimize Downloads
# We copy ONLY the pom.xml first. 
# In Docker, if this file hasn't changed, it will skip the 'mvn dependency' step next time.
COPY pom.xml .

# This command downloads all your libraries (Spring, Oracle drivers, etc.) 
# so they are ready to go.
RUN mvn dependency:go-offline -B

# STEP B: Compile the Code
# Now we copy your actual Java source code into the container.
COPY src ./src

# This command packages your app into a .jar file. 
# We skip tests here because the CI pipeline runs them separately for better speed.
RUN mvn clean package -DskipTests

# --- Stage 2: The "Runtime" Stage ---
# We switch to a JRE (Java Runtime Environment) image. 
# It is much smaller because it doesn't have compiler tools (which we don't need anymore).
FROM eclipse-temurin:17-jre-jammy

# Setting the working directory for the final app
WORKDIR /app

# STEP C: The Handover
# This is the most important line. we copy ONLY the finished .jar file 
# from the 'build' stage into this fresh, clean stage.
COPY --from=build /app/target/*.jar app.jar

# Inform Docker that the container will listen on port 8080 at runtime.
EXPOSE 8080

# The final command that starts your Spring Boot application!
ENTRYPOINT ["java", "-jar", "app.jar"]
