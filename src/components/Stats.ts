import type { Movie } from '../types/index';
import { Helpers } from '../utils/helpers';
import { StorageService } from '../services/storage';

export class Stats {
  private container: HTMLElement;

  constructor(containerId: string) {
    const element = document.getElementById(containerId);
    if (!element) throw new Error(`Element #${containerId} introuvable`);
    this.container = element;
  }

  render(movies: Movie[]): void {
    const favoritesCount = StorageService.getFavoritesCount();
    const avgRating = Helpers.averageRating(movies);

    this.container.innerHTML = `
      <div class="stat-item">
        <span class="stat-value">${movies.length}</span>
        <span class="stat-label">Films affichés</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${favoritesCount}</span>
        <span class="stat-label">Favoris</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${avgRating}</span>
        <span class="stat-label">Note moyenne</span>
      </div>
    `;
  }
}