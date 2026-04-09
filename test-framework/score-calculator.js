// Calculate scores for test results

const config = require('./config');

class ScoreCalculator {
  static calculateProjectScore(result) {
    if (!result.success) {
      return {
        total: 0,
        detection: 0,
        scaffolding: 0,
        validation: 0,
        performance: 0,
        reason: 'Test failed',
      };
    }

    let score = {
      detection: 0,
      scaffolding: 0,
      validation: 0,
      performance: 0,
      total: 0,
    };

    // Detection scoring (0-3)
    if (result.analyze?.success) score.detection += 1;
    if (result.validate?.directories?.some(d => d.exists)) score.detection += 1;
    if (result.validate?.files?.some(f => f.exists)) score.detection += 1;

    // Scaffolding scoring (0-3)
    if (result.scaffold?.success) score.scaffolding += 1;
    const allDirsCreated = result.validate?.directories?.every(d => d.exists);
    if (allDirsCreated) score.scaffolding += 1;
    const allFilesCreated = result.validate?.files?.every(f => f.exists);
    if (allFilesCreated) score.scaffolding += 1;

    // Validation scoring (0-2)
    if (result.validate?.success) score.validation += 1;
    // Assuming no overwrites if scaffold succeeded
    if (result.scaffold?.success) score.validation += 1;

    // Performance scoring (0-2)
    const executionTimeMs = result.executionTime || 0;
    if (executionTimeMs < config.scoring.performance.fastExecution.threshold) {
      score.performance += 1;
    }
    // Memory usage estimation (very rough)
    if (executionTimeMs < 1000) {
      score.performance += 1;
    }

    score.total = 
      score.detection + 
      score.scaffolding + 
      score.validation + 
      score.performance;

    return score;
  }

  static calculateStats(results) {
    const scores = results.map(r => this.calculateProjectScore(r));
    const validScores = scores.map(s => s.total);
    
    return {
      total: validScores.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      averageScore: (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(2),
      highestScore: Math.max(...validScores),
      lowestScore: Math.min(...validScores),
      detection: {
        average: (scores.reduce((a, b) => a + b.detection, 0) / scores.length).toFixed(2),
      },
      scaffolding: {
        average: (scores.reduce((a, b) => a + b.scaffolding, 0) / scores.length).toFixed(2),
      },
      validation: {
        average: (scores.reduce((a, b) => a + b.validation, 0) / scores.length).toFixed(2),
      },
      performance: {
        average: (scores.reduce((a, b) => a + b.performance, 0) / scores.length).toFixed(2),
      },
    };
  }
}

module.exports = ScoreCalculator;
