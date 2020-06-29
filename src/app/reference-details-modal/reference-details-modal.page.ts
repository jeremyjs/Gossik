import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, ToastController } from '@ionic/angular';

import { Reference } from '../../model/reference/reference.model';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { DatabaseService } from '../services/database.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-reference-details-modal',
  templateUrl: './reference-details-modal.page.html',
  styleUrls: ['./reference-details-modal.page.scss'],
})
export class ReferenceDetailsModalPage implements OnInit {
	
	reference = {} as Reference;
  backUpReference: string;
  defineReferenceForm: FormGroup;

  constructor(
		public modalCtrl: ModalController,
  	private navParams: NavParams,
  	private db: DatabaseService,
  	public translate: TranslateService,
    public fb: FormBuilder,
    private auth: AuthenticationService,
    public toastCtrl: ToastController
  ) {
    	this.reference = this.navParams.get('reference');
      this.backUpReference = this.reference.content;
      this.defineReferenceForm = this.fb.group({
        content: ['', Validators.required]
      });
  }

  ngOnInit() {
  }

  async presentToast(toastMessage) {
      const toast = await this.toastCtrl.create({
      message: toastMessage,
      duration: 5000,
      cssClass: 'toast'
    });
    toast.present();
  }

  cancel() {
    this.reference.content = this.backUpReference;
    this.modalCtrl.dismiss();
  }

  deleteReference(reference: Reference) {
    	this.db.deleteReference(reference, this.auth.userid);
      this.translate.get(["Information deleted"]).subscribe( translation => {
      this.presentToast(translation["Information deleted"]);
    });
    	this.modalCtrl.dismiss();
  }

  saveReference() {
    this.reference.content = this.defineReferenceForm.value.content;
    let referencekey = this.reference.key;
    this.db.editReference(this.reference, this.auth.userid);
    this.reference.key = referencekey;
    this.translate.get(["Information edited"]).subscribe( translation => {
      this.presentToast(translation["Information edited"]);
    });
    this.modalCtrl.dismiss();
  }

}
