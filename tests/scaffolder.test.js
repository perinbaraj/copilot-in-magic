// Test suite for RepositoryScaffolder

const RepositoryScaffolder = require('../src/scaffolder');
const fs = require('fs');
const path = require('path');
const os = require('os');

describe('RepositoryScaffolder', () => {
  let testDir;

  beforeEach(() => {
    // Create temporary test directory
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'scaffolder-test-'));
    // Add package.json to make it look like a real project
    fs.writeFileSync(path.join(testDir, 'package.json'), '{}');
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  test('should create missing directories', () => {
    const scaffolder = new RepositoryScaffolder(testDir);
    scaffolder.scaffold();

    expect(fs.existsSync(path.join(testDir, '.copilot'))).toBe(true);
    expect(fs.existsSync(path.join(testDir, 'agents'))).toBe(true);
    expect(fs.existsSync(path.join(testDir, 'skills'))).toBe(true);
  });

  test('should create required files', () => {
    const scaffolder = new RepositoryScaffolder(testDir);
    scaffolder.scaffold();

    expect(fs.existsSync(path.join(testDir, 'copilot-setup-steps.yml'))).toBe(true);
    expect(fs.existsSync(path.join(testDir, '.copilot', 'copilot.yml'))).toBe(true);
    expect(fs.existsSync(path.join(testDir, '.env.example'))).toBe(true);
  });

  test('should create optional files', () => {
    const scaffolder = new RepositoryScaffolder(testDir);
    scaffolder.scaffold();

    expect(fs.existsSync(path.join(testDir, 'COPILOT_SETUP.md'))).toBe(true);
    expect(fs.existsSync(path.join(testDir, '.copilot', 'custom-instructions.md'))).toBe(true);
  });

  test('should not overwrite existing files', () => {
    const existingFile = path.join(testDir, 'copilot-setup-steps.yml');
    const originalContent = 'original content';
    fs.writeFileSync(existingFile, originalContent);

    const scaffolder = new RepositoryScaffolder(testDir);
    scaffolder.scaffold();

    const content = fs.readFileSync(existingFile, 'utf8');
    expect(content).toBe(originalContent);
  });

  test('should return success report', () => {
    const scaffolder = new RepositoryScaffolder(testDir);
    const result = scaffolder.scaffold();

    expect(result.success).toBe(true);
    expect(result.alreadySetup).toBe(false);
    expect(result.generatedFiles.length).toBeGreaterThan(0);
    expect(result.generatedDirs.length).toBeGreaterThan(0);
  });

  test('should detect already scaffolded repository', () => {
    // Create all required components
    fs.mkdirSync(path.join(testDir, '.copilot'));
    fs.mkdirSync(path.join(testDir, 'agents'));
    fs.mkdirSync(path.join(testDir, 'skills'));
    fs.writeFileSync(path.join(testDir, 'copilot-setup-steps.yml'), '');
    fs.writeFileSync(path.join(testDir, '.copilot', 'copilot.yml'), '');
    fs.writeFileSync(path.join(testDir, '.env.example'), '');

    const scaffolder = new RepositoryScaffolder(testDir);
    const result = scaffolder.scaffold();

    expect(result.alreadySetup).toBe(true);
    expect(result.generatedFiles).toHaveLength(0);
    expect(result.generatedDirs).toHaveLength(0);
  });

  test('should generate valid YAML files', () => {
    const yaml = require('js-yaml');
    
    const scaffolder = new RepositoryScaffolder(testDir);
    scaffolder.scaffold();

    const setupPath = path.join(testDir, 'copilot-setup-steps.yml');
    const setupContent = fs.readFileSync(setupPath, 'utf8');
    const setupYaml = yaml.load(setupContent);

    expect(setupYaml).toHaveProperty('version');
    expect(setupYaml).toHaveProperty('agents');
    expect(Array.isArray(setupYaml.agents)).toBe(true);
  });

  test('should create .gitkeep files in directories', () => {
    const scaffolder = new RepositoryScaffolder(testDir);
    scaffolder.scaffold();

    expect(fs.existsSync(path.join(testDir, '.copilot', '.gitkeep'))).toBe(true);
    expect(fs.existsSync(path.join(testDir, 'agents', '.gitkeep'))).toBe(true);
    expect(fs.existsSync(path.join(testDir, 'skills', '.gitkeep'))).toBe(true);
  });

  test('should generate report with correct counts', () => {
    const scaffolder = new RepositoryScaffolder(testDir);
    scaffolder.scaffold();
    const report = scaffolder.getReport();

    expect(report.generatedDirs.length).toBeGreaterThan(0);
    expect(report.generatedFiles.length).toBeGreaterThan(0);
    expect(report.totalGenerated).toBe(report.generatedDirs.length + report.generatedFiles.length);
  });
});
