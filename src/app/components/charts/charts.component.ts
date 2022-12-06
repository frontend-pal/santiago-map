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
  toggleMenu = true;

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

  // Riesgo
  currentRisk?: number | null = null;

  constructor(
    private controlFormService: ControlFormService,
    private jsonService: JsonListService,
    private mapService: MapControllerService
  ) { }

  ngOnInit(): void {
    this.controlFormService.controlData.subscribe(res => {
      switch (res.control) {
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
  }

  updateData(event: ControlEvent) {
    switch (event.control) {
      case 'municipality':
        const municData = event.value as Municipality

        this.jsonService.getDptoDataGeoJson(municData?.departmentCode)
          .subscribe(res => {
            if (!!res) this.setMunicData(res, municData);
          });
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
      this.catProcesoProductivo = this.currentData['Prob_Cat_Proceso_productivo'];
      this.catEspacioBiofisico = this.currentData['Prob_Cat_Espacio_BioFisico'];
      this.catEntornoBiosifico = this.currentData['Prob_Cat_Entorno_BioFisico_Ambiental'];
      this.catBioseguridad = this.currentData['Prob_Cat_Bioseguridad'];
      this.catMovilizacion = this.currentData['Prob_Cat_Movilizacion'];
      this.catSocioEconomico = this.currentData['Prob_Cat_Entorno_sociEco'];
      this.catManejoSanitario = 0; // Aún no esta
    } else {
      this.resetCategories();
    }
  }

  public setRiskData(data: ControlEvent) {
    console.log(data);
    // this.currentRisk = this.currentData[data.value as string];
    // if (!!this.currentRisk && this.currentRisk !== -1) this.currentRisk = this.currentRisk * 100;
    this.mapService.getColombiaMap(data?.value || '')
  }

  public toggleRightMenu() {
    this.toggleMenu = !this.toggleMenu;
    this.mapService.toggleMenu = this.toggleMenu;
  }
}
