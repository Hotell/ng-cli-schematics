# @martin_hotell/schematics

[![Greenkeeper badge](https://badges.greenkeeper.io/Hotell/ng-cli-schematics.svg)](https://greenkeeper.io/)

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

Generate new app with better defaults

```sh
npx -p @angular/cli -p @martin_hotell/schematics -c 'ng new my-app --collection @martin_hotell/schematics'
```

or if you like to pollute your global environment:

```sh
npm i -g @angular/cli @martin_hotell/schematics

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

`npm test` will run the unit tests, using Jasmine as a runner and test framework.

### Publishing

To publish, simply do:

```bash
npm run release

git push --follow-tags origin master

npm publish
```

That's it!
