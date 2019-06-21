import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from '../crud/crud.component';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  example_form:FormGroup;
  constructor(
    public dialogRef: MatDialogRef<FormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private fb:FormBuilder) {
      this.example_form = this.fb.group({
        empid:['', [ Validators.required,Validators.pattern('^[0-9]+$'),Validators.minLength(5)]],
        ename:['', [ Validators.required,Validators.pattern('[a-zA-Z]+$'),Validators.minLength(5)]],
        position:['', [ Validators.required,Validators.pattern('[a-zA-Z]+$'),Validators.minLength(10)]],
        sal:['', [ Validators.required,Validators.pattern('^[0-9]+$'),Validators.minLength(4)]],
        date:['',[Validators.required]]
      });
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
