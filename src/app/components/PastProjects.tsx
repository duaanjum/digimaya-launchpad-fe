import { Project } from '@/app/data/projects';
import { CheckCircle } from 'lucide-react';

interface PastProjectsProps {
  projects: Project[];
  onViewDetails: (projectId: string) => void;
}

export function PastProjects({ projects, onViewDetails }: PastProjectsProps) {
  return (
    <section id="past-projects" className="py-16 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl mb-4 text-white">Past Projects</h2>
          <p className="text-gray-400 text-lg">
            Successfully completed fundraising campaigns
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => onViewDetails(project.id)}
              className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="relative">
                <img
                  src={project.logo}
                  alt={project.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Completed
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl text-white">{project.name}</h3>
                  <span
                    className="px-2 py-1 rounded text-xs font-maven-pro"
                    style={{
                      backgroundColor: 'rgba(227, 16, 122, 0.15)',
                      color: '#E3107A',
                    }}
                  >
                    {project.category}
                  </span>
                </div>

                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                  {project.description}
                </p>

                <div className="space-y-2 pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">
                      Total Raised
                    </span>
                    <span
                      className="font-maven-pro"
                      style={{ color: '#E3107A' }}
                    >
                      {project.raised}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">
                      Token Price
                    </span>
                    <span className="text-sm font-maven-pro text-white">
                      {project.tokenPrice}
                    </span>
                  </div>
                  {project.roi && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">
                        ROI
                      </span>
                      <span
                        className="text-sm font-maven-pro"
                        style={{ color: '#FF7F2C' }}
                      >
                        {project.roi}
                      </span>
                    </div>
                  )}
                </div>

                <button 
                  className="w-full mt-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity text-sm"
                  style={{ background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)' }}
                >
                  View Project Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}