import * as Leaflet from 'leaflet';

export abstract class Operation {
    constructor( private targetKey: string ){}
    get target(): string { return this.targetKey; }
    abstract execute( marker?: Leaflet.Marker ): Leaflet.Marker;
}

export class RemoveOperation extends Operation {
    constructor( targetKey: string ){ super( targetKey ); }
    execute( marker?: Leaflet.Marker ): Leaflet.Marker { return null; }
}

export class MoveOperation extends Operation {
    constructor( targetKey: string, private lat: number, private lng: number, private option?: Leaflet.MapOptions ){
        super( targetKey );
    }
    execute( marker?: Leaflet.Marker ): Leaflet.Marker {
        if( marker ) {
            return marker.setLatLng( [ this.lat, this.lng ] ); // 戻り値は this なので、新しいオブジェクトは作られない (Leaflet API)
        } else {
            return Leaflet.marker( [ this.lat, this.lng ], this.option );
        }
    }
}
