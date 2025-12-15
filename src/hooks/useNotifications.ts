// src/hooks/useNotifications.ts

import { useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { notificationService, NotificationPayload } from '../global/services/notificationService';

interface UseNotificationsReturn {
  notifications: NotificationPayload[];
  unreadCount: number;
  isConnected: boolean;
  markAsRead: (index: number) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  removeNotification: (index: number) => void;
}

/**
 * Hook para manejar notificaciones en tiempo real
 * Se conecta automáticamente cuando hay un usuario autenticado
 */
export const useNotifications = (
  userId: number | null,
  userRole: string | null
): UseNotificationsReturn => {
  // 🔄 Cargar notificaciones desde localStorage al iniciar
  const [notifications, setNotifications] = useState<NotificationPayload[]>(() => {
    if (!userId) return [];
    
    try {
      const saved = localStorage.getItem(`notifications_${userId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log(`📦 Notificaciones cargadas desde localStorage:`, parsed.length);
        return parsed;
      }
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    }
    return [];
  });

  const [unreadCount, setUnreadCount] = useState<number>(() => {
    if (!userId) return 0;
    
    try {
      const saved = localStorage.getItem(`notifications_${userId}`);
      if (saved) {
        const notifications: NotificationPayload[] = JSON.parse(saved);
        const count = notifications.filter((n) => !n.read).length;
        console.log(`📊 Notificaciones no leídas: ${count}`);
        return count;
      }
    } catch (error) {
      console.error('Error al cargar contador:', error);
    }
    return 0;
  });

  const [isConnected, setIsConnected] = useState(false);
  const hasConnectedRef = useRef(false);

  // 🔄 Efecto para cargar notificaciones cuando cambia el userId
  useEffect(() => {
    if (!userId) return;

    console.log(`🔄 Usuario ${userId} detectado, cargando notificaciones...`);
    
    try {
      const saved = localStorage.getItem(`notifications_${userId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setNotifications(parsed);
        setUnreadCount(parsed.filter((n: NotificationPayload) => !n.read).length);
        console.log(`✅ ${parsed.length} notificaciones restauradas`);
      }
    } catch (error) {
      console.error('Error al restaurar notificaciones:', error);
    }
  }, [userId]);

  // 🔄 Guardar notificaciones en localStorage cada vez que cambien
  useEffect(() => {
    if (!userId || notifications.length === 0) return;
    
    try {
      localStorage.setItem(`notifications_${userId}`, JSON.stringify(notifications));
      console.log(`💾 ${notifications.length} notificaciones guardadas en localStorage`);
    } catch (error) {
      console.error('Error al guardar notificaciones:', error);
    }
  }, [notifications, userId]);

  // =========================================
  // CONECTAR AL WEBSOCKET
  // =========================================
  useEffect(() => {
    // 🔍 DEBUG: Ver qué valores llegan
    console.log('🔍 useNotifications - userId:', userId, 'userRole:', userRole, 'tipo:', typeof userRole);
    
    // Solo conectar si tenemos userId y role, y no nos hemos conectado antes
    if (!userId || !userRole || hasConnectedRef.current) {
      console.log('⚠️ No se conecta - falta userId o role, o ya está conectado');
      return;
    }

    console.log('🔌 Iniciando conexión WebSocket...');
    
    // Mapear el role numérico a string
    const roleMap: { [key: string]: string } = {
      '1': 'Admin',
      '2': 'Conductor',
    };
    
    const roleName = roleMap[userRole] || userRole;
    console.log('🎭 Rol mapeado:', roleName);

    // Conectar al WebSocket
    notificationService.connect(userId, roleName);
    hasConnectedRef.current = true;
    setIsConnected(true);
    console.log('✅ Conexión WebSocket iniciada');

    // Cleanup al desmontar
    return () => {
      console.log('🔌 Desconectando WebSocket...');
      notificationService.disconnect();
      hasConnectedRef.current = false;
      setIsConnected(false);
    };
  }, [userId, userRole]);

  // =========================================
  // ESCUCHAR NOTIFICACIONES
  // =========================================
  useEffect(() => {
    if (!userId || !userRole) return;

    const unsubscribe = notificationService.subscribe((payload: NotificationPayload) => {
      console.log('🔔 Nueva notificación:', payload);

      // Agregar notificación al estado
      setNotifications(prev => {
        const newNotifications = [payload, ...prev];
        
        // 🔄 Guardar en localStorage inmediatamente
        try {
          localStorage.setItem(`notifications_${userId}`, JSON.stringify(newNotifications));
        } catch (error) {
          console.error('Error al guardar notificaciones:', error);
        }
        
        return newNotifications;
      });
      
      setUnreadCount(prev => prev + 1);

      // Mostrar toast según el tipo
      const toastConfig = {
        duration: 5000, // 👈 Cambia aquí: 8 segundos (8000ms)
        position: 'top-right' as const,
      };

      switch (payload.type) {
        case 'ruta_asignada':
          toast.success(payload.title, {
            description: payload.message,
            ...toastConfig,
          });
          // Reproducir sonido (opcional)
          playNotificationSound();
          break;

        case 'ruta_completada':
          toast.success(payload.title, {
            description: payload.message,
            ...toastConfig,
          });
          playNotificationSound();
          break;

        case 'ruta_fallida':
          toast.error(payload.title, {
            description: payload.message,
            ...toastConfig,
          });
          playNotificationSound();
          break;

        case 'reporte_creado':
          toast.warning(payload.title, {
            description: payload.message,
            ...toastConfig,
          });
          playNotificationSound();
          break;

        default:
          toast.info(payload.title, {
            description: payload.message,
            ...toastConfig,
          });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [userId, userRole]);

  // =========================================
  // FUNCIONES DE MANEJO
  // =========================================

  const markAsRead = useCallback((index: number) => {
    setNotifications((prev: NotificationPayload[]) => {
      const updated = [...prev];
      if (updated[index] && !updated[index].read) {
        updated[index] = { ...updated[index], read: true };
        setUnreadCount((count: number) => Math.max(0, count - 1));
      }
      return updated;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev: NotificationPayload[]) =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    
    // 🔄 Limpiar también de localStorage
    if (userId) {
      try {
        localStorage.removeItem(`notifications_${userId}`);
      } catch (error) {
        console.error('Error al limpiar notificaciones:', error);
      }
    }
  }, [userId]);

  const removeNotification = useCallback((index: number) => {
    setNotifications((prev: NotificationPayload[]) => {
      const updated = [...prev];
      const removed = updated.splice(index, 1)[0];
      if (removed && !removed.read) {
        setUnreadCount((count: number) => Math.max(0, count - 1));
      }
      return updated;
    });
  }, []);

  // =========================================
  // SONIDO DE NOTIFICACIÓN (OPCIONAL)
  // =========================================
  const playNotificationSound = () => {
    try {
      // Usa el sonido predeterminado del navegador
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBCR3yPLaizsIHWS46+OgTA0OVqzn77BbGAg+ltryxH0pBSh+zPLTgjMIGGS55+iVRwoUXrXp7aNQFApEnenywW4aCz2P1vPMfiwFJ3/M8dCCMwgbaLnr45ZJCxNct+jtolITC0Se6PKySBcHPJDV88F7LQURbsjw0YIxCBlpuevhlUYKE12z6++kXBcKQp/p7qxZHQU1gtrs2q5xGwYvdMrw14A4CBxsuenmnU8LFGWv5/G7eC8DLITJ79WCNAkaa7vs3pdJCxNdsurul04NCT+R1fO+dysFKX7M8tWEOwgbabbq34xFFg1WqeXvsksiCy+EzPHUhTQIGGi56+SbURALVqnm77JQHAc4j9Xy0H8rBiyCzvHaizsJHGO36Nx8OwU7i9Xz0II0CBxqtenomk0MDlam5e6vXRgMOo3V78R4LgQnfc3y0oc5CBtotO3elUcLElyx5/CsXyMEPY/W8sp/LgUpfczy1YU4CBtotO7fm00PClao5e+0TRgMOo7V8M1+LgYnfs3y04c5BxtotO7blEoLEluz6O+uWh0FOJDWy8B6LQUofc3y1YU4CBtnvO7fmEwME1ao5vCwWRgMOo/V8s1+LwYofc3y04g4BxpotO/blUwME1eo5u+uWBsGOJDW88p/LgUrfszyy4U2CBlotO7ekEsODlWp5u6yVxoMNpLU88Z+LQUqf83y04c5BxlotO7ekEkPDles5+6xWBsGOpLW88V/LgYqfszyy4U2CBlotO3ej0oOD1ap5u+xWBoGOpLV88Z/LgYqf83yzoU2CBpptO7ej0kND1ep5u+xWhkFOpPV88Z+LQUpfsry04U3CBpotO3ej0kOD1ep5+6yWBkGOpPW8sZ+LgUqf83y1oU2CBpotu3ej0kODlas5+6xWRkGOpHW88Z+LgYrf83y1oU3CBtptO3ej0kODlap5+6xWBgHOpHW88Z+LQUpf83y1oU4CBtptO3ej0kNDlas5+6xWBkGOpHW8sZ+LgYqf83y1oU3CBpptO3ej0kODlas5+6xWRkGOpHW88Z+LgYqf83y1oU3CBpptO3ej0kODlap5+6xWRkGOpHW88Z+LgYqf83y1oU3CBpptO3ej0kODlas5+6xWRkGOpHW88Z+LgYqf83y1oU3CBpptO3ej0kODlas5+6xWRkGOpHW88Z+LgYqf83y1oU3CBpptO3ej0kODlas5+6xWRkGOpHW88Z+LgYqf83y1oU3CBpptO3ej0kODlas5+6xWRkGOpHW88Z+LgYqf83y1oU3CBpptO3ej0kODlas5+6xWRkGOpHW88Z+LgYqf83y1oU3CBpptO3ej0kODlas5+6xWRkGOpHW88Z+LgYqf83y1oU3CBpptO3ej0kODlas5+6xWRkGOpHW88Z+LgYqf83y1oU3CBpptO3ej0kODlas5+6xWRkGOpHW88Z+LgYqf83y1oU3CBpptO3ej0kODlas5+6xWRkGOpHW88Z+LgYqf83y1oU3CBpptO3ej0kODlas5+6xWRkGOpHW88Z+LgYqf83y1oU3CBpptO3ej0kODlas5+6xWRkGOpHW88Z+LgYqf83y1oU3CBpptO3ej0k=');
      audio.volume = 0.3;
      audio.play().catch(err => console.log('No se pudo reproducir el sonido:', err));
    } catch (err) {
      console.log('Error al reproducir sonido:', err);
    }
  };

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    clearAll,
    removeNotification,
  };
};

// Tipos adicionales para TypeScript
declare module '../global/services/notificationService' {
  interface NotificationPayload {
    read?: boolean;
  }
}