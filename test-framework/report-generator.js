// Generate markdown test report

const fs = require('fs');
const path = require('path');
const config = require('./config');
const ScoreCalculator = require('./score-calculator');

class ReportGenerator {
  static generateReport(results, stats) {
    const reportPath = path.join(config.dirs.results, 'TEST_REPORT.md');
    
    // Create results directory if needed
    if (!fs.existsSync(config.dirs.results)) {
      fs.mkdirSync(config.dirs.results, { recursive: true });
    }

    const report = this.buildReport(results, stats);
    fs.writeFileSync(reportPath, report, 'utf8');
    
    return reportPath;
  }

  static buildReport(results, stats) {
    let report = `# 🪄 Copilot Starter Kit - Test Report

Generated: ${new Date().toISOString()}

## Executive Summary

- **Projects Tested**: ${stats.total}
- **Successful**: ${stats.successful} (${((stats.successful / stats.total) * 100).toFixed(1)}%)
- **Failed**: ${stats.failed}
- **Average Score**: ${stats.averageScore}/10
- **Highest Score**: ${stats.highestScore}/10
- **Lowest Score**: ${stats.lowestScore}/10

## Scoring Breakdown

### By Category (Average Points)

| Category | Average | Max |
| --- | --- | --- |
| Detection | ${stats.detection.average}/3 | 3 |
| Scaffolding | ${stats.scaffolding.average}/3 | 3 |
| Validation | ${stats.validation.average}/2 | 2 |
| Performance | ${stats.performance.average}/2 | 2 |
| **TOTAL** | **${stats.averageScore}/10** | **10** |

## Detailed Results

| # | Project | Language | Score | Status | Time | Notes |
| --- | --- | --- | --- | --- | --- | --- |
`;

    results.forEach((result, idx) => {
      const score = ScoreCalculator.calculateProjectScore(result);
      const status = result.success ? '✅' : '❌';
      const time = result.executionTime ? `${(result.executionTime / 1000).toFixed(2)}s` : 'N/A';
      const notes = result.error ? result.error.substring(0, 30) : 'Passed';
      
      const projectName = `${result.repo.owner}/${result.repo.name}`;
      const language = result.repo.language || 'Unknown';
      
      report += `| ${idx + 1} | [${projectName}](${result.repo.htmlUrl}) | ${language} | ${score.total}/10 | ${status} | ${time} | ${notes} |\n`;
    });

    report += `\n## Analysis by Language\n\n`;
    
    const byLanguage = {};
    results.forEach(result => {
      const lang = result.repo.language || 'Unknown';
      if (!byLanguage[lang]) byLanguage[lang] = [];
      byLanguage[lang].push(result);
    });

    Object.entries(byLanguage).forEach(([lang, repos]) => {
      const scores = repos.map(r => ScoreCalculator.calculateProjectScore(r).total);
      const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
      const successful = repos.filter(r => r.success).length;
      report += `- **${lang}**: ${avg}/10 (${successful}/${repos.length} successful)\n`;
    });

    report += `\n## Key Findings\n\n`;
    report += `### Best Performers\n\n`;
    
    const topResults = results
      .filter(r => r.success)
      .sort((a, b) => 
        ScoreCalculator.calculateProjectScore(b).total - 
        ScoreCalculator.calculateProjectScore(a).total
      )
      .slice(0, 5);

    topResults.forEach(result => {
      const score = ScoreCalculator.calculateProjectScore(result);
      report += `- ${result.repo.owner}/${result.repo.name}: **${score.total}/10**\n`;
    });

    report += `\n### Problem Areas\n\n`;
    
    const failedResults = results
      .filter(r => !r.success)
      .slice(0, 5);

    if (failedResults.length > 0) {
      failedResults.forEach(result => {
        report += `- ${result.repo.owner}/${result.repo.name}: ${result.error}\n`;
      });
    } else {
      report += `- No failures detected! ✓\n`;
    }

    report += `\n## Recommendations\n\n`;
    report += `1. **Coverage**: ${stats.scaffolding.average}/3 scaffolding suggests areas for improvement\n`;
    report += `2. **Performance**: ${stats.performance.average}/2 performance indicates room for optimization\n`;
    report += `3. **Validation**: ${stats.validation.average}/2 validation could be enhanced\n`;
    report += `4. **Next Steps**: Consider testing on ${config.maxProjects + 20} more projects for broader validation\n`;

    report += `\n---\n\n`;
    report += `**Copilot Starter Kit** | Autonomous Testing Framework\n`;

    return report;
  }
}

module.exports = ReportGenerator;
