import * as _ from 'lodash';

import { Pipe, PipeTransform } from '@angular/core';

import { IAlertDataModel } from '../_model/offlineModel';

@Pipe({
    name: 'offlinefilter'
})
export class OfflineAlertsFilterPipe implements PipeTransform {
    transform(value: IAlertDataModel[], data: IAlertDataModel[], filter: string): any {
        if (filter) {
            return _.filter(data, row => row.offlineAlertName.toLowerCase().indexOf(filter.toLowerCase()) > -1 );
        } else {
            return value;
        }
    }
}
