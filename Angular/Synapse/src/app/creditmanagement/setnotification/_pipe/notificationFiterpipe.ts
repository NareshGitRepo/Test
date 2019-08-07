import { Pipe, PipeTransform } from '@angular/core';
import * as _ from "lodash";
import { IPlatformAlert } from '../_model/setnotification.model';
 
@Pipe({
 name: 'Notificationfilter'
})
 
export class NotifyFilterPipe implements PipeTransform {
 transform(value: IPlatformAlert[], data: IPlatformAlert[], filter: string, caseInsensitive: boolean): any {
 if (filter) {
 return _.filter(data, row => row.alertsName.toLowerCase().indexOf(filter.toLowerCase()) > -1);
 } else {
 return value;
 }
 }
}