import { Injectable } from "@angular/core";
import { IUserQuota } from "../_model/userquota.model";

@Injectable({providedIn:'root'})

export class UserQuotaService {
userQuotaList:IUserQuota[] = [{deptName:"IT",userName:"User 1",platformCredits:1000,accountType:"Prepaid",availableBalance:2000,expiryDate:"04/22/2019",departmentCredit:2000, adjustmentType:"Recharge"},
{deptName:"Accounts",userName:"User 2",platformCredits:1000,accountType:"Postpaid",currentThresholdLimit:"80%",expiryDate:"04/23/2019",adjustmentType:"Recharge"},
{deptName:"IT",userName:"User 3",platformCredits:1000,accountType:"Postpaid",currentThresholdLimit:"80%",expiryDate:"04/21/2019", adjustmentType:"Rollback"},
{deptName:"Accounts",userName:"User 4",accountType:"Prepaid",platformCredits:1000,availableBalance:9999,expiryDate:"04/20/2019",departmentCredit:1000, adjustmentType:"Recharge"},
{deptName:"Accounts",userName:"User 5",accountType:"Prepaid",platformCredits:1000,availableBalance:9999,expiryDate:"04/22/2019",departmentCredit:4000, adjustmentType:"Rollback"},
{deptName:"Accounts",userName:"User 6",accountType:"Prepaid",platformCredits:1000,availableBalance:9999,expiryDate:"04/19/2019",departmentCredit:2000, adjustmentType:"Recharge"}]

getUsertQuotaList()
{
    return this.userQuotaList;
}
}