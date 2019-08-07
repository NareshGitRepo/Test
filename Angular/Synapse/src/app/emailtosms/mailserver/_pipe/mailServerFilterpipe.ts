import { Pipe, PipeTransform } from '@angular/core';
import * as _ from "lodash";
import { IMailServer, ICreateMailServer } from '../_model/mailserver.model';

@Pipe({
  name: 'MailServerfilter'
})

export class MailServerFilterPipe implements PipeTransform {
  transform(value: ICreateMailServer[], data: ICreateMailServer[], filter: string, caseInsensitive: boolean): any {
    if (filter) {
      return _.filter(data, row => row.emailServerName.toLowerCase().indexOf(filter.toLowerCase()) > -1);
    } else {
      return value;
    }
  }
}
