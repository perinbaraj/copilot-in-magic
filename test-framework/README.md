# Test Framework Documentation

## Overview

The test framework autonomously tests the copilot-starter-kit against 20+ real GitHub projects and generates a comprehensive scoring report.

## Features

✅ **Autonomous Execution** - No user interaction required  
✅ **Real-World Testing** - Tests against actual GitHub projects  
✅ **Comprehensive Scoring** - 10-point scoring system (0-10)  
✅ **Detailed Reporting** - Markdown report with insights  
✅ **Error Recovery** - Continues testing even if one fails  
✅ **Automatic Cleanup** - No artifacts left behind  

## How It Works

### 1. Repository Fetching
- Queries GitHub API for trending repositories
- Filters by supported languages
- Selects top 20+ projects

### 2. Autonomous Testing
For each repository:
1. Clone to temporary directory
2. Run `analyze` command
3. Run `scaffold` command  
4. Run `validate` command
5. Collect metrics
6. Cleanup temporary files

### 3. Scoring System

**Total Score: 0-10 points**

#### Detection (0-3 points)
- Correctly identifies missing directories: +1
- Correctly identifies missing files: +1
- Correctly identifies project type: +1

#### Scaffolding (0-3 points)
- All directories created correctly: +1
- All files generated correctly: +1
- Generated YAML files are valid: +1

#### Validation (0-2 points)
- Validation passes without errors: +1
- No existing files were overwritten: +1

#### Performance (0-2 points)
- Execution time < 500ms: +1
- Memory usage acceptable: +1

### 4. Report Generation
Creates `TEST_REPORT.md` with:
- Executive summary
- Detailed per-project results
- Scoring breakdown by category
- Analysis by language
- Key findings and recommendations

## Usage

### Quick Start

```bash
cd /Users/perinbaraj/AllMyProjects/copilot-in-magic

# Run the test framework
npm run test-framework
```

### Configuration

Edit `test-framework/config.js` to customize:

```javascript
maxProjects: 20,              // Number of projects to test
projectTimeout: 300000,       // Timeout per project (ms)
languages: ['JavaScript', 'Python', ...],  // Supported languages
```

### Environment Setup

Optionally set GitHub token for higher API rate limits:

```bash
export GITHUB_TOKEN=your_token_here
npm run test-framework
```

## Output

### Report Location
```
test-framework/results/
├── TEST_REPORT.md      # Main report (markdown)
├── raw-results.json    # Raw test data (JSON)
└── test-log.txt        # Detailed execution log
```

### Report Contents

**TEST_REPORT.md** includes:
- Executive summary
- Scoring by category
- Detailed results table
- Language-based analysis
- Best performers
- Problem areas
- Recommendations

### Example Score Output

```
Projects Tested: 20
Average Score: 8.5/10
Success Rate: 95%

Scoring Breakdown:
- Detection: 2.7/3
- Scaffolding: 2.8/3
- Validation: 1.9/2
- Performance: 1.8/2
```

## Project Structure

```
test-framework/
├── test-runner.js         # Main orchestrator
├── repo-fetcher.js        # GitHub API integration
├── test-executor.js       # Test execution
├── score-calculator.js    # Scoring logic
├── report-generator.js    # Report creation
├── config.js              # Configuration
├── README.md              # This file
└── results/               # Generated reports
    ├── TEST_REPORT.md
    ├── raw-results.json
    └── test-log.txt
```

## Module Details

### TestRunner
- Main orchestrator
- Coordinates all phases
- Manages logging
- Displays summary

### RepoFetcher
- Queries GitHub API
- Filters repositories
- Returns sorted list

### TestExecutor
- Clones repositories
- Runs CLI commands
- Collects metrics
- Cleans up temp files

### ScoreCalculator
- Calculates individual scores
- Computes statistics
- Generates breakdowns

### ReportGenerator
- Creates markdown report
- Analyzes results
- Provides recommendations

## Scoring Examples

### Perfect Score (10/10)
```
✅ Detection: 3/3 (all components found)
✅ Scaffolding: 3/3 (all files generated)
✅ Validation: 2/2 (all validations passed)
✅ Performance: 2/2 (fast execution)
```

### Good Score (8/10)
```
✅ Detection: 3/3 (all components found)
✅ Scaffolding: 2/3 (some files missing)
✅ Validation: 2/2 (all validations passed)
✓ Performance: 1/2 (slower execution)
```

### Low Score (4/10)
```
✓ Detection: 2/3 (some gaps not detected)
✓ Scaffolding: 1/3 (limited file generation)
✓ Validation: 1/2 (some validation issues)
✓ Performance: 0/2 (slow execution)
```

## Error Handling

### Automatic Recovery
- Clone failure: Skips project, continues testing
- Command timeout: Marks as failed, continues
- File system errors: Logs and continues
- API rate limit: Uses fallback projects

### Logging
All errors and warnings logged to `test-log.txt` for debugging.

## Performance Metrics

### Typical Execution Time
- Per project: 5-30 seconds
- 20 projects: 2-10 minutes total
- Including report generation: < 15 minutes

### System Requirements
- Disk space: ~500MB (for cloning repos)
- Memory: 100-200MB
- Network: Stable internet connection

## Interpreting Results

### High Average Score (8+/10)
✅ Starter kit works well across projects  
✅ Detection and scaffolding effective  
✅ Good performance characteristics  

### Medium Average Score (5-7/10)
⚠️ Some project types have issues  
⚠️ Certain edge cases not handled  
⚠️ Potential performance improvements  

### Low Average Score (<5/10)
❌ Significant issues with starter kit  
❌ Major gaps in detection/scaffolding  
❌ Requires substantial improvements  

## Recommendations

Based on test results, consider:

1. **If Detection < 2.5/3**
   - Improve component detection logic
   - Add more file patterns
   - Enhance project type detection

2. **If Scaffolding < 2.5/3**
   - Expand template coverage
   - Handle more edge cases
   - Improve file generation

3. **If Validation < 1.5/2**
   - Strengthen YAML validation
   - Add more checks
   - Improve error messages

4. **If Performance < 1.5/2**
   - Optimize CLI execution
   - Reduce memory usage
   - Improve I/O performance

## Future Enhancements

- [ ] Test against 100+ projects
- [ ] Add browser-based dashboard
- [ ] Integration with GitHub Actions
- [ ] Scheduled nightly tests
- [ ] Performance trending
- [ ] Detailed per-project reports
- [ ] Regression detection

## Troubleshooting

### "Failed to fetch repositories"
```bash
# Try setting GitHub token
export GITHUB_TOKEN=your_token
npm run test-framework
```

### "Test timeout"
```bash
# Increase timeout in config.js
projectTimeout: 600000,  // 10 minutes
```

### "Permission denied"
```bash
# Ensure test-runner.js is executable
chmod +x test-framework/test-runner.js
```

## Support

For issues or questions:
- Check `test-framework/results/test-log.txt` for detailed logs
- Review `test-framework/results/raw-results.json` for raw data
- Consult project CONTRIBUTING.md for development setup
