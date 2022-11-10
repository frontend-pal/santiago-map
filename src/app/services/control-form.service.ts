import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Department } from '../models/departamento';
import { Municipality } from '../models/municipality';

export interface ControlEvent {
  control: string;
  value: Municipality | Department | null;
}

@Injectable({
  providedIn: 'root'
})
export class ControlFormService {
  private _controlData: Subject<ControlEvent> = new Subject<ControlEvent>();

  constructor() { }

  public get controlData(): Subject<ControlEvent> {
    return this._controlData;
  }
  
  public setControlData(value: ControlEvent) {
    this._controlData.next(value);
  }  
}
