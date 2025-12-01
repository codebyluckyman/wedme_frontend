import { useAuthStore } from '@/app/store/authStore';
import { createClient } from '@/app/utils/supabase/client';
import { useEffect, useState } from 'react';
import { v4 as uuid4 } from 'uuid';

type Message = {
  id: string;
  role: 'assistant' | string;
  content: string;
  timestamp: Date;
};

export default function WeddingAssistantInitial() {
  const { user } = useAuthStore();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      const setInitialGreeting = async () => {
        try {
          const { data: envisionData } = await supabase
            .from('onboarding_envision')
            .select('envision')
            .eq('id', user?.id)
            .single();

          const { data: inspireData } = await supabase
            .from('onboarding_inspire')
            .select('inspire')
            .eq('id', user?.id)
            .single();

          const { data: priorityData } = await supabase
            .from('onboarding_priority')
            .select('priority')
            .eq('id', user?.id)
            .single();

          const { data: userInfoData } = await supabase
            .from('onboarding_userInfo')
            .select('*')
            .eq('id', user?.id)
            .single();

          const userName = userInfoData?.name || user?.name || 'there';
          const partnerName = userInfoData?.partner_name || 'your partner';
          const weddingDate = userInfoData?.wedding_date
            ? new Date(userInfoData.wedding_date).toLocaleDateString()
            : 'a date of your choosing';
          const guestCount =
            userInfoData?.guest_count || 'a flexible guest list';
          const weddingBudget = userInfoData?.estimate_budget
            ? `$${Number(userInfoData.estimate_budget.replace(/,/g, '')).toLocaleString()}`
            : 'a flexible budget';
          const weddingLocation =
            userInfoData?.wedding_location || 'your chosen location';

          const envisionArray = envisionData?.envision || [];
          const inspireText = inspireData?.inspire || '';
          const priorityArray = priorityData?.priority || [];

          const envisionContent = envisionArray.length
            ? `You imagine your wedding to have these wonderful elements: ${envisionArray.join(', ')}.`
            : 'You haven’t shared your vision yet, but we can start building it together.';
          const inspireContent = inspireText
            ? `You’re inspired by: ${inspireText}.`
            : 'We can explore some ideas and find the perfect inspiration for you.';
          const priorityContent = priorityArray.length
            ? `What matters most to you includes: ${priorityArray.join(', ')}.`
            : 'We can figure out what’s most important to make your day unforgettable.';

          const initialGreeting: Message = {
            id: uuid4(),
            role: 'assistant',
            content: `Hi ${userName}! I'm so happy to join you on this exciting journey. Planning a wedding is such a special time, and I’m here to make it as smooth and enjoyable as possible for you. Here’s what we know so far about your dream day:

💍 You and ${partnerName} are planning to celebrate your love on ${weddingDate}. You’re expecting around ${guestCount} guests, and the wedding will take place at ${weddingLocation}.
💰 You’re planning with a budget of ${weddingBudget}.

${envisionContent}
${inspireContent}
${priorityContent}

There’s so much we can do together! I can help you with:
🏰 Finding the perfect venue
💰 Organizing your budget and breaking down costs
👥 Researching and coordinating with vendors
🎨 Creating a theme and color palette that reflects your style
👗 Finding inspiration for wedding attire

What would you like to focus on first? Let’s make your wedding vision a reality!`,
            timestamp: new Date(),
          };

          setConversation([initialGreeting]);
        } catch (error) {
          console.warn('Error setting initial greeting:', error);

          setConversation([
            {
              id: uuid4(),
              role: 'assistant',
              content: `Hello! Welcome to WedMe, your personal AI Wedding Assistant. I’m here to help you plan every detail of your dream wedding. Whether it’s finding the perfect venue, managing your budget, or discovering inspiration for your big day, I’ve got you covered.

Here are some ways I can assist you:
- 🏰 Venue recommendations and selection
- 💰 Budget planning and cost breakdowns
- 👥 Vendor research and coordination
- 🎨 Theme inspiration and color palette designs
- 👗 Wedding attire ideas and trends

How can I help you today? Let’s start planning your perfect wedding journey!`,
              timestamp: new Date(),
            },
          ]);
        }
        setLoading(false);
      };

      setInitialGreeting();
    }
  }, [user?.id]);

  return (
    <div className='max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow'>
      {loading ? (
        <div className='flex flex-col items-center justify-center py-16'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7e22ce] mb-4'></div>
          <div className='text-[#7e22ce] font-semibold'>
            Preparing your wedding assistant...
          </div>
        </div>
      ) : (
        <>
          {conversation.map(msg => (
            <div
              key={msg.id}
              className='mb-6 border-l-4 border-[#7e22ce] pl-4 bg-purple-50 py-4'
            >
              <div className='font-bold text-[#7e22ce] mb-2 flex items-center gap-2'>
                <span>💬 Assistant</span>
              </div>
              <div className='whitespace-pre-line text-gray-800'>
                {msg.content}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
