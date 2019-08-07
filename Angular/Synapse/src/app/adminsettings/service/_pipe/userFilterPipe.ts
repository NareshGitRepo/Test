import * as _ from 'lodash';

import { Pipe, PipeTransform } from '@angular/core';

import { IService } from '../_model/servicemanagement.model';

@Pipe({
    name: 'Userfilter'
})
export class ServicesFilterPipe implements PipeTransform {
    transform(value: IService[], data: IService[], filter: string): any {
    console.log('data ',data);
        if (filter) {
            return _.filter(data, row => { if(row.serviceName!=null) return row.serviceName.toLowerCase().indexOf(filter.toLowerCase()) > -1} );
        } else {
            return value;
        }
    }
}
