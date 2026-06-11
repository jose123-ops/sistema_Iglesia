import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { CustomInputComponent } from './custom-input/custom-input.component';
import { AgregarMiembroComponent } from './agregar-miembro/agregar-miembro.component';
import { VermiembroComponent } from './vermiembro/vermiembro.component';
import { TrasladarMiembroComponent } from './trasladar-miembro/trasladar-miembro.component';



@NgModule({
  declarations: [
      HeaderComponent,
      CustomInputComponent,
      AgregarMiembroComponent,
      VermiembroComponent
  ,TrasladarMiembroComponent  
],

  exports: [
  HeaderComponent,
    ReactiveFormsModule,
    FormsModule,
    CustomInputComponent ,
   AgregarMiembroComponent,
   VermiembroComponent,
   TrasladarMiembroComponent
 
  ],

  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
  
   
  ]
})
export class SharedModule { }
