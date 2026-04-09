// Configuration and defaults for copilot-starter-kit

const REQUIRED_COMPONENTS = {
  directories: [
    '.copilot',
    'agents',
    'skills',
  ],
  files: [
    'copilot-setup-steps.yml',
    '.copilot/copilot.yml',
    '.env.example',
  ],
  optionalFiles: [
    'COPILOT_SETUP.md',
    '.copilot/custom-instructions.md',
  ],
};

const PROJECT_TYPES = {
  NODE: 'node',
  PYTHON: 'python',
  GO: 'go',
  JAVA: 'java',
  UNKNOWN: 'unknown',
};

const DETECTION_PATTERNS = {
  [PROJECT_TYPES.NODE]: {
    indicators: ['package.json', 'node_modules'],
    weight: 10,
  },
  [PROJECT_TYPES.PYTHON]: {
    indicators: ['requirements.txt', 'setup.py', 'pyproject.toml', 'Pipfile'],
    weight: 10,
  },
  [PROJECT_TYPES.GO]: {
    indicators: ['go.mod', 'go.sum'],
    weight: 10,
  },
  [PROJECT_TYPES.JAVA]: {
    indicators: ['pom.xml', 'build.gradle'],
    weight: 10,
  },
};

module.exports = {
  REQUIRED_COMPONENTS,
  PROJECT_TYPES,
  DETECTION_PATTERNS,
};
