import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LoginService } from './_service/login.service';
import { AppConfig } from '../_helpers/app.config';
import { TranslateService } from '@ngx-translate/core';
import { ILogIn, ILoginResponse } from './_model/login';
import { EncriptAndDecriptService } from '../_helpers/encriptAndDecript';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  error: boolean = false;
  loginlist: any
  loading = false;
  autoLoading:boolean=true;
  messageflag: boolean;
  message: string;
  constructor(private route: ActivatedRoute, public router: Router, private fb: FormBuilder, public loginservice: LoginService, private appconfig: AppConfig, public translate: TranslateService, private encriptAndDecriptService: EncriptAndDecriptService) { }

  ngOnInit() {

    this.translate.use('en');
    this.form = this.fb.group({
      name: [''],
      password: ['']
    });

    localStorage.clear();
    this.appconfig.clearTokenInfo();
    if (this.appconfig.getRouteConfig()) {
      let mainRouteConfig = this.router.config;
      let targetRouteConfig = this.appconfig.getRouteConfig();
      mainRouteConfig[1].children = targetRouteConfig;
      this.router.resetConfig(mainRouteConfig);
    }
    history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
    this.route.queryParams.subscribe(params => {
      
      this.appconfig.setHeaderLoad(params['hl'] == '0' ? false : true);
      let convertparams = JSON.parse(JSON.stringify(params).toLowerCase());
      let autoStatus = convertparams['status'] ? convertparams['status'] : '';
      let autousername = convertparams['username'] ? convertparams['username'] : '';
      console.log("hl=> ", params['hl'],convertparams,autoStatus,autousername);
      if (autoStatus.toLowerCase() == 'authenticated' && autousername != '') {
        this.onAutpSubmit(autousername);
      }
      else
      this.autoLoading=false;
    });
  }
  onAutpSubmit(username: string) {

    this.loading = true;


    setTimeout(() => {
      let logIn: ILogIn = { login: username, password: '' };
       console.log("hasPassword=>", logIn);

      this.loginservice.autologin(logIn)
        .subscribe(data1 => {
          console.log("data=>654", data1, data1.headers.get('authorization'));
          let data = data1.body as ILoginResponse;
          // data.loginDto.authorization=data1.headers.get('authorization');
          if (data.status) {
            // localStorage.setItem('login', JSON.stringify(data.userUpdateDto));
            let encript = this.encriptAndDecriptService.encryptData(data1.headers.get('authorization'));
            if (encript) {
              // localStorage.setItem('TokenNo', encript);
              this.appconfig.setTokenInfo(encript);
              this.appconfig.setMenuLoadStatus(false);
              this.loading = false;


              let pagename = this.appconfig.getLoadingPage()[data.usersGDto.roles[0].roleName];
              console.log("userUpdateDto=>", pagename ? '/' + pagename : '/dashboard', data.usersGDto.roles[0].roleName);
              this.router.navigate([pagename ? '/' + pagename : '/dashboard']);
            }
            else {
              this.autoLoading=false;
              this.form.get('name').setValue(username);
              this.messageflag = true;
              this.loading = false;
              this.message = data.messages;
              console.log("Login failed => " + this.message);
            }
          } else {
            this.autoLoading=false;
            this.form.get('name').setValue(username);
            this.messageflag = true;
            this.loading = false;
            this.message = data.messages;
            console.log("Login failed => " + this.message);
          }


        },
          error => {
            this.autoLoading=false;
            console.log("Login error => " + error);
            this.messageflag = true;
            this.loading = false;
            this.form.get('name').setValue(username);
            if (error.status == 0) {
              this.message = "Your Request is failed";
            }
            else
              this.message = error.error ? error.error.messages : "Your Request is failed..";
          });
    }, 2000);

  }
  onSubmit(form) {

    this.loading = true;


    setTimeout(() => {
      let logIn: ILogIn = { login: form.name, password: this.encriptAndDecriptService.encryptPassword(form.password) };
      // console.log("hasPassword=>", logIn);

      this.loginservice.login(logIn)
        .subscribe(data1 => {
          console.log("data=>654", data1, data1.headers.get('authorization'));
          let data = data1.body as ILoginResponse;
          // data.loginDto.authorization=data1.headers.get('authorization');
          if (data.status) {
            // localStorage.setItem('login', JSON.stringify(data.userUpdateDto));
            let encript = this.encriptAndDecriptService.encryptData(data1.headers.get('authorization'));
            if (encript) {
              // localStorage.setItem('TokenNo', encript);
              this.appconfig.setTokenInfo(encript);
              this.appconfig.setMenuLoadStatus(false);
              this.loading = false;


              let pagename = this.appconfig.getLoadingPage()[data.usersGDto.roles[0].roleName];
              console.log("userUpdateDto=>", pagename ? '/' + pagename : '/dashboard', data.usersGDto.roles[0].roleName);
              this.router.navigate([pagename ? '/' + pagename : '/dashboard']);
            }
            else {
              this.messageflag = true;
              this.loading = false;
              this.message = data.messages;
              console.log("Login failed => " + this.message);
            }
          } else {

            this.messageflag = true;
            this.loading = false;
            this.message = data.messages;
            console.log("Login failed => " + this.message);
          }


        },
          error => {
            console.log("Login error => " + error);
            this.messageflag = true;
            this.loading = false;
            if (error.status == 0) {
              this.message = "Your Request is failed";
            }
            else
              this.message = error.error ? error.error.messages : "Your Request is failed..";
          });
    }, 2000);

    // console.log("Username::" + this.model.username);
  }

  forgot() {

  }
}
