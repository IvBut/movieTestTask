import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Alert, AlertService, AlertType} from '../alert.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {
  message: string;
  type: AlertType;
  alSub: Subscription;
  @Input('ttl') timeToLive = 5000;
  constructor(private alertService: AlertService) { }

  ngOnInit(): void {
    this.alSub = this.alertService.alert$.subscribe(alert =>{
      this.message = alert.message;
      this.type = alert.type;

      const timeOut = setTimeout(()=>{
        clearTimeout(timeOut);
        this.message = '';
      }, this.timeToLive)
    });
  }

  ngOnDestroy(): void {
    if (this.alSub) {
      this.alSub.unsubscribe();
    }
  }

}
