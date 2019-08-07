import * as _ from 'lodash';
import { Pipe, PipeTransform } from '@angular/core';
import { IDepartment } from '../_model/departmentquota.model';

@Pipe({
    name: 'DeptQuotafilter'
})
export class DepartmentQuotaFilterPipe implements PipeTransform {
    transform(value: IDepartment[], data: IDepartment[], filter: string): any {

        if (filter) {
            return _.filter(data, row => row.deptName.toLowerCase().indexOf(filter.toLowerCase()) > -1);
        } else {
            return value;
        }
    }
}
