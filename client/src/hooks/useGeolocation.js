import { useState, useEffect } from "react";

/**
 * Kullanıcının mevcut konumunu alır (Geolocation API)
 */
export function useGeolocation() {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Tarayıcınız konum özelliğini desteklemiyor");
      setLoading(false);
      return;
    }

    const successHandler = (pos) => {
      setPosition({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
      setLoading(false);
    };

    const errorHandler = (err) => {
      switch (err.code) {
        case err.PERMISSION_DENIED:
          setError("Konum izni reddedildi");
          break;
        case err.POSITION_UNAVAILABLE:
          setError("Konum bilgisi alınamadı");
          break;
        case err.TIMEOUT:
          setError("Konum isteği zaman aşımına uğradı");
          break;
        default:
          setError("Bilinmeyen bir hata oluştu");
      }
      // Fallback: Rahva BEÜ Kampüs
      setPosition({ lat: 38.4060, lng: 42.1100 });
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(successHandler, errorHandler, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 dakika cache
    });
  }, []);

  return { position, error, loading };
}
