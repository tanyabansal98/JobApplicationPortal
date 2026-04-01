# Project Documentation

## Project Structure

The project follows a decoupled client-server architecture. The **backend** is a Spring Boot application organized into layers: `model` (JPA entities like `User`, `Job`), `repository` (Spring Data interfaces), `service` (business logic), and `controller` (REST endpoints). It secures data with Spring Security and connects to an Oracle Cloud database managed via JDBC.

The **frontend** is a modern React application built with TypeScript and Vite, utilizing Tailwind CSS for styling and Axios for API communication. It communicates with the backend via RESTful endpoints, with a development proxy configured to handle local CORS requirements during the build process.

This monorepo structure allows for clear separation of concerns. The backend manages data persistence and security while the frontend provides a dynamic and responsive user experience, ensuring the system remains scalable and easy to maintain.

### Database Details:

- **Database Type**: Oracle Cloud Autonomous Database
- **Connection String**: `jdbc:oracle:thin:@damg6210db_high`
- **Username**: `MVC_APP`
- **Password**: `MVC_Password@123`
- **Driver**: `oracle.jdbc.OracleDriver`

### Key Features:

- **User Authentication**: Secure login and registration for students and employers.
- **Job Management**: Employers can create, update, and delete job postings.
- **Application Tracking**: Students can apply for jobs and track their application status.
- **Role-Based Access**: Different functionalities for students and employers.
- **Responsive Design**: Modern UI with Tailwind CSS for optimal viewing on different devices.
- **RESTful API**: Clean separation between frontend and backend with RESTful endpoints.
- **Security**: Password hashing and secure session management.
- **Database Integration**: Seamless connection to Oracle Cloud Autonomous Database for data persistence.
- **Logging**: Comprehensive logging for debugging and monitoring.
- **Error Handling**: Graceful error handling with meaningful messages.
- **Date Formatting**: Consistent date formatting across the application.

### User Details:

- **Username**: Tanya@gmail.com
- **Password**: Tanya123

### How to run the project:

- **Frontend**: npm install, npm run dev
- **Backend**: mvn spring-boot:run