type IconName = "arrow" | "phone" | "headphones" | "mail" | "pin" | "mapLocation" | "menu" | "close" | "search" | "check" | "calendar" | "facebook" | "twitter" | "instagram" | "linkedin" | "play" | "share" | "user" | "comments";

const paths: Record<IconName, string> = {
  arrow: "M5 12h14M13 6l6 6-6 6",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  comments: "M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8zM8 8h8M8 12h5",
  headphones: "M4 14v-2a8 8 0 0 1 16 0v2M4 14a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2v2zM20 14a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2v2zM9 19h6",
  share: "M18 8a3 3 0 1 0-2.83-4A3 3 0 0 0 15 5.17l-6 3.46a3 3 0 1 0 0 5.22l6 3.46A3 3 0 1 0 16 15.83l-6-3.46a3 3 0 0 0 0-1.74l6-3.46A3 3 0 0 0 18 8z",
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.8 12.8 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.8 12.8 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
  pin: "M21 10c0 7-9 12-9 12S3 17 3 10a9 9 0 1 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  mapLocation: "M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6zM9 3v15M15 6v15M18 9c0 2.5-3 5-3 5s-3-2.5-3-5a3 3 0 0 1 6 0zM15 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  menu: "M3 6h18M3 12h18M3 18h18",
  close: "M6 6l12 12M18 6L6 18",
  search: "m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z",
  check: "M20 6 9 17l-5-5",
  calendar: "M3 4h18v17H3zM16 2v4M8 2v4M3 10h18",
  facebook: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  twitter: "M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 12 7.5v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.7 7.7 0 0 0 23 3z",
  instagram: "M2 2h20v20H2zM16.5 11.37A4.5 4.5 0 1 1 12.63 7.5a4.5 4.5 0 0 1 3.87 3.87zM17.5 6.5h.01",
  linkedin: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  play: "M8 5v14l11-7z"
};

export function Icon({ name, size = 18, strokeWidth = 1.8, className = "" }: { name: IconName; size?: number; strokeWidth?: number; className?: string }) {
  return <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d={paths[name]} /></svg>;
}

export function ArrowIcon({ className }: { className?: string }) { return <Icon name="arrow" className={className} />; }
export function PhoneIcon() { return <Icon name="phone" size={22} />; }
export function MailIcon() { return <Icon name="mail" size={22} />; }
export function LocationIcon() { return <Icon name="pin" size={22} />; }
export function SearchIcon() { return <Icon name="search" size={22} />; }
export function MenuIcon() { return <Icon name="menu" size={28} />; }
export function CloseIcon() { return <Icon name="close" size={28} />; }
export function PlayIcon() { return <Icon name="play" size={30} />; }
