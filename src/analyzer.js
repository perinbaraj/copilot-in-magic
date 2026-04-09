// Repository analyzer - detects missing Copilot components

const fs = require('fs');
const path = require('path');
const { REQUIRED_COMPONENTS, PROJECT_TYPES, DETECTION_PATTERNS } = require('./config');

class RepositoryAnalyzer {
  constructor(repoPath) {
    this.repoPath = path.resolve(repoPath);
    this.gaps = {
      missingDirectories: [],
      missingFiles: [],
      missingOptionalFiles: [],
    };
    this.projectType = PROJECT_TYPES.UNKNOWN;
  }

  // Detect project type based on file indicators
  detectProjectType() {
    let detectedType = PROJECT_TYPES.UNKNOWN;
    let maxWeight = 0;

    for (const [projectType, config] of Object.entries(DETECTION_PATTERNS)) {
      let weight = 0;
      for (const indicator of config.indicators) {
        const fullPath = path.join(this.repoPath, indicator);
        if (fs.existsSync(fullPath)) {
          weight += config.weight;
        }
      }

      if (weight > maxWeight) {
        maxWeight = weight;
        detectedType = projectType;
      }
    }

    this.projectType = detectedType;
    return detectedType;
  }

  // Check if directory exists
  directoryExists(dirName) {
    const fullPath = path.join(this.repoPath, dirName);
    return fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
  }

  // Check if file exists
  fileExists(fileName) {
    const fullPath = path.join(this.repoPath, fileName);
    return fs.existsSync(fullPath) && fs.statSync(fullPath).isFile();
  }

  // Analyze repository and collect gaps
  analyze() {
    this.detectProjectType();

    // Check for missing directories
    for (const dir of REQUIRED_COMPONENTS.directories) {
      if (!this.directoryExists(dir)) {
        this.gaps.missingDirectories.push(dir);
      }
    }

    // Check for missing required files
    for (const file of REQUIRED_COMPONENTS.files) {
      if (!this.fileExists(file)) {
        this.gaps.missingFiles.push(file);
      }
    }

    // Check for missing optional files
    for (const file of REQUIRED_COMPONENTS.optionalFiles) {
      if (!this.fileExists(file)) {
        this.gaps.missingOptionalFiles.push(file);
      }
    }

    return this.getReport();
  }

  // Generate analysis report
  getReport() {
    const hasMissingRequired = 
      this.gaps.missingDirectories.length > 0 || 
      this.gaps.missingFiles.length > 0;

    return {
      repoPath: this.repoPath,
      projectType: this.projectType,
      isReadyForCopilot: !hasMissingRequired,
      gaps: this.gaps,
      summary: {
        missingCount: 
          this.gaps.missingDirectories.length + 
          this.gaps.missingFiles.length,
        missingOptionalCount: this.gaps.missingOptionalFiles.length,
      },
    };
  }
}

module.exports = RepositoryAnalyzer;
