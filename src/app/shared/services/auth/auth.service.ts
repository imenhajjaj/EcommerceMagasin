import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/client'; // L'URL de votre API backend

  constructor(private router: Router, private http: HttpClient) { } // Ajout de "private" pour http

  login(credentials: { email: string, password: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);

  }


  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
 }

  logout(){
    this.router.navigate(['/']);
    localStorage.removeItem('isLogged');
  }
  isLoggedIn(){
    return localStorage.getItem('isLogged');
  }
}
