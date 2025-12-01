'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import { createClient } from '../utils/supabase/client';
import { WeddingAssistantChat } from '@/components/ui/WeddingAssitantChat';
import { useAssistantStore } from '../store/assistantStore';
import { useCreateAssistantRoom } from '@/utils/useCreateAssistantRoom';

export default function WeddingAssistantPage() {
  const { handleFirstSubmit } = useCreateAssistantRoom();

  return (
    <WeddingAssistantChat roomId={null} onFirstSubmit={handleFirstSubmit} />
  );
}
