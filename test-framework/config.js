// Configuration for test framework

const config = {
  // Number of projects to test
  maxProjects: 20,
  
  // Timeout per project (milliseconds)
  projectTimeout: 300000, // 5 minutes
  
  // GitHub API
  github: {
    baseUrl: 'https://api.github.com',
    // Note: Uses GITHUB_TOKEN env variable
  },
  
  // Search parameters for trending repos
  search: {
    q: 'stars:>1000 sort:stars',
    per_page: 30,
    sort: 'stars',
    order: 'desc',
  },
  
  // Scoring thresholds
  scoring: {
    detection: {
      dirsFound: 1,
      filesFound: 1,
      typeDetected: 1,
    },
    scaffolding: {
      dirsCreated: 1,
      filesGenerated: 1,
      yamlValid: 1,
    },
    validation: {
      passed: 1,
      noOverwrites: 1,
    },
    performance: {
      fastExecution: { threshold: 500, points: 1 }, // ms
      lowMemory: { threshold: 50, points: 1 }, // MB
    },
  },
  
  // Directories for testing
  dirs: {
    temp: '/tmp/copilot-test-projects',
    results: './test-framework/results',
    log: './test-framework/results/test-log.txt',
  },
  
  // Logging
  verbose: true,
  
  // Languages to prioritize
  languages: ['JavaScript', 'TypeScript', 'Python', 'Go', 'Java', 'Ruby', 'PHP'],
};

module.exports = config;
