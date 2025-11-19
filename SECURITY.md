# Security Policy

## Supported Versions

We are currently supporting the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| main    | :white_check_mark: |

## Reporting a Vulnerability

We take the security of AI Finance Analysis Dashboard seriously. If you have discovered a security vulnerability, please report it to us responsibly.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

1. **GitHub Security Advisories** (Preferred)
   - Navigate to the repository's Security tab
   - Click "Report a vulnerability"
   - Fill out the form with details about the vulnerability

2. **Email**
   - Send details to: [INSERT SECURITY CONTACT EMAIL]
   - Include "SECURITY" in the subject line

### What to Include

Please include the following information in your report:

- **Type of vulnerability** (e.g., SQL injection, XSS, authentication bypass)
- **Full paths of source file(s)** related to the vulnerability
- **Location of the affected source code** (tag/branch/commit or direct URL)
- **Step-by-step instructions to reproduce** the issue
- **Proof-of-concept or exploit code** (if possible)
- **Impact of the vulnerability**, including how an attacker might exploit it
- **Any potential solutions** you've identified (optional)

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
- **Communication**: We will keep you informed about our progress throughout the process
- **Validation**: We will validate the vulnerability and determine its severity
- **Fix Timeline**: We aim to release a fix within 30 days for critical vulnerabilities
- **Credit**: With your permission, we will publicly acknowledge your contribution once the fix is released

## Security Best Practices for Contributors

When contributing to this project, please follow these security guidelines:

### Environment Variables

- Never commit `.env.local` or any files containing secrets
- Use environment variables for all sensitive data
- Provide `.env.example` with placeholder values

### Dependencies

- Keep dependencies up to date
- Review security advisories for dependencies
- Use `npm audit` to check for vulnerabilities
- Address high and critical vulnerabilities promptly

### Code Practices

- **Input Validation**: Always validate and sanitize user input
- **Authentication**: Use secure authentication mechanisms (Supabase Auth)
- **Authorization**: Implement proper access controls
- **SQL Injection**: Use Prisma's parameterized queries (avoid raw SQL)
- **XSS Prevention**: Sanitize output and use React's built-in XSS protection
- **CSRF Protection**: Utilize Next.js built-in CSRF protection
- **Secrets Management**: Never hardcode API keys or passwords
- **Error Handling**: Don't expose sensitive information in error messages

### API Security

- Validate all API inputs
- Implement rate limiting
- Use HTTPS in production
- Authenticate all sensitive endpoints
- Implement proper CORS policies

### Database Security

- Use environment variables for database credentials
- Implement proper data access controls with Prisma
- Regularly backup database
- Use encrypted connections

## Known Security Considerations

### OpenAI API

- API keys should be stored securely in environment variables
- Monitor API usage to prevent abuse
- Implement rate limiting for AI features

### Supabase Authentication

- Follow Supabase security best practices
- Use Row Level Security (RLS) policies
- Validate JWTs server-side
- Implement proper session management

### Database

- Ensure DATABASE_URL is never exposed
- Use connection pooling appropriately
- Implement proper data validation at the schema level

## Security Updates

We regularly:

- Monitor security advisories for our dependencies
- Update dependencies to patch known vulnerabilities
- Review and improve security practices
- Conduct security audits

## Disclosure Policy

- We follow coordinated vulnerability disclosure
- We will work with you to understand and resolve the issue
- We will credit security researchers (if desired)
- We will disclose vulnerabilities after fixes are released

## Contact

For any questions about this security policy, please open an issue with the `security` label or contact the maintainers.

## Acknowledgments

We appreciate the security research community and thank those who help keep this project secure.

---

**Last Updated**: November 2025
