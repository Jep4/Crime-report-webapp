import { Routes } from '@angular/router';
import { DataTableComponent } from './data-table/data-table.component';
import { MapDisplayComponent } from './map-display/map-display.component';

const routes: Routes = [
  { path: 'data-table', component: DataTableComponent },
  { path: 'map-display', component: MapDisplayComponent },
];

export default routes;
