import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  templateUrl: "599.component.html"
})
export class P599Component implements OnInit {

  title: string;
  url: string;
  public n = 10;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    // this.title = this.route.snapshot.paramMap.get("title");
    // this.title = this.route.snapshot.queryParams["returnUrl"] || "/";
    this.title = this.route.snapshot.queryParams["error"];
    this.url = this.route.snapshot.queryParams["returnUrl"];
    console.log("Title : ", this.title);
    console.log("url : ", this.url);

    const inter = setInterval(() => {
      this.n = this.n - 1;
      console.log("===>", this.n);
    }, 1000);

    setTimeout((router: Router) => {
      clearInterval(inter);
      this.router.navigate(["/"], { queryParams: {returnUrl: this.url } });
    }, 10000);  // 5000 --> 5 secs  // 60000  --> 1 min

  }

}
