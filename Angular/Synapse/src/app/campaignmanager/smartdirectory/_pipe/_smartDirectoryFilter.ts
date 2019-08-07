import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { GroupsWithContactGlobal, GroupDept, IUsersList } from '../_model/smartdirectort';



@Pipe({
    name: 'Globalfilter'
})
export class GlobalFilterPipe implements PipeTransform {
    transform(value: GroupsWithContactGlobal[], data: GroupsWithContactGlobal[], filter: string, caseInsensitive: boolean): any {
        if (filter) {
            return _.filter(data, row => row.cntGroupName.toLowerCase().startsWith(filter.toLowerCase()));
        } else {
            return value;
        }
    }
}

@Pipe({
    name: 'Departementfilter'
})
export class DepartementFilterPipe implements PipeTransform {
    transform(value: GroupDept[], data: GroupDept[], filter: string): any {
        if (filter) {
            return _.filter(data, row => row.groupName.toLowerCase().startsWith(filter.toLowerCase()));
        } else {
            return value;
        }
    }
}

@Pipe({
    name: 'Userfilter'
})
export class UserFilterPipe implements PipeTransform {
    transform(value: IUsersList[], data: IUsersList[], filter: string): any {
        if (filter) {
            return _.filter(data, row => row.groupName.toLowerCase().startsWith(filter.toLowerCase()));
        } else {
            return value;
        }
    }
}
