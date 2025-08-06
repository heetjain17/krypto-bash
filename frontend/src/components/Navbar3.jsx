import { SignedOut, UserButton, SignedIn } from '@clerk/clerk-react';
import { IconDatabase } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import React from 'react';

const Navbar3 = () => {
  return (
    <div className="outline-amber-800 outline-2 flex justify-between p-4">
      <Link to={'/'} className="flex gap-2 justify-center items-center">
        <IconDatabase />
        <span className="text-lg font-medium text-black dark:text-white">
          KryptoBash
        </span>
      </Link>
      <div className="flex gap-4 items-center justify-center font-medium">
        <Link>Compare</Link>
        <Link>Global</Link>
        <Link>Bookmarks</Link>
      </div>
      <div className="flex gap-2 items-center justify-center font-medium">
        <SignedOut>
          <Link
            to={'/sign-up'}
            className="py-2 px-4 rounded-lg hover:bg-neutral-200 transition "
          >
            Sign Up
          </Link>
          <Link
            to={'/sign-in'}
            className="py-2 px-4 bg-neutral-800 text-neutral-100 rounded-lg"
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

export default Navbar3;
