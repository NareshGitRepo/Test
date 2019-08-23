import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient, HttpResponse, HttpEventType } from "@angular/common/http";
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions, UploadStatus } from "../../../../node_modules/ngx-uploader";
import { Howl, Howler } from 'howler';
// services
import { ToastrService, GlobalConfig } from "ngx-toastr";
import { FileService } from "../../services/campaignmanager/file.service";
import * as moment from "moment-timezone";
import { DatePipe } from "@angular/common";
import { AuthenticationService } from "../../services/authentication.service";
import { CHECKBOX_CONTROL_VALUE_ACCESSOR } from "ngx-bootstrap/buttons/button-checkbox.directive";

const types = ["success", "error", "info", "warning"];

@Component({
  templateUrl: "quick.component.html",
})

export class QuickComponent implements OnInit {

  sample: string;
  localUrl: any;
  router: any;
  StartDateTime: any;
  EndDateTime: any;

  html = `<div class="bg-white text-dark"><img src="assets/img/tooltip/notepad.gif" alt="" /></div>`;

  type = types[0];
  model: any = {};
  response: any = {};

  processednumbers: number;
  uniqueId: string;

  selectedFiles: FileList;
  selectedFinalFiles: FileList

  selectBox = false;
  validWelcomeFile = false;
  validFinalFile = false;
  public dateValidation: boolean = false;
  public showPromo = false;
  public showResponse = false;
  public showProgress = false;
  public isUploaded = false;
  currentFileUpload: File;
  currenFinalFileUpload: File;
  progress: { percentage: number } = { percentage: 0 }

  isValidFileExt = true;
  selectedValue: string;
  campaignExist: boolean = false;

  errors: Array<string> = [];
  // @Input() fileExt: string = "JPG, TXT, PNG";
  @Input() fileExt = "TXT";
  @Input() fileWavExt = "WAV,MP3,AMR";
  @Input() maxSize = 5; // 5MB
  @Output() uploadStatus = new EventEmitter();

  selectPromoType: string;
  campaignName: string;
  dnd: any;
  mobileNumber: any;
  welcomePrompt: string;
  finalPrompt: string;
  startDate: string;
  endDate: string;
  startTime: string;
  validDigits: string;
  fileName: string;
  // status: string;
  filesizeEmpty: boolean = false;
  moment = moment();
  public onReset = false;
  isValidWavFileExt = true;
  startDatetime: Date;
  endDatetime: Date;
  message: any;

  constructor(private authService: AuthenticationService, private fileService: FileService, private datePipe: DatePipe, private toastr: ToastrService) {
    this.model.DateTime = new Date();
  }

  ngOnInit(): void {
    console.log("QuickComponent:ngOnInit:");
    this.dateValidation = true;
    this.model.selectPromoType = "Select";
    this.getDates();
    // this.model.StartDateTime = new Date();
    // this.model.EndDateTime = new Date();
    // this.model.EndDateTime = new Date(this.model.StartDateTime.setDate(this.model.StartDateTime.getHour() + 1));
  }

  getDates() {
    this.authService.getDates().subscribe(data => {
      console.log("Start DateTime  : ", data.currentdate);
      this.model.StartDateTime = new Date(data.currentdate);
      this.model.EndDateTime = new Date(data.currentdate);
    });
  }

  selectFile(event) {

    console.log("QuickComponent:selectFile:");
    this.selectedFiles = event.target.files;
    var audio = document.getElementById("welPrompt");
    var fileUrl = URL.createObjectURL(this.selectedFiles.item(0));
    audio.setAttribute("src", fileUrl);

    if (audio.hasAttribute("controls")) {
      audio.removeAttribute("controls")
    } else {
      audio.setAttribute("controls", "controls")
    }


    if (event.target.files[0].size == 0) {
      this.filesizeEmpty = true;
    } else {
      this.filesizeEmpty = false;
      this.selectedFiles = event.target.files;
    }

    if (!this.isValidWaveFileExtension(this.selectedFiles.item(0))) {
      console.log("File Extension is not valid");
      this.isValidWavFileExt = false;
      this.validWelcomeFile = false;
      return false;
    } else {
      this.validWelcomeFile = true;

      this.isValidWavFileExt = true;
    }

  }

