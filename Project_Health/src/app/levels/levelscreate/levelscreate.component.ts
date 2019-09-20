import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ILevelResponse, ILevelData, ILevelRes, ILevelCreate } from '../_model/levelModel';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppConfig, ITokenInfo } from '../../_helpers/app.config';
import { AlertMessageService, ActionType, AlertType } from '../../_services/alertMessageService';
import { LevelService } from '../_service/levelService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-levelscreate',
  templateUrl: './levelscreate.component.html',
  styleUrls: ['./levelscreate.component.scss']
})
export class LevelscreateComponent implements OnInit {

  loading: boolean = false;
  levelForm: FormGroup;
  levelResponce: ILevelResponse;
  levelData: ILevelCreate
  orgId: number;
  _tokenInfo: any;


  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public _editLeveldata: ILevelData, private dialogRef: MatDialogRef<LevelscreateComponent>, private translate: TranslateService,
    private levelService: LevelService, private appConfig: AppConfig, private router: Router, private alertMessage: AlertMessageService) {
    let tokenData = this.appConfig.getTokenInfo() as ITokenInfo;
    if (tokenData)
      this._tokenInfo = tokenData.tokenSub;
    if (this._tokenInfo && tokenData) {
      this.orgId = this._tokenInfo.orgId;
    }
    console.log("edit level::::", _editLeveldata);
  }

  ngOnInit() {
    this.levelForm = this.fb.group({
      levelName: [null],
      floorArbName: [null]//,
     // building:[null]
    });

    if (this._editLeveldata) {
      this.levelForm.patchValue({
        levelName: this._editLeveldata.floorName,
        floorArbName: this._editLeveldata.floorArbName
      });
    }
  }

  createLevel() {
    this.loading = true;
    if (!this._editLeveldata) {
      this.levelData = {
        floorName: (this.levelForm.value.levelName as string).trim(),
        floorArbName: (this.levelForm.value.floorArbName as string).trim(),
        orgId: this.orgId,
      } as ILevelCreate

      console.log("levels data=>", this.levelData);

      this.levelService.createLevel(this.levelData).subscribe((response: ILevelResponse) => {
        if (response.status == true) {
          this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
          this.dialogRef.close(this.levelData);
          // this.levelForm.reset();
        }
        else {
          this.alertMessage.showAlert(response.messages, ActionType.FAILED, AlertType.ERROR);
        }
        this.loading = false;
      }, error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.log("Failed :: ", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
    }
    else {
      this.levelData = {
        floorId: this._editLeveldata.floorId,
        floorName: (this.levelForm.value.levelName as string).trim(),
        floorArbName: (this.levelForm.value.floorArbName as string).trim(),
        status: 1,
        orgId: this._editLeveldata.orgId,// orgId,
      } as ILevelCreate;
      console.log('Data=>', JSON.stringify(this.levelData));
      this.levelService.updateLevel(this.levelData).subscribe((response: ILevelRes) => {
        if (response.status) {
          this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
          this.dialogRef.close(this.levelData);
        } else {
          this.alertMessage.showAlert(response.messages, ActionType.FAILED);
        }
        this.loading = false;
      }, error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.log("Failed :: ", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
    }
  }
  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
}