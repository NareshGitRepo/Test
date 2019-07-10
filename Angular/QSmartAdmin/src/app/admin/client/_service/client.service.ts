import { ICreateClient, Iupdatestatus, Org, IValidate, IResponse, ILicenseData } from "../_model/client.model";

import { ConsumerService } from "../../../_helpers/ConsumerService";
import { HttpClient } from "@angular/common/http";
import { IHospitals } from "../../../users/_model/IUsers";
import { Injectable } from "@angular/core";
import { LoadApiUrls } from "../../../_helpers/api.urls";
import { Observable } from "rxjs";

@Injectable()
export class ClientService {
  public component = "Client";
  Success: any;
  Failure: any;

  constructor(
    private http: HttpClient,
    private apiUrls: LoadApiUrls,
    private consumer: ConsumerService
  ) { }


  getAllClients() {
    const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(
      this.component,
      "getAllClients"
    );

    if (_apiurlsdetials) {
      console.log(
        "URL Get from ClientService: getAllClients: ---->  ",
        _apiurlsdetials
      );
      return this.consumer.serviceConsumer<any>(
        _apiurlsdetials.url,
        _apiurlsdetials.type,
        "",
        "",
        0
      );
    } else {
      console.log(
        "URL Get from ClientService: getAllClients: ---->  ",
        "Url not found.."
      );
      return Observable.throw({ error: { message: "url not found" } });
    }
  }

  createClient(client): Observable<IResponse> {
    console.log("JSON : " + JSON.stringify(client));

    const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(
      this.component,
      "createClient"
    );
    if (_apiurlsdetials) {
      console.log(
        "URL Get from ClientService: createClient: ---->  ",
        _apiurlsdetials
      );
      return this.consumer.serviceConsumer<IResponse>(
        _apiurlsdetials.url,
        _apiurlsdetials.type,
        client,
        "",
        0
      );
    } else {
      console.log(
        "URL Get from ClientService: createClient: ---->  ",
        "Url not found.."
      );
      return Observable.throw({ error: { message: "url not found" } });
    }
  }

  valdiateAndReadData(file): Observable<IValidate> {
    const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "valdiateAndReadData");

    if (_apiurlsdetials) {
      console.log(
        "URL Get from ClientService: updateClientInfo: ---->  ",
        _apiurlsdetials
      );
      return this.consumer.serviceConsumer<IValidate>(
        _apiurlsdetials.url,
        _apiurlsdetials.type,
        file,
        "",
        1
      );
    } else {
      console.log(
        "URL Get from ClientService: updateClientInfo: ---->  ",
        "Url not found.."
      );
      return Observable.throw({ error: { message: "url not found" } });
    }
  }

  uplaodLogoFile(logo): Observable<any> {
    const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "uplaodLogoFile");
    if (_apiurlsdetials) {
      console.log(
        "URL Get from ClientService: updateClientInfo: ---->  ",
        _apiurlsdetials
      );
      return this.consumer.serviceConsumer<any>(
        _apiurlsdetials.url,
        _apiurlsdetials.type,
        logo,
        "",
        1
      );
    } else {
      console.log(
        "URL Get from ClientService: updateClientInfo: ---->  ",
        "Url not found.."
      );
      return Observable.throw({ error: { message: "url not found" } });
    }
  }

  updateClientStat(client): Observable<Iupdatestatus> {
    const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(
      this.component,
      "updateClientStat"
    );
    const _apiurlsdetials1 = this.apiUrls
      .getApiServiceUrlByComponentAndMethod(this.component, "updateClientStat")
      .url.replace("{orgid}", client.orgId)
      .replace("{status}", client.status);

    if (_apiurlsdetials) {
      console.log(
        "URL Get from ClientService: updateClientInfo: ---->  ",
        _apiurlsdetials
      );
      return this.consumer.serviceConsumer<Iupdatestatus>(
        _apiurlsdetials1,
        _apiurlsdetials.type,
        status,
        "",
        0
      );
    } else {
      console.log(
        "URL Get from ClientService: updateClientInfo: ---->  ",
        "Url not found.."
      );
      return Observable.throw({ error: { message: "url not found" } });
    }
  }

  updateClientInfo(client): Observable<IResponse> {
    const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(
      this.component,
      "updateClientInfo"
    );

    if (_apiurlsdetials) {
      console.log(
        "URL Get from ClientService: updateClientInfo: ---->  ",
        _apiurlsdetials
      );
      return this.consumer.serviceConsumer<IResponse>(
        _apiurlsdetials.url,
        _apiurlsdetials.type,
        client,
        "",
        0
      );
    } else {
      console.log(
        "URL Get from ClientService: updateClientInfo: ---->  ",
        "Url not found.."
      );
      return Observable.throw({ error: { message: "url not found" } });
    }
  }

  getLicenseInfo(orgId: any):Observable<ILicenseData> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getLicenseInfo")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      let apiUrls = _apiurlsdetials.url.replace("{clientid}", orgId);
      return this.consumer.serviceConsumer<ILicenseData>(apiUrls, _apiurlsdetials.type, null, '', 0);
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  updateLicenseInfo(data) {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateLicenseInfo")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<any>(_apiurlsdetials.url, _apiurlsdetials.type, data, '', 0);
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
}
