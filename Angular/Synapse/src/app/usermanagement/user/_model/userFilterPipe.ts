import { Pipe, PipeTransform } from '@angular/core';

import * as _ from 'lodash';
import { ILoginDto, IUser } from './usermodel';


@Pipe({
    name: 'Userfilter'
})
export class UserFilterPipe implements PipeTransform {
    transform(value: ILoginDto[], data: IUser[], filter: string): any {

        if (filter) {
            return _.filter(data, row => row.lastname != null && row.lastname.toLowerCase().indexOf(filter.toLowerCase()) > -1 ||
                row.firstname.toLowerCase().indexOf(filter.toLowerCase()) > -1 ||
                row.login.toLowerCase().indexOf(filter.toLowerCase()) > -1 ||
                (row.depts.length>0?row.depts.findIndex(x=>x.deptName.toLowerCase().indexOf(filter.toLowerCase()) > -1)>-1:false));
        } else {
            return value;
        }
    }
}
