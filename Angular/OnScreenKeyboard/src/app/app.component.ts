import { Component, ViewChild, ElementRef, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgModel, NgControl, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatKeyboardService, MatKeyboardRef, MatKeyboardComponent, IKeyboardLayout, MAT_KEYBOARD_LAYOUTS } from '@ngx-material-keyboard/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // kboardForm: FormGroup;
  title = 'OnScreenKeyboard';
  lang = 'English';
  defaultLocale: string = 'ar';
  darkTheme: boolean;
  duration: number;
  isDebug: boolean;
  layout: string;
  layouts: {
    name: string;
    layout: IKeyboardLayout;
  }[];
  attachModelValue = '';
  subscription;
  private _keyboardRef: MatKeyboardRef<MatKeyboardComponent>;

  @ViewChild('attachTo', { read: ElementRef, static: true })
  private _attachToElement: ElementRef;

  @ViewChild('attachTo', { read: NgModel, static: true })
  private _attachToControl: NgControl;

  constructor(public fb: FormBuilder, public translate: TranslateService, private _keyboardService: MatKeyboardService, @Inject(LOCALE_ID) public locale,
    @Inject(MAT_KEYBOARD_LAYOUTS) private _layouts) {
    translate.setDefaultLang('arb');
    translate.addLangs(['en', 'arb']);
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

    console.log('_keyboardRef', this._keyboardRef);

    // reference the input element
    this._keyboardRef.instance.setInputInstance(this._attachToElement);

    // set control
    this._keyboardRef.instance.attachControl(this._attachToControl.control);
  }
  readInput(event) {
    console.log('readInput=>', event);
  }
  ngOnInit() {
    // this.kboardForm = this.fb.group({
    //   kboard:['',[Validators.required]]
    // })
    
  }
}
