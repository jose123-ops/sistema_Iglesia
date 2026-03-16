import { Component, OnInit } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login-component.component.html'
})
export class LoginComponent implements OnInit {

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {

    onAuthStateChanged(this.auth, user => {
      if (user) {
        this.router.navigate(['/miembros']);
      }
    });

  }

}