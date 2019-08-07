import { Pipe, PipeTransform } from '@angular/core';
import * as _ from "lodash";

@Pipe({
  name: 'PlatformPipefilter'
})

export class PlatformquotaFilterPipe implements PipeTransform {
  transform(value: any, data: any, filter: string, caseInsensitive: boolean): any {
  }
}