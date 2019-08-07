import { Pipe, PipeTransform } from '@angular/core';
import { ICampaignDataModel } from '../_model/campaignModel';

@Pipe({
    name: 'campfilter'
})
export class CampaignFilterPipe implements PipeTransform {
    transform(items: any[], totalData: ICampaignDataModel[], filter: string): any {
        console.log(' TotalData ', totalData);

        if (!filter) {
            return items;
        }

        // return totalData.filter(campaign => campaign.campName ? campaign.campName.indexOf(filter) > -1 : "")
        return totalData.filter(campaign => campaign.campName.toLowerCase() ? campaign.campName.toLowerCase().indexOf(filter.toLowerCase()) === 0 : "")
    }

}
@Pipe({
    name: 'messgaereplace'
})
export class CampaignMessgaeReplacePipe implements PipeTransform {
    transform(items: string, totalData: any): string {
        console.log(' TotalData ', totalData);
            if (items.includes('<$') && items.includes('$>')) {
                for (var x in totalData) {

                    items = items.replace(new RegExp('<\\$'+x+'\\$>', 'g'), totalData[x]);
                }
                console.log("items=>",items); 
            }
    
        return items
    }

}
@Pipe({
    name: 'truncate'
})
export class MessageLimitPipe implements PipeTransform {

    transform(value: any, limit: number = 10, trail: string = '...'): string {
        if (value == null) {
            return "";
        }
        return value.length > limit ? value.substring(0, limit) + trail : value;
    }

}

