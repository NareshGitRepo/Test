import * as _ from 'lodash';

import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../_model/userquota.model';


@Pipe({
    name: 'UserQuotafilter'
})
export class UserQuotaFilterPipe implements PipeTransform {
    transform(value: User[], data: User[], filter: string): any {

        if (filter) {
            return _.filter(data, row => row.login.toLowerCase().indexOf(filter.toLowerCase()) > -1 );
        } else {
            return value;
        }
    }
}
