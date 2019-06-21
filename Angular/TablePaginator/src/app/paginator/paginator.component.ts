import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';


@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'elename', 'symbol'];
  dataSource = new MatTableDataSource<AngularElement>(ELEMENT_DATA);
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

 
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    }
  applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
    
}

export interface AngularElement {
  name: string;
  position: number;
  elename: string;
  symbol: string;
 }

const ELEMENT_DATA: AngularElement[] = [
  {position: 1,
    name: 'Button',
    elename:'<mat-button>',
    symbol: 'B',},
  {position: 2,
    name: 'Input',
    elename:'<mat-Input>',
    symbol: 'I',},
  {position: 3,
    name: 'Datepicker',
    elename:'<mat-Datepicker>',
    symbol: 'D',},
  {position: 4,
    name: 'Slider',
    elename:'<mat-Slider>',
    symbol: 's',},
  {position: 5,
    name: 'menu',
    elename:'<mat-Menu>',
    symbol: 'M',},
  {position: 6,
    name: 'Sidenav',
    elename:'<mat-sidenav>',
    symbol: 'S',},
  {position: 7,
    name: 'Toolbar',
    elename:'<mat-toolbar>',
    symbol: 'T',},
  {position: 8,
    name: 'Card',
    elename:'<mat-card>',
    symbol: 'C',},
  {position: 9,
    name: 'Expansion panel',
    elename:'<mat-expansion-panel>',
    symbol: 'E-P',},
  {position: 10,
  name:'List',
  elename:'<mat-list>',
  symbol:'L'}
  
];




