import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'getTypeData'
})
export class GetTypePipe implements PipeTransform {

    transform(value: any): string {

        return typeof (value);
    }

}

@Pipe({
    name: 'getKeyData'
})
export class GetKeyData implements PipeTransform {

    transform(value: any): string[] {
        return Object.keys(value);

    }

}


