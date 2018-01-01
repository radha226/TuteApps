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
public database:any;
public query:any;
db:any;
Apidata:any;

	constructor(public http: Http,  public platform:Platform, public sqlite:SQLite) {
		console.log('Hello DatabaseProvider Provider');
		this.connection();

	}
	connection(){
	
		if(this.platform.is('cordova')){
			this.sqlite.create({name:'tuteAppMobile', location:'defautl'}).then(( database: SQLiteObject) => { 
				this.database = database;
			});
		}else{
			this.database = (<any> window).openDatabase("tuteAppBrowser", '1', 'my', 1024 * 1024 * 100); 
			return this.db=this.database;
		}
	}

	ExecuteRun(query, []){
		if(query!=undefined){
			if(this.platform.is('cordova')){
				this.database.executeSql(query);
			}else{
				this.database.transaction((tx)=>{
					tx.executeSql(query, [], (result:any)=>{
						console.log(result);
					},(error:any)=>{
						console.error(error);
					});
				})
			}
		}
	}
	Create(){
		this.query="CREATE TABLE IF NOT EXISTS LOGS (id unique, log)";
		this.ExecuteRun(this.query, []);
	}
	insert(){
		this.Create();
		this.query='INSERT INTO LOGS (id, log) VALUES (2, "logmsg")';
		this.ExecuteRun(this.query,[]);
	}
	select(){
		let data;
		this.query='Select * from LOGS';
		data=this.ExecuteRun(this.query,[]);
	}

	load(){
		return new Promise ((resolve,reject)=>{
			console.log('load');
			this.http.get('http://aione.oxosolutions.com/api/android/').subscribe(data=>{
				this.Apidata=data.json();
				resolve(this.Apidata);
				
			},error=>{
				console.error(error);
			})
		})
	}



}
