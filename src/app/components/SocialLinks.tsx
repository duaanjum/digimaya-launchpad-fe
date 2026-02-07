import { Send, Linkedin, Youtube } from 'lucide-react';
import { XIcon } from '@/app/components/icons/XIcon';

interface SocialLinksProps {
  className?: string;
}

export function SocialLinks({ className = '' }: SocialLinksProps) {
  const socialLinks = [
    {
      name: 'X',
      url: 'https://x.com/DigiMaaya',
      icon: XIcon,
    },
    {
      name: 'Telegram',
      url: 'https://t.me/DigiMaayaOfficial',
      icon: Send,
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/company/digimaaya',
      icon: Linkedin,
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com/@digimaaya',
      icon: Youtube,
    },
  ];

  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <span className="text-sm text-gray-300 font-maven-pro">
        DigiMaaya SPRINGBOARD:
      </span>
      {socialLinks.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center hover:border-primary transition-colors"
            title={social.name}
          >
            <Icon className="w-5 h-5" style={{ color: '#E3107A' }} />
          </a>
        );
      })}
    </div>
  );
}