'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Layout/Sidebar';
import HomePageMenu from '@/components/HomePageMenu';

type ActivityItem = {
  type: 'menu' | 'venue' | 'search';
  title: string;
  description: string;
  date: string;
};

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch(`/api/recent-activity?t=${Date.now()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recent activity');
      }
      const data = await response.json();
      setRecentActivity(data.activities);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  useEffect(() => {
    fetchRecentActivity();
    const intervalId = setInterval(fetchRecentActivity, 5000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 to-white flex'>
      <div className={`flex-1 p-8 `}>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-3xl font-bold mb-8 text-center text-gray-800'>
            Welcome to Wedme.ai
          </h1>
          <HomePageMenu recentActivity={recentActivity} />
        </div>
      </div>
    </div>
  );
}
