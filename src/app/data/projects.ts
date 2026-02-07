import utsavImage from 'figma:asset/eb83ce26d5c804ad236785813352a215eed5d527.png';
import heeroImage from 'figma:asset/d2470220d4ba63bc014b74f651dde7296f56f7aa.png';
import punnooseImage from 'figma:asset/ec4a088973996e851ddd7e055d494e2632d67894.png';
import garimaImage from 'figma:asset/48eeda1673981f82ebb957a0e1c018d147133294.png';
import digimayaLogo from 'figma:asset/875cae2f20c002d2f45cd08d3c927dde653b100b.png';

export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  logo: string;
  status: 'live' | 'upcoming' | 'completed';
  tokenPrice: string;
  softCap: string;
  hardCap: string;
  raised: string;
  progress: number;
  acceptedPayments: string[];
  saleStart?: string;
  saleEnd?: string;
  roi?: string;
  socials?: {
    twitter?: string;
    telegram?: string;
    website?: string;
    discord?: string;
  };
  tokenDetails: {
    symbol: string;
    totalSupply: string;
    allocation: { label: string; percentage: number }[];
    vesting: string;
    utility: string[];
  };
  team: {
    name: string;
    role: string;
    linkedin?: string;
    image?: string;
    bio?: string;
  }[];
  investors: string[];
  documents: {
    whitepaper?: string;
    pitchDeck?: string;
  };
  fullDescription: string;
  roadmap: {
    phase: string;
    title: string;
    items: string[];
    status: 'completed' | 'current' | 'upcoming';
  }[];
}

