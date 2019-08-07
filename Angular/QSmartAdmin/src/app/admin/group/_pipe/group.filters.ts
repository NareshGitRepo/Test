import { Pipe, PipeTransform } from '@angular/core';
import {  IGroupList } from '../_model/group.model';
import * as _ from 'lodash';

@Pipe({
    name: 'Userfilter'
})
export class GroupFilterPipe implements PipeTransform {
    transform(items: any[], totalData: any[], filter: string, filterKey: string,filterStatus: string): any {

        if (!filter) {
          if(filterStatus !='')
        return totalData.filter(pipe => pipe.status+'' == filterStatus)
        else return items;
        }
        let ttotal= totalData.filter(pipe => pipe[filterKey] != null && pipe[filterKey].toLowerCase().indexOf(filter.toLowerCase()) > -1)
        console.log("ttotal :::=>",ttotal);
        return ttotal;
      }
}

