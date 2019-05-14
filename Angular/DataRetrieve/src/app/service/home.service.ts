import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
    providedIn:'root'
})
export class HomeService{
    constructor(private http:HttpClient){
    }

    public users:any=[];

    getUsers(){
        if(this.users.length){
            return new Observable(subscriber =>{
                res => {     
                    subscriber.next(this.users);
                }
            })
        } //if

        return new Observable(subscriber => {
            this.http.get("http://jsonplaceholder.typicode.com/users").subscribe(
                res => {
                    this.users=res;
                    subscriber.next(res);
                    subscriber.complete();
                },
                error => {
                    console.log(error);
                    
                }
            )
        })
    } //getuser

    
}