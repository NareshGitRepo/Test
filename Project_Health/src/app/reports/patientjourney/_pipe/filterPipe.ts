import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'dformatTime'
})
export class DFormatTimePipe implements PipeTransform {
  transform(value: number): string {console.log('value=>',value);
  
    value=value > 0 || value != null ? value : 0;
    const minutes: number = Math.floor(value / 60);
    let minutestext=minutes>0? (minutes+'').length==1? '0'+minutes : minutes+'' :'00';
    return  minutestext + ':' + ('00' + Math.floor(value - minutes * 60)).slice(-2);
  }

}
