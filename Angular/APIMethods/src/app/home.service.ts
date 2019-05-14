import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
    providedIn:'root'
})

export class HomeService{
    constructor(private http:HttpClient){
    }

    public users:any=[];
   
    //get method 
    getUsers(){
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

    //get method with query param
    getComments(){
        return new Observable(subscriber => {
            this.http.get("http://jsonplaceholder.typicode.com/comments?id="+2).subscribe(
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
    } //getcomments

    
}