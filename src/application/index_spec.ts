/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { getFileContent } from '../utility/test';
import { AngularApplicationOptionsSchema as ApplicationOptions } from './schema';

describe('Application Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@schematics/angular',
    path.join(__dirname, '../collection.json')
  );
  const defaultOptions: ApplicationOptions = {
    directory: 'foo',
    name: 'foo',
    sourceDir: 'src',
    inlineStyle: false,
    inlineTemplate: true,
    viewEncapsulation: 'Emulated',
    changeDetection: 'Default',
    version: '1.2.3',
    routing: false,
    style: 'css',
    skipTests: false,
    minimal: false,
    material: false,
    matTheme: '',
  };

  it('should create all files of an application', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('application', options);
    const files = tree.files;

    expect(files.indexOf('/foo/.vscode/settings.json')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/foo/.vscode/extensions.json')).toBeGreaterThanOrEqual(0);

    expect(files.indexOf('/foo/.editorconfig')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/foo/.angular-cli.json')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/foo/.gitignore')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/foo/.prettierrc')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/foo/.prettierignore')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/foo/jest.config.js')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/foo/package.json')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/foo/README.md')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/foo/tsconfig.json')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/foo/tslint.json')).toBeGreaterThanOrEqual(0);

    expect(files.indexOf('/foo/e2e/app.e2e-spec.ts')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/foo/e2e/app.po.ts')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/foo/e2e/environment.ts')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/foo/e2e/utils/browser.ts')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/foo/e2e/utils/index.ts')).toBeGreaterThanOrEqual(0);

    expect(files.indexOf('/foo/src/favicon.ico')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/foo/src/index.html')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/foo/src/main.ts')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/foo/src/polyfills.ts')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/foo/src/setup-jest.ts')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/foo/src/jest-global-mocks.ts')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/foo/src/styles.css')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/foo/src/tsconfig.app.json')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/foo/src/tsconfig.spec.json')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/foo/src/typings.d.ts')).toBeGreaterThanOrEqual(0);

    expect(files.indexOf('/foo/src/material/material.module.ts')).toBe(-1);

    expect(files.indexOf('/foo/src/assets/.gitkeep')).toBeGreaterThanOrEqual(0);

    expect(files.indexOf('/foo/src/environments/environment.prod.ts')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/foo/src/environments/environment.ts')).toBeGreaterThanOrEqual(0);

    expect(files.indexOf('/foo/src/app/app.module.ts')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/foo/src/app/app.component.css')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/foo/src/app/app.component.html')).toBe(-1);
    expect(files.indexOf('/foo/src/app/app.component.spec.ts')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/foo/src/app/app.component.ts')).toBeGreaterThanOrEqual(0);
  });

  it('should handle a different sourceDir', () => {
    const options = { ...defaultOptions, sourceDir: 'some/custom/path' };

    let tree: UnitTestTree | null = null;
    expect(() => (tree = schematicRunner.runSchematic('application', options))).not.toThrow();

    if (tree) {
      // tslint:disable-next-line:no-non-null-assertion
      const files = tree!.files;
      expect(files.indexOf('/foo/some/custom/path/app/app.module.ts')).toBeGreaterThanOrEqual(0);
      expect(files.indexOf('/foo/some/custom/path/tsconfig.app.json')).toBeGreaterThanOrEqual(0);
    }
  });

  it('should handle the routing flag', () => {
    const options = { ...defaultOptions, routing: true };

    const tree = schematicRunner.runSchematic('application', options);
    const files = tree.files;
    expect(files.indexOf('/foo/src/app/app.module.ts')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/foo/src/app/app-routing.module.ts')).toBeGreaterThanOrEqual(0);
    const moduleContent = getFileContent(tree, '/foo/src/app/app.module.ts');
    expect(moduleContent).toMatch(/import { AppRoutingModule } from '.\/app-routing.module'/);
    const routingModuleContent = getFileContent(tree, '/foo/src/app/app-routing.module.ts');
    expect(routingModuleContent).toMatch(/RouterModule.forRoot\(routes\)/);
  });

  it('should handle the skip git flag', () => {
    const options = { ...defaultOptions, skipGit: true };

    const tree = schematicRunner.runSchematic('application', options);
    const files = tree.files;
    expect(files.indexOf('/foo/.gitignore')).toEqual(-1);
  });

  it('should import BrowserModule in the app module', () => {
    const tree = schematicRunner.runSchematic('application', defaultOptions);
    const path = '/foo/src/app/app.module.ts';
    const content = tree.readContent(path);
    expect(content).toMatch(/import { BrowserModule } from \'@angular\/platform-browser\';/);
  });

  it('should declare app component in the app module', () => {
    const tree = schematicRunner.runSchematic('application', defaultOptions);
    const path = '/foo/src/app/app.module.ts';
    const content = tree.readContent(path);
    expect(content).toMatch(/import { AppComponent } from \'\.\/app\.component\';/);
  });

  it('should use the directory option', () => {
    const options = { ...defaultOptions, directory: 'my-dir' };
    const tree = schematicRunner.runSchematic('application', options);
    expect(tree.exists('/my-dir/package.json')).toEqual(true);
  });

  it(`should use material option`, () => {
    const options: ApplicationOptions = { ...defaultOptions, material: true };
    const tree = schematicRunner.runSchematic('application', options);
    const files = tree.files;

    expect(files.indexOf('/foo/src/app/material/index.ts')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/foo/src/app/material/material.module.ts')).toBeGreaterThanOrEqual(0);

    const appModulePath = '/foo/src/app/app.module.ts';
    const appModuleContent = tree.readContent(appModulePath);

    expect(appModuleContent).toMatch(/import { MaterialModule } from \'\.\/material\';/);
    expect(appModuleContent).toMatch(
      /import { BrowserAnimationsModule } from \'@angular\/platform-browser\/animations\';/
    );

    const mainPath = '/foo/src/main.ts';
    const mainPathContent = tree.readContent(mainPath);

    expect(mainPathContent).toMatch(/import \'hammerjs\';/);

    const stylePath = '/foo/src/styles.css';
    const styleContent = tree.readContent(stylePath);

    expect(styleContent).toMatch(
      /@import \'~@angular\/material\/prebuilt-themes\/indigo-pink.css\';/
    );

    const htmlPath = '/foo/src/index.html';
    const htmlContent = tree.readContent(htmlPath);

    expect(htmlContent).toMatch(
      /<link href="https:\/\/fonts\.googleapis\.com\/icon\?family=Material\+Icons\" rel=\"stylesheet\">/
    );
  });

  it(`should use matTheme option`, () => {
    const options: ApplicationOptions = {
      ...defaultOptions,
      material: true,
      matTheme: 'deeppurple-amber',
    };
    const tree = schematicRunner.runSchematic('application', options);

    const stylePath = '/foo/src/styles.css';
    const styleContent = tree.readContent(stylePath);

    expect(styleContent).toMatch(
      /@import \'~@angular\/material\/prebuilt-themes\/deeppurple-amber.css\';/
    );
  });

  it(`should throw if --matTheme is used without --material`, () => {
    const options: ApplicationOptions = {
      ...defaultOptions,
      matTheme: 'deeppurple-amber',
    };

    let thrownError: Error | null = null;
    try {
      schematicRunner.runSchematic('application', options);
    } catch (err) {
      thrownError = err;
    }

    expect(thrownError).toBeDefined();
    // tslint:disable-next-line:no-non-null-assertion
    expect(thrownError!.message).toContain('You cannot use --matTheme without --material flag');
  });

  it(`should handle --changeDetection option`, () => {
    const options: ApplicationOptions = {
      ...defaultOptions,
      changeDetection: 'OnPush',
    };
    const tree = schematicRunner.runSchematic('application', options);
    const ngCliConfigPath = '/foo/.angular-cli.json';
    const ngCliConfigContent = tree.readContent(ngCliConfigPath);

    expect(ngCliConfigContent).toMatch(/"changeDetection": "OnPush"/);
  });
});
