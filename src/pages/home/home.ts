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

	constructor(public navCtrl: NavController, public loadingctrl:LoadingController , private modalctrl:ModalController,public dbprovider:DatabaseProvider) {
	this.provider();
	}
	modelopen(){
		let ModelData= {name:'contactpage',age:'333',city:'amritsar',
		pages:     [{text: 'aboutpage', desc: 'this is about page'}, {text: 'contact page', desc: 'this is contact page'}],
		product:   [this.productname='mobile',
		this.productdesc='this is mobile product',
		]  // array of object with length 3
		};
		let model=this.modalctrl.create(ContactUsPage , {ModelData});
		model.present();
	}
	provider(){
	this.dbprovider.connection();
		
	}
}
