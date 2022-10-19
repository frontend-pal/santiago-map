import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Department } from 'src/app/models/departamento';
import { JsonListService } from 'src/app/services/Json-list.service';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Municipality } from 'src/app/models/municipality';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MapControllerService } from 'src/app/services/map-controller.service';
import { LngLatLike } from 'mapbox-gl';

const COLCOORDS: LngLatLike = {
  lng: -74.5472906,
  lat: 4.561896
};

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {
  toggleMenu = false;
  mapForm!: FormGroup;
  departments: Department[] | [] = [];
  filteredDeptOptions?: Observable<Department[]>;

  allMunicipalities!: Municipality[];
  municipality: Municipality[] | [] = [];
  filteredMunOptions?: Observable<Municipality[]>;

  constructor(
    private jsonService: JsonListService,
    private mapService: MapControllerService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.mapForm = new FormGroup({
      department: new FormControl('', null),
      municipality: new FormControl('', null)
    })

    this.getData();
  }

  initAutocompleteDept() {
    this.filteredDeptOptions = this.mapForm.controls['department'].valueChanges.pipe(
      startWith(''),
      map(value => this._filterDept(value || '')),
    );
  }

  initAutocompleteMun() {
    this.filteredMunOptions = this.mapForm.controls['municipality'].valueChanges.pipe(
      startWith(''),
      map(value => this._filterMun(value || '')),
    );
  }

  private _filterDept(search: string | Department): Department[] {
    let filterValue: string;

    if (typeof search === 'string') {
      filterValue = search === null ? '' : search.toLowerCase();
    } else {
      filterValue = search === null ? '' : search.name.toLowerCase();
    }

    return this.departments.filter(option => (option.name.toLowerCase().includes(filterValue)) || (option?.code.toString().includes(filterValue)));
  }

  private _filterMun(search: string | Municipality): Municipality[] {
    let filterValue: string;

    if (typeof search === 'string') {
      filterValue = search === null ? '' : search.toLowerCase();
    } else {
      filterValue = search === null ? '' : search.name.toLowerCase();
    }

    return this.municipality.filter(option => (option?.name?.toLowerCase().includes(filterValue)) || (option?.code.toString().includes(filterValue)));
  }

  getData() {
    this.jsonService.getDepartments().subscribe(res => {
      this.departments = res;
      this.initAutocompleteDept();
    });

    this.jsonService.getMunicipality().subscribe(res => {
      this.allMunicipalities = res;
      this.municipality = res;
      this.initAutocompleteMun();
    });
  }

  getMunicipalityByCode(departmentCode: string) {
    const code = departmentCode !== undefined ? departmentCode : '';

    this.municipality = this.jsonService.getMunicipalityByCode(code);
    this.initAutocompleteMun();
    console.log(this.municipality);
  }

  onSubmit() {
    console.log("test de  lavaina");
  }

  displayDept(value?: any) {
    const element = this.departments?.find(x => x === value);

    return element ? element.code + ' - ' + element.name : '';
  }

  displayMun(value?: any) {
    const element = this.municipality?.find(x => x === value);

    return element ? element.code + ' - ' + element.name : '';
  }

  getTest(event?: MatAutocompleteSelectedEvent) {
    if (event) {
      const currentDepartment: Department = event.option.value;

      console.log(currentDepartment);

      this.getMunicipalityByCode(currentDepartment.code);
      this.goToLocation({
        lng: currentDepartment.long,
        lat: currentDepartment.lat
      })
    } else {
      this.municipality = this.allMunicipalities;
    }

    this.mapForm.controls['municipality'].patchValue('');
  }

  getTest2(event: MatAutocompleteSelectedEvent) {
    const currentMun: Municipality = event.option.value;
    const currentDepartment = this.departments.find(x => x.code === this.addZero(currentMun.departmentCode));
    console.log();
    console.log(currentDepartment);
    console.log(this.departments);

    if (!!currentDepartment) {
      this.mapForm.controls['department'].patchValue(currentDepartment);
      this.goToLocation({
        lng: currentDepartment.long,
        lat: currentDepartment.lat
      });
    }
  }

  goToLocation(mapCoords: LngLatLike) {
    if (!this.mapService.isMapready) throw new Error('No hay un mapa disponible.');

    this.mapService.flyTo(mapCoords);
  }

  resetMap() {
    this.goToLocation(COLCOORDS);
  }

  addZero(code: string) {
    if (parseInt(code) > 10) {
      return code;
    } else {
      return ('0' + code);
    }
  }
}
