# Nestar — Backend

> A multi-role real estate platform backend for listing, browsing, and managing property rentals and sales.

## Overview

Nestar is a NestJS + GraphQL backend powering a real estate listing platform. It serves three roles — Member, Agent, and Admin — through a single GraphQL API, letting members search and inquire about properties while agents manage their own listings and admins oversee the platform.

## Key Features

### Member
- Search and browse property listings (by type, location, price)
- View property details
- Like and follow properties / agents
- Write comments
- Receive notifications
- Community board (posts, categories)
- Profile management

### Agent
- Create and update property listings
- Manage listing status (active / inactive / paused / sold / deleted)
- View property performance (views, likes)
- Respond to member inquiries

### Admin
- Member management
- Agent management
- Property moderation
- Community post management
- Notification management

## Tech Stack

**Core:** NestJS, TypeScript, GraphQL, Apollo Server, MongoDB, Mongoose

**Auth & Security:** JWT authentication, bcrypt

**File handling:** Multer (image uploads)

## Data Model

A property listing includes: type, status (`ACTIVE` / `INACTIVE` / `PAUSE` / `DELETE`), location, address, title, price, and square footage, along with lifecycle timestamps for when it was sold, deleted, or constructed.

## Database

members, properties, boardArticles, comments, likes, follows, views, notifications, notices, faqs, inquiries

## API Architecture

- GraphQL as the primary API for all business logic (queries, mutations)
- Role-scoped resolvers and guards separating Member / Agent / Admin access

## Architecture Patterns

- MVC (Mongoose schemas / NestJS controllers-resolvers / service layer)
- Dependency Injection (NestJS's built-in IoC container)
- Middleware (cross-cutting request handling)
- Guards (role- and auth-based route protection)
- Decorators (NestJS metadata-driven resolvers, guards, and DTOs)

## Development Workflow

- Git
- GitHub
- master / develop branches

## Project Highlights

- Multi-role SaaS architecture (Member / Agent / Admin) on a single schema
- GraphQL-first API design
- Listing lifecycle management (active, paused, sold, deleted) beyond simple CRUD
- Modular, decorator-driven NestJS architecture
