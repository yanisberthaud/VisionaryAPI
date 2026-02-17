import type { MediaType } from '../types/index';

const FAVORITES_KEY = 'visionary-favorites';

export interface FavoriteItem {
  id: number;
  type: MediaType;
}

export class StorageService {
  // Récupérer tous les favoris
  static getFavorites(): FavoriteItem[] {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        return JSON.parse(stored) as FavoriteItem[];
      }
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
    }
    return [];
  }

  // Ajouter ou retirer un favori
  static toggleFavorite(id: number, type: MediaType): FavoriteItem[] {
    const favorites = this.getFavorites();
    const index = favorites.findIndex(f => f.id === id && f.type === type);

    if (index > -1) {
      // Déjà en favori → on retire
      favorites.splice(index, 1);
    } else {
      // Pas encore en favori → on ajoute
      favorites.push({ id, type });
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return favorites;
  }

  // Vérifier si un élément est en favori
  static isFavorite(id: number, type: MediaType): boolean {
    const favorites = this.getFavorites();
    return favorites.some(f => f.id === id && f.type === type);
  }

  // Compter les favoris
  static getFavoritesCount(): number {
    return this.getFavorites().length;
  }
}