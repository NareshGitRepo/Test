import { Routes } from '@angular/router';

import { PharmacyComponent } from './pharmacy.component';
import { KeyboardClassKey, IKeyboardLayouts, keyboardLayouts } from '@ngx-material-keyboard/core';

export const PharmacyRoutes: Routes = [{
    path: '',
    component: PharmacyComponent,
}];

export const customLayouts: IKeyboardLayouts = {
    ...keyboardLayouts,
    'VectraMind': {
        'name': 'VectraMind layout',
        'keys': [
            [
                ['1', '1'],
                ['2', '2'],
                ['3', '3'],
                ['4', '4'],
                ['5', '5'],
                ['6', '6'],
                ['7', '7'],
                ['8', '8'],
                ['9', '9'],
                ['0', '0'],
                [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
            ],
            [
                ['A', 'A'],
                ['Z', 'Z'],
                ['E', 'E'],
                ['R', 'R'],
                ['T', 'T'],
                ['Y', 'Y'],
                ['U', 'U'],
                ['I', 'I'],
                ['O', 'O'],
                ['P', 'P'],
            ],
            [
                ['Q', 'Q'],
                ['S', 'S'],
                ['D', 'D'],
                ['F', 'F'],
                ['G', 'G'],
                ['H', 'H'],
                ['J', 'J'],
                ['K', 'K'],
                ['L', 'L'],
                ['M', 'M'],
            ],
            [
                ['W', 'W'],
                ['X', 'X'],
                ['C', 'C'],
                ['V', 'V'],
                ['B', 'B'],
                ['N', 'N'],
            ]
        ],
        'lang': ['de-CHV']
    },
    'VectraMindNumber': {
        'name': 'VectraMindNum layout',
        'keys': [
            [
                ['1', '1','','!'],
                ['2', '2','','@'],
                ['3', '3','','#'],
                ['', '4','','$'],
                ['','5','','%'],
                ['', '6','','^'],
                ['', '7','','&'],
                ['', '8','','*'],
                ['', '9','','('],
                ['', '0','',')']
            ],
            [
                ['4', 'q','','Q'],
                ['5', 'w','','W'],
                ['6', 'e','','E'],
                ['', 'r','','R'],
                ['', 't','','T'],
                ['', 'y','','Y'],
                ['', 'u','','U'],
                ['', 'i','','I'],
                ['', 'o','','O'],
                ['', 'p','','P'],
            ],
            [
                ['7', 'a','','A'],
                ['8', 's','','S'],
                ['9', 'd','','D'],
                ['','f','','F'],
                ['','g','','G'],
                ['','h','','H'],
                ['','j','','J'],
                ['','k','','K'],
                ['','l','','L'],
            ],
            [
                ['ABC', 'NUM'],
                ['','','','shift','shift'],
                ['0','z','','Z'],
                ['','x','','X'],
                ['','c','','C'],
                ['','v','','V'],
                ['','b','','B'],
                ['','n','','N'],
                ['','m','','M'],
                ['','','',KeyboardClassKey.Bksp],
                ['','shift','shift'],
                [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
                
            ],
        ],
        'lang': ['de-CHVN']
    },
    'VectraMindWithSpace': {
        'name': 'VectraMind layout',
        'keys': [
            [
                ['1', '1'],
                ['2', '2'],
                ['3', '3'],
                ['4', '4'],
                ['5', '5'],
                ['6', '6'],
                ['7', '7'],
                ['8', '8'],
                ['9', '9'],
                ['0', '0'],
                [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
            ],
            [
                ['A', 'a'],
                ['Z', 'z'],
                ['E', 'E'],
                ['R', 'R'],
                ['T', 'T'],
                ['Y', 'Y'],
                ['U', 'U'],
                ['I', 'I'],
                ['O', 'O'],
                ['P', 'P'],
            ],
            [
                ['Q', 'Q'],
                ['S', 'S'],
                ['D', 'D'],
                ['F', 'F'],
                ['G', 'G'],
                ['H', 'H'],
                ['J', 'J'],
                ['K', 'K'],
                ['L', 'L'],
                ['M', 'M'],
            ],
            [
                ['W', 'W'],
                ['X', 'X'],
                ['C', 'C'],
                ['V', 'V'],
                ['B', 'B'],
                ['N', 'N'],
            ],
            [[KeyboardClassKey.Space, KeyboardClassKey.Space]]
        ],
        'lang': ['de-CHVS']
    },

};
