import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSelectChange } from '@angular/material/select';
import { LatLngExpression } from 'leaflet';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Department } from 'src/app/models/departamento';
import { Municipality } from 'src/app/models/municipality';
import { ControlFormService } from 'src/app/services/control-form.service';
import { JsonListService } from 'src/app/services/Json-list.service';
import { MapControllerService } from 'src/app/services/map-controller.service';
import { COLCOORDS, DISEASES, RISK, RISKFACT, RISKCOMP, RiskSelectValue, SelectValue, VISUALIZATIONTYPES, RiskSelectFacValue } from 'src/app/shared/project-values.constants';

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

  // Select Values
  diseases?: SelectValue[] | [] = [];
  risk?: SelectValue[] | [] = [];
  riskcomp: RiskSelectValue[] | [] = [];
  riskcat: RiskSelectValue[] | [] = [];
  riskFact: RiskSelectFacValue[] | [] = [];

  // filter Variables
  selectedRisk?: string;
  selectedRiskCOMP?: string;
  selectedRiskCAT?: string;
  selectedRiskFACT?: string;
  filteredRiskCOMP: RiskSelectValue[] | [] = [];
  filteredRiskCAT: RiskSelectValue[] | [] = [];
  filteredRiskFACT: RiskSelectFacValue[] | [] = [];
  viewTypes?: SelectValue[] | [] = [];

  allMunicipalities!: Municipality[];
  municipality: Municipality[] | [] = [];
  filteredMunOptions?: Observable<Municipality[]>;

  constructor(
    private controlFormService: ControlFormService,
    private jsonService: JsonListService,
    private mapService: MapControllerService
  ) { }

  ngOnInit(): void {
    this.viewTypes = VISUALIZATIONTYPES;
    this.diseases = DISEASES;
    this.risk = RISK;
    this.riskcomp = RISKCOMP;
    this.riskFact  = RISKFACT;
    this.initForm();
    // this.initListeners();
  }

  initListeners() {
    this.controlFormService.controlData.subscribe(res => {
      console.log(res.control);
      switch (res.control) {
        case 'dptoFromMap':
          this.resetDpto();
          const currentDepartment = this.departments.find(x => x.code === res.value) || null;

          this.mapForm.controls['department'].patchValue(currentDepartment);
          this.goToDpto(res.value as string);
          break;
        default:
          // void
          break;
      }
    });
  }

  initForm() {
    this.mapForm = new FormGroup({
      department: new FormControl('', null),
      municipality: new FormControl('', null),
      disease: new FormControl('ppa', null),
      risk: new FormControl('', null),
      riskComp: new FormControl({ value: '', disabled: true }, null),
      riskCat: new FormControl({ value: '', disabled: true }, null),
      viewType: new FormControl('', null)
    })

    // this.mapForm.controls['risk'].disable();
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
      map(value => this._filterMun(value || ''))
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

  goToDpto(dptoCode?: string) {
    console.log(dptoCode);

    if (dptoCode) {
      const currentDepartment: Department | null = this.departments.find(x => x.code === dptoCode) || null;

      console.log(currentDepartment);
      this.setControl('dpto', currentDepartment);
      // this.checkMapControls();
    } else {
      this.municipality = this.allMunicipalities;
    }
    this.resetMuni();
  }

  goToMuni(event?: MatAutocompleteSelectedEvent) {
    if (!!event) {
      const currentMun: Municipality = event.option.value;

      this.setControl('municipality', currentMun);
      this.checkMapControls();
    }
  }

  setRisk(event: MatSelectChange) {
    this.setControl('risk', event.value);
    this.selectedRisk = event.value
    this.filteredRiskCOMP = [];
    this.filteredRiskCOMP = this.riskcomp.filter(x => x.risk === event.value);
    if (this.filteredRiskCOMP.length > 0) {
      this.mapForm.controls['riskComp'].enable();
    } else {
      this.mapForm.controls['riskComp'].disable();
    }
  }

  setRiskComp(event: MatSelectChange) {
    console.log(event);
    this.setControl('riskcat', event.value);
    this.selectedRiskCAT = event.value;
    this.filteredRiskFACT = [];
    this.filteredRiskFACT = this.riskFact.filter(x => x.riskcat === event.value);
    console.log(this.filteredRiskFACT);
    console.log(this.selectedRiskCAT);
    if (this.filteredRiskFACT.length > 0) {
      this.mapForm.controls['riskCat'].enable();
    } else {
      this.mapForm.controls['riskCat'].disable();
    }
  }

  setRiskFact(event: MatSelectChange) {
    this.setControl('riskfact', event.value);
  }  

  getDptoMap(currentDepartment: any) {
    console.log(currentDepartment);
    this.getMunicipalityByCode(currentDepartment.code);
    this.jsonService.getDptoGeoJson(currentDepartment.code).subscribe(res => {
      console.log(res);
      this.mapService.setDepartmentMap(res, currentDepartment.code);
    });
    this.goToLocation({
      lng: currentDepartment.long,
      lat: currentDepartment.lat
    }, 6)
  }

  getMuniMap(currentMun: Municipality) {
    if (!!currentMun && currentMun !== null) {
      const currentDepartment = this.departments.find(x => x.code === currentMun.departmentCode);

      this.mapForm.controls['department'].patchValue(currentDepartment);
    }

    this.jsonService.getMuniDataGeoJson(currentMun).subscribe(res => {
      console.log(res);
      if (!!res) this.mapService.seMuniMap(res, res.properties.dpto);
    });
  }

  setControl(controlName: string, value: Municipality | Department | string | null) {
    console.log(value);
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

  resetDpto() {
    this.mapForm.controls['municipality'].patchValue('');
    this.mapForm.controls['department'].patchValue('');
    this.setControl('municipality', null);
    this.setControl('dpto', null);
    this.checkMapControls();
  }

  resetMuni() {
    this.mapForm.controls['municipality'].patchValue('');

    this.setControl('municipality', null);
    this.checkMapControls();
  }

  checkMapControls() {
    const currentMuniSelected = sessionStorage.getItem('municipality');
    const currentDptoSelected = sessionStorage.getItem('dpto');
    const currentRiskSelected = sessionStorage.getItem('risk');

    console.log(currentMuniSelected);
    console.log(currentDptoSelected);
    if (!!currentMuniSelected && currentMuniSelected !== null) {
      console.log("entre a muni --> ", currentMuniSelected)
      this.getMuniMap(JSON.parse(currentMuniSelected));

      return;
    }

    if (!!currentDptoSelected && currentDptoSelected !== null) {
      console.log("entre a dpeto --> ", currentDptoSelected)
      this.getDptoMap(JSON.parse(currentDptoSelected));

      return;
    }

    this.mapService.getColombiaMap(currentRiskSelected || '')
  }
}