  selectFinalFile(event) {
    console.log("QuickComponent:selectWelcomeFile:");
    this.selectedFinalFiles = event.target.files;
    var audio = document.getElementById("fPrompt");
    var fileUrl = URL.createObjectURL(this.selectedFinalFiles.item(0));
    audio.setAttribute("src", fileUrl);

    if (audio.hasAttribute("controls")) {
      audio.removeAttribute("controls")
    } else {
      audio.setAttribute("controls", "controls")
    }

    if (event.target.files[0].size == 0) {
      this.filesizeEmpty = true;
    } else {

      this.filesizeEmpty = false;
      this.selectedFinalFiles = event.target.files;
    }

    if (!this.isValidWaveFileExtension(this.selectedFinalFiles.item(0))) {
      console.log("File Extension is not valid");
      this.isValidFileExt = false;
      this.validFinalFile = false;
      return false;
    } else {
      this.validFinalFile = true;
      this.isValidFileExt = true;
    }

  }

  private isValidWaveFileExtension(file): boolean {
    console.log("BulkComponent:isValidWaveFileExtension:");
    // Make array of file extensions
    const extensions = (this.fileWavExt.split(","))
      .map(function (x) { return x.toLocaleUpperCase().trim() });
    const ext = file.name.toUpperCase().split(".").pop() || file.name;
    // Check the extension exists
    const exists = extensions.includes(ext);
    if (exists) {
      console.log("Valid file extension.");
      return true;
    } else {
      console.log("Uploaded file not a Wav file.");
      this.errors.push("Error (Extension): " + file.name);
      return false;
    }
  }

  onOpChange(event) {
    console.log("QuickComponent:onOpChange:", event);
    if (event === "Promo") {
      this.showPromo = true;
    } else {
      this.showPromo = false;
    }

    if (event === 'Select') {
      this.selectBox = false;
    } else {
      this.selectBox = true;
    }
    this.selectPromoType = event;
    this.onReset = false;
  }

