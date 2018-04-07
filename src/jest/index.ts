import { Rule, chain, noop, Tree } from '@angular-devkit/schematics';

import { AddingJestForUnitTestingSchema as JestOptions } from './schema';
import { addPackageToPackageJson, jestPresetAngularVersion, jestVersion } from '../utility/custom';
/**
 * Scaffolds the basics of a Angular Material application, this includes:
 *  - Add Packages to package.json
 *  - Adds pre-built themes to styles.ext
 *  - Adds Browser Animation to app.momdule
 */
export default function(options: JestOptions): Rule {
  return chain([
    options && options.skipPackageJson ? noop() : addMaterialToPackageJson(options),
    // addThemeToAppStyles(options),
    // addAnimationRootConfig(),
    // addFontsToIndex(),
    // addBodyMarginToStyles(),
  ]);
}

/**
 * Add material, cdk, annimations to package.json
 */
function addMaterialToPackageJson(options: JestOptions) {
  return (host: Tree) => {
    addPackageToPackageJson(host, 'dependencies', 'jest', jestVersion);
    addPackageToPackageJson(host, 'dependencies', 'jest-preset-angular', jestPresetAngularVersion);
    return host;
  };
}
