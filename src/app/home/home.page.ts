import { Component, ViewChild } from '@angular/core';
import { Environment, GoogleMap, GoogleMapOptions, GoogleMaps, GoogleMapsAnimation, GoogleMapsEvent, MyLocation } from '@ionic-native/google-maps';
import {LoadingController, Platform} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('map', {static:true}) mapElement: any;
  private loading: any;
  private map: GoogleMap;

  constructor(
    private platform: Platform,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
      this.mapElement = this.mapElement.nativeElement;

      this.mapElement.style.width = this.platform.width() + 'px';
      this.mapElement.style.height = this.platform.height() + 'px';

      this.loadMap();
  }

  async loadMap() {
    this.loading = await this.loadingCtrl.create({ message: 'Por favor, aguarde...' });
    await this.loading.present();

    Environment.setEnv({
      'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyDYjaAjiLAzT-1zFn4od7t9E_RlqLqvAbw',
      'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyDYjaAjiLAzT-1zFn4od7t9E_RlqLqvAbw'
    });


    //OPÇÃO DE RETIRAR OS CONTROLES DE ZOOM DO MAPA
    const mapOptions: GoogleMapOptions = {
      controls: {
        zoom: false
      }
    }

    this.map = GoogleMaps.create(this.mapElement, mapOptions);

    try {
     await this.map.one(GoogleMapsEvent.MAP_READY);

     this.addOriginMarker();
    } 
      catch(error){
        console.error(error);
      }
  }

    async addOriginMarker(){
      try{
      const myLocation: MyLocation = await this.map.getMyLocation();
      
      await this.map.moveCamera({
        target: myLocation.latLng,
        zoom: 18
      });

      this.map.addMarkerSync({
        title: 'Origem',
        icon: '#000',
        animation: GoogleMapsAnimation.DROP,
        position: myLocation.latLng
      })
    } catch (error) {
      console.error(error);
    } finally {
      this.loading.dismiss();
    }
}
}