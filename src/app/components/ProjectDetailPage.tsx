import { Project } from '@/app/data/projects';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { ArrowLeft, ExternalLink, Linkedin, CheckCircle2, Clock, Circle, Send, Globe, MessageSquare } from 'lucide-react';
import { Progress } from '@/app/components/ui/progress';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { XIcon } from '@/app/components/icons/XIcon';

interface ProjectDetailPageProps {
  project: Project;
  onBack: () => void;
}

export function ProjectDetailPage({ project, onBack }: ProjectDetailPageProps) {
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Projects
          </button>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="lg:w-2/3">
              <div className="flex items-start gap-6 mb-6">
                <ImageWithFallback
                  src={project.logo}
                  alt={project.name}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl">{project.name}</h1>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-maven-pro ${
                        project.status === 'live'
                          ? 'bg-green-100 text-green-700'
                          : project.status === 'upcoming'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {project.status.charAt(0).toUpperCase() +
                        project.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-lg text-muted-foreground mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span
                      className="px-3 py-1 rounded-lg text-sm font-maven-pro"
                      style={{
                        backgroundColor: '#FFF0F8',
                        color: '#E3107A',
                      }}
                    >
                      {project.category}
                    </span>
                  </div>
                  
                  {/* Project Social Links */}
                  {project.socials && (
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">Follow:</span>
                      {project.socials.twitter && (
                        <a
                          href={project.socials.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 bg-transparent border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-colors"
                          title="X"
                        >
                          <XIcon className="w-4 h-4" />
                        </a>
                      )}
                      {project.socials.telegram && (
                        <a
                          href={project.socials.telegram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 bg-transparent border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-colors"
                          title="Telegram"
                        >
                          <Send className="w-4 h-4" />
                        </a>
                      )}
                      {project.socials.website && (
                        <a
                          href={project.socials.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 bg-transparent border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-colors"
                          title="Website"
                        >
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                      {project.socials.discord && (
                        <a
                          href={project.socials.discord}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 bg-transparent border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-colors"
                          title="Discord"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:w-1/3 w-full">
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                <h3 className="text-lg mb-4 text-white">Key Statistics</h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-400">
                        Total Raised
                      </span>
                      <span className="font-maven-pro text-white">{project.raised}</span>
                    </div>
                    {project.status === 'live' && (
                      <Progress value={project.progress} className="h-2" />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                      <p className="text-xs text-gray-400 mb-1">
                        Soft Cap
                      </p>
                      <p className="font-maven-pro text-sm text-white">{project.softCap}</p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                      <p className="text-xs text-gray-400 mb-1">
                        Hard Cap
                      </p>
                      <p className="font-maven-pro text-sm text-white">{project.hardCap}</p>
                    </div>
                  </div>

                  <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                    <p className="text-xs text-gray-400 mb-1">
                      Token Price
                    </p>
                    <p className="font-maven-pro text-lg text-white">{project.tokenPrice}</p>
                  </div>

                  {project.saleStart && (
                    <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                      <p className="text-xs text-gray-400 mb-1">
                        Sale Timeline
                      </p>
                      <p className="text-sm font-maven-pro text-white">
                        {project.saleStart} - {project.saleEnd}
                      </p>
                    </div>
                  )}
                </div>

                {project.status === 'live' && (
                  <button 
                    className="w-full text-white py-3 rounded-lg hover:opacity-90 transition-opacity"
                    style={{ background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)' }}
                  >
                    Participate in Sale
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="info">Project Info</TabsTrigger>
            <TabsTrigger value="token">Token Details</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="investors">Investors & Partners</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-8">
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
              <h2 className="text-2xl mb-6 text-white">About {project.name}</h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                {project.fullDescription}
              </p>

              <h3 className="text-xl mb-6 text-white">Flightmap</h3>
              <div className="space-y-6">
                {project.roadmap.map((phase, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          phase.status === 'completed'
                            ? 'bg-green-100'
                            : phase.status === 'current'
                            ? 'bg-blue-100'
                            : 'bg-gray-100'
                        }`}
                      >
                        {phase.status === 'completed' ? (
                          <CheckCircle2
                            className="w-5 h-5"
                            style={{ color: '#10B981' }}
                          />
                        ) : phase.status === 'current' ? (
                          <Clock
                            className="w-5 h-5"
                            style={{ color: '#3B82F6' }}
                          />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      {index < project.roadmap.length - 1 && (
                        <div className="w-0.5 h-full bg-border mt-2" />
                      )}
                    </div>

                    <div className="flex-1 pb-8">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg">{phase.phase}</h4>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-maven-pro ${
                            phase.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : phase.status === 'current'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {phase.status}
                        </span>
                      </div>
                      <p className="text-sm mb-3">{phase.title}</p>
                      <ul className="space-y-1">
                        {phase.items.map((item, i) => (
                          <li
                            key={i}
                            className="text-sm text-muted-foreground flex items-start gap-2"
                          >
                            <span className="text-primary mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="token" className="space-y-8">
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
              <h2 className="text-2xl mb-6 text-white">Token Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-400 mb-2">
                    Token Symbol
                  </p>
                  <p className="text-2xl font-maven-pro text-white">
                    {project.tokenDetails.symbol}
                  </p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-400 mb-2">
                    Total Supply
                  </p>
                  <p className="text-2xl font-maven-pro text-white">
                    {project.tokenDetails.totalSupply}
                  </p>
                </div>
              </div>

              <h3 className="text-xl mb-4 text-white">Token Allocation</h3>
              <div className="space-y-3 mb-8">
                {project.tokenDetails.allocation.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-white">{item.label}</span>
                      <span className="text-sm font-maven-pro text-white">
                        {item.percentage}%
                      </span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </div>

              <h3 className="text-xl mb-4 text-white">Vesting Schedule</h3>
              <div className="bg-blue-900/30 p-4 rounded-lg mb-8 border border-blue-800">
                <p className="text-sm text-gray-300">{project.tokenDetails.vesting}</p>
              </div>

              <h3 className="text-xl mb-4 text-white">Token Utility</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.tokenDetails.utility.map((utility, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <CheckCircle2
                      className="w-5 h-5 flex-shrink-0 mt-0.5"
                      style={{ color: '#E3107A' }}
                    />
                    <span className="text-sm text-gray-300">{utility}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="team">
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
              <h2 className="text-2xl mb-6 text-white">Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.team.map((member, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 p-6 rounded-lg border border-gray-700"
                  >
                    <div className="flex gap-4 mb-4">
                      {member.image ? (
                        <ImageWithFallback
                          src={member.image}
                          alt={member.name}
                          className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-pink-200 to-orange-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl text-gray-900">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="mb-1 text-white">{member.name}</h4>
                        <p className="text-sm text-gray-400 mb-2">
                          {member.role}
                        </p>
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            className="inline-flex items-center gap-1 text-sm hover:text-primary transition-colors"
                            style={{ color: '#E3107A' }}
                          >
                            <Linkedin className="w-4 h-4" />
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </div>
                    {member.bio && (
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {member.bio}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="investors">
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
              <h2 className="text-2xl mb-6 text-white">Investors & Partners</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {project.investors.map((investor, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 p-6 rounded-lg flex items-center justify-center hover:shadow-md transition-shadow border border-gray-700"
                  >
                    <p className="font-maven-pro text-center text-white">{investor}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
              <h2 className="text-2xl mb-6 text-white">Documents</h2>
              <div className="space-y-4">
                {project.documents.whitepaper && (
                  <a
                    href={project.documents.whitepaper}
                    className="flex items-center justify-between p-6 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors group border border-gray-700"
                  >
                    <div>
                      <h4 className="mb-1 text-white">Whitepaper</h4>
                      <p className="text-sm text-gray-400">
                        Technical documentation and project overview
                      </p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                  </a>
                )}
                {project.documents.pitchDeck && (
                  <a
                    href="https://drive.google.com/file/d/1vBovksLLGv_VF3W-9IvF1usc2Jy_ohK-/view"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-6 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors group border border-gray-700"
                  >
                    <div>
                      <h4 className="mb-1 text-white">Pitch Deck</h4>
                      <p className="text-sm text-gray-400">
                        Investor presentation and business model
                      </p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                  </a>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}