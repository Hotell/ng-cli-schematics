/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { basename, dirname, normalize, relative, strings } from '@angular-devkit/core';
import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  apply,
  branchAndMerge,
  chain,
  filter,
  mergeWith,
  move,
  noop,
  template,
  url,
} from '@angular-devkit/schematics';
import * as ts from 'typescript';
import { addImportToModule } from '../utility/ast-utils';
import { InsertChange } from '../utility/change';
import { findModuleFromOptions } from '../utility/find-module';
import { AngularModuleOptionsSchema as ModuleOptions } from './schema';

function addDeclarationToNgModule(options: ModuleOptions): Rule {
  return (host: Tree) => {
    if (!options.module) {
      return host;
    }

    const modulePath = normalize('/' + options.module);

    const text = host.read(modulePath);
    if (text === null) {
      throw new SchematicsException(`File ${modulePath} does not exist.`);
    }
    const sourceText = text.toString('utf-8');
    const source = ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);

    const importModulePath = normalize(
      `/${options.sourceDir}/${options.path}/` +
        (options.flat ? '' : strings.dasherize(options.name) + '/') +
        strings.dasherize(options.name) +
        '.module'
    );
    const relativeDir = relative(dirname(modulePath), dirname(importModulePath));
    const relativePath =
      (relativeDir.startsWith('.') ? relativeDir : './' + relativeDir) +
      '/' +
      basename(importModulePath);
    const changes = addImportToModule(
      source,
      modulePath,
      strings.classify(`${options.name}Module`),
      relativePath
    );

    const recorder = host.beginUpdate(modulePath);
    for (const change of changes) {
      if (change instanceof InsertChange) {
        recorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(recorder);

    return host;
  };
}

export default function(options: ModuleOptions): Rule {
  options.path = options.path ? normalize(options.path) : options.path;
  const sourceDir = options.sourceDir;
  if (!sourceDir) {
    throw new SchematicsException(`sourceDir option is required.`);
  }

  return (host: Tree, context: SchematicContext) => {
    if (options.module) {
      options.module = findModuleFromOptions(host, options);
    }

    const templateSource = apply(url('./files'), [
      options.spec ? noop() : filter((path) => !path.endsWith('.spec.ts')),
      options.routing ? noop() : filter((path) => !path.endsWith('-routing.module.ts')),
      template({
        ...strings,
        'if-flat': (s: string) => (options.flat ? '' : s),
        ...options,
      }),
      move(sourceDir),
    ]);

    return chain([
      branchAndMerge(chain([addDeclarationToNgModule(options), mergeWith(templateSource)])),
    ])(host, context);
  };
}
