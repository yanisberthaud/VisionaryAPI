// Types pour les films TMDB
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
}

// Types pour les séries TMDB
export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
}

// Réponse générique de l'API TMDB
export interface ApiResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// Genre
export interface Genre {
  id: number;
  name: string;
}

// État global de l'app
export interface AppState {
  movies: Movie[];
  series: TVShow[];
  favorites: Set<number>;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  sortKey: SortKey;
  sortOrder: SortOrder;
  viewMode: ViewMode;
}

export type SortKey = 'title' | 'vote_average' | 'release_date';
export type SortOrder = 'asc' | 'desc';
export type ViewMode = 'all' | 'favorites';
export type MediaType = 'movie' | 'tv';