import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TooltipPosition } from '@angular/material';
import { AuthenticationService } from '../_service/auth.service';
import { ILogIn, ILogInResponse } from '../_models/login';
import { LoginService } from '../_service/login.service';
import { AppConfig } from '../../_helpers/app.config';
import { TranslateService } from '@ngx-translate/core';
import { EncriptAndDecriptService } from '../../_helpers/encriptAndDecript';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})

export class SigninComponent implements OnInit {
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = 'above';
  showExtraClass = true;
  model: any = {};
  loading = false;
  returnUrl: string;
  public form: FormGroup;
  userrole: any;
  messageflag: boolean;
  message: string;
  url: any;

  constructor(private authenticationService: AuthenticationService,
    public router: Router, private fb: FormBuilder, public loginservice: LoginService,
    private appconfig: AppConfig, public translate: TranslateService, private encriptAndDecriptService: EncriptAndDecriptService) { }

  ngOnInit() {

    console.log("Initial page loading ......");
    this.authenticationService.logout();
    this.form = this.fb.group({
      uname: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])]
    });
    localStorage.clear();
    this.appconfig.clearTokenInfo();
    console.log("config=>",this.router.config);
    let mainRouteConfig = this.router.config;
    let cpindex=mainRouteConfig.findIndex(x=>x.path=='changepassword');
    if(cpindex!=-1)
    {
      mainRouteConfig[cpindex].path='vmcp';
      this.router.resetConfig(mainRouteConfig);
    }
    if (this.appconfig.getRouteConfig()) {
      if (mainRouteConfig[1].children.length > 0 || cpindex!=-1) {
        mainRouteConfig[1].children = [];
        this.router.resetConfig(mainRouteConfig);
      }
    }
    else {
      this.appconfig.setRouteConfig(this.router.config[1].children);
      if (mainRouteConfig[1].children.length > 0 || cpindex!=-1) {
        mainRouteConfig[1].children = [];
        this.router.resetConfig(mainRouteConfig);
      }
    }
    history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };

  }

  onSubmitTest() {
    this.loading = true;
    console.log('model ==>', this.model);
    //   this.apiMenuService.menuClear();

    setTimeout(() => {
      // console.log('model ==>', this.apiMenuService.getMenuByRoleIdAndUserId(1));
      this.loading = false;
      this.router.navigate(['/new']);

    }, 2000);
  }
  onSubmit() {
    this.loading = true;
    console.log('model ==>', this.model);


    setTimeout(() => {
      let logIn: ILogIn = { login: (this.model.username as string).trim(), password: this.model.password };
      this.loginservice.login(logIn)
        .subscribe(data1 => {
          console.log("data=>654", data1, data1.headers.get('authorization'));
          let data = data1.body as ILogInResponse;
          let token = (data1.headers.get('authorization'));
          // data.loginDto.authorization=data1.headers.get('authorization');
          if (data.status && token != null) {
            // localStorage.setItem('login', JSON.stringify(data.userUpdateDto));
            let encript = this.encriptAndDecriptService.encryptData(data1.headers.get('authorization'));
            if (encript) {
              // localStorage.setItem('TokenNo', encript);
              this.appconfig.setTokenInfo(encript);
              // console.log("getTokenInfo=>",this.appconfig.getTokenInfo());

              this.appconfig.setMenuLoadStatus(false);
              this.loading = false;
              let changepassword;
              try {
                changepassword = data1.body.usersGDto.changePassword;
              }
              catch (error) { }
              if (changepassword == null || changepassword == 0) {
                let mainRouteConfig = this.router.config;
                let cpindex=mainRouteConfig.findIndex(x=>x.path=='vmcp');
                if(cpindex!=-1)
                {
                  mainRouteConfig[cpindex].path='changepassword';
                  this.router.resetConfig(mainRouteConfig);
                }
                  
                console.log("route=>",this.router.config);                
                this.router.navigate(['/changepassword']);
              }
              else {
                if (this.appconfig.getRouteConfig()) {
                  let mainRouteConfig = this.router.config;
                  let targetRouteConfig = this.appconfig.getRouteConfig();
                  mainRouteConfig[1].children = targetRouteConfig;
                  this.router.resetConfig(mainRouteConfig);
                }
                console.log("route=>",this.router.config);
                this.router.navigate(['/dashboard']);
              }


            }
            else {
              this.messageflag = true;
              this.loading = false;
              this.message = data.message;
              console.log("Login failed => " + this.message);
            }
          } else {

            this.messageflag = true;
            this.loading = false;
            this.message = data.message;
            console.log("Login failed => " + this.message);
          }


        },
          error => {
            console.error("E-Loginerror=>", JSON.stringify(error));
            this.messageflag = true;
            this.loading = false;
            if (error.status == 0) {
              this.message = "Your Request is failed";
            }
            else
              this.message = error.error ? error.error.message : "Your Request is failed..";
          });
    }, 2000);

    console.log("Username::" + this.model.username);
  }
}
