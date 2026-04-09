# Architecture & Design

## Overview

The **copilot-starter-kit** is a CLI tool designed to automatically scaffold GitHub Copilot infrastructure in existing repositories. It follows a modular architecture with clear separation of concerns.

## Core Modules

### 1. **RepositoryAnalyzer** (`src/analyzer.js`)
Detects missing Copilot components and generates analysis reports.

**Responsibilities:**
- Scan repository for missing directories and files
- Detect project type (Node.js, Python, Go, Java, Unknown)
- Generate gap reports showing what's missing
- Provide readiness status for Copilot integration

### 2. **TemplateEngine** (`src/templates.js`)
Generates template content for Copilot configuration files.

**Responsibilities:**
- Generate YAML configuration templates
- Generate custom agent examples
- Generate custom skill examples

### 3. **RepositoryScaffolder** (`src/scaffolder.js`)
Creates missing components in repositories.

**Responsibilities:**
- Generate missing directories
- Create configuration files from templates
- Skip existing files (safe operation)
- Track generated files

### 4. **Validators** (`src/validators.js`)
Validates Copilot configuration files and structure.

**Responsibilities:**
- Validate YAML syntax
- Verify directory structure
- Check required files exist

### 5. **CLI** (`src/cli.js`)
Command-line interface for user interaction.

**Commands:**
- `analyze [repo]` - Analyze repository gaps
- `scaffold [repo]` - Generate missing components

## Key Design Decisions

### 1. **Modular Architecture**
Each module handles one responsibility for easy testing and extension.

### 2. **Safe Operations**
- Idempotent: Running multiple times is safe
- Non-destructive: Existing files are never overwritten
- Atomic: Either complete or fail cleanly

### 3. **Template-based Generation**
- Uses JavaScript template literals
- Generates human-readable YAML/Markdown
- Includes helpful comments

### 4. **Project Type Detection**
- Automatic detection of project type
- Weights multiple indicators
- Falls back to "unknown" if unclear

## Testing Strategy

### Unit Tests
- Test each module independently
- Use temporary directories for I/O tests

### Integration Tests
- Test complete workflows
- Verify analyze → scaffold → validate flow
- Test idempotency

### Test Coverage
- RepositoryAnalyzer: 9 tests
- RepositoryScaffolder: 9 tests
- Integration: 5 tests
- Total: 20+ tests passing

## Extension Points

### Adding New Component Types
1. Update `REQUIRED_COMPONENTS` in `config.js`
2. Add template method in `TemplateEngine`
3. Update `createFile()` in `Scaffolder`
4. Add tests

### Adding New Project Types
1. Add to `PROJECT_TYPES` in `config.js`
2. Add pattern to `DETECTION_PATTERNS`
3. Test detection logic

### Adding New Validators
1. Add validation method to `Validators`
2. Call from `validateRepository()`
3. Add tests
