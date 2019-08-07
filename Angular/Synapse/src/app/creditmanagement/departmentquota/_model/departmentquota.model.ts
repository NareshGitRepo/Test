export interface IDepartment {
  deptId: number;
  deptName: string;
  deptcredit: IDeptcredit;
  creditType: CreditType;
  description: string;
  status: number;
}

export interface IDeptcredit {
  availableCredit: number;
  creditTypeId: number;
  deptCreditId: number;
  deptId: number;
  thresoldLimit: number;
}

export interface CreditType {
  creditCode: string;
  creditName: string;
  creditTypeId: number;
}

export interface IUpdateCredit {
  availableCredit: number;
  creditTypeId: number;
  deptCreditId: number;
  deptId: number;
  modifiedCredit: number;
  thresoldLimit: number;
  transactionType: number;
}

export interface IResponse {
  id: number;
  message: string;
  status: boolean;
}