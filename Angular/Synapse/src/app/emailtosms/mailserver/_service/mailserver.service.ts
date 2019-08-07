import { Injectable } from '@angular/core';
import { IMailServer, ICreateMailServer, IResponse } from '../_model/mailserver.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { ConsumerService } from '../../../_helpers/ConsumerService';

@Injectable({ providedIn: 'root' })

export class MailServerService {

  public component = "MailBox";

  constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) { }

  mailserverList: IMailServer[] = [
    //     {serverId:1,serverName:'Server Name-1', email:'mail@example.com', password:'123456', serverip:'192.168.1.1',port:587, mailtype:'SMTP', checkedSSL:true,interval:10},
    //     {serverId:2,serverName:'Server Name-2', email:'mail@example.com', password:'123456', serverip:'192.168.1.2',port:444, mailtype:'SMTP', checkedSSL:true,interval:20},
    //     {serverId:3,serverName:'Server Name-3', email:'mail@example.com', password:'123456', serverip:'192.168.1.3',port:111, mailtype:'SMTP', checkedSSL:true,interval:5},
    //     {serverId:4,serverName:'Server Name-4', email:'mail@example.com', password:'123456', serverip:'192.168.1.4',port:5200, mailtype:'SMTP', checkedSSL:true,interval:15},
    //     {serverId:5,serverName:'Server Name-5', email:'mail@example.com', password:'123456', serverip:'192.168.1.5',port:5261, mailtype:'SMTP', checkedSSL:true,interval:10},
    //     {serverId:6,serverName:'Server Name-6', email:'mail@example.com', password:'123456', serverip:'192.168.1.6',port:999, mailtype:'SMTP', checkedSSL:true,interval:30},
    //     {serverId:7,serverName:'Server Name-7', email:'mail@example.com', password:'123456', serverip:'192.168.1.7',port:545, mailtype:'SMTP', checkedSSL:true,interval:10},
    // 
  ]

  getMailserverList() {
    return this.mailserverList;
  }

  getMailserversList(): Observable<ICreateMailServer[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getEmailServer")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<ICreateMailServer[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'emailServer');
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }

  }

  createMailSettings(mail: ICreateMailServer): Observable<IResponse> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "createEmailServer")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IResponse>(_apiurlsdetials.url, _apiurlsdetials.type, mail);
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  updateMailSettings(mailList: ICreateMailServer) {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateEmailServer");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IResponse>(_apiurlsdetials.url, _apiurlsdetials.type, mailList);
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  validateServerNameTemplate(templateName: string): Observable<IResponse> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "validateEmailServerName")
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      // let url = _apiurlsdetials.url.replace("{SmsTemplatename}", departName + '')
      return this.consumer.serviceConsumer<IResponse>(_apiurlsdetials.url, _apiurlsdetials.type, { emailServerName: templateName }, '');
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
  updatMailStatus(emailServerId: number, status: number): Observable<IResponse> {
    console.log("status==>", emailServerId, status);
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateEmailServerStatus");
    if (_apiurlsdetials) {
        const url = _apiurlsdetials.url.concat("?emailServerId=", "" + emailServerId) + '&status=' + status;
        console.log("url : =====> ", url);
        return this.consumer.serviceConsumer<IResponse>(url, _apiurlsdetials.type, null, '');
    }
    else {
        console.log("URL Get from config : ----> ", "Url not found..");
        return Observable.throw({ error: { messages: "url not found" } });
    }
}
}