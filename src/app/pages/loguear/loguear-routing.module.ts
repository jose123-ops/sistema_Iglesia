import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoguearPage } from './loguear.page';

const routes: Routes = [
  {
    path: '',
    component: LoguearPage
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoguearPageRoutingModule {}
