
export interface ISDCResponse {
  messages: string;
  prescMedicnese?: ISDCPrescMedicnese[];
  refilMedicnese?: ISDCRefilMedicnese[];
  status: boolean;
  template?: string;
  tokenId?: number;
  tokenNo?: string;
}
export interface IMedicineRespnse {
  messages: string;
  refilMedicines?: ISDCRefilMedicnese[];
  status: boolean;
}

export interface IDhlReqObj {
  addressId: string;
  base: string;
  city: string;
  deliveryMethod: number;
  mobile: string;
  refilMedicines: ISDCRefilMedicnese[];
  street: string;
}

export interface ISDCRefilMedicnese {
  active: boolean;
  buildingName: string;
  comercial_name: string;
  control: boolean;
  dName: string;
  dispensed_qunantiy: string;
  doctorName: string;
  name: string;
  isSelect?: boolean;
  nf: boolean;
  orderDate: string;
  pharmacyIndex: number;
  prescriptionType: string;
  refil_quantity: string;
  script_ID: string;
}

export interface ISDCPrescMedicnese {
  buildingName: string;
  control: boolean;
  doctorName: string;
  isids: boolean;
  isnf: boolean;
  name: string;
  orderDate: string;
  order_ID: string;
  prescriptionType: string;
}
export interface IDhlCity {
  id: number;
  name: string;
}
export interface IPResponse {
  kioskInfo?: IPKioskInfo;
  messages: string;
  status: boolean;
}

export interface IPKioskInfo {
  buildId: number;
  deptId: number;
  floorId: number;
  kisokLocations: IPKisokLocation[];
  orgId: number;
  pharmaIndex: number;
  pharmaLocation: string;
  pharmaMasterId: number;
  pharmaServiceTypes: IPharmaServiceType[];
  pharmaType: number;
}

export interface IPharmaServiceType {
  name: string;
  pharmaType: number;
  psTypeId: number;
  typeCode: string;
}

export interface IPKisokLocation {
  location: string;
  pharmaIndex: number;
}