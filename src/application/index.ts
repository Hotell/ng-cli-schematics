/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { strings } from '@angular-devkit/core';
import {
  MergeStrategy,
  Rule,
  SchematicContext,
  Tree,
  apply,
  chain,
  filter,
  mergeWith,
  move,
  noop,
  schematic,
  template,
  url,
  TemplateOptions,
  SchematicsException,
} from '@angular-devkit/schematics';
import {
  NodePackageInstallTask,
  NodePackageLinkTask,
  RepositoryInitializerTask,
} from '@angular-devkit/schematics/tasks';
import { AngularApplicationOptionsSchema as ApplicationOptions } from './schema';

const MAT_THEME_DEFAULT = 'indigo-pink';

function minimalPathFilter(path: string): boolean {
  const toRemoveList: RegExp[] = [
    /e2e\//,
    /editorconfig/,
    /README/,
    /jest.config.js/,
    /setup-test.ts/,
    /jest-global-mocks.ts/,
    /tsconfig.spec.json/,
    /favicon.ico/,
  ];

  return !toRemoveList.some((re) => re.test(path));
}

function materialPathFilter(path: string): boolean {
  const toRemoveList = [/material\//];

  return !toRemoveList.some((re) => re.test(path));
}

export default function(options: ApplicationOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    const appRootSelector = `${options.prefix}-root`;
    const componentOptions = !options.minimal
      ? {
          inlineStyle: options.inlineStyle,
          inlineTemplate: options.inlineTemplate,
          spec: !options.skipTests,
          styleext: options.style,
        }
      : {
          inlineStyle: true,
          inlineTemplate: true,
          spec: false,
          styleext: options.style,
        };
    const sourceDir = options.sourceDir || 'src';

    let packageTask;
    if (!options.skipInstall) {
      packageTask = context.addTask(new NodePackageInstallTask(options.directory));
      if (options.linkCli) {
        packageTask = context.addTask(new NodePackageLinkTask('@angular/cli', options.directory), [
          packageTask,
        ]);
      }
    }
    if (!options.skipGit) {
      context.addTask(
        // tslint:disable-next-line:no-non-null-assertion
        new RepositoryInitializerTask(options.directory, options.commit!),
        packageTask ? [packageTask] : []
      );
    }

    if (options.matTheme && !options.material) {
      throw new SchematicsException(`You cannot use --matTheme without --material flag`);
    }
    if (options.material) {
      options.matTheme = options.matTheme ? options.matTheme : MAT_THEME_DEFAULT;
    }

    return chain([
      mergeWith(
        apply(url('./files'), [
          options.minimal ? filter(minimalPathFilter) : noop(),
          options.skipGit ? filter((path) => !path.endsWith('/__dot__gitignore')) : noop(),
          options.serviceWorker ? noop() : filter((path) => !path.endsWith('/ngsw-config.json')),
          template({
            utils: strings,
            // @FIXME TemplateOptions has bad definition, as null is allowed by implementation not by type def though
            ...(options as TemplateOptions),
            dot: '.',
            sourcedir: sourceDir,
          }),
          move(options.directory),
        ])
      ),
      schematic('module', {
        name: 'app',
        commonModule: false,
        flat: true,
        routing: options.routing,
        routingScope: 'Root',
        path: options.path,
        sourceDir: options.directory + '/' + sourceDir,
        spec: false,
      }),
      schematic('component', {
        name: 'app',
        selector: appRootSelector,
        sourceDir: options.directory + '/' + sourceDir,
        flat: true,
        path: options.path,
        skipImport: true,
        ...componentOptions,
      }),
      mergeWith(
        apply(url('./other-files'), [
          componentOptions.inlineTemplate ? filter((path) => !path.endsWith('.html')) : noop(),
          !componentOptions.spec ? filter((path) => !path.endsWith('.spec.ts')) : noop(),
          !options.material ? filter(materialPathFilter) : noop(),
          template({
            utils: strings,
            // @FIXME TemplateOptions has bad definition, as null is allowed by implementation not by type def though
            ...(options as TemplateOptions),
            selector: appRootSelector,
            ...componentOptions,
          }),
          move(options.directory + '/' + sourceDir + '/app'),
        ]),
        MergeStrategy.Overwrite
      ),
    ])(host, context);
  };
}
