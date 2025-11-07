// hooks/data/useNovelty.ts
import { useState, useEffect, useCallback } from 'react';
import { noveltyService } from '../../global/services/novedadesService';
import { Novelty } from '../../global/types/novedades';
import { toast } from 'sonner';

// Interprete de novedades

export const useNovelty = () => {
  const [novelties, setNovelties] = useState<Novelty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isDeletingNovelty, setIsDeletingNovelty] = useState(false);

  // Cargar novedades
  const fetchNovelties = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await noveltyService.getAllNovelties();
      setNovelties(data);
    } catch (err) {
      setError(err as Error);
      toast.error('Error al cargar las novedades');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar al montar el componente
  useEffect(() => {
    fetchNovelties();
  }, [fetchNovelties]);

  // Obtener una novedad por ID
  const useNoveltyById = (id: number | null) => {
    const [novelty, setNovelty] = useState<Novelty | null>(null);
    const [isLoadingNovelty, setIsLoadingNovelty] = useState(false);

    useEffect(() => {
      if (!id) return;

      const fetchNovelty = async () => {
        setIsLoadingNovelty(true);
        try {
          const data = await noveltyService.getNoveltyById(id);
          setNovelty(data);
        } catch (err) {
          toast.error('Error al cargar la novedad');
        } finally {
          setIsLoadingNovelty(false);
        }
      };

      fetchNovelty();
    }, [id]);

    return { data: novelty, isLoading: isLoadingNovelty };
  };

  // Eliminar novedad
  const deleteNovelty = async (id: number) => {
    setIsDeletingNovelty(true);
    try {
      await noveltyService.deleteNovelty(id);
      toast.success('Novedad eliminada correctamente');
      // Recargar la lista
      await fetchNovelties();
    } catch (err) {
      toast.error('Error al eliminar la novedad');
      console.error(err);
    } finally {
      setIsDeletingNovelty(false);
    }
  };

  return {
    novelties,
    isLoading,
    error,
    refetch: fetchNovelties,
    useNoveltyById,
    deleteNovelty,
    isDeletingNovelty,
  };
};