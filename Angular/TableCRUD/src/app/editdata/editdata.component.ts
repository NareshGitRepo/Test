import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DialogData } from '../crud/crud.component';

@Component({
  selector: 'app-editdata',
  templateUrl: './editdata.component.html',
  styleUrls: ['./editdata.component.scss']
})
export class EditdataComponent implements OnInit {

  example_form:FormGroup;
  constructor(
    public dialogRef: MatDialogRef<EditdataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private fb:FormBuilder, private snackBar: MatSnackBar) {
      this.example_form = this.fb.group({
        empid:['', [ Validators.required,Validators.pattern('^[0-9]+$'),Validators.minLength(5)]],
        ename:['', [ Validators.required,Validators.pattern('[a-zA-Z ]+$'),Validators.minLength(5)]],
        position:['', [ Validators.required,Validators.pattern('[a-zA-Z ]+$'),Validators.minLength(10)]],
        sal:['', [ Validators.required,Validators.pattern('^[0-9]+$'),Validators.minLength(4)]],
        date:['',[Validators.required]]
      });
      if(data)
      {
        this.example_form.patchValue(data);
        //this.example_form.get('id').setValue(data.empid);  
      }
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
