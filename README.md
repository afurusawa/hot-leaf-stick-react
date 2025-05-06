# Hot Leaf Stick

A modern web application for cigar enthusiasts to manage their collection, track smoking experiences, and discover new cigars.

## Tech Stack

### Frontend
- React 19 with TypeScript
- Vite for build tooling
- TanStack Router for routing
- TanStack Query for data fetching
- Shadcn and Radix UI for accessible components
- Tailwind CSS for styling
- React Hook Form with Zod for form validation
- DND Kit for drag-and-drop functionality
- Recharts for data visualization

### Backend
- NestJS with Fastify
- TypeORM with PostgreSQL
- JWT Authentication
- Swagger/OpenAPI documentation
- TypeScript

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- pnpm (recommended) or npm

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd hot-leaf-stick-nestjs
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up your environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database credentials and other configuration.

4. Run database migrations:
   ```bash
   pnpm migration:run
   ```

5. Start the development server:
   ```bash
   pnpm start:dev
   ```

The backend API will be available at `http://localhost:4000/api`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd hot-leaf-stick-react
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

The frontend will be available at `http://localhost:5173`

## Development

### Available Scripts

#### Backend
- `pnpm start:dev` - Start development server
- `pnpm build` - Build the application
- `pnpm test` - Run unit tests
- `pnpm test:e2e` - Run end-to-end tests
- `pnpm migration:generate` - Generate new migrations
- `pnpm migration:run` - Run pending migrations

#### Frontend
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## API Documentation

Once the backend server is running, you can access the Swagger documentation at:
`http://localhost:4000/api`

## Features

- User authentication and authorization
- Cigar collection management
- Smoking experience tracking
- Brand and vitola catalog
- Interactive data visualization
- Responsive design
- Dark mode support

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
