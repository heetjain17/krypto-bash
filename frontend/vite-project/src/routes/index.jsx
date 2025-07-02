import { createFileRoute } from '@tanstack/react-router';
import '../styles.css'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <div className="p-2">
        <h3>Welcome Home!</h3>
      </div>
    </>
  );
}
