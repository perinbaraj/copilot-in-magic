// Validators for Copilot configuration files

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class Validators {
  // Validate YAML syntax
  static validateYAML(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      yaml.load(content);
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: error.message,
      };
    }
  }

  // Validate copilot-setup-steps.yml structure
  static validateCopilotSetupSteps(filePath) {
    const validation = this.validateYAML(filePath);
    if (!validation.valid) {
      return validation;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const config = yaml.load(content);

      const errors = [];

      // Check required fields
      if (!config.version) {
        errors.push('Missing required field: version');
      }

      if (!config.agents || !Array.isArray(config.agents)) {
        errors.push('Missing required field: agents (should be array)');
      }

      if (config.agents && config.agents.length > 0) {
        config.agents.forEach((agent, idx) => {
          if (!agent.name) {
            errors.push(`Agent ${idx}: Missing required field: name`);
          }
        });
      }

      return {
        valid: errors.length === 0,
        errors: errors,
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message,
      };
    }
  }

  // Validate directory structure
  static validateDirectoryStructure(repoPath) {
    const required = ['.copilot', 'agents', 'skills'];
    const missing = [];

    for (const dir of required) {
      const fullPath = path.join(repoPath, dir);
      if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory()) {
        missing.push(dir);
      }
    }

    return {
      valid: missing.length === 0,
      missing: missing,
    };
  }

  // Validate required files exist
  static validateRequiredFiles(repoPath) {
    const required = [
      'copilot-setup-steps.yml',
      '.copilot/copilot.yml',
      '.copilot/custom-instructions.md',
    ];
    const missing = [];

    for (const file of required) {
      const fullPath = path.join(repoPath, file);
      if (!fs.existsSync(fullPath)) {
        missing.push(file);
      }
    }

    return {
      valid: missing.length === 0,
      missing: missing,
    };
  }

  // Complete validation
  static validateRepository(repoPath) {
    const results = {
      directories: this.validateDirectoryStructure(repoPath),
      files: this.validateRequiredFiles(repoPath),
      setupYml: null,
      copilotYml: null,
      valid: true,
      issues: [],
    };

    // Validate YAML files if they exist
    const setupPath = path.join(repoPath, 'copilot-setup-steps.yml');
    if (fs.existsSync(setupPath)) {
      results.setupYml = this.validateCopilotSetupSteps(setupPath);
      if (!results.setupYml.valid) {
        results.valid = false;
        results.issues.push(
          `copilot-setup-steps.yml: ${results.setupYml.error || results.setupYml.errors.join(', ')}`
        );
      }
    }

    // Validate copilot.yml YAML syntax
    const copilotPath = path.join(repoPath, '.copilot/copilot.yml');
    if (fs.existsSync(copilotPath)) {
      results.copilotYml = this.validateYAML(copilotPath);
      if (!results.copilotYml.valid) {
        results.valid = false;
        results.issues.push(`.copilot/copilot.yml: ${results.copilotYml.error}`);
      }
    }

    // Add directory issues
    if (!results.directories.valid) {
      results.valid = false;
      results.issues.push(`Missing directories: ${results.directories.missing.join(', ')}`);
    }

    // Add file issues
    if (!results.files.valid) {
      results.valid = false;
      results.issues.push(`Missing files: ${results.files.missing.join(', ')}`);
    }

    return results;
  }
}

module.exports = Validators;
