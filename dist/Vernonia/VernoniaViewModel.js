import { __decorate } from "tslib";
import Accessor from '@arcgis/core/core/Accessor';
import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
let VernoniaViewModel = class VernoniaViewModel extends Accessor {
    constructor(properties) {
        super(properties);
    }
};
__decorate([
    property()
], VernoniaViewModel.prototype, "view", void 0);
VernoniaViewModel = __decorate([
    subclass('cov.Vernonia.VernoniaViewModel')
], VernoniaViewModel);
export default VernoniaViewModel;
