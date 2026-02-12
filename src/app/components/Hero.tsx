import { CheckCircle2, Users, Shield, Globe } from 'lucide-react';
import { SocialLinks } from '@/app/components/SocialLinks';

export function Hero() {
  const scrollToLiveSales = () => {
    const element = document.getElementById('live-sales');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToUpcoming = () => {
    const element = document.getElementById('upcoming-sales');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="bg-gradient-to-b from-gray-950 to-gray-900 py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl mb-6"
          style={{
            background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          DigiMaaya SpringBoard
        </h1>
        <p
          className="text-xl sm:text-2xl mb-4 font-maven-pro"
          style={{ color: '#E3107A' }}
        >
          The Retail Fundraising Infrastructure for Web3
        </p>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
        DigiMaaya SpringBoard is an incubation and acceleration platform powered by AI,
        designed to help Web2 companies seamlessly pivot into Web3,
        while empowering Web3 founders to transform bold visions and early-stage ideas into real, scalable products.
        </p>

        <SocialLinks className="mb-12" />

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <button
            onClick={scrollToLiveSales}
            className="text-white px-8 py-3 rounded-lg hover:opacity-90 transition-opacity text-lg"
            style={{ background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)' }}
          >
            View Live Sales
          </button>
          <button
            onClick={scrollToUpcoming}
            className="bg-gray-800 text-white border-2 border-gray-700 px-8 py-3 rounded-lg hover:border-primary transition-colors text-lg"
          >
            Explore Upcoming Projects
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <Users
              className="w-10 h-10 mb-3 mx-auto"
              style={{ color: '#E3107A' }}
            />
            <h3 className="text-sm mb-2 text-white">Community-driven fundraising</h3>
            <p className="text-xs text-gray-400">
              Empowering retail investors worldwide
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <CheckCircle2
              className="w-10 h-10 mb-3 mx-auto"
              style={{ color: '#FF7F2C' }}
            />
            <h3 className="text-sm mb-2 text-white">Transparent raise mechanics</h3>
            <p className="text-xs text-gray-400">
              Real-time tracking and full disclosure
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <Shield
              className="w-10 h-10 mb-3 mx-auto"
              style={{ color: '#E3107A' }}
            />
            <h3 className="text-sm mb-2 text-white">Web2 + Web3 friendly</h3>
            <p className="text-xs text-gray-400">
              Crypto wallets or card payments
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <Globe
              className="w-10 h-10 mb-3 mx-auto"
              style={{ color: '#FF7F2C' }}
            />
            <h3 className="text-sm mb-2 text-white">Built for global retail</h3>
            <p className="text-xs text-gray-400">
              Accessible, regulated-ready platform
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}