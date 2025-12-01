// utils/activity.ts
export type ActivityItem = {
  type: 'menu' | 'venue' | 'search' | 'generate_image' | 'budget';
  title: string;
  description: string;
  date: string;
};
export async function addRecentActivity(activity: Omit<ActivityItem, 'date'>) {
  try {
    const response = await fetch('/api/add-activity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activity),
    });

    if (!response.ok) {
      throw new Error('Failed to add recent activity');
    }

    // Optionally, you can return the updated activity list
    return await response.json();
  } catch (error) {
    console.error('Error adding recent activity:', error);
  }
}
