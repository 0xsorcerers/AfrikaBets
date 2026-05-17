// Market data structure based on Rain SDK and Penny4Thots patterns
export interface Market {
  id: string;
  title: string;
  description: string;
  category: string;
  backgroundUrl?: string; // URL to image, GIF, or video (max 5MB)
  backgroundType?: 'image' | 'video' | 'gif';
  createdAt: Date;
  closesAt: Date;
  tags: string[];
  stakes: number;
  votes: Vote[];
  options: MarketOption[];
  status: 'active' | 'closed' | 'resolved';
  creator: string;
}

export interface MarketOption {
  id: string;
  label: string;
  votes: number;
  percentage: number;
}

export interface Vote {
  id: string;
  optionId: string;
  voter: string;
  amount: number;
  timestamp: Date;
}

export interface CreateMarketInput {
  title: string;
  description: string;
  category: string;
  backgroundUrl?: string;
  backgroundType?: 'image' | 'video' | 'gif';
  closesAt: Date;
  tags: string[];
  options: string[];
}

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
