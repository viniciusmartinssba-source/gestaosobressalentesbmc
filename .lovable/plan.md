# Security and Database Audit & Implementation Plan

Deep technical audit and implementation of a secure, production-ready backend for the Spare Parts Management system.

## Proposed Changes

### 1. Database Schema Implementation
- Create `profiles` table to store technician details (Name, Registration Number).
- Create `parques` table to manage wind park configurations and turbines.
- Create `pecas` table for the SAP catalog (SAP code, description).
- Create `movimentacoes` table to persist part withdrawal history.
- Implement `user_roles` and `has_role` function for secure access control.

### 2. Security & Access Control (RLS)
- Enable Row Level Security (RLS) on all tables.
- Implement fine-grained policies:
  - Technicians: Can read catalog, parks, and view/insert their own movements.
  - Public: No access.
  - Service Role: Full access for administrative/backend tasks.
- Securely link authenticated users to their profiles using `auth.uid()`.

### 3. Frontend Integration
- Refactor `src/lib/auth.tsx` to use real authentication.
- Update `src/lib/data.functions.ts` to fetch real-time data from the database.
- Transition `src/routes/index.tsx` from mock state to persistent database state.
- Ensure proper error handling and loading states for database interactions.

### 4. Data Migration
- Seed the database with the initial technician list, wind park structures, and SAP catalog derived from the project requirements.

## Technical Details
- **Tables**: `profiles`, `parques`, `pecas`, `movimentacoes`, `user_roles`.
- **Auth**: Transition from `localStorage` mock to managed authentication.
- **Security**: PostgreSQL RLS policies + `security definer` functions.
- **Framework**: TanStack Start with Supabase client integration.
