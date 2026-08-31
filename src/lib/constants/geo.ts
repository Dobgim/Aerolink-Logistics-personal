import { countryCoordinates } from "./countries";

export interface CityGeo {
  city: string;
  lat: number;
  lng: number;
  /** Smaller towns served from this city hub. */
  towns?: string[];
}

export interface CountryGeo {
  code: string;
  country: string;
  flag: string;
  hub: string;
  transit: string;
  cities: CityGeo[];
}

export const EUROPE: CountryGeo[] = [
  {
    code: "FR",
    country: "France",
    flag: "🇫🇷",
    hub: "Paris–Roissy Gateway",
    transit: "2–4 days",
    cities: [
      { city: "Paris", lat: 48.8566, lng: 2.3522, towns: ["Versailles", "Saint-Denis", "Boulogne-Billancourt"] },
      { city: "Marseille", lat: 43.2965, lng: 5.3698, towns: ["Aix-en-Provence", "Aubagne"] },
      { city: "Lyon", lat: 45.764, lng: 4.8357, towns: ["Villeurbanne", "Vénissieux"] },
      { city: "Toulouse", lat: 43.6047, lng: 1.4442, towns: ["Blagnac", "Colomiers"] },
      { city: "Nice", lat: 43.7102, lng: 7.262, towns: ["Antibes", "Cannes"] },
      { city: "Bordeaux", lat: 44.8378, lng: -0.5792, towns: ["Mérignac", "Pessac"] },
      { city: "Lille", lat: 50.6292, lng: 3.0573, towns: ["Roubaix", "Tourcoing"] },
      { city: "Nantes", lat: 47.2184, lng: -1.5536, towns: ["Saint-Herblain", "Rezé"] },
      { city: "Strasbourg", lat: 48.5734, lng: 7.7521, towns: ["Schiltigheim", "Illkirch"] },
    ],
  },
  {
    code: "GB",
    country: "United Kingdom",
    flag: "🇬🇧",
    hub: "London Heathrow Gateway",
    transit: "2–4 days",
    cities: [
      { city: "London", lat: 51.5072, lng: -0.1276, towns: ["Croydon", "Watford", "Slough"] },
      { city: "Manchester", lat: 53.4808, lng: -2.2426, towns: ["Salford", "Stockport"] },
      { city: "Birmingham", lat: 52.4862, lng: -1.8904, towns: ["Solihull", "Wolverhampton"] },
      { city: "Liverpool", lat: 53.4084, lng: -2.9916, towns: ["Birkenhead", "Bootle"] },
      { city: "Leeds", lat: 53.8008, lng: -1.5491, towns: ["Bradford", "Wakefield"] },
      { city: "Bristol", lat: 51.4545, lng: -2.5879, towns: ["Bath", "Weston-super-Mare"] },
      { city: "Glasgow", lat: 55.8642, lng: -4.2518, towns: ["Paisley", "Clydebank"] },
      { city: "Edinburgh", lat: 55.9533, lng: -3.1883, towns: ["Leith", "Livingston"] },
    ],
  },
  {
    code: "DE",
    country: "Germany",
    flag: "🇩🇪",
    hub: "Frankfurt Air Cargo Hub",
    transit: "2–4 days",
    cities: [
      { city: "Berlin", lat: 52.52, lng: 13.405, towns: ["Potsdam", "Spandau"] },
      { city: "Munich", lat: 48.1351, lng: 11.582, towns: ["Garching", "Freising"] },
      { city: "Hamburg", lat: 53.5511, lng: 9.9937, towns: ["Altona", "Harburg"] },
      { city: "Frankfurt", lat: 50.1109, lng: 8.6821, towns: ["Offenbach", "Hanau"] },
      { city: "Cologne", lat: 50.9375, lng: 6.9603, towns: ["Leverkusen", "Bonn"] },
      { city: "Stuttgart", lat: 48.7758, lng: 9.1829, towns: ["Ludwigsburg", "Esslingen"] },
      { city: "Düsseldorf", lat: 51.2277, lng: 6.7735, towns: ["Neuss", "Duisburg"] },
    ],
  },
  {
    code: "BE",
    country: "Belgium",
    flag: "🇧🇪",
    hub: "Brussels–Zaventem Gateway",
    transit: "2–3 days",
    cities: [
      { city: "Brussels", lat: 50.8503, lng: 4.3517, towns: ["Zaventem", "Vilvoorde"] },
      { city: "Antwerp", lat: 51.2194, lng: 4.4025, towns: ["Mechelen", "Lier"] },
      { city: "Ghent", lat: 51.0543, lng: 3.7174, towns: ["Deinze", "Lokeren"] },
      { city: "Bruges", lat: 51.2093, lng: 3.2247, towns: ["Ostend", "Knokke"] },
      { city: "Liège", lat: 50.6326, lng: 5.5797, towns: ["Seraing", "Verviers"] },
    ],
  },
  {
    code: "NL",
    country: "Netherlands",
    flag: "🇳🇱",
    hub: "Amsterdam–Schiphol Gateway",
    transit: "2–3 days",
    cities: [
      { city: "Amsterdam", lat: 52.3676, lng: 4.9041, towns: ["Haarlem", "Amstelveen"] },
      { city: "Rotterdam", lat: 51.9244, lng: 4.4777, towns: ["Schiedam", "Delft"] },
      { city: "The Hague", lat: 52.0705, lng: 4.3007, towns: ["Zoetermeer", "Rijswijk"] },
      { city: "Utrecht", lat: 52.0907, lng: 5.1214, towns: ["Amersfoort", "Nieuwegein"] },
      { city: "Eindhoven", lat: 51.4416, lng: 5.4697, towns: ["Helmond", "Veldhoven"] },
    ],
  },
  {
    code: "IT",
    country: "Italy",
    flag: "🇮🇹",
    hub: "Milan–Malpensa Gateway",
    transit: "3–5 days",
    cities: [
      { city: "Rome", lat: 41.9028, lng: 12.4964, towns: ["Fiumicino", "Tivoli"] },
      { city: "Milan", lat: 45.4642, lng: 9.19, towns: ["Monza", "Bergamo"] },
      { city: "Naples", lat: 40.8518, lng: 14.2681, towns: ["Pozzuoli", "Caserta"] },
      { city: "Turin", lat: 45.0703, lng: 7.6869, towns: ["Moncalieri", "Rivoli"] },
      { city: "Bologna", lat: 44.4949, lng: 11.3426, towns: ["Modena", "Imola"] },
      { city: "Florence", lat: 43.7696, lng: 11.2558, towns: ["Prato", "Empoli"] },
    ],
  },
  {
    code: "ES",
    country: "Spain",
    flag: "🇪🇸",
    hub: "Madrid–Barajas Gateway",
    transit: "3–5 days",
    cities: [
      { city: "Madrid", lat: 40.4168, lng: -3.7038, towns: ["Getafe", "Alcalá de Henares"] },
      { city: "Barcelona", lat: 41.3874, lng: 2.1686, towns: ["Badalona", "Sabadell"] },
      { city: "Valencia", lat: 39.4699, lng: -0.3763, towns: ["Torrent", "Paterna"] },
      { city: "Seville", lat: 37.3891, lng: -5.9845, towns: ["Dos Hermanas", "Alcalá de Guadaíra"] },
      { city: "Málaga", lat: 36.7213, lng: -4.4214, towns: ["Marbella", "Torremolinos"] },
      { city: "Bilbao", lat: 43.263, lng: -2.935, towns: ["Barakaldo", "Getxo"] },
    ],
  },
  {
    code: "PT",
    country: "Portugal",
    flag: "🇵🇹",
    hub: "Lisbon Gateway",
    transit: "3–5 days",
    cities: [
      { city: "Lisbon", lat: 38.7223, lng: -9.1393, towns: ["Sintra", "Cascais"] },
      { city: "Porto", lat: 41.1579, lng: -8.6291, towns: ["Vila Nova de Gaia", "Matosinhos"] },
      { city: "Braga", lat: 41.5454, lng: -8.4265, towns: ["Guimarães", "Barcelos"] },
      { city: "Coimbra", lat: 40.2033, lng: -8.4103, towns: ["Figueira da Foz", "Cantanhede"] },
      { city: "Faro", lat: 37.0194, lng: -7.9304, towns: ["Olhão", "Loulé"] },
    ],
  },
  {
    code: "CH",
    country: "Switzerland",
    flag: "🇨🇭",
    hub: "Zurich Gateway",
    transit: "3–4 days",
    cities: [
      { city: "Zurich", lat: 47.3769, lng: 8.5417, towns: ["Winterthur", "Uster"] },
      { city: "Geneva", lat: 46.2044, lng: 6.1432, towns: ["Carouge", "Meyrin"] },
      { city: "Basel", lat: 47.5596, lng: 7.5886, towns: ["Riehen", "Allschwil"] },
      { city: "Bern", lat: 46.948, lng: 7.4474, towns: ["Thun", "Köniz"] },
      { city: "Lausanne", lat: 46.5197, lng: 6.6323, towns: ["Renens", "Pully"] },
    ],
  },
  {
    code: "IE",
    country: "Ireland",
    flag: "🇮🇪",
    hub: "Dublin Gateway",
    transit: "3–4 days",
    cities: [
      { city: "Dublin", lat: 53.3498, lng: -6.2603, towns: ["Swords", "Dún Laoghaire"] },
      { city: "Cork", lat: 51.8985, lng: -8.4756, towns: ["Ballincollig", "Cobh"] },
      { city: "Limerick", lat: 52.6638, lng: -8.6267, towns: ["Shannon", "Newcastle West"] },
      { city: "Galway", lat: 53.2707, lng: -9.0568, towns: ["Salthill", "Oranmore"] },
    ],
  },
];

