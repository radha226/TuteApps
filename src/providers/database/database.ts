import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { HomePage } from '../../pages/home/home';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Nav, Platform } from 'ionic-angular';
/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {

	constructor(public http: Http,  public platfrom:Platform) {
		console.log('Hello DatabaseProvider Provider');
		this.connection();
	}
	connection(){
		let data;
		if(this.platfrom.is('cordova')){
			// data='cordova with mobile';
			// return data;
			console.log('cordova with mobile')
		}else{
			// data='browser';
			// return data;
			 console.log('on browser');
		}
	}

}
