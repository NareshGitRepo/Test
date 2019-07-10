import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
    name: 'servicefilter'
})

export class ServiceTypePipe implements PipeTransform {
    transform(items: any[], totalData: any[], filter: string, filterKey: string, filterStatus: string): any {

        if (!filter) {
            return items;
        }
        return totalData.filter(pipe => pipe[filterKey] != null && pipe[filterKey].toLowerCase().indexOf(filter.toLowerCase()) > -1)
    }
}
