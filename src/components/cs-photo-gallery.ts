import { ViewController, Platform, NavParams, Content } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, ViewChild, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { CsPhotoGalleryService } from './../providers/cs-photo-gallery.provider';
import { ICsGalleryItem, ICsOptionsGallery } from './interfaces';

@Component({
	selector: 'cs-photo-gallery',
	template: getTemplate(),
	styles: getStyles()
})
export class CsPhotoGalleryPage {

	@ViewChild(Content) content: Content;
	currentDirectory: string = "/";

	files: ICsGalleryItem[] = [];
	isRoot: boolean = true;
	showAlbums: boolean = false;
	menssage: string;

	private _selectedFileItems: string[] = [];
	private _historyPosition: number[] = [];
	private _backDirectory: string = '/';
	private _options: ICsOptionsGallery;
	private _zone: NgZone;


	constructor(
		private _viewCtrl: ViewController,
		private _mediaGallerySrv: CsPhotoGalleryService,
		private _sanitizer: DomSanitizer,
		private _navParams: NavParams,
		private _platform: Platform
	) {
		this._options = this._navParams.data || {};
		this._zone = new NgZone({ enableLongStackTrace: false });
		this._platform.registerBackButtonAction(() => this.backAlbums());
	}

	ionViewWillEnter() {
		this._selectedFileItems = [];
		this._mediaGallerySrv.imagesObserver
			.subscribe(photo => this._zone.run(() => this.files.push(photo)));

		this._mediaGallerySrv.getAllPhotos();
	}

	fileSelected(fileSelected: ICsGalleryItem) {
		if (fileSelected.isAlbum) {
			this.isRoot = false;
			// this._getPhotos(fileSelected.id);
		} else {
			let index = this.files.findIndex(file => file.id === fileSelected.id);
			if (!this.files[index].isSelected) {
				if (this._selectedFileItems.length < (this._options.maxFiles || 999)) {
					this.files[index].isSelected = true;
					this._selectedFileItems.push(this.files[index].id);
				}
			}
			else {
				this.files[index].isSelected = false;
				let ind = this._selectedFileItems.findIndex(file => file === fileSelected.id);
				this._selectedFileItems.splice(ind, 1);
			}
		}
	}

	backAlbums() {
		// if (this.isRoot) {
		// 	this.close();
		// } else {
		// 	this.isRoot = true;
		// 	this.getAlbums(true);
		// }
	}

	done() {
		this.close();
		this._mediaGallerySrv.getNativeData(this._selectedFileItems)
			.subscribe(data => {
				this._mediaGallerySrv.getNativeUrls.next({ nativeURLs: data });
			});
	}

	close() {
		this._mediaGallerySrv.cancel()
		this._viewCtrl.dismiss();
	}

	errorUrl(error: ICsGalleryItem) {
		let index = this.files.findIndex(file => file.id === error.id);
		this.files.splice(index, 1);
	}

	// private _getPhotos(idAlbum?: string) {
	// 	this.menssage = 'Please wait...';
	// 	let positionY: number = window.scrollY;
	// 	this._historyPosition.push(positionY);
	// 	this.files = [];
	// 	this._mediaGallerySrv.getPhotos(idAlbum)
	// 		.then(itemsGallery => {
	// 			if(!itemsGallery.length) this.menssage = 'No images found';
	// 			this.files = itemsGallery;
	// 		});
	// }
	// getAlbums(show: boolean) {
	// 	this.menssage = 'Please wait...';
	// 	this.showAlbums = !this.showAlbums;
	// 	if (show) {
	// 		this.files = [];
	// 		this._mediaGallerySrv.getAlbums()
	// 			.then((itemsGallery) => {
	// 				if(!itemsGallery.length) this.menssage = 'No albums found';
	// 				this.files = itemsGallery;

	// 				if (this._historyPosition) {
	// 					let newPosition = this._historyPosition.pop();
	// 					this.content.scrollToTop(newPosition);
	// 				}

	// 			});
	// 	} else {
	// 		this._historyPosition = [];
	// 		this.isRoot = true;
	// 		this._getPhotos();
	// 	}

	// }
}

export function getTemplate() {
	return `
		<ion-header>
			<ion-toolbar color="primary">
				<ion-buttons *ngIf="!isRoot" left>
					<button ion-button icon-only (click)="backAlbums()">
						<ion-icon name="arrow-back"></ion-icon>
					</button>
				</ion-buttons>
				<ion-buttons end>
					<button class="cs-button-actions" ion-button (click)="close()">
						Cancel
					</button>
					<button class="cs-button-actions" ion-button (click)="done()">
						Done
					</button>
				</ion-buttons>
			</ion-toolbar>
		</ion-header>
		<ion-content class="cs-content" #content>
			<ion-row>
				<ion-col col-4 *ngFor="let file of files" (click)="fileSelected(file)">
					<img *ngIf="!file.isAlbum" [src]="file.thumbnailURL" (error)="errorUrl(file)">
					<ion-icon *ngIf="file.isAlbum" class="album" name="images"></ion-icon>
					<span *ngIf="file.isAlbum">{{ file.title || file.name }}</span>
					<span class="cs-selected" *ngIf="file.isSelected">
						<ion-icon class="cs-icon" name="checkmark" color="light"></ion-icon>
					</span>
				</ion-col>
			</ion-row>
			<ion-row class="blank" *ngIf="!files.length">
				<ion-icon class="search" name="search" text-center></ion-icon>
				<h3 text-center> Please wait... </h3>
			</ion-row>
		</ion-content>
`
}

export function getStyles() {
	return [`
		.cs-selected {
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			background: rgba(72, 138, 255, 0.31);
		}
		ion-col {
			position: relative;
		}
		.cs-icon {
			font-size: 50px;
			transform: translate(-50%, -50%);
			position: absolute;
			top: 50%;
			left: 50%;
		}
		.cs-content{
			text-align: center;
		}
		.cs-button-actions{
			padding: 10px;
			margin: 10px;
		}
		img {
			background-color: #9c9c99;
			width: 100px;
			height: 100px;
			object-fit: cover;
    	}
		.blank {
			text-align: center;
			flex-direction: column;
			opacity: .5;
			padding-top: 20vh;
    	}
		.blank h4 {
			margin: 0;
			font-size: 1.6rem;
		}
		.album{
			font-size: 10rem;
		}
		.search {
    		font-size: 9.2rem;
		}
`]
}

