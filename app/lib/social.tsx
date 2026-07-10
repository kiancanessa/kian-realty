export function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 8.71 8.71 0 0 0-.821.036c-.34.036-.643.174-.807.325-.226.235-.335.53-.335 1.1v1.53h1.4v3.667h-1.4v7.98" />
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

export type SocialLink = { name: string; href: string; Icon: (props: { size?: number }) => React.JSX.Element };

// Add Instagram/TikTok entries here once real links are available:
// { name: "Instagram", href: "https://instagram.com/...", Icon: InstagramIcon }
// { name: "TikTok", href: "https://tiktok.com/@...", Icon: TikTokIcon }
export const SOCIAL_LINKS: SocialLink[] = [
  { name: "Facebook", href: "https://www.facebook.com/share/1KXb7Lm8g9/", Icon: FacebookIcon },
];
