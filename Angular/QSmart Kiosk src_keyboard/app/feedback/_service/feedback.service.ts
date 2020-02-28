import { Injectable } from '@angular/core';
import { IFeedbackTypes, IFeedback, IAppointment, IFeedbackIn, IAddFeedbackRes } from '../_model/IFeedback';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ConsumerService } from '../../_helpers/ConsumerService';
import { LoadApiUrls } from '../../_helpers/api.urls';
import { AppConfig } from '../../_helpers/app.config';

@Injectable()
export class FeedbackService {

  public component = "Feedback";

  constructor(private apiUrls: LoadApiUrls, private appconfig:AppConfig,private translate: TranslateService, private consumer: ConsumerService) {
  }

  getfeedback(feedback: any) {
    console.log("FedbackInfo ::" + JSON.stringify(feedback));
    return "Thanks for given your feedback";

  }

  addFeedback(feedbackform): Observable<IAddFeedbackRes> {
    console.log("FeedbackService.feedbackform value::" + JSON.stringify(feedbackform.value));
    const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "addFeedback");
    const url = _apiurlsdetials.url.replace("{kioskid}", this.appconfig.getKioskId());
    if (_apiurlsdetials) {
      console.log("FeedbackService: sendFeedBack: ---->  ", _apiurlsdetials);
      return this.consumer.serviceConsumer<IAddFeedbackRes>(url, _apiurlsdetials.type, feedbackform, '', 0);
    } else {
      console.log("FeedbackService: sendFeedBack: ---->  ", "Url not found..");
      return Observable.throw({ error: { message: "url not found" } });
    }
  }

  private feedbackTypes: IFeedbackTypes[] = [
    { feedbackName: this.translate.instant('TechnicalPerformance.feedbackName'), feedbackType: { feedbackHappy: "sentiment_satisfied", feedbackNeutral: "panorama_fish_eye", feedbackSad: "sentiment_dissatisfied" } },
    { feedbackName: this.translate.instant('clarityofPresentation.feedbackName'), feedbackType: { feedbackHappy: "sentiment_satisfied", feedbackNeutral: "panorama_fish_eye", feedbackSad: "sentiment_dissatisfied" } },
    { feedbackName: this.translate.instant('easeofUse.feedbackName'), feedbackType: { feedbackHappy: "sentiment_satisfied", feedbackNeutral: "panorama_fish_eye", feedbackSad: "sentiment_dissatisfied" } }];
  getFeedbackTypes(): IFeedbackTypes[] {
    return this.feedbackTypes;
  }

  getAppoinmentDetails(feedbackForm:any):Observable<IFeedbackIn>{
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAppoinmentDetails");
    console.log("CheckinService: generateCheckinToken: ---->: =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      const url = _apiurlsdetials.url.replace("{kioskid}", this.appconfig.getKioskId()).replace("{mrnnumber}",
      feedbackForm.value.mrnNo).replace("{natid}", feedbackForm.value.nationalId);
        console.log("Feedback: getAppoinmentDetails: ---->  ", url);
        return this.consumer.serviceConsumer<IFeedbackIn>(url, _apiurlsdetials.type, '','');
    }
    else {
        console.log("Feedback: getAppoinmentDetails: ----> : ----> ", "Url not found..");
        return Observable.throw({ error: { messages: "url not found" } });

  }
  }

  
}




