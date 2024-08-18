"use client";

import Link from "next/link";
import Logo from "./logo";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const routes = [
  {
    id: 1,
    label: "Dashboard",
    path: "/app/dashboard",
  },
  {
    id: 2,
    label: "Account",
    path: "/app/account",
  },
];

export default function AppHeader() {
  const activePathname = usePathname();

  return (
    <header className="flex justify-between items-center border-b border-white/10 py-2">
      <Logo />

      <nav>
        <ul className="flex gap-2 text-xs">
          {routes.map((route) => (
            <li key={route.id}>
              <Link
                href={route.path}
                className={cn(
                  "text-white/70 rounded-sm px-2 py-1 hover:text-white focus:text-white transition",
                  //   activePathname === route.path && "bg-black/10 text-white"
                  { "bg-black/10 text-white": activePathname === route.path }
                )}
              >
                {route.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
