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

  // Updated login method to accept email instead of username
  login(credentials: { email: string; password: string }): Observable<any> {
    // Map email to username for backend compatibility
    const payload = {
      email: credentials.email, // CHANGED: Send email in the username field
      password: credentials.password,
    };

    return this.http.post<any>(`${this.apiUrl}/auth/token/`, payload).pipe(
      tap((response) => {
        if (response && response.access) {
          console.log(response);

          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh || '');
          this._isAuthenticated.next(true);
        }
      })
    );
  }

  // Register user - This is already correct
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register/`, userData);
  }

  // Refresh token - No changes needed
  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http
      .post<any>(`${this.apiUrl}/auth/token/refresh/`, {
        refresh: refreshToken,
      })
      .pipe(
        tap((response) => {
          if (response && response.access) {
            localStorage.setItem('access_token', response.access);
          }
        })
      );
  }

  // Logout user - No changes needed
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this._isAuthenticated.next(false);
    this.router.navigate(['/login']);
  }

  // Check if user is logged in - No changes needed
  isLoggedIn(): boolean {
    return this.hasToken();
  }

  // Get authentication state as observable - No changes needed
  get isAuthenticated$(): Observable<boolean> {
    return this._isAuthenticated.asObservable();
  }

  // Get user profile - No changes needed
  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/profile/`);
  }

  // Update user profile - No changes needed
  updateUserProfile(profileData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/auth/profile/`, profileData);
  }

  // Check for token - No changes needed
  private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }

  // Get token - No changes needed
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}
