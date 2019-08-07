import { Pipe, PipeTransform } from '@angular/core';
import { Filterkeyword } from '../_model/filterkey.model';


@Pipe({
  name: 'sortKeywords',
})

export class SortKeywordsPipe implements PipeTransform {

  transform(departmentsList: Filterkeyword[], path: string[], order: number = 1): Filterkeyword[] {

    if (!departmentsList || !path || !order) return departmentsList;

    return departmentsList.sort((a: Filterkeyword, b: Filterkeyword) => {
      // We go for each property followed by path
      path.forEach(property => {
        a = a[property];
        b = b[property];
      })

      // Order * (-1): We change our order
      return a > b ? order : order * (- 1);
    })

  }


}