/** Domestic markets the network collects from. */
export const ORIGIN_MARKETS: CountryGeo[] = [
  {
    code: "US",
    country: "United States",
    flag: "🇺🇸",
    hub: "New York Gateway",
    transit: "—",
    cities: [
      { city: "New York", lat: 40.7128, lng: -74.006, towns: ["Newark", "Jersey City", "Yonkers"] },
      { city: "Los Angeles", lat: 34.0522, lng: -118.2437, towns: ["Long Beach", "Pasadena"] },
      { city: "Chicago", lat: 41.8781, lng: -87.6298, towns: ["Evanston", "Naperville"] },
      { city: "Houston", lat: 29.7604, lng: -95.3698, towns: ["Pasadena", "Sugar Land"] },
      { city: "Miami", lat: 25.7617, lng: -80.1918, towns: ["Hialeah", "Coral Gables"] },
      { city: "Atlanta", lat: 33.749, lng: -84.388, towns: ["Marietta", "Decatur"] },
      { city: "Dallas", lat: 32.7767, lng: -96.797, towns: ["Irving", "Plano"] },
      { city: "Seattle", lat: 47.6062, lng: -122.3321, towns: ["Bellevue", "Tacoma"] },
      { city: "Boston", lat: 42.3601, lng: -71.0589, towns: ["Cambridge", "Quincy"] },
      { city: "San Francisco", lat: 37.7749, lng: -122.4194, towns: ["Oakland", "Berkeley"] },
    ],
  },
];

