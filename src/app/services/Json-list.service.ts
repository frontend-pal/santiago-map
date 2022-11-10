import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Department } from '../models/departamento';
import { Municipality } from '../models/municipality';

@Injectable({
  providedIn: 'root'
})
export class JsonListService {
  public municipios!: Municipality[];
  public jsonDocuments: any[] = [];
  public jsonPaises: any[] = [];

  constructor(private http: HttpClient) { }

  public getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>('../../assets/json/departamentos.json');
  }

  public getMunicipality() {
    return this.http.get<Municipality[]>('../../assets/json/municipios.json')
      .pipe(
        map(res => {
          if (!!res && res.length !== 0) {
            this.municipios = res;
          }

          return res;
        })
      );
  }

  public getColombiaGeoJson() {
    return this.http.get('../../assets/json/Colombia_departamentos_poblacion.geojson');
  }

  public getMunicGeoJson() {
    return this.http.get('../../assets/json/municipios/MGN_ANM_MPIOS.geojson');
  }

  public getDptoGeoJson(dpto?: string) {
    return this.http.get('../../assets/json/dptos/ANTIOQUIA.geojson');
  }

  public getMunicipalityByCode(code: string | undefined): Municipality[] | [] {
    return this.municipios.length !== 0 && code !== undefined ? this.municipios.filter(x => x.departmentCode === code?.toString()) : [];
  }

  public getDptoDataGeoJson(name: string) {
    name = name.toUpperCase();
    console.log(name);
    return this.http.get(`../../assets/json/excelData/${name}.json`);
  }
}
