
export interface ICsGalleryItem {
	id?: string;
	creationDate?: Date;
	thumbnailURL?: string;
	isImage?: boolean;
	isVideo?: boolean;
	isSelected?: boolean;

	//Album
	title?: string;
	isAlbum?: boolean;

	//Image
	photoURL?: string;
	fileName?: string;
	width?: number;
	height?: number;
	latitude?: number;
	longitude?: number;
	albumIds?: string[];
}
export interface ICsOptionsGallery {
	/**
	 * Maximum number of selectable files. Default: 999
	 */
	maxFiles?: number;
}
