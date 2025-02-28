# Financial Tracker

A comprehensive financial management application for tracking income, expenses, debts, and savings with powerful reporting capabilities.

![Financial Tracker Screenshot](https://via.placeholder.com/800x450)

## Features

- **Dashboard**: Get a quick overview of your financial status
- **Income Tracking**: Record and categorize all your income sources
- **Expense Management**: Track expenses by category
- **Debt Management**: Monitor and plan repayment of loans and debts
- **Savings Goals**: Set and track progress toward financial goals
- **Financial Reports**: Generate visual reports of your financial data
- **Multi-Currency Support**: Track finances in any currency, including Rwandan Francs
- **User Management**: Create and manage user accounts (admin only)
- **Mobile Responsive**: Works seamlessly on desktop and mobile devices

## Tech Stack

- React.js (Frontend)
- Supabase (Backend and Database)
- Tailwind CSS (Styling)
- Recharts (Data Visualization)
- React Router (Navigation)

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/financial-tracker.git
cd financial-tracker
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database tables by running the SQL scripts in the `sql` directory:
- Run the scripts in Supabase SQL Editor in the order specified in the filenames

5. Start the development server:
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

## Deployment

### Build for Production

```bash
npm run build
# or 
yarn build
```

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

## Documentation

- [Use Cases](./docs/USE_CASES.md)
- [Test Cases](./docs/TEST_CASES.md)
- [User Training](./docs/USER_TRAINING.md)
- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)

## Security Features

- Secure password hashing with bcrypt
- Auto-logout after 5 minutes of inactivity
- Row-level security in database
- Complete account deletion on request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons by [Lucide Icons](https://lucide.dev/)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com/)
