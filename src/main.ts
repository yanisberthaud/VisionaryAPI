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
    const statsEl = document.getElementById('stats-container');
    if (statsEl) this.stats = new Stats('stats-container');

    this.setupEventListeners();

    await Promise.all([
      this.loadCarousel('popular-movies', () => ApiService.getPopularMovies(), 'movie'),
      this.loadCarousel('toprated-movies', () => ApiService.getTopRatedMovies(), 'movie'),
      this.loadCarousel('nowplaying-movies', () => ApiService.getNowPlayingMovies(), 'movie'),
      this.loadCarousel('popular-series', () => ApiService.getPopularSeries(), 'tv'),
      this.loadCarousel('toprated-series', () => ApiService.getTopRatedSeries(), 'tv'),
    ]);
  }

  private async loadCarousel(
    gridId: string,
    fetchFn: () => Promise<{ results: Movie[] | TVShow[] }>,
    type: MediaType
  ): Promise<void> {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    grid.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      grid.appendChild(MovieCard.createSkeleton());
    }

    try {
      const response = await fetchFn();
      const items = response.results;

      if (gridId === 'popular-movies') {
        this.state.movies = items as Movie[];
        this.stats?.render(this.state.movies);
      }

      grid.innerHTML = '';
      items.forEach(item => {
        const card = MovieCard.create(
          item,
          type,
          () => this.showModal(item, type),
          () => this.toggleFavorite(item.id, type)
        );
        grid.appendChild(card);
      });

    } catch {
      grid.innerHTML = `
        <div class="error-state">
          <p>⚠️ Erreur de chargement</p>
          <button class="btn bouton-play" onclick="location.reload()">
            Réessayer
          </button>
        </div>
      `;
    }
  }

  private showModal(item: Movie | TVShow, type: MediaType): void {
    this.modal.show(item, type, () => {
      this.toggleFavorite(item.id, type);
    });
  }

  private toggleFavorite(id: number, type: MediaType): void {
    StorageService.toggleFavorite(id, type);
    this.stats?.render(this.state.movies);
  }

  private setupEventListeners(): void {
    // Tri
    const sortSelect = document.getElementById('sort-select') as HTMLSelectElement;
    sortSelect?.addEventListener('change', () => {
      const [key, order] = sortSelect.value.split('-') as [SortKey, SortOrder];
      this.state.sortKey = key;
      this.state.sortOrder = order;

      const grid = document.getElementById('popular-movies');
      if (!grid) return;

      const sorted = Helpers.sortMovies(
        this.state.movies,
        this.state.sortKey,
        this.state.sortOrder
      );

      grid.innerHTML = '';
      sorted.forEach(movie => {
        const card = MovieCard.create(
          movie,
          'movie',
          () => this.showModal(movie, 'movie'),
          () => this.toggleFavorite(movie.id, 'movie')
        );
        grid.appendChild(card);
      });
    });

    // Toggle favoris
    const favToggle = document.getElementById('favorites-toggle') as HTMLInputElement;
    favToggle?.addEventListener('change', () => {
      this.state.viewMode = favToggle.checked ? 'favorites' : 'all';
      const grid = document.getElementById('popular-movies');
      if (!grid) return;

      let items = [...this.state.movies];
      if (this.state.viewMode === 'favorites') {
        const favorites = StorageService.getFavorites();
        items = items.filter(m =>
          favorites.some(f => f.id === m.id && f.type === 'movie')
        );
      }

      grid.innerHTML = '';
      items.forEach(movie => {
        const card = MovieCard.create(
          movie,
          'movie',
          () => this.showModal(movie, 'movie'),
          () => this.toggleFavorite(movie.id, 'movie')
        );
        grid.appendChild(card);
      });
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

  private async handleSearch(query: string): Promise<void> {
    if (!query.trim()) {
      await this.loadCarousel(
        'popular-movies',
        () => ApiService.getPopularMovies(),
        'movie'
      );
      return;
    }

    const grid = document.getElementById('popular-movies');
    if (!grid) return;

    grid.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      grid.appendChild(MovieCard.createSkeleton());
    }

    try {
      const response = await ApiService.search(query);
      this.state.movies = response.results;
      grid.innerHTML = '';

      if (response.results.length === 0) {
        grid.innerHTML = `
          <div class="empty-state">
            <p>Aucun film trouvé pour "${query}" 😕</p>
          </div>
        `;
        return;
      }

      response.results.forEach(movie => {
        const card = MovieCard.create(
          movie,
          'movie',
          () => this.showModal(movie, 'movie'),
          () => this.toggleFavorite(movie.id, 'movie')
        );
        grid.appendChild(card);
      });

      this.stats?.render(this.state.movies);
    } catch {
      grid.innerHTML = `
        <div class="error-state">
          <p>⚠️ Erreur lors de la recherche</p>
        </div>
      `;
    }
  }
}

const app = new App();
app.init().catch(console.error);