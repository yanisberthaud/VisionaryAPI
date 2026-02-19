import type { Movie, TVShow, SortKey, SortOrder } from '../types/index';

export class Helpers {
  // Trier les films
  static sortMovies(movies: Movie[], sortKey: SortKey, sortOrder: SortOrder): Movie[] {
    return [...movies].sort((a, b) => {
      let comparison = 0;

      if (sortKey === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortKey === 'vote_average') {
        comparison = a.vote_average - b.vote_average;
      } else if (sortKey === 'release_date') {
        comparison = new Date(a.release_date).getTime() - new Date(b.release_date).getTime();
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  // Trier les séries
  static sortSeries(series: TVShow[], sortKey: SortKey, sortOrder: SortOrder): TVShow[] {
    return [...series].sort((a, b) => {
      let comparison = 0;

      if (sortKey === 'title') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortKey === 'vote_average') {
        comparison = a.vote_average - b.vote_average;
      } else if (sortKey === 'release_date') {
        comparison = new Date(a.first_air_date).getTime() - new Date(b.first_air_date).getTime();
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  // Formater une note sur 10
  static formatRating(rating: number): string {
    return rating.toFixed(1);
  }

  // Formater une date en français
  static formatDate(date: string): string {
    if (!date) return 'Date inconnue';
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Calculer la moyenne des notes
  static averageRating(movies: Movie[]): number {
    if (movies.length === 0) return 0;
    const total = movies.reduce((sum, m) => sum + m.vote_average, 0);
    return Math.round((total / movies.length) * 10) / 10;
  }

  // Debounce pour la recherche
  static debounce(func: (value: string) => void, wait: number): (value: string) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return function (value: string) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(value), wait);
    };
  }
}