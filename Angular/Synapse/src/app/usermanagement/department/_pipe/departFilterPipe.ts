import { Pipe, PipeTransform } from '@angular/core';
import * as _ from "lodash";
import { IDepartment } from '../_model/department.model';

@Pipe({
  name: 'Departfilter'
})

export class DepartFilterPipe implements PipeTransform {
  transform(value: IDepartment[], data: IDepartment[], filter: string, caseInsensitive: boolean): any {
    if (filter) {
      return _.filter(data, row => row.deptName.toLowerCase().indexOf(filter.toLowerCase()) > -1);
    } else {
      return value;
    }
  }
}