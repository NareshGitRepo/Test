import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { AppConfig } from '../../_helpers/app.config';
import { ILogIn, ILogInResponse } from '../_models/login';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { map } from 'rxjs-compat/operator/map';
import { LoadApiUrls } from '../../_helpers/api.urls';




@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    constructor(private http: HttpClient, private appconfig: AppConfig, private loadApiUrls: LoadApiUrls) { }

    login(login: ILogIn): Observable<ILogInResponse> {
        
        console.log("this.appconfig.getServiceUrl::" + this.appconfig.getServiceUrl());
        console.log("LogIn Data ::" + JSON.stringify(login));
        return this.http.post<ILogInResponse>(this.appconfig.getServiceUrl() + '/auth/login1', login);
    }

    getUserRoleInfo(roleId: any) {
        console.log("UserService:roleId:: ", roleId);
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const httpOptions = {
            headers: new HttpHeaders({
                "Content-Type": "text/plain",
            })
        };
        console.log("URL : ---->  ", this.appconfig.getServiceUrl() + "/roles/" + currentUser.data.userId + "/all/" + roleId);
        return this.http.get<any>(this.appconfig.getServiceUrl() + "/roles/" + currentUser.data.userId + "/all/" + roleId,
            httpOptions)
            .map((response) => {
                console.log("UserService:roleId:: Service Response : ", response);
                return response;
            });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        console.log("Successfully logout ....");
    }


    public getToken(): string {
        console.log("AuthenticationService:getToken:");
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        // console.log("AuthenticationService: AuthToken : ===> ", currentUser);// && currentUser.token);
        return currentUser;// && currentUser.token;
    }


    handleError<T>(serviceName = '', operation = 'operation', result = {} as T) {

        return (error: HttpErrorResponse): Observable<T> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            const message = (error.error instanceof ErrorEvent) ?
                error.error.message :
                `server returned code ${error.status} with body "${error.error}"`;

            // TODO: better job of transforming error for user consumption
            //  this.messageService.add(`${serviceName}: ${operation} failed: ${message}`);
            console.log('Error =>', message);

            // Let the app keep running by returning a safe result.
            return of(result);
        };

    }

    saveCreation(_addDetails): Observable<any> {
        const _details = {
            "login": _addDetails.login,
            "firstname": _addDetails.firstname,
            "lastname": _addDetails.lastname,
            "isactive": "1",
            "makerChecker": "1",
            "company": _addDetails.company,
            "contactNo": _addDetails.contactNo,
            "roles": _addDetails.roles
        }
        console.log("Details:::", _details);

        console.log("this.appconfig.getServiceUrl::" + this.appconfig.getServiceUrl());
         let apiUrl = this.appconfig.getServiceUrl() + '/users/3/create';
        return this.http.post<any>(apiUrl, _details)
            .map((response) => {
                console.log("SignUpService ::: response ==> ", response);
                return response;
            });
    }
}