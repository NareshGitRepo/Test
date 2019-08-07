import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  TooltipPosition
} from '@angular/material';
import { AuthenticationService } from '../_service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  //tooltip
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = 'above';
  showExtraClass = true;
  public rolesCollection: any[];

  public form: FormGroup;
  constructor(private fb: FormBuilder, private router: Router, private toastr: ToastrService, private authenticationService: AuthenticationService, ) {
  }

  ngOnInit() {

    this.form = this.fb.group({
      login: ['', Validators.compose([Validators.required, Validators.email, Validators.minLength(8)])],
      firstname: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      lastname: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      company: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      contactNo: ['', Validators.compose([Validators.required, Validators.minLength(10)])],
      roles: this.fb.array([{ roleId: 4, roleName: 'masteruser' }]),
    });
  }

  onSubmit() {
    this.authenticationService.saveCreation(this.form.value)
      .subscribe(response => {
        if (response.status === true) {
          this.toastr.success(this.form + " " + response.messages, "Success");
        } else {
          this.toastr.error(this.form + " " + response.messages, "Failed");
        }
      });
    this.router.navigate(['/']);
  }

}