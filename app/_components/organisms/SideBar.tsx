"use client";

import Image from "next/image";
import { Tags, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Sidebar = ({ type }: { type: string }) => {
  const isAdmin = type === "ADMIN";
  const pathname = usePathname();

  const navItems = [
    {
      href: "/journalist/posts",
      label: "Postagens",
      accentFrom: "#C4161C",
      accentTo: "#e01b22",
      activeGlass: "rgba(196,22,28,0.08)",
      activeBorder: "rgba(196,22,28,0.25)",
      activeText: "#C4161C",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="shrink-0 group-hover:scale-110 transition-transform duration-200"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      adminOnly: false,
    },
    {
      href: "/journalist/dashboard",
      label: "Dashboard",
      accentFrom: "#F9C74F",
      accentTo: "#f4a93f",
      activeGlass: "rgba(249,199,79,0.12)",
      activeBorder: "rgba(249,199,79,0.4)",
      activeText: "#b07d00",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="shrink-0 group-hover:scale-110 transition-transform duration-200"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
      adminOnly: false,
    },
    {
      href: "/users",
      label: "Jornalistas",
      accentFrom: "#50c416",
      accentTo: "#1ee01b",
      activeGlass: "rgba(80,196,22,0.08)",
      activeBorder: "rgba(80,196,22,0.25)",
      activeText: "#2d8010",
      icon: <Users className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform duration-200" />,
      adminOnly: true,
    },
    {
      href: "/category",
      label: "Categorias",
      accentFrom: "#9333ea",
      accentTo: "#ec4899",
      activeGlass: "rgba(147,51,234,0.08)",
      activeBorder: "rgba(147,51,234,0.25)",
      activeText: "#9333ea",
      icon: <Tags className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform duration-200" />,
      adminOnly: true,
    },
  ];

  const visibleItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white/70 backdrop-blur-xl border-r border-white/20 z-50 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 shadow-xl">
      {/* Logo */}
      <div className="flex items-center gap-2 px-8 py-6 mb-8">
        <Image src="/images/logo.png" alt="Logo portal" width={40} height={40} />
        <span className="text-2xl font-bold bg-linear-to-r from-[#283583] to-[#3d4ba8] bg-clip-text text-transparent">
          NE1
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col px-4 gap-3">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex items-center gap-4 px-6 py-4 rounded-xl font-semibold transition-all duration-200 group"
              style={
                isActive
                  ? {
                      background: item.activeGlass,
                      backdropFilter: "blur(12px)",
                      border: `1px solid ${item.activeBorder}`,
                      color: item.activeText,
                      boxShadow: `0 4px 16px ${item.activeGlass}, inset 0 1px 0 rgba(255,255,255,0.6)`,
                    }
                  : {
                      background: "rgba(239,246,255,0.5)",
                      backdropFilter: "blur(4px)",
                      border: "1px solid rgba(191,219,254,0.3)",
                      color: "#283583",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }
              }
            >
              {/* Accent bar */}
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full transition-all duration-200"
                style={{
                  height: isActive ? "2.5rem" : "2rem",
                  background: `linear-gradient(to bottom, ${item.accentFrom}, ${item.accentTo})`,
                  opacity: isActive ? 1 : 0.5,
                  boxShadow: isActive ? `0 0 8px ${item.accentFrom}80` : "none",
                }}
              />

              {/* Icon */}
              <span style={{ color: isActive ? item.activeText : "#283583" }}>
                {item.icon}
              </span>

              {/* Label */}
              <span className={isActive ? "font-black" : "font-semibold"}>
                {item.label}
              </span>

              {/* Active dot */}
              {isActive && (
                <span
                  className="ml-auto w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: item.accentFrom,
                    boxShadow: `0 0 6px ${item.accentFrom}`,
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};