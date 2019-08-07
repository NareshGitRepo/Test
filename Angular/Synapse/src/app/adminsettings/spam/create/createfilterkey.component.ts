import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AsyncValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { Filterkeyword, ApiResponse } from '../_model/filterkey.model';
import { FilterkeyService } from '../_service/filterkey.service';
import { AlertMessageService, ActionType } from '../../../_services/AlertMessageService';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-createfilterkey',
  templateUrl: './createfilterkey.component.html',
  styleUrls: ['./createfilterkey.component.scss']
})
export class CreatefilterkeyComponent implements OnInit {
  keywordForm: FormGroup;
  keywordData: Filterkeyword;
  loading: boolean = false;
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<CreatefilterkeyComponent>, private keyService: FilterkeyService, private alertMessage: AlertMessageService,
    @Inject(MAT_DIALOG_DATA) public _editKeyword: Filterkeyword, private translate: TranslateService, ) { }

  ngOnInit() {
    this.keywordForm = this.fb.group({
      keywordName: [null, Validators.required],
      validateKeywordName: [this._editKeyword != null ? this._editKeyword.keywordName : null, [Validators.required], [KeywordValidator(this.keyService, this._editKeyword != null ? this._editKeyword.keywordName : '', this._editKeyword != null ? true : false)]],
    });
    if (this._editKeyword != null) {
      this.keywordForm.patchValue(this._editKeyword);
      // this.keywordForm.get('validateKeywordName').clearValidators();
      // this.keywordForm.get('validateKeywordName').clearAsyncValidators();
    }
  }

  createkeyword() {
    this.loading = true;
    if (!this._editKeyword) {
      this.keywordData = {
        keywordName: this.keywordForm.value.keywordName as string
      }
      this.keyService.createFilterKeyword(this.keywordData).subscribe((result) => {
        if (result) {
          this.alertMessage.showAlert(result.message, ActionType.SUCCESS);
          this.dialogRef.close(this.keywordData);
        } else {
          this.alertMessage.showAlert(result.message, ActionType.FAILED);
        }
        this.loading = false;
      }, error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-createFilterKeyword==>", JSON.stringify(error));
        this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      })
    }
    else {
      this.keywordData = {
        keywordId: this._editKeyword.keywordId,
        keywordName: this.keywordForm.value.keywordName as string
      }
      this.keyService.updateKeyword(this.keywordData).subscribe((response: ApiResponse) => {
        if (response) {
          this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
          this.dialogRef.close(this.keywordData);
        } else {
          this.alertMessage.showAlert(response.message, ActionType.FAILED);
        }
        this.loading = false;
      }, error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-createkeyword==>", JSON.stringify(error));
        this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
    }
  }
}

export function KeywordValidator(service: FilterkeyService, name: string, action?: boolean): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    if (action && name == (control.value as string).trim()) {
      const observable = Observable.create(function subscribe(observer) {
        observer.next({ status: true, message: '' } as ApiResponse);
        observer.complete();
      });
      return control.value != null ? observable
        .map(response => {
          console.log(response.status)
          return !response.status ? { invalid: true } : null
        }) : null;
    }
    else
      return control.value != null ? service.validateKeywordName((control.value as string).trim())
        .map(response => {
          console.log(response.status)
          return !response.status ? { invalid: true } : null
        }, error => {
          return { invalid: true }
        }) : null;
  };
}