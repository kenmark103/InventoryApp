## Summary

**InventoryApp** is a full-stack inventory management system consisting of an **ASP.NET Core** backend and a **React Admin** frontend. The application uses **PostgreSQL** for data storage, exposes RESTful endpoints documented via Swagger, and provides a modern UI for managing products, categories, orders, and stock levels. Below you’ll find instructions on how to clone the repo, install dependencies, configure your local PostgreSQL database, and run both backend and frontend servers.  

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Prerequisites](#prerequisites)  
- [Installation](#installation)  
  - [1. Clone the Repository](#1-clone-the-repository)  
  - [2. Setup PostgreSQL](#2-setup-postgresql)  
  - [3. Configure the Backend](#3-configure-the-backend)  
  - [4. Run Database Migrations](#4-run-database-migrations)  
  - [5. Start the Backend](#5-start-the-backend)  
  - [6. Install Frontend Dependencies](#6-install-frontend-dependencies)  
  - [7. Start the Frontend](#7-start-the-frontend)  
- [Project Structure](#project-structure)  
- [API Documentation](#api-documentation)  
- [Contributing](#contributing)  
- [License & Contact](#license--contact)  

---

## Features

- **Product Management**: Create, update, and delete products.  
- **Category Management**: Organize products by categories.  
- **Order Processing**: Record sales orders and manage order history.  
- **Stock Control**: Adjust and track inventory levels in real time.  
- **User Authentication**: Secure endpoints with JWT-based auth.  
- **Responsive Admin UI**: Built with React Admin for a modern experience.  
- **Swagger UI**: Explore and test REST endpoints via Swagger.  

---

## Tech Stack

- **Backend**: ASP.NET Core Web API (C#)  ([GitHub - kenmark103/InventoryApp](https://github.com/kenmark103/InventoryApp))  
- **Frontend**: React + React Admin (TypeScript)  ([GitHub - kenmark103/InventoryApp](https://github.com/kenmark103/InventoryApp))  
- **Database**: PostgreSQL  ([Downloads - PostgreSQL](https://www.postgresql.org/download/?utm_source=chatgpt.com))  
- **API Docs**: Swagger (OpenAPI)  ([GitHub - kenmark103/InventoryApp](https://github.com/kenmark103/InventoryApp))  
- **Testing**: xUnit (under `InventoryProject.Tests`)  ([GitHub - kenmark103/InventoryApp](https://github.com/kenmark103/InventoryApp))  

---

## Prerequisites

Before you begin, ensure you have the following installed:

1. **.NET SDK 7.0+**  
2. **Node.js 18+** and **npm** (or **pnpm**)  ([GitHub - kenmark103/InventoryApp](https://github.com/kenmark103/InventoryApp))  
3. **PostgreSQL 14+**  
   - Download installers or packages from the official site  ([Downloads - PostgreSQL](https://www.postgresql.org/download/?utm_source=chatgpt.com))  
4. **Git**  

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/kenmark103/InventoryApp.git
cd InventoryApp
```  
 ([GitHub - kenmark103/InventoryApp](https://github.com/kenmark103/InventoryApp))

---

### 2. Setup PostgreSQL

1. **Install PostgreSQL** following the official download page  ([Downloads - PostgreSQL](https://www.postgresql.org/download/?utm_source=chatgpt.com)).  
2. **Create a new database** (e.g., `inventorydb`):

   ```sql
   CREATE DATABASE inventorydb;
   ```

3. **Note** the connection details (host, port, username, password) for the next step.

---

### 3. Configure the Backend

1. Navigate to the **Backend** folder:

   ```bash
   cd Backend
   ```

2. **Update** `appsettings.json` (or `appsettings.Development.json`) with your PostgreSQL connection string:

   ```jsonc
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Port=5432;Database=inventorydb;Username=postgres;Password=YourPassword"
     }
   }
   ```

---

### 4. Run Database Migrations

Use the .NET CLI to apply EF Core migrations:

```bash
dotnet ef database update
```  
 ([Documentation - PostgreSQL](https://www.postgresql.org/docs/?utm_source=chatgpt.com))

This will create the necessary tables in your PostgreSQL database.

---

### 5. Start the Backend

Run the Web API:

```bash
dotnet run
```

By default, the API will be available at `https://localhost:5001` (HTTPS) and `http://localhost:5000` (HTTP).

---

### 6. Install Frontend Dependencies

In a new terminal, navigate to the **ReactAdmin** folder:

```bash
cd ../ReactAdmin
npm install
# or
pnpm install
```  
 ([GitHub - kenmark103/InventoryApp](https://github.com/kenmark103/InventoryApp))

---

### 7. Start the Frontend

```bash
npm start
# or
pnpm dev
```

This will launch the React Admin interface at `http://localhost:5173` by default.

---

## Project Structure

```text
InventoryApp/
├── Backend/                  # ASP.NET Core Web API
│   ├── Controllers/          # API controllers
│   ├── Data/                 # EF Core DbContext & migrations
│   ├── Models/               # Entity classes & DTOs
│   ├── Program.cs            # Application entrypoint
│   └── appsettings.json      # Configuration (DB connection, etc.)
├── ReactAdmin/               # React Admin frontend
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── services/         # API client wrappers
│   │   └── App.tsx           # Root component & routing
│   └── package.json
├── InventoryProject.Tests/   # xUnit integration & unit tests
├── images/                   # Demo screenshots & inspirations
├── swagger_backend.json      # OpenAPI spec dump
└── InventoryApp.sln          # Solution file
```  
 ([GitHub - kenmark103/InventoryApp](https://github.com/kenmark103/InventoryApp))

---

## API Documentation

Swagger UI is auto-generated for the backend. Once the API is running, navigate to:

```
https://localhost:5001/swagger/index.html
```

Here you can explore all available endpoints, view schemas, and execute requests directly in your browser  ([GitHub - kenmark103/InventoryApp](https://github.com/kenmark103/InventoryApp)).

---

## Contributing

1. Fork the repository.  
2. Create a feature branch: `git checkout -b feature/YourFeature`.  
3. Commit your changes: `git commit -m "Add YourFeature"`.  
4. Push to your fork: `git push origin feature/YourFeature`.  
5. Open a Pull Request and describe your changes.  

Please ensure all tests pass before submitting a PR  ([GitHub - kenmark103/InventoryApp](https://github.com/kenmark103/InventoryApp)).

---

## License & Contact

- **License**: MIT (see [LICENSE](LICENSE) file)  
- **Maintainer**: kenmark103 (<https://github.com/kenmark103>)  

For questions or support, open an issue or contact `kenmark103@users.noreply.github.com`.
