import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { Isender } from '../model/sender.model';

@Pipe({
    name: 'senderfilter'
})
export class Senderfilterpipe implements PipeTransform {
    transform(value: Isender[], data: Isender[], filter: string): any {

        if (filter) {
            return _.filter(data, row => row.senderName.toLowerCase().indexOf(filter.toLowerCase()) > -1 );
        } else {
            return value;
        }
    }
}
