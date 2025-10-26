
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const novedadService = {
    getAll: async () => {
        const res = await fetch(`${API_URL}/reportes`);
        if (!res.ok) throw new Error("Error al obtener las novedades");
        return await res.json();
    }
};