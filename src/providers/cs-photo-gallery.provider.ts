import { ICsGalleryItem } from './../components/interfaces';
import { Injectable, EventEmitter } from '@angular/core';
// import { PhotoLibrary } from '@ionic-native/photo-library';

import { Observable } from 'rxjs/Rx';
import { File } from '@ionic-native/file';
declare var Photos;

@Injectable()
export class CsPhotoGalleryService {

	imagesObserver: EventEmitter<any> = new EventEmitter<any>();
	getNativeUrls: EventEmitter<any> = new EventEmitter<any>();

	constructor(
		private _file: File
	) {
	}

	getAllPhotos() {
		Photos.collections({ "collectionMode": "ALBUMS" },
			(albums: any[]) => {
				albums = albums.map(album => album.id);
				this.getPhotosByAlbum(albums);
			},
			(error) => {
				console.log("Error 1 : " + error);
			});
	}

	getPhotosByAlbum(albumId: string[]) {
		Photos.photos(albumId,
			{ offset: 0, limit: 1, interval: 50 },
			(photos: any[]) => {
				photos.forEach(photo => this._generateThumbnail(photo))
			},
			(error) => console.log("Error 2 : " + error));
	}

	cancel() {
		Photos.cancel();
	}

	getNativeData(photosId: string[]): Observable<any[]> {
		return Observable.create(observable => {
			let tmp = [];
			photosId.forEach((photoId, index) => {
				Photos.image(photoId, data => {
					let DataBlob = new Blob([data], { "type": 'image/jpeg' });
					this._file.writeFile(this._file.cacheDirectory, photoId.replace(/\W/g, "_") + '.jpeg', DataBlob, { replace: true })
						.then(image => {
							tmp.push(image.nativeURL);
							if (photosId.length === index + 1) observable.next(tmp);
						});
				});
			})
		})
	}

	private _generateThumbnail(photo: any) {
		Photos.thumbnail(photo.id, { asDataUrl: true, quality: 100 },
			(data) => {
				photo.thumbnailURL = data;
				this.imagesObserver.next(photo);
			},
			(error) => console.log("Error 3 : " + error));
	}

	// requestAuthorization() {
	// 	this._allAlbums = undefined;
	// 	this._allPhotos = undefined;
	// 	return this._photoLibrary.requestAuthorization();
	// }

	// getPhotos(idAlbum?: string): Promise<ICsGalleryItem[]> {
	// 	return new Promise((resolve, reject) => {
	// 		if (!this._allPhotos) {
	// 			this._photoLibrary.getLibrary({
	// 				thumbnailWidth: 150,
	// 				thumbnailHeight: 150,
	// 				quality: 0.3,
	// 				includeAlbumData: true
	// 			}).toPromise().then(items => {
	// 				this._allPhotos = items.reverse();
	// 				resolve(this._allPhotos);
	// 			})
	// 		} else {
	// 			let items = (idAlbum) ? this._allPhotos.filter(item => item.albumIds.find(id => id === idAlbum)) : this._allPhotos;
	// 			resolve(items);
	// 		}
	// 	});
	// }

	// getAlbums(): Promise<ICsGalleryItem[]> {
	// 	return new Promise((resolve, reject) => {
	// 		if (!this._allAlbums) {
	// 			this._photoLibrary.getAlbums()
	// 				.then((albums: ICsGalleryItem[]) => {
	// 					albums = albums.map((album) => {
	// 						album.isAlbum = true;
	// 						return album;
	// 					});
	// 					this._allAlbums = albums;
	// 					resolve(albums);
	// 				});
	// 		} else {
	// 			resolve(this._allAlbums);
	// 		}

	// 	});
	// }

	// isReady(): Observable<ICsGalleryItem[]> {
	// 	return Observable.create(observable => {
	// 		this._photoLibrary.getAlbums()
	// 			.then((albums: ICsGalleryItem[]) => {
	// 				albums = albums.map((album) => {
	// 					album.isAlbum = true;
	// 					return album;
	// 				});
	// 				this._allAlbums = albums;
	// 			}).then(() => {
	// 				this._photoLibrary.getLibrary({
	// 					thumbnailWidth: 110,
	// 					thumbnailHeight: 110,
	// 					quality: 0.5,
	// 					includeAlbumData: true
	// 				}).subscribe((items: ICsGalleryItem[]) => {
	// 					this._allPhotos = items;
	// 					observable.next(this._allAlbums);
	// 				});
	// 			});
	// 	});
	// }
}
