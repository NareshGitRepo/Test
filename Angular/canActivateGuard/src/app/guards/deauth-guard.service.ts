import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, CanDeactivate } from '@angular/router';
import { UserComponent } from '../dashboard/user/user.component';


@Injectable()
export class DeauthGuardService implements CanDeactivate<UserComponent>{
  
  constructor(private _authService: AuthService, private _router: Router) { }
  canDeactivate(component:UserComponent , 
               currentRoute: import("@angular/router").ActivatedRouteSnapshot, 
               currentState: import("@angular/router").RouterStateSnapshot, 
               nextState?: import("@angular/router").RouterStateSnapshot): boolean | import("@angular/router").UrlTree | import("rxjs").Observable<boolean | import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {
               
      // return component.canDeactivate(component) || window.confirm("Are you sure ?");
      return false;
  }
}
