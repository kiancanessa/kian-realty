export function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 320 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
    </svg>
  );
}

export function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.6 5.82c-.9-.98-1.4-2.26-1.4-3.57h-3.16v14.02c0 1.52-1.23 2.75-2.75 2.75a2.75 2.75 0 0 1 0-5.5c.29 0 .56.04.82.13V10.5a6 6 0 0 0-.82-.06 6 6 0 1 0 6 6V9.4a8.5 8.5 0 0 0 4.75 1.45V7.68a5.4 5.4 0 0 1-3.44-1.86z" />
    </svg>
  );
}

export function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.8 14.02c-.24.68-1.4 1.3-1.93 1.38-.49.08-1.11.11-1.79-.11-.41-.13-.94-.31-1.62-.6-2.85-1.23-4.71-4.1-4.85-4.29-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.08.99-2.37.26-.28.57-.35.76-.35s.38 0 .55.01c.18.01.41-.07.64.49.24.57.81 1.98.88 2.12.07.14.11.31.02.5-.09.19-.14.31-.28.48-.14.16-.29.36-.41.49-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.19-.28.38-.23.63-.14.26.1 1.63.77 1.9.91.28.14.46.21.53.33.07.12.07.68-.17 1.36z" />
    </svg>
  );
}

export type SocialLink = { name: string; href: string; Icon: (props: { size?: number }) => React.JSX.Element; color: string; hoverColor: string };

// Add a TikTok entry here once a real link is available:
// { name: "TikTok", href: "https://tiktok.com/@...", Icon: TikTokIcon, color: "#000000", hoverColor: "#333333" }
export const SOCIAL_LINKS: SocialLink[] = [
  { name: "Facebook", href: "https://www.facebook.com/share/1KXb7Lm8g9/", Icon: FacebookIcon, color: "#1877F2", hoverColor: "#166FE5" },
  { name: "Instagram", href: "https://www.instagram.com/elcasarosaritogroup/", Icon: InstagramIcon, color: "#E1306C", hoverColor: "#C13584" },
];
