import * as Leaflet from 'leaflet';

export abstract class Control {
    protected map: Leaflet.Map = null;
    constructor(){
    }
    
    // called from LeafletMapComponent
    registerTarget( divElement: any ) {
        this.map = Leaflet.map( divElement, this.mapOptions() );
        this.postMapCreated();
    }
    
    protected abstract mapOptions(): Leaflet.MapOptions;
    protected abstract postMapCreated(): void;
}
