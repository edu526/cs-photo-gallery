import { Injectable, EventEmitter } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

import { CsPhotoGalleryService } from './providers/cs-photo-gallery.provider';
import { CsPhotoGalleryPage } from './components/cs-photo-gallery';
import { ICsOptionsGallery } from './components/interfaces';

@Injectable()
export class CsPhotoGalleryController {

	constructor(
		private _modalCtrl: ModalController,
		private _gallerySrv: CsPhotoGalleryService
	) {
	}

	openCsPhotoGallery(options?: ICsOptionsGallery): Observable<any> {
		return Observable.create(observable => {
			let modal = this._modalCtrl.create(CsPhotoGalleryPage, options);
			this._gallerySrv.getNativeUrls
				.subscribe(data => {
					observable.next(data);
					observable.complete();
				});
			modal.present();
		});
	}
}
