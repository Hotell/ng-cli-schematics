# @martin_hotell/schematics

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Greenkeeper badge](https://badges.greenkeeper.io/Hotell/ng-cli-schematics.svg)](https://greenkeeper.io/)
[![Travis](https://img.shields.io/travis/Hotell/ng-cli-schematics.svg)](https://travis-ci.org/Hotell/ng-cli-schematics)
[![Dev Dependencies](https://david-dm.org/Hotell/ng-cli-schematics/dev-status.svg)](https://david-dm.org/Hotell/ng-cli-schematics?type=dev)
[![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

Scaffolding library for Angular applications with better defaults.

@martin_hotell/schematics provides blueprints for generating Angular apps with better defaults/tooling. Built on top of `Schematics`, it integrates with the `Angular CLI` to make setting up Angular applications easier.

### Installation

`npm i @martin_hotell/schematics -D`

or

`yarn add @martin_hotell/schematics -D`

## Dependencies

None :)

## Default Schematics Collection

To use `@martin_hotell/schematics` as the default collection in your Angular CLI project,
add it to your `.angular-cli.json`:

```sh
ng set defaults.schematics.collection=@martin_hotell/schematics
```

The [collection schema](./src/collection.json) also has aliases to the most common blueprints used to generate files.

## App Setup

Generate new Angualr app with better defaults/tools!

**NOTE:**

> There is ongoing issue with schematics/angularCLI so custom collections doesn't work when installed globally for booting new apps.
>
> Follow [this issue](https://github.com/angular/devkit/issues/528) to get updated on the status.
>
> You need to do following nasty workaround to make it work:

> ```sh
> mkdir -p /usr/local/lib/node_modules/@angular/cli/node_modules/@martin_hotell/schematics
>
> cp -R /usr/local/lib/node_modules/@martin_hotell/schematics/* /usr/local/lib/node_modules/@angular/cli/node_modules/@martin_hotell/schematics
> ```

> 👉 update your path to global npm packages accordingly to your environment `/usr/local/lib/node_modules`

```sh
npx -p @angular-devkit/schematics-cli -p @angular-devkit/schematics -p @angular-devkit/core -p @angular/cli -p typescript -p @martin_hotell/schematics -c "ng new my-app --collection @martin_hotell/schematics"
```

or if you like to pollute your global environment:

**Install:**

```sh
npm i -g @angular/cli @martin_hotell/schematics
```

```
ng new my-app --collection @martin_hotell/schematics
# or
ng new my-app -c @martin_hotell/schematics
```

## Blueprints

* [Application](./docs/application.md)

### Testing

To test locally, install `@angular-devkit/schematics-cli` globally and use the `schematics` command line tool. That tool acts the same as the `generate` command of the Angular CLI, but also has a debug mode turned on.

Check the documentation with

```bash
schematics --help
```

### Unit Testing

`npm test` will run the unit tests, using [Jest](https://facebook.github.io/jest/) as a runner and test framework.

### Publishing

To publish, simply do:

```bash
npm run release

git push --follow-tags origin master

npm publish
```

That's it! 🖖
