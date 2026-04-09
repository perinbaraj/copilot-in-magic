// Utility functions

const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

// Print styled header
function printHeader(text) {
  console.log(chalk.cyan.bold(`\n🪄 ${text}\n`));
}

// Print success message
function printSuccess(text) {
  console.log(chalk.green(`✓ ${text}`));
}

// Print error message
function printError(text) {
  console.log(chalk.red(`✗ ${text}`));
}

// Print warning message
function printWarning(text) {
  console.log(chalk.yellow(`⚠ ${text}`));
}

// Print info message
function printInfo(text) {
  console.log(chalk.blue(`ℹ ${text}`));
}

// Print gap analysis
function printGaps(report) {
  if (report.isReadyForCopilot) {
    printSuccess('Repository is already configured for Copilot!');
    return;
  }

  if (report.gaps.missingDirectories.length > 0) {
    console.log(chalk.yellow.bold('\n📁 Missing Directories:'));
    report.gaps.missingDirectories.forEach(dir => {
      console.log(`  - ${dir}`);
    });
  }

  if (report.gaps.missingFiles.length > 0) {
    console.log(chalk.yellow.bold('\n📄 Missing Files:'));
    report.gaps.missingFiles.forEach(file => {
      console.log(`  - ${file}`);
    });
  }

  if (report.gaps.missingOptionalFiles.length > 0) {
    console.log(chalk.blue.bold('\n📋 Missing Optional Files:'));
    report.gaps.missingOptionalFiles.forEach(file => {
      console.log(`  - ${file}`);
    });
  }
}

// Print summary
function printSummary(report) {
  console.log(chalk.cyan.bold('\n📊 Analysis Summary:'));
  console.log(`  Project Type: ${report.projectType}`);
  console.log(`  Missing Components: ${report.summary.missingCount}`);
  console.log(`  Missing Optional: ${report.summary.missingOptionalCount}`);
  console.log(`  Status: ${report.isReadyForCopilot ? chalk.green('Ready') : chalk.red('Not Ready')}`);
}

// Validate repo path exists
function validateRepoPath(repoPath) {
  if (!fs.existsSync(repoPath)) {
    throw new Error(`Repository path does not exist: ${repoPath}`);
  }

  const stat = fs.statSync(repoPath);
  if (!stat.isDirectory()) {
    throw new Error(`Path is not a directory: ${repoPath}`);
  }

  return path.resolve(repoPath);
}

module.exports = {
  printHeader,
  printSuccess,
  printError,
  printWarning,
  printInfo,
  printGaps,
  printSummary,
  validateRepoPath,
};
