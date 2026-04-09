#!/usr/bin/env node

/**
 * Copilot Starter Kit - Autonomous Test Runner
 * 
 * Tests the starter kit against 20+ real GitHub projects
 * Generates a comprehensive scoring report
 */

const RepoFetcher = require('./repo-fetcher');
const TestExecutor = require('./test-executor');
const ScoreCalculator = require('./score-calculator');
const ReportGenerator = require('./report-generator');
const config = require('./config');
const fs = require('fs');
const path = require('path');

class TestRunner {
  constructor() {
    this.results = [];
    this.stats = null;
    this.startTime = Date.now();
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    
    if (config.verbose) {
      console.log(message);
    }
    
    // Also write to log file
    this.appendLog(logMessage);
  }

  appendLog(message) {
    if (!fs.existsSync(config.dirs.results)) {
      fs.mkdirSync(config.dirs.results, { recursive: true });
    }
    
    fs.appendFileSync(config.dirs.log, message + '\n', 'utf8');
  }

  async run() {
    this.log('🚀 Starting Copilot Starter Kit Autonomous Testing Framework');
    this.log(`   Configuration: ${config.maxProjects} projects to test`);
    
    try {
      // 1. Fetch repositories
      this.log('\n📡 Phase 1: Fetching repositories...');
      const fetcher = new RepoFetcher();
      let repos = await fetcher.fetchTrendingRepos();
      
      if (repos.length === 0) {
        this.log('✗ Failed to fetch repositories. Using fallback list...');
        repos = this.getFallbackRepos();
      }

      this.log(`✓ Successfully fetched ${repos.length} repositories`);

      // 2. Execute tests
      this.log('\n🧪 Phase 2: Executing tests on repositories...');
      const executor = new TestExecutor();
      
      for (const repo of repos) {
        const result = await executor.testRepository(repo);
        this.results.push(result);
        
        const score = ScoreCalculator.calculateProjectScore(result);
        this.log(`✓ ${repo.owner}/${repo.name}: ${score.total}/10`);
      }

      // 3. Calculate statistics
      this.log('\n📊 Phase 3: Calculating statistics...');
      this.stats = ScoreCalculator.calculateStats(this.results);
      this.log(`✓ Statistics calculated`);

      // 4. Generate report
      this.log('\n📝 Phase 4: Generating report...');
      const reportPath = ReportGenerator.generateReport(this.results, this.stats);
      this.log(`✓ Report generated: ${reportPath}`);

      // 5. Display summary
      this.displaySummary();

      // 6. Save raw results
      this.saveRawResults();

      this.log('\n✅ Testing complete!');
      
    } catch (error) {
      this.log(`\n✗ Error during testing: ${error.message}`);
      console.error(error);
    }

    const totalTime = ((Date.now() - this.startTime) / 1000).toFixed(2);
    this.log(`\n⏱️  Total execution time: ${totalTime}s`);
  }

  displaySummary() {
    console.log(`\n${'='.repeat(60)}`);
    console.log('📊 TEST SUMMARY');
    console.log(`${'='.repeat(60)}`);
    console.log(`\nProjects Tested:      ${this.stats.total}`);
    console.log(`Successful:           ${this.stats.successful}/${this.stats.total}`);
    console.log(`Failed:               ${this.stats.failed}/${this.stats.total}`);
    console.log(`\nAverage Score:        ${this.stats.averageScore}/10`);
    console.log(`Highest Score:        ${this.stats.highestScore}/10`);
    console.log(`Lowest Score:         ${this.stats.lowestScore}/10`);
    console.log(`\nDetection Avg:        ${this.stats.detection.average}/3`);
    console.log(`Scaffolding Avg:      ${this.stats.scaffolding.average}/3`);
    console.log(`Validation Avg:       ${this.stats.validation.average}/2`);
    console.log(`Performance Avg:      ${this.stats.performance.average}/2`);
    console.log(`${'='.repeat(60)}`);
  }

  saveRawResults() {
    const resultsPath = path.join(config.dirs.results, 'raw-results.json');
    
    if (!fs.existsSync(config.dirs.results)) {
      fs.mkdirSync(config.dirs.results, { recursive: true });
    }

    const data = {
      timestamp: new Date().toISOString(),
      config: {
        maxProjects: config.maxProjects,
        languages: config.languages,
      },
      stats: this.stats,
      results: this.results.map(r => ({
        repo: r.repo,
        score: ScoreCalculator.calculateProjectScore(r),
        success: r.success,
        executionTime: r.executionTime,
        error: r.error,
      })),
    };

    fs.writeFileSync(resultsPath, JSON.stringify(data, null, 2), 'utf8');
    this.log(`✓ Raw results saved: ${resultsPath}`);
  }

  getFallbackRepos() {
    // Fallback list of popular repos if API fails
    return [
      {
        name: 'react',
        owner: 'facebook',
        url: 'https://github.com/facebook/react.git',
        htmlUrl: 'https://github.com/facebook/react',
        language: 'JavaScript',
        stars: 200000,
      },
      {
        name: 'vue',
        owner: 'vuejs',
        url: 'https://github.com/vuejs/vue.git',
        htmlUrl: 'https://github.com/vuejs/vue',
        language: 'JavaScript',
        stars: 200000,
      },
      {
        name: 'pandas',
        owner: 'pandas-dev',
        url: 'https://github.com/pandas-dev/pandas.git',
        htmlUrl: 'https://github.com/pandas-dev/pandas',
        language: 'Python',
        stars: 40000,
      },
    ];
  }
}

// Run tests if executed directly
if (require.main === module) {
  const runner = new TestRunner();
  runner.run().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = TestRunner;
