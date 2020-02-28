import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {MatFormFieldModule, MatAutocompleteModule, MatInputModule, MatButtonModule} from '@angular/material';
import { MatKeyboardModule,IKeyboardLayouts, keyboardLayouts, MAT_KEYBOARD_LAYOUTS, KeyboardClassKey } from '@ngx-material-keyboard/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18N/', '.json');
}

const customLyouts: IKeyboardLayouts = {
  ...keyboardLayouts,
'TollesNum Layout': {
    'name': 'Awesome layout',
    'keys': [
      [
        ['1', '!'],
        ['2', '@'],
        ['3', '#'],
      ],
      [
        ['4', '$'],
        ['5', '%'],
        ['6', '^']
      ],
      [
        ['7','&'],
        ['8', '*'],
        ['9', '('],
      ],
      [
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp] , 
        ['0', ')'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
      ]
    ],
    'lang': ['en-num']
  },
  'TollesAN Layout': {
    'name': 'Awesome layout',
    'keys': [
      [
        ['1', '1'],
        ['2', '2'],
        ['3', '3'],
        ['','4'],
        ['','6'],
        ['','7'],
        ['','8'],
        ['','9'],
        ['','10'],
      ],
      [
        ['','Q'],
        ['','W'],
        ['','E'],
        ['','R'],
        ['','T'],
        ['','Y'],
        ['','U'],
        ['4', 'I'],
        ['5', 'O'],
        ['6', 'P']
      ],
      [
        ['','A'],
        ['','S'],
        ['','D'],
        ['','F'],
        ['','G'],
        ['','H'],
        ['7','J'],
        ['8', 'K'],
        ['9', 'L'],
      ],
      [
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp] , 
        ['0', ')'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['e-num']
  },
  'TollesAlpha Layout':{
    'name': 'Awesome layout',
    'keys':[
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['q', 'Q'],
        ['w', 'W'],
        ['e', 'E'],
        ['r', 'R'],
        ['t', 'T'],
        ['y', 'Y'],
        ['u', 'U'],
        ['i', 'I'],
        ['o', 'O'],
        ['p', 'P'],
        ['[', '{'],
        [']', '}'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
       
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['a', 'A'],
        ['s', 'S'],
        ['d', 'D'],
        ['f', 'F'],
        ['g', 'G'],
        ['h', 'H'],
        ['j', 'J'],
        ['k', 'K'],
        ['l', 'L'],
        [';', ':'],
        ['\'', '\"'],
        ['\\','|']
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['z', 'Z'],
        ['x', 'X'],
        ['c', 'C'],
        ['v', 'V'],
        ['b', 'B'],
        ['n', 'N'],
        ['m', 'M'],
        [',','<'],
        ['.','>'],
        ['/', '?'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.Alt, KeyboardClassKey.Alt, KeyboardClassKey.Alt, KeyboardClassKey.Alt]
      ]
    ],
    'lang': ['en-alpha']
  }
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatButtonModule,
    MatKeyboardModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
      }
  })
  ],
  providers: [{provide: MAT_KEYBOARD_LAYOUTS, useValue: customLyouts}],
  bootstrap: [AppComponent]
})
export class AppModule { }
