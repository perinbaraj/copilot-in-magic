// Execute tests on a repository

const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');
const simpleGit = require('simple-git');
const config = require('./config');

const execAsync = promisify(exec);

class TestExecutor {
  constructor() {
    this.cliPath = path.resolve(__dirname, '../src/cli.js');
  }

  async cloneRepository(repo, baseDir) {
    try {
      const repoDir = path.join(baseDir, `${repo.owner}-${repo.name}`);
      
      if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir, { recursive: true });
      }

      console.log(`  ↳ Cloning ${repo.owner}/${repo.name}...`);
      
      const git = simpleGit(baseDir);
      await git.clone(repo.url, repoDir);
      
      return repoDir;
    } catch (error) {
      throw new Error(`Failed to clone: ${error.message}`);
    }
  }

  async runAnalyze(repoDir) {
    try {
      const { stdout } = await execAsync(
        `node ${this.cliPath} analyze "${repoDir}"`,
        { timeout: config.projectTimeout }
      );
      return { success: true, output: stdout };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async runScaffold(repoDir) {
    try {
      const { stdout } = await execAsync(
        `node ${this.cliPath} scaffold "${repoDir}"`,
        { timeout: config.projectTimeout }
      );
      return { success: true, output: stdout };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async runValidate(repoDir) {
    try {
      // Check if directories were created
      const hasDir = (name) => fs.existsSync(path.join(repoDir, name));
      const hasFile = (name) => fs.existsSync(path.join(repoDir, name));

      const dirs = ['.copilot', 'agents', 'skills'];
      const files = ['copilot-setup-steps.yml', '.copilot/copilot.yml'];

      const dirResults = dirs.map(d => ({ name: d, exists: hasDir(d) }));
      const fileResults = files.map(f => ({ name: f, exists: hasFile(f) }));

      return {
        success: true,
        directories: dirResults,
        files: fileResults,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async testRepository(repo) {
    const baseDir = config.dirs.temp;
    let repoDir = null;
    const startTime = Date.now();

    try {
      console.log(`\n🧪 Testing: ${repo.owner}/${repo.name}`);
      console.log(`   Language: ${repo.language || 'Unknown'}`);
      
      // Clone
      repoDir = await this.cloneRepository(repo, baseDir);

      // Run analyze
      console.log(`  ↳ Running analyze...`);
      const analyzeResult = await this.runAnalyze(repoDir);

      // Run scaffold
      console.log(`  ↳ Running scaffold...`);
      const scaffoldResult = await this.runScaffold(repoDir);

      // Run validate
      console.log(`  ↳ Running validate...`);
      const validateResult = await this.runValidate(repoDir);

      const executionTime = Date.now() - startTime;

      // Cleanup
      await this.cleanup(repoDir);

      return {
        repo,
        analyze: analyzeResult,
        scaffold: scaffoldResult,
        validate: validateResult,
        executionTime,
        success: true,
      };
    } catch (error) {
      console.error(`  ✗ Error: ${error.message}`);
      if (repoDir) await this.cleanup(repoDir);
      
      return {
        repo,
        error: error.message,
        success: false,
        executionTime: Date.now() - startTime,
      };
    }
  }

  async cleanup(repoDir) {
    try {
      const fs = require('fs');
      if (fs.existsSync(repoDir)) {
        fs.rmSync(repoDir, { recursive: true, force: true });
      }
    } catch (error) {
      console.warn(`Warning: Could not clean up ${repoDir}`);
    }
  }
}

module.exports = TestExecutor;
