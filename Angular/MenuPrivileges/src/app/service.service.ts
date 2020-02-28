import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IMenu, TodoItemNode, IResponse } from './_model';
import * as _ from 'lodash';


/**
 * The Json object for to-do list data.
 */
const TREE_DATA = {
  Groceries: {
    'Almond Meal flour':'Almond',
    'Organic eggs':'Eggs',
    'Protein Powder': 'Boost',
    'Fruits':'Kiwi'
  },
  Reminders: [
    'Cook dinner',
    'Read the Material Design spec',
    'Upgrade Application to Angular'
  ]
};

@Injectable()
export class ServiceService {
 public menudata:IMenu[];
 public menu=[];
 public submenu;
 public menuname=[];
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);

  get data(): TodoItemNode[] { return this.dataChange.value; }

  constructor(public http:HttpClient) {
    this.initialize();

    this.http.get("http://202.65.159.118:9097/menu/1/all/21").subscribe((result:IResponse)=>{
     this.menudata=result.data;
     console.log('menudata=>',this.menudata)
     this.menudata.forEach(x =>{
      this.submenu=[];
       x.submenu.forEach(y=>{
        this.submenu.push(y.name);
      });
      this.menuname.push(x.name,this.submenu);
      });
      console.log('menudata=>',this.menudata);
      console.log('this.menuname=>',this.menuname);
      console.log('this.submenu=>',this.submenu)
    },err =>{
      console.log('error')
    });
  }
  initialize() {
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    const data = this.buildFileTree(TREE_DATA,0);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(obj: {[key: string]: any}, level: number): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TodoItemNode();
      node.item = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }
}
