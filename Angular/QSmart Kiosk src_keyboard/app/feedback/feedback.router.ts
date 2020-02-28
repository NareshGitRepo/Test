import { IKeyboardLayouts, KeyboardClassKey, keyboardLayouts } from '@ngx-material-keyboard/core';

import { FeedbackComponent } from './feedback.component';
import { Routes } from '@angular/router';

export const FeedbackRoutes: Routes = [{
    path: '',
    component: FeedbackComponent
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
                ['E', 'e'],
                ['R', 'r'],
                ['T', 't'],
                ['Y', 'y'],
                ['U', 'u'],
                ['I', 'i'],
                ['O', 'o'],
                ['P', 'p'],
                [KeyboardClassKey.Caps, KeyboardClassKey.Caps]

            ],
            [
                ['Q', 'q'],
                ['S', 's'],
                ['D', 'd'],
                ['F', 'f'],
                ['G', 'g'],
                ['H', 'h'],
                ['J', 'j'],
                ['K', 'k'],
                ['L', 'l'],
                ['M', 'm'],
            ],
            [
                ['W', 'w'],
                ['X', 'x'],
                ['C', 'c'],
                ['V', 'v'],
                ['B', 'b'],
                ['N', 'n'],
            ],
            [[KeyboardClassKey.Space, KeyboardClassKey.Space]],

        ],
        'lang': ['de-CHVCAPS']
    },

};


