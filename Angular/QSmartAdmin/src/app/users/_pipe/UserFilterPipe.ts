import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'Userfilter'
})

export class UserFilterPipe implements PipeTransform {
  transform(items: any[], totalData: any[], filter: string, filterKey: string,filterStatus: string): any {

    if (!filter) {
      return items;
    }
    let total= totalData.filter(pipe =>
      {
        let filterKeys=filterKey.split(',');
        if(filterKeys.length>1)
        {
          return (pipe[filterKeys[0]] != null && pipe[filterKeys[0]].toLowerCase().indexOf(filter.toLowerCase()) > -1) || (pipe[filterKeys[1]] != null && pipe[filterKeys[1]].toLowerCase().indexOf(filter.toLowerCase()) > -1);
        }
        return pipe[filterKey] != null && pipe[filterKey].toLowerCase().indexOf(filter.toLowerCase()) > -1;
      });
  if(filterStatus !='')
    return total.filter(pipe => pipe.isactive+'' == filterStatus)
    else return total;

    // || user[filterKey].firstname.indexOf(filter.toLowerCase()) > -1 || user[filterKey].lastname.indexOf(filter.toLowerCase()) > -1)
  }
}
