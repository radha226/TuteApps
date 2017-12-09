	import { Component } from '@angular/core';
	import { NavController,LoadingController , ModalController } from 'ionic-angular';
	import  {ContactUsPage} from '../contact-us/contact-us';

	@Component({
	  templateUrl: 'home.html',
	  selector: 'page-home',
	})
	export class HomePage {
		name:any;
		age:any;
		city:any;

	  constructor(public navCtrl: NavController, public loadingctrl:LoadingController , private modalctrl:ModalController) {

	  }
	  loader(){
	  	let laoder=this.loadingctrl.create({
	  		content:'loading......'
	  	})
	  	laoder.present();
	  }
	  modelopen(){
	  	let ModelData=[this.name ='contactpaged44444',this.age=333,this.city='amritsar'];
	  	let model=this.modalctrl.create(ContactUsPage , {ModelData});
	  	model.present();
	  }

	}
