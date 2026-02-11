import type { DashboardProject } from '@/app/data/projects';
import { Progress } from '@/app/components/ui/progress';
import { Wallet, CreditCard, Coins } from 'lucide-react';

interface LiveSaleProps {
  project: DashboardProject;
  onViewDetails: (projectId: string) => void;
}

export function LiveSale({ project, onViewDetails }: LiveSaleProps) {
  return (
    <section id="live-sales" className="py-16 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl mb-4 text-white">Live Sale</h2>
          <p className="text-gray-400 text-lg">
            Participate in our currently active fundraising round
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-pink-900/30 to-orange-900/30 p-1 rounded-2xl">
            <div className="bg-gray-900 p-8 rounded-2xl">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <img
                    src={project.logo}
                    alt={project.name}
                    className="w-full h-48 object-contain rounded-xl bg-gray-900"
                  />
                </div>

                <div className="md:w-2/3">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl mb-2 text-white">{project.name}</h3>
                      <p className="text-gray-400">
                        {project.description}
                      </p>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-maven-pro bg-green-900/50 flex items-center gap-2"
                      style={{ color: '#E3107A' }}
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                      </span>
                      LIVE
                    </span>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-maven-pro text-gray-400">
                        Raised
                      </span>
                      <span className="text-sm font-maven-pro text-white">
                        {project.raised ?? '—'} / {project.hardCap ?? '—'}
                      </span>
                    </div>
                    <Progress value={project.progress ?? 0} className="h-3 mb-1" />
                    <p className="text-xs text-gray-400 font-maven-pro">
                      {project.progress ?? 0}% of Hard Cap
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <p className="text-xs text-gray-400 mb-1">
                        Soft Cap
                      </p>
                      <p className="text-lg font-maven-pro text-white">{project.softCap ?? '—'}</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <p className="text-xs text-gray-400 mb-1">
                        Hard Cap
                      </p>
                      <p className="text-lg font-maven-pro text-white">{project.hardCap ?? '—'}</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <p className="text-xs text-gray-400 mb-1">
                        Token Price
                      </p>
                      <p className="text-lg font-maven-pro text-white">{project.tokenPrice}</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <p className="text-xs text-gray-400 mb-1">
                        Sale Ends
                      </p>
                      <p className="text-sm font-maven-pro text-white">{project.saleEnd ?? '—'}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-xs text-gray-400 mb-3">
                      Accepted Payments
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(project.acceptedPayments ?? []).map((payment) => (
                        <div
                          key={payment}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                        >
                          {payment === 'Card' ? (
                            <CreditCard className="w-4 h-4 text-gray-300" />
                          ) : (
                            <Coins className="w-4 h-4 text-gray-300" />
                          )}
                          <span className="text-sm font-maven-pro text-white">
                            {payment}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      className="flex-1 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      style={{ background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)' }}
                    >
                      <Wallet className="w-5 h-5" />
                      Participate Now
                    </button>
                    <button
                      onClick={() => onViewDetails(project.id)}
                      className="px-6 py-3 border-2 border-gray-700 rounded-lg hover:border-primary transition-colors text-white"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}