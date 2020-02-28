import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
    selector: '[allow-numbers-nospace]'
})
export class NumbersDirective {

    regexStr = new RegExp(/^[0-9,]*$/)
    constructor(private el: ElementRef) { }
    @HostListener('keypress', ['$event']) onKeyPress(event) {

        return new RegExp(this.regexStr).test(event.key);
    }
    @HostListener('paste', ['$event']) blockPaste(event: any) {

        const pastedInput: string = event.clipboardData
            .getData('text/plain');
        if (!this.regexStr.test(pastedInput)) {
            event.preventDefault();
        }
    }
}


@Directive({
    selector: '[allow-characters-singlespace]'
})
export class CharactersSingleSpaceDirective {
    regexStr = new RegExp(/^[a-zA-Z ]*$/)
    constructor(private el: ElementRef) { }
    @HostListener('keypress', ['$event']) onKeyPress(event) {
        let endposition = this.el.nativeElement.selectionEnd;
        if (this.el.nativeElement.value.length == 1 && event.which == 32)
            return false;
        else if (event.which == 32 && (this.el.nativeElement.value[endposition - 1] == " " || this.el.nativeElement.value[endposition] == " ")) {
            return false;
        }
        else
            return new RegExp(this.regexStr).test(event.key);
    }
    @HostListener('paste', ['$event']) blockPaste(event: any) {

        const pastedInput: string = event.clipboardData
            .getData('text/plain');
        if (!this.regexStr.test(pastedInput)) {
            event.preventDefault();
        }
    }
}

@Directive({
    selector: '[allow-alpha-numeric-singlespace]'
})
export class AlphaNumericSingleSpaceDirective {

    regexStr = new RegExp(/^([a-zA-Z0-9 _-]+)$/)
    constructor(private el: ElementRef) { }

    @HostListener('keypress', ['$event']) onKeyPress(event) {
        let endposition = this.el.nativeElement.selectionEnd;
        if (this.el.nativeElement.value.length == 1 && event.which == 32)
            return false;
        else if (event.which == 32 && (this.el.nativeElement.value[endposition - 1] == " " || this.el.nativeElement.value[endposition] == " ")) {
            return false;
        }
        else
            return new RegExp(this.regexStr).test(event.key);
    }
    @HostListener('paste', ['$event']) blockPaste(event: any) {

        const pastedInput: string = event.clipboardData
            .getData('text/plain');
        if (!this.regexStr.test(pastedInput)) {
            event.preventDefault();
        }
    }
}

@Directive({
    selector: '[allow-all-singlespace]'
})
export class AllowAllSingleSpaceDirective {

