import { Pipe, PipeTransform } from '@angular/core';
import * as _ from "lodash";
import { Filterkeyword } from '../_model/filterkey.model';
// import { IDepartment } from '../_model/department.model';

@Pipe({
  name: 'keywordFilter'
})

export class keywordFilterPipe implements PipeTransform {
  transform(value: Filterkeyword[], data: Filterkeyword[], filter: string, caseInsensitive: boolean): any {
    if (filter) {
      return _.filter(data, row => row.keywordName.toLowerCase().indexOf(filter.toLowerCase()) > -1);
    } else {
      return value;
    }
  }
}