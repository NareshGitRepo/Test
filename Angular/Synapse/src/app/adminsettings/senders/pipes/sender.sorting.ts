// import { Pipe, PipeTransform } from '@angular/core';
// import { Isender } from '../model/sender.model';

// @Pipe({
//     name:'senderInterfaces',
// })

// export class SenderInterfacesPipe implements PipeTransform {

//     transform(senderlist:Isender[],path:string[],order:number = 1):Isender[] {

//         if (!senderlist || !path || !order) return senderlist;

//     return senderlist.sort((a: Isender, b: Isender) => {
//       // We go for each property followed by path
//       path.forEach(property => {
//         a = a[property];
//         b = b[property];
//       })

//       // Order * (-1): We change our order
//       return a > b ? order : order * (- 1);
//     })

//     }


// }