import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Department } from '../models/departamento';
import { Municipality } from '../models/municipality';

export interface ControlEvent {
  control: string;
  value?: Municipality | Department | string | null;
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

  public setControlData(controlEvt: ControlEvent) {
    if (typeof controlEvt?.value !== 'string') {
      controlEvt.value = JSON.stringify(controlEvt?.value);
    }

    if (controlEvt.value === null || controlEvt.value === 'null') {
      sessionStorage.removeItem(controlEvt.control);
    } else {
      sessionStorage.setItem(controlEvt.control, controlEvt.value);
    }

    this._controlData.next(controlEvt);
  }
}
