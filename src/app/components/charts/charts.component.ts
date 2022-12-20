import { Component, OnInit } from '@angular/core';
import { Municipality } from 'src/app/models/municipality';
import { ControlEvent, ControlFormService } from 'src/app/services/control-form.service';
import { JsonListService } from 'src/app/services/Json-list.service';
import { MapControllerService } from 'src/app/services/map-controller.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {
  toggleMenu = false;

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

  constructor(
    private controlFormService: ControlFormService,
    private jsonService: JsonListService,
    private mapService: MapControllerService
  ) { }

  ngOnInit(): void {
    this.initListeners();
  }

  initListeners() {
    this.controlFormService.controlData.subscribe(res => {
      console.log(res.control);
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
          this.setRiskData(res);
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
    console.log("entre al updatedata de charts");
    console.log(event.control + ' y valor -->', event.value);
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

        console.log(this.currentDpto);
        if (!!this.currentDpto && !!this.currentDisease && this.currentDpto !== null && this.currentDpto !== 'null') {
          this.currentDpto = JSON.parse(this.currentDpto);
          console.log(this.currentDpto.code);
          console.log(this.currentDisease);
          this.jsonService.getDptoDiseaseData(this.currentDpto.code, this.currentDisease).subscribe(res => {
            this.jsonService.currentDiseaseData = res;
            this.dptoData = res;
            this.setDptoData();
          });
        }
        break;
      case 'municipality':
        if (event.value !== 'null' && event.value !== null && event.value !== 'null') {
          const municData = JSON.parse(event?.value as string);

          console.log(municData.code);
          this.setMuniData(municData.code);
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
      this.catProcesoProductivo = this.currentData['Prob_Cat_Proceso_Productivo'] || 0;
      this.catEspacioBiofisico = this.currentData['Prob_Cat_Espacio_Biofisico'] || 0;
      this.catEntornoBiosifico = this.currentData['Prob_Cat_Entorno_Biofísico_Ambiental'] || 0;
      this.catBioseguridad = this.currentData['Prob_Cat_Bioseguridad'] || 0;
      this.catMovilizacion = this.currentData['Prob_Cat_Movilización'] || 0;
      this.catSocioEconomico = this.currentData['Prob_Cat_Entorno_Socioeconómico'] || 0;
      this.catManejoSanitario = this.currentData['Prob_Cat_Manejo_Sanitario'] || 0;
    } else {
      this.resetCategories();
    }
  }

  setGlobalData(data: any) {
    this.currentData = data;
    this.catProcesoProductivo = this.currentData['Prob_Cat_Proceso_Productivo'] || 0;
    this.catEspacioBiofisico = this.currentData['Prob_Cat_Espacio_Biofisico'] || 0;
    this.catEntornoBiosifico = this.currentData['Prob_Cat_Entorno_Biofísico_Ambiental'] || 0;
    this.catBioseguridad = this.currentData['Prob_Cat_Bioseguridad'] || 0;
    this.catMovilizacion = this.currentData['Prob_Cat_Movilización'] || 0;
    this.catSocioEconomico = this.currentData['Prob_Cat_Entorno_Socioeconómico'] || 0;
    this.catManejoSanitario = this.currentData['Prob_Cat_Manejo_Sanitario'] || 0;
    this.currentRisk = this.currentData['Prob_Riesgo_especifico'] || 0;
    this.threat = this.currentData['Prob_Cat_AMENAZA'] || 0;
    this.vulnerability = this.currentData['Prob_Cat_VULNERABILIDAD'] || 0;
  }

  setDptoData() {
    this.currentData = this.dptoData[0];
    this.catProcesoProductivo = this.currentData['Prob_Cat_Proceso_Productivo_medianDEP'] || 0;
    this.catEspacioBiofisico = this.currentData['Prob_Cat_Espacio_Biofisico_medianDEP'] || 0;
    this.catEntornoBiosifico = this.currentData['Prob_Cat_Entorno_Biofísico_Ambiental_medianDEP'] || 0;
    this.catBioseguridad = this.currentData['Prob_Cat_Bioseguridad_medianDEP'] || 0;
    this.catMovilizacion = this.currentData['Prob_Cat_Movilización_medianDEP'] || 0;
    this.catSocioEconomico = this.currentData['Prob_Cat_Entorno_Socioeconómico_medianDEP'] || 0;
    this.catManejoSanitario = this.currentData['Prob_Cat_Manejo_Sanitario_medianDEP'] || 0;
    this.currentRisk = this.currentData['Prob_Riesgo_especifico_medianDEP'] || 0;
    this.threat = this.currentData['Prob_Cat_AMENAZA_medianDEP'] || 0;
    this.vulnerability = this.currentData['Prob_Cat_VULNERABILIDAD_medianDEP'] || 0;
  }

  setMuniData(muniCode: string) {
    this.currentData = this.dptoData.find((x: any) => x.DPTOMPIO === muniCode);

    console.log(this.currentData);
    if (!!this.currentData) {
      this.catProcesoProductivo = this.currentData['Prob_Cat_Proceso_Productivo'] || 0;
      this.catEspacioBiofisico = this.currentData['Prob_Cat_Espacio_Biofisico'] || 0;
      this.catEntornoBiosifico = this.currentData['Prob_Cat_Entorno_Biofísico_Ambiental'] || 0;
      this.catBioseguridad = this.currentData['Prob_Cat_Bioseguridad'] || 0;
      this.catMovilizacion = this.currentData['Prob_Cat_Movilización'] || 0;
      this.catSocioEconomico = this.currentData['Prob_Cat_Entorno_Socioeconómico'] || 0;
      this.catManejoSanitario = this.currentData['Prob_Cat_Manejo_Sanitario'] || 0;
      this.currentRisk = this.currentData['Prob_Riesgo_especifico'] || 0;
      this.threat = this.currentData['Prob_Cat_AMENAZA'] || 0;
      this.vulnerability = this.currentData['Prob_Cat_VULNERABILIDAD'] || 0;
    }
  }

  public setRiskData(data: ControlEvent) {
    console.log(data);

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

  public toggleRightMenu() {
    this.toggleMenu = !this.toggleMenu;
    this.mapService.toggleMenu = this.toggleMenu;
  }
}
