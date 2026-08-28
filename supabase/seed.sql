-- ============================================================================
-- Royal Prime Logistics — demo seed data
-- Run AFTER schema.sql. Safe to re-run: every insert is idempotent.
--
-- Dates are relative to now(), so the seeded network always looks live.
-- ============================================================================

begin;

-- ---------------------------------------------------------------------------
-- Service locations (70 rows)
-- ---------------------------------------------------------------------------
insert into public.locations (country, city, town, latitude, longitude, address, available_services) values
  ('France', 'Paris', 'Versailles', 48.8566, 2.3522, 'Paris–Roissy Gateway — Paris Service Point', ARRAY['express_international', 'standard_international', 'cargo_freight', 'ecommerce', 'business_logistics', 'door_to_door']::shipping_service[]),
  ('France', 'Marseille', 'Aix-en-Provence', 43.2965, 5.3698, 'Paris–Roissy Gateway — Marseille Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('France', 'Lyon', 'Villeurbanne', 45.764, 4.8357, 'Paris–Roissy Gateway — Lyon Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('France', 'Toulouse', 'Blagnac', 43.6047, 1.4442, 'Paris–Roissy Gateway — Toulouse Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('France', 'Nice', 'Antibes', 43.7102, 7.262, 'Paris–Roissy Gateway — Nice Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('France', 'Bordeaux', 'Mérignac', 44.8378, -0.5792, 'Paris–Roissy Gateway — Bordeaux Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('France', 'Lille', 'Roubaix', 50.6292, 3.0573, 'Paris–Roissy Gateway — Lille Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('France', 'Nantes', 'Saint-Herblain', 47.2184, -1.5536, 'Paris–Roissy Gateway — Nantes Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('France', 'Strasbourg', 'Schiltigheim', 48.5734, 7.7521, 'Paris–Roissy Gateway — Strasbourg Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('United Kingdom', 'London', 'Croydon', 51.5072, -0.1276, 'London Heathrow Gateway — London Service Point', ARRAY['express_international', 'standard_international', 'cargo_freight', 'ecommerce', 'business_logistics', 'door_to_door']::shipping_service[]),
  ('United Kingdom', 'Manchester', 'Salford', 53.4808, -2.2426, 'London Heathrow Gateway — Manchester Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('United Kingdom', 'Birmingham', 'Solihull', 52.4862, -1.8904, 'London Heathrow Gateway — Birmingham Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('United Kingdom', 'Liverpool', 'Birkenhead', 53.4084, -2.9916, 'London Heathrow Gateway — Liverpool Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('United Kingdom', 'Leeds', 'Bradford', 53.8008, -1.5491, 'London Heathrow Gateway — Leeds Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('United Kingdom', 'Bristol', 'Bath', 51.4545, -2.5879, 'London Heathrow Gateway — Bristol Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('United Kingdom', 'Glasgow', 'Paisley', 55.8642, -4.2518, 'London Heathrow Gateway — Glasgow Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('United Kingdom', 'Edinburgh', 'Leith', 55.9533, -3.1883, 'London Heathrow Gateway — Edinburgh Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Germany', 'Berlin', 'Potsdam', 52.52, 13.405, 'Frankfurt Air Cargo Hub — Berlin Service Point', ARRAY['express_international', 'standard_international', 'cargo_freight', 'ecommerce', 'business_logistics', 'door_to_door']::shipping_service[]),
  ('Germany', 'Munich', 'Garching', 48.1351, 11.582, 'Frankfurt Air Cargo Hub — Munich Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Germany', 'Hamburg', 'Altona', 53.5511, 9.9937, 'Frankfurt Air Cargo Hub — Hamburg Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Germany', 'Frankfurt', 'Offenbach', 50.1109, 8.6821, 'Frankfurt Air Cargo Hub — Frankfurt Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Germany', 'Cologne', 'Leverkusen', 50.9375, 6.9603, 'Frankfurt Air Cargo Hub — Cologne Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Germany', 'Stuttgart', 'Ludwigsburg', 48.7758, 9.1829, 'Frankfurt Air Cargo Hub — Stuttgart Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Germany', 'Düsseldorf', 'Neuss', 51.2277, 6.7735, 'Frankfurt Air Cargo Hub — Düsseldorf Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Belgium', 'Brussels', 'Zaventem', 50.8503, 4.3517, 'Brussels–Zaventem Gateway — Brussels Service Point', ARRAY['express_international', 'standard_international', 'cargo_freight', 'ecommerce', 'business_logistics', 'door_to_door']::shipping_service[]),
  ('Belgium', 'Antwerp', 'Mechelen', 51.2194, 4.4025, 'Brussels–Zaventem Gateway — Antwerp Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Belgium', 'Ghent', 'Deinze', 51.0543, 3.7174, 'Brussels–Zaventem Gateway — Ghent Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Belgium', 'Bruges', 'Ostend', 51.2093, 3.2247, 'Brussels–Zaventem Gateway — Bruges Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Belgium', 'Liège', 'Seraing', 50.6326, 5.5797, 'Brussels–Zaventem Gateway — Liège Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Netherlands', 'Amsterdam', 'Haarlem', 52.3676, 4.9041, 'Amsterdam–Schiphol Gateway — Amsterdam Service Point', ARRAY['express_international', 'standard_international', 'cargo_freight', 'ecommerce', 'business_logistics', 'door_to_door']::shipping_service[]),
  ('Netherlands', 'Rotterdam', 'Schiedam', 51.9244, 4.4777, 'Amsterdam–Schiphol Gateway — Rotterdam Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Netherlands', 'The Hague', 'Zoetermeer', 52.0705, 4.3007, 'Amsterdam–Schiphol Gateway — The Hague Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Netherlands', 'Utrecht', 'Amersfoort', 52.0907, 5.1214, 'Amsterdam–Schiphol Gateway — Utrecht Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Netherlands', 'Eindhoven', 'Helmond', 51.4416, 5.4697, 'Amsterdam–Schiphol Gateway — Eindhoven Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Italy', 'Rome', 'Fiumicino', 41.9028, 12.4964, 'Milan–Malpensa Gateway — Rome Service Point', ARRAY['express_international', 'standard_international', 'cargo_freight', 'ecommerce', 'business_logistics', 'door_to_door']::shipping_service[]),
  ('Italy', 'Milan', 'Monza', 45.4642, 9.19, 'Milan–Malpensa Gateway — Milan Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Italy', 'Naples', 'Pozzuoli', 40.8518, 14.2681, 'Milan–Malpensa Gateway — Naples Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Italy', 'Turin', 'Moncalieri', 45.0703, 7.6869, 'Milan–Malpensa Gateway — Turin Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Italy', 'Bologna', 'Modena', 44.4949, 11.3426, 'Milan–Malpensa Gateway — Bologna Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Italy', 'Florence', 'Prato', 43.7696, 11.2558, 'Milan–Malpensa Gateway — Florence Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Spain', 'Madrid', 'Getafe', 40.4168, -3.7038, 'Madrid–Barajas Gateway — Madrid Service Point', ARRAY['express_international', 'standard_international', 'cargo_freight', 'ecommerce', 'business_logistics', 'door_to_door']::shipping_service[]),
  ('Spain', 'Barcelona', 'Badalona', 41.3874, 2.1686, 'Madrid–Barajas Gateway — Barcelona Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Spain', 'Valencia', 'Torrent', 39.4699, -0.3763, 'Madrid–Barajas Gateway — Valencia Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Spain', 'Seville', 'Dos Hermanas', 37.3891, -5.9845, 'Madrid–Barajas Gateway — Seville Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Spain', 'Málaga', 'Marbella', 36.7213, -4.4214, 'Madrid–Barajas Gateway — Málaga Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Spain', 'Bilbao', 'Barakaldo', 43.263, -2.935, 'Madrid–Barajas Gateway — Bilbao Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Portugal', 'Lisbon', 'Sintra', 38.7223, -9.1393, 'Lisbon Gateway — Lisbon Service Point', ARRAY['express_international', 'standard_international', 'cargo_freight', 'ecommerce', 'business_logistics', 'door_to_door']::shipping_service[]),
  ('Portugal', 'Porto', 'Vila Nova de Gaia', 41.1579, -8.6291, 'Lisbon Gateway — Porto Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Portugal', 'Braga', 'Guimarães', 41.5454, -8.4265, 'Lisbon Gateway — Braga Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Portugal', 'Coimbra', 'Figueira da Foz', 40.2033, -8.4103, 'Lisbon Gateway — Coimbra Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Portugal', 'Faro', 'Olhão', 37.0194, -7.9304, 'Lisbon Gateway — Faro Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Switzerland', 'Zurich', 'Winterthur', 47.3769, 8.5417, 'Zurich Gateway — Zurich Service Point', ARRAY['express_international', 'standard_international', 'cargo_freight', 'ecommerce', 'business_logistics', 'door_to_door']::shipping_service[]),
  ('Switzerland', 'Geneva', 'Carouge', 46.2044, 6.1432, 'Zurich Gateway — Geneva Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Switzerland', 'Basel', 'Riehen', 47.5596, 7.5886, 'Zurich Gateway — Basel Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Switzerland', 'Bern', 'Thun', 46.948, 7.4474, 'Zurich Gateway — Bern Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Switzerland', 'Lausanne', 'Renens', 46.5197, 6.6323, 'Zurich Gateway — Lausanne Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Ireland', 'Dublin', 'Swords', 53.3498, -6.2603, 'Dublin Gateway — Dublin Service Point', ARRAY['express_international', 'standard_international', 'cargo_freight', 'ecommerce', 'business_logistics', 'door_to_door']::shipping_service[]),
  ('Ireland', 'Cork', 'Ballincollig', 51.8985, -8.4756, 'Dublin Gateway — Cork Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Ireland', 'Limerick', 'Shannon', 52.6638, -8.6267, 'Dublin Gateway — Limerick Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('Ireland', 'Galway', 'Salthill', 53.2707, -9.0568, 'Dublin Gateway — Galway Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('United States', 'New York', 'Newark', 40.7128, -74.006, 'New York Gateway — New York Service Point', ARRAY['express_international', 'standard_international', 'cargo_freight', 'ecommerce', 'business_logistics', 'door_to_door']::shipping_service[]),
  ('United States', 'Los Angeles', 'Long Beach', 34.0522, -118.2437, 'New York Gateway — Los Angeles Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('United States', 'Chicago', 'Evanston', 41.8781, -87.6298, 'New York Gateway — Chicago Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('United States', 'Houston', 'Pasadena', 29.7604, -95.3698, 'New York Gateway — Houston Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('United States', 'Miami', 'Hialeah', 25.7617, -80.1918, 'New York Gateway — Miami Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('United States', 'Atlanta', 'Marietta', 33.749, -84.388, 'New York Gateway — Atlanta Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('United States', 'Dallas', 'Irving', 32.7767, -96.797, 'New York Gateway — Dallas Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('United States', 'Seattle', 'Bellevue', 47.6062, -122.3321, 'New York Gateway — Seattle Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('United States', 'Boston', 'Cambridge', 42.3601, -71.0589, 'New York Gateway — Boston Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[]),
  ('United States', 'San Francisco', 'Oakland', 37.7749, -122.4194, 'New York Gateway — San Francisco Service Point', ARRAY['express_international', 'standard_international', 'door_to_door']::shipping_service[])
on conflict (country, city, address) do nothing;

-- ---------------------------------------------------------------------------
-- Shipments (12 rows)
-- ---------------------------------------------------------------------------
insert into public.shipments (
  tracking_number, sender_name, sender_email, sender_phone,
  receiver_name, receiver_email, receiver_phone,
  origin_country, origin_city, destination_country, destination_city,
  package_type, weight, packages, shipping_service, status,
  current_location, latitude, longitude, estimated_delivery, created_at, updated_at
) values
  ('RPL-2026-845276', 'Lone Star Agro', 'sales@lonestaragro.example', '+1 (214) 555-0159',
   'Marta Silva', 'marta.silva@example.com', '+351 912 345 678',
   'United States', 'Dallas', 'Portugal', 'Lisbon',
   'pallet', 410, 8, 'cargo_freight', 'pending',
   null, null, null, (date_trunc('day', now()) + interval '9 days' + interval '17 hours'), (date_trunc('day', now()) + interval '0 days' + interval '8 hours'), (date_trunc('day', now()) + interval '0 days' + interval '12 hours')),
  ('RPL-2026-728104', 'Marcus Delaney', 'marcus.delaney@example.com', '+1 (212) 555-0136',
   'Sean O''Connor', 'sean.oconnor@example.com', '+353 85 123 4567',
   'United States', 'New York', 'Ireland', 'Dublin',
   'fragile', 9.7, 2, 'door_to_door', 'picked_up',
   'New York, United States', 40.7128, -74.006, (date_trunc('day', now()) + interval '7 days' + interval '17 hours'), (date_trunc('day', now()) + interval '-1 days' + interval '8 hours'), (date_trunc('day', now()) + interval '0 days' + interval '12 hours')),
  ('RPL-2026-664219', 'Iberia Wine Co.', 'export@iberiawine.example', '+34 954 22 11 00',
   'Julien Girard', 'julien.girard@example.com', '+33 6 55 90 12 08',
   'Spain', 'Seville', 'France', 'Bordeaux',
   'fragile', 64, 5, 'standard_international', 'in_transit',
   'Bilbao, Spain', 43.263, -2.935, (date_trunc('day', now()) + interval '3 days' + interval '17 hours'), (date_trunc('day', now()) + interval '-2 days' + interval '8 hours'), (date_trunc('day', now()) + interval '0 days' + interval '12 hours')),
  ('RPL-2026-619355', 'Beacon Coffee Roasters', 'export@beaconcoffee.example', '+1 (617) 555-0182',
   'Elise Janssens', 'elise.janssens@example.com', '+32 470 55 66 77',
   'United States', 'Boston', 'Belgium', 'Antwerp',
   'freight', 1250, 18, 'business_logistics', 'in_transit',
   'Brussels, Belgium', 50.8503, 4.3517, (date_trunc('day', now()) + interval '5 days' + interval '17 hours'), (date_trunc('day', now()) + interval '-3 days' + interval '8 hours'), (date_trunc('day', now()) + interval '-1 days' + interval '12 hours')),
  ('RPL-2026-472018', 'Nova Commerce', 'ship@novacommerce.example', '+1 (646) 555-0175',
   'Diego Fernández', 'diego.fernandez@example.com', '+34 611 22 33 44',
   'United States', 'New York', 'Spain', 'Madrid',
   'parcel', 3.1, 1, 'ecommerce', 'in_transit',
   'Madrid, Spain', 40.4168, -3.7038, (date_trunc('day', now()) + interval '4 days' + interval '17 hours'), (date_trunc('day', now()) + interval '-4 days' + interval '8 hours'), (date_trunc('day', now()) + interval '-2 days' + interval '12 hours')),
  ('RPL-2026-983456', 'Daniel Whitfield', 'daniel.whitfield@example.com', '+1 (212) 555-0117',
   'Camille Moreau', 'camille.moreau@example.com', '+33 6 12 88 40 21',
   'United States', 'New York', 'France', 'Paris',
   'parcel', 12.4, 3, 'express_international', 'in_transit',
   'Lyon, France', 45.764, 4.8357, (date_trunc('day', now()) + interval '6 days' + interval '17 hours'), (date_trunc('day', now()) + interval '-5 days' + interval '8 hours'), (date_trunc('day', now()) + interval '-3 days' + interval '12 hours')),
  ('RPL-2026-550193', 'Atlas Textiles Inc.', 'export@atlastextiles.example', '+1 (212) 555-0193',
   'Sofia Rossi', 'sofia.rossi@example.com', '+39 340 118 2277',
   'United States', 'New York', 'Italy', 'Milan',
   'pallet', 240, 4, 'cargo_freight', 'customs',
   'Milan, Italy', 45.4642, 9.19, (date_trunc('day', now()) + interval '3 days' + interval '17 hours'), (date_trunc('day', now()) + interval '-6 days' + interval '8 hours'), (date_trunc('day', now()) + interval '-4 days' + interval '12 hours')),
  ('RPL-2026-206741', 'Rachel Adeyemi', 'rachel.adeyemi@example.com', '+1 (404) 555-0148',
   'Lukas Weber', 'lukas.weber@example.com', '+49 151 2233 4455',
   'United States', 'Atlanta', 'Germany', 'Berlin',
   'parcel', 6.2, 2, 'standard_international', 'out_for_delivery',
   'Berlin, Germany', 52.52, 13.405, (date_trunc('day', now()) + interval '0 days' + interval '17 hours'), (date_trunc('day', now()) + interval '-7 days' + interval '8 hours'), (date_trunc('day', now()) + interval '-5 days' + interval '12 hours')),
  ('RPL-2026-338920', 'Harborline Seafoods', 'logistics@harborlineseafoods.example', '+1 (617) 555-0129',
   'Anne de Vries', 'anne.devries@example.com', '+31 6 2244 8899',
   'United States', 'New York', 'Netherlands', 'Rotterdam',
   'perishable', 88.5, 6, 'cargo_freight', 'delayed',
   'Amsterdam, Netherlands', 52.3676, 4.9041, (date_trunc('day', now()) + interval '2 days' + interval '17 hours'), (date_trunc('day', now()) + interval '-9 days' + interval '8 hours'), (date_trunc('day', now()) + interval '-7 days' + interval '12 hours')),
  ('RPL-2026-901488', 'Helvetia Parts AG', 'dispatch@helvetiaparts.example', '+41 44 500 12 34',
   'Thomas Keller', 'thomas.keller@example.com', '+41 79 555 22 11',
   'Switzerland', 'Zurich', 'France', 'Lyon',
   'parcel', 15.6, 3, 'express_international', 'delivered',
   'Lyon, France', 45.764, 4.8357, (date_trunc('day', now()) + interval '-6 days' + interval '17 hours'), (date_trunc('day', now()) + interval '-10 days' + interval '8 hours'), (date_trunc('day', now()) + interval '-8 days' + interval '12 hours')),
  ('RPL-2026-114872', 'Brightline Logistics LLC', 'ops@brightlinelogistics.example', '+1 (312) 555-0164',
   'Oliver Bennett', 'oliver.bennett@example.com', '+44 7700 900211',
   'United States', 'Chicago', 'United Kingdom', 'London',
   'document', 0.8, 1, 'express_international', 'delivered',
   'London, United Kingdom', 51.5072, -0.1276, (date_trunc('day', now()) + interval '-8 days' + interval '17 hours'), (date_trunc('day', now()) + interval '-12 days' + interval '8 hours'), (date_trunc('day', now()) + interval '-10 days' + interval '12 hours')),
  ('RPL-2026-133705', 'Northline Retail', 'fulfilment@northline.example', '+44 161 555 0182',
   'Ingrid Bakker', 'ingrid.bakker@example.com', '+31 6 1188 2200',
   'United Kingdom', 'Manchester', 'Netherlands', 'Utrecht',
   'parcel', 2.4, 1, 'ecommerce', 'delivered',
   'Utrecht, Netherlands', 52.0907, 5.1214, (date_trunc('day', now()) + interval '-10 days' + interval '17 hours'), (date_trunc('day', now()) + interval '-14 days' + interval '8 hours'), (date_trunc('day', now()) + interval '-12 days' + interval '12 hours'))
on conflict (tracking_number) do nothing;

-- ---------------------------------------------------------------------------
-- Tracking events — one insert per shipment, keyed by tracking number
-- ---------------------------------------------------------------------------
insert into public.tracking_events (shipment_id, status, location, latitude, longitude, description, event_date)
select s.id, v.status::shipment_status, v.location, v.latitude, v.longitude, v.description, v.event_date
from public.shipments s
cross join (values
  ('pending', 'Dallas, United States', 32.7767::double precision, -96.797::double precision, 'Shipment created. Awaiting pickup from the sender address.', (date_trunc('day', now()) + interval '0 days' + interval '8 hours'))
) as v(status, location, latitude, longitude, description, event_date)
where s.tracking_number = 'RPL-2026-845276'
  and not exists (select 1 from public.tracking_events te where te.shipment_id = s.id);

insert into public.tracking_events (shipment_id, status, location, latitude, longitude, description, event_date)
select s.id, v.status::shipment_status, v.location, v.latitude, v.longitude, v.description, v.event_date
from public.shipments s
cross join (values
  ('pending', 'New York, United States', 40.7128::double precision, -74.006::double precision, 'Shipment created. Awaiting pickup from the sender address.', (date_trunc('day', now()) + interval '-1 days' + interval '8 hours')),
  ('picked_up', 'New York, United States', 40.7128::double precision, -74.006::double precision, 'Package picked up by a Royal Prime courier.', (date_trunc('day', now()) + interval '-1 days' + interval '14 hours'))
) as v(status, location, latitude, longitude, description, event_date)
where s.tracking_number = 'RPL-2026-728104'
  and not exists (select 1 from public.tracking_events te where te.shipment_id = s.id);

insert into public.tracking_events (shipment_id, status, location, latitude, longitude, description, event_date)
select s.id, v.status::shipment_status, v.location, v.latitude, v.longitude, v.description, v.event_date
from public.shipments s
cross join (values
  ('pending', 'Seville, Spain', 37.3891::double precision, -5.9845::double precision, 'Shipment created. Awaiting pickup from the sender address.', (date_trunc('day', now()) + interval '-2 days' + interval '8 hours')),
  ('picked_up', 'Seville, Spain', 37.3891::double precision, -5.9845::double precision, 'Package picked up by a Royal Prime courier.', (date_trunc('day', now()) + interval '-2 days' + interval '14 hours')),
  ('in_transit', 'Seville, Spain', 37.3891::double precision, -5.9845::double precision, 'Departed origin facility on international air freight.', (date_trunc('day', now()) + interval '-2 days' + interval '3 hours')),
  ('in_transit', 'Madrid, Spain', 40.4168::double precision, -3.7038::double precision, 'Arrived at the Madrid sorting hub.', (date_trunc('day', now()) + interval '-1 days' + interval '6 hours')),
  ('customs', 'Madrid, Spain', 40.4168::double precision, -3.7038::double precision, 'Presented to customs for import clearance.', (date_trunc('day', now()) + interval '0 days' + interval '11 hours')),
  ('in_transit', 'Bordeaux, France', 44.8378::double precision, -0.5792::double precision, 'Cleared customs and forwarded to the Bordeaux delivery station.', (date_trunc('day', now()) + interval '1 days' + interval '7 hours'))
) as v(status, location, latitude, longitude, description, event_date)
where s.tracking_number = 'RPL-2026-664219'
  and not exists (select 1 from public.tracking_events te where te.shipment_id = s.id);

insert into public.tracking_events (shipment_id, status, location, latitude, longitude, description, event_date)
select s.id, v.status::shipment_status, v.location, v.latitude, v.longitude, v.description, v.event_date
from public.shipments s
cross join (values
  ('pending', 'Boston, United States', 42.3601::double precision, -71.0589::double precision, 'Shipment created. Awaiting pickup from the sender address.', (date_trunc('day', now()) + interval '-3 days' + interval '8 hours')),
  ('picked_up', 'Boston, United States', 42.3601::double precision, -71.0589::double precision, 'Package picked up by a Royal Prime courier.', (date_trunc('day', now()) + interval '-3 days' + interval '14 hours')),
  ('in_transit', 'Boston, United States', 42.3601::double precision, -71.0589::double precision, 'Departed origin facility on international air freight.', (date_trunc('day', now()) + interval '-3 days' + interval '3 hours')),
  ('in_transit', 'Brussels, Belgium', 50.8503::double precision, 4.3517::double precision, 'Arrived at the Brussels sorting hub.', (date_trunc('day', now()) + interval '-2 days' + interval '6 hours')),
  ('customs', 'Brussels, Belgium', 50.8503::double precision, 4.3517::double precision, 'Presented to customs for import clearance.', (date_trunc('day', now()) + interval '-1 days' + interval '11 hours')),
  ('in_transit', 'Antwerp, Belgium', 51.2194::double precision, 4.4025::double precision, 'Cleared customs and forwarded to the Antwerp delivery station.', (date_trunc('day', now()) + interval '0 days' + interval '7 hours'))
) as v(status, location, latitude, longitude, description, event_date)
where s.tracking_number = 'RPL-2026-619355'
  and not exists (select 1 from public.tracking_events te where te.shipment_id = s.id);

insert into public.tracking_events (shipment_id, status, location, latitude, longitude, description, event_date)
select s.id, v.status::shipment_status, v.location, v.latitude, v.longitude, v.description, v.event_date
from public.shipments s
cross join (values
  ('pending', 'New York, United States', 40.7128::double precision, -74.006::double precision, 'Shipment created. Awaiting pickup from the sender address.', (date_trunc('day', now()) + interval '-4 days' + interval '8 hours')),
  ('picked_up', 'New York, United States', 40.7128::double precision, -74.006::double precision, 'Package picked up by a Royal Prime courier.', (date_trunc('day', now()) + interval '-4 days' + interval '14 hours')),
  ('in_transit', 'New York, United States', 40.7128::double precision, -74.006::double precision, 'Departed origin facility on international air freight.', (date_trunc('day', now()) + interval '-4 days' + interval '3 hours')),
  ('in_transit', 'Madrid, Spain', 40.4168::double precision, -3.7038::double precision, 'Arrived at the Madrid sorting hub.', (date_trunc('day', now()) + interval '-3 days' + interval '6 hours')),
  ('customs', 'Madrid, Spain', 40.4168::double precision, -3.7038::double precision, 'Presented to customs for import clearance.', (date_trunc('day', now()) + interval '-2 days' + interval '11 hours'))
) as v(status, location, latitude, longitude, description, event_date)
where s.tracking_number = 'RPL-2026-472018'
  and not exists (select 1 from public.tracking_events te where te.shipment_id = s.id);

insert into public.tracking_events (shipment_id, status, location, latitude, longitude, description, event_date)
select s.id, v.status::shipment_status, v.location, v.latitude, v.longitude, v.description, v.event_date
from public.shipments s
cross join (values
  ('pending', 'New York, United States', 40.7128::double precision, -74.006::double precision, 'Shipment created. Awaiting pickup from the sender address.', (date_trunc('day', now()) + interval '-5 days' + interval '8 hours')),
  ('picked_up', 'New York, United States', 40.7128::double precision, -74.006::double precision, 'Package picked up by a Royal Prime courier.', (date_trunc('day', now()) + interval '-5 days' + interval '14 hours')),
  ('in_transit', 'New York, United States', 40.7128::double precision, -74.006::double precision, 'Departed origin facility on international air freight.', (date_trunc('day', now()) + interval '-5 days' + interval '3 hours')),
  ('in_transit', 'Paris, France', 48.8566::double precision, 2.3522::double precision, 'Arrived at the Paris sorting hub.', (date_trunc('day', now()) + interval '-4 days' + interval '6 hours')),
  ('customs', 'Paris, France', 48.8566::double precision, 2.3522::double precision, 'Presented to customs for import clearance.', (date_trunc('day', now()) + interval '-3 days' + interval '11 hours')),
  ('in_transit', 'Lyon, France', 45.764::double precision, 4.8357::double precision, 'Departed the Lyon linehaul facility en route to Paris.', (date_trunc('day', now()) + interval '-2 days' + interval '4 hours'))
) as v(status, location, latitude, longitude, description, event_date)
where s.tracking_number = 'RPL-2026-983456'
  and not exists (select 1 from public.tracking_events te where te.shipment_id = s.id);

insert into public.tracking_events (shipment_id, status, location, latitude, longitude, description, event_date)
select s.id, v.status::shipment_status, v.location, v.latitude, v.longitude, v.description, v.event_date
from public.shipments s
cross join (values
  ('pending', 'New York, United States', 40.7128::double precision, -74.006::double precision, 'Shipment created. Awaiting pickup from the sender address.', (date_trunc('day', now()) + interval '-6 days' + interval '8 hours')),
  ('picked_up', 'New York, United States', 40.7128::double precision, -74.006::double precision, 'Package picked up by a Royal Prime courier.', (date_trunc('day', now()) + interval '-6 days' + interval '14 hours')),
  ('in_transit', 'New York, United States', 40.7128::double precision, -74.006::double precision, 'Departed origin facility on international air freight.', (date_trunc('day', now()) + interval '-6 days' + interval '3 hours')),
  ('in_transit', 'Milan, Italy', 45.4642::double precision, 9.19::double precision, 'Arrived at the Milan sorting hub.', (date_trunc('day', now()) + interval '-5 days' + interval '6 hours')),
  ('customs', 'Milan, Italy', 45.4642::double precision, 9.19::double precision, 'Presented to customs for import clearance.', (date_trunc('day', now()) + interval '-4 days' + interval '11 hours'))
) as v(status, location, latitude, longitude, description, event_date)
where s.tracking_number = 'RPL-2026-550193'
  and not exists (select 1 from public.tracking_events te where te.shipment_id = s.id);

insert into public.tracking_events (shipment_id, status, location, latitude, longitude, description, event_date)
select s.id, v.status::shipment_status, v.location, v.latitude, v.longitude, v.description, v.event_date
from public.shipments s
cross join (values
  ('pending', 'Atlanta, United States', 33.749::double precision, -84.388::double precision, 'Shipment created. Awaiting pickup from the sender address.', (date_trunc('day', now()) + interval '-7 days' + interval '8 hours')),
  ('picked_up', 'Atlanta, United States', 33.749::double precision, -84.388::double precision, 'Package picked up by a Royal Prime courier.', (date_trunc('day', now()) + interval '-7 days' + interval '14 hours')),
  ('in_transit', 'Atlanta, United States', 33.749::double precision, -84.388::double precision, 'Departed origin facility on international air freight.', (date_trunc('day', now()) + interval '-7 days' + interval '3 hours')),
  ('in_transit', 'Frankfurt, Germany', 50.1109::double precision, 8.6821::double precision, 'Arrived at the Frankfurt sorting hub.', (date_trunc('day', now()) + interval '-6 days' + interval '6 hours')),
  ('customs', 'Frankfurt, Germany', 50.1109::double precision, 8.6821::double precision, 'Presented to customs for import clearance.', (date_trunc('day', now()) + interval '-5 days' + interval '11 hours')),
  ('in_transit', 'Berlin, Germany', 52.52::double precision, 13.405::double precision, 'Cleared customs and forwarded to the Berlin delivery station.', (date_trunc('day', now()) + interval '-4 days' + interval '7 hours')),
  ('out_for_delivery', 'Berlin, Germany', 52.52::double precision, 13.405::double precision, 'On the delivery vehicle for final delivery today.', (date_trunc('day', now()) + interval '-3 days' + interval '7 hours'))
) as v(status, location, latitude, longitude, description, event_date)
where s.tracking_number = 'RPL-2026-206741'
  and not exists (select 1 from public.tracking_events te where te.shipment_id = s.id);

insert into public.tracking_events (shipment_id, status, location, latitude, longitude, description, event_date)
select s.id, v.status::shipment_status, v.location, v.latitude, v.longitude, v.description, v.event_date
from public.shipments s
cross join (values
  ('pending', 'New York, United States', 40.7128::double precision, -74.006::double precision, 'Shipment created. Awaiting pickup from the sender address.', (date_trunc('day', now()) + interval '-9 days' + interval '8 hours')),
  ('picked_up', 'New York, United States', 40.7128::double precision, -74.006::double precision, 'Package picked up by a Royal Prime courier.', (date_trunc('day', now()) + interval '-9 days' + interval '14 hours')),
  ('in_transit', 'New York, United States', 40.7128::double precision, -74.006::double precision, 'Departed origin facility on international air freight.', (date_trunc('day', now()) + interval '-9 days' + interval '3 hours')),
  ('in_transit', 'Amsterdam, Netherlands', 52.3676::double precision, 4.9041::double precision, 'Arrived at the Amsterdam sorting hub.', (date_trunc('day', now()) + interval '-8 days' + interval '6 hours')),
  ('customs', 'Amsterdam, Netherlands', 52.3676::double precision, 4.9041::double precision, 'Presented to customs for import clearance.', (date_trunc('day', now()) + interval '-7 days' + interval '11 hours')),
  ('in_transit', 'Rotterdam, Netherlands', 51.9244::double precision, 4.4777::double precision, 'Cleared customs and forwarded to the Rotterdam delivery station.', (date_trunc('day', now()) + interval '-6 days' + interval '7 hours')),
  ('delayed', 'Amsterdam, Netherlands', 52.3676::double precision, 4.9041::double precision, 'Delivery rescheduled — the connecting flight was held by severe weather at the hub.', (date_trunc('day', now()) + interval '-6 days' + interval '18 hours'))
) as v(status, location, latitude, longitude, description, event_date)
where s.tracking_number = 'RPL-2026-338920'
  and not exists (select 1 from public.tracking_events te where te.shipment_id = s.id);

insert into public.tracking_events (shipment_id, status, location, latitude, longitude, description, event_date)
select s.id, v.status::shipment_status, v.location, v.latitude, v.longitude, v.description, v.event_date
from public.shipments s
cross join (values
  ('pending', 'Zurich, Switzerland', 47.3769::double precision, 8.5417::double precision, 'Shipment created. Awaiting pickup from the sender address.', (date_trunc('day', now()) + interval '-10 days' + interval '8 hours')),
  ('picked_up', 'Zurich, Switzerland', 47.3769::double precision, 8.5417::double precision, 'Package picked up by a Royal Prime courier.', (date_trunc('day', now()) + interval '-10 days' + interval '14 hours')),
  ('in_transit', 'Zurich, Switzerland', 47.3769::double precision, 8.5417::double precision, 'Departed origin facility on international air freight.', (date_trunc('day', now()) + interval '-10 days' + interval '3 hours')),
  ('in_transit', 'Paris, France', 48.8566::double precision, 2.3522::double precision, 'Arrived at the Paris sorting hub.', (date_trunc('day', now()) + interval '-9 days' + interval '6 hours')),
  ('customs', 'Paris, France', 48.8566::double precision, 2.3522::double precision, 'Presented to customs for import clearance.', (date_trunc('day', now()) + interval '-8 days' + interval '11 hours')),
  ('in_transit', 'Lyon, France', 45.764::double precision, 4.8357::double precision, 'Cleared customs and forwarded to the Lyon delivery station.', (date_trunc('day', now()) + interval '-7 days' + interval '7 hours')),
  ('out_for_delivery', 'Lyon, France', 45.764::double precision, 4.8357::double precision, 'On the delivery vehicle for final delivery today.', (date_trunc('day', now()) + interval '-6 days' + interval '7 hours')),
  ('delivered', 'Lyon, France', 45.764::double precision, 4.8357::double precision, 'Delivered and signed for at the receiver address.', (date_trunc('day', now()) + interval '-6 days' + interval '15 hours'))
) as v(status, location, latitude, longitude, description, event_date)
where s.tracking_number = 'RPL-2026-901488'
  and not exists (select 1 from public.tracking_events te where te.shipment_id = s.id);

insert into public.tracking_events (shipment_id, status, location, latitude, longitude, description, event_date)
select s.id, v.status::shipment_status, v.location, v.latitude, v.longitude, v.description, v.event_date
from public.shipments s
cross join (values
  ('pending', 'Chicago, United States', 41.8781::double precision, -87.6298::double precision, 'Shipment created. Awaiting pickup from the sender address.', (date_trunc('day', now()) + interval '-12 days' + interval '8 hours')),
  ('picked_up', 'Chicago, United States', 41.8781::double precision, -87.6298::double precision, 'Package picked up by a Royal Prime courier.', (date_trunc('day', now()) + interval '-12 days' + interval '14 hours')),
  ('in_transit', 'Chicago, United States', 41.8781::double precision, -87.6298::double precision, 'Departed origin facility on international air freight.', (date_trunc('day', now()) + interval '-12 days' + interval '3 hours')),
  ('in_transit', 'London, United Kingdom', 51.5072::double precision, -0.1276::double precision, 'Arrived at the London sorting hub.', (date_trunc('day', now()) + interval '-11 days' + interval '6 hours')),
  ('customs', 'London, United Kingdom', 51.5072::double precision, -0.1276::double precision, 'Presented to customs for import clearance.', (date_trunc('day', now()) + interval '-10 days' + interval '11 hours')),
  ('in_transit', 'London, United Kingdom', 51.5072::double precision, -0.1276::double precision, 'Cleared customs and forwarded to the London delivery station.', (date_trunc('day', now()) + interval '-9 days' + interval '7 hours')),
  ('out_for_delivery', 'London, United Kingdom', 51.5072::double precision, -0.1276::double precision, 'On the delivery vehicle for final delivery today.', (date_trunc('day', now()) + interval '-8 days' + interval '7 hours')),
  ('delivered', 'London, United Kingdom', 51.5072::double precision, -0.1276::double precision, 'Delivered and signed for at the receiver address.', (date_trunc('day', now()) + interval '-8 days' + interval '15 hours'))
) as v(status, location, latitude, longitude, description, event_date)
where s.tracking_number = 'RPL-2026-114872'
  and not exists (select 1 from public.tracking_events te where te.shipment_id = s.id);

insert into public.tracking_events (shipment_id, status, location, latitude, longitude, description, event_date)
select s.id, v.status::shipment_status, v.location, v.latitude, v.longitude, v.description, v.event_date
from public.shipments s
cross join (values
  ('pending', 'Manchester, United Kingdom', 53.4808::double precision, -2.2426::double precision, 'Shipment created. Awaiting pickup from the sender address.', (date_trunc('day', now()) + interval '-14 days' + interval '8 hours')),
  ('picked_up', 'Manchester, United Kingdom', 53.4808::double precision, -2.2426::double precision, 'Package picked up by a Royal Prime courier.', (date_trunc('day', now()) + interval '-14 days' + interval '14 hours')),
  ('in_transit', 'Manchester, United Kingdom', 53.4808::double precision, -2.2426::double precision, 'Departed origin facility on international air freight.', (date_trunc('day', now()) + interval '-14 days' + interval '3 hours')),
  ('in_transit', 'Brussels, Belgium', 50.8503::double precision, 4.3517::double precision, 'Arrived at the Brussels sorting hub.', (date_trunc('day', now()) + interval '-13 days' + interval '6 hours')),
  ('customs', 'Brussels, Belgium', 50.8503::double precision, 4.3517::double precision, 'Presented to customs for import clearance.', (date_trunc('day', now()) + interval '-12 days' + interval '11 hours')),
  ('in_transit', 'Utrecht, Netherlands', 52.0907::double precision, 5.1214::double precision, 'Cleared customs and forwarded to the Utrecht delivery station.', (date_trunc('day', now()) + interval '-11 days' + interval '7 hours')),
  ('out_for_delivery', 'Utrecht, Netherlands', 52.0907::double precision, 5.1214::double precision, 'On the delivery vehicle for final delivery today.', (date_trunc('day', now()) + interval '-10 days' + interval '7 hours')),
  ('delivered', 'Utrecht, Netherlands', 52.0907::double precision, 5.1214::double precision, 'Delivered and signed for at the receiver address.', (date_trunc('day', now()) + interval '-10 days' + interval '15 hours'))
) as v(status, location, latitude, longitude, description, event_date)
where s.tracking_number = 'RPL-2026-133705'
  and not exists (select 1 from public.tracking_events te where te.shipment_id = s.id);

-- ---------------------------------------------------------------------------
-- Support requests
-- ---------------------------------------------------------------------------
insert into public.support_requests (name, email, phone, tracking_number, subject, message, status)
values
  ('Camille Moreau', 'camille.moreau@example.com', '+33 6 12 88 40 21', 'RPL-2026-983456',
   'Change of delivery address',
   'I have moved apartments this week. Can the delivery be redirected to the 11th arrondissement?', 'open'),
  ('Anne de Vries', 'anne.devries@example.com', '+31 6 2244 8899', 'RPL-2026-338920',
   'Cold chain confirmation',
   'Please confirm the reefer temperature log for this consignment before it clears customs.', 'in_progress'),
  ('Oliver Bennett', 'oliver.bennett@example.com', '+44 7700 900211', 'RPL-2026-114872',
   'Proof of delivery copy',
   'Could you email the signed proof of delivery for our records?', 'resolved'),
  ('Nadia Brooks', 'nadia.brooks@example.com', '+1 (305) 555-0111', null,
   'Business account pricing',
   'We ship roughly 200 parcels a month into Europe and would like volume pricing.', 'open')
on conflict do nothing;

commit;

-- ---------------------------------------------------------------------------
-- Promoting an administrator
-- ---------------------------------------------------------------------------
-- Sign the account up through /register first, then run:
--
--   update public.users set role = 'admin' where email = 'you@example.com';
--
-- Admin rights are only ever granted here, never through the signup flow.
