import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class Authservice {
  appUrl = environment.apiUrl;
  private platformId = inject(PLATFORM_ID);
  constructor(private http: HttpClient, private router: Router) { }
  getToken() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  isLoggedIn() {
    return !!this.getToken();
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.router.navigate(['login']);
  }



  login(email: string, password: string) {

    this.http.post(`${this.appUrl}/auth/login`, {
      email: email,
      password: password
    }).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['dashboard']);
      },
      error: () => {
        alert('Invalid credentials');
      }
    });

  }
}