export const ALL_MARKETS: CountryGeo[] = [...ORIGIN_MARKETS, ...EUROPE];

const CITY_INDEX = new Map<string, { lat: number; lng: number; country: string }>();
for (const country of ALL_MARKETS) {
  for (const city of country.cities) {
    CITY_INDEX.set(`${city.city.toLowerCase()}|${country.country.toLowerCase()}`, {
      lat: city.lat,
      lng: city.lng,
      country: country.country,
    });
    if (!CITY_INDEX.has(city.city.toLowerCase())) {
      CITY_INDEX.set(city.city.toLowerCase(), {
        lat: city.lat,
        lng: city.lng,
        country: country.country,
      });
    }
  }
}

/** Best-effort coordinate lookup used to place map markers for free-text places. */
export function geocodeCity(
  city?: string | null,
  country?: string | null,
): { lat: number; lng: number } | null {
  if (!city) return null;
  const key = country
    ? `${city.trim().toLowerCase()}|${country.trim().toLowerCase()}`
    : city.trim().toLowerCase();
  const hit = CITY_INDEX.get(key) ?? CITY_INDEX.get(city.trim().toLowerCase());
  if (hit) return { lat: hit.lat, lng: hit.lng };

  /*
   * A shipment can name any city on earth, but the table only knows the ones
   * on the served network. Rather than dropping the point — which would leave
   * the route with a missing end and no distance to travel — fall back to the
   * country itself, so the marker lands in the right place on the map.
   */
  return countryCoordinates(country);
}

export const COUNTRY_NAMES = ALL_MARKETS.map((c) => c.country);

export function citiesForCountry(country: string): CityGeo[] {
  return ALL_MARKETS.find((c) => c.country === country)?.cities ?? [];
}

/** The showcase corridor used by the international network section. */
export const SHOWCASE_ROUTE = [
  { label: "New York", lat: 40.7128, lng: -74.006 },
  { label: "London", lat: 51.5072, lng: -0.1276 },
  { label: "Amsterdam", lat: 52.3676, lng: 4.9041 },
  { label: "Frankfurt", lat: 50.1109, lng: 8.6821 },
  { label: "Milan", lat: 45.4642, lng: 9.19 },
];
