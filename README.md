# AI Finance Analysis Dashboard

[![CI](https://github.com/not0aag/AIFinanceAnalysis/actions/workflows/ci.yml/badge.svg)](https://github.com/not0aag/AIFinanceAnalysis/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, AI-powered personal finance management dashboard built with Next.js, featuring intelligent insights, budget tracking, and financial goal management.

## 🚀 Features

- **AI-Powered Insights**: Get personalized financial advice and spending analysis using OpenAI
- **Budget Management**: Create and track budgets with visual analytics
- **Transaction Tracking**: Manage your financial transactions with advanced filtering and search
- **Goal Setting**: Set and monitor financial goals with progress tracking
- **Interactive Dashboard**: Real-time financial health visualization
- **Dark Mode**: Built-in theme switching support
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## 🏗️ Architecture

This application is built with a modern tech stack:

- **Frontend**: Next.js 15 (React 19) with App Router
- **Styling**: Tailwind CSS v4 with custom components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase Auth
- **AI Integration**: OpenAI API for intelligent insights
- **UI Components**: Radix UI primitives for accessibility
- **Charts**: Recharts for data visualization

### Project Structure

```
AIFinanceAnalysis/
├── src/
│   ├── app/           # Next.js App Router pages
│   ├── components/    # React components
│   │   ├── budgets/   # Budget management components
│   │   ├── dashboard/ # Dashboard widgets
│   │   ├── goals/     # Financial goals components
│   │   ├── insights/  # AI insights components
│   │   ├── transactions/ # Transaction management
│   │   └── ui/        # Reusable UI components
│   ├── lib/           # Utility functions and configurations
│   └── types/         # TypeScript type definitions
├── prisma/            # Database schema and migrations
└── public/            # Static assets
```

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: Version 20.x or higher (see `.nvmrc`)
- **npm**: Version 9.x or higher
- **PostgreSQL**: Version 14 or higher
- **Supabase Account**: For authentication
- **OpenAI API Key**: For AI features

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/not0aag/AIFinanceAnalysis.git
   cd AIFinanceAnalysis
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/finance_db"
   
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # OpenAI
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Initialize the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Database Schema

The application uses the following main models:
- **User**: User accounts and authentication
- **Account**: Financial accounts (checking, savings, credit)
- **Transaction**: Financial transactions with categorization
- **Budget**: Budget tracking by category and period
- **Insight**: AI-generated financial insights

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## 🧪 Testing

Testing infrastructure is being developed. The project aims to include:
- Unit tests for core business logic
- Integration tests for API endpoints
- Component tests for React components
- E2E tests for critical user flows

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:
- Code of Conduct
- Development workflow
- Pull request process
- Coding standards

## 🔒 Security

Security is a priority. Please report any security vulnerabilities by following our [Security Policy](SECURITY.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com)
- AI powered by [OpenAI](https://openai.com)
- Database management with [Prisma](https://www.prisma.io/)

## 📞 Support

For questions and support, please open an issue in the [GitHub repository](https://github.com/not0aag/AIFinanceAnalysis/issues).
