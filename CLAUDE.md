# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Real Estate Accounting & Automation Website - a web-based system for managing apartment sales, contracts, and installment payments with automated tracking, analytics, and reporting.

**Important**: This system tracks manual payments only (cash or bank transfers). There is NO payment gateway integration.

## Technical Stack

### Backend
- **Framework**: ASP.NET Core Web API (.NET 8)
- **Architecture**: Clean Architecture with SOLID principles
- **Layer Structure**: Controllers → Services → Repository → EF Core
- **Authentication**: ASP.NET Identity + JWT Tokens
- **Database ORM**: Entity Framework Core
- **Mapping**: AutoMapper
- **Logging**: Serilog
- **Database**: Microsoft SQL Server

### Frontend
- **Framework**: React with TypeScript
- **UI Library**: Tailwind CSS or Bootstrap
- **Charts**: Recharts or Chart.js
- **State Management**: Redux Toolkit or Context API

## Architecture & Code Organization

### Clean Architecture Layers

The backend follows Clean Architecture with clear separation of concerns:

1. **API/Controllers Layer**: HTTP endpoints, request/response handling
2. **Application/Services Layer**: Business logic, orchestration
3. **Domain Layer**: Core entities, business rules, interfaces
4. **Infrastructure/Repository Layer**: Data access, EF Core implementations

### Core Domain Entities

The system revolves around these main entities and their relationships:

- **Apartments**: Physical properties (block, entrance, floor, room count, area)
- **Customers**: Buyer information (name, contact, passport with registration, address)
- **Agents**: Sales agents with commission tracking
- **Contracts**: Links customer + apartment + agent, defines terms (duration, total price, down payment)
- **InstallmentPlans**: Auto-generated monthly payment schedules
- **Payments**: Individual payment records (cash/non-cash, date, amount)

### Key Business Logic

**Contract Creation Flow**:
- When a contract is created, the system automatically calculates:
  - Total price based on apartment area and price per square meter
  - Monthly installment amount = (Total Price - Down Payment) / Duration in months
  - Complete payment schedule with due dates

**Payment Tracking**:
- Payments are recorded manually (no gateway integration)
- System tracks: paid vs unpaid months, remaining balance
- Auto-detection of overdue payments based on current date vs schedule
- Payment types: "нал" (cash) and "без.нал" (non-cash/bank transfer)

**Status Management**:
- Contracts can be: Active, Completed, Overdue
- Status automatically updates based on payment completion and overdue amounts

## Role-Based Access Control (RBAC)

The system implements four distinct user roles:

| Role | Permissions |
|------|-------------|
| **Admin** | Full access to all data, users, and system configuration |
| **Accountant** | Manage contracts, record payments, generate reports |
| **Agent** | View and manage own clients and contracts only |
| **Customer** | View own contract, payment schedule, and history (read-only) |

When implementing features, always check role permissions at both API and UI levels.

## Reporting & Export Requirements

The system must support:
- **Filters**: Date range, agent, building/block, payment status
- **Export Formats**: Excel and PDF
- **Report Types**: Payment history, overdue accounts, agent performance, revenue trends, tax/accounting summaries

## Dashboard & Analytics

Key metrics to display:
- Total apartments (sold vs available)
- Total revenue (received vs pending)
- Monthly revenue trends with charts
- Overdue payments (highlighted with alerts)
- Top-performing agents by sales count and commission

## Customer Portal Specifics

Customers should be able to:
- View contract details and payment schedule
- See remaining balance and payment history
- Download receipts and contract copies
- **Cannot**: Make online payments or modify any data

## Database Schema Considerations

When designing the database:
- Apartments have: block, entrance (подъезд), floor, room count, area (площадь)
- Contracts track: contract number, date, duration (months), total amount, down payment (первоначальный взнос)
- Payments distinguish between cash (нал) and non-cash (без.нал) transactions
- Store agent commission calculations linked to contracts
- Maintain complete audit trail of all payments

## Development Approach

- Follow SOLID principles throughout the codebase
- Use dependency injection for all services and repositories
- Implement proper validation at both client and server
- Use DTOs for API communication (map with AutoMapper)
- Log important business operations with Serilog
- Ensure all money calculations use appropriate decimal precision

## Common Calculations

When implementing payment logic:
- **Monthly Payment** = (Contract Total - Down Payment) / Duration in Months
- **Remaining Balance** = Contract Total - All Payments Made
- **Months Paid** = Count of recorded monthly payments
- **Months Remaining** = Duration - Months Paid
- **Overdue Check**: Compare current date with scheduled payment dates where payment is null
