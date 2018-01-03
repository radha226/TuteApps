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
		let columnsproduct=[];
		let columnMeta=[];
		let tableName:any;
		let tableNamepage:any;
		let tableNamepro;
		return new Promise((resolve,reject)=>{
		this.load().then((result:any)=>{
			this.Apidata=result;
			//for( let app in result){
				

					if("app_pages" in result){
						console.log('pages');
						tableNamepage="app_pages";
						for(let app_keys in result.app_pages[0]){
							columns.push(app_keys+' TEXT');
						}
						this.query='CREATE TABLE IF NOT EXISTS '+tableNamepage+'('+columns.join(",")+')';
						this.ExecuteRun(this.query, []).then((resultpages:any)=>{
							this.insertPages(this.database, this.Apidata,tableNamepage).then((result)=>{

							});
						})
					}
					if("app_products" in result){
						console.log('product');
						tableNamepro="app_products";
						for(let app_keys in result.app_products[0]){
	                		columnsproduct.push(app_keys+' TEXT');
	            		}
	            		this.query='CREATE TABLE IF NOT EXISTS '+tableNamepro+'('+columnsproduct.join(",")+')';
	            		this.ExecuteRun(this.query, []).then((resultproduct:any)=>{
							this.insertProduct(this.database,result,tableNamepro).then(()=>{

							})
						});
	            	}
	            	if("app_name" in result){
	            		console.log('meta');
		            	for(let app_keys in result){
		            		tableName="Meta";
			                if(typeof result[app_keys]!= "object"){
			                    columnMeta.push(app_keys + ' TEXT');
			                }
			            }
			            this.query='CREATE TABLE IF NOT EXISTS '+tableName+'('+columnMeta.join(",")+')';
		            	this.ExecuteRun(this.query, []).then((data:any)=>{
							this.metaQuery(this.database,result,tableName).then((result)=>{

							})	
						});
	            	}
	            	resolve('true');
				
				
		})
		})
	}
	insertProduct(db,record,tableName){
		let columns = [];
	    let values =[];
	    let slugdata;
	    return new Promise((resolve,error)=>{
	    	if(record!=''){
	    		for(let tableColumns in record.app_products[0]){
	           		columns.push(tableColumns)
	        	}
	        	for(let productkey of record.app_products){
		            let v=[];
		            for(let key in productkey){
		              let json;
		                if(key=='product_attributes'){
		                  json=JSON.stringify(productkey[key]);
		                }else{
		                  json=productkey[key];
		                }
		               v.push(json);
		            }//console.log(v);
	          		values.push(v);
	        	}
	    	}
	    	if(db != undefined){
	    		this.query='SELECT slug FROM '+tableName;
	    		this.ExecuteRun(this.query, [] ).then((result1 : any)=>{
	    			if(result1.rows.length > 0){
	    				this.update(values,db,tableName, columns);
	    			}else{
	    				this.insertData(values,db,tableName, columns);
	    			}
	    		})
	        }
	    });
	}

	metaQuery(db,record,tableName){
		let columnMeta=[];
	    let values =[];
	    let tablekeys;
	    return new Promise((resolve,error)=>{
	    	if(record != ''){
	    		for(let tablekeys in record){
			        if(typeof record[tablekeys]!= "object"){
			           columnMeta.push(tablekeys);
			           values.push(record[tablekeys]);
			        }
				}
	    		this.query='SELECT  app_domain FROM '+tableName;
	    		this.ExecuteRun(this.query, []).then((result : any)=>{
	    			if(result.rows.length > 0){
	    				let meta;
                   		meta=result.rows[0].app_domain;
	                    let questionMarks=[];
	                    for(let j=0; j < values.length; j++){
	                       questionMarks.push("?");
	                    }
	                    values.push(meta);
	                    this.query='UPDATE '+tableName +' SET '+ columnMeta.join('=?, ')+' = ? where app_domain = ?';
	                    this.ExecuteRun(this.query, values );
	    			}else{
	    				let questionMarks=[];
	                    for(let j = 0; j < values.length; j++){
	                        questionMarks.push("?");
	                    }
	                    this.query='INSERT INTO '+tableName + '(' + columnMeta+ ') VALUES (' +questionMarks + ')';
	                    this.ExecuteRun(this.query, values );
	    			}
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
                    		this.update(values,db,tableName, columns);
                    	}
        			}else{
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
	// SelectPages(tableName){

	//     if(this.db!=undefined){
	//         return new Promise((resolve,reject)=>{
	//         	this.query='Select * from '+tableName;
	//         	this.ExecuteRun(this.query,[]).then((result:any)=>{
	//         		console.log(result.rows);
	//         		resolve(result.rows);
	//         	})
	//         })
	        
	//     }
	// }
	SelectMeta(tableName){
		let AppkitMeta;
	    if(this.db!=null){
	        return new Promise((resolve,reject)=>{
	        	console.log('here');
	           
	            	console.log('here 1');
	            	this.query='Select * from '+tableName;
	               this.ExecuteRun(this.query,[]).then((result:any)=>{
	                	console.log('here 2');
	                	console.log(result.rows);
	                	//resolve(result.rows);
	                   if(result.rows.length>0){
	                       for(let i=0; i < result.rows.length; i++){
	                              AppkitMeta=result.rows[i];
	                           	console.log(result.rows[i]);
	                       }
	                       resolve(AppkitMeta);
	                   }
	                });

	           
	        });
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
