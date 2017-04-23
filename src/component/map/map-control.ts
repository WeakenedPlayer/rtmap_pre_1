import * as Leaflet from 'leaflet';

export abstract class Control {
    private leafletMap: Leaflet.Map = null;
    protected get map(): Leaflet.Map { return this.leafletMap; }

    // 制御対象となるマップコンポーネントが構築されたら呼び出される。
    registerTarget( divElement: any ) {
        this.leafletMap = Leaflet.map( divElement, this.mapOptions() );
        this.postRegistered();
    }

    protected abstract mapOptions(): Leaflet.MapOptions;
    protected abstract postRegistered(): void;
}
