/**
 * A view model for managing location, length, area and elevation units and providing utility methods for returning unit <select>s.
 */
import { __decorate } from "tslib";
import Accessor from '@arcgis/core/core/Accessor';
import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import { tsx } from '@arcgis/core/widgets/support/widget';
let KEY = 0;
let UnitsViewModel = class UnitsViewModel extends Accessor {
    constructor(properties) {
        super(properties);
        /**
         * CSS class string for <select>s.
         *
         * @default 'esri-select'
         */
        this.selectClass = 'esri-select';
        /**
         * Current location unit.
         */
        this.locationUnit = 'dec';
        /**
         * Available location unit and display text key/value pairs.
         */
        this.locationUnits = {
            dec: 'Decimal Degrees',
            dms: 'Degrees Minutes Seconds',
        };
        /**
         * Current length unit.
         */
        this.lengthUnit = 'feet';
        /**
         * Available length unit and display text key/value pairs.
         */
        this.lengthUnits = {
            meters: 'Meters',
            feet: 'Feet',
            kilometers: 'Kilometers',
            miles: 'Miles',
            'nautical-miles': 'Nautical Miles',
            yards: 'Yards',
        };
        /**
         * Current area unit.
         */
        this.areaUnit = 'acres';
        /**
         * Available area unit and display text key/value pairs.
         */
        this.areaUnits = {
            acres: 'Acres',
            ares: 'Ares',
            hectares: 'Hectacres',
            'square-feet': 'Square Feet',
            'square-meters': 'Square Meters',
            'square-yards': 'Square Yards',
            'square-kilometers': 'Square Kilometers',
            'square-miles': 'Square Miles',
        };
        /**
         * Current elevation unit.
         */
        this.elevationUnit = 'feet';
        /**
         * Available elevation unit and display text key/value pairs.
         */
        this.elevationUnits = {
            feet: 'Feet',
            meters: 'Meters',
        };
    }
    /**
     * Return location <select> which updates `locationUnit` property on change.
     *
     * @param name <select> `name` attribute
     * @param title <select> `title` attribute
     */
    locationSelect(name, title) {
        return (tsx("select", { class: this.selectClass, name: name || '', title: title || '', bind: this, onchange: (evt) => {
                this.locationUnit = evt.target.value;
            } }, this._createUnitOptions(this.locationUnits, this.locationUnit)));
    }
    /**
     * Return length <select> which updates `lengthUnit` property on change.
     *
     * @param name <select> `name` attribute
     * @param title <select> `title` attribute
     */
    lengthSelect(name, title) {
        return (tsx("select", { class: this.selectClass, name: name || '', title: title || '', bind: this, onchange: (evt) => {
                this.lengthUnit = evt.target.value;
            } }, this._createUnitOptions(this.lengthUnits, this.lengthUnit.toString())));
    }
    /**
     * Return area <select> which updates `areaUnit` property on change.
     *
     * @param name <select> `name` attribute
     * @param title <select> `title` attribute
     */
    areaSelect(name, title) {
        return (tsx("select", { class: this.selectClass, name: name || '', title: title || '', bind: this, onchange: (evt) => {
                this.areaUnit = evt.target.value;
            } }, this._createUnitOptions(this.areaUnits, this.areaUnit.toString())));
    }
    /**
     * Return elevation <select> which updates `elevationUnit` property on change.
     *
     * @param name <select> `name` attribute
     * @param title <select> `title` attribute
     */
    elevationSelect(name, title) {
        return (tsx("select", { class: this.selectClass, name: name || '', title: title || '', bind: this, onchange: (evt) => {
                this.elevationUnit = evt.target.value;
            } }, this._createUnitOptions(this.elevationUnits, this.elevationUnit)));
    }
    // create <options>
    _createUnitOptions(units, defaultUnit) {
        const options = [];
        for (const unit in units) {
            options.push(tsx("option", { key: KEY++, value: unit, selected: unit === defaultUnit }, units[unit]));
        }
        return options;
    }
};
__decorate([
    property()
], UnitsViewModel.prototype, "selectClass", void 0);
__decorate([
    property()
], UnitsViewModel.prototype, "locationUnit", void 0);
__decorate([
    property()
], UnitsViewModel.prototype, "locationUnits", void 0);
__decorate([
    property()
], UnitsViewModel.prototype, "lengthUnit", void 0);
__decorate([
    property()
], UnitsViewModel.prototype, "lengthUnits", void 0);
__decorate([
    property()
], UnitsViewModel.prototype, "areaUnit", void 0);
__decorate([
    property()
], UnitsViewModel.prototype, "areaUnits", void 0);
__decorate([
    property()
], UnitsViewModel.prototype, "elevationUnit", void 0);
__decorate([
    property()
], UnitsViewModel.prototype, "elevationUnits", void 0);
UnitsViewModel = __decorate([
    subclass('cov.viewModels.UnitsViewModel')
], UnitsViewModel);
export default UnitsViewModel;
