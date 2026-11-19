# Smart Inventory Management System

A database-driven inventory management application built using Java, Spring Boot, MySQL, MongoDB, and JavaScript. The system supports product management, inventory batch tracking, and automated stock alerts through a shared web frontend.

The project includes two independent backend implementations — one using MySQL and another using MongoDB — that can be selected through a shared frontend API configuration.

## Features

- **Product Management:** Create, view, update, and delete products.
- **Inventory Management:** Manage inventory batches, quantities, manufacturing dates, expiry dates, and warehouse locations.
- **Automated Alerts:** Generate alerts for near-expiry, expired inventory, and out-of-stock conditions.
- **Alert Management:** View unresolved alerts and mark alerts as resolved.
- **Dashboard:** View total products, inventory records, and unresolved alerts.
- **Browser Notifications:** Receive browser notifications for newly detected alerts.
- **Dual Database Support:** Choose between MySQL and MongoDB backend implementations.
- **Shared Frontend:** Use the same HTML, CSS, and JavaScript interface with either backend.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Java, Spring Boot |
| SQL Database | MySQL |
| NoSQL Database | MongoDB |
| SQL Persistence | Spring Data JPA, Hibernate |
| NoSQL Persistence | Spring Data MongoDB |
| Build Tool | Maven |
| Version Control | Git, GitHub |

## Project Architecture

```text
SmartInventory/
│
├── frontend/
│   ├── index.html
│   ├── products.html
│   ├── inventory.html
│   ├── alerts.html
│   ├── api.js
│   ├── main.js
│   ├── products.js
│   ├── inventory.js
│   ├── alerts.js
│   └── style.css
│
├── backendSQL/
│   ├── src/
│   ├── pom.xml
│   └── mvnw
│
├── backendMongo/
│   ├── src/
│   ├── pom.xml
│   └── mvnw
│
├── .env.example
├── .gitignore
└── README.md
```

### Architecture Overview

**Frontend:** A shared web interface built using HTML, CSS, and JavaScript.

**SQL Backend:** A Spring Boot application using Spring Data JPA and MySQL for relational data persistence.

**MongoDB Backend:** A separate Spring Boot application using Spring Data MongoDB for document-based data persistence.

The `frontend/api.js` file acts as a shared API adapter. The `DATABASE_MODE` configuration determines which backend endpoints are used.

## Getting Started

### Prerequisites

Install the following:

- Java Development Kit (JDK) 17
- MySQL Server (for SQL backend)
- MongoDB Atlas account or a MongoDB deployment (for MongoDB backend)
- Git
- Visual Studio Code or another code editor
- A browser and Live Server extension (or another static HTTP server)

### 1. Clone the Repository

```bash
git clone https://github.com/Vivk1560/smart-inventory-management-system.git

cd smart-inventory-management-system
```

### 2. Configure Environment Variables

Create a local `.env` file in the project root by copying `.env.example`.

```powershell
Copy-Item .env.example .env
```

Update `.env` with your database credentials:

```properties
MYSQL_DB_URL=jdbc:mysql://localhost:3306/smartinventory
MYSQL_DB_USERNAME=your_mysql_username
MYSQL_DB_PASSWORD=your_mysql_password

MONGO_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/smartinventory?retryWrites=true&w=majority
```

Replace the placeholder values with your actual database credentials and connection details.

**Important:**
- Never commit the `.env` file.
- Keep database credentials private.
- Ensure the MongoDB connection URI contains a database name.
- Create the MySQL database before starting the SQL backend.

### 3. Run the SQL Backend

Open a terminal in the project root:

```powershell
cd backendSQL
```

Start the application:

```powershell
.\mvnw.cmd spring-boot:run
```

The SQL backend runs at:

```text
http://localhost:8082
```

### 4. Run the MongoDB Backend

Stop the SQL backend before starting MongoDB.

Open another terminal in the project root:

```powershell
cd backendMongo
```

Start the application:

```powershell
.\mvnw.cmd spring-boot:run
```

The MongoDB backend also runs at:

```text
http://localhost:8082
```

**Note:** Both backends use port `8082`. Run only one backend at a time.

### 5. Configure the Frontend

Open:

```text
frontend/api.js
```

Select the backend you want to use:

For MySQL:

```javascript
const DATABASE_MODE = "sql";
```

For MongoDB:

```javascript
const DATABASE_MODE = "mongo";
```

Save the file after changing the database mode.

### 6. Launch the Frontend

Open the `frontend` folder in Visual Studio Code.

Launch `index.html` using Live Server.

The application can then be accessed through the local development server URL.

## API Overview

The frontend communicates with the backend through the following API routes.

Base URL:

```text
http://127.0.0.1:8082/api
```

| Operation | MySQL Backend | MongoDB Backend |
|---|---|---|
| Products | `/products` | `/products` |
| Inventory | `/inventories` | `/inventory` |
| Unresolved Alerts | `/alerts` | `/alerts/unresolved` |
| Resolve Alert | `PUT /alerts/{id}` | `PUT /alerts/{id}/resolve` |

Product and inventory endpoints support CRUD operations through the corresponding backend controllers.

## Database Implementations

### MySQL

The SQL implementation uses:

- Spring Boot
- Spring Data JPA
- Hibernate
- MySQL Connector/J

Database configuration is managed through environment variables.

### MongoDB

The MongoDB implementation uses:

- Spring Boot
- Spring Data MongoDB
- MongoDB connection URI

Database configuration is managed through the `MONGO_URI` environment variable.

## Testing

The following application workflows have been tested manually:

- Product creation, retrieval, updating, and deletion.
- Inventory creation, retrieval, updating, and deletion.
- Fetching and displaying records from the selected backend.
- Alert generation and retrieval.
- Resolving alerts.
- Dashboard statistics.
- Running the shared frontend with both database implementations.

## Known Limitations

- The SQL and MongoDB backends are alternative implementations and cannot run simultaneously on the same configured port.
- MongoDB near-expiry alert generation after editing the expiry date of an existing inventory record requires further verification.
- API contracts and database configurations are maintained separately for the two backend implementations.

## Future Improvements

- Improve duplicate alert prevention and alert lifecycle management.
- Strengthen automated backend and integration testing.
- Add advanced inventory analytics and reporting.
- Improve dashboard visualizations.
- Introduce role-based authentication and authorization.

## Author

**Vivaan Kukreja**

GitHub: [Vivk1560](https://github.com/Vivk1560)

---

*Built as a practical full-stack application to explore Java backend development, relational and NoSQL databases, and inventory management workflows.*