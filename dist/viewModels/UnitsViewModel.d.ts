/**
 * A view model for managing location, length, area and elevation units and providing utility methods for returning unit <select>s.
 */
import cov = __cov;
import Accessor from '@arcgis/core/core/Accessor';
import { tsx } from '@arcgis/core/widgets/support/widget';
export default class UnitsViewModel extends Accessor {
    /**
     * CSS class string for <select>s.
     *
     * @default 'esri-select'
     */
    selectClass: string;
    /**
     * Current location unit.
     */
    locationUnit: string;
    /**
     * Available location unit and display text key/value pairs.
     */
    locationUnits: {
        dec: string;
        dms: string;
    };
    /**
     * Current length unit.
     */
    lengthUnit: esri.LinearUnits;
    /**
     * Available length unit and display text key/value pairs.
     */
    lengthUnits: {
        meters: string;
        feet: string;
        kilometers: string;
        miles: string;
        'nautical-miles': string;
        yards: string;
    };
    /**
     * Current area unit.
     */
    areaUnit: esri.ArealUnits;
    /**
     * Available area unit and display text key/value pairs.
     */
    areaUnits: {
        acres: string;
        ares: string;
        hectares: string;
        'square-feet': string;
        'square-meters': string;
        'square-yards': string;
        'square-kilometers': string;
        'square-miles': string;
    };
    /**
     * Current elevation unit.
     */
    elevationUnit: string;
    /**
     * Available elevation unit and display text key/value pairs.
     */
    elevationUnits: {
        feet: string;
        meters: string;
    };
    constructor(properties?: cov.UnitsViewModelProperties);
    /**
     * Return location <select> which updates `locationUnit` property on change.
     *
     * @param name <select> `name` attribute
     * @param title <select> `title` attribute
     */
    locationSelect(name?: null | string, title?: null | string): tsx.JSX.Element;
    /**
     * Return length <select> which updates `lengthUnit` property on change.
     *
     * @param name <select> `name` attribute
     * @param title <select> `title` attribute
     */
    lengthSelect(name?: null | string, title?: null | string): tsx.JSX.Element;
    /**
     * Return area <select> which updates `areaUnit` property on change.
     *
     * @param name <select> `name` attribute
     * @param title <select> `title` attribute
     */
    areaSelect(name?: null | string, title?: null | string): tsx.JSX.Element;
    /**
     * Return elevation <select> which updates `elevationUnit` property on change.
     *
     * @param name <select> `name` attribute
     * @param title <select> `title` attribute
     */
    elevationSelect(name?: null | string, title?: null | string): tsx.JSX.Element;
    private _createUnitOptions;
}
