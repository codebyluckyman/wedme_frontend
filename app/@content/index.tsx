import {
  BudgetTrackerIcon,
  MenuPlanningIcon,
  VenueDesignIcon,
} from '@/components/icons';
import { Question } from '../@types';
import { GiftIcon } from 'lucide-react';

export const categories = [
  {
    icon: <BudgetTrackerIcon />,
    label: 'Budget Tracker',
  },
  {
    icon: <VenueDesignIcon />,
    label: 'Venue Design',
  },
  {
    icon: <MenuPlanningIcon />,
    label: 'Menu Planning',
  },
  {
    icon: <GiftIcon color='#6B21A8' />,
    label: 'Wedding card',
  },
];

export const questions: Question[] = [
  {
    id: 1,
    text: 'What are the pricing and package options for this venue?',
  },
  {
    id: 2,
    text: 'Does this venue offer all-inclusive wedding services?',
  },
  {
    id: 3,
    text: 'Can I see real customer reviews and testimonials?',
  },
  {
    id: 4,
    text: "What's the venue's availability for 2025 and 2026?",
  },
];
