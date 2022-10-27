import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Department } from 'src/app/models/departamento';
import { JsonListService } from 'src/app/services/Json-list.service';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Municipality } from 'src/app/models/municipality';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MapControllerService } from 'src/app/services/map-controller.service';
import { LatLngExpression } from 'leaflet';

const COLCOORDS: LatLngExpression = {
  lng: -74.5472906,
  lat: 4.561896
};

const DISEASES = [
  { name: 'Peste Porcina Africana', value: 1 }
];

const RISKS = [
  { name: 'Tipo de Alimentación', value: 1 },
  { name: 'Infraestructura y uso intalaciones', value: 2 },
  { name: 'Contacto indirecto asociado a personas', value: 3 },
  { name: 'Manejo de animales muertos', value: 4 },
  { name: 'Manejo de cerdos reproductores', value: 5 },
  { name: 'Presencia de otras especies', value: 6 },
  { name: 'Movilización animal', value: 7 },
  { name: 'Movilización de productos', value: 8 },
  { name: 'Cercanía a fronteras', value: 9 },
  { name: 'Cercanía a puertos, aeropuertos y otros', value: 10 },
  { name: 'Cercanía y densidad de granjas', value: 11 },
  { name: 'Cercanía a vias', value: 12 },
  { name: 'Cercanía a basureros y rellenos sanitarios', value: 13 },
  { name: 'Cercanía Centros poblados', value: 14 },
  { name: 'Cercanía Ferias comerciales, exposiciones, subastas y remates', value: 15 },
  { name: 'Cercanía Plantas de beneficio', value: 16 },
  { name: 'Cercanía Procesadoras de productos cárnicos', value: 17 },
  { name: 'Presencia de cerdos asilvestrados', value: 18 },
  { name: 'Orientación productiva de la granja', value: 19 },
  { name: 'Tipo de granja porcina e intensificación de la producción', value: 20 },
  { name: 'Ingreso de porcinos y productos cárnicos', value: 21 },
  { name: 'Movimiento internacional de personas', value: 22 }
];

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
  diseases?: { name: string, value: number }[] | [] = [];
  risks?: { name: string, value: number }[] | [] = [];
  viewTypes?: { name: string, value: number }[] | [] = [];

  allMunicipalities!: Municipality[];
  municipality: Municipality[] | [] = [];
  filteredMunOptions?: Observable<Municipality[]>;

  constructor(
    private jsonService: JsonListService,
    private mapService: MapControllerService
  ) { }

  ngOnInit(): void {
    this.diseases = DISEASES;
    this.risks = RISKS;
    this.viewTypes = [];
    this.initForm();
  }

  initForm() {
    this.mapForm = new FormGroup({
      department: new FormControl('', null),
      municipality: new FormControl('', null),
      disease: new FormControl('', null),
      risk: new FormControl('', null),
      viewType: new FormControl('', null)
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

  goToDpto(event?: MatAutocompleteSelectedEvent) {
    if (event) {
      const currentDepartment: Department = event.option.value;

      console.log(currentDepartment);

      this.getMunicipalityByCode(currentDepartment.code);
      this.goToLocation({
        lng: currentDepartment.long,
        lat: currentDepartment.lat
      }, 6)
    } else {
      this.municipality = this.allMunicipalities;
    }

    this.mapForm.controls['municipality'].patchValue('');
  }

  goToMuni(event: MatAutocompleteSelectedEvent) {
    const currentMun: Municipality = event.option.value;
    const currentDepartment = this.departments.find(x => x.code === this.addZero(currentMun.departmentCode));
    console.log();
    console.log(currentDepartment);
    console.log(this.departments);

    if (!!currentDepartment) {
      this.mapForm.controls['department'].patchValue(currentDepartment);
      this.goToLocation({
        lat: currentDepartment.lat,
        lng: currentDepartment.long,
      }, 8);
    }
  }

  goToLocation(mapCoords: LatLngExpression, zoom: number) {
    if (!this.mapService.isMapready) throw new Error('No hay un mapa disponible.');

    this.mapService.flyTo(mapCoords, zoom);
  }

  resetMap() {
    this.goToLocation(COLCOORDS, 6);
  }

  addZero(code: string) {
    if (parseInt(code) > 10) {
      return code;
    } else {
      return ('0' + code);
    }
  }
}
