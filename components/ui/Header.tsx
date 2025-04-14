"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/blogs", label: "Blogs" },
    { href: "/guide", label: "AI Prevention Guide" },
  ];

  return (
    <header className="w-full py-6 px-4 border-b mb-6 bg-white shadow-sm">
      <nav className="container mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold text-gray-900 flex items-center"
        >
          <span className="text-[rgb(255,77,79)] mr-1">AI</span> Scam Alert
          <span className="bg-[rgba(255,77,79,0.1)] text-[rgb(255,77,79)] text-xs rounded-full px-2 py-1 ml-2">
            Powered by AI
          </span>
        </Link>
        <ul className="flex space-x-8">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`transition-colors px-2 py-1 ${
                  pathname === link.href
                    ? "text-[rgb(255,77,79)] font-medium border-b-2 border-[rgb(255,77,79)]"
                    : "text-gray-600 hover:text-[rgb(255,77,79)] hover:border-b-2 hover:border-gray-200"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
