/**
 * Node for to-do item
 */
export class TodoItemNode {
    children: TodoItemNode[];
    item: string;
  }
  
  /** Flat to-do item node with expandable and level information */
  export class TodoItemFlatNode {
    item: string;
    level: number;
    expandable: boolean;
  }
  
  export interface IResponse {
    status:boolean;
    message:string;
    data:IMenu[];
  }
  export interface Submenu {
    name: string;
    link: string;
    id: string;
  }
  
  export interface IMenu {
    name: string;
    link: string;
    icon: string;
    submenu: Submenu[];
    id: string;
  }
