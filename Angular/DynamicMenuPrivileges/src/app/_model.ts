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