import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

/**
 * Expense entry tab
 * This class handles the UI interactions with the form to save an expense and interfaces
 * with the photoservice service to provide low-level photo handling via plugins
 */
export class Tab2Page {
  currentImage: any;  // used to display image taken by camera so user can see whether to re-take
  currentStringValue: string; // cost of the expense as a string
  currentIntValue: number; // cost of the expense as a number
  titleMessage = 'Fill out the details of your expense';
  defaultMessage = this.titleMessage;

  constructor(public photoService: PhotoService, public alertController: AlertController) {}

  /**
   * Linked to the take picture button. Calls the photoservice to take the picture and then passes
   * the raw image data back via a callback
   */
  captureImage() {
    const tabRef = this;
    this.photoService.takePicture(this.captureImageCallback, tabRef);
  }

  /**
   * Callback passed back from photoservice to store raw image data taken by camera back into the tab
   * @param data Raw image data taken by photoservice
   * @param self Class reference as 'this' will not work in a callback
   */
  captureImageCallback(data: any, self: Tab2Page): void {
    self.currentImage = data;
  }
  
  /**
   * Handles the text field used for the expense value being updated
   * @param event Input event on text field used for expense value
   */
  handleValueInput(event: any) {
    let rawValue: string = event.target.value;
    rawValue = rawValue.trim();
    let strippedRawValue: string = rawValue.replace('£', '');
    if (isNaN(Number(strippedRawValue))) { // sanity check
      this.titleMessage = 'Please enter a legitamate value';
    } else {
      this.titleMessage = 'Fill out the details of your expense';
      this.currentStringValue = rawValue;
      this.currentIntValue = Number(strippedRawValue);
    }
  }

  /**
   * Linked to the save button on the expense tab. Saves the data from the page into permanent storage
   * and then shows an alert to confirm save and resets the page. Sanity checks the data first to 
   * ensure all required info has been entered.
   */
  saveExpense() {
    if (!this.currentImage) {
      this.titleMessage = 'Please take a picture of the expense you want to capture';
    } else if (!this.currentStringValue) {
      this.titleMessage = 'Please indicate the value of the expense';
    } else {
      const timestamp: string = new Date().toLocaleString('EN');
      this.photoService.storePicture(this.currentImage, timestamp, this.currentStringValue);

      this.photoService.updateTotal(this.currentIntValue);
      //reset page
      this.titleMessage = this.defaultMessage;
      this.currentImage = null;
      this.currentStringValue = null;
      this.currentIntValue = null;
      (document.getElementById('expense-amount') as HTMLInputElement).value = '';
      this.presentAlert();
    }
  }

  /**
   * Used to show an alert to confirm the expense has been saved
   */
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Expense Saved',
      subHeader: '',
      message: 'Your expense has been saved in the gallery and your running total increased.',
      buttons: ['OK']
    });

    await alert.present();
  }

  /**
   * When page is loaded, saved photos are loaded from photoservice
   */
  ngOnInit() {
    this.photoService.loadSaved();
  }

}
