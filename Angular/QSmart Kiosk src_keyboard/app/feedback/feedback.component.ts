import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IFeedback, IFeedbackTypes, IAppointment, IFeedbackIn, IAddFeedbackRes } from './_model/IFeedback';

import { AppConfig } from '../_helpers/app.config';
import { DomSanitizer } from "@angular/platform-browser";
import { FeedbackService } from './_service/feedback.service';
import { KeyboardClassKey } from '@ngx-material-keyboard/core';
import { MatIconRegistry } from "@angular/material/icon";
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserIdleService } from 'angular-user-idle';
import { PerfectScrollbarConfigInterface } from '../../../node_modules/ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true
 };

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})

export class FeedbackComponent implements OnInit, AfterViewChecked {

  enableFeedback: boolean = false;
  feedbackForm: FormGroup;
  showSuccessMessages: any;
  showErrorMessages: any;
  setTimeout: number;
  feedbackTypes: IFeedbackTypes[];
  public appointmentList: IAppointment[] = [];
  public getDetails: IAppointment[] = [];
  technical: string;
  clarity: string;
  ease: string;
  feedbackValues: any = [];
  feedbackHeading1: boolean = false;
  feedbackHeading2: boolean = false;
  feedbackHeading3: boolean = false;
  activeClass: string;
  thisActive = false;
  feedValue = 1;
  timeLeft: number;
  errorMessage: boolean;
  public apiCheckinResponse: IAddFeedbackRes;
  messages: any;
  showError: boolean;
  showCommentFlag: boolean = false;
  showmrnFlag: boolean = false;
  currentLang: string = 'en';
  questionsFlag = false;
  commentFlag: boolean = true;
  labelPosition = 'before';
  labelPosition1 = 'after';
  noAppoitmentFlag: boolean = false;
  selectAtleastOne = false;
  feedbackRes: IFeedbackIn;
  timeoutconfig: number = 60;
  timeoutValue: number = 0;

  @ViewChild('mrnNo') mrn: ElementRef;
  @ViewChild('comment') firstNameElement: ElementRef;

  constructor(private fb: FormBuilder, private feedbackService: FeedbackService, private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer, private appconfig: AppConfig, public router: Router, private userIdle: UserIdleService,
    private translate: TranslateService) {
    this.currentLang = this.translate.currentLang;
  
    if (this.appconfig.getMenus()) {
      this.userIdle.resetTimer();
      this.timeoutconfig = this.appconfig.getTimeoutforcheckIn();
    

      this.userIdle.setConfigValues({ idle: -1, timeout: this.timeoutconfig, ping: 1 });
      this.userIdle.onTimerStart().subscribe(count=>{
        this.timeoutValue=count;
      });

      this.matIconRegistry.addSvgIcon(
        "happyIcon", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/smile.svg")
      );
  
      this.matIconRegistry.addSvgIcon(
        "neutralIcon", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/nutral.svg")
      );
  
      this.matIconRegistry.addSvgIcon(
        "sadIcon", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/sad.svg")
      );
    } else if (localStorage.getItem('kioskid')) {
      this.router.navigate(['/'], { queryParams: { kioskid: localStorage.getItem('kioskid') } });
    } else {
      this.router.navigate(['/']);
    }

  }

  ngOnInit() {
    this.showmrnFlag = true;

    console.log("feedback ngOnInit() ::", new Date());
    this.userIdle.startWatching();
    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() => {
      this.router.navigate(['/'], { queryParams: { kioskid: this.appconfig.getKiosk() } });
    });

    this.feedbackForm = this.fb.group({
      feedback: ['', Validators.required],
      mrnNo: ['', Validators.required],
      nationalId: ['', Validators.required],
      easeUse: [false],
      techPerformance: [false],
      clarityPerformance: [false],
      comment: ['', Validators.required],
      apptSno: [null,Validators.required],
      //appointments:['']
      // ,
      // langChange:[this.currentLang=='ar'?true:false]
    })
    //this.mrnAndNatIdVarify()


