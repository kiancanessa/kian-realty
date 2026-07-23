"use client";
import { useRouter, usePathname } from "next/navigation";
import { Heart } from "lucide-react";
import { useSession } from "../lib/useSession";
import { useFavoritesContext } from "../lib/FavoritesContext";

export default function FavoriteButton({
  propertyId, propertyTitle, propertyImage, size = 18, style,
}: {
  propertyId: string; propertyTitle?: string; propertyImage?: string; size?: number; style?: React.CSSProperties;
}) {
  const { user } = useSession();
  const { isFavorited, toggle } = useFavoritesContext();
  const router = useRouter();
  const pathname = usePathname();
  const favorited = isFavorited(propertyId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    toggle(propertyId, propertyTitle, propertyImage);
  };

  return (
    <button onClick={handleClick} aria-label="Favorite"
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: size + 20, height: size + 20, borderRadius: "50%", border: "none", cursor: "pointer",
        background: "rgba(10,10,8,0.4)", backdropFilter: "blur(6px)",
        ...style,
      }}>
      <Heart size={size} color="#FAF6EE" fill={favorited ? "#FAF6EE" : "none"} />
    </button>
  );
}
