export interface IErrorInfo {
  errors: Error[];
  messages?: string;
  status?: boolean;
}

export interface Error {
  errorType?: ErrorType;
  id: number;
  messageAr: string;
  messageEn: string;
  status?: number;
  org?: Org;
}

export interface Org {
  orgId: number;
  organization: string;
}

export interface ErrorType {
  errorName: string;
  errorTypeId?: number;
}

export interface Level {
  floorId: number;
  floorName: string;
  status: number;
}

export interface LevelInfo {
  levels: Level[];
}