    this.formControlCommentValueChanged();
    this.feedbackForm.get('mrnNo').valueChanges.subscribe(val => {
      this.userIdle.resetTimer();
      console.log('changes', val);
    });
    this.feedbackForm.get('nationalId').valueChanges.subscribe(val => {
      this.userIdle.resetTimer();
      console.log('changes', val);
    });

  }

  mrnAndNatIdVarify() {
    this.userIdle.resetTimer();
    this.appointmentList = [];
    console.log("getAppoinmentDetails_Request=>", this.feedbackForm);
    this.feedbackService.getAppoinmentDetails(this.feedbackForm).subscribe((response: IFeedbackIn) => {
      console.log("getAppoinmentDetails_Response=>", response);
      if (response) {
        this.feedbackRes = response;
        if (response.status) {

          if (response.appointments.length > 0) {
            this.userIdle.resetTimer();
            this.appointmentList = response.appointments;
            console.log("MRN Value :" + this.feedbackForm.value.mrnNo);
            this.feedValue = 6;
          } else {
            console.log("showerror");
            this.feedValue = 6;
            this.HttpTimeoutError();
          }
        }  else {

          this.showError = true;
          this.HttpTimeoutError();
        }
      } else {
        this.showError = true;
          this.HttpTimeoutError();
      }
    }, err => {
      console.log("Http timeout Error : " + JSON.stringify(err))
      this.errorMessage = true;
      this.feedbackRes = err;
          this.HttpTimeoutError();
    });

  }


  formControlCommentValueChanged() {
    this.feedbackForm.get('comment').valueChanges.subscribe(
      (mode: string) => {
        console.log('comment changed');
        if (this.feedbackForm.value.comment != null && this.feedbackForm.value.comment != '' && this.feedbackForm.value.comment.length >= 6 && this.commentFlag) {
          console.log('if');

          this.commentFlag = false;
        }
        else if ((this.feedbackForm.value.comment == '' || this.feedbackForm.value.comment.length < 6)) {
          this.commentFlag = true;
          console.log('else');

        }


        this.userIdle.resetTimer();
      });
  }

  formControlMrnValueChanged() {
    this.feedbackForm.get('mrnNo').valueChanges.subscribe(
      (mode: string) => {
        this.userIdle.resetTimer();
      });
  }



  onCheckChange(event, name) {
    if (name == 'easeUse') {
      if (event.checked) {
        this.feedbackForm.get('easeUse').setValue(true);

      } else {
        this.feedbackForm.get('easeUse').setValue(false);
      }
    }
    if (name == 'techPerformance') {
      if (event.checked) {
        this.feedbackForm.get('techPerformance').setValue(true);
      } else {
        this.feedbackForm.get('techPerformance').setValue(false);
      }
    }
    if (name == 'clarityPerformance') {
      if (event.checked) {
        this.feedbackForm.get('clarityPerformance').setValue(true);
      } else {
        this.feedbackForm.get('clarityPerformance').setValue(false);
      }
    }
  }

  selectFeedback(event) {
    this.enableFeedback = true;
    this.feedbackForm.controls.feedback.setValue(event);
    this.userIdle.resetTimer();
    switch (event) {
      case "Happy":
        this.feedbackHeading1 = true;
        this.feedbackHeading2 = false;
        this.feedbackHeading3 = false;
        this.activeClass = "happy";
        this.feedValue = 3;
        this.clearFeedbackDetails();
        break;
      case "Neutral":
        this.feedbackHeading2 = true;
        this.feedbackHeading1 = false;
        this.feedbackHeading3 = false;
        this.activeClass = "neutral";
        this.feedValue = 3;
        this.clearFeedbackDetails();
        break;
      case "Sad":
        this.feedbackHeading3 = true;
        this.feedbackHeading1 = false;
        this.feedbackHeading2 = false;
        this.activeClass = "sad";
        this.feedValue = 3;
        this.clearFeedbackDetails();
        break;
    }
    // this.feedbackForm.controls.feedback.setValue(event);
  }


  submitFeedback() {
    console.log("Final Feedback :" + JSON.stringify(this.feedbackForm.value));
    this.errorMessage = false;
    this.showError = false;
    if (!this.questionsFlag)
      this.feedbackForm.get('comment').setValue('');
    console.log('addFeedback_Request=>', this.feedbackForm.value);
    this.feedbackService.addFeedback(this.feedbackForm.value).subscribe((response :IAddFeedbackRes) => {
      console.log("addFeedback_Response=>" , response);
      if (response) {
        this.userIdle.resetTimer();
        this.feedValue = 5;
        this.apiCheckinResponse = response;
        this.feedbackForm.reset();
      } else {
        this.feedValue = 7;
        this.errorMessage = true;
        this.HttpTimeoutError();
      }
    }, err => {
      console.log("Http timeout Error : " + JSON.stringify(err))
      this.errorMessage = true;
      this.feedValue = 7;
      this.HttpTimeoutError();
    });
  }

  setActive(row: number, stat: string) {
    switch (row) {
      case 0:
        if (stat == this.technical)
          return true;
        else
          return false;
      case 1:
        if (stat == this.clarity)
          return true;
        else
          return false;
      case 2:
        if (stat == this.ease)
          return true;
        else
          return false;
    }
  }

  backem() {
    this.userIdle.resetTimer();
    this.feedValue = 2;
  }

  backem2() {
    this.userIdle.resetTimer();
    this.feedValue = 3;
    this.questionsFlag = false;
  }


  languageCheck(event) {

    if (event.checked) {
      this.currentLang = 'ar'
    } else {
      this.currentLang = 'en'
    }
  }
  shrcomnt() {
    this.questionsFlag = true;
    this.userIdle.resetTimer();
    this.feedValue = 4;
    this.showCommentFlag = true;
  }
  public ngAfterViewChecked() {
    if (this.showCommentFlag) {
      console.log('232');
      setTimeout(() => {
        this.firstNameElement.nativeElement.focus();
        this.showCommentFlag = false;
      }, 1);
    }

    if (this.showmrnFlag) {
      setTimeout(() => {
        this.mrn.nativeElement.focus();
        this.showmrnFlag = false
      }, 1)
    }
  }

  visitAppoint() {
    this.userIdle.resetTimer();
    this.feedValue = 2;
  }

  clearFeedbackDetails() {
    this.feedbackForm.value.easeUse = false;
    this.feedbackForm.value.techPerformance = false;
    this.feedbackForm.value.clarityPerformance = false;
    this.feedbackForm.controls.easeUse.setValue(false);
    this.feedbackForm.controls.techPerformance.setValue(false);
    this.feedbackForm.controls.clarityPerformance.setValue(false);
    this.feedbackForm.controls.comment.setValue('');
  }
  HttpTimeoutError() {
    this.userIdle.stopWatching();
    this.timeoutconfig = 10;
    this.userIdle.setConfigValues({ idle: -1, timeout: 10, ping: 1 });
    this.userIdle.startWatching();
    this.userIdle.onTimeout().subscribe(() => {
      this.router.navigate(['/'], { queryParams: { kioskid: this.appconfig.getKiosk() } });
    });
  }

  ngOnDestroy() {
    console.log("Feedback Destroy ...........");
    this.userIdle.stopWatching();
  }
}


