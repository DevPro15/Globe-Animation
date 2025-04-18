"use client";
import Link from "next/link";
import React, { ReactElement, useState } from "react";
import { usePathname } from "next/navigation";

export const links: Array<{ path: string; label: string }> = [
  { path: "/", label: "Satellite Heatmap Globe" },
  { path: "/animated-globe", label: "Animated Globe" },
];

const Header: React.FC = (): ReactElement => {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = (): void => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="pb-6 lg:pb-0 top-0 sticky z-50  backdrop-blur-md">
      <div className=" px-6 lg:px-16 w-full relative">
        <nav className="flex items-center justify-center h-16 lg:h-20">
          <div className="flex-shrink-0">
            <Link href="/" className="text-3xl">
              Globes <span className="text-xs">by Zair</span>
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex p-2 text-[#23DAA9] transition-all duration-200 rounded-md lg:hidden bg-inherit"
            onClick={handleOpen}
          >
            <svg
              className="block w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 8h16M4 16h16"
              />
            </svg>

            <svg
              className="hidden w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="hidden lg:flex lg:items-center lg:ml-auto lg:space-x-10">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`app-transition-primary font-medium hover:text-[#23DAA9] cursor-pointer text-nowrap ${
                  pathname === link.path ? "text-[#23DAA9]" : "text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {isOpen && (
          <nav className="pt-4 px-16 pb-6 flex justify-center items-center bg-slate-900 min-h-[10vh] border border-gray-200 rounded-md shadow-md lg:hidden fixed w-full top-14 left-0 right-0 mx-auto z-50 backdrop-blur-xl">
            <div className="flex flex-wrap px-6 -my-2 gap-5">
              {links.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`app-transition-primary font-medium hover:text-[#23DAA9] cursor-pointer text-nowrap ${
                    pathname === link.path ? "text-[#23DAA9]" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
