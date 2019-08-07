import { Pipe, PipeTransform } from '@angular/core';
import { InterfaceInfo } from '../_model/interfaces.model';

@Pipe({
  name: 'sortInterfaces',
})

export class SortInterfacesPipe implements PipeTransform {

  transform(interfacesList: InterfaceInfo[], path: string[], order: number = 1): InterfaceInfo[] {

    if (!interfacesList || !path || !order) return interfacesList;

    return interfacesList.sort((a: InterfaceInfo, b: InterfaceInfo) => {
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
