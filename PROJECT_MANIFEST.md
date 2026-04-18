# Project Manifest: Source of Truth

This document serves as the authoritative guide for module logic, routing, and design standards in the `mia-frontend` project. Use this for onboarding and ensuring architectural consistency.

## 1. Module Overview

| Module | Responsibility | Primary Views | Primary Store |
| :--- | :--- | :--- | :--- |
| **Auth** | User identity, OTP, Registration | `SignInPage`, `SignUpPage`, `OtpVerifyPage` | `auth.store` |
| **Store** | Kiosk ordering, Product management, Staff Flow | `OrderPage`, `ProductsPage`, `OrdersManagementPage` | `order.store`, `product.store` |
| **Subscription** | Plan management, Billing | `PricingPage`, `MomoPaymentPage` | `subscription.store` |
| **Settings** | Configuration for users and stores | `SettingsPage` | `settings.store` |
| **Core** | Shared components, Layouts, Errors | `NotFoundPage`, `MainLayout` | `theme.store` |

## 2. Universal Routing Map

All routing is defined using the `RouteName` enum in `src/router/types.ts`.

| ID | URL Path | Description | Access Level |
| :--- | :--- | :--- | :--- |
| `Home` | `/` | Marketing Landing page | Public |
| `Dashboard` | `/dashboard` | Main manager entry point | Private |
| `StoreOrder` | `/store/order` | **Customer Kiosk** (Self-service ordering) | Private |
| `StoreOrdersManagement` | `/store/orders` | **Staff Dashboard** (Serving orders) | Private |
| `Pricing` | `/pricing` | Choose or upgrade plans | Public |
| `NotFound` | Catch-all | Default 404 page | Public |

## 3. Atomic Design Guidelines
- **Zero v-component Rule**: Site modules MUST NOT import Vuetify components directly (e.g., `v-btn`, `v-card`).
- **Atom Wrapper**: All UI elements must be wrapped in `src/components/atoms`.
- **Styling**: Use Atomic props (color, variant) for base styles and Tailwind for spacing/layout.

## 4. Feature Logic: Table-Based Ordering
- **Flow**: Customer selects items -> Enters Table Number (Modal) -> Order synced to backend.
- **Serving**: Staff monitors `/store/orders-management`.
- **Status lifecycle**: `pending` (new) -> `completed` (served) or `cancelled`.

---
*Last Updated: 2026-04-18 — AI Architect*
