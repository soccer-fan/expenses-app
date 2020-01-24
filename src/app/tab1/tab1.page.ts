import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

/**
 * Home tab
 * Simple class to import photoservice so that the running total can be displayed in the tab
 */
export class Tab1Page {
  constructor(public photoService: PhotoService) {}
}
