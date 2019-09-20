import { Injectable } from '@angular/core';
import { LoadApiUrls } from '../../_helpers/api.urls';
import { ConsumerService } from '../../_helpers/ConsumerService';
import { Observable } from 'rxjs';
import { IRoles } from '../_model/previlegemodel';


@Injectable({
  providedIn: 'root'
})
export class PrivilegesService {

  public component = "Previleges";

  constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) { }


private allRolesInfo:Array<any> = [{
  'Home': [
    'Dashboard',
  ],
  'Admin Manager': [
  'Clients',
  'Groups',
  'Facility',
  'Departments',
  'HL7 Configuration',
  'Devices',
  'Queues'
],
  'UserManagement': [
    'Users',
    'Roles',
    'Privileges',
  ],
  'Token Service': [
    'Token Service'
  ],
  'Mapping':[
      'RoomMapping',
      'DoctorNurseMapping'
    ],
  'Reports':[
    'CurrentTokens',
    'TokensHistory',
    'CurrentDayAppointments',
    'AppointmentHistory'
  ],
  'Notifications':[
    'Kiosk Errors',
  ]

}];




getRolesByUserRoleId(): Observable<IRoles[]> {
  let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getRolesByUserRoleId")
  console.log("URL Get from config : =====>  ", _apiurlsdetials);
  if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      let _apiUrl = _apiurlsdetials.url
      return this.consumer.serviceConsumer<IRoles[]>(_apiUrl, _apiurlsdetials.type, null, '');
  }
  else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
  }
}
getallRolesInfo(){
  return this.allRolesInfo;
}


}
