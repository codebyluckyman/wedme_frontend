'use client';

import { WeddingAssistantChat } from '@/components/ui/WeddingAssitantChat';
import { useParams } from 'next/navigation';

export default function WeddingAssistantRoomPage() {
  const params = useParams<{ room_id: string }>();

  if (!params?.room_id) return <div>Room not found</div>;
  return <WeddingAssistantChat roomId={params?.room_id} />;
}
