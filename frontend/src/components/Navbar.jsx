import { SignedOut, UserButton, SignedIn } from '@clerk/clerk-react';
import { IconDatabase } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import React from 'react';

const Navbar = () => {
  const navItems = [
    {
      name: 'Compare',
      link: '/compare',
    },
    {
      name: 'Global',
      link: '#',
    },
    {
      name: 'Bookmarks',
      link: '#',
    },
  ];
  return (
    <div className="border-b-2 border-neutral-500 flex justify-between py-2 px-4">
      <Link to={'/'} className="flex gap-2 justify-center items-center">
        <IconDatabase />
        <span className="text-lg font-medium text-black dark:text-white">
          KryptoBash
        </span>
      </Link>
      <div className="flex items-center justify-center font-medium">
        {navItems.map((item) => (
          <Link
            to={item.link}
            className="hover:bg-neutral-200 py-2 px-3 rounded-4xl transition-all duration-300 ease-in-out"
            key={item.name}
          >
            {item.name}
          </Link>
        ))}
      </div>

      <div className="flex gap-2 items-center justify-center font-medium">
        <SignedOut>
          <Link
            to={'/sign-up'}
            className="py-2 px-4 rounded-lg hover:bg-neutral-200 transition-all duration-300 ease-in-out "
          >
            Sign Up
          </Link>
          <Link
            to={'/sign-in'}
            className="py-2 px-4 bg-neutral-800 hover:bg-neutral-900 text-white rounded-lg transition-all duration-300 ease-in-out "
          >
            Sign In
          </Link>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;
