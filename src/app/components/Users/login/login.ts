import { Component } from '@angular/core';
import { Authservice } from '../../../auth/service/authservice';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {


  email = '';
  password = '';

  /**
   *
   */
  constructor(private authService: Authservice) {
  }

  login() {
    this.authService.login(this.email, this.password);
  }
}