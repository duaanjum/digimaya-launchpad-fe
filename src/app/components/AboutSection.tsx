import { Shield, TrendingUp, Users, Globe2, Lock, Zap } from 'lucide-react';

export function AboutSection() {
  return (
    <section id="about" className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl mb-4 text-white">About DigiMaaya SpringBoard</h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Built on DigiMaaya's trusted infrastructure, SpringBoard provides
            institutional-grade security and compliance for Web3 fundraising
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{ backgroundColor: 'rgba(227, 16, 122, 0.2)' }}
            >
              <Shield className="w-6 h-6" style={{ color: '#E3107A' }} />
            </div>
            <h3 className="text-xl mb-3 text-white">Secure & Audited</h3>
            <p className="text-gray-400">
              All smart contracts are thoroughly audited by leading security
              firms. Your funds are protected with institutional-grade security.
            </p>
          </div>

          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{ backgroundColor: 'rgba(255, 127, 44, 0.2)' }}
            >
              <Lock className="w-6 h-6" style={{ color: '#FF7F2C' }} />
            </div>
            <h3 className="text-xl mb-3 text-white">Regulatory Ready</h3>
            <p className="text-gray-400">
              Built with compliance in mind. KYC/AML processes ensure a
              legitimate and transparent fundraising environment.
            </p>
          </div>

          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{ backgroundColor: 'rgba(227, 16, 122, 0.2)' }}
            >
              <Users className="w-6 h-6" style={{ color: '#E3107A' }} />
            </div>
            <h3 className="text-xl mb-3 text-white">Community First</h3>
            <p className="text-gray-400">
              Fair access for retail investors. No private pre-sales or unfair
              advantages for insiders.
            </p>
          </div>

          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{ backgroundColor: 'rgba(255, 127, 44, 0.2)' }}
            >
              <TrendingUp className="w-6 h-6" style={{ color: '#FF7F2C' }} />
            </div>
            <h3 className="text-xl mb-3 text-white">Transparent Tracking</h3>
            <p className="text-gray-400">
              Real-time updates on fundraising progress. All transactions
              verified on-chain for complete transparency.
            </p>
          </div>

          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{ backgroundColor: 'rgba(227, 16, 122, 0.2)' }}
            >
              <Globe2 className="w-6 h-6" style={{ color: '#E3107A' }} />
            </div>
            <h3 className="text-xl mb-3 text-white">Global Access</h3>
            <p className="text-gray-400">
              Participate from anywhere in the world. Multiple payment methods
              including crypto and fiat options.
            </p>
          </div>

          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{ backgroundColor: 'rgba(255, 127, 44, 0.2)' }}
            >
              <Zap className="w-6 h-6" style={{ color: '#FF7F2C' }} />
            </div>
            <h3 className="text-xl mb-3 text-white">Fast & Efficient</h3>
            <p className="text-gray-400">
              Instant participation with Web3 wallets. Card payments processed
              quickly with no delays.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 bg-gray-800 border border-gray-700 px-8 py-4 rounded-xl">
            <div className="text-left">
              <p className="text-sm text-gray-400 mb-1">
                Powered by
              </p>
              <p className="font-maven-pro" style={{ color: '#E3107A' }}>
                DigiMaaya Infrastructure
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}