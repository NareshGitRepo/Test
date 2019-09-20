import {
    AllowAllNoSpaceDirective,
    AllowAllSingleSpaceDirective,
    AllowAllSpaceDirective,
    AllowArabicSpecialDirective,
    AllowEngilshOnlyDirective,
    AlphaNumbersDirective,
    AlphaNumbersnocommaDirective,
    AlphaNumericNoSpaceDirective,
    AlphaNumericSingleSpaceDirective,
    AlphaNumericWithColonDirective,
    AlphaNumericsOnlyDirective,
    AlphabetsSpecialSingleSpaceDirective,
    CampCalCharactersDirective,
    CharactersSingleSpaceDirective,
    CharactersWithOutSpaceDirective,
    DomainDirective,
    EmailDirective,
    HtmlTagDirective,
    MobileNumberDirective,
    MultiEmailDirective,
    NumberCustomDirective,
    NumberDirective,
    NumbersCommaSingleSpaceDirective,
    NumbersDirective,
    NumericSpecialSingleSpaceDirective,
    RoomNumberCharecters,
    SelectedSpecailCharactersDirective,
    ServiceArbicDirective,
    ServiceArbicDirective1,
    ServiceEnglishDirective,
    ServiceEnglishDirective1,
    SpecialCharactersSingleSpaceDirective,
    emailCharecters
} from "./commonDirective";

import { NgModule } from "@angular/core";

@NgModule({
    exports: [
        AlphaNumbersDirective,
        NumbersDirective,
        AlphaNumbersnocommaDirective,
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
        CharactersWithOutSpaceDirective,
        AllowArabicSpecialDirective,
        AllowEngilshOnlyDirective,
        RoomNumberCharecters,
        NumberDirective,
        NumberCustomDirective,
        AllowAllSpaceDirective,
        MobileNumberDirective,
        ServiceEnglishDirective,
        ServiceArbicDirective,
        ServiceEnglishDirective1,
        ServiceArbicDirective1,
        AlphaNumericsOnlyDirective,
        AlphaNumericWithColonDirective
    ],
    declarations: [
        AlphaNumbersDirective,
        NumberDirective,
        NumbersDirective,
        AlphaNumbersnocommaDirective,
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
        CharactersWithOutSpaceDirective,
        AllowArabicSpecialDirective,
        AllowEngilshOnlyDirective,
        RoomNumberCharecters,
        NumberCustomDirective,
        AllowAllSpaceDirective,
        MobileNumberDirective,
        ServiceEnglishDirective,
        ServiceArbicDirective,
        ServiceEnglishDirective1,
        ServiceArbicDirective1,
        AlphaNumericsOnlyDirective,
        AlphaNumericWithColonDirective
    ]
})
export class sharedDirectiveModule {

}