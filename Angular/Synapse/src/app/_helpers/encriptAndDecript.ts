import { Injectable } from "@angular/core";
import * as CryptoJS from 'crypto-js';
import * as jwt_decode from "jwt-decode";
import { Router } from "@angular/router";
import { AppConfig, ITokenInfo } from "./app.config";

@Injectable({ providedIn: 'root' })
export class EncriptAndDecriptService {

  encryptSecretKey: string;
  _tokenInfo: ITokenInfo;
  constructor(private router: Router, private appConfig: AppConfig) {
    this.encryptSecretKey = this.appConfig.getEncryptSecretKey();
  }
  encryptData(data) {
    console.log("encryptData=>", JSON.stringify(data), this.encryptSecretKey);

    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptSecretKey).toString();
    } catch (e) {
      console.log('error=>', e);
      this.router.navigate(['401']);
    }
  }

  decryptData(data) {
    try {
      const bytes = CryptoJS.AES.decrypt(data, this.encryptSecretKey);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
      console.log(e);
      this.router.navigate(['401']);
    }
  }
  decryptDataAndDecodetoken(data) {

    try {
      const bytes = CryptoJS.AES.decrypt(data, this.encryptSecretKey);
      if (bytes.toString()) {
        return jwt_decode(JSON.parse(bytes.toString(CryptoJS.enc.Utf8)));
      }
      return jwt_decode(data);
    } catch (e) {
      console.log('error=>', e);
      this.router.navigate(['401']);
    }
  }
  decryptDataForTokenAndTokenInfo(data) {

    try {
      const bytes = CryptoJS.AES.decrypt(data, this.encryptSecretKey);
      if (bytes.toString()) {
        let token = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        this._tokenInfo = { tokenKey: token, tokenInfo: jwt_decode(token) } as ITokenInfo;
        return this._tokenInfo;
      }
      this._tokenInfo = { tokenKey: data, tokenInfo: jwt_decode(data) } as ITokenInfo;
      return this._tokenInfo;
    } catch (e) {
      console.log('error=>', e);
      this.router.navigate(['401']);
    }
  }
  deCodeToken(data) {

    try {
      return jwt_decode(data);
    } catch (e) {
      console.log('error=>', e);
      this.router.navigate(['401']);
    }
  }

}
// export interface ITokenInfo
// {
//     tokenKey:string;
//     tokenInfo:any;
// }