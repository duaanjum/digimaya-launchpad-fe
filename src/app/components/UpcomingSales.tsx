import { useState } from 'react';
import { Project } from '@/app/data/projects';
import { ChevronLeft, ChevronRight, Calendar, Tag } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

interface UpcomingSalesProps {
  projects: Project[];
}

export function UpcomingSales({ projects }: UpcomingSalesProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [intendedAmount, setIntendedAmount] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInterestClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleSubmitInterest = () => {
    // In a real app, this would send data to backend
    alert(
      `Thank you! We've recorded your interest in ${selectedProject?.name} for ${intendedAmount}`
    );
    setIsModalOpen(false);
    setIntendedAmount('');
    setSelectedProject(null);
  };

  return (
    <>
      <section id="upcoming-sales" className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl mb-4 text-white">Upcoming Sales</h2>
            <p className="text-gray-400 text-lg">
              Express your interest in upcoming projects
            </p>
          </div>

          <div className="relative">
            <div className="overflow-x-auto pb-4 hide-scrollbar">
              <div className="flex gap-6" style={{ minWidth: 'min-content' }}>
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow flex-shrink-0 w-80"
                  >
                    <img
                      src={project.logo}
                      alt={project.name}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
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
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {project.description}
                      </p>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400">
                          Sale starts:
                        </span>
                        <span className="font-maven-pro text-white">
                          {project.saleStart}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400">Price:</span>
                        <span className="font-maven-pro text-white">
                          {project.tokenPrice}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-700">
                      <span className="text-xs text-gray-400 block mb-3 text-center">
                        Coming Soon
                      </span>
                      <button
                        onClick={() => handleInterestClick(project)}
                        className="w-full text-white px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
                        style={{ background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)' }}
                      >
                        I want to participate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Express Your Interest
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Let us know how much you would like to participate.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Project</p>
              <p className="font-maven-pro">{selectedProject?.name}</p>
            </div>

            <div>
              <Label htmlFor="amount" className="mb-2 block">
                Intended Participation Amount (USD)
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="e.g., 500"
                value={intendedAmount}
                onChange={(e) => setIntendedAmount(e.target.value)}
                className="font-maven-pro"
              />
              <p className="text-xs text-muted-foreground mt-2">
                This is a non-binding interest signal
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSubmitInterest}
                disabled={!intendedAmount}
                className="flex-1 text-white px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)' }}
              >
                Submit Interest
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIntendedAmount('');
                }}
                className="px-4 py-2.5 border-2 border-border rounded-lg hover:border-primary transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}