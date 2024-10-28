import { create } from "zustand";

interface PostalLocation {
  postal_code: string;
  city: string;
  state: string;
  country: "AT" | "DE";
}

interface PostalStore {
  recentLocations: PostalLocation[];
  addLocation: (location: PostalLocation) => void;
  findLocations: (
    query: string,
    country: "AT" | "DE",
  ) => Promise<PostalLocation[]>;
}

// Zustand Store für kürzlich verwendete Orte
const usePostalStore = create<PostalStore>((set) => ({
  recentLocations: [],
  addLocation: (location) =>
    set((state) => ({
      recentLocations: [
        location,
        ...state.recentLocations.filter(
          (l) =>
            l.postal_code !== location.postal_code || l.city !== location.city,
        ),
      ].slice(0, 10), // Behalte nur die letzten 10 Einträge
    })),
  findLocations: async (query: string, country: "AT" | "DE") => {
    // Implementierung in der usePostalService Hook
    return [];
  },
}));

// RegEx Patterns für Postleitzahlen
const POSTAL_PATTERNS = {
  AT: /^[1-9]\d{3}$/, // Österreich: 4 Ziffern, nicht mit 0 beginnend
  DE: /^[0-9]{5}$/, // Deutschland: 5 Ziffern
};

// Cache für API Responses
const API_CACHE = new Map<string, PostalLocation[]>();

export function usePostalService() {
  const { recentLocations, addLocation } = usePostalStore();

  // Validiere Postleitzahl Format
  const isValidPostalCode = (
    postalCode: string,
    country: "AT" | "DE",
  ): boolean => {
    return POSTAL_PATTERNS[country].test(postalCode);
  };

  // Suche nach PLZ oder Stadt
  const findLocations = async (
    query: string,
    country: "AT" | "DE",
    type: "postal_code" | "city" = "postal_code",
  ): Promise<PostalLocation[]> => {
    const cacheKey = `${country}-${query}-${type}`;

    // Prüfe Cache
    if (API_CACHE.has(cacheKey)) {
      return API_CACHE.get(cacheKey)!;
    }

    try {
      // Für Österreich: Nominatim API
      if (country === "AT") {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?country=Austria&${
            type === "postal_code" ? "postalcode" : "city"
          }=${query}&format=json`,
        );
        const data = await response.json();
        console.log(data);

        const locations = data
          .filter((item: any) => item.address?.postcode && item.address?.city)
          .map((item: any) => ({
            postal_code: item.address.postcode,
            city: item.address.city,
            state: item.address.state,
            country: "AT" as const,
          }));

        // Cache Ergebnis
        API_CACHE.set(cacheKey, locations);
        return locations;
      }

      // Für Deutschland: Zippopotam API
      else {
        const response = await fetch(
          `https://api.zippopotam.us/de/${
            type === "postal_code" ? query : "city"
          }`,
        );
        const data = await response.json();

        const locations = Array.isArray(data.places)
          ? data.places.map((place: any) => ({
              postal_code: data["post code"],
              city: place["place name"],
              state: place.state,
              country: "DE" as const,
            }))
          : [];

        // Cache Ergebnis
        API_CACHE.set(cacheKey, locations);
        return locations;
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      return [];
    }
  };

  // PLZ zu Stadt auflösen
  const resolvePostalCode = async (
    postalCode: string,
    country: "AT" | "DE",
  ): Promise<PostalLocation | null> => {
    if (!isValidPostalCode(postalCode, country)) {
      return null;
    }

    const locations = await findLocations(postalCode, country, "postal_code");
    return locations[0] || null;
  };

  // Stadt zu möglichen PLZs auflösen
  const resolveCity = async (
    city: string,
    country: "AT" | "DE",
  ): Promise<PostalLocation[]> => {
    return findLocations(city, country, "city");
  };

  return {
    isValidPostalCode,
    findLocations,
    resolvePostalCode,
    resolveCity,
    recentLocations,
    addLocation,
  };
}
