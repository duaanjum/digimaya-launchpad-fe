import { motion } from 'motion/react';
import { TrendingUp, ExternalLink } from 'lucide-react';

export function PlatformStats() {
  const fundingStats = [
    {
      category: 'SEED',
      amount: '$200K',
      label: 'CAPITAL RAISED',
      status: 'Completed',
      statusColor: 'text-green-600',
    },
    {
      category: 'ACTIVE',
      amount: '$1M+',
      label: 'PRESALE',
      status: 'In Progress',
      statusColor: 'text-blue-600',
    },
    {
      category: 'UPCOMING',
      amount: '$1.6M',
      label: 'PUBLIC ROUND',
      status: 'Q1 2026',
      statusColor: 'text-purple-600',
    },
    {
      category: 'PIPELINE',
      amount: '$70M+',
      label: 'DRAW DOWNS',
      status: 'Institutional',
      statusColor: 'text-orange-600',
    },
  ];

  const platformMetrics = [
    {
      value: '200K',
      label: 'Registered Users',
      description: 'Loyalty Points app for Task to Earn & Tap to earn',
      link: '#',
    },
    {
      value: '100+',
      label: 'TechEZ Events',
      description: 'IRL & Online Events Organization',
      link: '#',
    },
    {
      value: '7K+',
      label: 'Springboard webapp',
      description: 'Investors and Influencers',
      link: '#',
    },
    {
      value: '100+',
      label: 'Strategic Partnerships',
      description: 'Vendors & Collabs',
      link: null,
    },
    {
      value: '400+',
      label: 'Ambassadors',
      link: '#',
    },
    {
      value: '120+',
      label: 'Creators',
      link: '#',
    },
    {
      value: '50+',
      label: 'KOL',
      link: null,
    },
  ];

  const socialReach = [
    { value: '28K+', label: 'X (Twitter)', link: '#' },
    { value: '40K+', label: 'Telegram', link: '#' },
    { value: '30K+', label: 'Other Channels', link: '#' },
  ];

  return (
    <section className="bg-gradient-to-b from-gray-900 to-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Funding Stats */}
        {/* Removed funding stats section */}

        <hr className="border-gray-700 mb-6" />

        {/* Platform Metrics */}
        <div className="mb-6">
          <h3
            className="text-center text-gray-400 mb-4 uppercase tracking-wide text-xs font-maven-pro"
          >
            PLATFORM METRICS
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            {platformMetrics.slice(0, 4).map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900 rounded-lg p-3 border border-gray-800"
              >
                <div className="text-xl font-maven-pro font-bold text-white mb-0.5">
                  {metric.value}
                </div>
                <div className="text-xs text-gray-400 mb-0.5">{metric.label}</div>
                {metric.description && (
                  <div className="text-xs text-orange-500 mb-0.5">
                    {metric.description}
                  </div>
                )}
                {metric.link && (
                  <ExternalLink className="w-3 h-3 text-blue-500" />
                )}
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto">
            {platformMetrics.slice(4).map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: (index + 4) * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900 rounded-lg p-3 border border-gray-800"
              >
                <div className="text-xl font-maven-pro font-bold text-white mb-0.5">
                  {metric.value}
                </div>
                <div className="text-xs text-gray-400 mb-0.5">{metric.label}</div>
                {metric.link && (
                  <ExternalLink className="w-3 h-3 text-blue-500" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <hr className="border-gray-700 mb-6" />

        {/* Social Reach */}
        <div>
          <h3
            className="text-center text-gray-400 mb-4 uppercase tracking-wide text-xs font-maven-pro"
          >
            SOCIAL REACH
          </h3>
          <div className="grid grid-cols-3 gap-3 max-w-3xl mx-auto">
            {socialReach.map((social, index) => (
              <motion.div
                key={social.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900 rounded-lg p-3 border border-gray-800"
              >
                <div className="text-xl font-maven-pro font-bold text-white mb-0.5">
                  {social.value}
                </div>
                <div className="text-xs text-gray-400 mb-0.5">{social.label}</div>
                {social.link && (
                  <ExternalLink className="w-3 h-3 text-blue-500" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}