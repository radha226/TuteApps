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
		age:any;
		city:any;
		pages:any;
		text:any;
		desc:any;
		product:any;
		productname:any;
		productdesc:any;
		Db;

	constructor(public navCtrl: NavController, public loadingctrl:LoadingController , private modalctrl:ModalController,public dbprovider:DatabaseProvider) {
		this.provider();
		this.Db=this.dbprovider.connection();
		this.dbprovider.load().then((result)=>{
			console.log(result);
		});

	
	}
	
	provider(){
	//this.dbprovider.insert();		
	}
	ionViewDidLoad(){
		console.log('indeax file');
		if(this.Db!=undefined){
			console.log(this.Db);
			if(this.Db!=null){
				console.log('true');
			}else{
				console.log('not database')
			}
		}
			
	}
}
