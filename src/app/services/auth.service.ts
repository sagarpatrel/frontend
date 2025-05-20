import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = '/api';
  private _isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private router: Router) {}

  // Login user
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login/`, credentials).pipe(
      tap((response) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          this._isAuthenticated.next(true);
        }
      })
    );
  }

  // Register user
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register/`, userData);
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('token');
    this._isAuthenticated.next(false);
    this.router.navigate(['/login']);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.hasToken();
  }

  // Get authentication state as observable
  get isAuthenticated$(): Observable<boolean> {
    return this._isAuthenticated.asObservable();
  }

  // Get user profile
  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/profile/`);
  }

  // Update user profile
  updateUserProfile(profileData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/auth/profile/`, profileData);
  }

  // Check for token
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  // Get token
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
