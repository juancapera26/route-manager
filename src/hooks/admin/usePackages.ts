//usePackages.ts
import { useEffect, useState } from "react";
import { PackagesService } from "../../global/services/packageService";
import { 
  Paquete, 
  PaqueteCreate, 
  PaqueteUpdate,
  AsignarPaqueteDTO 
} from "../../global/types/paquete.types";

//hook para paquetes

// Hook para manejar paquetes y llamados del servicio
export function usePackages() {
  const [packages, setPackages] = useState<Paquete[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [availableRoutes, setAvailableRoutes] = useState<any[]>([]);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const data = await PackagesService.getAll();
      setPackages(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const createPackage = async (newPaquete: PaqueteCreate) => {
    try {
      const created = await PackagesService.create(newPaquete);
      setPackages((prev) => [...prev, created]);
      return created;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  const updatePackage = async (id: number, paquete: PaqueteUpdate) => {
    try {
      const updated = await PackagesService.update(id, paquete);
      setPackages((prev) =>
        prev.map((p) => (p.id_paquete === id ? updated : p))
      );
      return updated;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  const deletePackage = async (id: number) => {
    try {
      await PackagesService.delete(id);
      setPackages((prev) => prev.filter((p) => p.id_paquete !== id));
      return true;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  const changeStatus = async (id: number, estado: string) => {
    try {
      const updated = await PackagesService.cambiarEstado(id, estado);
      setPackages((prev) =>
        prev.map((p) => (p.id_paquete === id ? updated : p))
      );
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };


  const assignPackageToRoute = async (
    id: number, 
    dto: AsignarPaqueteDTO
  ): Promise<Paquete> => {
    try {
      setLoading(true);
      const updated = await PackagesService.asignar(id, dto);
      
      setPackages((prev) =>
        prev.map((p) => (p.id_paquete === id ? updated : p))
      );
      
      return updated;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reassignPackage = async (
    id: number, 
    dto: AsignarPaqueteDTO
  ): Promise<Paquete> => {
    try {
      setLoading(true);
      const updated = await PackagesService.reasignar(id, dto);
      
      setPackages((prev) =>
        prev.map((p) => (p.id_paquete === id ? updated : p))
      );
      
      return updated;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelAssignment = async (id: number): Promise<Paquete> => {
    try {
      setLoading(true);
      const updated = await PackagesService.cancelarAsignacion(id);
      
      setPackages((prev) =>
        prev.map((p) => (p.id_paquete === id ? updated : p))
      );
      
      return updated;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableRoutes = async () => {
    try {
      setLoading(true);
      const routes = await PackagesService.getRutasDisponibles();
      setAvailableRoutes(routes);
      return routes;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchPackagesByRoute = async (id_ruta: number): Promise<Paquete[]> => {
    try {
      setLoading(true);
      const data = await PackagesService.getPaquetesByRuta(id_ruta);
      return data;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchPackagesByStatus = async (estado: string): Promise<Paquete[]> => {
    try {
      setLoading(true);
      const data = await PackagesService.getPaquetesByEstado(estado);
      return data;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };


  return {
    packages,
    loading,
    error,
    availableRoutes, 

    fetchPackages,
    createPackage,
    updatePackage,
    deletePackage,
    changeStatus,

    assignPackageToRoute,
    reassignPackage,
    cancelAssignment,
    fetchAvailableRoutes,
    fetchPackagesByRoute,
    fetchPackagesByStatus,
  };
}