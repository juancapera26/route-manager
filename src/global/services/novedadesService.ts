// services/noveltyService.ts
import { Novelty } from '../types/novedades';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'Error en la petición'
    }));
    throw new Error(error.message || `Error ${response.status}`);
  }
  return response.json();
};

const getAuthHeaders = () => {
  return {
    'Content-Type': 'application/json',
  };
};

export const noveltyService = {
  getAllNovelties: async (): Promise<Novelty[]> => {
    try {
      console.log('🔍 Fetching from:', `${API_URL}/reportes/historial`);
      const response = await fetch(`${API_URL}/reportes/historial`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      const data = await handleResponse(response);
      console.log('✅ Data received:', data);
      console.log('👤 Primera novedad completa:', data[0]);
      if (data[0]?.imagen) {
        console.log('🖼️ Imagen encontrada:', data[0].imagen);
      } else {
        console.log('⚠️ Primera novedad sin imagen');
      }
      return data;
    } catch (error) {
      console.error('❌ Error fetching novelties:', error);
      throw error;
    }
  },

  getNoveltyById: async (id: number): Promise<Novelty> => {
    try {
      console.log('🔍 Fetching novelty by ID:', id);
      const response = await fetch(`${API_URL}/reportes/historial/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      const data = await handleResponse(response);
      console.log('✅ Novelty received:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching novelty:', error);
      throw error;
    }
  },

  deleteNovelty: async (id: number): Promise<void> => {
    try {
      console.log('🗑️ Deleting novelty:', id);
      const response = await fetch(`${API_URL}/reportes/historial/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      await handleResponse(response);
      console.log('✅ Novelty deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting novelty:', error);
      throw error;
    }
  }
};