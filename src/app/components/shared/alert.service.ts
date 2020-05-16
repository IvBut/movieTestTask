import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

export type  AlertType = 'successful' | 'unsuccessful'

export interface Alert {
  type: AlertType
  message: string
}

@Injectable({providedIn: 'root'})
export class AlertService {

  public alert$ = new Subject<Alert>();

  successful(message: string){
    this.alert$.next({type:  'successful', message})
  }

  unsuccessful(message: string){
    this.alert$.next({type:  'unsuccessful', message})
  }
}
