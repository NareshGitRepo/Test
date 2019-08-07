import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'Senderfilter'
})
export class SenderFilterPipe implements PipeTransform {
    transform(items: any[], totalData:any[],  filter: string,filterKey:string): any {
        if (!filter) {
            return items;
        }
        if(totalData)
        return totalData.filter( sender => sender[filterKey] !=null &&  sender[filterKey].indexOf(filter) > -1);
        else
        return totalData;
    }
    
}