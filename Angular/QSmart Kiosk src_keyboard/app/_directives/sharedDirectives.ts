
import { NgModule } from "@angular/core";
import {
    SpecialCharactersSingleSpaceDirective, NumbersDirective, AlphabetsSpecialSingleSpaceDirective,
    NumericSpecialSingleSpaceDirective, AlphaNumericSingleSpaceDirective, EmailDirective, DomainDirective,
    HtmlTagDirective, MultiEmailDirective, CharactersSingleSpaceDirective, AllowAllSingleSpaceDirective,
    NumbersCommaSingleSpaceDirective, SelectedSpecailCharactersDirective, CampCalCharactersDirective, AlphaNumericNoSpaceDirective, AllowAllNoSpaceDirective, emailCharecters, AlphaNumbersDirective
} from "./commonDirective";


@NgModule({
    exports: [
        NumbersDirective,
        CharactersSingleSpaceDirective,
        AlphabetsSpecialSingleSpaceDirective,
        NumericSpecialSingleSpaceDirective,
        SpecialCharactersSingleSpaceDirective,
        AlphaNumericSingleSpaceDirective,
        NumbersCommaSingleSpaceDirective,
        EmailDirective,
        DomainDirective,
        HtmlTagDirective,
        MultiEmailDirective,
        AllowAllSingleSpaceDirective,
        SelectedSpecailCharactersDirective,
        CampCalCharactersDirective,
        AlphaNumericNoSpaceDirective,
        AllowAllNoSpaceDirective,
        emailCharecters,
        AlphaNumbersDirective
    ],
    declarations: [
        NumbersDirective,
        CharactersSingleSpaceDirective,
        AllowAllSingleSpaceDirective,
        AlphabetsSpecialSingleSpaceDirective,
        NumbersCommaSingleSpaceDirective,
        NumericSpecialSingleSpaceDirective,
        SpecialCharactersSingleSpaceDirective,
        AlphaNumericSingleSpaceDirective,
        SelectedSpecailCharactersDirective,
        EmailDirective,
        DomainDirective,
        HtmlTagDirective,
        MultiEmailDirective,
        CampCalCharactersDirective,
        AlphaNumericNoSpaceDirective,
        AllowAllNoSpaceDirective,
        emailCharecters,
        AlphaNumbersDirective
    ]
})
export class sharedDirectiveModule {

}