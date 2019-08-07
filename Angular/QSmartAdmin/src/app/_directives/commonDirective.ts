import { Directive, ElementRef, HostListener } from '@angular/core';

import { isNumeric } from 'rxjs/internal-compatibility';

@Directive({
    selector: '[allow-characters-numbers-nospace]'
})
export class AlphaNumbersDirective {

    regexStr = new RegExp(/^[A-Z0-9,]*$/)
    regexP = new RegExp(/^([A-Z0-9,])*$/)

    constructor(private el: ElementRef) { }
    @HostListener('keypress', ['$event']) onKeyPress(event) {
        // console.log(event)
        if (event.which == 32)
            return false;
        else
            return new RegExp(this.regexStr).test(event.key);
    }
    @HostListener('paste', ['$event']) blockPaste(event: any) {

        const pastedInput: string = event.clipboardData ? event.clipboardData.getData('text/plain') : window['clipboardData'].getData('Text');
        const pastedInputw: string = (event.clipboardData ? this.el.nativeElement.value : event.target.value) + pastedInput;
        if (!this.regexP.test(pastedInput) || pastedInputw.includes(' ')) {
            event.preventDefault();
            return false;
        }
    }
}

@Directive({
    selector: '[allow-arabic-special]'
})
export class AllowArabicSpecialDirective {
    regexStr = new RegExp(/^[\u0621-\u064A,0-9 !”$@^#.?"':&’()*\+,\/;\[\\\]\^_`{|}~]+$/);
    regexP = new RegExp(/^([\u0621-\u064A,0-9 !”$@^#.?"':&’()*\+,\/;\[\\\]\^_`{|}~]+\s?)*$/)

    constructor(private el: ElementRef) { }
    @HostListener('keypress', ['$event']) onKeyPress(event) {
        let endposition = this.el.nativeElement.selectionEnd;
        if (this.el.nativeElement.value.length == 0 && event.which == 32)
            return false;
        // else if (event.which == 32 && (this.el.nativeElement.value[endposition - 1] == " " || this.el.nativeElement.value[endposition] == " ")) {
        //     return false;
        // }
        else
            return new RegExp(this.regexStr).test(event.key);
    }
    @HostListener('paste', ['$event']) blockPaste(event: any) {
        const pastedInput: string = event.clipboardData ? event.clipboardData.getData('text/plain') : window['clipboardData'].getData('Text');
        const pastedInputw: string = (event.clipboardData ? this.el.nativeElement.value : event.target.value) + pastedInput;
        if (!this.regexP.test(pastedInput)) {
            event.preventDefault();
            return false;
        }

    }
}


@Directive({
    selector: '[allow-english-special]'
})
export class AllowEngilshOnlyDirective {
    regexStr = new RegExp(/^[\A-Za-z,0-9 !”$@^#.?"':&’()*\+,\/;\[\\\]\^_`{|}~]+$/);
    regexP = new RegExp(/^([\A-Za-z,0-9 !”$@^#.?"':&’()*\+,\/;\[\\\]\^_`{|}~]+\s?)*$/)

    constructor(private el: ElementRef) { }
    @HostListener('keypress', ['$event']) onKeyPress(event) {
        let endposition = this.el.nativeElement.selectionEnd;
        if (this.el.nativeElement.value.length == 0 && event.which == 32)
            return false;
        // else if (event.which == 32 && (this.el.nativeElement.value[endposition - 1] == " " || this.el.nativeElement.value[endposition] == " ")) {
        //     return false;
        // }
        else
            return new RegExp(this.regexStr).test(event.key);
    }
    @HostListener('paste', ['$event']) blockPaste(event: any) {
        const pastedInput: string = event.clipboardData ? event.clipboardData.getData('text/plain') : window['clipboardData'].getData('Text');
        const pastedInputw: string = (event.clipboardData ? this.el.nativeElement.value : event.target.value) + pastedInput;
        if (!this.regexP.test(pastedInput)) {
            event.preventDefault();
            return false;
        }
    }
}

@Directive({
    selector: '[allow-Service-Arbic]'
})
export class ServiceArbicDirective {
    regexStr = new RegExp(/^[\u0621-\u064A,0-9 .&_()-/]+$/);
    regexP = new RegExp(/^([\u0621-\u064A,0-9 .&_()-/]+\s?)*$/)

    constructor(private el: ElementRef) { }
    @HostListener('keypress', ['$event']) onKeyPress(event) {
        let endposition = this.el.nativeElement.selectionEnd;
        if (this.el.nativeElement.value.length == 0 && event.which == 32)
            return false;
        // else if (event.which == 32 && (this.el.nativeElement.value[endposition - 1] == " " || this.el.nativeElement.value[endposition] == " ")) {
        //     return false;
        // }
        else
        {
            if(event.which != 32)
            return new RegExp(this.regexStr).test(event.key);
        }
    }
    @HostListener('paste', ['$event']) blockPaste(event: any) {
        const pastedInput: string = event.clipboardData ? event.clipboardData.getData('text/plain') : window['clipboardData'].getData('Text');
        const pastedInputw: string = (event.clipboardData ? this.el.nativeElement.value : event.target.value) + pastedInput;
        if (!this.regexP.test(pastedInput)) {
            event.preventDefault();
            return false;
        }
    }
}


@Directive({
    selector: '[allow-Service-English]'
})
export class ServiceEnglishDirective {
    regexStr = new RegExp(/^[\A-Za-z,0-9 .&_()-/]+$/);
    regexP = new RegExp(/^([\A-Za-z,0-9 .&()-/]+\s?)*$/)

    constructor(private el: ElementRef) { }
    @HostListener('keypress', ['$event']) onKeyPress(event) {
        let endposition = this.el.nativeElement.selectionEnd;
        if (this.el.nativeElement.value.length == 0 && event.which == 32)
            return false;
        // else if (event.which == 32 && (this.el.nativeElement.value[endposition - 1] == " " || this.el.nativeElement.value[endposition] == " ")) {
        //     return false;
        // }
        else
            return new RegExp(this.regexStr).test(event.key);
    }
    @HostListener('paste', ['$event']) blockPaste(event: any) {
        const pastedInput: string = event.clipboardData ? event.clipboardData.getData('text/plain') : window['clipboardData'].getData('Text');
        const pastedInputw: string = (event.clipboardData ? this.el.nativeElement.value : event.target.value) + pastedInput;
        if (!this.regexP.test(pastedInput)) {
            event.preventDefault();
            return false;
        }
    }
}
@Directive({
    selector: '[allow-Service-Arbic1]'
})
export class ServiceArbicDirective1 {
    regexStr = new RegExp(/^[\u0621-\u064A0-9 ._-]+$/);
    regexP = new RegExp(/^([\u0621-\u064A0-9 ._-]+\s?)*$/)

    constructor(private el: ElementRef) { }
    @HostListener('keypress', ['$event']) onKeyPress(event) {
        let endposition = this.el.nativeElement.selectionEnd;
        if (this.el.nativeElement.value.length == 0 && event.which == 32)
            return false;
        // else if (event.which == 32 && (this.el.nativeElement.value[endposition - 1] == " " || this.el.nativeElement.value[endposition] == " ")) {
        //        return false;
        // }
        else
        {
            if (event.which != 32)
            return new RegExp(this.regexStr).test(event.key);
        }
    }
    @HostListener('paste', ['$event']) blockPaste(event: any) {
        const pastedInput: string = event.clipboardData ? event.clipboardData.getData('text/plain') : window['clipboardData'].getData('Text');
        const pastedInputw: string = (event.clipboardData ? this.el.nativeElement.value : event.target.value) + pastedInput;
        if (!this.regexP.test(pastedInput)) {
            event.preventDefault();
            return false;
        }
    }
}


@Directive({
    selector: '[allow-Service-English1]'
})
export class ServiceEnglishDirective1 {
    regexStr = new RegExp(/^[\A-Za-z0-9 ._-]+$/);
    regexP = new RegExp(/^([\A-Za-z0-9 ._-]+\s?)*$/)

    constructor(private el: ElementRef) { }
    @HostListener('keypress', ['$event']) onKeyPress(event) {
        let endposition = this.el.nativeElement.selectionEnd;
        if (this.el.nativeElement.value.length == 0 && event.which == 32)
            return false;
        // else if (event.which == 32 && (this.el.nativeElement.value[endposition - 1] == " " || this.el.nativeElement.value[endposition] == " ")) {
        //     return false;
        // }
        else
            return new RegExp(this.regexStr).test(event.key);
    }
    @HostListener('paste', ['$event']) blockPaste(event: any) {
        const pastedInput: string = event.clipboardData ? event.clipboardData.getData('text/plain') : window['clipboardData'].getData('Text');
        const pastedInputw: string = (event.clipboardData ? this.el.nativeElement.value : event.target.value) + pastedInput;
        if (!this.regexP.test(pastedInput)) {
            event.preventDefault();
            return false;
        }
    }
}
@Directive({
    selector: '[allow-roomnumber-charecters]'
})
export class RoomNumberCharecters {
    checkList: CheckList[] = [{ Keyname: ',', KeyCode: 44 },
    { Keyname: '-', KeyCode: 45 }];
    regexStr = new RegExp(/^[A-Z0-9,-]*$/);
    regexStrP = new RegExp(/^([A-Z0-9,-]+\s?)*$/);
    constructor(private el: ElementRef) { }
    @HostListener('keypress', ['$event']) onKeyPress(event) {
        // console.log(event)
        //console.log("event.which=>", event.which, event.target.value,event.target.value.indexOf("-"));
        if (event.which == 32)
            return false;

        else if (event.target.value.includes('-')) {

            if (event.which == 44 || event.which == 45 || (event.which >= 65 && event.which <= 90))
                return false;
            else if (event.which >= 48 && event.which <= 57) {
                let valList = event.target.value.split('-');
                if (valList[valList.length - 1].length > 2)
                    return false;
                if (valList.length > 1)
                    if (valList[0].length < valList[1].length && valList[1].length < valList[0].length + 3)
                        return false;
            }
            else if (this.alowCheck(event, this.checkList))
                return false;
            // else
            //     return new RegExp(this.regexStr).test(event.key);
        }
        else if (event.target.value.includes(',') && event.which != 44 && event.which != 45) {
            let valList = event.target.value.split(',');
            if (valList[valList.length - 1].length > 2)
                return false;
        }
        else if (event.which == 45) {
            if (!isNumeric(event.target.value))
                return false;
            else if (this.alowCheck(event, this.checkList))
                return false;
            // else
            //     return new RegExp(this.regexStr).test(event.key);
        }
        else if (this.alowCheck(event, this.checkList))
            return false;
        else if (!event.target.value.includes('-') && !event.target.value.includes(',') && event.which != 45 && event.which != 44) {
            if (event.target.value.length > 2)
                return false;
        }

        return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: any) {
        let pastedInput: string = event.clipboardData ? event.clipboardData.getData('text/plain') : window['clipboardData'].getData('Text');
        // pastedInput = this.el.nativeElement.value + pastedInput;
        pastedInput = (event.clipboardData ? this.el.nativeElement.value : event.target.value) + pastedInput;
        if (!pastedInput.includes('-') && !pastedInput.includes(',')) {
            if (pastedInput.length > 3) {
                event.preventDefault();
                return false;
            }
        }
        else {

            if (pastedInput.startsWith('-') || pastedInput.startsWith(',')) {
                event.preventDefault();
                return false;
            }
            else if (pastedInput.includes('-')) {
                let valList = pastedInput.split('-');
                if (valList.length > 2) {
                    event.preventDefault();
                    return false;
                }
                else {
                    valList.forEach(data => {
                        if (data.length > 3) {
                            event.preventDefault();
                            return false;
                        }
                        else if (!isNumeric(data)) {
                            event.preventDefault();
                            return false;
                        }
                    });
                }
            }
            else if (pastedInput.includes(',')) {
                if (!this.regexStrP.test(pastedInput)) {
                    event.preventDefault();
                    return false;
                }
                else {
                    let valList = pastedInput.split(',');
                    valList.forEach(data => {
                        if (data.length > 3) {
                            event.preventDefault();
                            return false;
                        }
                    });
                }
            }
        }
        if (!this.regexStrP.test(pastedInput) || pastedInput.includes(' ')) {
            event.preventDefault();
            return false;
        }


    }
    alowCheck(event: any, checkList: CheckList[]) {
        if (event.target.value.includes('-')) {

        }
        let endposition = this.el.nativeElement.selectionEnd;
        let checkData = checkList.filter(data => data.KeyCode == event.which);
        return checkData.length > 0 ? (this.el.nativeElement.value.length == 0 ? true : (this.el.nativeElement.value[endposition - 1] == checkData[0].Keyname || this.el.nativeElement.value[endposition] == checkData[0].Keyname) ? true : false) : false;

    }
}



@Directive({
    selector: '[allow-characters-numbers-nocomma]'
})
export class AlphaNumbersnocommaDirective {

    regexStr = new RegExp(/^[A-Z0-9]*$/);
    regexP = new RegExp(/^([A-Z0-9]+\s?)*$/);

    constructor(private el: ElementRef) { }
    @HostListener('keypress', ['$event']) onKeyPress(event) {

        if (event.which == 32)
            return false;
        else
            return new RegExp(this.regexStr).test(event.key);
    }
    @HostListener('paste', ['$event']) blockPaste(event: any) {
        const pastedInput: string = event.clipboardData ? event.clipboardData.getData('text/plain') : window['clipboardData'].getData('Text');
        const pastedInputw: string = (event.clipboardData ? this.el.nativeElement.value : event.target.value) + pastedInput;
        if (!this.regexP.test(pastedInput) || pastedInputw.includes(' ')) {
            event.preventDefault();
            return false;
        }
    }
}

@Directive({
    selector: '[allow-mobilenumber-nospace]'
})
export class MobileNumberDirective {

    regexStr = new RegExp(/^[0-9]*$/);
    regexP = new RegExp(/^([0-9])*$/);

    constructor(private el: ElementRef) { }
    @HostListener('keypress', ['$event']) onKeyPress(event) {
        if (event.which == 32)
            return false;
        else
            return new RegExp(this.regexStr).test(event.key);
    }
    @HostListener('paste', ['$event']) blockPaste(event: any) {
        const pastedInput: string = event.clipboardData ? event.clipboardData.getData('text/plain') : window['clipboardData'].getData('Text');
        const pastedInputw: string = (event.clipboardData ? this.el.nativeElement.value : event.target.value) + pastedInput;
        if (pastedInput.length > 15) {
            event.preventDefault();
            return false;
        }
        else if (!this.regexP.test(pastedInput) || pastedInputw.includes(' ')) {
            event.preventDefault();
            return false;
        }
    }
}

@Directive({
    selector: '[allow-numbers-nospace]'
})
export class NumbersDirective {

    regexStr = new RegExp(/^[0-9,]*$/);
    regexP = new RegExp(/^([0-9,])*$/);

    constructor(private el: ElementRef) { }
    @HostListener('keypress', ['$event']) onKeyPress(event) {
        if (event.which == 32)
            return false;
        else
            return new RegExp(this.regexStr).test(event.key);
    }
    @HostListener('paste', ['$event']) blockPaste(event: any) {
        const pastedInput: string = event.clipboardData ? event.clipboardData.getData('text/plain') : window['clipboardData'].getData('Text');
        const pastedInputw: string = (event.clipboardData ? this.el.nativeElement.value : event.target.value) + pastedInput;
        if (!this.regexP.test(pastedInput) || pastedInputw.includes(' ')) {
            event.preventDefault();
            return false;
        }
    }
}



@Directive({
    selector: '[allow-number-nospace]'
})
export class NumberDirective {

    regexStr = new RegExp(/^[0-9]*$/)
    regexP = new RegExp(/^([0-9])*$/)

    constructor(private el: ElementRef) { }
    @HostListener('keypress', ['$event']) onKeyPress(event) {
        if (event.which == 32)
            return false;
        else
            return new RegExp(this.regexStr).test(event.key);
    }
    @HostListener('paste', ['$event']) blockPaste(event: any) {
        const pastedInput: string = event.clipboardData ? event.clipboardData.getData('text/plain') : window['clipboardData'].getData('Text');
        const pastedInputw: string = (event.clipboardData ? this.el.nativeElement.value : event.target.value) + pastedInput;
        if (!this.regexP.test(pastedInput) || pastedInputw.includes(' ')) {
            event.preventDefault();
            return false;
        }
    }
}



@Directive({
    selector: '[allow-number-customnospace]'
})
export class NumberCustomDirective {

    regexStr = new RegExp(/^[0-9]*$/)
    regexP = new RegExp(/^([0-9])*$/)

    constructor(private el: ElementRef) { }
    @HostListener('keypress', ['$event']) onKeyPress(event) {
        if (event.which == 32)
            return false;
        if (event.which == 48 && this.el.nativeElement.value.length == 0)
            return false;
        else
            return new RegExp(this.regexStr).test(event.key);
    }
    @HostListener('paste', ['$event']) blockPaste(event: any) {
        const pastedInput: string = event.clipboardData ? event.clipboardData.getData('text/plain') : window['clipboardData'].getData('Text');
        const pastedInputw: string = (event.clipboardData ? this.el.nativeElement.value : event.target.value) + pastedInput;
        if (!this.regexP.test(pastedInput) || pastedInputw.includes(' ')) {
            event.preventDefault();
            return false;
        } else if (pastedInput.length == 1 && pastedInput == '0') {
            event.preventDefault();
            return false;
        }
    }
}


@Directive({
    selector: '[allow-characters-singlespace]'
})
export class CharactersSingleSpaceDirective {
    regexStr = new RegExp(/^[a-zA-Z ]*$/)
    regexP = new RegExp(/^([a-zA-Z ]+\s?)*$/)

    constructor(private el: ElementRef) { }
    @HostListener('keypress', ['$event']) onKeyPress(event) {
        let endposition = this.el.nativeElement.selectionEnd;
        if (this.el.nativeElement.value.length == 0 && event.which == 32)
            return false;
        // else if (event.which == 32 && (this.el.nativeElement.value[endposition - 1] == " " || this.el.nativeElement.value[endposition] == " ")) {
        //     return false;
        // }
        else
            return new RegExp(this.regexStr).test(event.key);
    }
    @HostListener('paste', ['$event']) blockPaste(event: any) {
        const pastedInput: string = event.clipboardData ? event.clipboardData.getData('text/plain') : window['clipboardData'].getData('Text');
        const pastedInputw: string = (event.clipboardData ? this.el.nativeElement.value : event.target.value) + pastedInput;
        if (!this.regexP.test(pastedInput)) {
            event.preventDefault();
            return false;
        }
    }
}



@Directive({
    selector: '[allow-characters-withoutspace]'
})
export class CharactersWithOutSpaceDirective {
    regexStr = new RegExp(/^[a-zA-Z]*$/)
    regexP = new RegExp(/^([a-zA-Z]+\s?)*$/)

    constructor(private el: ElementRef) { }
    @HostListener('keypress', ['$event']) onKeyPress(event) {
        let endposition = this.el.nativeElement.selectionEnd;
        if (this.el.nativeElement.value.length == 0 && event.which == 32)
            return false;
        // else if (event.which == 32 && (this.el.nativeElement.value[endposition - 1] == " " || this.el.nativeElement.value[endposition] == " ")) {
        //     return false;
        // }
        else
            return new RegExp(this.regexStr).test(event.key);
    }
    @HostListener('paste', ['$event']) blockPaste(event: any) {
        const pastedInput: string = event.clipboardData ? event.clipboardData.getData('text/plain') : window['clipboardData'].getData('Text');
        const pastedInputw: string = (event.clipboardData ? this.el.nativeElement.value : event.target.value) + pastedInput;
        if (!this.regexP.test(pastedInput)) {
            event.preventDefault();
            return false;
        }
    }
}

@Directive({
    selector: '[allow-alpha-numeric-singlespace]'
})
export class AlphaNumericSingleSpaceDirective {

    regexStr = new RegExp(/^([a-zA-Z0-9 _-]+)$/)
    regexP = new RegExp(/^([a-zA-Z0-9 _-]+\s?)*$/)

    constructor(private el: ElementRef) { }

    @HostListener('keypress', ['$event']) onKeyPress(event) {
        let endposition = this.el.nativeElement.selectionEnd;
        if (this.el.nativeElement.value.length == 0 && event.which == 32)
            return false;
        // else if (event.which == 32 && (this.el.nativeElement.value[endposition - 1] == " " || this.el.nativeElement.value[endposition] == " ")) {
        //     return false;
        // }
        else
            return new RegExp(this.regexStr).test(event.key);
    }


    @HostListener('paste', ['$event']) blockPaste(event: any) {
        const pastedInput: string = event.clipboardData ? event.clipboardData.getData('text/plain') : window['clipboardData'].getData('Text');
        const pastedInputw: string = (event.clipboardData ? this.el.nativeElement.value : event.target.value) + pastedInput;
        console.log('pastedInput',pastedInput.length, 'pastedInputw',pastedInputw.length)
        if (!this.regexP.test(pastedInput)) {
            event.preventDefault();
            return false;
        }
    }
}

@Directive({
    selector: '[allow-all-singlespace]'
})
export class AllowAllSingleSpaceDirective {

    regexStr = new RegExp(/^[a-zA-Z0-9-_! ”$@^#.<>?":%&’()*\+,\/;\[\\\]\^_`{|}~]+$/)
    regexP = new RegExp(/^([a-zA-Z0-9-_! ”$@^#.<>?":%&’()*\+,\/;\[\\\]\^_`{|}~]+\s?)*$/)
    constructor(private el: ElementRef) { }

    @HostListener('keypress', ['$event']) onKeyPress(event) {
        let endposition = this.el.nativeElement.selectionEnd;
        if (this.el.nativeElement.value.length == 0 && event.which == 32)
            return false;
        // else if (event.which == 32 && (this.el.nativeElement.value[endposition - 1] == " " || this.el.nativeElement.value[endposition] == " ")) {
        //     return false;
        // }
        else
            return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: any) {
        const pastedInput: string = event.clipboardData ? event.clipboardData.getData('text/plain') : window['clipboardData'].getData('Text');
        const pastedInputw: string = (event.clipboardData ? this.el.nativeElement.value : event.target.value) + pastedInput;
        if (!this.regexP.test(pastedInput)) {
            event.preventDefault();
            return false;
        }
    }
}

@Directive({
  selector: '[allow-alpha-numeric-only]'
})
export class AlphaNumericsOnlyDirective {

  regexStr = new RegExp(/^([a-zA-Z0-9]+)$/)
  regexP = new RegExp(/^([a-zA-Z0-9])*$/)

  constructor(private el: ElementRef) { }

  @HostListener('keypress', ['$event']) onKeyPress(event) {
      let endposition = this.el.nativeElement.selectionEnd;
      if (this.el.nativeElement.value.length == 0 && event.which == 32)
          return false;
      else if (event.which == 32 && (this.el.nativeElement.value[endposition - 1] == " " || this.el.nativeElement.value[endposition] == " ")) {
          return false;
      }
      else
          return new RegExp(this.regexStr).test(event.key);
  }


  @HostListener('paste', ['$event']) blockPaste(event: any) {
      const pastedInput: string = event.clipboardData ? event.clipboardData.getData('text/plain') : window['clipboardData'].getData('Text');
      const pastedInputw: string = (event.clipboardData ? this.el.nativeElement.value : event.target.value) + pastedInput;
      if (!this.regexP.test(pastedInput)) {
          event.preventDefault();
          return false;
      }
  }
}

@Directive({
  selector: '[allow-alpha-numeric-with-colon]'
 })
 export class AlphaNumericWithColonDirective {
    checkList: CheckList[] = [{ Keyname: ':', KeyCode: 186 }];
    regexStr = new RegExp(/^[a-zA-Z0-9:]*$/)
    constructor(private el: ElementRef) { }
    @HostListener('keypress', ['$event']) onKeyPress(event) {
      let endposition = this.el.nativeElement.selectionEnd;
      console.log("event.which=>", event.which, 'endposition',endposition);
      if (event.which == 32)
      return false;
      else if (this.alowCheck(event, this.checkList))
      return false;
      else
      return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: any) {
      const pastedInput: string = event.clipboardData ? event.clipboardData.getData('text/plain') : window['clipboardData'].getData('Text');
      const pastedInputw: string = (event.clipboardData ? this.el.nativeElement.value : event.target.value) + pastedInput;
      if (!this.regexStr.test(pastedInput) || pastedInputw.includes(' ')) {
      event.preventDefault();
      }
      }
      alowCheck(event: any, checkList: CheckList[]) {
      let endposition = this.el.nativeElement.selectionEnd;
      let checkData = checkList.filter(data => data.KeyCode == event.which);
      return checkData.length > 0 ? (this.el.nativeElement.value.length == 0 ? true : (checkList.findIndex(x => x.Keyname == this.el.nativeElement.value[endposition - 1] || x.Keyname == this.el.nativeElement.value[endposition]) != -1) ? true : false) : false;

    }
 }

@Directive({
    selector: '[allow-special-characters-singlespace]'
})
export class SpecialCharactersSingleSpaceDirective {

    regexStr = new RegExp(/[-!$%^&*()_ +|~=`{}[:;<>?,.@#\]]/)
    regexP = new RegExp(/^([-!$%^&*()_ +|~=`{}[:;<>?,.@#\]]+\s?)*$/)
    constructor(private el: ElementRef) { }
    @HostListener('keypress', ['$event']) onKeyPress(event) {
        let endposition = this.el.nativeElement.selectionEnd;
        if (this.el.nativeElement.value.length == 0 && event.which == 32)
            return false;
        // else if (event.which == 32 && (this.el.nativeElement.value[endposition - 1] == " " || this.el.nativeElement.value[endposition] == " ")) {
        //     return false;
        // }
        else
            return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: any) {
        const pastedInput: string = event.clipboardData ? event.clipboardData.getData('text/plain') : window['clipboardData'].getData('Text');
        const pastedInputw: string = (event.clipboardData ? this.el.nativeElement.value : event.target.value) + pastedInput;
        if (!this.regexP.test(pastedInput)) {
            event.preventDefault();
            return false;
        }
    }
}

@Directive({
    selector: '[allow-alpha-special-singlespace]'
})
export class AlphabetsSpecialSingleSpaceDirective {

    regexStr = new RegExp(/^[a-zA-Z!”$@# ^:%&’()*\+,\/;\[\\\]\^_`{|}~]+$/)
    regexP = new RegExp(/^([a-zA-Z!”$@# ^:%&’()*\+,\/;\[\\\]\^_`{|}~]+\s?)*$/)

    constructor(private el: ElementRef) { }

    @HostListener('keypress', ['$event']) onKeyPress(event) {
        let endposition = this.el.nativeElement.selectionEnd;
        if (this.el.nativeElement.value.length == 0 && event.which == 32)
            return false;
        // else if (event.which == 32 && (this.el.nativeElement.value[endposition - 1] == " " || this.el.nativeElement.value[endposition] == " ")) {
        //     return false;
        // }
        else
            return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: any) {
        const pastedInput: string = event.clipboardData ? event.clipboardData.getData('text/plain') : window['clipboardData'].getData('Text');
        const pastedInputw: string = (event.clipboardData ? this.el.nativeElement.value : event.target.value) + pastedInput;
        if (!this.regexP.test(pastedInput)) {
            event.preventDefault();
            return false;
        }
    }
}

@Directive({
    selector: '[allow-number-special-singlespace]'
})
export class NumericSpecialSingleSpaceDirective {

    regexStr = new RegExp(/^[0-9!”$@# ^:%&’()*\+,\/;\[\\\]\^_`{|}~]+$/)
    regexP = new RegExp(/^([0-9!”$@# ^:%&’()*\+,\/;\[\\\]\^_`{|}~]+\s?)*$/)

    constructor(private el: ElementRef) { }
    @HostListener('keypress', ['$event']) onKeyPress(event) {
        let endposition = this.el.nativeElement.selectionEnd;
        if (this.el.nativeElement.value.length == 0 && event.which == 32)
            return false;
        // else if (event.which == 32 && (this.el.nativeElement.value[endposition - 1] == " " || this.el.nativeElement.value[endposition] == " ")) {
        //     return false;
        // }
        else
            return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: any) {
        const pastedInput: string = event.clipboardData ? event.clipboardData.getData('text/plain') : window['clipboardData'].getData('Text');
        const pastedInputw: string = (event.clipboardData ? this.el.nativeElement.value : event.target.value) + pastedInput;
        if (!this.regexP.test(pastedInput)) {
            event.preventDefault();
            return false;
        }
    }
}

@Directive({
    selector: '[allow-all-selected-characters-singlespace]'
})
export class SelectedSpecailCharactersDirective {

    regexStr = new RegExp(/^[a-zA-Z0-9,@,-.()_ ]*$/)
    regexP = new RegExp(/^([a-zA-Z0-9,@,-.()_ ]+\s?)*$/)



    constructor(private el: ElementRef) { }
    @HostListener('keypress', ['$event']) onKeyPress(event) {
        let endposition = this.el.nativeElement.selectionEnd;

        if (this.el.nativeElement.value.length == 0 && event.which == 32)
            return false;
        // else if (event.which == 32 && (this.el.nativeElement.value[endposition - 1] == " " || this.el.nativeElement.value[endposition] == " ")) {
        //     return false;
        // }
        else
            return new RegExp(this.regexStr).test(event.key);
    }
    @HostListener('paste', ['$event']) blockPaste(event: any) {
        const pastedInput: string = event.clipboardData ? event.clipboardData.getData('text/plain') : window['clipboardData'].getData('Text');
        const pastedInputw: string = (event.clipboardData ? this.el.nativeElement.value : event.target.value) + pastedInput;
        if (!this.regexP.test(pastedInput)) {
            event.preventDefault();
            return false;
        }
    }
}

@Directive({
    selector: '[allow-email-charecters]'
})
export class emailCharecters {
    checkList: CheckList[] = [{ Keyname: '.', KeyCode: 46 },
    { Keyname: '@', KeyCode: 64 },
    { Keyname: '-', KeyCode: 45 },
    { Keyname: '_', KeyCode: 95 }];
    regexStr = new RegExp(/^[a-zA-Z0-9-.@_z]*$/)
    constructor(private el: ElementRef) { }
    @HostListener('keypress', ['$event']) onKeyPress(event) {
        let endposition = this.el.nativeElement.selectionEnd;
        console.log("event.which=>", event.which);

        if (event.which == 32)
            return false;
        else if (this.alowCheck(event, this.checkList))
            return false;
        else
            return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: any) {
        const pastedInput: string = event.clipboardData ? event.clipboardData.getData('text/plain') : window['clipboardData'].getData('Text');
        const pastedInputw: string = (event.clipboardData ? this.el.nativeElement.value : event.target.value) + pastedInput;
        if (!this.regexStr.test(pastedInput) || pastedInputw.includes(' ')) {
            event.preventDefault();
        }
    }
    alowCheck(event: any, checkList: CheckList[]) {
        let endposition = this.el.nativeElement.selectionEnd;
        let checkData = checkList.filter(data => data.KeyCode == event.which);
        return checkData.length > 0 ? (this.el.nativeElement.value.length == 0 ? true : (checkList.findIndex(x => x.Keyname == this.el.nativeElement.value[endposition - 1] || x.Keyname == this.el.nativeElement.value[endposition]) != -1) ? true : false) : false;

    }
}
export interface CheckList {
    Keyname: string;
    KeyCode: number;
}
@Directive({
    selector: '[allow-all-numbers-comma-singlespace]'
})
export class NumbersCommaSingleSpaceDirective {

    regexStr = new RegExp(/^[0-9, ]*$/)
    regexP = new RegExp(/^([0-9, ]+\s?)*$/)

    constructor(private el: ElementRef) { }
    @HostListener('keypress', ['$event']) onKeyPress(event) {
        let endposition = this.el.nativeElement.selectionEnd;
        if (this.el.nativeElement.value.length == 0 && event.which == 32)
            return false;
        // else if (event.which == 32 && (this.el.nativeElement.value[endposition - 1] == " " || this.el.nativeElement.value[endposition] == " ")) {
        //     return false;
        // }
        else
            return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: any) {
        const pastedInput: string = event.clipboardData ? event.clipboardData.getData('text/plain') : window['clipboardData'].getData('Text');
        const pastedInputw: string = (event.clipboardData ? this.el.nativeElement.value : event.target.value) + pastedInput;
        if (!this.regexP.test(pastedInput)) {
            event.preventDefault();
            return false;
        }
    }
}

@Directive({
    selector: '[allow-email]'
})
export class EmailDirective {

    regexStr = new RegExp(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)
    constructor(private el: ElementRef) { }

    @HostListener('paste', ['$event']) blockPaste(event: any) {
        const pastedInput: string = event.clipboardData ? event.clipboardData.getData('text/plain') : window['clipboardData'].getData('Text');
        const pastedInputw: string = (event.clipboardData ? this.el.nativeElement.value : event.target.value) + pastedInput;
        if (!this.regexStr.test(pastedInput) || pastedInputw.includes(' ')) {
            event.preventDefault();
        }
    }
    @HostListener('change', ['$event']) OnChange(event: any) {
        // console.log('eventValue', event);
        this.validateFields(event);
    }
    validateFields(event) {
        setTimeout(() => {
            if (!this.regexStr.test(this.el.nativeElement.value))
                this.el.nativeElement.value = ''; event.preventDefault();
        }, 1)
    }
}


@Directive({
    selector: '[allow-multiemail]'
})
export class MultiEmailDirective {

    regexStr = new RegExp(/^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/g)
    constructor(private el: ElementRef) { }

    @HostListener('paste', ['$event']) blockPaste(event: any) {
        const pastedInput: string = event.clipboardData ? event.clipboardData.getData('text/plain') : window['clipboardData'].getData('Text');
        const pastedInputw: string = (event.clipboardData ? this.el.nativeElement.value : event.target.value) + pastedInput;
        if (!this.regexStr.test(pastedInput) || pastedInputw.includes(' ')) {
            event.preventDefault();
        }
    }
    @HostListener('change', ['$event']) OnChange(event: any) {
        //  console.log('eventValue', event);
        this.validateFields(event);
    }
    validateFields(event) {
        setTimeout(() => {
            if (!this.regexStr.test(this.el.nativeElement.value))
                this.el.nativeElement.value = ''; event.preventDefault();
        }, 1)
    }
}

@Directive({
    selector: '[allow-domain]'
})
export class DomainDirective {

    regexStr = new RegExp(/([a-z0-9]+\.)*[a-z0-9]+\.[a-z]+/)
    constructor(private el: ElementRef) { }

    @HostListener('paste', ['$event']) blockPaste(event: any) {
        const pastedInput: string = event.clipboardData ? event.clipboardData.getData('text/plain') : window['clipboardData'].getData('Text');
        const pastedInputw: string = (event.clipboardData ? this.el.nativeElement.value : event.target.value) + pastedInput;
        if (!this.regexStr.test(pastedInput) || pastedInputw.includes(' ')) {
            event.preventDefault();
        }
    }
    @HostListener('change', ['$event']) OnChange(event: any) {
        //  console.log('eventValue', event);
        this.validateFields(event);
    }
    validateFields(event) {
        setTimeout(() => {
            if (!this.regexStr.test(this.el.nativeElement.value))
                this.el.nativeElement.value = ''; event.preventDefault();
        }, 1)
    }

}

@Directive({
    selector: '[allow-htmltags]'
})
export class HtmlTagDirective {

    regexStr = new RegExp(/<([^\/>]+)\/>/g)
    constructor(private el: ElementRef) { }

    @HostListener('paste', ['$event']) blockPaste(event: any) {
        const pastedInput: string = event.clipboardData ? event.clipboardData.getData('text/plain') : window['clipboardData'].getData('Text');
        if (!this.regexStr.test(pastedInput) ) {
            event.preventDefault();
        }
    }
    @HostListener('change', ['$event']) OnChange(event: any) {
        // console.log('eventValue', event);
        this.validateFields(event);
    }
    validateFields(event) {
        setTimeout(() => {
            if (!this.regexStr.test(this.el.nativeElement.value))
                this.el.nativeElement.value = ''; event.preventDefault();
        }, 1)
    }

}

@Directive({
    selector: '[allow-camp-cal-characters]'
})
export class CampCalCharactersDirective {
    // regexStr = '^[a-zA-Z0-9_&]*$';
    regexStr = /((0[1-9]|[12])[/](0[1-9]|[1-9]|[12]\d|3[01])[/](([2]\d)\d{2}), (0[0-9]|[0-9]|1[0-2]):(0[0-9]|[1-59]\d) (AM|am|PM|pm))$/;

    constructor(private el: ElementRef) { }
    // @HostListener('keypress', ['$event']) onKeyPress(event) {
    //     console.log("event=>",event);

    //     return new RegExp(this.regexStr).test(event.key);
    // }
    // @HostListener('paste', ['$event']) blockPaste(event: any) {
    //     this.validateFields(event);
    // }
    // validateFields(event) {
    //     let regexStr1 = new RegExp(/((0[1-9]|[12])[/](0[1-9]|[1-9]|[12]\d|3[01])[/](([2]\d)\d{2}), (0[0-9]|[0-9]|1[0-2]):(0[0-9]|[1-59]\d) (AM|am|PM|pm))$/);

    //     setTimeout(() => {
    //         //console.log("event=>1",this.el.nativeElement.value,regexStr1.test(this.el.nativeElement.value));
    //         if (!regexStr1.test(this.el.nativeElement.value))
    //             this.el.nativeElement.value = ''; event.preventDefault();
    //     }, 1)
    // }
    @HostListener('paste', ['$event']) blockPaste(event: any) {
        const pastedInput: string = event.clipboardData ? event.clipboardData.getData('text/plain') : window['clipboardData'].getData('Text');
        if (!this.regexStr.test(pastedInput)) {
            event.preventDefault();
        }
    }
}

//serverDirective
@Directive({
    selector: '[allow-alpha-numeric-nospacewithdot]'
})
export class AlphaNumericNoSpaceDirective {
    regexStr = new RegExp(/^([a-zA-Z0-9._-]+)$/)
    regexP = new RegExp(/^([a-zA-Z0-9._-])*$/)



    constructor(private el: ElementRef) { }
    @HostListener('keypress', ['$event']) onKeyPress(event) {
        if (event.which == 32)
            return false;
        else
            return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: any) {
        const pastedInput: string = event.clipboardData ? event.clipboardData.getData('text/plain') : window['clipboardData'].getData('Text');
        const pastedInputw: string = (event.clipboardData ? this.el.nativeElement.value : event.target.value) + pastedInput;
        if (!this.regexP.test(pastedInput) || pastedInputw.includes(' ')) {
            event.preventDefault();
            return false;
        }
    }
}

//password Directive
@Directive({
    selector: '[allow-all-nospace]'
})
export class AllowAllNoSpaceDirective {
    regexStr = new RegExp(/^[a-zA-Z0-9!”$@^#.<>?":%&’()*\+,\/;\[\\\]\^_`{|}~]+$/)
    regexP = new RegExp(/^([a-zA-Z0-9!”$@^#.<>?":%&’()*\+,\/;\[\\\]\^_`{|}~])*$/)

    constructor(private el: ElementRef) { }
    @HostListener('keypress', ['$event']) onKeyPress(event) {
        if (event.which == 32)
            return false;
        // else
        //     return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: any) {
        const pastedInput: string = event.clipboardData ? event.clipboardData.getData('text/plain') : window['clipboardData'].getData('Text');
        const pastedInputw: string = (event.clipboardData ? this.el.nativeElement.value : event.target.value) + pastedInput;
        if (pastedInputw.includes(' ')) {
            event.preventDefault();
            return false;
        }
    }
}


@Directive({
    selector: '[allow-all-space]'
})
export class AllowAllSpaceDirective {
    regexStr = new RegExp(/^[a-zA-Z0-9! ”$@^#.<>?":%&’()*\+,\/;\[\\\]\^_`{|}~]+$/)
    regexP = new RegExp(/^([a-zA-Z0-9! ”$@^#.<>?":%&’()*\+,\/;\[\\\]\^_`{|}~]+\s?)*$/)

    constructor(private el: ElementRef) { }
    @HostListener('keypress', ['$event']) onKeyPress(event) {
        if (event.which == 32)
            return false;
        else
            return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: any) {
        const pastedInput: string = event.clipboardData ? event.clipboardData.getData('text/plain') : window['clipboardData'].getData('Text');
        const pastedInputw: string = (event.clipboardData ? this.el.nativeElement.value : event.target.value) + pastedInput;
        if (!this.regexP.test(pastedInput) || pastedInputw.includes('  ')) {
            event.preventDefault();
            return false;
        }
    }
}
