#!/usr/bin/env node

// CLI entry point for copilot-starter-kit

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const RepositoryAnalyzer = require('./analyzer');
const RepositoryScaffolder = require('./scaffolder');
const { validateRepoPath, printHeader, printGaps, printSummary, printError, printSuccess, printInfo } = require('./utils');

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
        console.log(`📍 Scaffolding: ${repoPath}\n`);
        
        const scaffolder = new RepositoryScaffolder(repoPath);
        const result = scaffolder.scaffold();

        if (result.alreadySetup) {
          printInfo('Repository is already configured for Copilot');
        } else {
          printSuccess('Scaffolding completed successfully!\n');

          const report = scaffolder.getReport();
          
          if (report.generatedDirs.length > 0) {
            console.log('📁 Created Directories:');
            report.generatedDirs.forEach(dir => console.log(`  ✓ ${dir}`));
            console.log();
          }

          if (report.generatedFiles.length > 0) {
            console.log('📄 Created Files:');
            report.generatedFiles.forEach(file => console.log(`  ✓ ${file}`));
            console.log();
          }

          printInfo('Your repository is now ready for GitHub Copilot!');
          console.log('\n🚀 Next steps:');
          console.log('  1. Review the generated files in .copilot/');
          console.log('  2. Customize copilot-setup-steps.yml with your agents');
          console.log('  3. Add your custom agents in the agents/ directory');
          console.log('  4. Add your custom skills in the skills/ directory');
          console.log('  5. Run: copilot or copilot-starter-kit analyze to verify setup\n');
        }
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
