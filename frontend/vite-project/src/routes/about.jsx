import { createFileRoute } from '@tanstack/react-router';
import '../styles.css'

export const Route = createFileRoute('/about')({
  component: About,
});

function About() {
  return <div className="p-2">Hello from About!</div>;
}
