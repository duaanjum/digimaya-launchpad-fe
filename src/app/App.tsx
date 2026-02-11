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
import { projects, type Project } from '@/app/data/projects';
import type { DashboardProject } from '@/app/data/projects';
import { projectsApi, type ApiProject } from '@/app/lib/api';

function projectToDashboardProject(p: Project): DashboardProject {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    category: p.category,
    logo: p.logo,
    status: p.status,
    tokenPrice: p.tokenPrice,
    softCap: p.softCap,
    hardCap: p.hardCap,
    raised: p.raised,
    progress: p.progress,
    acceptedPayments: p.acceptedPayments,
    saleStart: p.saleStart,
    saleEnd: p.saleEnd,
    roi: p.roi,
  };
}

type View = 'home' | 'project' | 'profile';

const INITIAL_VIEW: View =
  typeof sessionStorage !== 'undefined' && sessionStorage.getItem('google_oauth_landing')
    ? 'profile'
    : 'home';

function mapApiProjectToDashboard(
  api: ApiProject,
  status: 'live' | 'upcoming' | 'completed'
): DashboardProject {
  const sale = api.sales?.[0];
  const round = sale?.rounds?.[0];
  const startTime = round?.start_time;
  const endTime = round?.end_time;
  const tokenPrice = sale?.token_price;
  const target = sale?.total_raise_target;

  return {
    id: api.id,
    name: api.name,
    description: api.description ?? '',
    category: api.category ?? '—',
    logo: api.logo_url ?? '',
    status,
    tokenPrice:
      tokenPrice != null ? `$${Number(tokenPrice).toFixed(2)}` : '—',
    saleStart: startTime
      ? new Date(startTime).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : undefined,
    saleEnd: endTime
      ? new Date(endTime).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : undefined,
    raised:
      target != null ? `Target: $${Number(target).toLocaleString()}` : '—',
    progress: 0,
    roi: undefined,
    acceptedPayments: [],
  };
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>(() => {
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('google_oauth_landing')) {
      return 'profile';
    }
    return INITIAL_VIEW;
  });
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const [liveProjects, setLiveProjects] = useState<DashboardProject[]>([]);
  const [upcomingProjects, setUpcomingProjects] = useState<DashboardProject[]>([]);
  const [pastProjects, setPastProjects] = useState<DashboardProject[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [apiProjectDetail, setApiProjectDetail] = useState<ApiProject | null>(null);
  const [projectDetailLoading, setProjectDetailLoading] = useState(false);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setProjectsLoading(true);
    setProjectsError(null);
    Promise.all([
      projectsApi.getProjects('LIVE'),
      projectsApi.getProjects('UPCOMING'),
      projectsApi.getProjects('CLOSED'),
    ])
      .then(([live, upcoming, past]) => {
        setLiveProjects(live.map((p) => mapApiProjectToDashboard(p, 'live')));
        setUpcomingProjects(upcoming.map((p) => mapApiProjectToDashboard(p, 'upcoming')));
        setPastProjects(past.map((p) => mapApiProjectToDashboard(p, 'completed')));
      })
      .catch((err) => {
        setProjectsError(err?.message ?? 'Failed to load projects');
        setLiveProjects([]);
        setUpcomingProjects([]);
        setPastProjects([]);
      })
      .finally(() => setProjectsLoading(false));
  }, []);

  function LiveSaleEmpty() {
    return (
      <section id="live-sales" className="py-16 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl mb-4 text-white">Live Sale</h2>
            <p className="text-gray-400 text-lg">
              Participate in our currently active fundraising round
            </p>
          </div>
          <div className="text-center text-gray-400 py-8">
            No live sale at the moment.
          </div>
        </div>
      </section>
    );
  }

  // After Google OAuth redirect: land on profile. Run on mount (with short delay so auth is ready) and when auth becomes true.
  useEffect(() => {
    if (typeof sessionStorage === 'undefined') return;
    const goToProfile = () => {
      if (sessionStorage.getItem('google_oauth_landing') && isAuthenticated) {
        setCurrentView('profile');
        sessionStorage.removeItem('google_oauth_landing');
      }
    };
    goToProfile();
    const t = window.setTimeout(goToProfile, 100);
    return () => window.clearTimeout(t);
  }, [isAuthenticated]);

  const staticLiveProject = projects.find((p) => p.status === 'live');
  const liveProject =
    liveProjects[0] ?? (staticLiveProject ? projectToDashboardProject(staticLiveProject) : null);

  const handleViewDetails = (projectId: string) => {
    setSelectedProjectId(projectId);
    setApiProjectDetail(null);
    setCurrentView('project');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // When viewing project detail and not in static list, fetch GET /api/v1/projects/:id
  useEffect(() => {
    if (currentView !== 'project' || !selectedProjectId) {
      setApiProjectDetail(null);
      return;
    }
    const fromStatic = projects.find((p) => p.id === selectedProjectId);
    if (fromStatic) {
      setApiProjectDetail(null);
      return;
    }
    setProjectDetailLoading(true);
    projectsApi
      .getProject(selectedProjectId)
      .then(setApiProjectDetail)
      .catch(() => setApiProjectDetail(null))
      .finally(() => setProjectDetailLoading(false));
  }, [currentView, selectedProjectId]);

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
  const selectedProjectForDetail =
    selectedProject ?? (apiProjectDetail ? mapApiProjectToProject(apiProjectDetail) : null);

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

          {projectsLoading ? (
            <section className="py-16 bg-gray-950">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
                Loading projects…
              </div>
            </section>
          ) : projectsError ? (
            <section className="py-16 bg-gray-950">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-amber-400">
                {projectsError}
              </div>
            </section>
          ) : (
            <>
              {liveProject ? (
                <LiveSale project={liveProject} onViewDetails={handleViewDetails} />
              ) : (
                <LiveSaleEmpty />
              )}

              <UpcomingSales projects={upcomingProjects} />

              <PastProjects
                projects={pastProjects}
                onViewDetails={handleViewDetails}
              />
            </>
          )}

          <AboutSection />
          <PlatformStats />
        </main>
      ) : currentView === 'profile' ? (
        <ProfilePage onBack={handleBackToHome} />
      ) : currentView === 'project' ? (
        projectDetailLoading && !selectedProject ? (
          <section className="py-16 bg-gray-950 text-center text-gray-400">
            Loading project…
          </section>
        ) : selectedProjectForDetail ? (
          <ProjectDetailPage
            project={selectedProjectForDetail}
            onBack={handleBackToHome}
          />
        ) : (
          <section className="py-16 bg-gray-950 text-center text-amber-400">
            Project not found.
          </section>
        )
      ) : null}

      {currentView !== 'profile' && <Footer />}
      <ScrollToTop />
    </div>
  );
}
