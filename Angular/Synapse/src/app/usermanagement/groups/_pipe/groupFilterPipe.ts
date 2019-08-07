import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { Group } from '../_model/groupmanagement.model';

@Pipe({
    name: 'groupfilter'
})
export class GroupFilterPipe implements PipeTransform {
    transform(value: Group[], data: Group[], filter: string): any {

        if (filter) {
            return _.filter(data, row => row.groupName.toLowerCase().indexOf(filter.toLowerCase()) > -1 );
        } else {
            return value;
        }
    }
}

@Pipe({
    name:'groupDisableFilter'
})
export class GroupDisableFilterPipe implements PipeTransform{
    transform(data:any,filter:number):boolean{
        return (_.filter(data,row=>row==filter)).length>0 ? false : true ;
    }
}
