import { Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {JsonData, Movie} from '../interfaces';
import {selectOption} from '../shared/CustomSelect.component';
import {AlertService} from '../shared/alert.service';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
  storedData = [];
  dataList = [];
  bufferData = [];
  headers = [
    {
      name: 'Name',
    },
    {
      name: 'Season',
    },
    {
      name: 'Network',
    },
    {
      name: 'Premiere',
    },
  ];

  isPagination: boolean = true;

  sortingDirection: string = '';
  sortingHeader: string = '';

  genres = new Map();
  premieres = new Set();

  inpName: string = '';

  premierePlaceholder: string = 'Premiere Year';
  genrePlaceholder: string = 'Genre';

  constructor(private http:HttpClient, private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.http.get<JsonData>('./assets/movies.json').subscribe(result=>{
      this.storedData = result.movies.map(m=>{
        m.network = m.network.sort((a, b) =>{
          let company1 = a.trim().toLocaleLowerCase();
          let company2 = b.trim().toLocaleLowerCase();
          return (a < b) ? -1: (a > b) ? 1: 0;
        });
        return m;
      });
      const data: Array<Movie> = result.movies;
      this.createGenres(data);
      this.createPremiers(data);

      this.bufferData = [...this.storedData];

      this.dataList = [...this.bufferData];
    });
  }

  handlePaginate(result: Movie[]) {
    this.dataList = result;
  }

  private createGenres(data: Array<Movie>){
    let combinedGenres = [];
    data.forEach(movie=>{
      combinedGenres.push(...movie.genre);
    });
    let genres = new Set(combinedGenres);
    genres.forEach(genre => {
      this.genres.set(genre,this.getRandomColor());
    });

  }

  private createPremiers(data: Array<Movie>){
    let premiersList = new Set(data.map(movie => movie.date.split('.')[2])
                               .sort((number1, number2) =>  +number2 - +number1));
   this.premieres = premiersList;
  }

  getRandomColor(): string {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  get  genresOptions(){
    let result = [];
    for (let key of this.genres.keys()){
      result.push({
        value: key,
        title: key
      })
    }
    return result;
  }

  get premieresOptions(){
    let result = [] ;
    this.premieres.forEach(item => result.push({
      value: item,
      title: item
    }));
    return result;
  }

  filterNames() {
    let filteredData = this.storedData.filter(item=>{
      return item.name.toLocaleLowerCase().includes(this.inpName.toLocaleLowerCase());
    });
    if (filteredData.length > 0) {
      this.bufferData = filteredData;
      if (!this.isPagination) this.dataList = filteredData;
      this.sort(this.sortingHeader, this.sortingDirection);
    }
    this.showUserMessage(filteredData.length);
  }


  filterGenres(option: selectOption) {
    let filteredData = this.storedData.filter(movie => {
      return movie.genre.indexOf(option.value) > -1;
    });
    if (filteredData.length > 0){
      this.bufferData = filteredData;
      if (!this.isPagination) this.dataList = filteredData;
      this.genrePlaceholder = option.title;
      this.sort(this.sortingHeader, this.sortingDirection);
    }
    this.showUserMessage(filteredData.length);
  }

  filterPremieres(option: selectOption) {
    this.inpName = '';
    let filteredData = this.storedData.filter(movie => {
      return movie.date.includes(option.value);
    });
    if(filteredData.length > 0){
      this.bufferData = filteredData;
      if (!this.isPagination) this.dataList = filteredData;
      this.premierePlaceholder = option.title;
      this.sort(this.sortingHeader, this.sortingDirection);
    }
    this.showUserMessage(filteredData.length);
  }

  resetFilters() {
    this.bufferData = [...this.storedData];
    this.inpName = '';
    this.premierePlaceholder = 'Premiere Year';
    this.genrePlaceholder =  'Genre';
    this.sort(this.sortingHeader, this.sortingDirection);
    if(!this.isPagination)  this.dataList = [...this.bufferData];
  }

  sort(header: string, dir:string){

    this.sortingHeader = header;
    this.sortingDirection = dir;

    const direction = this.sortingDirection === 'ASC'? 1 : -1;
    let result = [];
    if (this.sortingHeader === 'Name'){
       result = this.sortByName(direction);
    }
    else if (this.sortingHeader === 'Season'){
      result = this.sortBySeason(direction);
    }
    else if (this.sortingHeader === 'Network'){
      result = this.sortByNetwork(direction);
    }
    else if (this.sortingHeader === 'Premiere'){
      result = this.sortBytDate(direction);
    }
    console.log(result);
    if (result.length > 0){
      this.bufferData = [...result];
      if (!this.isPagination) this.dataList = [...result];
    }

  }

  private sortByName(direction: number){
    return this.bufferData.sort((a,b)=>{
      let name1 = a.name.toLowerCase().trim();
      let name2 = b.name.toLowerCase().trim();

      if (name1 < name2) return -1*direction;
      if (name1 > name2) return 1 * direction;
      return 0;
    });
  }

  private sortBySeason(direction: number){
    return this.bufferData.sort((a,b) => {
      return (Number(a.season) - Number(b.season)) * direction
    })
  }

  private sortByNetwork(direction:number){
    return this.bufferData.sort((a,b) => {
      let network1 = a.network.join(',').toLocaleLowerCase().trim();
      let network2 = b.network.join(',').toLocaleLowerCase().trim();
      return (network1 < network2) ? -1*direction: (network1 > network2) ? 1*direction: 0;
    });
  }


  private sortBytDate(direction: number){
    return this.bufferData.sort((a,b) => {
      let dateString1 = a.date.split('.');
      let dateString2 = b.date.split('.');

      let date1 = new Date(+dateString1[2], dateString1[1] - 1, +dateString1[0]);
      let date2 = new Date(+dateString2[2], dateString2[1] - 1, +dateString2[0]);
      return (Number(date1) - Number(date2)) * direction;
    });
  }

  changeView() {
    this.isPagination = !this.isPagination;
    this.resetFilters();
    // this.dataList = [...this.bufferData];
    console.log('BUFFER',this.bufferData);
  }

  private showUserMessage(recordsFind:number){
    recordsFind > 0 ? this.alertService.successful(`${recordsFind} films found!`) : this.alertService.unsuccessful('No films found');
  }
}
