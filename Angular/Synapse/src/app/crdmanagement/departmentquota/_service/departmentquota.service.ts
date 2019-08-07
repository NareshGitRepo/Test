import { Injectable } from '@angular/core';
import { IDepartmentQuota, IHistory } from '../_model/departmentquota.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentquotaService {

  departmentQuota:IDepartmentQuota[]=[
    {platformCredits:2000,department:"IT",accountType:"Prepaid",availableBalance:622,adjustmentType:"Recharge",credits:5000,expiryDate:"23/06/2019"},
    {platformCredits:2000,department:"Finance",accountType:"Postpaid",currentThresholdLimit:"60%",expiryDate:"23/06/2019",adjustmentType:"Recharge"},
    {platformCredits:2000,department:"Health",accountType:"Prepaid",availableBalance:622,adjustmentType:"Recharge",credits:5000,expiryDate:"23/06/2019"},
    {platformCredits:2000,department:"Agriculter",accountType:"Postpaid",currentThresholdLimit:"80%",expiryDate:"23/06/2019",adjustmentType:"Recharge"},
    {platformCredits:2000,department:"Defence",accountType:"Prepaid",availableBalance:622,adjustmentType:"Recharge",credits:5000,expiryDate:"23/06/2019"}
  ]
  historyDetails:IHistory[]=[
    {txnDateTime:"23/04/2019 06:33:53",department:"IT",platformCredits:200,accountType:"Postpaid",availableBalance:6000,adjustmentType:"Rollback",credits:8000,expirtDate:"23/06/2019"},
    {txnDateTime:"23/04/2019 14:56:53",department:"IT",platformCredits:200,accountType:"Postpaid",availableBalance:6000,adjustmentType:"Rollback",credits:8000,expirtDate:"23/06/2019"},
  
  ]
  getDepartmentQuota(){
    return this.departmentQuota;
  }
  getHistory(){
    return this.historyDetails
  }
}
