import { Component, TemplateRef, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = ' Dialog Box ';
  
  @ViewChild('Reference',{static: false}) Reference: TemplateRef<any>;

  constructor(public dialog: MatDialog, public translate:TranslateService){
    translate.setDefaultLang('en');
    translate.addLangs(['en', 'hn','tlg','arb']);
    console.log('title length',this.title.length );
    console.log('title length',this.title.trim().length );
  }
  switchLanguage(language: string) {
    this.translate.use(language);
  }

  DialogWithTemplateRef(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef);
  }

  DialogWithoutRef() {
    this.dialog.open(this.Reference);
  }
   
}
