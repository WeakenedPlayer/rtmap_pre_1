import { NgModule, ModuleWithProviders } from '@angular/core';
import { LeafletMapComponent } from './components/map/map.component';
import { LeafletTileComponent } from './components/tile/tile.component';
import { LeafletMarkerComponent } from './components/marker/marker.component';

@NgModule({
  declarations: [
    LeafletMapComponent,
    LeafletTileComponent,
    LeafletMarkerComponent,
  ],
  imports: [
  ],
  exports: [
    LeafletMapComponent,
    LeafletTileComponent,
    LeafletMarkerComponent
  ],
  providers: [
  ],
})
export class LeafletModule {
}
