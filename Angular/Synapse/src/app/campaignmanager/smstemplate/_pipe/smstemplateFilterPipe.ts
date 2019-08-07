import { Pipe, PipeTransform } from '@angular/core';
import * as _ from "lodash";
import { ISmsTemplate } from '../_model/smstemplate.model';

@Pipe({
  name: 'SmsTemplatefilter'
})

export class SmsTemplateFilterPipe implements PipeTransform {
  transform(value: ISmsTemplate[], data: ISmsTemplate[], filter: string, caseInsensitive: boolean): any {
    if (filter) {
      return _.filter(data, row => row.templateName.toLowerCase().indexOf(filter.toLowerCase()) > -1);
    } else {
      return value;
    }
  }
}