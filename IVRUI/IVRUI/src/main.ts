import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";


if (environment.production) {
  enableProdMode();
  console.log = function () {
    return false;
  }
}

platformBrowserDynamic().bootstrapModule(AppModule);
