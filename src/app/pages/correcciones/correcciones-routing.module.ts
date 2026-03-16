import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CorreccionesPage } from './correcciones.page';

const routes: Routes = [
  {
    path: '',
    component: CorreccionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CorreccionesPageRoutingModule {}
