import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        if (localStorage.getItem("currentUser")) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page
        this.router.navigate([""]);
        return false;
    }


}
