import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { deviceType } from '../_model/devicesModel';
import { AppConfig, ITokenInfo, IUserUpdateDto } from '../../_helpers/app.config';

@Component({
  selector: 'app-createdevices',
  templateUrl: './createdevices.component.html',
  styleUrls: ['./createdevices.component.scss']
})
export class CreatedevicesComponent implements OnInit {

  deviceType = 1;
  orgId: number;
  data: any
  _tokenInfo: IUserUpdateDto;

  constructor(@Inject(MAT_DIALOG_DATA) public edit: any, private appConfig: AppConfig) {
    let tokenData = this.appConfig.getTokenInfo() as ITokenInfo;
    if (tokenData)
      this._tokenInfo = tokenData.tokenSub;
    if (this._tokenInfo && tokenData) {
      this.orgId = this._tokenInfo.orgId;
    }
    if (edit) {
      this.data = edit.data;
    }
  }

  ngOnInit() {
    if (this.edit) {
      this.formSelection(this.edit.type);
    }
  }

  formSelection(value: string) {
    switch (value) {
      case deviceType.Kiosks:
        this.deviceType = 2;
        break;
      case deviceType.DisplayBoards:
        this.deviceType = 3;
        break;
      case deviceType.Printers:
        this.deviceType = 4;
        break;
    }
  }
  devicesForm() {
    this.deviceType = 1;
  }
}