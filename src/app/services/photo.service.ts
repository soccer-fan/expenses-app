import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage';
import { Tab2Page } from '../tab2/tab2.page';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: Photo[] = [];
  public total = 0;

  constructor(private camera: Camera, private storage: Storage) {
    this.storage.get('total').then((total) => {
      this.total = total || 0;
    });
  }

  takePicture(callback: (photoData: any, tabReference: Tab2Page) => any, tabRef: Tab2Page): any {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      // hold photo in temp storage
      const data: any = 'data:image/jpeg;base64,' + imageData;
      callback(data, tabRef);

    }, (err) => {
      // Handle error
      console.log('Camera issue: ' + err);
    });

  }

  loadSaved() {
    this.storage.get('photos').then((photos) => {
      this.photos = photos || [];
    });
  }

  storePicture(data: any, timestamp: string, value: string) {
    this.photos.unshift({
      data,
      timestamp,
      value
    });
    this.storage.set('photos', this.photos);
  }

  updateTotal(amount: number) {
    this.total += amount;
    this.storage.set('total', this.total);
  }

}

class Photo {
  data: any;
  timestamp: string;
  value: string;
}
