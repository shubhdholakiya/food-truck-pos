# FoodTruck POS Application

## Overview

This is a web-based Point-of-Sale (POS) application specifically designed for food trucks and micro-restaurants. The application provides a comprehensive solution for managing sales, inventory, menu items, customers, and analytics in a cross-platform environment.

## Recent Changes (January 30, 2025)

✓ **Customer-Facing Interface Implementation**
- Created three customer interface options:
  1. Simple menu display (/qr-menu) - View-only menu for counter ordering
  2. Full customer ordering system (/order) - Complete self-service with cart and checkout
  3. QR code generator (/qr-generator) - Admin tool to create QR codes for both options

✓ **Dual Payment Integration**
- Cash at counter option - orders marked for staff payment processing
- Online card payment integration (Stripe ready)
- Clear payment method selection in checkout flow

✓ **Real-time Order Synchronization** 
- Customer orders instantly appear in admin dashboard
- Unified order management between customer and staff interfaces
- Order status tracking across both systems

✓ **Public API Endpoints**
- Made categories and menu items endpoints public for customer access
- Maintains authentication for admin operations
- Sample menu data populated (8 items across 4 categories)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: React Context and TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript for type safety
- **API Style**: RESTful API endpoints
- **Authentication**: Replit Auth integration with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage

### Database Architecture
- **Primary Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Shared schema definitions between client and server

## Key Components

### Authentication System
- Replit Auth integration for user authentication
- JWT-based authentication with role-based access control (cashier, manager, admin)
- Session storage in PostgreSQL for persistence
- Protected routes with authentication middleware

### Core Business Entities
- **Users**: Role-based user management with profile information
- **Categories**: Menu item categorization system
- **Menu Items**: Product catalog with pricing and descriptions
- **Customers**: Customer directory and management
- **Orders**: Order processing with items and payment tracking
- **Inventory**: Stock management and tracking

### User Interface Components
- **Dashboard**: Main overview with metrics, recent orders, and quick actions
- **Sales/POS**: Point-of-sale interface with cart management
- **Menu Management**: CRUD operations for menu items and categories
- **Inventory Management**: Stock tracking and management
- **Customer Management**: Customer directory and profiles
- **Reports**: Analytics and business insights

## Data Flow

### Order Processing Flow
1. User creates new order through POS interface
2. Menu items are selected and added to cart
3. Order totals calculated (subtotal, tax, total)
4. Payment processing and order completion
5. Order stored in database with associated items
6. Real-time updates to dashboard and reports

### Authentication Flow
1. User initiates login through Replit Auth
2. OpenID Connect authentication flow
3. User session created and stored in PostgreSQL
4. JWT token issued for API access
5. Role-based route protection enforced

### Data Synchronization
- TanStack Query for efficient data fetching and caching
- Optimistic updates for better user experience
- Error handling with automatic retry mechanisms
- Real-time data updates through query invalidation

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/**: Unstyled UI primitives
- **tailwindcss**: Utility-first CSS framework
- **react-hook-form**: Form management
- **zod**: Runtime type validation

### Development Dependencies
- **vite**: Fast development server and build tool
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production

### Payment Integration
- **@stripe/stripe-js** and **@stripe/react-stripe-js**: Payment processing capabilities

## Deployment Strategy

### Development Environment
- Vite development server with hot module replacement
- TypeScript compilation with strict type checking
- Environment-specific configuration through environment variables

### Production Build
- Vite production build for frontend assets
- esbuild bundling for Node.js server
- Static asset serving through Express
- Database migrations through Drizzle Kit

### Database Management
- PostgreSQL database with Neon serverless hosting
- Schema management through Drizzle migrations
- Environment-based database URL configuration
- Session storage table for authentication persistence

### Configuration
- Environment variables for database connection, authentication secrets, and external service APIs
- TypeScript path mapping for clean imports
- PostCSS configuration for Tailwind CSS processing
- Component library configuration through shadcn/ui