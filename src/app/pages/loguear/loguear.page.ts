import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth';

@Component({
  selector: 'app-loguear',
  templateUrl: './loguear.page.html',
  styleUrls: ['./loguear.page.scss'],
  standalone: false
})
export class LoguearPage implements OnInit {

    form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),

  })
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

async onLogin() {
  try {
    await this.authService.login(
      this.form.value.email ?? '',
      this.form.value.password ?? ''
    );

  } catch (error: any) {
    alert('Correo o contraseña incorrectos');
  }
}

}
