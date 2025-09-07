# Contributing to AyurSutra

Thank you for your interest in contributing to AyurSutra! We welcome contributions from the community and are grateful for your support in making this project better.

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md). Please read it before contributing.

## 🚀 Getting Started

### Prerequisites

- Node.js (>= 16.0.0)
- npm (>= 8.0.0)
- Git
- PostgreSQL (>= 13)
- Redis (>= 6.0)

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ayursutra.git
   cd ayursutra
   ```

2. **Install Dependencies**
   ```bash
   npm run install-deps
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Update .env with your local configuration
   ```

4. **Database Setup**
   ```bash
   cd backend
   npm run migrate
   npm run seed
   cd ..
   ```

5. **Start Development**
   ```bash
   npm run dev
   ```

## 📝 How to Contribute

### Reporting Issues

Before creating an issue, please:
1. Check existing issues to avoid duplicates
2. Use the issue templates provided
3. Include as much detail as possible
4. Add relevant labels

### Suggesting Features

We welcome feature suggestions! Please:
1. Use the feature request template
2. Explain the use case and benefits
3. Consider implementation complexity
4. Discuss with maintainers first for major features

### Code Contributions

#### Branch Naming Convention
- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Critical fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

#### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(auth): add JWT refresh token functionality
fix(scheduler): resolve appointment overlap issue
docs(api): update authentication endpoints
```

#### Pull Request Process

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Follow coding standards
   - Add tests for new functionality
   - Update documentation as needed

3. **Test Your Changes**
   ```bash
   npm test
   npm run lint
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat(scope): your descriptive message"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a pull request on GitHub.

#### PR Requirements

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] No merge conflicts
- [ ] Descriptive PR title and description
- [ ] Linked to relevant issues

## 🏗️ Development Guidelines

### Frontend (React)

#### File Structure
```
src/
├── components/          # Reusable components
│   ├── common/         # Shared components
│   ├── patient/        # Patient-specific components
│   └── practitioner/   # Practitioner-specific components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API services
├── context/            # React context providers
├── utils/              # Utility functions
└── styles/             # Global styles
```

#### Component Guidelines
- Use functional components with hooks
- Follow naming conventions (PascalCase for components)
- Keep components small and focused
- Use TypeScript for type safety (when applicable)
- Write comprehensive PropTypes or TypeScript interfaces

#### State Management
- Use React Context for global state
- Custom hooks for component logic
- Avoid prop drilling

#### Styling
- Use Tailwind CSS classes
- Follow responsive design principles
- Maintain consistent spacing and colors
- Use semantic HTML elements

### Backend (Node.js/Express)

#### File Structure
```
backend/
├── controllers/        # Route handlers
├── models/            # Database models
├── services/          # Business logic
├── middleware/        # Express middleware
├── routes/            # API routes
├── utils/             # Utility functions
├── config/            # Configuration files
└── tests/             # Test files
```

#### API Guidelines
- Follow RESTful conventions
- Use proper HTTP status codes
- Implement comprehensive error handling
- Add input validation
- Document all endpoints
- Use async/await for asynchronous operations

#### Database
- Use Sequelize ORM
- Write migrations for schema changes
- Add proper indexes
- Follow naming conventions
- Use transactions for complex operations

#### Security
- Validate all inputs
- Use parameterized queries
- Implement rate limiting
- Add proper authentication/authorization
- Log security events

### Testing

#### Frontend Testing
```bash
cd frontend
npm test                # Run tests
npm test -- --coverage # Run with coverage
```

#### Backend Testing
```bash
cd backend
npm test                # Run tests
npm run test:watch     # Watch mode
```

#### Test Guidelines
- Write unit tests for utilities and services
- Integration tests for API endpoints
- Component tests for React components
- Maintain >80% code coverage
- Use descriptive test names
- Mock external dependencies

### Code Quality

#### Linting
```bash
npm run lint           # Check linting
npm run lint:fix       # Auto-fix issues
```

#### Code Style
- Use ESLint configuration
- Follow Prettier formatting
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for functions
- Document complex algorithms
- Include usage examples
- Keep README files updated

### API Documentation
- Document all endpoints
- Include request/response examples
- Specify authentication requirements
- Document error responses

## 🧪 Testing Strategy

### Test Types
1. **Unit Tests**: Individual functions/components
2. **Integration Tests**: API endpoints and database interactions
3. **E2E Tests**: Full user workflows
4. **Performance Tests**: Load and stress testing

### Test Coverage
- Maintain minimum 80% coverage
- Focus on critical business logic
- Test error scenarios
- Mock external services

## 🚀 Release Process

### Versioning
We follow [Semantic Versioning](https://semver.org/):
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes (backward compatible)

### Release Checklist
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Version bumped
- [ ] Changelog updated
- [ ] Security review completed
- [ ] Performance testing done

## 🎯 Project Priorities

### High Priority
- Patient safety and data security
- Treatment outcome accuracy
- System reliability and uptime
- User experience optimization

### Medium Priority
- Performance improvements
- New feature development
- Integration capabilities
- Mobile responsiveness

### Low Priority
- UI/UX enhancements
- Code refactoring
- Documentation improvements
- Developer experience

## 💡 Development Tips

### Performance
- Optimize database queries
- Use caching strategically
- Minimize bundle sizes
- Implement lazy loading

### Security
- Never commit secrets
- Use environment variables
- Implement proper validation
- Follow OWASP guidelines

### Debugging
- Use proper logging
- Add meaningful error messages
- Use debugging tools
- Test edge cases

## 📞 Getting Help

### Communication Channels
- **Discord**: [AyurSutra Community](https://discord.gg/ayursutra)
- **Email**: developers@ayursutra.com
- **GitHub Discussions**: For technical discussions
- **Issues**: For bug reports and feature requests

### Mentorship
New contributors can request mentorship from experienced team members. Contact us through Discord or email.

## 🏆 Recognition

We appreciate all contributions! Contributors will be:
- Listed in our README
- Mentioned in release notes
- Invited to contributor events
- Eligible for swag and rewards

## 📋 Checklist for New Contributors

- [ ] Read and understand the Code of Conduct
- [ ] Set up development environment
- [ ] Join our Discord community
- [ ] Look for "good first issue" labels
- [ ] Ask questions when needed
- [ ] Follow the contribution guidelines

Thank you for contributing to AyurSutra! Together, we're building better healthcare technology for the Ayurvedic community.

---

*This document is a living guide and will be updated as the project evolves. Please check back regularly for updates.*
