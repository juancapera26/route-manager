### src/firebase: Aquí se encuentra la configuración de la conexión con Firebase.

- ```firebaseConfig.ts``` - Contiene las llaves de API y la inicialización de los servicios de Firebase (Auth, Firestore, Storage, etc.). Nunca compartas las llaves secretas que puedan estar aquí. Usualmente se cargan desde el archivo .env.