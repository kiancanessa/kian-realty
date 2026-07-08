"use client";
import { Bed, Bath, Square, Wifi, Car, Wind, WashingMachine } from "lucide-react";
import PropertyDetail from "../../components/PropertyDetail";

const IMAGES = [
  { src: "/images/k38-apartment/depa4.jpeg", label: { en: "Ocean View", es: "Vista al Mar" } },
  { src: "/images/k38-apartment/depa1.jpeg", label: { en: "Kitchen", es: "Cocina" } },
  { src: "/images/k38-apartment/depa2.jpeg", label: { en: "Dining Room", es: "Comedor" } },
  { src: "/images/k38-apartment/depa3.jpeg", label: { en: "Living Room", es: "Sala" } },
  { src: "/images/k38-apartment/depa7.jpeg", label: { en: "Bedroom 1", es: "Recámara 1" } },
  { src: "/images/k38-apartment/depa10.jpeg", label: { en: "Bedroom 2", es: "Recámara 2" } },
  { src: "/images/k38-apartment/depa9.jpeg", label: { en: "Bathroom", es: "Baño" } },
  { src: "/images/k38-apartment/depa11.jpeg", label: { en: "Shower", es: "Regadera" } },
  { src: "/images/k38-apartment/depa5.jpeg", label: { en: "Patio", es: "Patio" } },
  { src: "/images/k38-apartment/depa6.jpeg", label: { en: "Panoramic View", es: "Vista Panorámica" } },
  { src: "/images/k38-apartment/depa8.jpeg", label: { en: "Kitchen Detail", es: "Detalle de Cocina" } },
  { src: "/images/k38-apartment/cochera.jpg", label: { en: "Private Garage", es: "Cochera Privada" } },
];

export default function K38ApartmentPage() {
  return (
    <PropertyDetail
      badge={{ en: "For Rent", es: "En Renta" }}
      title={{ en: "Ocean View Apartment", es: "Departamento Vista al Mar" }}
      address="Km 37.5 · Playas de Rosarito, BC 22717"
      images={IMAGES}
      priceLabel={{ en: "Monthly Rent · USD", es: "Renta Mensual · USD" }}
      price={{ en: "Price on Request", es: "Precio a Consultar" }}
      priceNote={{ en: "Priced in US Dollars", es: "Precio en dólares americanos" }}
      specs={[
        { icon: Bed, val: "2", label: { en: "Bedrooms", es: "Recámaras" } },
        { icon: Bath, val: "2", label: { en: "Bathrooms", es: "Baños" } },
        { icon: Square, val: "180", label: { en: "m²", es: "m²" } },
      ]}
      description={{
        en: "Live by the ocean. This fully furnished ground-floor apartment offers the perfect blend of comfort, convenience, and coastal living. Whether you're a remote worker, digital nomad, surfer, or frequent commuter to San Diego, this home is designed for your lifestyle.",
        es: "Vive frente al mar. Este departamento completamente amueblado en planta baja combina comodidad, ubicación y estilo de vida costero. Perfecto para trabajadores remotos, surfistas o personas que viajan frecuentemente a San Diego.",
      }}
      amenities={[
        { icon: Wifi, label: { en: "Fiber optic internet", es: "Internet de fibra óptica" } },
        { icon: Car, label: { en: "Private garage", es: "Cochera privada" } },
        { icon: Wind, label: { en: "Gas heating", es: "Calefacción de gas" } },
        { icon: WashingMachine, label: { en: "Laundry available", es: "Lavadero disponible" } },
      ]}
      highlights={[
        { en: "High-speed fiber optic internet", es: "Internet de fibra óptica de alta velocidad" },
        { en: "Fully furnished & move-in ready", es: "Totalmente amueblado y listo para habitar" },
        { en: "Private covered garage parking", es: "Cochera privada techada" },
        { en: "Ground-floor access", es: "Acceso en planta baja" },
        { en: "Easy access to public transport", es: "Fácil acceso al transporte público" },
        { en: "Secure & peaceful location", es: "Zona tranquila y segura" },
      ]}
      locationTitle={{ en: "Prime Location · Km 37.5", es: "Ubicación Privilegiada · Km 37.5" }}
      nearby={[
        { emoji: "🏄", text: { en: "Seconds from K38 surf break", es: "Segundos del punto de surf K38" } },
        { emoji: "🛒", text: { en: "Minutes from Calimax Puerto Nuevo", es: "Minutos de Calimax Puerto Nuevo" } },
        { emoji: "🍽️", text: { en: "Close to popular restaurants", es: "Cerca de excelentes restaurantes" } },
        { emoji: "🚗", text: { en: "Less than 20 min from Downtown Rosarito", es: "Menos de 20 min del centro de Rosarito" } },
        { emoji: "🌎", text: { en: "Convenient drive to US border & San Diego", es: "Acceso rápido a la frontera y San Diego" } },
      ]}
      mapEmbedUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3264.0!2d-117.0599!3d32.2677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80d8b32b3c4f4f4f%3A0x0!2sKm%2037.5%2C%20Tijuana%E2%80%93Ensenada%20Hwy%2C%20Rosarito%2C%20BC!5e0!3m2!1sen!2smx!4v1710000000000"
      messagePlaceholder={{ en: "I'm interested in this apartment...", es: "Me interesa este departamento..." }}
    />
  );
}
