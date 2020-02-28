import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import { PFormatTimePipeWithSec } from './global.pipe';
 // <---

@NgModule({
  declarations:[PFormatTimePipeWithSec], // <---
  imports:[CommonModule],
  exports:[PFormatTimePipeWithSec] // <---
})

export class globalFilterPipeModule{}