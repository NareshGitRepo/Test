import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'TimeWithSec'
  })
  export class TimePipe implements PipeTransform {
  
    transform(value: number): string {
      value = value > 0 ? value : 0;
      const Secounds: number = Math.floor(value / 60);
      const minutes: number = Math.floor(Secounds / 60);
      //let minutestext=minutes>0? (minutes+'').length==1? '0'+minutes : minutes+'' :'00';
      return ('00' + Math.floor(Secounds - minutes * 60)).slice(-2) + ':' + ('00' + Math.floor(value - Secounds * 60)).slice(-2);
    }
  
  }