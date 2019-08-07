import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'Utilityfilter'
})
export class UtilityFilterPipe implements PipeTransform {
    transform(items: any[], totalData:any,  filter: string,filterKey?: string): any {
        //  console.log(' MocampaignFilterPipe ',totalData);
        try
        { return !filter ? items: totalData.filter( uFilter => uFilter[filterKey].toLowerCase().indexOf(filter.toLowerCase()) > -1);}
        catch (e) { return items; }
         
      }
    
}