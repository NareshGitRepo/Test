import { Component } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { IResponse, IMenu, Submenu } from './_model';
import * as _ from 'lodash';
/**
 * Food data with nested structure.
 * Each node has a name and an optiona list of children.
 */
export interface FoodNode {
  name: string;
  children?: FoodNode[];
}

// const TREE_DATA: FoodNode[] = [
//   {
//     name: 'Fruit',
//     children: [
//       {name: 'Apple'},
//       {name: 'Banana'},
//       {name: 'Fruit loops'},
//     ]
//   }, {
//     name: 'Vegetables',
//     children: [
//       {
//         name: 'Green',
//         children: [
//           {name: 'Broccoli'},
//           {name: 'Brussel sprouts'},
//         ]
//       }, {
//         name: 'Orange',
//         children: [
//           {name: 'Pumpkins'},
//           {name: 'Carrots'},
//         ]
//       },
//     ]
//   },
// ];

/**
 * @title Tree with nested nodes
 */

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DynamicMenuPrivileges';
  public menudata:IMenu[];
  public menuname:FoodNode[]=[];
  public submenu:FoodNode[];
  public subname=[];
  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();

  constructor(public http:HttpClient) {
    this.http.get("http://202.65.159.118:9097/menu/1/all/21").subscribe((result:IResponse)=>{
      this.menudata=result.data;
     console.log('menudata=>',this.menudata)
     this.menudata.forEach(x =>{
      this.submenu=[];
       x.submenu.forEach(y=>{
        this.submenu.push({name:y.name});
      });
      this.menuname.push({name:x.name,children:this.submenu});
      });
     console.log('menuname=>',this.menuname);
    },err =>{
      console.log('error')
    });
    
    this.dataSource.data =this.menuname;
  }

  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;
}
