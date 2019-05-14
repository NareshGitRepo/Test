import { Component } from "@angular/core";

@Component({
    selector:'Table',
    templateUrl:'table.component.html',
    styleUrls:['table.component.scss']
})

export class TableComponent{
    public employee:any=[
        {
          id:200519,
          name:"mani",
          sal:20000,
          job:"ui developer",
        },
        {
          id:300619,  
          name:"naresh",
          sal:22000,
          job:"java developer",
        },
        {
          id:200819,
          name:"prasad",
          sal:25000,
          job:"oracle developer",
        },
        {
          id:120618,
          name:"stella",
          sal:18000,
          job:"Actor",
        },
        {
          id:251118,
          name:"martin",
          sal:12000,
          job:"Actor",
        },
      ];
}

