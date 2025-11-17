// src/services/NotificationService.ts

import { io, Socket } from 'socket.io-client';

// 🔔 Estructura de la notificación que llega del backend
export interface NotificationPayload {
  type: 'ruta_completada' | 'ruta_fallida' | 'ruta_asignada';
  title: string;
  message: string;
  data?: {
    id_ruta?: number;
    cod_manifiesto?: string;
    estado_ruta?: string;
    id_conductor?: number;
  };
  timestamp: Date;
}

class NotificationService {
  private socket: Socket | null = null;
  private isConnected = false;
  private listeners: Map<string, Set<(payload: NotificationPayload) => void>> = new Map();

  /**
   * Conecta al servidor WebSocket
   * @param userId - ID del usuario logueado
   * @param userRole - Rol del usuario ('Admin' o 'Conductor')
   */
  connect(userId: number, userRole: string): void {
    if (this.socket?.connected) {
      console.log('🔌 WebSocket ya está conectado');
      return;
    }

    // 🌐 URL del backend - CAMBIA ESTO según tu configuración
    const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    console.log(`🔌 Conectando WebSocket para usuario ${userId} (${userRole})...`);

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // =========================================
    // EVENTOS DE CONEXIÓN
    // =========================================
    
    this.socket.on('connect', () => {
      console.log('✅ WebSocket conectado:', this.socket?.id);
      this.isConnected = true;

      // Registrar usuario al conectar
      this.socket?.emit('register', { userId, role: userRole });
      console.log(`📝 Usuario registrado: ID ${userId}, Rol ${userRole}`);
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('❌ WebSocket desconectado:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔴 Error de conexión WebSocket:', error.message);
    });

    // =========================================
    // EVENTO DE NOTIFICACIONES
    // =========================================
    
    this.socket.on('notification', (payload: NotificationPayload) => {
      console.log('🔔 Notificación recibida:', payload);
      
      // Emitir a todos los listeners suscritos
      const listeners = this.listeners.get('notification');
      if (listeners) {
        listeners.forEach(callback => callback(payload));
      }
    });
  }

  /**
   * Desconecta del servidor WebSocket
   */
  disconnect(): void {
    if (this.socket) {
      console.log('🔌 Desconectando WebSocket...');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
    }
  }

  /**
   * Suscribe un callback para escuchar notificaciones
   * @param callback - Función que se ejecuta al recibir una notificación
   * @returns Función para cancelar la suscripción
   */
  subscribe(callback: (payload: NotificationPayload) => void): () => void {
    if (!this.listeners.has('notification')) {
      this.listeners.set('notification', new Set());
    }

    const listeners = this.listeners.get('notification')!;
    listeners.add(callback);

    console.log('👂 Listener suscrito, total:', listeners.size);

    // Retornar función de cleanup
    return () => {
      listeners.delete(callback);
      console.log('🔇 Listener eliminado, total:', listeners.size);
    };
  }

  /**
   * Verifica si el WebSocket está conectado
   */
  getConnectionStatus(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  /**
   * Obtiene el ID del socket actual
   */
  getSocketId(): string | undefined {
    return this.socket?.id;
  }
}

// 🎯 Exportar instancia única (Singleton)
export const notificationService = new NotificationService();