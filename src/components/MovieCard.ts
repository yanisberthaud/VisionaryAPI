import type { Movie, TVShow, MediaType } from '../types/index';
import { IMAGE_BASE_URL } from '../services/api';
import { StorageService } from '../services/storage';

export class MovieCard {
  static create(
    item: Movie | TVShow,
    type: MediaType,
    onClick: () => void,
    onToggleFavorite: () => void
  ): HTMLElement {
    const card = document.createElement('div');
    card.className = 'box-3';

    const title = type === 'movie'
      ? (item as Movie).title
      : (item as TVShow).name;

    const posterPath = item.poster_path
      ? `${IMAGE_BASE_URL}${item.poster_path}`
      : '/placeholder.jpg';

    const isFavorite = StorageService.isFavorite(item.id, type);

    card.innerHTML = `
      <div class="card-wrapper">
        <img 
          class="cover" 
          src="${posterPath}" 
          alt="${title}"
          loading="lazy"
        />
        <div class="card-overlay">
          <button 
            class="card-favorite ${isFavorite ? 'active' : ''}"
            aria-label="${isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}"
          >
            <i class="fas fa-star"></i>
          </button>
          <div class="card-info">
            <p class="card-title">${title}</p>
            <p class="card-rating">
              <i class="fas fa-star"></i> 
              ${item.vote_average.toFixed(1)}
            </p>
          </div>
        </div>
      </div>
    `;

    // Clic sur la carte → ouvre la modale
    const wrapper = card.querySelector('.card-wrapper') as HTMLElement;
    wrapper.addEventListener('click', onClick);

    // Clic sur le bouton favori
    const favoriteBtn = card.querySelector('.card-favorite') as HTMLButtonElement;
    favoriteBtn.addEventListener('click', (e: Event) => {
      e.stopPropagation();
      onToggleFavorite();
      favoriteBtn.classList.toggle('active');
    });

    // Navigation clavier
    card.tabIndex = 0;
    card.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') onClick();
    });

    return card;
  }

  // Skeleton de chargement
  static createSkeleton(): HTMLElement {
    const skeleton = document.createElement('div');
    skeleton.className = 'box-3 skeleton';
    skeleton.innerHTML = `
      <div class="card-wrapper">
        <div class="skeleton-image"></div>
      </div>
    `;
    return skeleton;
  }
}