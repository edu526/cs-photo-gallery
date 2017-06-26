import { ICsGalleryItem } from './../components/interfaces';
import { Injectable, EventEmitter } from '@angular/core';
import { PhotoLibrary } from '@ionic-native/photo-library';

import { Observable } from 'rxjs/Rx';

@Injectable()
export class CsPhotoGalleryService {

	private _allPhotos: ICsGalleryItem[];
	private _allAlbums: ICsGalleryItem[];

	constructor(
		private _photoLibrary: PhotoLibrary
	) {
	}

	requestAuthorization() {
		this._allAlbums = undefined;
		this._allPhotos = undefined;
		return this._photoLibrary.requestAuthorization();
	}

	getPhotos(idAlbum?: string): Promise<ICsGalleryItem[]> {
		return new Promise((resolve, reject) => {
			if (!this._allPhotos) {
				this._photoLibrary.getLibrary({
					thumbnailWidth: 150,
					thumbnailHeight: 150,
					quality: 0.3,
					includeAlbumData: true
				}).toPromise().then(items => {
					this._allPhotos = items.reverse();
					resolve(this._allPhotos);
				})
			} else {
				let items = (idAlbum) ? this._allPhotos.filter(item => item.albumIds.find(id => id === idAlbum)) : this._allPhotos;
				resolve(items);
			}
		});
	}

	getAlbums(): Promise<ICsGalleryItem[]> {
		return new Promise((resolve, reject) => {
			if (!this._allAlbums) {
				this._photoLibrary.getAlbums()
					.then((albums: ICsGalleryItem[]) => {
						albums = albums.map((album) => {
							album.isAlbum = true;
							return album;
						});
						this._allAlbums = albums;
						resolve(albums);
					});
			} else {
				resolve(this._allAlbums);
			}

		});
	}

	isReady(): Observable<ICsGalleryItem[]> {
		return Observable.create(observable => {
			this._photoLibrary.getAlbums()
				.then((albums: ICsGalleryItem[]) => {
					albums = albums.map((album) => {
						album.isAlbum = true;
						return album;
					});
					this._allAlbums = albums;
				}).then(() => {
					this._photoLibrary.getLibrary({
						thumbnailWidth: 110,
						thumbnailHeight: 110,
						quality: 0.5,
						includeAlbumData: true
					}).subscribe((items: ICsGalleryItem[]) => {
						this._allPhotos = items;
						observable.next(this._allAlbums);
					});
				});
		});
	}
}
