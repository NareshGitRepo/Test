import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient, HttpResponse, HttpEventType } from "@angular/common/http";
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions, UploadStatus } from "../../../../node_modules/ngx-uploader";

// services
import { ToastrService, GlobalConfig } from "ngx-toastr";
import { FileService } from "../../services/campaignmanager/file.service";
import { DatePipe } from "@angular/common";
import * as moment from "moment-timezone";
import { debug } from "util";
import { AuthenticationService } from "../../services/authentication.service";
const types = ["success", "error", "info", "warning"];

@Component({
  templateUrl: "bulk.component.html",
})

export class BulkComponent implements OnInit {

  uploadPath: any;
  filePath: any;
  public dateValidation: boolean = false;
  html = `<div class="bg-white text-dark"><img src="assets/img/tooltip/notepad.gif" alt="" /></div>`;

  type = types[0];
  model: any = {};
  response: any = {};
  processednumbers: number;
  uniqueId: string;
  selectedFiles: FileList;
  selectedFinalFiles: FileList
  selectedWelcomeFiles: FileList;
  selectBox = false;
  validWelcomeFile = false;
  validFinalFile = false;
  validFile = false;
  public showPromo = false;
  public showResponse = false;
  public showProgress = false;
  public isUploaded = false;
  public isSaveEnable = false;
  currentFileUpload: File;
  currentFinalFileUpload: File;
  currentWelcomeFileUpload: File;
  progress: { percentage: number } = { percentage: 0 }
  isValidFileExt = true;
  selectedValue: string;
  errors: Array<string> = [];
  // @Input() fileExt: string = "JPG, TXT, PNG";
  @Input() fileWavExt = "WAV,MP3,AMR";
  @Input() fileExt = "TXT"
  @Input() maxSize = 5; // 5MB
  @Output() uploadStatus = new EventEmitter();
  campaignExist: boolean = false;
  selectPromoType: string;
  campaignName: string;
  dnd: boolean;
  welcomePrompt: string;
  finalPrompt: string;
  startDate: string;
  endDate: string;
  startTime: string;
  validDigits: string;
  fileName: string;
  filesizeEmpty: boolean = false;
  moment = moment();
  public onReset = false;
  isValidWavFileExt = true;
  isValidFinalWavFileExt = true;
  startDatetime: Date;
  endDatetime: Date;
  message: string;

  constructor(private authService: AuthenticationService, private fileService: FileService, private datePipe: DatePipe, private toastr: ToastrService) { }

  ngOnInit(): void {
    console.log("BulkComponent:ngOnInit:");
    this.dateValidation = true;
    this.model.selectPromoType = "Select";
    this.getDates();
    // this.model.StartDateTime = new Date();
    // this.model.EndDateTime = new Date();
  }

  getDates() {
    this.authService.getDates().subscribe(data => {
      console.log("Start DateTime  : ", data.currentdate);
      this.model.StartDateTime = new Date(data.currentdate);
      this.model.EndDateTime = new Date(data.currentdate);
    });
  }

  selectWelcomeFile(event) {
    console.log("BulkComponent:selectWelcomeFile:");
    this.selectedWelcomeFiles = event.target.files;
    var audio = document.getElementById("welPrompt");
    var fileUrl = URL.createObjectURL(this.selectedWelcomeFiles.item(0));
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
      this.selectedWelcomeFiles = event.target.files;
    }

