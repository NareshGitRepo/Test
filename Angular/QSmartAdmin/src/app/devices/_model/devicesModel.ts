export interface IMenu {
  description: string;
  type: string;
  typeId: number;
}

export interface IkioskResponse {
  id?: number;
  messages: string;
  status: boolean;
}
export interface IprinterList {
  destPrinter: string;
  printId: number;
}

export enum deviceType {
  Kiosks = "Kiosks",
  DisplayBoards = "DisplayBoards",
  Printers = "Printers",
}

export interface IKiosk {
  kioskId: number;
  kioskIp: string;
  kioskMenuCollection: KioskMenuCollection[];
  kioskName: string;
  orgKisok: OrgKisok;
  printerName: string;
  status: number;
}

export interface OrgKisok {
  orgId: number;
  organization: string;
}

export enum displaybyIndex {
  Kiosks = 0,
  DisplayBoards = 1,
  Printers = 2,
}

export interface IKioskStatus {
  kioskId: number;
  status: number;
}

export interface ICreateKiosk {
  kioskIp: string;
  kioskMenuCollection: KioskMenuCollection[];
  kioskName: string;
  floorId: number;
  orgId: number;
  printerName: any;
  kioskId?: number;
}

export interface kioskMenuCollection {
  typeId: number;
}

export interface kisokHospaitaLlist {
  id: number;
  hospital: string;
}

export interface displayType {
  id: string;
  displaybrdtype: string;
}



export interface IDepartements {
  departmentGetDto: DepartmentGetDto[];
}

export interface DepartmentGetDto {
  deptId: number;
  deptName: string;
  deptPrefix: string;
  earlyCheckin: number;
  lateCheckin: number;
  orgDept: OrgDept;
  roomCollectionList: RoomCollectionList[];
  status: number;
}

export interface RoomCollectionList {
  roomNumber: string;
  roomType: number;
}

export interface OrgDept {
  id: number;
  organization: string;
}
export interface IDisplay {
  displayId?: number;
  orgId: number;
  displayName: string;
  displayType: string;
  displayArea: string;
  departmentCollection: DepartmentCollection1[];
  serviceCollection: ServiceCollection[];
  status?: number;
  floorId?: number
}

export interface ServiceCollection {
  services: number[];
}

export interface DepartmentCollection1 {
  departments: number[];
}

export interface DepartmentCollection {
  deptId: number;
}

export interface IDisplayList {
  departmentCollection: DepartmentCollection[];
  displayArea: string;
  displayId: number;
  displayName: string;
  displayType: string;
  orgDisplay: string;
  status: number;
}
export interface displyDeptList {
  id: number;
  deptname: string;
}

export interface distinations {
  id: number;
  distination: string;
}

export interface KioskApiResponse {
  kioskId: number;
  kioskIp: string;
  kioskMenuCollection: KioskMenuCollection[];
  kioskName: string;
  orgId: number;
}

export interface KioskMenuCollection {
  typeId: number;
  checked: boolean;
}

export interface IFacility {
  hospitals: Hospital[];
}

export interface Hospital {
  partyId: number;
  organization: string;
  emailId: string;
  mobileNo: string;
  address: string;
  logoPath: string;
  status: number;
  partyType: number;
  nodalName?: any;
}

export interface Department {
  deptId: number;
  deptName: string;
}

export interface IService {
  serviceId: number;
  serviceEngName: string;
  serviceArName?: string;
}

export interface DisplayBoard {
  orgId: number;
  displayId: number;
  floorId: number;
  floorName: string;
  displayName: string;
  displayArea: string;
  displayType: string;
  departments: Department[];
  services: IService[];
}

export interface IDisplayBoard {
  displayBoards: DisplayBoard[];
  status?: any;
}

export interface IDisplayResponse {
  displayId: number;
  displayOrg: DisplayOrg;
  displayName: string;
  displayType: string;
  displayArea: string;
  departmentCollection: DepartmentCollection[];
  status: number;
}

export interface DepartmentCollection {
  deptId: number;
  checked?: boolean;
}

export interface DisplayOrg {
  id: number;
  organization: string;
}

export interface IPrinter {
  destPrinter: string;
  orgId: OrgKisok;
  printId: number;
  printerName: string;
  printerNo: string;
  status?: number;
}

export interface IPrintersData {
  destPrinter: string;
  orgId: number;
  printId?: number;
  printerName: string;
  printerNo: string;
  floorId: number;
  status?: number;
}

export interface IDisplayStatus {
  displayId: string;
  status?: number
}

export interface IPrinterStatus {
  printId: string;
  status?: number;
}

export interface IService {
  id: number,
  serveiceName: string
}

export interface Level {
  floorId: number;
  floorName: string;
  status: number;
}

export interface LevelInfo {
  levels: Level[];
}


export interface Service {
  deptId: number;
  deptName: string;
  endToken: number;
  floorId: number;
  floorName: string;
  npEarlyCheckin: number;
  npLateCheckin: number;
  orgId: number;
  serviceArName: string;
  serviceEngName: string;
  serviceId: number;
  serviceLocation: string;
  servicePrefix: string;
  startToken: number;
  status: number;
}

export interface IDepartment {
  deptId: number;
  deptName: string;
  floorId: number;
  orgId: number;
  services?: Service[];
  status: number;
}

export interface Floor {
  departments?: IDepartment[];
  floorId: number;
  floorName: string;
  orgId: number;
}

export interface ILevelDeptService {
  floors: Floor[];
}