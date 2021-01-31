# cov-arcgis-esm

[![npm version][npm-img]][npm-url]
[![build status][travis-img]][travis-url]

[npm-img]: https://img.shields.io/npm/v/cov-arcgis-esm.svg?style=flat-square&color=success
[npm-url]: https://www.npmjs.com/package/cov-arcgis-esm
[travis-img]: https://img.shields.io/travis/CityOfVernonia/cov-arcgis-esm/main.svg?style=flat-square
[travis-url]: https://travis-ci.com/CityOfVernonia/cov-arcgis-esm

City of Vernonia widgets and friends for Esri JavaScript API in ESM.

### Install

```shell
npm install cov-arcgis-esm --save
```

### Usage

The [Typescript](https://www.typescriptlang.org/) modules in this package are intended to be used directly. No built modules are provided.

Include the `src` directory in `tsconfig.json`.

```json
{
  "include": [
    "node_modules/cov-arcgis-esm/src/**/*"
  ]
}
```

Import the `cov` namespace as needed with `import cov = __cov`.

Add package alias to `resolve` in `webpack.config.js`.

```javascript
const config = {
  resolve: {
    alias: {
      cov: path.resolve(__dirname, 'node_modules/cov-arcgis-esm/src/'),
    },
  },
};
```

### Sass

Widget and layout styles are `.scss` files intended to be used with [Sass](https://sass-lang.com/). Most, if not all `.scss` files use variables in `~@arcgis/core/assets/esri/themes/base/color` (or similar for other themes), and need to be imported after a `@arcgis/core/` import containing the color variables.

### Modules

[View Models](./src/viewModels/)

[Widgets](./src/widgets/)

[Layouts](./src/layouts/)

[Popups](./src/popups/)
