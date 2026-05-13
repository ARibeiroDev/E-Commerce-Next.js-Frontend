# ClothingCo Frontend

A modern e-commerce frontend built with **Next.js, TypeScript, Zustand, and a custom API client**, designed to work with a scalable NestJS backend.

This project is part of a full-stack e-commerce system focused on real-world architecture, authentication flows, cart management, and frontend state handling.

---

## Features

### Product Experience

- Product listing with images, variants, and discounts
- Dynamic size and color selection per product
- Stock-aware UI (disabled variants when unavailable)
- Discount calculation and price display logic

### Cart System

- Add / update / remove items
- Backend-synced cart state
- Global state management with Zustand
- Optimistic UI updates

### Authentication

- Register and login integration with backend API
- JWT access token handling
- Automatic refresh token flow
- Protected API requests with retry logic

### API Layer

- Centralized fetch wrapper (`apiFetch`)
- Automatic token injection
- Single-flight refresh token handling (prevents duplicate refresh calls)
- Unified error handling across the app

### UI / UX

- Responsive product cards
- Variant-based product selection
- Instant feedback with toast notifications

---

## Architecture

### Tech Stack

- Next.js
- TypeScript
- Zustand (state management)
- TailwindCSS
- React-Hook-Form

### Key Design Decisions

- Centralized API client instead of scattered fetch calls
- Backend as source of truth for stock validation
- Client-side UX validation (availability hints, disabled options)
- Separation between API layer and state layer

---

## Backend Integration

This frontend is designed to work with the **ClothingCo NestJS API**, which provides:

- JWT authentication (access + refresh tokens)
- Token rotation + token reuse detection
- Product and variant management
- Cart system with stock validation
- Order management with transactional stock reservation

[Backend repository](https://github.com/ARibeiroDev/E-Commerce-NestJs-Prisma-Backend-API) Also actively evolving.

---

## Current Status

This project is actively evolving.

### Implemented

- Product browsing and listing
- Variant selection system
- Authentication flow integration
- Cart system connected to backend

### In Progress

- UI improvements and refactoring
- Image optimization (Cloudinary integration planned)
- Admin Dashboard
- User Profile/Dashboard
- Checkout flow

---

## Live Demo

Coming soon...

---

## Known Limitations

- Images currently served directly from backend (no CDN yet)
- Email service provider needs replacement due to trial api key expiration
- Checkout/payment flow not implemented yet

---

## Author

Built by Alberto Ribeiro
