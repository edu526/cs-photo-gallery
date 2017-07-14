# PHOTO GALLERY for Ionic 3

To see this in action, checkout the [example project here](https://github.com/edu526/cs-photo-gallery-example).


[![NPM](https://nodei.co/npm/cs-photo-gallery.png?stars&downloads)](https://nodei.co/npm/cs-photo-gallery/)
[![NPM](https://nodei.co/npm-dl/cs-photo-gallery.png?months=6&height=2)](https://nodei.co/npm/cs-photo-gallery/)

- [Installation](#installation)
- [Usage](#usage)
  - [`CsPhotoGalleryController` Provider](#cs-photo-gallery-controller-provider)
- [Examples](#examples)

# Installation
## Install the plugin

[https://github.com/domax/cordova-plugin-photos](https://github.com/domax/cordova-plugin-photos)

```shell
$ ionic cordova plugin add cordova-plugin-photos
```

Since Android plugin implementation is written on Java 7, you have to switch your project to Java 7 or 8.

If your project is Gradle-driven, just open your project's
```
platform > android > build.gradle
```
script and replace JavaVersion.VERSION_1_6 to JavaVersion.VERSION_1_7, like that:

```object
compileOptions {
    sourceCompatibility JavaVersion.VERSION_1_7
    targetCompatibility JavaVersion.VERSION_1_7
}
```
## Install the module via NPM
```shell
$ npm i --save cs-photo-gallery
```
## Import it in your app module

Import `CsPhotoGalleryModule.forRoot()` in your app main module

```ts
import { CsPhotoGalleryModule } from 'cs-photo-gallery';

@NgModule({
    ...
    imports: [
      ...
      CsPhotoGalleryModule.forRoot()
      ],
    ...
})
export class AppModule {}
```

# Usage

## `CsPhotoGalleryController` Provider

### openCsPhotoGallery
```ts
openCsPhotoGallery(options?: ICsOptionsGallery): Observable<any>
```
#### OPTIONS

_(optional)_ Advanced configuration.

Param | Type | Description | Default
--- | --- | --- | ---
`maxFiles` | number | Maximum number of selectable files. | `999`

### Return

#### `Object`
```ts
{
  nativeURLs: [...]
}
```
Array of nativeURLs (String)
# Examples
## Simple Example
```ts
import { Component } from '@angular/core';
import { CsPhotoGalleryController } from 'cs-photo-gallery';

@Component({
  selector: 'test-page',
  templateUrl: './test.html'
})

export class TestPage {

  constructor(
    private _csPhotoGalleryCtrl: CsPhotoGalleryController
  ) {}

  openFileChooser() {
    this._csPhotoGalleryCtrl.openCsPhotoGallery()
      .subscribe(data => {
        console.log(data);
      });
  }
}
```
## Example with all options
```ts
import { Component } from '@angular/core';
import { CsPhotoGalleryController } from 'cs-photo-gallery';

@Component({
  selector: 'test-page',
  templateUrl: './test.html'
})

export class TestPage {

  constructor(
    private _csPhotoGalleryCtrl: CsPhotoGalleryController
  ) {}

  openFileChooser() {
    let options = {
      maxFiles: 10
    };
    this._csPhotoGalleryCtrl.openCsPhotoGallery(options)
      .subscribe(data => {
        console.log(data);
      });
  }
}
```

## Contribution
- **Having an issue**? or looking for support? [Open an issue](https://github.com/edu526/cs-photo-gallery/issues/new) and we will get you the help you need.
- Got a **new feature or a bug fix**? Fork the repo, make your changes, and submit a pull request.

## Support this project
If you find this project useful, please star the repo to let people know that it's reliable. Also, share it with friends and colleagues that might find this useful as well. Thank you :smile:

<br>

[![](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.me/EduardoDelaCruzRojas)
