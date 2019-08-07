import { Pipe, PipeTransform } from '@angular/core';
import * as _ from "lodash";
import { IGEmailTemplate } from '../_model/emailtemplate.model';

@Pipe({
  name: 'EmailTemplatefilter'
})

export class EmailTemplateFilterPipe implements PipeTransform {
  transform(value: IGEmailTemplate[], data: IGEmailTemplate[], filter: string, caseInsensitive: boolean): any {
    if (filter) {
      return _.filter(data, row => row.templateName.toLowerCase().indexOf(filter.toLowerCase()) > -1);
    } else {
      return value;
    }
  }
}