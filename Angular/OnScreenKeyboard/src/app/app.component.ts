import { Component, ViewChild, ElementRef, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgModel, NgControl } from '@angular/forms';
import { MatKeyboardService, MatKeyboardRef, MatKeyboardComponent, IKeyboardLayout, MAT_KEYBOARD_LAYOUTS } from '@ngx-material-keyboard/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'OnScreenKeyboard';
  lang='English';
  defaultLocale:string='ar';
  darkTheme: boolean;
  duration: number;
  isDebug: boolean;
  layout: string;

  layouts: {
    name: string;
    layout: IKeyboardLayout;
  }[];

  private _keyboardRef: MatKeyboardRef<MatKeyboardComponent>;
  
  @ViewChild('attachTo', { read: ElementRef,static:false })
  private _attachToElement: ElementRef;

  @ViewChild('attachTo', { read: NgModel,static:true })
  private _attachToControl: NgControl;

  constructor(public translate:TranslateService,private _keyboardService: MatKeyboardService, @Inject(LOCALE_ID) public locale,
  @Inject(MAT_KEYBOARD_LAYOUTS) private _layouts){
    translate.setDefaultLang('arb');
    translate.addLangs(['en','arb']);
  }
  switchLanguage(language: string) {
    this.translate.use(language);
  }

  openAttachedKeyboard(locale = this.defaultLocale) {
    this._keyboardRef = this._keyboardService.open(locale, {
      darkTheme: this.darkTheme,
      duration: this.duration,
      isDebug: this.isDebug
    });

    console.log('_keyboardRef',this._keyboardRef);
    
    // reference the input element
    this._keyboardRef.instance.setInputInstance(this._attachToElement);

    // set control
    this._keyboardRef.instance.attachControl(this._attachToControl.control);
  }
  ngOnInit() {
    // this.defaultLocale = ` ${this.locale}`.slice(0);
    // this.layouts = Object
    //   .keys(this._layouts)
    //   .map((name: string) => ({
    //     name,
    //     layout: this._layouts[name]
    //   }))
    //   .sort((a, b) => a.layout.name.localeCompare(b.layout.name));
  }
}
