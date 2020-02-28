import { CanActivate } from "@angular/router";
import { RouterModule, Router } from '@angular/router';
import { Injectable } from "@angular/core";

@Injectable()
export class AppGuard implements CanActivate {
    constructor(private router: Router) { }
    canActivate() {
        console.log("AlwaysAuthGuard");
        // this.router.navigate(['/dashboard', ]);
        this.router.navigate(['/dashboard'], { queryParams: { kioskid: 1 } });
        return true;
    }
} 