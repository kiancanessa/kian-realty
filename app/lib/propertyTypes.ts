// Kept in its own module (no server imports) so client components like the
// admin PropertyEditor can read it without pulling in the database client.
//
// Same vocabulary EasyBroker uses, so categoryFor() maps these to the
// house/apartment/land filters without a second lookup table.
export const PROPERTY_TYPES = [
  "Casa",
  "Casa en condominio",
  "Casa con uso de suelo",
  "Departamento",
  "Edificio",
  "Terreno",
  "Terreno comercial",
] as const;
