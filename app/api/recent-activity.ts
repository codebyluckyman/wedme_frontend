import type { NextApiRequest, NextApiResponse } from 'next';
import { recentActivity } from './add-activity';

type ActivityItem = {
  type: 'menu' | 'venue' | 'search';
  title: string;
  description: string;
  date: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ activities: ActivityItem[]; timestamp: number }>
) {
  res.status(200).json({ activities: recentActivity, timestamp: Date.now() });
}
