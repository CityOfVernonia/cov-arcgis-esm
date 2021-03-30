"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Accessor_1 = tslib_1.__importDefault(require("@arcgis/core/core/Accessor"));
const decorators_1 = require("@arcgis/core/core/accessorSupport/decorators");
let VernoniaViewModel = class VernoniaViewModel extends Accessor_1.default {
    constructor(properties) {
        super(properties);
    }
};
tslib_1.__decorate([
    decorators_1.property()
], VernoniaViewModel.prototype, "view", void 0);
VernoniaViewModel = tslib_1.__decorate([
    decorators_1.subclass('cov.Vernonia.VernoniaViewModel')
], VernoniaViewModel);
exports.default = VernoniaViewModel;
