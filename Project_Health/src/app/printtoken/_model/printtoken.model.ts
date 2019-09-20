
export interface ITokens {
    apptDate: string;
    aptType: string;
    deptArbName: string;
    deptEngName: string;
    doctorname: string;
    floorArbName: string;
    floorEngName: string;
    mrnNo: string;
    orgName: string;
    patientName: string;
    serviceArbName: string;
    serviceEngName: string;
    ticketId: number;
    tokenNo: string;
}

export interface IPrintTokenData {
    apptDate: string;
    deptEngName: string;
    floorEngName: string;
    mrnNo: string;
    serviceArbName: string;
    serviceEngName: string;
    tokenNo: string;
}

export interface IPrintResponse {
    messages: string;
    status: boolean;
    template: string;
    token: string;
}
export interface IPrinter {
    destPrinter: string;
    floorId: number;
    floorName: string;
    org: IOrg;
    printId: number;
    printerName: string;
    printerNo: string;
    status: number;
  }
  export interface IOrg {
    orgId: number;
    organization: string;
  }
  export interface IResponse {
    messages: string;
    status: boolean;
    template: string;
    tokenNo: string;
    tokenId:number;
  }