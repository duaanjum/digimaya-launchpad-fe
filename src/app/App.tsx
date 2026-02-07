import { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { Header } from '@/app/components/Header';
import { Hero } from '@/app/components/Hero';
import { StatsBanner } from '@/app/components/StatsBanner';
import { LiveSale } from '@/app/components/LiveSale';
import { UpcomingSales } from '@/app/components/UpcomingSales';
import { PastProjects } from '@/app/components/PastProjects';
import { AboutSection } from '@/app/components/AboutSection';
import { PlatformStats } from '@/app/components/PlatformStats';
import { ProjectDetailPage } from '@/app/components/ProjectDetailPage';
import { ProfilePage } from '@/app/components/ProfilePage';
import { Footer } from '@/app/components/Footer';
import { ScrollToTop } from '@/app/components/ScrollToTop';
import { projects } from '@/app/data/projects';

type View = 'home' | 'project' | 'profile';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const { isAuthenticated } = useAuth();

  const liveProject = projects.find((p) => p.status === 'live');
  const upcomingProjects = projects.filter((p) => p.status === 'upcoming');
  const pastProjects = projects.filter((p) => p.status === 'completed');

  const handleViewDetails = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentView('project');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedProjectId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewProfile = () => {
    setCurrentView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate home when user logs out while on profile
  useEffect(() => {
    if (!isAuthenticated && currentView === 'profile') {
      setCurrentView('home');
    }
  }, [isAuthenticated, currentView]);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onLogoClick={handleBackToHome}
        onViewProfile={handleViewProfile}
      />

      {currentView === 'home' ? (
        <main className="flex-1">
          <Hero />
          <StatsBanner />

          {liveProject && (
            <LiveSale project={liveProject} onViewDetails={handleViewDetails} />
          )}

          {upcomingProjects.length > 0 && (
            <UpcomingSales projects={upcomingProjects} />
          )}

          {pastProjects.length > 0 && (
            <PastProjects
              projects={pastProjects}
              onViewDetails={handleViewDetails}
            />
          )}

          <AboutSection />
          <PlatformStats />
        </main>
      ) : currentView === 'profile' ? (
        <ProfilePage onBack={handleBackToHome} />
      ) : (
        selectedProject && (
          <ProjectDetailPage
            project={selectedProject}
            onBack={handleBackToHome}
          />
        )
      )}

      {currentView !== 'profile' && <Footer />}
      <ScrollToTop />
    </div>
  );
}
