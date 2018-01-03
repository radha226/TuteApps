	import { Component } from '@angular/core';
	import { NavController,LoadingController , ModalController } from 'ionic-angular';
	import  {ContactUsPage} from '../contact-us/contact-us';
	import { DatabaseProvider } from '../../providers/database/database';


	@Component({
	  templateUrl: 'home.html',
	  selector: 'page-home',
	})
	export class HomePage {
		name:any;
		Db;

	constructor(public navCtrl: NavController, public loadingctrl:LoadingController , private modalctrl:ModalController,public dbprovider:DatabaseProvider) {
		this.provider();
		this.Db=this.dbprovider.connection();
		this.dbprovider.load().then((result)=>{
		
		});

	
	}
	
	provider(){
	//this.dbprovider.insert();		
	}
	ionViewDidLoad(){
		console.log(this.Db);
			let load=this.loadingctrl.create({
    			content:'index page..'
		  	});
		  	load.present();
			if(this.Db!=null){
				this.dbprovider.createTable().then((jj)=>{
					this.dbprovider.SelectMeta('Meta').then((resultall:any)=>{
						this.name=resultall;
						//let eee=result;
						console.log(this.name);
						load.dismiss();
					})
				})
			}else{
				console.log('not database')
			}
		
			
	}
}
