import digimaayaLogo from 'figma:asset/875cae2f20c002d2f45cd08d3c927dde653b100b.png';
import { Linkedin, Send, Globe, Bot, ExternalLink, FileText, MapPin } from 'lucide-react';
import { XIcon } from '@/app/components/icons/XIcon';

export function Footer() {
  const footerLinks = [
    {
      name: 'DigiMaaya Website',
      url: 'https://digimaaya.com/',
      icon: Globe,
    },
    {
      name: 'X',
      url: 'https://x.com/DigiMaaya',
      icon: XIcon,
    },
    {
      name: 'Telegram Chat',
      url: 'https://t.me/DigiMaayaChat',
      icon: Send,
    },
    {
      name: 'Maaya Points Bot',
      url: 'https://t.me/Maaya_Points_bot',
      icon: Bot,
    },
    {
      name: 'Linktree',
      url: 'https://linktr.ee/Digi.Maaya',
      icon: ExternalLink,
    },
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-4">
              <img src={digimaayaLogo} alt="DigiMaaya" className="h-10 w-auto" />
              <div>
                <h3 className="font-maven-pro" style={{
                  background: 'linear-gradient(135deg, #E3107A 0%, #FF7F2C 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  SpringBoard
                </h3>
                <p className="text-xs text-gray-400">by DigiMaaya</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-md mb-4">
              The institutional-grade fundraising infrastructure for Web3. Secure,
              compliant, and community-driven token launches.
            </p>
            <div className="flex items-start gap-2 text-sm text-gray-400 mt-4">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>Euro House, Richmond Hill Road, Kingstown, St. Vincent and the Grenadines.</p>
            </div>
          </div>

          <div>
            <h4 className="mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Live Sales
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Upcoming Projects
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Past Projects
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              {footerLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.name}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {link.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-4 text-sm">
              <a
                href="https://emaaya.digimaaya.com/#/disclaimer-and-agreement"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Disclaimer
              </a>
              <a
                href="https://emaaya.digimaaya.com/assets/docs/company-license.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Company License
              </a>
            </div>

            <div className="flex gap-4">
              <a
                href="https://x.com/DigiMaaya"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/digimaaya"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://t.me/DigiMaayaChat"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <p className="text-sm text-gray-400 text-center md:text-left">
            © 2026 DigiMaaya. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}