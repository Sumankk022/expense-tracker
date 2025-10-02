# Expense Tracker

A modern single-user expense tracking web application with PostgreSQL backend and React frontend, designed to match the UI/UX of modern mobile expense tracking apps.

## Features

- 📊 Dashboard with spending summary and recent transactions
- 💰 CRUD operations for expenses and categories
- 📈 Category-wise spending analysis with interactive charts (Pie & Bar)
- 🎨 Dark theme UI matching modern mobile app design
- 📱 Responsive design for desktop and mobile
- 🔍 Advanced filtering and date range selection
- 📊 Real-time analytics and spending insights

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Recharts, React Router
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: SQLite
- **Development**: SQLite database (no Docker required)

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup Instructions

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd expense-tracker
   npm run setup
   ```

2. **Setup database**:
   ```bash
   cd backend
   npx prisma db push
   npx prisma db seed
   ```

3. **Start development servers**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## Project Structure

```
expense-tracker/
├── backend/                    # Express API server
│   ├── prisma/               # Database schema and migrations
│   │   ├── schema.prisma     # Prisma schema
│   │   └── seed.js          # Database seeding
│   ├── src/                  # API routes and middleware
│   │   ├── routes/          # API route handlers
│   │   └── server.js        # Express server setup
│   └── package.json
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context for state management
│   │   ├── services/       # API service layer
│   │   └── App.jsx         # Main app component
│   └── package.json
├── docker-compose.yml        # PostgreSQL container
└── README.md
```

## API Endpoints

### Expenses
- `GET /api/expenses` - Get all expenses (with pagination and filtering)
- `GET /api/expenses/:id` - Get single expense
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category with expenses
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Analytics
- `GET /api/analytics/spending` - Get category-wise spending data
- `GET /api/analytics/summary` - Get dashboard summary data

## Database Schema

### Categories
- `id` (Primary Key, CUID)
- `name` (String, Unique)
- `icon` (String, Emoji)
- `color` (String, Hex Color)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Expenses
- `id` (Primary Key, CUID)
- `title` (String)
- `amount` (Decimal, 10,2)
- `date` (DateTime)
- `categoryId` (Foreign Key)
- `notes` (String, Optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

## Usage Examples

### Creating an Expense
```bash
curl -X POST http://localhost:3001/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Coffee",
    "amount": 4.50,
    "date": "2024-02-08T10:30:00Z",
    "categoryId": "category_id_here",
    "notes": "Morning coffee"
  }'
```

### Creating a Category
```bash
curl -X POST http://localhost:3001/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Food & Dining",
    "icon": "🍕",
    "color": "#FF6B6B"
  }'
```

### Getting Analytics
```bash
curl "http://localhost:3001/api/analytics/spending?startDate=2024-02-01&endDate=2024-02-29"
```

## Development

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start only frontend
- `npm run dev:backend` - Start only backend
- `npm run build` - Build frontend for production
- `npm run setup` - Install all dependencies

### Database Management

- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Run database migrations
- `npx prisma db seed` - Seed database with sample data
- `npx prisma generate` - Generate Prisma client

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
