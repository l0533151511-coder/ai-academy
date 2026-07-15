"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

/** ניווט מובייל: כפתור המבורגר (md:hidden) שפותח מגירה עם קישורי הניווט. */
export function MobileNav({ items }: { items: { href: string; label: string }[] }) {
  const [open, setOpen] = React.useState(false);

  // נעילת גלילת הרקע כשהמגירה פתוחה + סגירה ב-Escape
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="פתח תפריט"
        aria-expanded={open}
        className="flex size-9 items-center justify-center rounded-lg text-muted transition hover:bg-card hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Menu size={20} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="תפריט ניווט">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <nav className="absolute inset-y-0 right-0 flex w-72 max-w-[85%] flex-col gap-1 border-l border-border bg-card p-4 shadow-2xl">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-bold">תפריט</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="סגור תפריט"
                className="flex size-9 items-center justify-center rounded-lg text-muted transition hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
              >
                <X size={20} />
              </button>
            </div>
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
