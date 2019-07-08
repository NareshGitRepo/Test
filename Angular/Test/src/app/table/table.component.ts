import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TableComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  dataSource = ELEMENT_DATA;
  columnsToDisplay = ['name', 'attri', 'symbol', 'position'];
  expandedElement: PeriodicElement | null;
}

export interface PeriodicElement {
  name: string;
  position: number;
  attri: string;
  symbol: string;
  description: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 1,
    name: 'Button',
    attri: 'mat-button',
    symbol: 'B',
    description: `Native <button> and <a> elements are always used in order to provide the most straightforward and accessible experience for users. A <button> element should be used whenever some action is performed. 
        An <a> element should be used whenever the user will navigate to another view.`
  }, {
    position: 2,
    name: 'Input',
    attri:'mat-Input',
    symbol: 'I',
    description: `All of the attributes that can be used with normal <input> and <textarea> elements can be used on elements inside <mat-form-field> as well. This includes Angular directives such as ngModel and formControl.
                   The only limitation is that the type attribute can only be one of the values supported by matInput.`
  }, {
    position: 3,
    name: 'Datepicker',
    attri:'mat-Datepicker',
    symbol: 'D',
    description: `The datepicker allows users to enter a date either through text input, or by choosing a date from the calendar. It is made up of several components and directives that work together.`
  }
];
