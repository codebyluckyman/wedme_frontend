// pages/api/add-activity.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type ActivityItem = {
  type: 'menu' | 'venue' | 'search';
  title: string;
  description: string;
  date: string;
};

// In a real application, you would store this in a database
export let recentActivity: ActivityItem[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { type, title, description } = req.body;
    const newActivity: ActivityItem = {
      type,
      title,
      description,
      date: new Date().toISOString(),
    };

    recentActivity = [newActivity, ...recentActivity.slice(0, 19)]; // Keep only the 20 most recent activities

    res.status(200).json({ success: true });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
