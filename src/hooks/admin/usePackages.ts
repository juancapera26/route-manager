//usePackages.ts
import { useEffect, useState } from "react";
import { PackagesService } from "../../global/services/packageService"
import { Paquete,PaqueteCreate, PaqueteUpdate } from "../../global/types/paquete.types";

// Hook para manejar paquetes, ademas este maneja los llamados del servicio
//Cambie los id == string por number

export function usePackages() {
  const [packages, setPackages] = useState<Paquete[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  

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
        prev.map((p) => (p.id_paquete === Number(id) ? updated : p))
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
      setPackages((prev) => prev.filter((p) => p.id_paquete !== Number(id)));
      return true;
    } catch (err) {
      setError((err as Error).message);
      throw err;
      return false;
    }
  };

  const changeStatus = async (id: number, estado: string) => {
    try {
      const updated = await PackagesService.cambiarEstado(id, estado);
      setPackages((prev) =>
        prev.map((p) => (p.id_paquete === Number(id) ? updated : p))
      );
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return {
    packages,
    loading,
    error,
    fetchPackages,
    createPackage,
    updatePackage,
    deletePackage,
    changeStatus,
  };
}
