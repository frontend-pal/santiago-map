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
import { ControlFormService } from 'src/app/services/control-form.service';
import { MatSelectChange } from '@angular/material/select';

const COLCOORDS: LatLngExpression = {
  lng: -74.5472906,
  lat: 4.561896
};

const DISEASES = [
  { name: 'Peste Porcina Africana', value: 'ppa' }
];

const RISKS = [
  { name: 'Tipo de Alimentación', value: 'Prob_Fac_Riesgo_Tipo_de_alimentación'},
  { name: 'Infraestructura y uso intalaciones', value: 'Prob_Fac_Riesgo_infra_y_uso_intalaciones'},
  { name: 'Contacto indirecto asociado a personas', value: 'Prob_Fac_Riesgo_Contac_IndirecPerson'},
  { name: 'Manejo de animales muertos', value: 'Prob_Fac_Riesgo_Manejo_muertos'},
  { name: 'Manejo de cerdos reproductores', value: '_Prob_FacRiesgo_Manejo_Reprod'},
  { name: 'Presencia de otras especies', value: 'Prob_Fac_Riesgo_Presen_OtrasEspecie'},
  { name: 'Movilización animal', value: 'Prob_Fac_Riesgo_Moviliza_animal'},
  { name: 'Movilización de productos', value: 'Prob_Fac_Riesgo_Moviliza_de_productos'},
  { name: 'Cercanía a fronteras', value: 'Prob_Fac_Riesgo_Cerc_a_fronteras'},
  { name: 'Cercanía a puertos, aeropuertos y otros', value: 'Prob_Fac_Riesgo_Cerc_a_puertos'},
  { name: 'Cercanía y densidad de granjas', value: 'Prob_Fac_Riesgo_Cerc_y_densidadgranj'},
  { name: 'Cercanía a vias', value: 'Prob_Fac_Riesgo_Cerc_a_vias'},
  { name: 'Cercanía a basureros y rellenos sanitarios', value: 'Prob_Fac_Riesgo_Cerc_a_basureros'},
  { name: 'Cercanía Centros poblados', value: 'Prob_Fac_Riesgo_Cerc_Centros_poblados'},
  { name: 'Cercanía Ferias comerciales, exposiciones, subastas y remates', value: 'Prob_Fac_Riesgo_Cerc_Ferias_comerciales'},
  { name: 'Cercanía Plantas de beneficio', value: 'Prob_Fac_Riesgo_Cerc_Plantas_de_beneficio'},
  { name: 'Cercanía Procesadoras de productos cárnicos', value: 'Prob_Fac_Riesgo_Cerc_Procesadoras_de_productos_cárnicos'},
  { name: 'Presencia de cerdos asilvestrados', value: 'Prob_Fac_Riesgo_Presen_Asilvestrados'},
  { name: 'Orientación productiva de la granja', value: 'Prob_Fac_Riesgo_Orien_Producti'},
  { name: 'Tipo de granja porcina e intensificación de la producción', value: 'Prob_Fac_Riesgo_Tipo_Granj'},
  { name: 'Ingreso de porcinos y productos cárnicos', value: 'Prob_Fac_Riesgo_Ingr_Porci'},
  { name: 'Movimiento internacional de personas', value: 'Prob_Fac_Riesgo_Mov_Internacional_pers'}
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
  diseases?: { name: string, value: string }[] | [] = [];
  risks?: { name: string, value: string }[] | [] = [];
  viewTypes?: { name: string, value: number }[] | [] = [];

  allMunicipalities!: Municipality[];
  municipality: Municipality[] | [] = [];
  filteredMunOptions?: Observable<Municipality[]>;

  constructor(
    private controlFormService: ControlFormService,
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

    this.setControl('municipality', currentMun);
    if (!!currentDepartment) {
      this.mapForm.controls['department'].patchValue(currentDepartment);
      // this.goToLocation({
      //   lat: currentDepartment.lat,
      //   lng: currentDepartment.long,
      // }, 8);
    }

    this.getMuniMap(currentMun);
  }

  setRisk(event: MatSelectChange ) {
    console.log(event.value);
    this.setControl('risk', event.value);
  }

  getMuniMap(currentMun: Municipality) {
    this.jsonService.getMuniDataGeoJson(currentMun).subscribe(res => {
      if (!!res) this.mapService.setGeoJson(res);
    });
  }

  setControl(controlName: string, value: Municipality | Department | string) {
    console.log(controlName, value);
    this.controlFormService.setControlData({
      control: controlName,
      value: value
    });
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
