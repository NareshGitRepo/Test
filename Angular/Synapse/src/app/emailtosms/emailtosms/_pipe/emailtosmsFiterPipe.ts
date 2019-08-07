import { Pipe, PipeTransform } from '@angular/core';
import * as _ from "lodash";
import {IEmailTosms } from '../_model/emailtosms.model';

@Pipe({
  name: 'EmailtoSmsfilter'
})

export class EmailtoSmsFilterPipe implements PipeTransform {
  transform(value: IEmailTosms[], data: IEmailTosms[], filter: string): any {

    if (filter) {
      return _.filter(data, row => row.name!=null && row.name.toLowerCase().indexOf(filter.toLowerCase()) > -1);
    } else {
      return value;
    }
  }
}