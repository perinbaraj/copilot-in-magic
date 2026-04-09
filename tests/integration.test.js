// Integration tests for complete workflow

const RepositoryAnalyzer = require('../src/analyzer');
const RepositoryScaffolder = require('../src/scaffolder');
const Validators = require('../src/validators');
const fs = require('fs');
const path = require('path');
const os = require('os');

describe('Integration: Complete Workflow', () => {
  let testDir;

  beforeEach(() => {
    // Create temporary test directory
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'integration-test-'));
    // Add package.json to make it look like a real project
    fs.writeFileSync(path.join(testDir, 'package.json'), '{}');
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  test('should complete analyze -> scaffold -> validate workflow', () => {
    // Step 1: Analyze - should show gaps
    const analyzer1 = new RepositoryAnalyzer(testDir);
    const report1 = analyzer1.analyze();
    expect(report1.isReadyForCopilot).toBe(false);
    expect(report1.summary.missingCount).toBeGreaterThan(0);

    // Step 2: Scaffold - should create components
    const scaffolder = new RepositoryScaffolder(testDir);
    const result = scaffolder.scaffold();
    expect(result.success).toBe(true);
    expect(result.alreadySetup).toBe(false);

    // Step 3: Analyze again - should be ready now
    const analyzer2 = new RepositoryAnalyzer(testDir);
    const report2 = analyzer2.analyze();
    expect(report2.isReadyForCopilot).toBe(true);
    expect(report2.summary.missingCount).toBe(0);

    // Step 4: Validate - should pass validation
    const validation = Validators.validateRepository(testDir);
    expect(validation.valid).toBe(true);
  });

  test('should be idempotent - running scaffold twice should be safe', () => {
    const scaffolder1 = new RepositoryScaffolder(testDir);
    const result1 = scaffolder1.scaffold();
    expect(result1.success).toBe(true);

    // Get the content of a file
    const setupPath = path.join(testDir, 'copilot-setup-steps.yml');
    const content1 = fs.readFileSync(setupPath, 'utf8');

    // Run scaffold again
    const scaffolder2 = new RepositoryScaffolder(testDir);
    const result2 = scaffolder2.scaffold();
    expect(result2.alreadySetup).toBe(true);

    // Content should be unchanged
    const content2 = fs.readFileSync(setupPath, 'utf8');
    expect(content2).toBe(content1);
  });

  test('should pass all validations after scaffolding', () => {
    const scaffolder = new RepositoryScaffolder(testDir);
    scaffolder.scaffold();

    const validation = Validators.validateRepository(testDir);
    
    expect(validation.valid).toBe(true);
    expect(validation.directories.valid).toBe(true);
    expect(validation.files.valid).toBe(true);
    expect(validation.setupYml).not.toBeNull();
    expect(validation.setupYml.valid).toBe(true);
    expect(validation.issues).toHaveLength(0);
  });

  test('should generate YAML that passes validation', () => {
    const scaffolder = new RepositoryScaffolder(testDir);
    scaffolder.scaffold();

    const setupPath = path.join(testDir, 'copilot-setup-steps.yml');
    const validation = Validators.validateCopilotSetupSteps(setupPath);
    
    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });
});
