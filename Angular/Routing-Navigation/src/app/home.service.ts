import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn:'root'
})
export class HomeService{
    constructor(private http:HttpClient){
    }

    public users:any=[];

    getUsers(){
      /*  if(this.users.length){
            return new Observable(subscriber =>{
                res => {     
                    subscriber.next(this.users);
                }
            })
        } //if
      */
     return this.http.get("http://jsonplaceholder.typicode.com/users");

    } //getuser

    getUserdetails(id){
        return this.http.get("http://jsonplaceholder.typicode.com/users?id="+id);
    }
    getComments(){
           return this.http.get("http://jsonplaceholder.typicode.com/comments")
    } //getcomments

    getPosts(){
         return   this.http.get("http://jsonplaceholder.typicode.com/posts");
    } //getposts

}