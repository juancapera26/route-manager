import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";

const storage = getStorage();

/**
 * Sube una imagen en base64 al Storage de Firebase.
 * @param base64Image Imagen capturada (dataURL)
 * @param driverId ID del conductor
 * @returns URL pública de la imagen
 */
export const uploadScreenshot = async (
  base64Image: string,
  driverId: number
) => {
  try {
    const imageRef = ref(storage, `screenshots/${driverId}/${Date.now()}.png`);
    await uploadString(imageRef, base64Image, "data_url");
    const url = await getDownloadURL(imageRef);
    console.log("✅ Imagen subida a Firebase:", url);
    return url;
  } catch (error) {
    console.error("❌ Error al subir screenshot:", error);
    return null;
  }
};
