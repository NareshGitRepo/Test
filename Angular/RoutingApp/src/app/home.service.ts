import { Component, Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn:'root'
})

export class HomeService{

    constructor(private http:HttpClient){
    }

    public users:any=[];

    getUsers(){
           return this.http.get("http://jsonplaceholder.typicode.com/users");
    }
    getUserdetails(id){
        return this.http.get("http://jsonplaceholder.typicode.com/users/"+id);
    }

    getService(){
        return this.http.get("http://jsonplaceholder.typicode.com/comments");
          }

    getAbout(){
        return this.http.get("http://jsonplaceholder.typicode.com/posts");
    
    }
}