import { ConsumerService } from '../../../_helpers/ConsumerService';
import {IMsgPriorityInfo, ServiceList} from "../_model/prioritizationmodel";
import { IResponse } from '../_model/prioritizationmodel';
import { Injectable } from "@angular/core";
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PrioritizationService {
  public component = "Prioritization";


  constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) { }

getPrioritizationData():Observable<IMsgPriorityInfo[]>{
  //return this.prioritizationData;


        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllPriorityInfo")
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ----> ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IMsgPriorityInfo[]>(_apiurlsdetials.url, _apiurlsdetials.type, "" , "msgPriorityInfo", 0);
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
      }


      updatePriorityDescription(data):Observable<IResponse>{console.log("data : ",data);
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updatePriorityDescription")
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ----> ", _apiurlsdetials.url);
            //let url = _apiurlsdetials.url.replace('{priorityid}',data.priorityId).replace('{prioritydesc}',data.priorityDesc+'');
            return this.consumer.serviceConsumer<IResponse>(_apiurlsdetials.url, _apiurlsdetials.type, data, "", 0);
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }


        }
        getServicesByPriorityId(priorityid:number):Observable<ServiceList[]>{
            console.log("priorityid",priorityid);
            let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllServiceInfoByProirityId")
            console.log("URL Get from config : =====> ", _apiurlsdetials);
            if (_apiurlsdetials) {
                console.log("URL Get from config : ----> ", _apiurlsdetials.url);
                let url = _apiurlsdetials.url.replace("{priorityid}",''+priorityid);
                return this.consumer.serviceConsumer<ServiceList[]>(url, _apiurlsdetials.type,'', "prorities");
            }
            else {
                console.log("URL Get from config : ----> ", "Url not found..");
                return Observable.throw({ error: { messages: "url not found" } });
            }
     }


   



}
