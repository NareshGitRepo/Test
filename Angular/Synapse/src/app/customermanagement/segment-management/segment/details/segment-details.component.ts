import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-segment-details',
  templateUrl: './segment-details.component.html',
  styleUrls: ['./segment-details.component.scss']
})
export class SegmentDetailsComponent implements OnInit {
  segmentDetails: any;

  constructor(private dialogRef: MatDialogRef<SegmentDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any) { }

  ngOnInit() {
    if(this.data != null){
      this.segmentDetails = this.data;
    }
  }

}
