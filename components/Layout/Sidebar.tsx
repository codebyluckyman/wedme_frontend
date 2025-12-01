'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  MessageSquare,
  LogOut,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
} from 'lucide-react';
import {
  DashboardIcon,
  MagicIcon,
  WeddingIcon,
  GiftIcon,
  WeddingRingsLogo,
  ToggleLeftIcon,
  ToggleRightIcon,
} from '../icons';
import { useAuthStore } from '@/app/store/authStore';
import { createClient } from '@/app/utils/supabase/client';

interface SidebarProps {
  initialIsOpen?: boolean;
  isMobileOpen: boolean;
  onClose: () => void;
}

interface ChatRoom {
  room_id: string;
  created_at: string;
  room_title: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({
  initialIsOpen = true,
  isMobileOpen,
  onClose,
}) => {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [showChatHistory, setShowChatHistory] = useState(true);
  const [loadingChats, setLoadingChats] = useState(false);
  const [deletingRoomId, setDeletingRoomId] = useState<string | null>(null);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  const fetchChatRooms = async () => {
    try {
      setLoadingChats(true);
      const { data: roomData, error } = await supabase
        .from('ai_assistant_room')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChatRooms(roomData as ChatRoom[]);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    } finally {
      setLoadingChats(false);
    }
  };

  useEffect(() => {
    fetchChatRooms();

    const channel = supabase
      .channel('room_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_assistant_room',
          filter: `user_id=eq.${user?.id}`,
        },
        payload => {
          fetchChatRooms();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    router.push('/signin');
  }, [supabase, router]);

  const handleNewChat = () => {
    router.push('/wedding-assistant');
  };

  const handleDeleteChat = async (roomId: string) => {
    try {
      setDeletingRoomId(roomId);
      if (user?.id) {
        localStorage.removeItem(`chatHistory_${user.id}_${roomId}`);
      }

      const { error } = await supabase
        .from('ai_assistant_room')
        .delete()
        .eq('room_id', roomId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setChatRooms(prevRooms =>
        prevRooms.filter(room => room.room_id !== roomId)
      );

      if (pathname?.endsWith(roomId)) {
        router.push('/wedding-assistant');
      }
    } catch (error) {
      console.error('Error deleting chat room:', error);
    } finally {
      setDeletingRoomId(null);
    }
  };

  const handleStartEditing = (roomId: string, currentTitle: string | null) => {
    setEditingRoomId(roomId);
    setEditedTitle(currentTitle || '');
    setTimeout(() => {
      editInputRef.current?.focus();
    }, 0);
  };

  const handleCancelEditing = () => {
    setEditingRoomId(null);
    setEditedTitle('');
  };

  const handleSaveTitle = async (roomId: string) => {
    try {
      if (!editedTitle.trim()) {
        handleCancelEditing();
        return;
      }

      const { error } = await supabase
        .from('ai_assistant_room')
        .update({ room_title: editedTitle.trim() })
        .eq('room_id', roomId);

      if (error) throw error;

      setEditingRoomId(null);
      setEditedTitle('');
    } catch (error) {
      console.error('Error updating chat room_title:', error);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleChatHistory = () => {
    setShowChatHistory(!showChatHistory);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const isChatRoomActive = (roomId: string) => {
    return (
      pathname?.includes('/wedding-assistant/') && pathname?.endsWith(roomId)
    );
  };

  const menuItems = [
    {
      icon: (
        <DashboardIcon
          color={pathname?.includes('dashboard') ? '#6B21A8' : 'black'}
        />
      ),
      label: 'Dashboard',
      href: '/dashboard',
    },
    {
      icon: (
        <WeddingIcon
          color={
            pathname?.includes('generate-venue-designs') ? '#6B21A8' : 'black'
          }
        />
      ),
      label: 'Venue Search',
      href: '/generate-venue-designs',
    },
    {
      icon: (
        <GiftIcon
          color={pathname?.includes('wedding-cards') ? '#6B21A8' : 'black'}
        />
      ),
      label: 'Cards',
      href: '/wedding-cards',
    },
    {
      icon: (
        <MagicIcon
          color={pathname?.includes('wedding-assistant') ? '#6B21A8' : 'black'}
        />
      ),
      label: 'Wedding Assistant',
      href: '/wedding-assistant',
      hasChildren: true,
    },
  ];

  const bottomMenuItems = [
    {
      icon: <MessageSquare className='w-6 h-6' />,
      label: 'Support',
      href: '/contact',
    },
    {
      icon: <LogOut className='w-6 h-6' />,
      label: 'Logout',
      onClick: handleSignOut,
    },
  ];

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileOpen]);

  return (
    <>
      {isMobileOpen && (
        <div
          className='fixed inset-0 bg-black opacity-50 z-[80]'
          onClick={onClose}
        />
      )}
      <div
        className={`fixed lg:relative h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-[100]
        ${isOpen ? 'w-64' : 'w-20'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className='flex flex-col items-center pt-6 pb-4'>
          <Link href='/'>
            {isOpen ? (
              <div className='flex items-center'>
                <h1 className='text-2xl font-semibold text-[#6B21A8]'>
                  wedme.ai
                </h1>
                <div className='flex justify-center items-center'>
                  <WeddingRingsLogo />
                </div>
              </div>
            ) : (
              <div className='flex justify-center items-center'>
                <WeddingRingsLogo />
              </div>
            )}
          </Link>
          <div
            className={`flex ${isOpen ? 'justify-end' : 'justify-center'} w-full p-2`}
          >
            <button onClick={toggleSidebar} className=''>
              {isOpen ? <ToggleLeftIcon /> : <ToggleRightIcon />}
            </button>
          </div>
        </div>

        {/* <nav className='px-2 space-y-2'>
          {menuItems.map((item, index) => {
            const isActive =
              pathname === item.href ||
              (item.href === '/wedding-assistant' &&
                pathname?.includes('/wedding-assistant/'));
            const isAssistantItem = item.href === '/wedding-assistant';

            return (
              <div key={index}>
                <div
                  className={`flex items-center h-12 px-4 rounded-lg hover:bg-primary/5 transition-colors relative ${
                    isActive ? 'bg-primary/10' : ''
                  } ${isAssistantItem ? 'cursor-pointer' : ''}`}
                  onClick={isAssistantItem ? toggleChatHistory : undefined}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center w-full ${isAssistantItem ? 'pointer-events-none' : ''}`}
                  >
                    <span
                      className={`text-gray-600 ${isActive ? 'text-primary' : ''}`}
                    >
                      {item.icon}
                    </span>
                    {isOpen && (
                      <span
                        className={`ml-4 whitespace-nowrap
                        ${isActive ? 'text-[#6B21A8] font-medium' : 'text-gray-700'}`}
                      >
                        {item.label}
                      </span>
                    )}
                  </Link>
                  {isOpen && isAssistantItem && (
                    <button className='ml-[10px] '>
                      {showChatHistory ? (
                        <ChevronDown
                          size={18}
                          color='#6B21A8'
                          className='mt-[1px] '
                        />
                      ) : (
                        <ChevronRight
                          size={18}
                          color='#6B21A8'
                          className='mt-[1px]'
                        />
                      )}
                    </button>
                  )}
                </div>

                {isOpen && isAssistantItem && showChatHistory && (
                  <div className='ml-2 pl-4 border-l-2 border-gray-100 space-y-1 '>
                    <button
                      onClick={handleNewChat}
                      className='flex items-center w-full h-10 px-3 rounded-lg hover:bg-primary/5 transition-colors text-sm text-gray-600 hover:text-[#6B21A8]'
                    >
                      <Plus size={16} className='mr-3' />
                      <span>New Chat</span>
                    </button>

                    {loadingChats ? (
                      <div className='py-2 text-sm text-gray-500 px-3'>
                        Loading chats...
                      </div>
                    ) : chatRooms.length === 0 ? (
                      <div className='py-2 text-sm text-gray-500 px-3'>
                        No chat history
                      </div>
                    ) : (
                      <div className='max-h-[300px] overflow-y-auto'>
                        {chatRooms.map(room => (
                          <div
                            key={room.room_id}
                            className={`group flex items-center justify-between h-10 px-3 rounded-lg hover:bg-primary/5 transition-colors ${
                              isChatRoomActive(room.room_id)
                                ? 'bg-primary/10'
                                : ''
                            }`}
                          >
                            {editingRoomId === room.room_id ? (
                              <div className='flex items-center w-full'>
                                <input
                                  ref={editInputRef}
                                  type='text'
                                  value={editedTitle}
                                  onChange={e => setEditedTitle(e.target.value)}
                                  onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                      handleSaveTitle(room.room_id);
                                    } else if (e.key === 'Escape') {
                                      handleCancelEditing();
                                    }
                                  }}
                                  className='flex-1 max-w-[140px] text-sm bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#6B21A8]'
                                />
                                <div className='flex ml-2'>
                                  <button
                                    onClick={() =>
                                      handleSaveTitle(room.room_id)
                                    }
                                    className='text-green-500 hover:text-green-700'
                                  >
                                    <Check size={14} />
                                  </button>
                                  <button
                                    onClick={handleCancelEditing}
                                    className='text-red-500 hover:text-red-700 ml-1'
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <Link
                                  href={`/wedding-assistant/${room.room_id}`}
                                  className='flex-1 flex items-center'
                                >
                                  <span
                                    className={`text-sm truncate ${
                                      isChatRoomActive(room.room_id)
                                        ? 'text-[#6B21A8] font-medium'
                                        : 'text-gray-600'
                                    }`}
                                  >
                                    {room.room_title ||
                                      `Chat ${formatDate(room.created_at)}`}
                                  </span>
                                </Link>
                                <div className='flex opacity-0 group-hover:opacity-100 transition-opacity'>
                                  <button
                                    onClick={e => {
                                      e.stopPropagation();
                                      handleStartEditing(
                                        room.room_id,
                                        room.room_title
                                      );
                                    }}
                                    className='text-gray-400 hover:text-blue-500'
                                  >
                                    <Edit size={14} />
                                  </button>
                                  <button
                                    onClick={e => {
                                      e.stopPropagation();
                                      handleDeleteChat(room.room_id);
                                    }}
                                    className='text-gray-400 hover:text-red-500 ml-1'
                                    disabled={deletingRoomId === room.room_id}
                                  >
                                    {deletingRoomId === room.room_id ? (
                                      <span className='loading-spinner' />
                                    ) : (
                                      <Trash2 size={14} />
                                    )}
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav> */}
        <nav className='px-3 space-y-1.5'>
          {menuItems.map((item, index) => {
            const isActive =
              pathname === item.href ||
              (item.href === '/wedding-assistant' &&
                pathname?.includes('/wedding-assistant/'));
            const isAssistantItem = item.href === '/wedding-assistant';

            return (
              <div key={index} className='relative'>
                <div
                  className={`flex items-center h-12 px-4 rounded-lg transition-all duration-200 ease-in-out relative overflow-hidden ${
                    isActive
                      ? 'bg-primary/10 shadow-sm'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  } ${isAssistantItem ? 'cursor-pointer' : ''}`}
                  onClick={isAssistantItem ? toggleChatHistory : undefined}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center w-full ${isAssistantItem ? 'pointer-events-none' : ''}`}
                  >
                    <span
                      className={`text-gray-600 transition-transform duration-200 ${
                        isActive ? 'text-primary scale-110' : ''
                      }`}
                    >
                      {item.icon}
                    </span>
                    {isOpen && (
                      <span
                        className={`ml-4 whitespace-nowrap transition-all duration-200 ${
                          isActive
                            ? 'text-[#6B21A8] font-medium'
                            : 'text-gray-700'
                        }`}
                      >
                        {item.label}
                      </span>
                    )}
                  </Link>
                  {isOpen && isAssistantItem && (
                    <button
                      className='ml-[5px] transition-transform duration-200 ease-in-out'
                      aria-label={
                        showChatHistory
                          ? 'Hide chat history'
                          : 'Show chat history'
                      }
                    >
                      {showChatHistory ? (
                        <ChevronDown
                          size={18}
                          color='#6B21A8'
                          className='transform transition-transform duration-200'
                        />
                      ) : (
                        <ChevronRight
                          size={18}
                          color='#6B21A8'
                          className='transform transition-transform duration-200'
                        />
                      )}
                    </button>
                  )}
                  {/* {isActive && (
                    <div className='absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full transform transition-all duration-300' />
                  )} */}
                </div>

                {isOpen && isAssistantItem && showChatHistory && (
                  <div className='ml-2 pl-4 border-l-2 border-gray-100 space-y-1 mt-1 overflow-hidden transition-all duration-300 ease-in-out max-h-[500px]'>
                    <button
                      onClick={handleNewChat}
                      className='flex items-center w-full h-10 px-3 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-600 hover:text-[#6B21A8] group'
                    >
                      <Plus
                        size={16}
                        className='mr-3 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-90'
                      />
                      <span>New Chat</span>
                    </button>

                    {loadingChats ? (
                      <div className='py-2 text-sm text-gray-500 px-3 flex items-center'>
                        <svg
                          className='animate-spin -ml-1 mr-2 h-4 w-4 text-primary'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                        >
                          <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                          ></circle>
                          <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                          ></path>
                        </svg>
                        Loading chats...
                      </div>
                    ) : chatRooms.length === 0 ? (
                      <div className='py-2 text-sm text-gray-500 px-3'>
                        No chat history
                      </div>
                    ) : (
                      <div className='max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent'>
                        {chatRooms.map(room => (
                          <div
                            key={room.room_id}
                            className={`group flex items-center justify-between h-10 px-3 rounded-lg transition-all duration-200 ${
                              isChatRoomActive(room.room_id)
                                ? 'bg-primary/10'
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            {editingRoomId === room.room_id ? (
                              <div className='flex items-center w-full'>
                                <input
                                  ref={editInputRef}
                                  type='text'
                                  value={editedTitle}
                                  onChange={e => setEditedTitle(e.target.value)}
                                  onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                      handleSaveTitle(room.room_id);
                                    } else if (e.key === 'Escape') {
                                      handleCancelEditing();
                                    }
                                  }}
                                  className='flex-1 max-w-[140px] text-sm bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#6B21A8] py-1 px-1'
                                  autoFocus
                                />
                                <div className='flex ml-2'>
                                  <button
                                    onClick={() =>
                                      handleSaveTitle(room.room_id)
                                    }
                                    className='text-green-500 hover:text-green-700 p-1 rounded-full hover:bg-green-50 transition-colors'
                                  >
                                    <Check size={14} />
                                  </button>
                                  <button
                                    onClick={handleCancelEditing}
                                    className='text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors'
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <Link
                                  href={`/wedding-assistant/${room.room_id}`}
                                  className='flex-1 flex items-center'
                                >
                                  <span
                                    className={`text-sm truncate ${
                                      isChatRoomActive(room.room_id)
                                        ? 'text-[#6B21A8] font-medium'
                                        : 'text-gray-600'
                                    }`}
                                  >
                                    {room.room_title ||
                                      `Chat ${formatDate(room.created_at)}`}
                                  </span>
                                </Link>
                                <div className='flex opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                                  <button
                                    onClick={e => {
                                      e.stopPropagation();
                                      handleStartEditing(
                                        room.room_id,
                                        room.room_title
                                      );
                                    }}
                                    className='text-gray-400 hover:text-blue-500 p-1 rounded-full hover:bg-blue-50 transition-colors'
                                    aria-label='Edit chat title'
                                  >
                                    <Edit size={14} />
                                  </button>
                                  <button
                                    onClick={e => {
                                      e.stopPropagation();
                                      handleDeleteChat(room.room_id);
                                    }}
                                    className='text-gray-400 hover:text-red-500 ml-1 p-1 rounded-full hover:bg-red-50 transition-colors'
                                    disabled={deletingRoomId === room.room_id}
                                    aria-label='Delete chat'
                                  >
                                    {deletingRoomId === room.room_id ? (
                                      <svg
                                        className='animate-spin h-3.5 w-3.5 text-red-500'
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                      >
                                        <circle
                                          className='opacity-25'
                                          cx='12'
                                          cy='12'
                                          r='10'
                                          stroke='currentColor'
                                          strokeWidth='4'
                                        ></circle>
                                        <path
                                          className='opacity-75'
                                          fill='currentColor'
                                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                        ></path>
                                      </svg>
                                    ) : (
                                      <Trash2 size={14} />
                                    )}
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className='absolute bottom-0 left-0 right-0 px-2 pb-4 space-y-2'>
          {bottomMenuItems.map((item, index) =>
            'onClick' in item ? (
              <button
                key={index}
                onClick={item.onClick}
                className='w-full flex items-center h-12 px-4 rounded-lg hover:bg-primary/5 transition-colors'
              >
                <span className='text-gray-600'>{item.icon}</span>
                {isOpen && (
                  <span className='ml-4 text-gray-700 whitespace-nowrap'>
                    {item.label}
                  </span>
                )}
              </button>
            ) : (
              <Link
                key={index}
                href={item.href}
                className='flex items-center h-12 px-4 rounded-lg hover:bg-primary/5 transition-colors'
              >
                <span className='text-gray-600'>{item.icon}</span>
                {isOpen && (
                  <span className='ml-4 text-gray-700 whitespace-nowrap'>
                    {item.label}
                  </span>
                )}
              </Link>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
