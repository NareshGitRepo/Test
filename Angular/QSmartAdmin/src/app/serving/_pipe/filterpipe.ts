import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'formatTime'
  })
  export class FormatTimePipe implements PipeTransform {
  
    transform(value: number): string {
      value=value > 0 ? value : 0;
      const minutes: number = Math.floor(value / 60);
      let minutestext=minutes>0? (minutes+'').length==1? '0'+minutes : minutes+'' :'00';
      return  minutestext + ':' + ('00' + Math.floor(value - minutes * 60)).slice(-2);
    }
  
  }
  @Pipe({
    name: 'formatTimeWithSec'
  })
  export class FormatTimePipeWithSec implements PipeTransform {
  
    transform(value: number): string {
      value=value > 0 ? value : 0;
      const Secounds: number = Math.floor(value / 60);
      const minutes: number = Math.floor(Secounds / 60);
      let minutestext=minutes>0? (minutes+'').length==1? '0'+minutes : minutes+'' :'00';
      return  minutestext + ':' + ('00' + Math.floor( Secounds - minutes * 60)).slice(-2)+':' + ('00' + Math.floor(value - Secounds * 60)).slice(-2);
    }
  
  }


  @Pipe({
    name: 'dformatTimeWithSec'
  })
  export class DFormatTimePipeWithSec implements PipeTransform {
  
    transform(value: number): string {
      value=value > 0 ? value : 0;
      const Secounds: number = Math.floor(value / 60);
      const minutes: number = Math.floor(Secounds / 60);
      let minutestext=minutes>0? (minutes+'').length==1? '0'+minutes : minutes+'' :'00';
      return  minutestext + ':' + ('00' + Math.floor( Secounds - minutes * 60)).slice(-2)+':' + ('00' + Math.floor(value - Secounds * 60)).slice(-2);
    }
  
  }
  @Pipe({
    name: 'dformatTime'
  })
  export class DFormatTimePipe implements PipeTransform {
    transform(value: number): string {
      value=value > 0 ? value : 0;
      const minutes: number = Math.floor(value / 60);
      let minutestext=minutes>0? (minutes+'').length==1? '0'+minutes : minutes+'' :'00';
      return  minutestext + ':' + ('00' + Math.floor(value - minutes * 60)).slice(-2);
    }
    // transform(value: number): string {
    //   const minutes: number = Math.floor(value / 60);
    //   return ('00' + minutes).slice(-2) + ':' + ('00' + Math.floor(value - minutes * 60)).slice(-2);
    // }
  
  }
  
  @Pipe({
    name: 'tformatTimeWithSec'
  })
  export class TFormatTimePipeWithSec implements PipeTransform {
  
    transform(value: number): string {
      value=value > 0 ? value : 0;
      const Secounds: number = Math.floor(value / 60);
      const minutes: number = Math.floor(Secounds / 60);
      let minutestext=minutes>0? (minutes+'').length==1? '0'+minutes : minutes+'' :'00';
      return  minutestext + ':' + ('00' + Math.floor( Secounds - minutes * 60)).slice(-2)+':' + ('00' + Math.floor(value - Secounds * 60)).slice(-2);
    }
  
  }
  @Pipe({
    name: 'tformatTime'
  })
  export class TFormatTimePipe implements PipeTransform {
    transform(value: number): string {
      value=value > 0 ? value : 0;
      const minutes: number = Math.floor(value / 60);
      let minutestext=minutes>0? (minutes+'').length==1? '0'+minutes : minutes+'' :'00';
      return  minutestext + ':' + ('00' + Math.floor(value - minutes * 60)).slice(-2);
    }
    // transform(value: number): string {
    //   const minutes: number = Math.floor(value / 60);
    //   return ('00' + minutes).slice(-2) + ':' + ('00' + Math.floor(value - minutes * 60)).slice(-2);
    // }
  
  }