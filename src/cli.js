#!/usr/bin/env node

// CLI entry point for copilot-starter-kit

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const RepositoryAnalyzer = require('./analyzer');
const { validateRepoPath, printHeader, printGaps, printSummary, printError } = require('./utils');

const argv = yargs(hideBin(process.argv))
  .command(
    'analyze [repo]',
    'Analyze a repository for missing Copilot components',
    (yargs) => {
      return yargs.positional('repo', {
        describe: 'Path to the repository',
        default: '.',
      });
    },
    (argv) => {
      try {
        const repoPath = validateRepoPath(argv.repo);
        printHeader('Repository Analysis');
        
        const analyzer = new RepositoryAnalyzer(repoPath);
        const report = analyzer.analyze();
        
        console.log(`📍 Analyzing: ${report.repoPath}`);
        printGaps(report);
        printSummary(report);
        
        if (!report.isReadyForCopilot) {
          console.log('\n💡 Run: copilot-starter-kit scaffold to auto-setup missing components');
        }
      } catch (error) {
        printError(error.message);
        process.exit(1);
      }
    }
  )
  .command(
    'scaffold [repo]',
    'Scaffold missing Copilot components',
    (yargs) => {
      return yargs.positional('repo', {
        describe: 'Path to the repository',
        default: '.',
      });
    },
    (argv) => {
      try {
        const repoPath = validateRepoPath(argv.repo);
        printHeader('Repository Scaffolding');
        console.log(`📍 Scaffolding: ${repoPath}`);
        console.log('⏳ Coming in Phase 2...');
      } catch (error) {
        printError(error.message);
        process.exit(1);
      }
    }
  )
  .help()
  .alias('help', 'h')
  .version()
  .alias('version', 'v')
  .demandCommand()
  .strict()
  .parse();
