import { Pipe, PipeTransform } from '@angular/core';
import * as _ from "lodash";
import { ISmsToEmail } from '../_model/smstoemail.model';


@Pipe({
  name: 'SmstoEmailfilter'
})

export class SmstoEmailFilterPipe implements PipeTransform {
  transform(value: ISmsToEmail[], data: ISmsToEmail[], filter: string, caseInsensitive: boolean): any {
    if (filter) {
    
      return _.filter(data, row =>row.smsToEmailName.toLowerCase().indexOf(filter.toLowerCase()) > -1);
    } else {
      return value;
    }
  }
}

   