import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DataTableComponent } from './data-table/data-table.component';
import { MapDisplayComponent } from './map-display/map-display.component'; 
import appRoutes from './app.routes';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Md5 } from 'ts-md5';
import { StorageService } from './storage.service'

@NgModule({
  declarations: [
    AppComponent,
    DataTableComponent,
    MapDisplayComponent, 
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    Md5

  ],
  providers: [Md5,
    StorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
