import './sass/main.scss';
import type { Movie, TVShow, MediaType, SortKey, SortOrder, ViewMode } from './types/index';
import { ApiService } from './services/api';
import { StorageService } from './services/storage';
import { Helpers } from './utils/helpers';
import { MovieCard } from './components/MovieCard';
import { Modal } from './components/Modal';
import { Stats } from './components/Stats';

interface AppState {
  movies: Movie[];
  series: TVShow[];
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  sortKey: SortKey;
  sortOrder: SortOrder;
  viewMode: ViewMode;
}

class App {
  private state: AppState = {
    movies: [],
    series: [],
    currentPage: 1,
    totalPages: 1,
    isLoading: false,
    error: null,
    sortKey: 'vote_average',
    sortOrder: 'desc',
    viewMode: 'all'
  };

  private modal = new Modal();
  private stats: Stats | null = null;

  async init(): Promise<void> {
    // Initialiser les stats si l'élément existe
    const statsEl = document.getElementById('stats-container');
    if (statsEl) this.stats = new Stats('stats-container');

    this.setupEventListeners();
    await this.loadMovies();
  }

  // Charger les films
  private async loadMovies(page: number = 1): Promise<void> {
    this.state.isLoading = true;
    this.state.error = null;
    this.renderSkeletons();

    try {
      const response = await ApiService.getPopularMovies(page);

      if (page === 1) {
        this.state.movies = response.results;
      } else {
        this.state.movies = [...this.state.movies, ...response.results];
      }

      this.state.currentPage = page;
      this.state.totalPages = response.total_pages;
      this.state.isLoading = false;

      this.render();
    } catch (error) {
      this.state.isLoading = false;
      this.state.error = error instanceof Error
        ? error.message
        : 'Une erreur est survenue';
      this.renderError();
    }
  }

  // Rendu principal
  private render(): void {
    let items = [...this.state.movies];

    // Filtrer les favoris si nécessaire
    if (this.state.viewMode === 'favorites') {
      const favorites = StorageService.getFavorites();
      items = items.filter(m =>
        favorites.some(f => f.id === m.id && f.type === 'movie')
      );
    }

    // Trier
    items = Helpers.sortMovies(items, this.state.sortKey, this.state.sortOrder);

    // Afficher
    this.renderGrid(items);

    // Stats
    this.stats?.render(items);

    // Bouton voir plus
    this.updateLoadMoreButton();
  }

  // Afficher la grille
  private renderGrid(movies: Movie[]): void {
    const grid = document.getElementById('movies-grid');
    if (!grid) return;

    if (movies.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <p>Aucun film trouvé 😕</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = '';
    movies.forEach(movie => {
      const card = MovieCard.create(
        movie,
        'movie',
        () => this.showModal(movie, 'movie'),
        () => this.toggleFavorite(movie.id, 'movie')
      );
      grid.appendChild(card);
    });
  }

  // Afficher les skeletons
  private renderSkeletons(): void {
    const grid = document.getElementById('movies-grid');
    if (!grid) return;

    grid.innerHTML = '';
    for (let i = 0; i < 8; i++) {
      grid.appendChild(MovieCard.createSkeleton());
    }
  }

  // Afficher une erreur
  private renderError(): void {
    const grid = document.getElementById('movies-grid');
    if (!grid) return;

    grid.innerHTML = `
      <div class="error-state">
        <p>⚠️ ${this.state.error}</p>
        <button class="btn bouton-play" id="retry-btn">
          Réessayer
        </button>
      </div>
    `;

    document.getElementById('retry-btn')
      ?.addEventListener('click', () => this.loadMovies());
  }

  // Ouvrir la modale
  private showModal(item: Movie | TVShow, type: MediaType): void {
    this.modal.show(item, type, () => {
      this.toggleFavorite(item.id, type);
    });
  }

  // Toggle favori
  private toggleFavorite(id: number, type: MediaType): void {
    StorageService.toggleFavorite(id, type);
    this.render();
  }

  // Mettre à jour le bouton "Voir plus"
  private updateLoadMoreButton(): void {
    const btn = document.getElementById('load-more-btn') as HTMLButtonElement;
    if (!btn) return;

    const hasMore = this.state.currentPage < this.state.totalPages;
    const isFiltered = this.state.viewMode === 'favorites';

    btn.style.display = hasMore && !isFiltered ? 'block' : 'none';
  }

  // Event listeners
  private setupEventListeners(): void {
    // Voir plus
    document.getElementById('load-more-btn')
      ?.addEventListener('click', () => {
        this.loadMovies(this.state.currentPage + 1);
      });

    // Tri
    const sortSelect = document.getElementById('sort-select') as HTMLSelectElement;
    sortSelect?.addEventListener('change', () => {
      const [key, order] = sortSelect.value.split('-') as [SortKey, SortOrder];
      this.state.sortKey = key;
      this.state.sortOrder = order;
      this.render();
    });

    // Toggle favoris
    const favToggle = document.getElementById('favorites-toggle') as HTMLInputElement;
    favToggle?.addEventListener('change', () => {
      this.state.viewMode = favToggle.checked ? 'favorites' : 'all';
      this.render();
    });

    // Recherche
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    if (searchInput) {
      const debouncedSearch = Helpers.debounce((value: string) => {
        this.handleSearch(value);
      }, 300);

      searchInput.addEventListener('input', () => {
        debouncedSearch(searchInput.value);
      });
    }
  }

  // Recherche
  private async handleSearch(query: string): Promise<void> {
    if (!query.trim()) {
      await this.loadMovies(1);
      return;
    }

    this.renderSkeletons();
    try {
      const response = await ApiService.search(query);
      this.state.movies = response.results;
      this.state.totalPages = 1;
      this.render();
    } catch {
      this.renderError();
    }
  }
}

// Lancer l'app
const app = new App();
app.init().catch(console.error);