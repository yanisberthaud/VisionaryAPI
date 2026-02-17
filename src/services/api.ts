import type { ApiResponse, Movie, TVShow, Genre } from '../types/index';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export class ApiService {
  // Films populaires
  static async getPopularMovies(page: number = 1): Promise<ApiResponse<Movie>> {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR&page=${page}`
    );
    if (!response.ok) throw new Error('Erreur lors du chargement des films');
    return response.json() as Promise<ApiResponse<Movie>>;
  }

  // Séries populaires
  static async getPopularSeries(page: number = 1): Promise<ApiResponse<TVShow>> {
    const response = await fetch(
      `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=fr-FR&page=${page}`
    );
    if (!response.ok) throw new Error('Erreur lors du chargement des séries');
    return response.json() as Promise<ApiResponse<TVShow>>;
  }

  // Détails d'un film
  static async getMovieDetails(id: number): Promise<Movie> {
    const response = await fetch(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=fr-FR`
    );
    if (!response.ok) throw new Error('Erreur lors du chargement du film');
    return response.json() as Promise<Movie>;
  }

  // Détails d'une série
  static async getSeriesDetails(id: number): Promise<TVShow> {
    const response = await fetch(
      `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=fr-FR`
    );
    if (!response.ok) throw new Error('Erreur lors du chargement de la série');
    return response.json() as Promise<TVShow>;
  }

  // Liste des genres
  static async getGenres(): Promise<Genre[]> {
    const response = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=fr-FR`
    );
    if (!response.ok) throw new Error('Erreur lors du chargement des genres');
    const data = await response.json() as { genres: Genre[] };
    return data.genres;
  }

  // Recherche
  static async search(query: string, page: number = 1): Promise<ApiResponse<Movie>> {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}&page=${page}`
    );
    if (!response.ok) throw new Error('Erreur lors de la recherche');
    return response.json() as Promise<ApiResponse<Movie>>;
  }
}