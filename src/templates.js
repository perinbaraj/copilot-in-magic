// Template engine for generating Copilot configuration files

class TemplateEngine {
  // Generate copilot-setup-steps.yml
  static generateCopilotSetupSteps() {
    return `# GitHub Copilot Cloud Agent Setup
# This file configures your custom Copilot agents and skills

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
`;
  }

  // Generate .copilot/copilot.yml
  static generateCopilotConfig() {
    return `# Copilot Configuration
# Configuration for GitHub Copilot CLI and Cloud Agents

version: 1

# Customize Copilot behavior
customization:
  theme: auto
  logLevel: info

# Define custom instructions
instructions:
  systemPrompt: |
    You are a helpful AI assistant integrated with this project.
    Use the available skills to help developers with their tasks.

# Workspace settings
workspace:
  maxTokens: 4000
  temperature: 0.7
`;
  }

  // Generate .copilot/custom-instructions.md
  static generateCustomInstructions() {
    return `# Custom Instructions for Copilot

## Context
You are assisting developers working on this project.

## Guidelines
- Always follow the project's coding standards
- Reference relevant documentation when helpful
- Ask for clarification if requirements are unclear

## Available Skills
- my-skill: A custom skill you can use

## Examples
Include examples of how Copilot should assist in this project.
`;
  }

  // Generate example custom agent
  static generateCustomAgent(agentName = 'my-agent') {
    return `// Custom Agent: ${agentName}
// This agent provides specialized capabilities for your project

class ${this.toPascalCase(agentName)}Agent {
  constructor() {
    this.name = '${agentName}';
    this.version = '1.0.0';
    this.capabilities = [];
  }

  /**
   * Main handler for agent requests
   * @param {string} input - User input
   * @param {object} context - Execution context
   * @returns {Promise<string>} Agent response
   */
  async handle(input, context) {
    try {
      // Implement your agent logic here
      const response = this.process(input);
      return response;
    } catch (error) {
      return \`Error: \${error.message}\`;
    }
  }

  /**
   * Process input and generate response
   * @param {string} input - User input
   * @returns {string} Processed response
   */
  process(input) {
    // TODO: Implement your agent logic
    return \`${agentName} received: \${input}\`;
  }
}

module.exports = ${this.toPascalCase(agentName)}Agent;
`;
  }

  // Generate example custom skill
  static generateCustomSkill(skillName = 'my-skill') {
    return `// Custom Skill: ${skillName}
// This skill extends Copilot's capabilities

class ${this.toPascalCase(skillName)}Skill {
  constructor() {
    this.name = '${skillName}';
    this.version = '1.0.0';
  }

  /**
   * Execute the skill
   * @param {object} input - Skill input parameters
   * @returns {Promise<object>} Skill output
   */
  async execute(input) {
    try {
      const result = await this.process(input);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Process skill logic
   * @param {object} input - Input parameters
   * @returns {Promise<object>} Processed data
   */
  async process(input) {
    // TODO: Implement your skill logic
    return {
      skillName: this.name,
      input: input,
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = ${this.toPascalCase(skillName)}Skill;
`;
  }

  // Generate .env.example
  static generateEnvExample() {
    return `# Copilot Configuration

# API Settings
COPILOT_API_KEY=your_api_key_here
COPILOT_MODEL=gpt-4

# Logging
LOG_LEVEL=info
DEBUG=false

# Custom Settings
PROJECT_NAME=my-project
ENVIRONMENT=development
`;
  }

  // Generate COPILOT_SETUP.md
  static generateSetupGuide() {
    return `# Copilot Setup Guide

## Overview
This project is configured to work with GitHub Copilot Cloud Agents and custom skills.

## Quick Start

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment
Copy \`.env.example\` to \`.env\` and fill in your settings:
\`\`\`bash
cp .env.example .env
\`\`\`

### 3. Register Your Custom Agent
Edit \`copilot-setup-steps.yml\` to register your agent.

### 4. Run Copilot
\`\`\`bash
copilot
\`\`\`

## Directory Structure

- \`.copilot/\` - Copilot configuration files
- \`agents/\` - Custom agent implementations
- \`skills/\` - Custom skill implementations
- \`copilot-setup-steps.yml\` - Agent and skill registration

## Adding Custom Agents

1. Create a new file in \`agents/\` directory
2. Implement the agent class
3. Register it in \`copilot-setup-steps.yml\`

## Adding Custom Skills

1. Create a new file in \`skills/\` directory
2. Implement the skill class
3. Reference it in your agent configuration

## Documentation
- [GitHub Copilot CLI](https://github.com/features/copilot)
- [Custom Agents Guide](https://docs.github.com/en/copilot)
- [Skills Development](https://docs.github.com/en/copilot)

## Troubleshooting

### Agent not loading
- Ensure the agent is properly registered in \`copilot-setup-steps.yml\`
- Check for syntax errors in your agent file

### Skills not available
- Verify the skill is referenced in the agent configuration
- Check that the skill implements the required interface

## Support
For issues and questions, refer to the GitHub Copilot documentation.
`;
  }

  // Utility: Convert to PascalCase
  static toPascalCase(str) {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }
}

module.exports = TemplateEngine;
