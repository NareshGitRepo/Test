import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class RoleGuardService implements CanActivate{

  constructor(private authService: AuthService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const user = this.authService.decode();

    if (user.role === route.data.role) {
      return true;
    }
    window.alert("You don't have permission to view this page");
    // navigate to not found page
    this.router.navigate(['/404']);
    return false;
  }
}
