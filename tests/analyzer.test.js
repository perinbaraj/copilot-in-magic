// Test suite for RepositoryAnalyzer

const RepositoryAnalyzer = require('../src/analyzer');
const fs = require('fs');
const path = require('path');
const os = require('os');

describe('RepositoryAnalyzer', () => {
  let testDir;

  beforeEach(() => {
    // Create temporary test directory
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'analyzer-test-'));
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  test('should detect missing directories', () => {
    const analyzer = new RepositoryAnalyzer(testDir);
    const report = analyzer.analyze();

    expect(report.gaps.missingDirectories).toContain('.copilot');
    expect(report.gaps.missingDirectories).toContain('agents');
    expect(report.gaps.missingDirectories).toContain('skills');
  });

  test('should detect missing required files', () => {
    const analyzer = new RepositoryAnalyzer(testDir);
    const report = analyzer.analyze();

    expect(report.gaps.missingFiles).toContain('copilot-setup-steps.yml');
    expect(report.gaps.missingFiles).toContain('.copilot/copilot.yml');
  });

  test('should not be ready for Copilot if components missing', () => {
    const analyzer = new RepositoryAnalyzer(testDir);
    const report = analyzer.analyze();

    expect(report.isReadyForCopilot).toBe(false);
  });

  test('should detect project type correctly', () => {
    // Create package.json for Node project
    fs.writeFileSync(path.join(testDir, 'package.json'), '{}');

    const analyzer = new RepositoryAnalyzer(testDir);
    analyzer.detectProjectType();

    expect(analyzer.projectType).toBe('node');
  });

  test('should detect empty project as unknown', () => {
    const analyzer = new RepositoryAnalyzer(testDir);
    analyzer.detectProjectType();

    expect(analyzer.projectType).toBe('unknown');
  });

  test('should be ready when all required components exist', () => {
    // Create required directories
    fs.mkdirSync(path.join(testDir, '.copilot'));
    fs.mkdirSync(path.join(testDir, 'agents'));
    fs.mkdirSync(path.join(testDir, 'skills'));

    // Create required files
    fs.writeFileSync(path.join(testDir, 'copilot-setup-steps.yml'), '');
    fs.writeFileSync(path.join(testDir, '.copilot', 'copilot.yml'), '');
    fs.writeFileSync(path.join(testDir, '.env.example'), '');

    const analyzer = new RepositoryAnalyzer(testDir);
    const report = analyzer.analyze();

    expect(report.isReadyForCopilot).toBe(true);
    expect(report.gaps.missingDirectories).toHaveLength(0);
    expect(report.gaps.missingFiles).toHaveLength(0);
  });

  test('should generate correct summary report', () => {
    const analyzer = new RepositoryAnalyzer(testDir);
    const report = analyzer.analyze();

    expect(report).toHaveProperty('repoPath');
    expect(report).toHaveProperty('projectType');
    expect(report).toHaveProperty('isReadyForCopilot');
    expect(report).toHaveProperty('gaps');
    expect(report).toHaveProperty('summary');
    expect(report.summary.missingCount).toBeGreaterThan(0);
  });
});
