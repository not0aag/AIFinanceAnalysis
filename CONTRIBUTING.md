# Contributing to AI Finance Analysis Dashboard

First off, thank you for considering contributing to AI Finance Analysis Dashboard! It's people like you that make this project better for everyone.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (code snippets, screenshots, etc.)
- **Describe the behavior you observed and what you expected to see**
- **Include your environment details** (OS, Node.js version, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any alternative solutions you've considered**

### Pull Requests

1. **Fork the repository** and create your branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Set up your development environment**
   ```bash
   npm install
   cp .env.example .env.local  # Configure your environment variables
   npx prisma migrate dev
   ```

3. **Make your changes**
   - Write clear, commented code
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation as needed

4. **Test your changes**
   ```bash
   npm run lint          # Check code style
   npm run type-check    # Verify TypeScript types
   npm run build         # Ensure it builds successfully
   npm test              # Run tests (when available)
   ```

5. **Commit your changes**
   - Use clear and meaningful commit messages
   - Follow conventional commits format:
     ```
     feat: add new budget visualization
     fix: resolve transaction sorting issue
     docs: update setup instructions
     style: format code with prettier
     refactor: simplify budget calculation logic
     test: add tests for transaction filtering
     chore: update dependencies
     ```

6. **Push to your fork and submit a pull request**

7. **Wait for review**
   - Address any feedback from maintainers
   - Keep your branch up to date with main
   - Be patient and responsive

## Development Workflow

### Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Initialize database
npx prisma migrate dev
npx prisma generate

# Start development server
npm run dev
```

### Code Style

- We use **ESLint** for code linting
- We use **Prettier** for code formatting
- Follow **TypeScript** best practices
- Write meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### TypeScript Guidelines

- Avoid using `any` type - use proper types or `unknown`
- Define interfaces for component props
- Use type inference where appropriate
- Leverage utility types when needed

### Component Guidelines

- Use functional components with hooks
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use proper prop types with TypeScript interfaces
- Follow the existing component structure

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation only changes
- `style:` - Code style changes (formatting, missing semicolons, etc.)
- `refactor:` - Code changes that neither fix a bug nor add a feature
- `perf:` - Performance improvements
- `test:` - Adding or correcting tests
- `chore:` - Changes to build process or auxiliary tools

### Testing Guidelines

When tests are implemented:

- Write tests for new features
- Update tests when modifying existing code
- Ensure all tests pass before submitting PR
- Aim for meaningful test coverage
- Write clear test descriptions

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── budgets/      # Budget-related components
│   ├── dashboard/    # Dashboard components
│   ├── goals/        # Financial goals components
│   ├── insights/     # AI insights components
│   ├── transactions/ # Transaction management
│   └── ui/           # Reusable UI components
├── lib/              # Utility functions
└── types/            # TypeScript type definitions
```

## Important Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives/overview/introduction)

## Questions?

Feel free to open an issue with the "question" label if you have any questions about contributing!

## Recognition

Contributors will be recognized in our release notes and README (coming soon).

Thank you for contributing! 🎉
