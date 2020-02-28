import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-svgcricle',
  templateUrl: './svgcricle.component.html',
  styleUrls: ['./svgcricle.component.scss']
})
export class SvgcricleComponent implements OnInit {
  @Input() value: number;
  radius:number = 15;
  circumference = 2 * Math.PI * this.radius;
  dashoffset: number;

  constructor() { 
    this.progress(0);

  }

  ngOnInit() {
  }

  
  ngOnChanges(changes: SimpleChanges) {
    if (changes.value.currentValue !== changes.value.previousValue) {
      this.progress(changes.value.currentValue);
    }
  }

  private progress(value: number) {
    const progress = value / 100;
    this.dashoffset = this.circumference * (1 - progress);
  }
}
