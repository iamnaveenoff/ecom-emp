import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';
  private refreshTokenKey = 'refreshToken';
  private userDetailsKey = 'userDetails';
  private userRoleKey = 'userRoles';

  storeTokens(token: string, refreshToken: string, userDetails: any): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    localStorage.setItem(this.userDetailsKey, JSON.stringify(userDetails));
    localStorage.setItem(this.userRoleKey, userDetails.role);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  getUserDetails(): any | null {
    const userDetails = localStorage.getItem(this.userDetailsKey);
    return userDetails ? JSON.parse(userDetails) : null;
  }

  clearTokens(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userDetailsKey);
  }

  isUserAdmin(): boolean {
    const userRole = localStorage.getItem('userRoles'); // Example storage of user role
    return userRole === 'ADMIN';
  }
}
