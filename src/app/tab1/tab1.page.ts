import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  total: Number;
  constructor(public photoService: PhotoService) {}

}
