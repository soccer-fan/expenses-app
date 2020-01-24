import { Component } from '@angular/core';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})

/**
 * Gallery tab
 * Simple class to import the photoservice and load the saved photos that will be required for the gallery
 */
export class Tab3Page {

  constructor(public photoService: PhotoService) {}

  ngOnInit() {
    this.photoService.loadSaved();
  }

}
