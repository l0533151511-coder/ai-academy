import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { GlobalSearch } from "@/components/search/global-search";
import { MobileNav } from "@/components/layout/mobile-nav";

const NAV = [
  { href: "/tracks", label: "מסלולי לימוד" },
  { href: "/dashboard", label: "לוח בקרה" },
  { href: "/skills", label: "מפת כישורים" },
  { href: "/graduation", label: "תקן הבוגר" },
  { href: "/playground", label: "מעבדות" },
  { href: "/mentor", label: "AI Mentor" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap size={20} />
          </span>
          אקדמיית AI
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-card hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <GlobalSearch />
          <ThemeToggle />
          <UserMenu />
          <MobileNav items={NAV} />
        </div>
      </div>
    </header>
  );
}
