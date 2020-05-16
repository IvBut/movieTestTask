import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Movie} from '../interfaces';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() dataItems;
  @Output() onPaginate = new EventEmitter<Movie[]>();

  currentPage: number = 1;
  recordsPerPage = [3, 5 , 10 , 25];
  currentRecordsCount = this.recordsPerPage[0];

  constructor() { }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      if (this.dataItems && this.dataItems.length > 0){
        this.paginate();
      }
    });

  }

  ngOnInit(): void {
  }

  get pagesList () {
    let items = [];
    let pages = this.totalPages();
    for(let i = 1; i <= pages; i++ ){
      items.push(i);
    }
    return items;
  };

  totalPages(): number{
    return Math.ceil(this.dataItems.length/this.currentRecordsCount);
  }

  handleChangeRecords($event: MouseEvent, i: number) {
    this.currentRecordsCount = this.recordsPerPage[i];
    this.currentPage = 1;
    this.paginate();
  }

  onPageClick(i: number) {
    this.currentPage = i;
    this.paginate();
  }

  paginate(){
    if (!this.dataItems.length) return;

    if (this.currentPage < 1) this.currentPage = this.totalPages();
    if (this.currentPage > this.totalPages()) this.currentPage = 1;

    let start = (this.currentPage - 1)*this.currentRecordsCount;
    let end = start + this.currentRecordsCount;
    if (end > this.dataItems.length) end = this.dataItems.length;
    let output = this.dataItems.slice(start,end);

    this.onPaginate.emit(output);
  }


  previousPage() {
    this.currentPage -= 1;
    this.paginate()
  }

  nextPage() {
    this.currentPage += 1;
    this.paginate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(()=>{
      if (changes.dataItems.currentValue !== changes.dataItems.previousValue) {
        this.paginate();
      }
    });
  }

}
