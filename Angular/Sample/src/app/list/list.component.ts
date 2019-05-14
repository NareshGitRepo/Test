import { Component } from "@angular/core";

@Component({
    selector:'list',
    templateUrl:'list.component.html',
    styleUrls:['list.component.scss']
})

export class ListComponent{
    public Electronics:any=['computers','mobiles','camera','monitor','tracors'];
    public student:any=[
        {id:541,name:'scott',course:'java'},
        {id:623,name:'smith',course:'angular'},
        {id:879,name:'martin',course:'php'},
        {id:623,name:'smith',course:'angular'}
    ];
    
}