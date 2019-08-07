import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import {InterfaceInfo } from '../_model/interfaces.model';

@Pipe({
    name: 'Userfilter'
})
export class InterfacesFilterPipe implements PipeTransform {
    transform(value: InterfaceInfo[], data: InterfaceInfo[], filter: string): any {

        if (filter) {
            return _.filter(data, row => row.interfaceName != null  && row.interfaceName.toLowerCase().indexOf(filter.toLowerCase()) > -1 );
        } else {
            return value;
        }
    }
}
