import { Pipe, PipeTransform } from '@angular/core';
import { IDepartment } from '../_model/department.model';


@Pipe({
  name: 'sortDepartments',
})

export class SortDepartmentsPipe implements PipeTransform {

  transform(departmentsList: IDepartment[], path: string[], order: number = 1): IDepartment[] {

    if (!departmentsList || !path || !order) return departmentsList;

    return departmentsList.sort((a: IDepartment, b: IDepartment) => {
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