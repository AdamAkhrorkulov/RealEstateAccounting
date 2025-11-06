# Real Estate Accounting & Automation System

A comprehensive web-based system for managing apartment sales, contracts, and installment payments with automated tracking, analytics, and reporting.

## Features

- **Apartment Management**: Track apartments with details (block, entrance, floor, rooms, area)
- **Customer Management**: Manage customer information with passport details
- **Contract Management**: Create contracts with automated installment plan generation
- **Payment Tracking**: Record manual payments (cash/non-cash) and track payment history
- **Agent Management**: Track sales agents with commission calculations
- **Dashboard & Analytics**: View sales metrics, revenue trends, and overdue payments
- **Role-Based Access**: Admin, Accountant, Agent, and Customer roles with specific permissions
- **Reporting**: Generate payment reports and export data

## Technical Stack

### Backend
- **.NET 8** - ASP.NET Core Web API
- **Clean Architecture** - Separation of concerns with Domain, Application, Infrastructure, and API layers
- **Entity Framework Core** - ORM for database access
- **SQL Server** - Database system
- **ASP.NET Identity** - User authentication and authorization
- **JWT** - Token-based authentication
- **AutoMapper** - Object mapping
- **Serilog** - Structured logging

### Architecture Layers

```
RealEstateAccounting/
├── src/
│   ├── RealEstateAccounting.Domain/         # Core entities, interfaces, enums
│   ├── RealEstateAccounting.Application/    # Business logic, DTOs, services
│   ├── RealEstateAccounting.Infrastructure/ # Data access, EF Core, repositories
│   └── RealEstateAccounting.API/            # Controllers, middleware, startup
```

## Getting Started

### Prerequisites

- .NET 8 SDK
- SQL Server (LocalDB or full instance)
- Visual Studio 2022 or VS Code

### Database Setup

1. Update the connection string in `src/RealEstateAccounting.API/appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=RealEstateAccountingDb;Trusted_Connection=True;TrustServerCertificate=True"
}
```

2. Run migrations to create the database:

```bash
cd src/RealEstateAccounting.API
dotnet ef migrations add InitialCreate --project ../RealEstateAccounting.Infrastructure
dotnet ef database update
```

### Running the Application

```bash
cd src/RealEstateAccounting.API
dotnet run
```

The API will be available at:
- HTTPS: `https://localhost:7001`
- HTTP: `http://localhost:5001`
- Swagger UI: `https://localhost:7001/swagger`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user (Admin only)
- `GET /api/auth/users` - Get all users (Admin only)

### Apartments
- `GET /api/apartments` - Get all apartments
- `GET /api/apartments/{id}` - Get apartment by ID
- `GET /api/apartments/available` - Get available apartments
- `POST /api/apartments` - Create apartment (Admin/Accountant)
- `PUT /api/apartments/{id}` - Update apartment (Admin/Accountant)
- `DELETE /api/apartments/{id}` - Delete apartment (Admin)

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/{id}` - Get customer by ID
- `GET /api/customers/search?searchTerm={term}` - Search customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer (Admin)

### Agents
- `GET /api/agents` - Get all agents
- `GET /api/agents/{id}` - Get agent by ID
- `GET /api/agents/top-performers` - Get top performing agents
- `POST /api/agents` - Create agent (Admin)
- `PUT /api/agents/{id}` - Update agent (Admin)
- `DELETE /api/agents/{id}` - Delete agent (Admin)

### Contracts
- `GET /api/contracts` - Get all contracts
- `GET /api/contracts/{id}` - Get contract by ID
- `GET /api/contracts/{id}/details` - Get contract with full details
- `GET /api/contracts/customer/{customerId}` - Get contracts by customer
- `GET /api/contracts/agent/{agentId}` - Get contracts by agent
- `GET /api/contracts/overdue` - Get overdue contracts
- `POST /api/contracts` - Create contract (Admin/Accountant)
- `PUT /api/contracts/{id}` - Update contract (Admin/Accountant)
- `DELETE /api/contracts/{id}` - Delete contract (Admin)

### Payments
- `GET /api/payments/{id}` - Get payment by ID
- `GET /api/payments/contract/{contractId}` - Get payments by contract
- `GET /api/payments/report?startDate={date}&endDate={date}` - Get payment report
- `POST /api/payments` - Create payment (Admin/Accountant)
- `DELETE /api/payments/{id}` - Delete payment (Admin)

### Dashboard
- `GET /api/dashboard` - Get dashboard data
- `GET /api/dashboard/trends?months={count}` - Get revenue trends

## Business Logic

### Contract Creation
When a contract is created:
1. System validates apartment is available
2. Calculates total price based on apartment area and price per square meter
3. Calculates monthly payment: `(Total Price - Down Payment) / Duration`
4. Automatically generates installment plan for all months
5. Updates apartment status to "Sold"
6. Calculates and records agent commission

### Payment Processing
When a payment is recorded:
1. Payment is linked to a contract
2. If linked to an installment plan, marks that month as paid
3. Updates contract status based on payment completion
4. Tracks payment type (cash or non-cash)
5. Records who processed the payment

### Contract Status Updates
- **Active**: Contract has unpaid installments, none overdue
- **Overdue**: Contract has unpaid installments past due date
- **Completed**: All installments paid
- **Cancelled**: Contract cancelled by admin

## Security

- JWT-based authentication
- Role-based authorization (Admin, Accountant, Agent, Customer)
- Passwords hashed using ASP.NET Identity
- HTTPS enforced in production

## Configuration

Key settings in `appsettings.json`:

```json
{
  "Jwt": {
    "SecretKey": "your-secret-key-here",
    "Issuer": "RealEstateAccounting",
    "Audience": "RealEstateAccountingUsers",
    "ExpirationHours": "24"
  }
}
```

## Logging

Logs are written to:
- Console (all environments)
- Files in `Logs/` directory (rotating daily)

## License

This project is proprietary software.
