import { CsPhotoGalleryPage } from './components/cs-photo-gallery';
import { CsPhotoGalleryService } from './providers/cs-photo-gallery.provider';
import { CsPhotoGalleryController } from './cs-photo-gallery.controller';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { File } from '@ionic-native/file';
@NgModule({
	imports: [
		IonicModule
	],
	declarations: [
		CsPhotoGalleryPage
	],
	entryComponents: [
		CsPhotoGalleryPage
	],
	exports: [
		CsPhotoGalleryPage
	]
})
export class CsPhotoGalleryModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: CsPhotoGalleryModule,
			providers: [
				CsPhotoGalleryController,
				CsPhotoGalleryService,
				File
			]
		};
	}
}
