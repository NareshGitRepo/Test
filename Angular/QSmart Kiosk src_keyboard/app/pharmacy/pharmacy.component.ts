import { Component, OnInit, OnDestroy } from '@angular/core';
import { PharmacyService } from './_service/pharmacy.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IPResponse, ISDCResponse, IPKioskInfo, IDhlCity, ISDCRefilMedicnese, IMedicineRespnse } from './_model/IPharmacy';
import { DashboardService } from '../dashboard/_service/dashboard.service';
import { UserIdleService } from 'angular-user-idle';
import { AppConfig, menuType } from '../_helpers/app.config';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import _ from 'lodash';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true
};

@Component({
  selector: 'app-pharmacy',
  templateUrl: './pharmacy.component.html',
  styleUrls: ['./pharmacy.component.scss']
})
export class PharmacyComponent implements OnInit {

  setTimeout: number;
  errorMessage: boolean = false;
  messages: string;
  pharmacyForm: FormGroup;
  pharmacyChk = 1;
  dhlForm: FormGroup;
  checkinResponse: ISDCResponse;
  pharmaData: IPKioskInfo;
  ErrorMessageText: string;
  dhlcities: IDhlCity[] = [];
  dhlmedicines: ISDCRefilMedicnese[];
  DhlResponse: IMedicineRespnse;
  dhlCheckinResponse: IMedicineRespnse;
  validateData: IPResponse;
  timeoutconfig: number = 60;
  timeoutValue: number = 0;
  noAvailableServices: boolean = false;
  filteredmadicines: ISDCRefilMedicnese[];
  radius: number = 15;
  circumference = 2 * Math.PI * this.radius;
  dashoffset: number;
  colorvalue: string;

  constructor(private pharmacy: PharmacyService, private dashboard: DashboardService,
    private _snackBar: MatSnackBar, private translate: TranslateService, private appconfig: AppConfig, public router: Router, private route: ActivatedRoute, private userIdle: UserIdleService, private fb: FormBuilder) {
    if (this.appconfig.getMenus()) {
      this.userIdle.stopWatching();
      // this.userIdle.resetTimer();
    } else if (localStorage.getItem('kioskid')) {
      this.router.navigate(['/'], { queryParams: { kioskid: localStorage.getItem('kioskid') } });
    } else {
      this.router.navigate(['/']);
    }


  }
 