    if (!this.isValidWaveFileExtension(this.selectedWelcomeFiles.item(0))) {
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
    console.log("BulkComponent:selectFinalFile:");
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
      this.isValidFinalWavFileExt = false;
      this.validFinalFile = false;
      return false;
    } else {
      this.validFinalFile = true;
      this.isValidFinalWavFileExt = true;
    }
  }

  selectFile(event) {
    console.log("BulkComponent:selectFile:");
    this.selectedFiles = event.target.files;
    if (event.target.files[0].size == 0) {
      this.filesizeEmpty = true;
      this.isUploaded = false;
    } else {
      this.filesizeEmpty = false;
      this.selectedFiles = event.target.files;
      this.isUploaded = true;
    }
    if (!this.isValidFileExtension(this.selectedFiles.item(0))) {
      console.log("File Extension is not valid");
      this.isValidFileExt = false;
      this.isUploaded = false;
      return false;
    } else {
      this.validFile = true;
      this.isValidFileExt = true;
      this.isUploaded = true;
    }
  }

  onOpChange(event) {
    console.log("BulkComponent:onOpChange:", event);
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

  Upload() {

    console.log("BulkComponent:upload:");

    this.progress.percentage = 0;
    this.currentFileUpload = this.selectedFiles.item(0);
    console.log("File Type : ", this.currentFileUpload.type);
    console.log("File Name : ", this.currentFileUpload.name);

    this.fileName = this.currentFileUpload.name;
    this.onReset = false;

    if (this.isValidFileExtension(this.currentFileUpload)) {

      console.log("File Extension is valid");

      this.fileService.BulkUploadfile(this.currentFileUpload).subscribe(event => {
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
          this.processednumbers = obj.message;
          this.model.uploadPath = obj.uploadPath;
          console.log("Response Bulk File Info Path :" + obj.uploadPath);
          setInterval(() => {
            this.showProgress = false;
          }, 1000);

          this.showResponse = true;
          this.isUploaded = true;
          this.isSaveEnable = true;
          console.log("Response Bulk Info message: ", obj.message + " Status : " + obj.status);
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
    }
    this.selectedFiles = undefined;
  }

  Save() {

    console.log("BulkComponent:Save:");
    console.log("CampaignName : ", this.model.campaignName);
    console.log("Promotype : ", this.model.selectPromoType);
    console.log("DND : ", this.model.dnd);
    console.log("FilePath ::", this.model.uploadPath);

    if (this.model.StartDateTime > this.model.EndDateTime) {
      console.log("Dates Wrong entry :");
      // this.dateValidation = false;
      this.dateValidation = true;
    } else {
      console.log("Dates valid entry:");
      this.dateValidation = true;
    }

    if (this.dateValidation) {

      if (this.model.dnd === undefined || this.model.dnd === null) {
        this.dnd = false;
      } else {
        this.dnd = true;
      }
      console.log("DND : ", this.dnd);

      this.startDate = this.datePipe.transform(new Date(this.model.StartDateTime), "dd-MM-yyyy");
      console.log("Start Date After conversion :  --->  ", this.startDate);

      this.startTime = this.datePipe.transform(new Date(this.model.StartDateTime), "HH:mm:ss");
      console.log("Start Time After conversion :  --->  ", this.startTime);

      // this.endDate = this.datePipe.transform(new Date(this.model.EndDateTime), "dd-MM-yyyy HH:mm:ss");
      this.endDate = this.datePipe.transform(new Date(this.model.EndDateTime), "dd-MM-yyyy");
      console.log("End Date After conversion :  --->  ", this.endDate);

      this.progress.percentage = 0;
      // this.currentFileUpload = this.selectedFiles.item(0);
      // console.log("File Type : ", this.currentFileUpload.type);
      // console.log("File Name : ", this.currentFileUpload.name);

      this.currentWelcomeFileUpload = this.selectedWelcomeFiles.item(0);
      console.log("Welcome File Type : ", this.currentWelcomeFileUpload.type);
      console.log("Welcome File Name : ", this.currentWelcomeFileUpload.name);

      if (this.model.selectPromoType === "Promo") {
        console.log("ValidDigits : ", this.model.validDigits);
        this.currentFinalFileUpload = this.selectedFinalFiles.item(0);
        console.log("Final File Type : ", this.currentFinalFileUpload.type);
        console.log("Final File Name : ", this.currentFinalFileUpload.name);
        this.isValidFileExtension(this.currentFinalFileUpload);
      }
      this.fileName = this.currentFileUpload.name;
      this.onReset = false;

      if (this.isValidWaveFileExtension(this.currentWelcomeFileUpload)) {
        console.log("File Extension is valid");

        this.fileService.BulkfileToHttpReq(this.model.campaignName, this.currentWelcomeFileUpload,
          this.currentFinalFileUpload, this.currentFileUpload, this.model.selectPromoType, this.model.validDigits,
          this.startDate, this.endDate, this.startTime, this.dnd, this.model.uploadPath).subscribe(event => {

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
              setInterval(() => {
                this.showProgress = false;
              }, 1000);

              // this.showResponse = true;
              this.isUploaded = true;
              console.log("Response Bulk Info message: ", obj.message + " Status : " + obj.status);
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
      }
      this.selectedFiles = undefined;
    }
  }

  private isValidFileExtension(file): boolean {
    console.log("BulkComponent:isValidFileExtension:");
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
      console.log("Uploaded file not a txt file.");
      this.errors.push("Error (Extension): " + file.name);
      return false;
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
      console.log("Uploaded file not a .Wav,.mp3 file.");
      this.errors.push("Error (Extension): " + file.name);
      return false;
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

  reset() {
    console.log("BulkComponent:reset:");
    // window.location.reload();

    this.model.campaignName = "";
    this.model.validDigits = "";
    this.model.dnd = false;
    this.showResponse = false;
    this.isUploaded = false;
    this.isValidFileExt = true;
    this.selectedFiles = null;
    this.selectBox = false;
    this.onReset = true;
    this.validWelcomeFile = false;
    this.validFinalFile = false;
    this.validFile = false;
    this.isSaveEnable = false;

    this.getDates();

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
