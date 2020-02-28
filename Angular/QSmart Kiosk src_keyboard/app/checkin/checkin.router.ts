import { Routes } from '@angular/router';

import { CheckinComponent } from './checkin.component';
import { KeyboardClassKey, IKeyboardLayouts, keyboardLayouts } from '@ngx-material-keyboard/core';

export const CheckinRoutes: Routes = [{
    path: '',
    component: CheckinComponent
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
                ['1', '1'],
                ['2', '2'],
                ['3', '3']
            ],
            [
                ['4', '4'],
                ['5', '5'],
                ['6', '6']
            ],
            [
                ['7', '7'],
                ['8', '8'],
                ['9', '9']
            ],
            [
                ['0', '0'],
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

