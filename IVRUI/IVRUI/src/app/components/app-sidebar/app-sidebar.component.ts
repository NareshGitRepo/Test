import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-sidebar",
  templateUrl: "./app-sidebar.component.html"
})
export class AppSidebarComponent implements OnInit {

  name: string;

  ngOnInit(): void {
    console.log("AppSidebarComponent:ngOnInit:")
    this.name = "vinod";
  }

}
