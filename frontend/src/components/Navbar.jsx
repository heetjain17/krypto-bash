import { SignedOut, UserButton, SignedIn } from '@clerk/clerk-react';
import { IconDatabase, IconMenu2, IconX } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import React, { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Compare', link: '/compare' },
    { name: 'Global', link: '/global' },
    { name: 'Bookmarks', link: '/bookmarks' },
  ];

  return (
    <nav className="border-b-2 border-neutral-500 bg-white dark:bg-neutral-900">
      <div className="flex justify-between items-center py-2 px-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to={'/'} className="flex gap-2 items-center">
          <IconDatabase />
          <span className="text-lg font-medium text-black dark:text-white">
            KryptoBash
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2 font-medium">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.link}
              className="hover:bg-neutral-200 dark:hover:bg-neutral-800 py-2 px-3 rounded-4xl transition-all duration-300 ease-in-out"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex gap-2 items-center font-medium">
          <SignedOut>
            <Link
              to={'/sign-up'}
              className="py-2 px-4 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all duration-300 ease-in-out"
            >
              Sign Up
            </Link>
            <Link
              to={'/sign-in'}
              className="py-2 px-4 bg-neutral-800 hover:bg-neutral-900 text-white rounded-lg transition-all duration-300 ease-in-out"
            >
              Sign In
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800"
          >
            {isMenuOpen ? <IconX /> : <IconMenu2 />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden mx-3 mt-2 rounded-lg shadow-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 overflow-hidden">
          {/* Nav Links */}
          <div className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-700">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.link}
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="border-t border-neutral-300 dark:border-neutral-700">
            <SignedOut>
              <Link
                to={'/sign-up'}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Sign Up
              </Link>
              <Link
                to={'/sign-in'}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 bg-neutral-800 hover:bg-neutral-900 text-white transition-colors"
              >
                Sign In
              </Link>
            </SignedOut>
            <SignedIn>
              <div className="px-4 py-3">
                <UserButton />
              </div>
            </SignedIn>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
