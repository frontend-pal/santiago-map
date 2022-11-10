import { Component, OnInit } from '@angular/core';
import { Municipality } from 'src/app/models/municipality';
import { ControlEvent, ControlFormService } from 'src/app/services/control-form.service';
import { JsonListService } from 'src/app/services/Json-list.service';

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

  constructor(
    private controlFormService: ControlFormService,
    private jsonService: JsonListService
  ) { }

  ngOnInit(): void {
    console.log("entre al init");
    console.log(this.controlFormService);
    this.controlFormService.controlData.subscribe(res => {
      console.log("entre al update de atras");
      this.updateData(res);
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
  }

  updateData(event: ControlEvent) {
    console.log("entre al update de aadelante");
    console.log(event);
    if (event.control === 'municipality') {
      const municData = event.value as Municipality

      this.jsonService.getDptoDataGeoJson(municData?.departmentName).subscribe(res => {
        console.log(res);
        if (!!res) this.setDptoData(res, municData);

      });
    }
  }

  public setDptoData(data: any, munic: Municipality) {
    const currentData = data.find((x: any) => x.divipola === munic.code);

    console.log(currentData['Probabilidad Categoria Procesoproductivo']);
    if (!!currentData) {
      this.catProcesoProductivo = currentData['Probabilidad Categoria Procesoproductivo'];
      this.catEspacioBiofisico = currentData['Probabilidad Categoria Espacio BioFisico'];
      this.catEntornoBiosifico = currentData['Probabilidad Categoria Entorno BioFisicoAmbiental'];
      this.catBioseguridad = currentData['Probabilidad Categoria Bio seguridad'];
      this.catMovilizacion = currentData['Probabilidad Categoria Movilizacion'];
      this.catSocioEconomico = currentData['Probabilidad Categoria Entorno socioeconomico'];
      this.catManejoSanitario = 0; // Aún no esta
    } else {
      this.resetCategories();
    }
  }


}
