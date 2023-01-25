import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
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
  selectedDpto = '';
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
  firstTimeDptoZoom: boolean = false;

  @ViewChild('aboutModal')
  aboutModal!: ElementRef;

  constructor(
    private controlFormService: ControlFormService,
    private jsonService: JsonListService,
    private mapService: MapControllerService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.viewTypes = VISUALIZATIONTYPES;
    this.diseases = DISEASES;
    this.risk = RISK;
    this.riskcomp = RISKCOMP;
    this.riskFact = RISKFACT;
    this.initForm();
    // this.initListeners();
  }

  initListeners() {
    this.controlFormService.controlData.subscribe(res => {
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
      disease: new FormControl('', null),
      risk: new FormControl('RES', null),
      riskComp: new FormControl({ value: '', disabled: true }, null),
      riskCat: new FormControl({ value: '', disabled: true }, null),
      viewType: new FormControl('PRONAC', null)
    })

    // this.mapForm.controls['risk'].disable();
    this.setRisk('RES');
    this.setViewType('PRONAC');
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
    this.firstTimeDptoZoom = true;
    if (dptoCode) {
      const currentDepartment: Department | null = this.departments.find(x => x.code === dptoCode) || null;

      this.selectedDpto = currentDepartment?.code || '';
      this.setControl('dpto', currentDepartment);
      this.checkMapControls();
    } else {
      this.municipality = this.allMunicipalities;
    }

    if (this.selectedRisk !== '') {
      this.setRisk(this.selectedRisk as string);
    }
    this.mapForm.controls['municipality'].patchValue('');
    this.setControl('municipality', null);
  }

  goToMuni(event?: MatAutocompleteSelectedEvent) {
    if (!!event) {
      const currentMun: Municipality = event.option.value;

      console.log("llamada desde el muni");
      this.setControl('municipality', currentMun);
      this.getMuniMap(event.option.value);
    }
  }

  setRisk(value: string) {
    // resetea la categoria del componente
    this.mapForm.controls['riskComp'].patchValue('');
    this.mapForm.controls['riskComp'].disable();
    this.setControl('riskcat', null);

    // resetea el riesgo de la catetgoria
    this.mapForm.controls['riskCat'].patchValue('');
    this.mapForm.controls['riskCat'].disable();
    this.setControl('riskfact', null);

    this.setControl('risk', value);
    this.selectedRisk = value
    this.filteredRiskCOMP = [];
    this.filteredRiskCOMP = this.riskcomp.filter(x => x.risk === value);
    if (this.filteredRiskCOMP.length > 0 && this.selectedDpto !== '') {
      this.mapForm.controls['riskComp'].enable();
    } else {
      this.mapForm.controls['riskComp'].disable();
    }
    this.checkMapControls();
  }

  setRiskComp(event: MatSelectChange) {
    console.log(event);
    // resetea el riesgo de la catetgoria
    this.mapForm.controls['riskCat'].patchValue('');
    this.setControl('riskfact', null);

    this.setControl('riskcat', event.value);
    this.selectedRiskCAT = event.value;
    this.filteredRiskFACT = [];
    this.filteredRiskFACT = this.riskFact.filter(x => x.riskcat === event.value);
    if (this.filteredRiskFACT.length > 0) {
      this.mapForm.controls['riskCat'].enable();
    } else {
      this.mapForm.controls['riskCat'].disable();
    }
    this.checkMapControls();
  }

  setRiskFact(event: MatSelectChange) {
    this.setControl('riskfact', event.value);
    this.checkMapControls();
  }

  setViewType(value: string) {
    this.setControl('viewtype', value);
    this.jsonService.getViewTypeGeoJson(value).subscribe(res => {
      this.mapService.setViewTypeMap(res);

    });
  }

  setDisease(value: string) {
    this.selectedDpto = '';
    this.setControl('riskfact', null);
    this.setControl('municipality', null);
    this.setControl('dpto', null);

    // resetea el municipio
    this.mapForm.controls['municipality'].patchValue('');
    this.mapForm.controls['department'].patchValue('');

    // resetea el riesgo especifico
    this.setRisk('RES');

    // resetea la categoria del componente
    this.mapForm.controls['riskComp'].patchValue('');
    this.mapForm.controls['riskComp'].disable();
    this.setControl('riskcat', null);

    // resetea el riesgo de la catetgoria
    this.mapForm.controls['riskCat'].patchValue('');
    this.mapForm.controls['riskCat'].disable();

    this.mapService.removeLayers('dpto');

    this.setControl('disease', value);
    this.jsonService.getDiseases().subscribe(res => {
      console.log(res);
    });
  }

  getDptoMap(currentDepartment: any) {
    this.getMunicipalityByCode(currentDepartment.code);
    this.jsonService.getDptoGeoJson(currentDepartment.code).subscribe(res => {
      this.mapService.setDepartmentMap(res, currentDepartment.code);
    });
    if (this.firstTimeDptoZoom) {
      this.goToLocation({
        lng: currentDepartment.long,
        lat: currentDepartment.lat
      }, 7)
      this.firstTimeDptoZoom = false;
    }

  }

  getMuniMap(currentMun: Municipality) {
    if (!!currentMun && currentMun !== null) {
      const currentDepartment = this.departments.find(x => x.code === currentMun.departmentCode);

      this.mapForm.controls['department'].patchValue(currentDepartment);
    }

    this.mapService.zoomToFeatureMap(currentMun.code);
    // this.jsonService.getMuniDataGeoJson(currentMun).subscribe(res => {
    //   if (!!res) this.mapService.seMuniMap(res, res.properties.dpto);
    // });
  }

  setControl(controlName: string, value: Municipality | Department | string | null) {
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
    this.selectedDpto = '';
    this.setControl('riskfact', null);
    this.setControl('municipality', null);
    this.setControl('dpto', null);

    // resetea el municipio
    this.mapForm.controls['municipality'].patchValue('');
    this.mapForm.controls['department'].patchValue('');

    // resetea el riesgo especifico
    this.mapForm.controls['risk'].patchValue('RES');
    this.setRisk('RES');

    // resetea la categoria del componente
    this.mapForm.controls['riskComp'].patchValue('');
    this.mapForm.controls['riskComp'].disable();
    this.setControl('riskcat', null);

    // resetea el riesgo de la catetgoria
    this.mapForm.controls['riskCat'].patchValue('');
    this.mapForm.controls['riskCat'].disable();

    this.mapService.removeLayers('dpto');
    const currentDisease = sessionStorage.getItem('disease') || '';
    this.setDisease(currentDisease);
    this.firstTimeDptoZoom = true;
    this.mapService.zoomOut();
  }

  resetMuni() {
    this.mapForm.controls['municipality'].patchValue('');

    this.setControl('municipality', null);
    this.firstTimeDptoZoom = true;
    this.checkMapControls();
  }

  checkMapControls() {
    const currentDptoSelected = sessionStorage.getItem('dpto');
    const currentRiskSelected = sessionStorage.getItem('risk');

    if (!!currentDptoSelected && currentDptoSelected !== null && currentDptoSelected !== 'null') {
      console.log("entre al departamento cuando hay");
      console.log(currentDptoSelected);
      this.getDptoMap(JSON.parse(currentDptoSelected));

      return;
    }
  }

  openDialog(templateRef: any) {
    console.log(templateRef);
    this.dialog.open(templateRef);
  }
}