import { createFileRoute } from '@tanstack/react-router';
import '../styles.css';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/clerk-react';
import Navbar from '../components/Navbar';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="max-w-7xl mx-auto">
      <Navbar />
    </div>
  );
}
