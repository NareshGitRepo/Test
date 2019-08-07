import { Pipe, PipeTransform } from '@angular/core';
import * as _ from "lodash";
import { IUserQuota } from '../_model/userquota.model';

@Pipe({
  name: 'Userquotafilter'
})

export class UserquotaFilterPipe implements PipeTransform {
  transform(value: IUserQuota[], data: IUserQuota[], filter: string, caseInsensitive: boolean): any {
    if (filter) {
      return _.filter(data, row => row.userName.toLowerCase().indexOf(filter.toLowerCase()) > -1);
    } else {
      return value;
    }
  }
}