import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { IKiosk, IDisplay, IPrinter } from '../_model/devicesModel';


@Pipe({
    name: 'Kioskfilter'
})
export class KisokFilterPipe implements PipeTransform {
    transform(value: IKiosk[], data: IKiosk[], filter: string, caseInsensitive: boolean): any {
        if (filter) {
            return _.filter(data, row => row.kioskName.toLowerCase().indexOf(filter.toLowerCase()) > -1);
        } else {
            return value;
        }
    }
}

@Pipe({
    name: 'Displayfilter'
})
export class DisplayFilterPipe implements PipeTransform {
    transform(value: IDisplay[], data: IDisplay[], filter: string): any {
        if (filter) {
            return _.filter(data, row => row.displayName.toLowerCase().indexOf(filter.toLowerCase()) > -1);
        } else {
            return value;
        }
    }
}

@Pipe({
    name: 'Printerfilter'
})
export class PrinterFilterPipe implements PipeTransform {
    transform(value: IPrinter[], data: IPrinter[], filter: string): any {
        if (filter) {
            return _.filter(data, row => row.printerName.toLowerCase().indexOf(filter.toLowerCase()) > -1);
        } else {
            return value;
        }
    }
}
