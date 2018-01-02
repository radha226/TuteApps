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
slugs = [];

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

	ExecuteRun(query, valesData){
		return new Promise((resolve,reject)=>{
			if(query!=undefined){
				if(this.platform.is('cordova')){
					this.database.executeSql(query, valesData, (result:any) =>{
						resolve(result);
					},(error:any)=>{
						console.error(error);
					});
				}else{
					this.database.transaction((tx)=>{
						tx.executeSql(query, valesData, (tx,result:any)=>{
							resolve(result);
						},(error:any)=>{
							console.error(error);
						});
					})
				}
			}
		})
	}

	createTable(){
		let columns=[];
		let tableName:any;;
		this.load().then((result:any)=>{
			this.Apidata=result;
			//for( let app in result){
				if("app_pages" in result){
					
					tableName="app_pages";
					for(let app_keys in result.app_pages[0]){
						columns.push(app_keys+' TEXT');
					}
					this.query='CREATE TABLE IF NOT EXISTS '+tableName+'('+columns.join(",")+')';
					this.ExecuteRun(this.query, []).then((result:any)=>{
						this.insertPages(this.database, this.Apidata,tableName);
					})
				}
				
		})
	}
	insertPages(db,record,tableName){
		let columns = [];
	    let values = [];
	    let slugdata;
		return new Promise((resolve,reject)=>{
			if(record != ''){
               //process columns form record variable
                for(let tableColumns in record.app_pages[0]){
                    columns.push("'"+tableColumns+"'");
                }
               //process values from record variable
                if(record.app_pages.length > 0){
                    if(record.app_pages != undefined){
                        for(let appData of record.app_pages){

                            let v = [];
                             let w=[];
                            for(let keys in appData){
                                if(record.app_pages != undefined || appData != undefined){
                                    v.push(appData[keys]);
                                }
                            }
                        values.push(v);
                            }
                        //console.log(values);
                    }
                }      
        	}
        	if(db != undefined){
        		this.query='SELECT slug FROM '+tableName;
        		this.ExecuteRun(this.query,[]).then((result1 : any)=>{
        			if(result1.rows.length > 0){
        				
        				for (var i = 0; i <= result1.rows.length ; i++) {
	                        if(result1.rows[i] != undefined){
	                            slugdata=this.slugs.push(result1.rows[i].slug);
	                        }
                   		}
                   		if(this.slugs.length > 0){
                   			console.log('update');
                    		this.update(values,db,tableName, columns);
                    	}
        			}else{
        				console.log('insert');
        				this.insertData(values,db,tableName, columns);
        			}
        		});
        	}

		})
	}

	insertData(values,db, tableName, columns, i = 0){
	    if(values[i] != undefined){
	        let questionMarks = [];
	        for(let j = 0; j< values[i].length; j++){
	           questionMarks.push('?');
	        }
	        this.query = 'INSERT INTO '+tableName+' ( '+columns.join(',')+' ) VALUES ('+questionMarks.join(',')+')';
	        this.ExecuteRun(this.query, values[i]).then((result)=>{
	        	this.insertData(values,db,tableName,columns,i = i+1);
	        });
	    }
	}
	update(values,db, tableName, columns, i = 0){
	    if(values[i] != undefined){
	        db.transaction((tx) => {
	            values[i].push(this.slugs[i]);
	            let questionMarks = [];
	            for(let j = 0; j< values[i].length; j++){
	              questionMarks.push('?');
	            }  
	            this.query = 'UPDATE '+tableName+' SET '+columns.join(' = ? ,')+' = ? where slug = ?';
		        this.ExecuteRun(this.query, values[i]).then((result)=>{
		        	this.update(values,db, tableName, columns, i = i+1);
		        });
	        })
	    }
	}
	SelectPages(tableName){

	    if(this.db!=undefined){
	        return new Promise((resolve,reject)=>{
	        	this.query='Select * from '+tableName;
	        	this.ExecuteRun(this.query,[]).then((result:any)=>{
	        		console.log(result.rows);
	        		resolve(result);
	        	})
	        })
	        
	    }
	}
	load(){
		return new Promise ((resolve,reject)=>{
			this.http.get('http://aione.oxosolutions.com/api/android/').subscribe(data=>{
				this.Apidata=data.json().data;
				resolve(this.Apidata);
				
			},error=>{
				console.error(error);
			})
		})
	}



}
