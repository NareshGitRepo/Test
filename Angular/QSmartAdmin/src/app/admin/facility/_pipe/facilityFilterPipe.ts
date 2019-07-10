import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
    name: 'facilityfilter'
})
export class FacilityFilterPipe implements PipeTransform {
    transform(items: any[], totalData: any[], filter: string, filterKey: string, filterStatus: string): any {

        if (!filter) {

            if (filterStatus != "") { return totalData.filter(pipe => pipe.status + "" == filterStatus); }
            else
                return items;
        }
        console.log("filterKey :: ", filterKey);
        let ttotal = totalData.filter(
            pipe =>
                pipe[filterKey] != null &&
                pipe[filterKey].toLowerCase().indexOf(filter.toLowerCase()) > -1
        );
        return ttotal;
    }


}


