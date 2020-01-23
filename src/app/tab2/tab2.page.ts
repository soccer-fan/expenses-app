import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  currentImage: any;
  currentStringValue: string;
  currentIntValue: number;
  titleMessage = 'Fill out the details of your expense';
  defaultMessage = this.titleMessage;

  constructor(public photoService: PhotoService, public alertController: AlertController) {}

  captureImage() {
    const tabRef = this;
    this.photoService.takePicture(this.captureImageCallback, tabRef);
  }

  captureImageCallback(data: any, self: Tab2Page): void {
    self.currentImage = data;
  }

  handleValueInput(event: any) {
    let rawValue: string = event.target.value;
    rawValue = rawValue.trim();
    let strippedRawValue: string = rawValue.replace('£', '');
    if (isNaN(Number(strippedRawValue))) {
      this.titleMessage = 'Please enter a legitamate value';
    } else {
      this.titleMessage = 'Fill out the details of your expense';
      this.currentStringValue = rawValue;
      this.currentIntValue = Number(strippedRawValue);
    }
  }

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

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Expense Saved',
      subHeader: '',
      message: 'Your expense has been saved in the gallery and your running total increased.',
      buttons: ['OK']
    });

    await alert.present();
  }

  ngOnInit() {
    this.photoService.loadSaved();
  }

}
