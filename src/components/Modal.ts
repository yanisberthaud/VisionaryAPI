import type { Movie, TVShow, MediaType } from '../types/index';
import { IMAGE_BASE_URL } from '../services/api';
import { StorageService } from '../services/storage';
import { Helpers } from '../utils/helpers';

export class Modal {
  private overlay: HTMLElement | null = null;

  show(item: Movie | TVShow, type: MediaType, onToggleFavorite: () => void): void {
    this.close();

    const title = type === 'movie'
      ? (item as Movie).title
      : (item as TVShow).name;

    const date = type === 'movie'
      ? (item as Movie).release_date
      : (item as TVShow).first_air_date;

    const posterPath = item.poster_path
      ? `${IMAGE_BASE_URL}${item.poster_path}`
      : '/placeholder.jpg';

    const isFavorite = StorageService.isFavorite(item.id, type);

    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    this.overlay.setAttribute('role', 'dialog');
    this.overlay.setAttribute('aria-modal', 'true');

    this.overlay.innerHTML = `
      <div class="modal-container">
        <button class="modal-close" aria-label="Fermer">
          <i class="fas fa-times"></i>
        </button>

        <div class="modal-body">
          <div class="modal-cover">
            <img src="${posterPath}" alt="${title}" />
          </div>

          <div class="modal-info">
            <h2 class="modal-title">${title}</h2>

            <p class="modal-description">
              ${item.overview || 'Aucune description disponible.'}
            </p>

            <p class="modal-date">
              <i class="fas fa-calendar"></i>
              ${Helpers.formatDate(date)}
            </p>

            <div class="modal-rating">
              <i class="fas fa-star"></i>
              ${Helpers.formatRating(item.vote_average)} / 10
              <span>(${item.vote_count} votes)</span>
            </div>

            <div class="modal-actions">
              <button class="btn bouton-play">
                <i class="fas fa-play"></i> Lecture
              </button>
              <button class="btn bouton-information modal-favorite-btn ${isFavorite ? 'active' : ''}">
                <i class="fas fa-star"></i>
                ${isFavorite ? 'Dans mes favoris' : 'Ajouter aux favoris'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Fermer en cliquant sur l'overlay
    this.overlay.addEventListener('click', (e: Event) => {
      if (e.target === this.overlay) this.close();
    });

    // Fermer avec Escape
    document.addEventListener('keydown', this.handleKeyDown);

    // Bouton fermer
    const closeBtn = this.overlay.querySelector('.modal-close') as HTMLButtonElement;
    closeBtn.addEventListener('click', () => this.close());

    // Bouton favori
    const favoriteBtn = this.overlay.querySelector('.modal-favorite-btn') as HTMLButtonElement;
    favoriteBtn.addEventListener('click', () => {
      onToggleFavorite();
      const isNowFavorite = favoriteBtn.classList.toggle('active');
      favoriteBtn.innerHTML = `
        <i class="fas fa-star"></i>
        ${isNowFavorite ? 'Dans mes favoris' : 'Ajouter aux favoris'}
      `;
    });

    document.body.appendChild(this.overlay);
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') this.close();
  };

  close(): void {
    if (this.overlay) {
      document.removeEventListener('keydown', this.handleKeyDown);
      this.overlay.remove();
      this.overlay = null;
      document.body.style.overflow = '';
    }
  }
}