export interface JsonData {
  movies: Array<Movie>
}

export interface Movie {
  name: string
  season: number
  network: Array<string>
  date: string
  genre: Array<string>
}
