import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-confirmsetnotification',
  templateUrl: './confirmsetnotification.component.html',
  styleUrls: ['./confirmsetnotification.component.scss']
})
export class ConfirmsetnotificationComponent implements OnInit {
  loading:boolean=false;
  notificationsForm:FormGroup;
  constructor(private fb:FormBuilder,public dialogRef:MatDialogRef<ConfirmsetnotificationComponent>,@Inject(MAT_DIALOG_DATA) public data:any, private Snackbar:MatSnackBar) { }

  ngOnInit() {
    this.notificationsForm = this.fb.group({
      rejectReason:['',Validators.required]
    });
  }

  approveSetnotification()
  {
    this.openSnackbar('Alert on Expiry Approved', 'Success');
    this.dialogRef.close();
  }
  rejectSetnotification()
  {
    this.openSnackbar('Alert on Expiry Rejected', 'Failure');
    this.dialogRef.close();
  }


  openSnackbar(message:string, action:string)
  {
      this.Snackbar.open(message,action,{
        duration: 2000
      });
  }

}


