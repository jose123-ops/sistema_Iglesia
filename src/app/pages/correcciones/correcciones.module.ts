import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CorreccionesPageRoutingModule } from './correcciones-routing.module';

import { CorreccionesPage } from './correcciones.page';
import { SharedModule } from 'src/app/Shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CorreccionesPageRoutingModule,
    SharedModule,
  ],
  declarations: [CorreccionesPage]
})
export class CorreccionesPageModule {}
