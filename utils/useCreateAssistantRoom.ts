import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store/authStore';
import { useAssistantStore } from '@/app/store/assistantStore';
import { createClient } from '@/app/utils/supabase/client';

export const useCreateAssistantRoom = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const supabase = createClient();
  const { setInitialMessage } = useAssistantStore();

  const handleFirstSubmit = async (message: string) => {
    if (!user?.id) return;

    try {
      const { data: roomData, error } = await supabase
        .from('ai_assistant_room')
        .insert({ user_id: user.id })
        .select()
        .single();

      if (error) throw error;

      setInitialMessage(message);
      router.push(`/wedding-assistant/${roomData.room_id}`);
    } catch (error) {
      console.error('Error creating room:', error);
      // Optionally: add error handling UI or state here
    }
  };

  return { handleFirstSubmit };
};