    regexStr = new RegExp(/^[a-zA-Z0-9! ”$@^#.<>?":%&’()*\+,\/;\[\\\]\^_`{|}~]+$/)
    constructor(private el: ElementRef) { }

    @HostListener('keypress', ['$event']) onKeyPress(event) {
        let endposition = this.el.nativeElement.selectionEnd;
        if (this.el.nativeElement.value.length == 1 && event.which == 32)
            return false;
        else if (event.which == 32 && (this.el.nativeElement.value[endposition - 1] == " " || this.el.nativeElement.value[endposition] == " ")) {
            return false;
        }
        else
            return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: any) {

        const pastedInput: string = event.clipboardData
            .getData('text/plain');
        if (!this.regexStr.test(pastedInput)) {
            event.preventDefault();
        }
    }
}

@Directive({
    selector: '[allow-special-characters-singlespace]'
})
export class SpecialCharactersSingleSpaceDirective {

    regexStr = new RegExp(/[-!$%^&*()_ +|~=`{}[:;<>?,.@#\]]/)
    constructor(private el: ElementRef) { }
    @HostListener('keypress', ['$event']) onKeyPress(event) {
        let endposition = this.el.nativeElement.selectionEnd;
        if (this.el.nativeElement.value.length == 1 && event.which == 32)
            return false;
        else if (event.which == 32 && (this.el.nativeElement.value[endposition - 1] == " " || this.el.nativeElement.value[endposition] == " ")) {
            return false;
        }
        else
            return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: any) {

        const pastedInput: string = event.clipboardData
            .getData('text/plain');
        if (!this.regexStr.test(pastedInput)) {
            event.preventDefault();
        }
    }
}

@Directive({
    selector: '[allow-alpha-special-singlespace]'
})
export class AlphabetsSpecialSingleSpaceDirective {

    regexStr = new RegExp(/^[a-zA-Z!”$@# ^:%&’()*\+,\/;\[\\\]\^_`{|}~]+$/)
    constructor(private el: ElementRef) { }

    @HostListener('keypress', ['$event']) onKeyPress(event) {
        let endposition = this.el.nativeElement.selectionEnd;
        if (this.el.nativeElement.value.length == 1 && event.which == 32)
            return false;
        else if (event.which == 32 && (this.el.nativeElement.value[endposition - 1] == " " || this.el.nativeElement.value[endposition] == " ")) {
            return false;
        }
        else
            return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: any) {

        const pastedInput: string = event.clipboardData
            .getData('text/plain');
        if (!this.regexStr.test(pastedInput)) {
            event.preventDefault();
        }
    }
}

@Directive({
    selector: '[allow-number-special-singlespace]'
})
export class NumericSpecialSingleSpaceDirective {

    regexStr = new RegExp(/^[0-9!”$@# ^:%&’()*\+,\/;\[\\\]\^_`{|}~]+$/)
    constructor(private el: ElementRef) { }
    @HostListener('keypress', ['$event']) onKeyPress(event) {
        let endposition = this.el.nativeElement.selectionEnd;
        if (this.el.nativeElement.value.length == 1 && event.which == 32)
            return false;
        else if (event.which == 32 && (this.el.nativeElement.value[endposition - 1] == " " || this.el.nativeElement.value[endposition] == " ")) {
            return false;
        }
        else
            return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: any) {

        const pastedInput: string = event.clipboardData
            .getData('text/plain');
        if (!this.regexStr.test(pastedInput)) {
            event.preventDefault();
        }
    }
}

@Directive({
    selector: '[allow-all-selected-characters-singlespace]'
})
export class SelectedSpecailCharactersDirective {

    regexStr = new RegExp(/^[a-zA-Z0-9,@,-.()_ ]*$/)
    constructor(private el: ElementRef) { }
    @HostListener('keypress', ['$event']) onKeyPress(event) {
        let endposition = this.el.nativeElement.selectionEnd;
        if (this.el.nativeElement.value.length == 1 && event.which == 32)
            return false;
        else if (event.which == 32 && (this.el.nativeElement.value[endposition - 1] == " " || this.el.nativeElement.value[endposition] == " ")) {
            return false;
        }
        else
            return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: any) {

        const pastedInput: string = event.clipboardData
            .getData('text/plain');
        if (!this.regexStr.test(pastedInput)) {
            event.preventDefault();
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
    regexStr = new RegExp(/^[a-zA-Z0-9-.@_ ]*$/)
    constructor(private el: ElementRef) { }
    @HostListener('keypress', ['$event']) onKeyPress(event) {
        let endposition = this.el.nativeElement.selectionEnd;
        // console.log("event.which=>", event.which);

        if (event.which == 32)
            return false;
        else if (this.alowCheck(event, this.checkList))
            return false;
        else
            return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: any) {

        const pastedInput: string = event.clipboardData
            .getData('text/plain');
        if (!this.regexStr.test(pastedInput) || pastedInput.includes(' ')) {
            event.preventDefault();
        }
    }
    alowCheck(event: any, checkList: CheckList[]) {
        let endposition = this.el.nativeElement.selectionEnd;
        let checkData = checkList.filter(data => data.KeyCode == event.which);
        return checkData.length > 0 ? (this.el.nativeElement.value.length == 0 ? true : (this.el.nativeElement.value[endposition - 1] == checkData[0].Keyname || this.el.nativeElement.value[endposition] == checkData[0].Keyname) ? true : false) : false;

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
    constructor(private el: ElementRef) { }
    @HostListener('keypress', ['$event']) onKeyPress(event) {
        let endposition = this.el.nativeElement.selectionEnd;
        if (this.el.nativeElement.value.length == 1 && event.which == 32)
            return false;
        else if (event.which == 32 && (this.el.nativeElement.value[endposition - 1] == " " || this.el.nativeElement.value[endposition] == " ")) {
            return false;
        }
        else
            return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: any) {

        const pastedInput: string = event.clipboardData
            .getData('text/plain');
        if (!this.regexStr.test(pastedInput)) {
            event.preventDefault();
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

        const pastedInput: string = event.clipboardData
            .getData('text/plain');
        if (!this.regexStr.test(pastedInput)) {
            event.preventDefault();
        }
    }
    @HostListener('change', ['$event']) OnChange(event: KeyboardEvent) {
        console.log('eventValue', event);
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

        const pastedInput: string = event.clipboardData
            .getData('text/plain');
        if (!this.regexStr.test(pastedInput)) {
            event.preventDefault();
        }
    }
    @HostListener('change', ['$event']) OnChange(event: KeyboardEvent) {
        console.log('eventValue', event);
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

        const pastedInput: string = event.clipboardData
            .getData('text/plain');
        if (!this.regexStr.test(pastedInput)) {
            event.preventDefault();
        }
    }
    @HostListener('change', ['$event']) OnChange(event: KeyboardEvent) {
        console.log('eventValue', event);
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

        const pastedInput: string = event.clipboardData
            .getData('text/plain');
        if (!this.regexStr.test(pastedInput)) {
            event.preventDefault();
        }
    }
    @HostListener('change', ['$event']) OnChange(event: KeyboardEvent) {
        console.log('eventValue', event);
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
    // @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
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

        const pastedInput: string = event.clipboardData
            .getData('text/plain');
        if (!this.regexStr.test(pastedInput)) {
            event.preventDefault();
        }
    }
}

@Directive({
    selector: '[allow-characters-numbers-nospace]'
})
export class AlphaNumbersDirective {

    regexStr = new RegExp(/^[a-zA-Z0-9,]*$/)
    regexP = new RegExp(/^([a-zA-Z0-9,])*$/)
  
    constructor(private el: ElementRef) {
        console.log('constructor');
    }
    @HostListener('input', ['$event']) alphaNumeric() {
        console.log('input');

        let input = (this.el.nativeElement as HTMLInputElement).value;
        let replacedInput = input.replace(/[^A-Z0-9,$]/g, '');
        console.log("replacedInput=>", replacedInput);

       if (replacedInput != input)
            (this.el.nativeElement as HTMLInputElement).value = replacedInput;
    }   
    @HostListener('keypress', ['$event']) onKeyPress(event) {
        console.log('keypress',event)
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
    @HostListener('drop', ['$event']) blockDrop(e: MouseEvent) {
        e.preventDefault();
    }
}
//serverDirective
@Directive({
    selector: '[allow-alpha-numeric-nospacewithdot]'
})
export class AlphaNumericNoSpaceDirective {
    regexStr = new RegExp(/^([a-zA-Z0-9._-]+)$/)
    constructor(private el: ElementRef) { }

    @HostListener('keypress', ['$event']) onKeyPress(event) {
        return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: any) {

        const pastedInput: string = event.clipboardData
            .getData('text/plain');
        if (!this.regexStr.test(pastedInput)) {
            event.preventDefault();
        }
    }
}

//password Directive
@Directive({
    selector: '[allow-all-nospace]'
})
export class AllowAllNoSpaceDirective {
    regexStr = new RegExp(/^[a-zA-Z0-9!”$@^#.<>?":%&’()*\+,\/;\[\\\]\^_`{|}~]+$/)
    constructor(private el: ElementRef) { }
    @HostListener('keypress', ['$event']) onKeyPress(event) {
        return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: any) {

        const pastedInput: string = event.clipboardData
            .getData('text/plain');
        if (!this.regexStr.test(pastedInput)) {
            event.preventDefault();
        }
    }
}