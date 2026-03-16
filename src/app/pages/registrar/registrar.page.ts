import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth';
import { Load } from 'src/app/services/load';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
  standalone: false
})
export class RegistrarPage implements OnInit {


  form = new FormGroup({
    id: new FormControl(''),

    nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),

    distrito: new FormControl('Distrito 4', [Validators.required]),

    sector: new FormControl('', [Validators.required]),

    email: new FormControl('', [Validators.required, Validators.email]),

    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  constructor(
    public service: Load,
    public authService: AuthService,


  ) { }

  ngOnInit() {
  }

 async registrar() {
  if (this.form.invalid) return;

  try {
    await this.authService.registrar(this.form.value);
     this.showToast()



  } catch (error: any) {

    if (error.code === 'auth/email-already-in-use') {
      alert('Este correo ya está registrado.');
    } 
    else if (error.code === 'auth/weak-password') {
      alert('La contraseña debe tener al menos 6 caracteres.');
    } 
    else {
      alert('Ocurrió un error al registrar.');
    }

    console.error(error);
  }
}

  showToast() {
    this.service.toast('Usuario registrado con éxito', 3000, 'middle', 'success', 'checkmark-circle-outline');

  }
} 
