import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage';
import { Tab2Page } from '../tab2/tab2.page';

@Injectable({
  providedIn: 'root'
})

/**
 * This service is used across the tabs to provide access to the device camera and
 * persistant storage for photos and related info like costs and timestamps.
 */
export class PhotoService {
  public photos: Photo[] = []; // storage of photos, used by gallery tab to display
  public total = 0; // running total of expenses overall cost

  constructor(private camera: Camera, private storage: Storage) {
    this.storage.get('total').then((total) => {
      this.total = total || 0;  // load running total from device storage
    });
  }

  /**
   * Takes a picture with the device camera and passes back to calling tab via a callback (camera IO is async)
   * @param callback Function to make use of the image data after it has been captured by the device
   * @param tabRef reference to the tab object that passed the callback. Needed to set the data back as a class attribute
   */
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

  /**
   * Load stored photos from device storage
   */
  loadSaved() {
    this.storage.get('photos').then((photos) => {
      this.photos = photos || [];
    });
  }

  /**
   * Store a taken photo persistently and add to list of photos
   * @param data Raw image data from photo
   * @param timestamp string timestamp of when the photo was taken
   * @param value string of value of the expense photo is associated with
   */
  storePicture(data: any, timestamp: string, value: string) {
    this.photos.unshift({
      data,
      timestamp,
      value
    });
    this.storage.set('photos', this.photos);
  }

  /**
   * Updates the running total after a new expense is saved
   * @param amount The amount to increase the running total by
   */
  updateTotal(amount: number) {
    this.total += amount;
    this.storage.set('total', this.total);
  }

}

/**
 * Class to represent a photo and the supporting info needed about it to display it in the gallery
 */
class Photo {
  data: any;
  timestamp: string;
  value: string;
}
