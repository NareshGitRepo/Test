 export interface IGlobalGetRes {
    systemParameter: IGlobalGet[];
  }
  
   export interface IGlobalGet {
    parameterId: number;
    parameterName: string;
    parameterType: string,
    value: string;
  }

  export interface IGlobalupdateRes {
    id: number;
    message: string;
    status: boolean;
  }