

export interface IRoom {
  roomType: RoomType[];
}

export interface RoomType {
  rmTypeId: number;
  roomName: string;
}

export interface IRoomResponse {
  id?: any;
  messages: string;
  status: boolean;
}

export interface ICreateRoom {
  floorId: number;
  orgId: number;
  rooms: Room[];
}

export interface Room {
  allowedToAccess?:number;
  roomNameAb: string;
  roomNameEn: string;
  roomNumber: string[];
  roomType: number;
}

export interface RoomList {
  allowedToAccess:number;
  roomNameEn: string;
  roomNameAb: string;
  roomNumber: string;
  rmTypeId: string;
}

export interface Level {
  floorId: number;
  floorName: string;
  status: number;
}

export interface IRoomManagementList {
  allowedToAccess:number;
  floorId: number;
  orgId: number;
  roomId: number;
  roomNameAb: string;
  roomNameEn: string;
  roomNumber: string;
  roomType: number;
  roomTypeDsc: string;
}

//
export interface IRoom1 {
  allowedToAccess: number;
  floorId: number;
  orgId: number;
  roomId: number;
  roomNumber: string;
  status: number;
}

export interface IRoomGroup {
  roomNameAb: string;
  roomNameEn: string;
  rooms: IRoom1[];
}

export interface IRoomTypeInfo {
  roomGroups: IRoomGroup[];
  roomType: number;
  roomTypeDsc: string;
}

//

export interface IRoomsList {
  roomType: number;
  roomTypeDsc: string;
}

export interface IUpdateRooms {
  allowedToAccess: number;
  floorId: number;
  orgId: number;
  roomNameAb: string;
  roomNameAbOld: string;
  roomNameEn: string;
  roomNameEnOld: string;
  roomType: number;
}
export interface IDeleteData {
  floorId: number;
  orgId: number;
  rooms: IDeleteRoom[];
}

export interface IDeleteRoom {
  allowedToAccess: number;
  roomNameAb: string;
  roomNameEn: string;
  roomNumber: string[];
  roomType: number;
}

