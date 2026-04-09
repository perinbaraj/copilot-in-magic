# Contributing Guide

## Welcome! 👋

Thank you for considering contributing to **copilot-starter-kit**.

## How to Contribute

### Reporting Bugs
Before creating a bug report, please check if the issue has already been reported. Include:
- Steps to reproduce
- Expected vs actual behavior
- Your environment (OS, Node.js version, etc.)

### Suggesting Enhancements
Include:
- Clear description of the enhancement
- Step-by-step examples
- Specific use cases
- Pros and cons

### Pull Requests
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes following the style guide
4. Add tests for new functionality
5. Ensure all tests pass: `npm test`
6. Commit with clear messages
7. Push and open a Pull Request

## Development Setup

### Prerequisites
- Node.js >= 14.0.0
- npm >= 6.0.0
- Git

### Installation
```bash
git clone https://github.com/yourusername/copilot-starter-kit.git
cd copilot-starter-kit
npm install
```

### Running Tests
```bash
npm test
```

### Running the CLI
```bash
node src/cli.js analyze .
node src/cli.js scaffold .
```

## Style Guide

### Code Style
- Indentation: 2 spaces
- Semicolons: Always use
- Quotes: Single quotes
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE

### Comments
- Comment non-obvious code
- Use JSDoc for functions
- Keep comments up-to-date

## Testing Guidelines

- Use Jest for testing
- Place test files in `tests/` directory
- Name test files: `{module}.test.js`
- Aim for 80%+ coverage

## Commit Messages

Follow conventional commits:
```
type(scope): subject

body

footer
```

**Types:** feat, fix, docs, style, refactor, test, chore

## License

By contributing, you agree your contributions will be licensed under ISC License.

Thank you for contributing! 🎉
