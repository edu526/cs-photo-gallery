import { Injectable, EventEmitter } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

import { CsPhotoGalleryPage } from './components/cs-photo-gallery';
import { ICsOptionsGallery } from './components/interfaces';

@Injectable()
export class CsPhotoGalleryController {

	private _subscriber: EventEmitter<string[]>;

	constructor(
		private _modalCtrl: ModalController
	) {
		this._subscriber = new EventEmitter<string[]>();
	}

	openCsPhotoGallery(options?: ICsOptionsGallery): Observable<any> {
		return Observable.create(observable => {
			let modal = this._modalCtrl.create(CsPhotoGalleryPage, options);
			modal.onDidDismiss(data => {
				observable.next(data);
				observable.complete();
			});
			modal.present();
		});
	}
}
