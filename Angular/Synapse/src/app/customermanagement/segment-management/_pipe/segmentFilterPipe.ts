import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { CustomersData, SegementCustomerData } from '../_model/segement-manage.model';

@Pipe({
    name: 'segmentfilter'
})

export class SegementFilterPipe implements PipeTransform {
    transform(value: SegementCustomerData[], data: SegementCustomerData[], filter: string, caseInsensitive: boolean): any {
        if (filter) {
          return _.filter(data, row => row.segmentName.toLowerCase().indexOf(filter.toLowerCase()) > -1);
        } else {
          return value;
        }
      }
}