  upload() {

    console.log("QuickComponent:upload:");
    //  console.log("CampaignName Model : ", this.model.campaignName);  
    console.log("CampaignName Model : ", this.model.campaignName);
    console.log("Promotype : ", this.model.selectPromoType);
    console.log("DND : ", this.model.dnd);

    if (this.model.StartDateTime >= this.model.EndDateTime) {
      console.log("Dates Wrong entry :");
      // this.dateValidation = false;
      this.dateValidation = true;
    } else {
      console.log("Dates Valid entry:");
      this.dateValidation = true;
    }

    if (this.dateValidation) {

      if (this.model.dnd === undefined || this.model.dnd === null) {
        this.dnd = false;
      } else {
        this.dnd = true;
      }
      console.log("DND : ", this.dnd);
      console.log("Mobile Number : ", this.model.mobileNumber);

      console.log("StartDateTime : ", this.model.StartDateTime);
      console.log("EndDateTime : ", this.model.EndDateTime);

      this.startDate = this.datePipe.transform(new Date(this.model.StartDateTime), "dd-MM-yyyy");
      console.log("Start Date After conversion :  --->  ", this.startDate);

      this.startTime = this.datePipe.transform(new Date(this.model.StartDateTime), "HH:mm:ss");
      console.log("Start Time After conversion :  --->  ", this.startTime);

      // this.endDate = this.datePipe.transform(new Date(this.model.EndDateTime), "dd-MM-yyyy HH:mm:ss");
      this.endDate = this.datePipe.transform(new Date(this.model.EndDateTime), "dd-MM-yyyy");
      console.log("End Date After conversion :  --->  ", this.endDate);

      this.progress.percentage = 0;
      this.currentFileUpload = this.selectedFiles.item(0);
      console.log("Welcome File Type : ", this.currentFileUpload.type);
      console.log("Welcome File Name : ", this.currentFileUpload.name);

      if (this.model.selectPromoType === "Promo") {
        console.log("ValidDigits : ", this.model.validDigits);
        this.currenFinalFileUpload = this.selectedFinalFiles.item(0);
        console.log("Final File Type : ", this.currenFinalFileUpload.type);
        console.log("Final File Name : ", this.currenFinalFileUpload.name);
        this.isValidWaveFileExtension(this.currenFinalFileUpload);
      }
      this.fileName = this.currentFileUpload.name;
      this.onReset = false;

      if (this.isValidWaveFileExtension(this.currentFileUpload)) {
        console.log("File Extension is valid");
        // this.fileService.pushFileToHttpReq(this.currentFileUpload).subscribe(event => {
        this.fileService.fileToHttpReq(this.model.campaignName, this.currentFileUpload,
          this.currenFinalFileUpload, this.model.selectPromoType, this.model.validDigits,
          this.startDate, this.endDate, this.startTime, this.dnd, this.model.mobileNumber).subscribe(event => {

            if (event.type === HttpEventType.UploadProgress) {
              this.progress.percentage = Math.round(100 * event.loaded / event.total);
              this.showProgress = true;
              setInterval(() => {
                this.showProgress = false;
              }, 1000);

            } else if (event instanceof HttpResponse) {
              console.log("File is completed successfully!");
              console.log("HTTP Response Data :", event.body);
              this.response = event.body;
              const obj = JSON.parse(this.response);
              // console.log("Records Count : ============>", obj.numberOfLines);
              this.processednumbers = obj.numberOfLines;
              // this.uniqueId = obj.uniqueId;
              this.uniqueId = obj.dbId;
              setInterval(() => {
                this.showProgress = false;
              }, 1000);


              this.showResponse = true;
              this.isUploaded = true;
              console.log("Response Quick Info message: ", obj.message + " Status : " + obj.status);
              if (obj.status) {
                console.log("Success");
                this.toastr.success(obj.message, "Success");
              } else {
                console.log("Failed");
                this.toastr.error(obj.message, "Failed");
              }
            }
          })
      } else {
        console.log("Invalid File Extension");
        this.isValidFileExt = false;
        this.isValidWavFileExt = false;
      }
      this.selectedFiles = undefined;
    }
  }

  onSearchCampaign() {
    console.log("QuickComponent:onSearchCampaign:" + this.model.campaignName);
    this.fileService.getCampaignName(this.model.campaignName).subscribe((response) => {
      console.log("Respopnse :::>" + response.status);
      if (response.status) {
        this.campaignExist = false;
        // this.message = response.message;
        // this.toastr.success("", "Failed");
      } else {
        this.campaignExist = true;
        this.message = this.model.campaignName + " " + response.message;
        //this.toastr.error(this.model.campaignName + " " + response.message, "Failed");
      }
    });
  }

  private isValidFileExtension(file): boolean {
    console.log("QuickComponent:isValidFileExtension:");
    // Make array of file extensions
    const extensions = (this.fileExt.split(","))
      .map(function (x) { return x.toLocaleUpperCase().trim() });
    const ext = file.name.toUpperCase().split(".").pop() || file.name;
    // Check the extension exists
    const exists = extensions.includes(ext);
    if (exists) {
      console.log("Valid file extension.");
      return true;
    } else {
      console.log("Uploaded file not a wav,mp3 file.");
      this.errors.push("Error (Extension): " + file.name);
      return false;
    }
  }

  reset() {
    console.log("QuickComponent:reset:");
    // window.location.reload();
    this.model.campaignName = "";
    this.model.validDigits = "";
    this.model.dnd = false;
    this.showResponse = false;
    this.isUploaded = false;
    this.isValidFileExt = true;
    this.selectedFiles = null;
    this.selectBox = false;
    this.validWelcomeFile = true;
    this.validFinalFile = true;
    this.getDates();
    // this.onReset = true;
    var welPrompt = document.getElementById("welPrompt");
    if (welPrompt != null) {
      if (welPrompt.hasAttribute("controls")) {
        welPrompt.removeAttribute("controls");
      }
    }
    var fPrompt = document.getElementById("fPrompt");
    if (fPrompt != null) {
      if (fPrompt.hasAttribute("controls")) {
        fPrompt.removeAttribute("controls");
      }
    }
  }
}
