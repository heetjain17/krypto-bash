import { SignIn } from '@clerk/clerk-react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(auth)/sign-in')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex justify-center items-center py-12 h-screen">
      <SignIn />
    </div>
  );
}
