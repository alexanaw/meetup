import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {Evento} from "../event";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";
import {EventService} from "../event.service";
import {ImageUploadService} from "../image.upload.service";
import {FormControl} from "@angular/forms";
import {MapsAPILoader} from "@agm/core";
import {$} from "protractor";

@Component({
  selector: 'app-event.edit',
  templateUrl: './event.edit.component.html',
  styleUrls: ['./event.edit.component.css']
})
export class EventEditComponent implements OnInit {

  eventId: number;
  folderId: number;
  currentUserId: number;
  eventt: Evento;
  lat: number;
  lng: number;
  datee: string;
  time: string;
  state: string = "folders";
  selectedFiles: FileList;
  currentFileUpload: File;
  fileRegexp: RegExp;
  errorFileFormat: boolean;
  imageLoaded: boolean;
  type: string;
  currentUserLogin: string;
  searchControl: FormControl;

  @ViewChild("searchh")
  searchElementRef: ElementRef;

  constructor(private eventService: EventService,
              private route: ActivatedRoute,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private router: Router,
              private uploadService: ImageUploadService,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.eventId = params['eventId'];
      this.folderId = params['folderId'];
      this.type = params['type'];
      this.currentUserId = JSON.parse(localStorage.currentUser).id;
      this.currentUserLogin = JSON.parse(localStorage.currentUser).login;
    }, error => {
      this.showError('Unsuccessful event loading', 'Loading error');
    });
    this.getEvent();

    this.searchControl = new FormControl();
    console.log(this.searchControl);
    console.log(this.searchElementRef);

    this.setCurrentPosition();

    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement,
        { types:['address']
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {

          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
        });
      });
    });
  }

  setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });
    }
  }

  getEvent() {
    this.spinner.show();

    this.eventService.getEvent(this.eventId).subscribe(eventt => {
      this.eventt = eventt;
      let coordinates = this.eventt.place.split(" ");
      console.log(this.eventt.eventType);
      this.lat = +coordinates[0];
      this.lng = +coordinates[1];
      let loadDate =this.eventt.eventDate.split(" ");
      this.datee = loadDate[0];
      this.time = loadDate[1].split(".")[0];
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.showError('Unsuccessful event loading', 'Loading error');
    })
  }

  formatDate() {
      console.log(this.datee);
      console.log(this.time);
      console.log(this.eventt.periodicity);
      this.eventt.eventDate = this.datee + " " + this.time;
  }

  updateEvent() {
    this.spinner.show();
    this.formatDate();
    this.eventt.place = this.lat + " " + this.lng;
    this.eventService.updateEvent(this.eventt).subscribe(
      updated => {
        this.showSuccess('Event is successfully updated', 'Success!');
        this.spinner.hide();
        this.router.navigate(["/" + this.currentUserLogin + "/folders/" + this.folderId + "/" + this.type + "/" + this.eventId]);
      }, error => {
        this.showError('Can not update event', 'Attention!');
        this.spinner.hide();
      }
    );
  }

  showError(message: string, title: string) {
    this.toastr.error(message, title, {
      timeOut: 3000,
      positionClass: 'toast-top-right',
      closeButton: true
    });
  }

  showSuccess(message: string, title: string) {
    this.toastr.info(message, title, {
      timeOut: 3000,
      positionClass: 'toast-top-right',
      closeButton: true
    });
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
    let filename: string = this.selectedFiles.item(0).name.toLowerCase();
    if (!this.fileRegexp.test(filename)) {
      this.showError("Incorrect file format " + this.selectedFiles.item(0).name, 'File format error');
      this.errorFileFormat = true;
    } else {
      this.errorFileFormat = false;
    }
  }

  upload() {
    this.spinner.show();
    this.imageLoaded = false;

    this.currentFileUpload = this.selectedFiles.item(0);
    this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(event => {
      console.log(event);
      this.imageLoaded = true;
      this.eventt.imageFilepath = event;
      console.log(this.eventt.imageFilepath);
      this.spinner.hide();
    }, error => {
      this.showError(error, 'Upload failed');
      this.spinner.hide();
    });

    this.selectedFiles = undefined;
  }

  placeMarker(event){
    console.log(event.coords.lat);
    console.log(event.coords.lng);
    this.lng = event.coords.lng;
    this.lat = event.coords.lat;
  }

}
