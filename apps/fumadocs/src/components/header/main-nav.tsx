"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MainNav() {
  const pathname = usePathname();

  const getIsActive = (href: string) => pathname === href;

  return (
    <div className="mr-4 flex">
      {pathname === "/" ? (
        <div className="mr-4 flex items-center space-x-2 lg:mr-6">
          <span className="mt-0.5 font-bold">Bracketcore</span>
        </div>
      ) : (
        <Link href="/" className="mr-4 flex items-center space-x-2 lg:mr-6">
          <span className="mt-0.5 font-bold">Bracketcore</span>
        </Link>
      )}
    </div>
  );
}
