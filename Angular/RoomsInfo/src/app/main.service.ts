import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  // pathparam:any;
  // url:any="http://202.65.158.172:9097/room/{loginid}/floor-rooms/all/{floorid}";

  constructor( private http:HttpClient) { }
                         
    
  getfloorid(loginid,floorid){ 
    let Getpath = "http://202.65.158.172:9097/room/{loginid}/floor-rooms/all/{floorid}";
    Getpath = Getpath.replace('{loginid}', loginid).replace('{floorid}', floorid);
    return this.http.get(Getpath);
  }
  
  createRoom(result,loginId){
   let cpath="http://202.65.158.172:9097/room/{loginid}/create";
   cpath=cpath.replace('{loginid}',loginId);
   return this.http.post(cpath,result);
  }

  updateRoom(updateresult,loginId){
    let upath="http://202.65.158.172:9097/room/{loginId}/updaterooms";
    upath=upath.replace('{loginId}',loginId);
    return this.http.put(upath,updateresult);
  }
  
  deleteRoom(roomslist,loginId){
    let dpath="http://202.65.158.172:9097/room/{loginId}/delete";
    dpath=dpath.replace('{loginId}',loginId);
   return this.http.put(dpath,roomslist);
  }
  validUser(username,loginId){
    let vpath="http://202.65.158.172:9097/users/{loginid}/validate?username="+username;
    vpath=vpath.replace('{loginid}',loginId);
    return this.http.get(vpath);
  }
  ValidMrnNo(kioskid,mrn){
    let vmpath="http://202.65.158.172:9097/kiosk/{kioskid}/mrn/validate?mrnno="+mrn;
    vmpath=vmpath.replace('{kioskid}',kioskid);
    return this.http.get(vmpath);
  }
  DeleteUserId(UserId,loginId){
    let dupath="http://202.65.158.172:9097//users/{loginid}/delete/{userId}";
    dupath=dupath.replace('{loginid}',loginId).replace('{userId}',UserId);
    return this.http.delete(dupath);
  }
}
