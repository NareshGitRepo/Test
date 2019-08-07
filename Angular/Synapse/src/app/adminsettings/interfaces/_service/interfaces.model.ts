// export interface IInterface {
  //   interfaceName: string;
  //   interfaceCode: string;
  //   interfaceDescription: string;
  //   status: string;
  //   createdBy: string;
  //   createdDate: string;
  //   modifiedBy: string;
  //   modifiedDate: string;
  // }
  export interface IInterfaceCreate {
    interfaceCode: string;
    interfaceDesc: string;
    interfaceName: string;
}
export interface IInterfaceRes {
  id: number;
  message: string;
  status: boolean;
}
export interface InterfaceInfo {
  interfaceCode: string;
  interfaceDesc: string;
  interfaceId?: number;
  interfaceName: string;
  status?: number;
}
