    
import { Injectable } from "@angular/core";
import{HttpClient} from "@angular/common/http";
@Injectable({
     providedIn:'root'
})
export class Homeservice{
    constructor(private http: HttpClient){
            
    }
    public user:any=[];
    
    getuser(){
        return this.http.get("http://jsonplaceholder.typicode.com/users");
    }
}