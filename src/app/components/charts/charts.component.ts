import { Component, OnInit } from '@angular/core';
import { Municipality } from 'src/app/models/municipality';
import { ControlEvent, ControlFormService } from 'src/app/services/control-form.service';
import { JsonListService } from 'src/app/services/Json-list.service';
import { MapControllerService } from 'src/app/services/map-controller.service';
import { RISKFACT, RiskSelectFacValue } from 'src/app/shared/project-values.constants';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {
  toggleMenu = false;
  riskCat = RISKFACT;
  filteredRiskCat: RiskSelectFacValue[] | any[] = [];
  riskWithData: any[] = [];

  // Categorias
  catProcesoProductivo: number = 0;
  catEspacioBiofisico: number = 0;
  catEntornoBiosifico: number = 0;
  catBioseguridad: number = 0;
  catMovilizacion: number = 0;
  catSocioEconomico: number = 0;
  catManejoSanitario: number = 0;

  // Excel Data
  currentData?: any | null;

  // Disease
  currentDisease?: any | null;

  // Riesgo
  currentRisk?: number | null = null;

  // amenaza
  threat?: number | null = null;

  // vulnerabilidad
  vulnerability?: number | null = null;

  // departamento
  currentDpto?: any | null;
  dptoData?: any | null;

  // riesgos
  threatView = true;
  vulnerabilityView = true;

  // categorias
  viewBIO = true;
  viewSAN = true;
  viewMOV = true;
  viewEBA = true;
  viewESO = true;
  viewEBI = true;
  viewPRO = true;

  constructor(
    private controlFormService: ControlFormService,
    private jsonService: JsonListService,
    private mapService: MapControllerService
  ) { }

  ngOnInit(): void {
    this.initListeners();
    this.resetViewCategories();
  }

  resetViewCategories() {
    this.viewBIO = true;
    this.viewSAN = true;
    this.viewMOV = true;
    this.viewEBA = true;
    this.viewESO = true;
    this.viewEBI = true;
    this.viewPRO = true;
    this.riskWithData = [];
  }

  initListeners() {
    this.controlFormService.controlData.subscribe(res => {
      switch (res.control) {
        case 'disease':
          this.updateData(res);
          break;
        case 'dpto':
          this.updateData(res);
          break;
        case 'municipality':
          this.updateData(res);
          break;
        case 'risk':
          if (res.value !== null && res.value !== 'null') this.setRiskData(res);
          break;
        case 'riskcat':
          if (res.value !== null && res.value !== 'null') this.setRiskCatData(res);
          break;
        case 'reset':
          this.resetCategories();
          break;
        default:
          // void
          break;
      }
    });
  }

  private resetCategories() {
    this.catProcesoProductivo = 0;
    this.catEspacioBiofisico = 0;
    this.catEntornoBiosifico = 0;
    this.catBioseguridad = 0;
    this.catMovilizacion = 0;
    this.catSocioEconomico = 0;
    this.catManejoSanitario = 0;
    this.currentRisk = null;
    this.threat = null;
    this.vulnerability = null;
    this.currentDpto = null;
  }

  updateData(event: ControlEvent) {
    switch (event.control) {
      case 'disease':
        this.currentDisease = event.value;
        if (event.value !== 'null' && event.value !== null) {
          this.jsonService.getDiseases().subscribe((res: any) => {
            if (!!res) {
              const currentDisease = res.find((x: any) => x.code === event.value);

              if (currentDisease) this.setGlobalData(currentDisease);
            }
          });
        }
        break;
      case 'dpto':
        this.currentDpto = event.value;

        if (!!this.currentDpto && !!this.currentDisease && this.currentDpto !== null && this.currentDpto !== 'null') {
          this.currentDpto = JSON.parse(this.currentDpto);
          this.jsonService.getDptoDiseaseData(this.currentDpto.code, this.currentDisease).subscribe(res => {
            this.jsonService.currentDiseaseData = res;
            this.dptoData = res;
            this.setDptoData();
          });
        }
        break;
      case 'municipality':
        console.log(event);
        if (event.value !== 'null' && event.value !== null) {
          const municData = JSON.parse(event?.value as string);

          this.setMuniData(municData.code);
        } else {
          this.setDptoData();
          console
        }
        break;
      case 'reset':
        this.resetCategories();
        break;

      default:
        break;
    }
  }

  public setMunicData(data: any, munic: Municipality) {
    this.currentData = data.find((x: any) => x.divipola === munic.code);

    if (!!this.currentData) {
      this.catProcesoProductivo = this.currentData['Prob_Cat_Proceso_Productivo'] || null;
      this.catEspacioBiofisico = this.currentData['Prob_Cat_Espacio_Biofisico'] || null;
      this.catEntornoBiosifico = this.currentData['Prob_Cat_Entorno_Biofisico_Ambiental'] || null;
      this.catBioseguridad = this.currentData['Prob_Cat_Bioseguridad'] || null;
      this.catMovilizacion = this.currentData['Prob_Cat_Movilizacion'] || null;
      this.catSocioEconomico = this.currentData['Prob_Cat_Entorno_Socioeconomico'] || null;
      this.catManejoSanitario = this.currentData['Prob_Cat_Manejo_Sanitario'] || null;
    } else {
      this.resetCategories();
    }
  }

  setGlobalData(data: any) {
    this.currentData = data;
    this.catProcesoProductivo = this.currentData['Prob_Cat_Proceso_Productivo'] || null;
    this.catEspacioBiofisico = this.currentData['Prob_Cat_Espacio_Biofisico'] || null;
    this.catEntornoBiosifico = this.currentData['Prob_Cat_Entorno_Biofisico_Ambiental'] || null;
    this.catBioseguridad = this.currentData['Prob_Cat_Bioseguridad'] || null;
    this.catMovilizacion = this.currentData['Prob_Cat_Movilizacion'] || null;
    this.catSocioEconomico = this.currentData['Prob_Cat_Entorno_Socioeconomico'] || null;
    this.catManejoSanitario = this.currentData['Prob_Cat_Manejo_Sanitario'] || null;
    this.currentRisk = this.currentData['Prob_Riesgo_especifico'] || null;
    this.threat = this.currentData['Prob_Cat_AMENAZA'] || null;
    this.vulnerability = this.currentData['Prob_Cat_VULNERABILIDAD'] || null;
  }

  setDptoData() {
    this.currentData = (!!this.dptoData && this.dptoData.length > 0) ? this.dptoData[0] : null;
    if (this.currentData) {
      this.catProcesoProductivo = this.currentData['Prob_Cat_Proceso_Productivo_medianDEP'] || null;
      this.catEspacioBiofisico = this.currentData['Prob_Cat_Espacio_Biofisico_medianDEP'] || null;
      this.catEntornoBiosifico = this.currentData['Prob_Cat_Entorno_Biofisico_Ambiental_medianDEP'] || null;
      this.catBioseguridad = this.currentData['Prob_Cat_Bioseguridad_medianDEP'] || null;
      this.catMovilizacion = this.currentData['Prob_Cat_Movilizacion_medianDEP'] || null;
      this.catSocioEconomico = this.currentData['Prob_Cat_Entorno_Socioeconomico_medianDEP'] || null;
      this.catManejoSanitario = this.currentData['Prob_Cat_Manejo_Sanitario_medianDEP'] || null;
      this.currentRisk = this.currentData['Prob_Riesgo_especifico_medianDEP'] || null;
      this.threat = this.currentData['Prob_Cat_AMENAZA_medianDEP'] || null;
      this.vulnerability = this.currentData['Prob_Cat_VULNERABILIDAD_medianDEP'] || null;
    }
  }

  setMuniData(muniCode: string) {
    if (this.dptoData) this.currentData = this.dptoData.find((x: any) => x.DPTOMPIO === muniCode);

    if (!!this.currentData) {
      this.catProcesoProductivo = this.currentData['Prob_Cat_Proceso_Productivo'] || null;
      this.catEspacioBiofisico = this.currentData['Prob_Cat_Espacio_Biofisico'] || null;
      this.catEntornoBiosifico = this.currentData['Prob_Cat_Entorno_Biofisico_Ambiental'] || null;
      this.catBioseguridad = this.currentData['Prob_Cat_Bioseguridad'] || null;
      this.catMovilizacion = this.currentData['Prob_Cat_Movilizacion'] || null;
      this.catSocioEconomico = this.currentData['Prob_Cat_Entorno_Socioeconomico'] || null;
      this.catManejoSanitario = this.currentData['Prob_Cat_Manejo_Sanitario'] || null;
      this.currentRisk = this.currentData['Prob_Riesgo_especifico'] || null;
      this.threat = this.currentData['Prob_Cat_AMENAZA'] || null;
      this.vulnerability = this.currentData['Prob_Cat_VULNERABILIDAD'] || null;
    }
  }

  public setRiskData(data: ControlEvent) {
    this.resetViewCategories();
    switch (data.value) {
      case 'RES':
        this.threatView = true;
        this.vulnerabilityView = true;
        break;
      case 'COA':
        this.threatView = true;
        this.vulnerabilityView = false;
        break;
      case 'COV':
        this.threatView = false;
        this.vulnerabilityView = true;
        break;
      default:
        this.threatView = true;
        this.vulnerabilityView = true;
        break;
    }
  }

  public setRiskCatData(data: ControlEvent) {
    this.viewBIO = false;
    this.viewSAN = false;
    this.viewMOV = false;
    this.viewEBA = false;
    this.viewESO = false;
    this.viewEBI = false;
    this.viewPRO = false;

    switch (data.value) {
      case 'BIO':
        this.viewBIO = true;
        break;
      case 'SAN':
        this.viewSAN = true;
        break;
      case 'MOV':
        this.viewMOV = true;
        break;
      case 'EBA':
        this.viewEBA = true;
        break;
      case 'ESO':
        this.viewESO = true;
        break;
      case 'EBI':
        this.viewEBI = true;
        break;
      case 'PRO':
        this.viewPRO = true;
        break;
      default:
        this.resetCategories();
        break;
    }

    this.getCurrentRiskCat(data.value as string);

  }

  getCurrentRiskCat(cat?: string) {
    const muniSelected = sessionStorage.getItem('municipality') !== null ? JSON.parse(sessionStorage.getItem('municipality') as string) : false;
    this.filteredRiskCat = this.riskCat.filter(x => x.riskcat === cat);
    this.riskWithData = [];

    if (muniSelected) {
      const muniCode = muniSelected.code;
      this.riskWithData = this.filteredRiskCat.map(riskCat => {
        const idx = `Prob_${riskCat.value}`;
        const currentData = this.jsonService.currentDiseaseData.find((x: any) => x.DPTOMPIO === muniCode);
        return {
          ...riskCat,
          categorieValue: this.caculateRiskValue(currentData[idx])
        }
      });
    } else {
      this.riskWithData = this.filteredRiskCat.map(riskCat => {
        const idx = `Prob_${riskCat.value}_medianDEP`;
        const currentData = this.jsonService.currentDiseaseData[0];
        return {
          ...riskCat,
          categorieValue: this.caculateRiskValue(currentData[idx])
        }
      });
    }
  }

  public toggleRightMenu() {
    this.toggleMenu = !this.toggleMenu;
    this.mapService.toggleMenu = this.toggleMenu;
  }

  private caculateRiskValue(dataValue: number | string | null): number | string {
    let value;

    console.log(dataValue);
    if (!!dataValue && dataValue >= 0) {
      value = dataValue;
    } else {
      value = 'N/A';
    }
    return value;
  }

  isNumber(val: any): boolean {
    return typeof val === 'number';
  }
}