export const projects: Project[] = [
  {
    id: 'digimaaya',
    name: 'DigiMaaya',
    description: 'Leading Web 2.5 digital asset exchange and digital bank focused on bridging CeFi and DeFi through secure and scalable infrastructure',
    category: 'Exchange',
    logo: digimayaLogo,
    status: 'live',
    tokenPrice: '$0.055',
    softCap: '$500,000',
    hardCap: '$5,000,000',
    raised: '$1,673,261',
    progress: 33.5,
    acceptedPayments: ['BNB', 'USDT', 'USDC', 'Card'],
    saleStart: 'January 10, 2026',
    saleEnd: 'January 31, 2026',
    roi: '100%',
    socials: {
      twitter: 'https://twitter.com/digimaaya',
      telegram: 'https://t.me/digimaaya',
      website: 'https://www.digimaaya.com',
      discord: 'https://discord.gg/digimaaya',
    },
    tokenDetails: {
      symbol: 'EMYA',
      totalSupply: '1,000,000,000',
      allocation: [
        { label: 'Public Round', percentage: 2.91 },
        { label: 'Pre-Sale', percentage: 3.18 },
        { label: 'Angel', percentage: 2.57 },
        { label: 'Strategic', percentage: 2.59 },
        { label: 'F&F', percentage: 2.50 },
        { label: 'Team', percentage: 16.00 },
        { label: 'Staking Rewards', percentage: 20.00 },
        { label: 'Treasury', percentage: 25.25 },
        { label: 'Liquid & MM', percentage: 8.00 },
        { label: 'Advisors', percentage: 6.00 },
        { label: 'Airdrop/Events', percentage: 6.00 },
        { label: 'OpEx', percentage: 5.00 },
      ],
      vesting: 'Public sale: 20% at TGE, Cliff 1 month, daily vesting over 9 months',
      utility: [
        'Trading fee discounts on DigiMaaya Exchange',
        'Staking rewards and yield generation',
        'Governance rights for platform decisions',
        'Access to exclusive fractional asset offerings',
        'CBDC-integrated banking features',
        'Premium features and services',
      ],
    },
    team: [
      { 
        name: 'Utsav Dar', 
        role: 'Co-Founder',
        image: utsavImage,
        bio: 'Utsav has over 2 decades of experience in Real Estate and Technology businesses, achieving $300M in Indian ventures. He has previously built & helped scale 20+ Web 3.0 platforms for clients globally. Over the years, he has received numerous Awards & Recognitions from Governments, Media & his peers.',
        linkedin: '#'
      },
      { 
        name: 'Heero Punjabi', 
        role: 'Co-Founder',
        image: heeroImage,
        bio: 'Heero has previously built and sold 4 technology businesses, one in the space of Web3 & Blockchain. He has been coding since the age of just 4 and currently leads at DigitMaaya in building & running the entire tech stack.',
        linkedin: '#'
      },
      { 
        name: 'Punnoose Joseph', 
        role: 'Co-Founder - CTO',
        image: punnooseImage,
        bio: 'Punnoose was the Technology Architect for NASDAQ, part of their team at Bengaluru, India. He has over two decades of experience in IT, with top Companies & Projects, he currently heads Technical Architecture & Internal Audits.',
        linkedin: '#'
      },
      { 
        name: 'Garima Singh', 
        role: 'Co-Founder - COO',
        image: garimaImage,
        bio: 'Garima brings 18 years of global technology leadership, driving large-scale innovation across emerging technologies and enterprises. A pioneering Blockchain leader with 15+ years of expertise, she is recognized across Asia as a top industry voice and trusted advisor to governments and 100+ in Blockchain and AI.',
        linkedin: '#'
      },
    ],
    investors: [
      'Large Cap VCs (Pre Series A)',
      'Four Strategic Web 3 VCs',
      'Amazon Grant Recipient',
      '300+ Retail Investors',
      '25M+ in Committed Investments',
    ],
    documents: {
      whitepaper: '#',
      pitchDeck: '#',
    },
    fullDescription:
      'DIGIMAAYA is a leading and upcoming Web 2.5 digital asset exchange and digital bank focused on bridging CeFi and DeFi through secure and scalable infrastructure. With a globally awarded team, it delivers cutting-edge services in finance and fractional asset offerings. The platform supports CBDC-integrated banking, targets both new and seasoned retail investors, and features a fast-scaling user base of over 150K. Two core products are live, with more launching through 2025-2026. Maaya has 25M in committed investments from large cap VCs for its Pre Series A equity round. Currently four Web 3 VCs have made strategic investments in $EMYA, also received a grant from Amazon. eMaaya Exchange Token also has over 300 retail investors from Jan till date. Now $EMYA is available in an exclusive sale offering specially for OpenPad users.',
    roadmap: [
      {
        phase: 'Stage 2026',
        title: 'Exchange Launch & Growth Acceleration',
        items: [
          'Launch Spot + Futures Exchange in Q1',
          'Close two Equity Rounds to accelerate growth',
          'Feature Unlock: Subscription Model, Auto Tax Calculator, Financial Health Card, E-Identity, Nominee Facility',
          'Build Architecture & Use cases for Interoperability of Utility Token',
          'Customer Service: FAQ, BOT, Manual, 3-9 languages',
          'Users: Q1: 100k, Q2: 1M - 5M, Q3: 5-15M, Q4: up to 17M',
          'Revenue $30K - $500K per day'
        ],
        status: 'current',
      },
      {
        phase: 'Stage 2027',
        title: 'AI Integration & Global Expansion',
        items: [
          'Launch of Madam Maaya AI Agent & LMS content series',
          'Launch Cloud Services for scaling up',
          'Global Licensing + Compliance for Banking Services (Flash Loan, Insurance, Pay Cards)',
          'Launch Institutional Trading, range of CeFi Products, Maaya Labs',
          'Up to 23 million users',
          'Revenue up to $1.6M per day'
        ],
        status: 'upcoming',
      },
    ],
  },
  {
    id: 'nexachain',
    name: 'NexaChain',
    description: 'Next-generation Layer-2 scaling solution for Ethereum',
    category: 'Infrastructure',
    logo: 'https://images.unsplash.com/photo-1631864031821-320cf314b3ae?w=400',
    status: 'live',
    tokenPrice: '$0.08',
    softCap: '$500,000',
    hardCap: '$2,000,000',
    raised: '$1,450,000',
    progress: 72.5,
    acceptedPayments: ['ETH', 'USDT', 'USDC', 'Card'],
    saleStart: 'January 15, 2026',
    saleEnd: 'January 30, 2026',
    socials: {
      twitter: 'https://twitter.com/nexachain',
      telegram: 'https://t.me/nexachain',
      website: 'https://nexachain.io',
      discord: 'https://discord.gg/nexachain',
    },
    tokenDetails: {
      symbol: 'NEXA',
      totalSupply: '100,000,000',
      allocation: [
        { label: 'Public Sale', percentage: 25 },
        { label: 'Team & Advisors', percentage: 20 },
        { label: 'Ecosystem Fund', percentage: 30 },
        { label: 'Liquidity', percentage: 15 },
        { label: 'Marketing', percentage: 10 },
      ],
      vesting: 'Public sale: 20% at TGE, 80% vested over 6 months',
      utility: [
        'Gas fee payment on NexaChain network',
        'Staking for network security',
        'Governance voting rights',
        'Transaction fee discounts',
      ],
    },
    team: [
      { name: 'Dr. Sarah Chen', role: 'CEO & Co-Founder', linkedin: '#' },
      { name: 'Marcus Johnson', role: 'CTO', linkedin: '#' },
      { name: 'Elena Rodriguez', role: 'Head of Product', linkedin: '#' },
      { name: 'James Liu', role: 'Lead Blockchain Engineer', linkedin: '#' },
    ],
    investors: [
      'Paradigm',
      'Andreessen Horowitz',
      'Sequoia Capital',
      'Coinbase Ventures',
      'Binance Labs',
    ],
    documents: {
      whitepaper: '#',
      pitchDeck: '#',
    },
    fullDescription:
      'NexaChain is building the next generation of Layer-2 scaling infrastructure for Ethereum, enabling faster and cheaper transactions while maintaining the security guarantees of the base layer. Our innovative zero-knowledge rollup technology processes thousands of transactions per second with near-instant finality. With partnerships across DeFi, gaming, and enterprise sectors, NexaChain is positioned to become the preferred scaling solution for high-throughput applications.',
    roadmap: [
      {
        phase: 'Phase 1',
        title: 'Foundation',
        items: ['Core protocol development', 'Testnet launch', 'Security audits'],
        status: 'completed',
      },
      {
        phase: 'Phase 2',
        title: 'Mainnet Launch',
        items: ['Mainnet deployment', 'Bridge infrastructure', 'Initial dApp integrations'],
        status: 'current',
      },
      {
        phase: 'Phase 3',
        title: 'Ecosystem Growth',
        items: ['Developer grants program', 'Enterprise partnerships', 'Cross-chain bridges'],
        status: 'upcoming',
      },
      {
        phase: 'Phase 4',
        title: 'Full Decentralization',
        items: ['DAO governance launch', 'Validator network expansion', 'Protocol upgrades'],
        status: 'upcoming',
      },
    ],
  },
  {
    id: 'synthetica-ai',
    name: 'Synthetica AI',
    description: 'Decentralized AI compute marketplace',
    category: 'AI',
    logo: 'https://images.unsplash.com/photo-1660165458059-57cfb6cc87e5?w=400',
    status: 'upcoming',
    tokenPrice: '$0.12',
    softCap: '$750,000',
    hardCap: '$3,000,000',
    raised: '$0',
    progress: 0,
    acceptedPayments: ['ETH', 'USDT', 'USDC', 'Card'],
    saleStart: 'March 3, 2026',
    saleEnd: 'March 20, 2026',
    socials: {
      twitter: '#',
      telegram: '#',
      website: '#',
      discord: '#',
    },
    tokenDetails: {
      symbol: 'SYNTH',
      totalSupply: '500,000,000',
      allocation: [
        { label: 'Public Sale', percentage: 20 },
        { label: 'Team & Advisors', percentage: 18 },
        { label: 'AI Development Fund', percentage: 35 },
        { label: 'Liquidity', percentage: 12 },
        { label: 'Community Rewards', percentage: 15 },
      ],
      vesting: 'Public sale: 15% at TGE, 85% vested over 12 months',
      utility: [
        'Payment for AI compute resources',
        'Staking for compute node operators',
        'Governance for network parameters',
        'Access to premium AI models',
      ],
    },
    team: [
      { name: 'Dr. Alan Turing', role: 'CEO & Founder', linkedin: '#' },
      { name: 'Grace Hopper', role: 'Chief AI Officer', linkedin: '#' },
      { name: 'Satoshi Nakamoto', role: 'Blockchain Lead', linkedin: '#' },
    ],
    investors: ['Alpha Ventures', 'Tech Capital Partners', 'Future Vision Fund'],
    documents: {
      whitepaper: '#',
      pitchDeck: '#',
    },
    fullDescription:
      'Synthetica AI democratizes access to artificial intelligence by creating a decentralized marketplace for AI compute resources. Our platform connects GPU providers with AI developers, enabling cost-effective training and inference of large language models and other compute-intensive AI workloads.',
    roadmap: [
      {
        phase: 'Phase 1',
        title: 'Platform Development',
        items: ['Marketplace smart contracts', 'Node software', 'Beta testing'],
        status: 'completed',
      },
      {
        phase: 'Phase 2',
        title: 'Network Launch',
        items: ['Public token sale', 'Mainnet activation', 'First compute providers'],
        status: 'current',
      },
      {
        phase: 'Phase 3',
        title: 'Scaling',
        items: ['Multi-chain support', 'Enterprise partnerships', 'Model marketplace'],
        status: 'upcoming',
      },
    ],
  },
  {
    id: 'pixelverse',
    name: 'PixelVerse',
    description: 'Web3 gaming metaverse with player-owned economies',
    category: 'Gaming',
    logo: 'https://images.unsplash.com/photo-1767455471543-055dbc6c6700?w=400',
    status: 'upcoming',
    tokenPrice: '$0.05',
    softCap: '$400,000',
    hardCap: '$1,500,000',
    raised: '$0',
    progress: 0,
    acceptedPayments: ['ETH', 'USDT', 'USDC', 'Card'],
    saleStart: 'March 1, 2026',
    saleEnd: 'March 15, 2026',
    socials: {
      twitter: '#',
      telegram: '#',
      website: '#',
      discord: '#',
    },
    tokenDetails: {
      symbol: 'PIXEL',
      totalSupply: '1,000,000,000',
      allocation: [
        { label: 'Public Sale', percentage: 22 },
        { label: 'Team', percentage: 15 },
        { label: 'Game Development', percentage: 30 },
        { label: 'Liquidity', percentage: 13 },
        { label: 'Community & Rewards', percentage: 20 },
      ],
      vesting: 'Public sale: 25% at TGE, 75% vested over 9 months',
      utility: [
        'In-game currency',
        'NFT marketplace transactions',
        'Governance for game updates',
        'Tournament prize pools',
      ],
    },
    team: [
      { name: 'Alex Morgan', role: 'Game Director', linkedin: '#' },
      { name: 'Kim Park', role: 'Lead Developer', linkedin: '#' },
      { name: 'Carlos Santos', role: 'Art Director', linkedin: '#' },
    ],
    investors: ['Digital Gaming Ventures', 'MetaVerse Capital', 'Play Fund'],
    documents: {
      whitepaper: '#',
      pitchDeck: '#',
    },
    fullDescription:
      'PixelVerse is an immersive Web3 gaming metaverse where players truly own their in-game assets and participate in a thriving virtual economy. Build, trade, compete, and earn in a fully decentralized gaming ecosystem.',
    roadmap: [
      {
        phase: 'Phase 1',
        title: 'Alpha Development',
        items: ['Core gameplay', 'NFT system', 'Alpha testing'],
        status: 'completed',
      },
      {
        phase: 'Phase 2',
        title: 'Beta Launch',
        items: ['Public beta', 'Marketplace launch', 'First tournaments'],
        status: 'current',
      },
      {
        phase: 'Phase 3',
        title: 'Full Release',
        items: ['Official launch', 'Mobile version', 'Guild system'],
        status: 'upcoming',
      },
    ],
  },
  {
    id: 'defiswap',
    name: 'Project Name 1',
    description: 'Advanced DeFi aggregator with best-rate swaps',
    category: 'DeFi',
    logo: 'https://images.unsplash.com/photo-1667984510054-d4562f93621d?w=400',
    status: 'completed',
    tokenPrice: '$0.15',
    softCap: '$600,000',
    hardCap: '$2,500,000',
    raised: '$2,500,000',
    progress: 100,
    roi: '320%',
    acceptedPayments: ['ETH', 'USDT', 'USDC', 'Card'],
    saleStart: 'December 1, 2025',
    saleEnd: 'December 20, 2025',
    socials: {
      twitter: '#',
      telegram: '#',
      website: '#',
      discord: '#',
    },
    tokenDetails: {
      symbol: 'DFS',
      totalSupply: '250,000,000',
      allocation: [
        { label: 'Public Sale', percentage: 28 },
        { label: 'Team', percentage: 16 },
        { label: 'Protocol Development', percentage: 25 },
        { label: 'Liquidity', percentage: 20 },
        { label: 'Marketing', percentage: 11 },
      ],
      vesting: 'Public sale: 30% at TGE, 70% vested over 6 months',
      utility: [
        'Fee discounts on swaps',
        'Staking for yield',
        'Governance voting',
        'Liquidity mining rewards',
      ],
    },
    team: [
      { name: 'John Doe', role: 'Founder & CEO', linkedin: '#' },
      { name: 'Jane Smith', role: 'Head of DeFi', linkedin: '#' },
      { name: 'Robert Johnson', role: 'Smart Contract Lead', linkedin: '#' },
    ],
    investors: ['Venture Capital Firm A', 'Investment Fund B', 'Crypto Capital C'],
    documents: {
      whitepaper: '#',
      pitchDeck: '#',
    },
    fullDescription:
      'This project is a cutting-edge DeFi aggregator that scans multiple DEXs to find the best rates for token swaps. With advanced routing algorithms and MEV protection, users get optimal execution for their trades.',
    roadmap: [
      {
        phase: 'Phase 1',
        title: 'Protocol Launch',
        items: ['Smart contracts', 'UI/UX', 'Security audits'],
        status: 'completed',
      },
      {
        phase: 'Phase 2',
        title: 'Expansion',
        items: ['Multi-chain support', 'Limit orders', 'Mobile app'],
        status: 'completed',
      },
      {
        phase: 'Phase 3',
        title: 'Advanced Features',
        items: ['Advanced trading tools', 'API for developers', 'Institutional access'],
        status: 'completed',
      },
    ],
  },
  {
    id: 'propertyx',
    name: 'Project Name 2',
    description: 'Tokenized real estate investment platform',
    category: 'RWA',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
    status: 'completed',
    tokenPrice: '$1.20',
    softCap: '$1,000,000',
    hardCap: '$5,000,000',
    raised: '$5,000,000',
    progress: 100,
    roi: '450%',
    acceptedPayments: ['ETH', 'USDT', 'USDC', 'Card'],
    saleStart: 'November 1, 2025',
    saleEnd: 'November 30, 2025',
    socials: {
      twitter: '#',
      telegram: '#',
      website: '#',
      discord: '#',
    },
    tokenDetails: {
      symbol: 'PROPX',
      totalSupply: '50,000,000',
      allocation: [
        { label: 'Public Sale', percentage: 30 },
        { label: 'Team', percentage: 12 },
        { label: 'Property Acquisition', percentage: 40 },
        { label: 'Liquidity', percentage: 10 },
        { label: 'Operations', percentage: 8 },
      ],
      vesting: 'Public sale: 40% at TGE, 60% vested over 12 months',
      utility: [
        'Fractional real estate ownership',
        'Rental income distribution',
        'Governance over property decisions',
        'Platform fee discounts',
      ],
    },
    team: [
      { name: 'Michael Anderson', role: 'CEO', linkedin: '#' },
      { name: 'Sarah Williams', role: 'Head of Real Estate', linkedin: '#' },
      { name: 'David Martinez', role: 'Legal Counsel', linkedin: '#' },
    ],
    investors: ['Investment Group A', 'Capital Partners B', 'Fund Management C'],
    documents: {
      whitepaper: '#',
      pitchDeck: '#',
    },
    fullDescription:
      'This project brings real estate investment to the blockchain, enabling fractional ownership of premium properties. Investors can diversify their real estate portfolio with as little as $100 and earn passive income through rental yields.',
    roadmap: [
      {
        phase: 'Phase 1',
        title: 'Platform Development',
        items: ['Legal framework', 'Smart contracts', 'First properties'],
        status: 'completed',
      },
      {
        phase: 'Phase 2',
        title: 'Market Expansion',
        items: ['Multiple cities', 'Secondary market', 'Mobile app'],
        status: 'completed',
      },
      {
        phase: 'Phase 3',
        title: 'Global Scale',
        items: ['International properties', 'Institutional partnerships', 'DeFi integration'],
        status: 'completed',
      },
    ],
  },
  {
    id: 'databridge',
    name: 'Project Name 3',
    description: 'Decentralized oracle network for real-world data',
    category: 'Infrastructure',
    logo: 'https://images.unsplash.com/photo-1762163516269-3c143e04175c?w=400',
    status: 'completed',
    tokenPrice: '$0.25',
    softCap: '$800,000',
    hardCap: '$3,500,000',
    raised: '$3,500,000',
    progress: 100,
    roi: '280%',
    acceptedPayments: ['ETH', 'USDT', 'USDC', 'Card'],
    saleStart: 'October 15, 2025',
    saleEnd: 'November 10, 2025',
    socials: {
      twitter: '#',
      telegram: '#',
      website: '#',
      discord: '#',
    },
    tokenDetails: {
      symbol: 'BRIDGE',
      totalSupply: '400,000,000',
      allocation: [
        { label: 'Public Sale', percentage: 24 },
        { label: 'Team', percentage: 18 },
        { label: 'Node Operators', percentage: 30 },
        { label: 'Liquidity', percentage: 15 },
        { label: 'Ecosystem', percentage: 13 },
      ],
      vesting: 'Public sale: 20% at TGE, 80% vested over 10 months',
      utility: [
        'Oracle node staking',
        'Data query payments',
        'Governance for data feeds',
        'Network security',
      ],
    },
    team: [
      { name: 'Emily Thompson', role: 'Chief Scientist', linkedin: '#' },
      { name: 'James Wilson', role: 'CEO', linkedin: '#' },
      { name: 'Maria Garcia', role: 'Head of Engineering', linkedin: '#' },
    ],
    investors: ['Blockchain Ventures A', 'Digital Assets Fund B', 'Tech Capital C'],
    documents: {
      whitepaper: '#',
      pitchDeck: '#',
    },
    fullDescription:
      'This project is a decentralized oracle network that connects smart contracts with reliable real-world data. Our network of node operators ensures data integrity and availability for DeFi protocols, insurance platforms, and enterprise applications.',
    roadmap: [
      {
        phase: 'Phase 1',
        title: 'Network Launch',
        items: ['Core protocol', 'Node software', 'Initial data feeds'],
        status: 'completed',
      },
      {
        phase: 'Phase 2',
        title: 'Integration',
        items: ['DeFi partnerships', 'Custom feeds', 'API expansion'],
        status: 'completed',
      },
      {
        phase: 'Phase 3',
        title: 'Enterprise',
        items: ['Enterprise solutions', 'Multi-chain support', 'Advanced analytics'],
        status: 'completed',
      },
    ],
  },
];