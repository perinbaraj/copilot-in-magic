# 🪄 Copilot Starter Kit

A CLI tool that automatically scaffolds GitHub Copilot infrastructure in your repositories.

## Features

✅ **Automatic Detection** - Identifies missing Copilot components  
✅ **Smart Scaffolding** - Auto-generates required files and directories  
✅ **Project Type Detection** - Supports Node.js, Python, Go, Java  
✅ **Safe Operations** - Never overwrites existing files  
✅ **Comprehensive Validation** - Ensures Copilot compatibility  
✅ **Well-Tested** - 20+ passing tests  

## Quick Start

### Installation

```bash
npm install -g copilot-starter-kit
```

Or use directly with `npx`:

```bash
npx copilot-starter-kit analyze .
npx copilot-starter-kit scaffold .
```

### Usage

#### 1. Analyze Your Repository

```bash
copilot-starter-kit analyze /path/to/repo
```

This will show you what's missing:

```
🪄 Repository Analysis

📍 Analyzing: /path/to/repo

📁 Missing Directories:
  - .copilot
  - agents
  - skills

📄 Missing Files:
  - copilot-setup-steps.yml
  - .copilot/copilot.yml
  - .env.example

📊 Analysis Summary:
  Project Type: node
  Missing Components: 6
  Status: Not Ready
```

#### 2. Scaffold Missing Components

```bash
copilot-starter-kit scaffold /path/to/repo
```

This will auto-generate:

```
🪄 Repository Scaffolding

📁 Created Directories:
  ✓ .copilot
  ✓ agents
  ✓ skills

📄 Created Files:
  ✓ copilot-setup-steps.yml
  ✓ .copilot/copilot.yml
  ✓ .copilot/custom-instructions.md
  ✓ COPILOT_SETUP.md
  ✓ .env.example

✓ Your repository is now ready for GitHub Copilot!
```

#### 3. Verify Setup

```bash
copilot-starter-kit analyze /path/to/repo
```

Should now show: `Status: Ready`

## What Gets Generated

### Directories
- `.copilot/` - Copilot configuration
- `agents/` - Custom agent implementations
- `skills/` - Custom skill implementations

### Files
- `copilot-setup-steps.yml` - Agent and skill registration
- `.copilot/copilot.yml` - Copilot configuration
- `.copilot/custom-instructions.md` - Custom instructions
- `COPILOT_SETUP.md` - Setup guide
- `.env.example` - Environment template

### Example Content

**copilot-setup-steps.yml:**
```yaml
version: 1

agents:
  - name: my-agent
    description: Example custom agent
    instructions: .copilot/custom-instructions.md
    skills:
      - my-skill

skills:
  - name: my-skill
    description: Example custom skill
    enabled: true
```

## Commands

### analyze [repo]

Analyze repository for missing Copilot components.

```bash
copilot-starter-kit analyze [repo]
```

**Options:**
- `repo` - Path to repository (default: current directory)

**Output:**
- Missing directories
- Missing files
- Project type detection
- Readiness status

### scaffold [repo]

Generate missing Copilot components.

```bash
copilot-starter-kit scaffold [repo]
```

**Options:**
- `repo` - Path to repository (default: current directory)

**Features:**
- Creates directories automatically
- Generates configuration files
- Skips existing files (safe)
- Creates `.gitkeep` for empty dirs

## Examples

### Current Directory
```bash
copilot-starter-kit analyze
copilot-starter-kit scaffold
```

### Specific Path
```bash
copilot-starter-kit analyze ~/my-project
copilot-starter-kit scaffold ~/my-project
```

### Multiple Repositories
```bash
copilot-starter-kit scaffold ~/project1
copilot-starter-kit scaffold ~/project2
copilot-starter-kit scaffold ~/project3
```

## Supported Project Types

- **Node.js** - `package.json`, `node_modules`
- **Python** - `requirements.txt`, `setup.py`, `pyproject.toml`, `Pipfile`
- **Go** - `go.mod`, `go.sum`
- **Java** - `pom.xml`, `build.gradle`

## Safety

This tool is designed to be **safe and non-destructive**:

- ✅ Never overwrites existing files
- ✅ Idempotent - running multiple times is safe
- ✅ Creates directories with proper structure
- ✅ Validates generated configuration

## Testing

Run tests:

```bash
npm test
```

Test coverage:
- 20+ comprehensive tests
- Unit tests for each module
- Integration tests for workflows
- Temporary directory isolation

## Documentation

- [Architecture Guide](docs/ARCHITECTURE.md) - System design and extension points
- [Contributing Guide](docs/CONTRIBUTING.md) - How to contribute

## Requirements

- Node.js >= 14.0.0
- npm >= 6.0.0

## Dependencies

- `yargs` - CLI argument parsing
- `chalk` - Colored terminal output
- `js-yaml` - YAML parsing and validation

## License

ISC License

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

## Support

- 📖 [Documentation](docs/)
- 🐛 [Report Issues](https://github.com/issues)
- 💬 [Discussions](https://github.com/discussions)

## Roadmap

- [ ] Interactive setup wizard option
- [ ] Project type-specific templates
- [ ] Git integration (auto-commit)
- [ ] Custom template support
- [ ] Configuration validation before generation
- [ ] Backup creation before modifications

---

**Made with ❤️ for GitHub Copilot developers**
