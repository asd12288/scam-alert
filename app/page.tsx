import { redirect } from 'next/navigation';

// This serves as a backup in case the (root) folder doesn't get properly recognized in production
export default function HomePage() {
  // We'll just redirect to the real homepage component in the (root) folder
  redirect('/');
}