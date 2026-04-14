import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

const routes: Routes = [
 
  {
    path: '',
    redirectTo: 'loguear',
    pathMatch: 'full'
  },

    {
      path: 'loguear',
      loadChildren: () => import('./pages/loguear/loguear.module').then( m => m.LoguearPageModule),
      
    },
  {
    path: 'registrar',
    loadChildren: () => import('./pages/registrar/registrar.module').then( m => m.RegistrarPageModule)},
  {
    path: 'miembros',
    loadChildren: () => import('./pages/miembros/miembros.module').then( m => m.MiembrosPageModule),canActivate: [authGuard]  },
  {
    path: 'correcciones',
    loadChildren: () => import('./pages/correcciones/correcciones.module').then( m => m.CorreccionesPageModule)
  },
  {
    path: 'movimientos',
    loadChildren: () => import('./pages/movimientos/movimientos.module').then( m => m.MovimientosPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
