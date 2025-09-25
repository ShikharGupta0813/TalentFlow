import { useEffect } from 'react';
import { Hero } from '@/components/Hero';
import { JobCategories } from '@/components/JobCategories';
import { Style } from './Style';
import { FeaturedJobs } from '@/components/FeaturedJobs';
import { Footer } from '@/components/Footer';

export default function App() {
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="bg-stone-50 text-stone-800 font-sans">
      <Style />
      <div className="min-h-screen">
        <Hero />
        <JobCategories />
        <FeaturedJobs />
        <Footer />
      </div>
    </div>
  );
}
