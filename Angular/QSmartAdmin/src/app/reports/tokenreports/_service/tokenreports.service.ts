
import { Injectable } from '@angular/core';
import { IFloor, ITokenReport} from '../_model/tokenreports.model';

@Injectable({
  providedIn: 'root'
})

export class TokenReportService {
  Floor:IFloor[] = [
      {floorId:'F1',floorName:'Floor-1',
      department:[
          {deptId:'Dept1',deptName:'Department-1',service:[{serviceId:'Ser1',serviceName:'Service-1'},{serviceId:'Ser2',serviceName:'Service-2'},{serviceId:'Ser3',serviceName:'Service-3'}]},
          {deptId:'Dept2',deptName:'Department-2',service:[{serviceId:'Ser8',serviceName:'Service-8'},{serviceId:'Ser9',serviceName:'Service-9'}]},
          {deptId:'Dept3',deptName:'Department-3',service:[{serviceId:'Ser10',serviceName:'Service-10'}]}
        ]},
      {floorId:'F2',floorName:'Floor-2',
      department:[
        {deptId:'Dept4',deptName:'Department-4',service:[{serviceId:'Ser4',serviceName:'Service-4'},{serviceId:'Ser5',serviceName:'Service-5'}]}
      ]},
      {floorId:'F3',floorName:'Floor-3',
      department:[
        {deptId:'Dept5',deptName:'Department-5',service:[{serviceId:'Ser6',serviceName:'Service-6'}]}
      ]},
      {floorId:'F4',floorName:'Floor-4',
      department:[
        {deptId:'Dept6',deptName:'Department-6',service:[{serviceId:'Ser7',serviceName:'Service-7'}]}
      ]}
  ]

  TokenReport:ITokenReport[] = [
      { tokenNo:'MN5231',mrnNo:'3264789501',patientName:'Srinivas',appointmentTime:'03/06/2019, 10:55',checkinTime:'03/06/2019, 10:55',checkinMode:'Kiosk',department:'Cardiology',service:'Family Medicine Walk-in'},
      { tokenNo:'MN5232',mrnNo:'3264789502',patientName:'Anand',appointmentTime:'03/06/2019, 10:55',checkinTime:'03/06/2019, 10:55',checkinMode:'Manual',department:'Cardiology',service:'Family Medicine Walk-in'},
      { tokenNo:'MN5233',mrnNo:'3264789503',patientName:'Kumar',appointmentTime:'03/06/2019, 10:55',checkinTime:'03/06/2019, 10:55',checkinMode:'Kiosk',department:'Cardiology',service:'Family Medicine Walk-in'},
      { tokenNo:'MN5234',mrnNo:'3264789504',patientName:'Rajeev',appointmentTime:'03/06/2019, 10:55',checkinTime:'03/06/2019, 10:55',checkinMode:'Manual',department:'Cardiology',service:'Family Medicine Walk-in'},
      { tokenNo:'MN5235',mrnNo:'3264789505',patientName:'Chandoo',appointmentTime:'03/06/2019, 10:55',checkinTime:'03/06/2019, 10:55',checkinMode:'Kiosk',department:'Cardiology',service:'Family Medicine Walk-in'}
  ]


  constructor() { }

  getAllFloors(){
      return this.Floor;
  }

  getTokenReport(){
    return this.TokenReport;
  }
}