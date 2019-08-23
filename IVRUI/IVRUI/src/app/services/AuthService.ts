import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Router, Route, NavigationStart } from '@angular/router';

@Injectable()
export class AuthService implements CanActivate {
    AuService: any;
    roles: any;

    canActivate(childroute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {

        if (localStorage.getItem("role") === "admin") {
            return true;
        } else {
            return false;
        }
    }

    canActivateChild(childroute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return false;
    }
}






