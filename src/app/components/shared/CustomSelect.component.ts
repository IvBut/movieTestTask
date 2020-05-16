import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';

export interface selectOption {
  title: string
  value: string
}

@Component({
  selector: 'app-custom-select',
  template: `
    <div class="select-wrapper" [ngClass]="{'show':isOpen}">
      <button type="button" class="main-btn select-btn" (click)="toggleOpen()">{{ placeholder }}<i class="arrow down"></i></button>
      <div class="dropdown-menu" id="style-6" *ngIf="open">
        <button
          type="button"
          class="select-btn"
          *ngFor="let option of options"
          [ngClass]="{'active':option.value === value}"
          (click)="optionSelect(option);">
          {{option.title}}
        </button>
        <div class="dropdown-item" *ngIf="!options.length">No items for select</div>
      </div>
    </div>
  `,
  styles: [
   `.select-wrapper {
      width: 200px;
      position: relative;
    }

    .arrow {
      position: absolute;
      right: 5px;
      top:calc(50% - 5px);
      border: solid var(--mainWhite);
      border-width: 0 3px 3px 0;
      display: inline-block;
      padding: 3px;
    }

    .down {
      transform: rotate(45deg);
      -webkit-transform: rotate(45deg);
    }

    .dropdown-menu {
     position: absolute;
     width: 100%;
     top:0;
     left: 0;
     transform: translateY(-50%);
     overflow-y: scroll;
     max-height: 220px;
     z-index: 99999;
    }
    .main-btn{
      text-align: left;
      position: relative;
    }

    .select-btn {
      width: 100%;
      min-height: 25px;
      padding: 5px;
      color: var(--mainWhite);
      outline: none;
      border: 1px solid yellow;
      border-radius: 2px;
      background: var(--mainOrange);
      font-weight: 900;
    }

    .select-btn:hover{
      background: darkorange;
      cursor: pointer;
    }

    .active {
      background: orangered;
    }

    #style-6::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background-color: #F5F5F5;
    }

    #style-6::-webkit-scrollbar {
      width: 10px;
      background-color: #F5F5F5;
    }

    #style-6::-webkit-scrollbar-thumb {
      background-color: #F90;
      background-image: -webkit-linear-gradient(45deg,
      rgba(255, 255, 255, .2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, .2) 50%,
      rgba(255, 255, 255, .2) 75%,
      transparent 75%,
      transparent)
    }




    `
  ]
})
export class CustomSelectComponent implements OnInit{
  @Input() options: selectOption[] = [];
  @Input() placeholder;

  @Output('change') selectChange = new EventEmitter<selectOption>();

  private innerValue: string = '';
  open:boolean = false;

  constructor() {
  }

  set value(value: string){
    this.innerValue = value;
    this.open = false;
  }

  get value(): string {
    return  this.innerValue;
  }

  optionSelect(option: selectOption){
    this.value = option.value;
    this.placeholder = option.title;
    this.selectChange.emit(option);
  }

  toggleOpen(){
    this.open = !this.open;
  }
  get isOpen(){
    return this.open;
  }

  ngOnInit(): void {
  }
}
