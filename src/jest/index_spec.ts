import { Tree, VirtualTree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { getFileContent } from '@schematics/angular/utility/test';
import { join } from 'path';

import { AddingJestForUnitTestingSchema as JestOptions } from './schema';

const collectionPath = join(__dirname, '../collection.json');
const defaultOptions: JestOptions = {
  // name: 'foo',
  project: '',
  // path: 'app',
  replace: false,
  // sourceDir: 'src',
  // spec: true,
  // module: undefined,
  // flat: false,
  // root: true,
};

describe(`Jest Schematic`, () => {
  let runner: SchematicTestRunner;
  let appTree: Tree;

  beforeEach(() => {
    // appTree = createTestApp();
    appTree = new VirtualTree();
    runner = new SchematicTestRunner('schematics', collectionPath);
  });

  it(`should add jest.config to root and jest-setup,jest-global-mocks to sourcedir`, () => {
    const options = { ...defaultOptions };
    const tree = runner.runSchematic('jest', options, appTree);
  });
  it('should update package.json', () => {
    const options = { ...defaultOptions };
    const tree = runner.runSchematic('jest', options, appTree);
    const packageJson = JSON.parse(getFileContent(tree, '/package.json'));
    expect(packageJson.dependencies['jest']).toBeDefined();
    expect(packageJson.dependencies['jest-preset-angular']).toBeDefined();
  });
  it(`should update tsconfig.spec.json`, () => {
    const options = { ...defaultOptions };
    const tree = runner.runSchematic('jest', options, appTree);
  });
  it(`should remove any karma/jasmine config from project when --replace flag is used`, () => {
    const options = { ...defaultOptions };
    const tree = runner.runSchematic('jest', options, appTree);
  });
});
