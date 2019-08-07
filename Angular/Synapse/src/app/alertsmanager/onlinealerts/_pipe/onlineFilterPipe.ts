import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { OnlineAlert, IGDbProfileInfo } from '../_model/onlinealerts.model';

@Pipe({
    name: 'Alertsfilter'
})
export class OnlineAlertsFilterPipe implements PipeTransform {
    transform(value: OnlineAlert[], data: OnlineAlert[], filter: string): any {

        if (filter) {
            return _.filter(data, row => row.onlineAlertName.toLowerCase().indexOf(filter.toLowerCase()) > -1 );
        } else {
            return value;
        }
    }
}
@Pipe({
    name: 'Profilefilter'
})
export class ProfileFilterPipe implements PipeTransform {
    transform(value: IGDbProfileInfo[], data: IGDbProfileInfo[], filter: string): any {

        if (filter) {
            return _.filter(data, row => row.profileName.toLowerCase().indexOf(filter.toLowerCase()) > -1 );
        } else {
            return value;
        }
    }
}

