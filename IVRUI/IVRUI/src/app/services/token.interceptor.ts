import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { AuthenticationService } from "./authentication.service";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/do";
import { Router, ActivatedRoute } from "@angular/router";
import { AppConfig } from "../AppConfig";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(private auth: AuthenticationService, private router: Router,
        private _appConfig: AppConfig) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log("TokenInterceptor:intercept:");
        // console.log("Token : ---> ", this.auth.getToken());
        request = request.clone({
            setHeaders: {
                // Authorization: `Bearer ${this.auth.getToken()}`
                Authorization: this.auth.getToken() || ""
            }
        });

        // return next.handle(request); //
        // const reqTimeout = this._appConfig.getReqTimeout() || 10000;
        // console.log("TokenInterceptor:ReqTimout : --> ", reqTimeout);
        return next.handle(request).do((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                // do stuff with response if you want
                console.log("TokenInterceptor:HttpResponse:");
                console.log("Event : --> ", event);
            }
        }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                console.log("TokenInterceptor:HttpErrorResponse:");
                // this.router.navigate(["/error"]);
                console.log("Router URL : --> ", this.router.url);
                // this.router.navigate(["/error"], { queryParams: { error: "Not Authorized", returnUrl: this.router.url } });
                if (err.status === 401) {
                    console.log("401 ERROR");
                    this.auth.logout();
                    // redirect to the login route
                    // this.router.navigate(["/"]);
                    this.router.navigate(["/error"], { queryParams: { error: "Not Authorized", returnUrl: this.router.url } });
                }
                if (err.status === 599) {
                    console.log("599 ERROR");
                    this.auth.logout();
                    // redirect to the login route
                    // this.router.navigate(["/"]);
                    this.router.navigate(["/timeout"], { queryParams: { error: "Session Timeout", returnUrl: this.router.url } });
                }
            }
        });

    }
}
