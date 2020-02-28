import { NgModule } from '@angular/core';
import { globalFilterPipeModule } from '../_pipes/pipe.module';
import { SvgcircleComponent } from './svgcircle.component';



@NgModule({
  imports: [
    globalFilterPipeModule
  ],
  providers: [],
  declarations: [SvgcircleComponent],
  entryComponents:[SvgcircleComponent],
  exports:[SvgcircleComponent]
})

export class SvgcircleModule { }
