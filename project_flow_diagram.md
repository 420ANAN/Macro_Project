# MACO ERP Project Flow Diagram

This document provides a high-level overview of the MACO ERP system's architecture and user workflows.

## System Overview

The MACO ERP is a MERN-stack application (MongoDB, Express, React, Node.js) designed for enterprise resource planning, industrial marketplace management, and CRM.

## Core Workflows

```mermaid
graph TD
    Start((Start)) --> Landing{Landing Page}
    Landing --> Login[Login Page]
    Landing --> Register[Register Page]

    Register --> RegProcess{Registration}
    RegProcess -->|Admin| AdminReg[Admin Created]
    RegProcess -->|Customer| CustReg[Customer Pending Approval]
    
    CustReg --> AdminApproval[Admin User Approvals]
    AdminApproval -->|Approve| CustActive[Customer Account Active]
    AdminApproval -->|Reject| CustRejected[Registration Rejected]

    Login --> AuthCheck{Authentication}
    AuthCheck -->|Failed| Login
    AuthCheck -->|Success| RoleCheck{Role Check}

    RoleCheck -->|Admin| AdminDash[Admin Dashboard]
    RoleCheck -->|Customer| CustDash[Customer Dashboard]

    %% Admin Sub-flows
    AdminDash --> UserMgmt[User Approvals]
    AdminDash --> MasterMgmt[Item Master Management]
    AdminDash --> OrderMgmt[Order & Supply Tracking]
    AdminDash --> CRM_Admin[Leads, Deals & Tasks]
    AdminDash --> Reports[Advanced Reporting]
    AdminDash --> AdminCatalog[Product Marketplace]

    MasterMgmt --> Company[Manage Company]
    MasterMgmt --> Primary[Manage Primary Items]
    MasterMgmt --> SubGroup[Manage Sub Groups]
    MasterMgmt --> ItemMaster[Item Master]
    MasterMgmt --> Units[Item Units/Sizes]

    OrderMgmt --> ManageOrders[Manage Orders]
    OrderMgmt --> UploadChallan[Upload Challan Details]
    OrderMgmt --> TrackSupply[Track Supply Details]

    %% Customer Sub-flows
    CustDash --> CustCatalog[Product Marketplace]
    CustDash --> CustOrders[Manage Order]
    CustDash --> CustTrack[Track Supply]
    CustDash --> CRM_Cust[My Leads, Deals & Tasks]

    CustCatalog --> ProductDetail[Product Detail Page]
    ProductDetail --> AddToCart[Add to Cart / Request Quote]
    AddToCart --> PlaceOrder[Manage Order]

    %% Shared Transitions
    PlaceOrder -.-> ManageOrders
    AdminCatalog --> ProductDetail

    %% Navigation
    subgraph "Navigation & Auth"
        Sidebar[Sidebar Navigation]
        ProtectedRoute[Protected Route Guard]
    end

    AdminDash -.-> Sidebar
    CustDash -.-> Sidebar
    Sidebar --> Logout[Logout]
    Logout --> Login

```

## Data Insertion & Transaction Flow

The system ensures data integrity through structured workflows and database transactions.

### 1. Order Creation Transaction
When a customer or admin places an order, the system executes a multi-table transaction to ensure either all data is saved or none of it is (Atomicity).

```mermaid
sequenceDiagram
    participant UI as Frontend UI
    participant API as Express API
    participant DB as MySQL Database

    UI->>API: POST /api/orders {orderData}
    API->>DB: BEGIN TRANSACTION
    
    API->>DB: INSERT INTO orders (orderNo, ...)
    alt Order Insert Success
        loop Each Item
            API->>DB: INSERT INTO order_items (...)
        end
        API->>DB: COMMIT
        DB-->>API: Success
        API-->>UI: 201 Created (Order Confirmed)
    else Order Insert Fail
        API->>DB: ROLLBACK
        DB-->>API: Error
        API-->>UI: 500 Error (Order Failed)
    end
```

### 2. Lead to Deal Conversion
The CRM module uses transactions to convert a lead into a deal, maintaining the link between the two entities.

```mermaid
sequenceDiagram
    participant UI as CRM Dashboard
    participant API as Express API
    participant DB as MySQL Database

    UI->>API: POST /api/leads/:id/convert
    API->>DB: BEGIN TRANSACTION
    
    API->>DB: UPDATE leads SET status = 'Converted'
    API->>DB: INSERT INTO deals (leadId, ...)
    
    API->>DB: COMMIT
    DB-->>API: Success
    API-->>UI: 200 OK (Conversion Success)
```

### 3. User Registration & Approval
Data flow for user onboarding:
- **Phase 1 (Insertion)**: User data is inserted into the `users` table with `status = 'pending'`.
- **Phase 2 (Update)**: Admin reviews the record and performs a `PATCH` request to update `status = 'approved'`.
- **Phase 3 (Activation)**: The login logic checks the `status` field before issuing a JWT token.

## Database Interaction Patterns

| Feature | Pattern | Tables Involved |
| :--- | :--- | :--- |
| **Master Data** | Direct Insert/Update | `companies`, `primary_items`, `products`, `item_units` |
| **Orders** | ACID Transaction | `orders`, `order_items` |
| **CRM** | Linked Transaction | `leads`, `deals` |
| **Logistics** | Batch Processing | `supply_challans`, `supply_details` |
| **Security** | Role-Based Access | `users` |

## Key Components

### 1. Authentication & Security
- **JWT-based Auth**: Secure communication between frontend and backend.
- **Protected Routes**: React component guards that restrict access based on user roles (`admin` vs `customer`).
- **Approval System**: New customers must be approved by an administrator before gaining full access.

### 2. Administrator Module
- **Master Data Management**: Comprehensive controls for defining the organization's product hierarchy (Primary Items -> Sub Groups -> Item Master).
- **Logistics**: Tools for managing challans and tracking supply chains.
- **Reporting**: Data visualization and exports for business analysis.

### 3. Customer Module
- **B2B Marketplace**: A professional catalog for browsing industrial products with full specifications.
- **Order Lifecycle**: Workflow for adding items to cart, managing orders, and tracking deliveries.
- **CRM Integration**: Customers can view and manage their specific leads and tasks.

### 4. Shared Infrastructure
- **Common Components**: Modular UI elements like `Sidebar`, `Layout`, and `PageHeader`.
- **Database (MongoDB)**: Centralized storage for products, users, orders, and CRM data.
- **Express Backend**: RESTful API endpoints for data persistence and business logic.