  ngOnInit() {
    this.timeoutconfig = this.appconfig.getTimeoutforPharmacy();
    this.strokeprogress(this.timeoutconfig);
    this.userIdle.setConfigValues({ idle: -1, timeout: this.timeoutconfig, ping: 1 });
    this.userIdle.onTimerStart().subscribe(count => {
      this.timeoutValue = count;
      this.strokeprogress(this.timeoutconfig-this.timeoutValue);
    });
    this.userIdle.startWatching();
    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() => {console.log('timeout');
    
      this.router.navigate(['/'], { queryParams: { kioskid: this.appconfig.getKiosk() } });
    });
    this.pharmacyForm = this.fb.group({
      mrnNumber: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(12)]],
      nationalId: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
    });
    this.dhlForm = this.fb.group({
      mobileNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(13)]],
      city: ['', [Validators.required]],
      // medications: ['', [Validators.required]]
      medicinesCollection: this.fb.array([], Validators.required),
    });
    this.pharmacyForm.get('mrnNumber').valueChanges.subscribe(val => {
      this.userIdle.resetTimer();
      console.log('changes mrnNumber', val);
    });

    this.pharmacyForm.get('nationalId').valueChanges.subscribe(val => {
      this.userIdle.resetTimer();
      console.log('changes nationalId', val);
    });
    this.dhlForm.get('mobileNumber').valueChanges.subscribe(val => {
      this.userIdle.resetTimer();
      console.log('changes', val);
    });

  }

  private strokeprogress(value: number) {
    const strokeprogress = value / this.timeoutconfig;
    this.strokevalue(this.timeoutconfig-this.timeoutValue);
    this.dashoffset = this.circumference * (1 - strokeprogress);
  }
  
  strokevalue(value) {  
    if (value >5) {
      this.colorvalue = "#19b464"
    }
    else if(value<=5){
      this.colorvalue = "red"
    }
  }

  validateMnrAndEmiratesId() {
    this.pharmacyChk = 6;
    this.userIdle.stopWatching();
    this.timeoutconfig = 120;
    this.userIdle.setConfigValues({ idle: -1, timeout: this.timeoutconfig, ping: 1 });
    this.userIdle.startWatching();

    let mrnno = this.pharmacyForm.value.mrnNumber;
    let ssn = this.pharmacyForm.value.nationalId;
    console.log("validateMnrAndEmiratesIdRequest::", mrnno, ssn);
    this.pharmacy.validateMnrAndEmiratesId(mrnno, ssn).subscribe((result: IPResponse) => {
      console.log("validateMnrAndEmiratesIdResponse::", JSON.stringify(result));
      if (result) {

        if (result.status) {
          this.pharmaData = result.kioskInfo;
          if (this.pharmaData.pharmaMasterId)
            this.appconfig.setPHTransactionId(this.pharmaData.pharmaMasterId);
          if (result.kioskInfo.pharmaType == 1) {
            this.pharmacyChk = 2;
            this.userIdle.stopWatching();
            this.timeoutconfig = 60;
            this.userIdle.setConfigValues({ idle: -1, timeout: this.timeoutconfig, ping: 1 });
            this.userIdle.startWatching();
          }
          else if (result.kioskInfo.pharmaType == 2) {
            this.userIdle.resetTimer();
            this.generateEmergencyCheckin();
          }
          // else {
          //   this.pharmacyChk = 5;
          //   this.ErrorMessageText = result.messages;
          //   this.pharmaData
          //   this.HttpTimeoutError();
          // }
        }
        else {
          console.log("Invalid Token");
          this.pharmacyChk = 1;
          this.ErrorMessageText = result.messages;
          this.HttpTimeoutError();
        }
      }
      else {
        console.log("Response not received");
        this.pharmacyChk = 5;
        this.errorMessage = true;
        this.HttpTimeoutError();
      }
    }, err => {
      this.errorMessage = true;
      this.pharmacyChk = 5;
      // this.messages = err;
      this.HttpTimeoutError();
    });
  }

  sameDaypick() {
    let filterdata = this.pharmaData.pharmaServiceTypes.filter(x => x.typeCode != 'NDP' && x.typeCode != "DHL");
    if (filterdata.length > 0) {
      this.pharmacyChk = 6;
      // this.userIdle.resetTimer();
      this.userIdle.stopWatching();
      this.timeoutconfig = 120;
      this.userIdle.setConfigValues({ idle: -1, timeout: this.timeoutconfig, ping: 1 });
      this.userIdle.startWatching();
      let mrnno = this.pharmacyForm.value.mrnNumber;
      console.log('generateSameDayCheckin_Request=>', mrnno, this.pharmaData);

      this.pharmacy.generateSameDayCheckin(mrnno, this.pharmaData).subscribe((result: ISDCResponse) => {
        console.log("generateSameDayCheckin_Response=>", JSON.stringify(result));
        if (result) {

          if (result.status) {
            // this.pharmaData.pharmaMasterId = null;
            this.checkinResponse = result;
            this.pharmacyChk = 3;
            this.HttpTimeoutError('success');
            let template = this.checkinResponse.template; //'Successfully message sent to printer';
            console.log('generateTokenPrinterPost_Request=>', name, "", this.checkinResponse.tokenId, menuType.PH, template);

            this.dashboard.generateTokenPrinterPost(name, "", this.checkinResponse.tokenId, menuType.PH, template);


          } else {
            console.log("Invalid Token");
            this.pharmacyChk = 5;
            this.ErrorMessageText = result.messages;
            this.HttpTimeoutError(this.translate.instant('Pharmacy.error.' + this.ErrorMessageText) == ('Pharmacy.error.' + this.ErrorMessageText) ? this.ErrorMessageText : this.translate.instant('Pharmacy.error.' + this.ErrorMessageText));
          }
        }
        else {
          console.log("Response not received");
          this.pharmacyChk = 5;
          this.pharmaData.pharmaMasterId = null;
          this.HttpTimeoutError();
        }
      }, err => {
        this.errorMessage = true;
        this.pharmacyChk = 5;

        // this.ErrorMessageText = err;
        // this.HttpTimeoutError(this.translate.instant('Pharmacy.SystemError'));
        this.HttpTimeoutError(this.translate.instant('Pharmacy.SystemError') == ('Pharmacy.SystemError') ? 'System Error' : this.translate.instant('Pharmacy.SystemError'));
      });
    }
    else {
      this.noAvailableServices = true;
      this.pharmacyChk = 5;
      // this.openSnackBar();
      this.HttpTimeoutError("SameDayPickup services not available");
    }
  }

  nextDaypick() {
    let index = this.pharmaData.pharmaServiceTypes.findIndex(x => x.typeCode == 'NDP');
    console.log("index", index);
    if (index != -1) {
      this.pharmacyChk = 6;
      this.userIdle.stopWatching();
      this.timeoutconfig = 120;
      this.userIdle.setConfigValues({ idle: -1, timeout: this.timeoutconfig, ping: 1 });
      this.userIdle.startWatching();

      let mrnno = this.pharmacyForm.value.mrnNumber;
      console.log('generateNextDayCheckin_Request=>', mrnno, this.pharmaData);

      this.pharmacy.generateNextDayCheckin(mrnno, this.pharmaData).subscribe((result: ISDCResponse) => {
        console.log("generateNextDayCheckin_Response=>", JSON.stringify(result));
        if (result) {

          if (result.status) {
            this.pharmaData.pharmaMasterId = null;
            this.checkinResponse = result;
            this.pharmacyChk = 3;
            this.HttpTimeoutError('success');
            let template = this.checkinResponse.template; //'Successfully message sent to printer';
            console.log('generateTokenPrinterPost_Request=>', name, "", this.checkinResponse.tokenId, menuType.PH, template);

            this.dashboard.generateTokenPrinterPost(name, "", this.checkinResponse.tokenId, menuType.PH, template);
            //pending shall we call httptimeouterror()
          } else {
            console.log("Invalid Token");
            this.pharmacyChk = 5;
            this.ErrorMessageText = result.messages;
            this.HttpTimeoutError(this.translate.instant('Pharmacy.error.' + this.ErrorMessageText) == ('Pharmacy.error.' + this.ErrorMessageText) ? this.ErrorMessageText : this.translate.instant('Pharmacy.error.' + this.ErrorMessageText));
          }
        } else {
          console.log("Response not received");
          this.pharmaData.pharmaMasterId = null;
          this.pharmacyChk = 5;
          this.HttpTimeoutError();
        }
      }, err => {
        // this.pharmaData.pharmaMasterId = null;
        this.errorMessage = true;
        this.pharmacyChk = 5;
        // this.ErrorMessageText = err;
        this.HttpTimeoutError(this.translate.instant('Pharmacy.SystemError') == ('Pharmacy.SystemError') ? 'System Error' : this.translate.instant('Pharmacy.SystemError'));
      });

    }
    else {

      this.noAvailableServices = true;
      this.pharmacyChk = 5;
      // this.openSnackBar();
      this.HttpTimeoutError("NextDayPickup service not available");
    }
  }

  generateEmergencyCheckin() {

    this.appconfig.setPHTransactionId(null);
    let mrnno = this.pharmacyForm.value.mrnNumber;
    console.log('generateEmergencyCheckin_Request=>', mrnno, this.pharmaData);
    this.pharmacy.generateEmergencyCheckin(mrnno, this.pharmaData).subscribe((result: ISDCResponse) => {
      console.log("generateEmergencyCheckin_Response=>", JSON.stringify(result));

      if (result) {
        if (result.status) {

          this.checkinResponse = result;
          this.pharmacyChk = 3;
          this.HttpTimeoutError('success');
          let template = this.checkinResponse.template; //'Successfully message sent to printer';
          console.log('generateTokenPrinterPost_Request=>', name, "", this.checkinResponse.tokenId, menuType.PH, template);

          this.dashboard.generateTokenPrinterPost(name, "", this.checkinResponse.tokenId, menuType.PH, template);
        } else {
          console.log("Invalid Token");
          this.pharmacyChk = 5;
          this.ErrorMessageText = result.messages;
          this.HttpTimeoutError(this.translate.instant('Pharmacy.error.' + this.ErrorMessageText) == ('Pharmacy.error.' + this.ErrorMessageText) ? this.ErrorMessageText : this.translate.instant('Pharmacy.error.' + this.ErrorMessageText));
        }
      } else {
        console.log("Response not received");
        // this.pharmaData.pharmaMasterId = null;
        this.pharmacyChk = 5;
        this.HttpTimeoutError();
      }
    }, err => {
      this.errorMessage = true;
      this.pharmacyChk = 5;
      // this.ErrorMessageText = err;
      this.HttpTimeoutError(this.translate.instant('Pharmacy.SystemError') == ('Pharmacy.SystemError') ? 'System Error' : this.translate.instant('Pharmacy.SystemError'));
    });
  }

  dhlservice() {
    let index = this.pharmaData.pharmaServiceTypes.findIndex(x => x.typeCode == 'DHL');
    console.log("type DHL found=>", index);
    if (index != -1) {

      this.pharmacyChk = 6;
      this.userIdle.stopWatching();
      this.timeoutconfig = 120;
      this.userIdle.setConfigValues({ idle: -1, timeout: this.timeoutconfig, ping: 1 });
      this.userIdle.startWatching();

      this.pharmacy.getDhlCities().subscribe((result: IDhlCity[]) => {
        console.log("getDhlCities_Response=>", JSON.stringify(result));
        if (result) {
          this.dhlcities = result;
        }
        else {
          console.log("Invalid Token");
          this.dhlcities = [];
        }
        this.getDHLMedicines();
      }, err => {
        this.errorMessage = true;
        this.getDHLMedicines();
        //pending
      });
    } else {
      this.noAvailableServices = true;
      this.pharmacyChk = 5;
      this.HttpTimeoutError("DHL service not available");
      // this.openSnackBar();
    }
  }
  getDHLMedicines() {
    let ssn = this.pharmacyForm.value.nationalId
    let mrnno = this.pharmacyForm.value.mrnNumber;
    console.log('getDHLMedicines_Request=>', mrnno, ssn, this.pharmaData);
    this.pharmacy.getDHLMedicines(mrnno, ssn, this.pharmaData).subscribe((result: IMedicineRespnse) => {
      console.log("getDHLMedicines_Response=>", JSON.stringify(result));
      if (result) {
        if (result.status) {
          this.dhlmedicines = result.refilMedicines;
          this.pharmacyChk = 4;
          console.log(" this.dhlmedicines=>", this.dhlmedicines);

        } else {
          this.ErrorMessageText = result.messages;
          this.dhlmedicines = [];
          this.pharmacyChk = 5;
          this.HttpTimeoutError(this.translate.instant('Pharmacy.error.' + this.ErrorMessageText) == ('Pharmacy.error.' + this.ErrorMessageText) ? this.ErrorMessageText : this.translate.instant('Pharmacy.error.' + this.ErrorMessageText));
        }
      } /*else {
        console.log("Response not received");
        this.pharmacyChk = 5;
        this.errorMessage = true;
        this.HttpTimeoutError();
      }*/
    }, err => {
      this.errorMessage = true;
      this.pharmacyChk = 5;
      // this.ErrorMessageText = err;
      this.HttpTimeoutError(this.translate.instant('Pharmacy.SystemError') == ('Pharmacy.SystemError') ? 'System Error' : this.translate.instant('Pharmacy.SystemError'));
    });
  }

  addMedicines(medicine, event) {
    const medicines = this.dhlForm.controls.medicinesCollection as FormArray;
    console.log("medicines =>", medicines, medicine);
    if (event.checked) {
      console.log("checked", event.checked)
      medicines.push(this.fb.group({ name: medicine.name }));
      console.log("medicines =>", medicines);
      this.dhlmedicines.forEach(element => {
        console.log("ForEach =>", element, medicine);
        if (_.isEqual(element, medicine)) {
          element.isSelect = true;
        }
      });
      console.log("this.dhlmedicines", this.dhlmedicines)
    }
    else {
      let index = medicines.controls.findIndex(data => data.value.name == medicine.name);
      medicines.removeAt(index);
    }
  }

  submit() {
    let ssn = this.pharmacyForm.value.nationalId
    let mrnno = this.pharmacyForm.value.mrnNumber;
    console.log('this.dhlmedicines=>', this.dhlmedicines);
    this.userIdle.stopWatching();
    this.timeoutconfig = 120;
    this.userIdle.setConfigValues({ idle: -1, timeout: this.timeoutconfig, ping: 1 });
    this.userIdle.startWatching();
  this.filteredmadicines=  this.dhlmedicines.filter(x=>x.isSelect==true)
  console.log('this.filteredmadicines=>', this.filteredmadicines);
    let reqObj = {
      city: this.dhlForm.value.city,
      mobile: this.dhlForm.value.mobileNumber,
      addressId: '',
      base: '',
      deliveryMethod: 0,
      refilMedicines: this.filteredmadicines,
      street: '',
      kioskPharmaInfo: this.pharmaData
    };
    console.log('transferToDhlService_Request=>', reqObj);
    this.pharmacy.transferToDhlService(mrnno, ssn, reqObj).subscribe((result: IMedicineRespnse) => {
      console.log("transferToDhlService_Response=>", JSON.stringify(result));
      if (result) {

        if (result.status) {

          this.dhlCheckinResponse = result;
          this.pharmacyChk = 3;
          this.HttpTimeoutError('success');

        } else {
          this.pharmacyChk = 5;
          this.ErrorMessageText = result.messages;
          this.HttpTimeoutError(this.translate.instant('Pharmacy.error.' + this.ErrorMessageText) == ('Pharmacy.error.' + this.ErrorMessageText) ? this.ErrorMessageText : this.translate.instant('Pharmacy.error.' + this.ErrorMessageText));
        }
      } else {
        console.log("Response not received");
        // this.pharmaData.pharmaMasterId = null;
        this.pharmacyChk = 5;
        this.errorMessage = true;
        this.HttpTimeoutError();
      }
    }, err => {
      this.errorMessage = true;
      this.pharmacyChk = 5;
      // this.ErrorMessageText = err;
      this.HttpTimeoutError(this.translate.instant('Pharmacy.SystemError') == ('Pharmacy.SystemError') ? 'System Error' : this.translate.instant('Pharmacy.SystemError'));
    });
  }

  HttpTimeoutError(reason?: string) {
    console.log("this.pharmaData.pharmaMasterId", this.pharmaData? this.pharmaData.pharmaMasterId:null);
    this.appconfig.setPHTransactionId(null);
    this.userIdle.stopWatching();
    if ((this.pharmaData? this.pharmaData.pharmaMasterId:null) && (reason != 'success')) {
      console.log("updatePharmaMasterStatusAndReason : Request=>", JSON.stringify({ pharmaMasterId: this.pharmaData.pharmaMasterId, status: 0, reason: (reason ? reason : 'Timeout') }));
      this.pharmacy.updatePharmaMasterStatusAndReason(this.pharmaData.pharmaMasterId, 0, (reason ? reason : 'Timeout')).subscribe((result: IPResponse) => {
        console.log("updatePharmaMasterStatusAndReason : Response=>", result);
      });
    }
    this.timeoutconfig = 10;
    this.userIdle.setConfigValues({ idle: -1, timeout: 10, ping: 1 });
    this.userIdle.startWatching();
    this.userIdle.onTimeout().subscribe(() => {
      this.router.navigate(['/'], { queryParams: { kioskid: this.appconfig.getKiosk() } });
    });
  }
  ngOnDestroy() {
    console.log("Checkin Destroy .....");
    this.userIdle.stopWatching();
  }
}


