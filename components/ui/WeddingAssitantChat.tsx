// 'use client';

// import React, { useState, useEffect, useRef } from 'react';
// import { useChat } from '@ai-sdk/react';
// import { v4 as uuid4 } from 'uuid';
// import { FileText, ImageIcon, Mic, PlusCircle, Send, X } from 'lucide-react';
// import { toast } from 'react-toastify';
// import { ChatMessage } from '@/components/ui/ChatMessage';
// import { PopularQuestionsSection } from '@/components/ui/PopularQuestionSection';
// import {
//   BudgetTrackerIcon,
//   LoadingRingsIcon,
//   VenueDesignIcon,
// } from '@/components/icons';
// import { useSearchParams } from 'next/navigation';
// import { useAuthStore } from '@/app/store/authStore';
// import { ChatMessageInterface, LinkPreview } from '@/app/@types';
// import { createClient } from '@/app/utils/supabase/client';
// import { useAssistantStore } from '@/app/store/assistantStore';
// import { questions } from '@/app/@content';
// import { fetchLinkPreview } from '@/utils/fetchImagePreview';
// import WeddingAssistantInitial from './WeddingAssistantInitial';
// import { useCreateAssistantRoom } from '@/utils/useCreateAssistantRoom';

// type Props = {
//   roomId: string | null;
//   onFirstSubmit?: (message: string) => void;
// };

// // LocalStorage key structure
// const getLocalStorageKey = (userId: string | null, roomId: string) =>
//   `chatHistory_${userId}_${roomId}`;

// export const WeddingAssistantChat: React.FC<Props> = ({
//   roomId,
//   onFirstSubmit,
// }) => {
//   const { user } = useAuthStore();
//   const searchparams = useSearchParams();
//   const supabase = createClient();

//   const { clearInitialData, initialMessage, setInitialMessage } =
//     useAssistantStore();

//   const [showPopover, setShowPopover] = useState(false);
//   const popoverRef = useRef<HTMLDivElement>(null);
//   const buttonRef = useRef<HTMLButtonElement>(null);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);
//   const chatEndRef = useRef<HTMLDivElement>(null);

//   const [conversation, setConversation] = useState<ChatMessageInterface[]>([]);
//   const [uniqueThread] = useState(() => uuid4());

//   const [showSourcesSlider, setShowSourcesSlider] = useState(false);
//   const [currentSources, setCurrentSources] = useState<string[]>([]);
//   const [linkPreviews, setLinkPreviews] = useState<Record<string, LinkPreview>>(
//     {}
//   );
//   const [isLoadingPreviews, setIsLoadingPreviews] = useState(false);
//   const [showWelcomeCard, setShowWelcomeCard] = useState(true);
//   const [isHovered, setIsHovered] = useState(false);
//   const [isInitialLoad, setIsInitialLoad] = useState(true);

//   // Add new state variables
//   const [attachment, setAttachment] = useState<File | null>(null);
//   const [attachmentPreview, setAttachmentPreview] = useState<string | null>(
//     null
//   );
//   const [showAttachmentPrompt, setShowAttachmentPrompt] = useState(false);
//   const [attachmentPrompt, setAttachmentPrompt] = useState('');
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (!user?.id || !roomId) return;

//     const loadChatHistory = async () => {
//       try {
//         // First check if we have data in localStorage
//         const localStorageKey = getLocalStorageKey(user?.id, roomId);
//         const localHistory = localStorage.getItem(localStorageKey);

//         // Always fetch from database to ensure we have the latest data
//         const { data, error } = await supabase
//           .from('ai_assistant_chat_history')
//           .select('*')
//           .eq('room_id', roomId)
//           .order('created_at', { ascending: true });

//         if (error) throw error;

//         if (data && data.length > 0) {
//           const formattedMessages = data.map(msg => ({
//             id: msg.id || uuid4(),
//             role: msg.role as 'user' | 'assistant',
//             content: msg.chat_content,
//             timestamp: new Date(msg.created_at),
//             sources: msg.sources || [],
//           }));

//           setConversation(formattedMessages);
//           setShowWelcomeCard(false);

//           // Update localStorage with database data
//           localStorage.setItem(
//             localStorageKey,
//             JSON.stringify(formattedMessages)
//           );
//         } else if (localHistory) {
//           // If no database data but we have localStorage, use that
//           setConversation(JSON.parse(localHistory));
//           setShowWelcomeCard(false);
//         }
//       } catch (error) {
//         console.error('Error loading chat history:', error);
//       } finally {
//         setIsInitialLoad(false);
//       }
//     };

//     loadChatHistory();
//   }, [user?.id, roomId]);

//   const { messages, input, isLoading, handleInputChange, handleSubmit } =
//     useChat({
//       streamProtocol: 'text',
//       api: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/stream`,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       onFinish: async message => {
//         if (roomId && message.role === 'assistant') {
//           const { text: completeMessage, sources } = extractJsonStrings(
//             message.content
//           );
//           await saveAssistantMessageToSupabase(
//             roomId,
//             completeMessage,
//             sources
//           );

//           // Update localStorage
//           if (user?.id && roomId) {
//             updateLocalStorage(user.id, roomId, {
//               id: uuid4(),
//               role: 'assistant',
//               content: completeMessage,
//               sources,
//               timestamp: new Date(),
//             });
//           }
//         }
//       },
//       onError: (error: any) => {
//         toast.error(error, {
//           position: 'top-right',
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: false,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: 'light',
//         });
//       },
//       initialInput: initialMessage || '',
//     });

//   // Update localStorage with new message
//   const updateLocalStorage = (
//     userId: string,
//     roomId: string,
//     message: ChatMessageInterface
//   ) => {
//     const localStorageKey = getLocalStorageKey(userId, roomId);
//     const currentHistory = JSON.parse(
//       localStorage.getItem(localStorageKey) || '[]'
//     );
//     const updatedHistory = [...currentHistory, message];
//     localStorage.setItem(localStorageKey, JSON.stringify(updatedHistory));
//   };

//   async function saveUserMessageToSupabase(
//     roomId: string,
//     message: string,
//     userId: string,
//     sources?: string[]
//   ) {
//     const { data, error } = await supabase
//       .from('ai_assistant_chat_history')
//       .insert({
//         room_id: roomId,
//         user_id: userId,
//         role: 'user',
//         chat_content: message,
//         sources: sources || null,
//       })
//       .select()
//       .single();

//     if (error) throw error;
//     return data;
//   }

//   async function saveAssistantMessageToSupabase(
//     roomId: string,
//     message: string,
//     sources?: string[],
//     userId: string = user?.id || ''
//   ) {
//     const { data, error } = await supabase
//       .from('ai_assistant_chat_history')
//       .insert({
//         room_id: roomId,
//         user_id: userId,
//         role: 'assistant',
//         chat_content: message,
//         sources: sources || null,
//       })
//       .select()
//       .single();

//     if (error) throw error;
//     return data;
//   }

//   useEffect(() => {
//     if (roomId && user?.id && initialMessage && !isInitialLoad) {
//       const submitEvent = new Event('submit') as unknown as React.FormEvent;
//       clearInitialData();
//       handleChatSubmit(submitEvent, initialMessage);
//     }
//   }, [roomId, user?.id, initialMessage, isInitialLoad]);

//   const fetchAllLinkPreviews = async (sources: string[]) => {
//     if (!sources.length) return;

//     setIsLoadingPreviews(true);
//     const previews: Record<string, LinkPreview> = { ...linkPreviews };

//     try {
//       const previewPromises = sources.map(async source => {
//         if (previews[source]) return;

//         const preview = await fetchLinkPreview(source);
//         if (preview) {
//           previews[source] = preview;
//         }
//       });

//       await Promise.all(previewPromises);
//       setLinkPreviews(previews);
//     } catch (error) {
//       console.log('Error in batch fetching link previews:', error);
//     } finally {
//       setIsLoadingPreviews(false);
//     }
//   };

//   function extractJsonStrings(inpVal: any): {
//     text: string;
//     sources?: string[];
//   } {
//     const regex = /data:\s*(\{.*?\})(?=\n|$)/g;
//     const matches = [];
//     let match;
//     let sources: string[] | undefined;

//     while ((match = regex.exec(inpVal)) !== null) {
//       try {
//         const parsed = JSON.parse(match[1]);
//         matches.push(parsed);

//         if (parsed.type === 'sources') {
//           sources = parsed.content;
//         }
//       } catch (e) {
//         console.error('Error parsing JSON:', e);
//       }
//     }

//     const line: any = matches?.map((item: any) => {
//       if (item?.type === 'token') {
//         return item?.content;
//       }
//       return '';
//     });

//     return {
//       text: line?.join(''),
//       sources,
//     };
//   }

//   const openSourcesSlider = (sources: string[]) => {
//     setCurrentSources(sources);
//     // setShowSourcesSlider(true);
//     fetchAllLinkPreviews(sources);
//     document.body.classList.add('overflow-hidden');
//   };

//   const closeSourcesSlider = () => {
//     setShowSourcesSlider(false);
//     document.body.classList.remove('overflow-hidden');
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleChatSubmit(e as unknown as React.FormEvent);
//     }
//   };

//   useEffect(() => {
//     if (!messages?.length) return;

//     const { text: lastChatMessage, sources } = extractJsonStrings(
//       messages[messages.length - 1]?.content
//     );

//     setConversation(prev => {
//       const lastMessage = prev[prev.length - 1];
//       if (lastMessage?.role === 'assistant') {
//         return [
//           ...prev.slice(0, -1),
//           {
//             ...lastMessage,
//             content: lastChatMessage,
//             sources,
//             timestamp: new Date(),
//           },
//         ];
//       }
//       return [
//         ...prev,
//         {
//           id: uuid4(),
//           role: 'assistant',
//           content: lastChatMessage,
//           sources,
//           timestamp: new Date(),
//         },
//       ];
//     });
//   }, [messages]);

//   useEffect(() => {
//     const container = document.getElementById('main_container');
//     container?.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
//   }, [conversation]);

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (
//         popoverRef.current &&
//         buttonRef.current &&
//         !popoverRef.current.contains(event.target as Node) &&
//         !buttonRef.current.contains(event.target as Node)
//       ) {
//         setShowPopover(false);
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleChatSubmit = async (e: React.FormEvent, message?: string) => {
//     e.preventDefault();

//     const submittedMessage = message || input.trim();
//     if (!submittedMessage && !input.trim()) return;
//     if (roomId === null) {
//       onFirstSubmit?.(submittedMessage);
//       return;
//     }

//     try {
//       const userMessage = {
//         id: uuid4(),
//         role: 'user' as const,
//         content: submittedMessage,
//         timestamp: new Date(),
//       };

//       setConversation(prev => [...prev, userMessage]);
//       setShowWelcomeCard(false);

//       if (user?.id && roomId) {
//         updateLocalStorage(user.id, roomId, userMessage);
//       }

//       if (user?.id && roomId) {
//         await saveUserMessageToSupabase(roomId, submittedMessage, user.id);
//       }

//       const payload = {
//         user_id: user?.id,
//         thread_id: uniqueThread,
//         message: submittedMessage,
//       };

//       handleSubmit(undefined, { body: payload });
//       clearInitialData();
//     } catch (error) {
//       console.error('Error submitting message:', error);
//     }
//   };

//   const handleQuestionClick = (questionText: string) => {
//     setInitialMessage(questionText);
//     const submitEvent = new Event('submit') as unknown as React.FormEvent;
//     handleChatSubmit(submitEvent, questionText);
//   };

//   useEffect(() => {
//     if (user?.id && !isInitialLoad) {
//       const search = searchparams?.get('message');
//       if (search) {
//         handleInputChange({
//           target: { value: search },
//         } as React.ChangeEvent<HTMLInputElement>);
//         const submitEvent = new Event('submit') as unknown as React.FormEvent;
//         handleChatSubmit(submitEvent);
//       }
//     }
//   }, [user?.id, isInitialLoad]);

//   const { handleFirstSubmit } = useCreateAssistantRoom();
//   const [userInfo, setUserInfo] = useState<any>(null);
//   const categories = [
//     {
//       icon: <BudgetTrackerIcon />,
//       label: 'Budget Tracker',
//       prompt: `Plan the budget breakdown for my wedding if my total expendeniture is ${
//         userInfo?.estimate_budget
//           ? `$${Number(userInfo.estimate_budget.replace(/,/g, '')).toLocaleString()}`
//           : 'a flexible budget'
//       }`,
//     },
//     {
//       icon: <VenueDesignIcon />,
//       label: 'Venue Design',
//       prompt: `Find me venues based on my total budget expenditure of my wedding of ${
//         userInfo?.estimate_budget
//           ? `$${Number(userInfo.estimate_budget.replace(/,/g, '')).toLocaleString()}`
//           : 'a flexible budget'
//       } and the location is ${userInfo?.wedding_location ? userInfo.wedding_location : 'anywhere'}`,
//     },
//     // {
//     //   icon: <MenuPlanningIcon />,
//     //   label: 'Menu Planning',
//     // },
//     // {
//     //   icon: <Gift />,
//     //   label: 'Wedding card',
//     // },
//   ];

//   useEffect(() => {
//     const fetchOnbodardingData = async () => {
//       const { data: userInfoData } = await supabase
//         .from('onboarding_userInfo')
//         .select('*')
//         .eq('id', user?.id)
//         .single();

//       setUserInfo(userInfoData);
//     };
//     fetchOnbodardingData();
//   }, []);

//   // Add file upload handler
//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setAttachment(file);
//       setAttachmentPreview(URL.createObjectURL(file));
//       setShowAttachmentPrompt(true);
//       setShowPopover(false); // Hide popover after selecting a file

//       // Reset the file input value so we can upload the same file again if needed
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }
//     }
//   };

//   // Add function to handle attachment submission
//   const handleAttachmentSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!attachment) return;

//     try {
//       await generateImage(attachmentPrompt, attachment);

//       // Reset attachment states
//       setAttachment(null);
//       setAttachmentPreview(null);
//       setShowAttachmentPrompt(false);
//       setAttachmentPrompt('');

//       // Reset the file input value
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }
//     } catch (error) {
//       console.error('Error submitting attachment:', error);
//     }
//   };

//   // Add function to cancel attachment
//   const cancelAttachment = () => {
//     setAttachment(null);
//     setAttachmentPreview(null);
//     setShowAttachmentPrompt(false);
//     setAttachmentPrompt('');

//     // Reset the file input value
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   // Add a function to toggle the popover
//   const togglePopover = () => {
//     setShowPopover(prev => !prev);
//   };

//   // Add a function to generate images with text prompt and optional image
//   const generateImage = async (
//     prompt: string,
//     imageFile: File | null = null
//   ) => {
//     try {
//       // setIsLoading(true);

//       const formData = new FormData();
//       formData.append('prompt', prompt);

//       if (imageFile) {
//         formData.append('attachment', imageFile);
//       }

//       // Submit the form data to your API endpoint
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/edit-image`,
//         {
//           method: 'POST',
//           body: formData,
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();

//       if (result.image_urls && result.image_urls.length > 0) {
//         // Add the user message to the conversation
//         const userMessage = {
//           id: uuid4(),
//           role: 'user' as const,
//           content: prompt,
//           attachment: imageFile ? URL.createObjectURL(imageFile) : null,
//           timestamp: new Date(),
//         };

//         setConversation(prev => [...prev, userMessage]);

//         // Add the assistant message with generated images
//         const assistantMessage = {
//           id: uuid4(),
//           role: 'assistant' as const,
//           content: `Here are the generated images based on your request:`,
//           generatedImages: result.image_urls,
//           timestamp: new Date(),
//           remainingCredits: result.remainingCredits,
//         };

//         setConversation(prev => [...prev, assistantMessage]);

//         // Update remaining credits if available
//         if (result.remainingCredits !== undefined) {
//           // Update credits in your state or context if needed
//         }
//       } else {
//         toast.error('No images were generated. Please try again.');
//       }

//       return result;
//     } catch (error) {
//       console.error('Error generating image:', error);
//       toast.error('Failed to generate images. Please try again later.');
//       throw error;
//     } finally {
//       // setIsLoading(false);
//     }
//   };

//   return (
//     <div className='w-full mx-auto'>
//       {/* <SourcesSlider
//         sources={currentSources}
//         isOpen={showSourcesSlider}
//         onClose={closeSourcesSlider}
//         linkPreviews={linkPreviews}
//         isLoading={isLoadingPreviews}
//       /> */}

//       {showSourcesSlider && (
//         <div
//           className='fixed inset-0 bg-black bg-opacity-30 z-40 backdrop-blur-sm'
//           onClick={closeSourcesSlider}
//         />
//       )}

//       <p className='text-4xl text-center font-semibold text-[#7e22ce] mt-8'>
//         Wedding Assistant
//       </p>
//       <div className='flex space-x-4 overflow-x-auto pb-4 max-w-3xl mx-auto scrollbar-hide mt-10 justify-center'>
//         {categories.map((category, index) => (
//           <div
//             key={index}
//             className='flex w-full justify-center items-center border border-gray-100 shadow-sm space-x-2 px-5 py-3 rounded-lg bg-white hover:bg-purple-50/50 transition-all duration-200 whitespace-nowrap cursor-pointer'
//             onClick={() => handleFirstSubmit(category.prompt)}
//           >
//             {category.icon}
//             <span className='font-medium text-[14px] text-gray-700'>
//               {category.label}
//             </span>
//           </div>
//         ))}
//       </div>

//       <div className='max-w-5xl mx-auto px-4 py-6'>
//         <div className='space-y-4 mb-8'>
//           <PopularQuestionsSection
//             questions={questions}
//             onQuestionClick={handleQuestionClick}
//           />
//         </div>

//         {!roomId && <WeddingAssistantInitial />}
//         <div className='space-y-6'>
//           {conversation.map(message => (
//             <ChatMessage
//               key={message.id}
//               message={message}
//               onViewSources={sources => openSourcesSlider(sources)}
//               linkPreviews={linkPreviews}
//             />
//           ))}

//           {isLoading && (
//             <div className='flex justify-start mb-6'>
//               <div className='rounded-2xl bg-white border border-gray-200 p-4 shadow-sm'>
//                 <LoadingRingsIcon />
//               </div>
//             </div>
//           )}
//           <div ref={chatEndRef} />
//         </div>
//       </div>

//       <div className='sticky bottom-0 bg-transparent p-4 pb-10 backdrop-blur-sm'>
//         <div className='max-w-4xl mx-auto'>
//           {showAttachmentPrompt ? (
//             <form onSubmit={handleAttachmentSubmit} className='mb-4'>
//               <div className='rounded-xl border border-gray-200 bg-white p-3 shadow-sm'>
//                 {attachmentPreview && (
//                   <div className='relative mb-3 inline-block'>
//                     <img
//                       src={attachmentPreview}
//                       alt='Uploaded attachment'
//                       className='h-24 w-auto rounded-md object-cover'
//                     />
//                     <button
//                       type='button'
//                       onClick={cancelAttachment}
//                       className='absolute -top-2 -right-2 rounded-full bg-gray-800 p-1 text-white hover:bg-gray-900'
//                     >
//                       <X className='h-4 w-4' />
//                     </button>
//                   </div>
//                 )}
//                 <textarea
//                   value={attachmentPrompt}
//                   onChange={e => setAttachmentPrompt(e.target.value)}
//                   placeholder='Add a description about this image...'
//                   className='w-full resize-none border-0 bg-transparent p-0 placeholder-gray-400 focus:ring-0 focus:outline-none text-gray-800 sm:text-sm max-h-32'
//                   rows={2}
//                 />
//                 <div className='flex justify-end pt-2 border-t border-gray-100 mt-2'>
//                   <button
//                     type='button'
//                     onClick={cancelAttachment}
//                     className='mr-2 px-4 py-2 text-gray-600 hover:text-gray-800'
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type='submit'
//                     className='rounded-full bg-purple-600 text-white px-4 py-2 hover:bg-purple-700 transition-colors shadow-sm flex items-center gap-1.5 font-medium'
//                   >
//                     Send
//                     <Send className='h-4 w-4' />
//                   </button>
//                 </div>
//               </div>
//             </form>
//           ) : (
//             <form onSubmit={handleChatSubmit}>
//               <div className='rounded-xl border border-gray-200 bg-white p-3 shadow-sm focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-opacity-50 transition-all duration-200'>
//                 <textarea
//                   ref={textareaRef}
//                   value={input}
//                   onChange={handleInputChange}
//                   onKeyDown={handleKeyDown}
//                   placeholder='Ask me about wedding planning...'
//                   className='w-full resize-none border-0 bg-transparent p-0 placeholder-gray-400 focus:ring-0 focus:outline-none text-gray-800 sm:text-sm max-h-32'
//                   rows={1}
//                 />
//                 <div className='flex items-center justify-between pt-2 border-t border-gray-100 mt-2'>
//                   <div
//                     className='relative flex space-x-1 w-2/4'
//                     onMouseEnter={() => setIsHovered(true)}
//                     onMouseLeave={() => setIsHovered(false)}
//                   >
//                     <button
//                       type='button'
//                       ref={buttonRef}
//                       className='text-gray-500 hover:text-purple-600 transition-colors p-2 rounded-full hover:bg-gray-100'
//                       aria-label='Add attachment'
//                     >
//                       <PlusCircle className='h-5 w-5' />
//                     </button>
//                     <button
//                       type='button'
//                       className='text-gray-500 hover:text-purple-600 transition-colors p-2 rounded-full hover:bg-gray-100'
//                       aria-label='Record audio'
//                     >
//                       <Mic className='h-5 w-5' />
//                     </button>

//                     {isHovered && (
//                       <div
//                         ref={popoverRef}
//                         className='absolute bottom-8 left-0 bg-white rounded-lg shadow-lg p-3 flex space-x-4 border border-gray-200 z-10'
//                       >
//                         <button
//                           type='button'
//                           className='flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 group'
//                           onClick={() => fileInputRef.current?.click()}
//                         >
//                           <div className='p-2 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors mb-1'>
//                             <ImageIcon className='h-5 w-5 text-purple-700' />
//                           </div>
//                           <span className='text-sm text-gray-700'>Photo</span>
//                         </button>
//                         <button className='flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 group'>
//                           <div className='p-2 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors mb-1'>
//                             <FileText className='h-5 w-5 text-purple-700' />
//                           </div>
//                           <span className='text-sm text-gray-700'>Files</span>
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                   <button
//                     type='submit'
//                     disabled={isLoading}
//                     className='rounded-full bg-purple-600 text-white px-4 py-2 hover:bg-purple-700 transition-colors shadow-sm flex items-center gap-1.5 font-medium'
//                   >
//                     {isLoading ? 'Sending...' : 'Send'}
//                     <Send className='h-4 w-4' />
//                   </button>
//                 </div>
//               </div>
//             </form>
//           )}

//           {/* {showPopover && ( */}
//           {showPopover && (
//             <div
//               ref={popoverRef}
//               className='absolute bottom-20 left-4 md:left-1/4 bg-white rounded-lg shadow-lg p-3 flex space-x-4 border border-gray-200 z-10'
//             >
//               <button
//                 type='button'
//                 className='flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 group'
//                 onClick={() => fileInputRef.current?.click()}
//               >
//                 <div className='p-2 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors mb-1'>
//                   <ImageIcon className='h-5 w-5 text-purple-700' />
//                 </div>
//                 <span className='text-sm text-gray-700'>Photo</span>
//               </button>
//               <button className='flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 group'>
//                 <div className='p-2 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors mb-1'>
//                   <FileText className='h-5 w-5 text-purple-700' />
//                 </div>
//                 <span className='text-sm text-gray-700'>Files</span>
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//       {/* Hidden file input */}
//       <input
//         ref={fileInputRef}
//         type='file'
//         accept='image/*'
//         onChange={handleFileUpload}
//         className='hidden'
//       />
//     </div>
//   );
// };

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { v4 as uuid4 } from 'uuid';
import { FileText, ImageIcon, Mic, PlusCircle, Send, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { ChatMessage } from '@/components/ui/ChatMessage';
import { PopularQuestionsSection } from '@/components/ui/PopularQuestionSection';
import {
  BudgetTrackerIcon,
  LoadingRingsIcon,
  VenueDesignIcon,
} from '@/components/icons';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/app/store/authStore';
import { ChatMessageInterface, LinkPreview } from '@/app/@types';
import { createClient } from '@/app/utils/supabase/client';
import { useAssistantStore } from '@/app/store/assistantStore';
import { questions } from '@/app/@content';
import { fetchLinkPreview } from '@/utils/fetchImagePreview';
import WeddingAssistantInitial from './WeddingAssistantInitial';
import { useCreateAssistantRoom } from '@/utils/useCreateAssistantRoom';

type Props = {
  roomId: string | null;
  onFirstSubmit?: (message: string) => void;
};

// LocalStorage key structure
const getLocalStorageKey = (userId: string | null, roomId: string) =>
  `chatHistory_${userId}_${roomId}`;

export const WeddingAssistantChat: React.FC<Props> = ({
  roomId,
  onFirstSubmit,
}) => {
  const { user } = useAuthStore();
  const searchparams = useSearchParams();
  const supabase = createClient();

  const { clearInitialData, initialMessage, setInitialMessage } =
    useAssistantStore();

  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [conversation, setConversation] = useState<ChatMessageInterface[]>([]);
  const [uniqueThread] = useState(() => uuid4());

  const [showSourcesSlider, setShowSourcesSlider] = useState(false);
  const [currentSources, setCurrentSources] = useState<string[]>([]);
  const [linkPreviews, setLinkPreviews] = useState<Record<string, LinkPreview>>(
    {}
  );
  const [isLoadingPreviews, setIsLoadingPreviews] = useState(false);
  const [showWelcomeCard, setShowWelcomeCard] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Add new state variables
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(
    null
  );
  const [showAttachmentPrompt, setShowAttachmentPrompt] = useState(false);
  const [attachmentPrompt, setAttachmentPrompt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user?.id || !roomId) return;

    const loadChatHistory = async () => {
      try {
        // First check if we have data in localStorage
        const localStorageKey = getLocalStorageKey(user?.id, roomId);
        const localHistory = localStorage.getItem(localStorageKey);

        // Always fetch from database to ensure we have the latest data
        const { data, error } = await supabase
          .from('ai_assistant_chat_history')
          .select('*')
          .eq('room_id', roomId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          const formattedMessages = data.map(msg => ({
            id: msg.id || uuid4(),
            role: msg.role as 'user' | 'assistant',
            content: msg.chat_content,
            timestamp: new Date(msg.created_at),
            sources: msg.sources || [],
          }));

          setConversation(formattedMessages);
          setShowWelcomeCard(false);

          // Update localStorage with database data
          localStorage.setItem(
            localStorageKey,
            JSON.stringify(formattedMessages)
          );
        } else if (localHistory) {
          // If no database data but we have localStorage, use that
          setConversation(JSON.parse(localHistory));
          setShowWelcomeCard(false);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      } finally {
        setIsInitialLoad(false);
      }
    };

    loadChatHistory();
  }, [user?.id, roomId]);

  const { messages, input, isLoading, handleInputChange, handleSubmit } =
    useChat({
      streamProtocol: 'text',
      api: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/stream`,
      headers: {
        'Content-Type': 'application/json',
      },
      onFinish: async message => {
        if (roomId && message.role === 'assistant') {
          const { text: completeMessage, sources } = extractJsonStrings(
            message.content
          );
          await saveAssistantMessageToSupabase(
            roomId,
            completeMessage,
            sources
          );

          // Update localStorage
          if (user?.id && roomId) {
            updateLocalStorage(user.id, roomId, {
              id: uuid4(),
              role: 'assistant',
              content: completeMessage,
              sources,
              timestamp: new Date(),
            });
          }
        }
      },
      onError: (error: any) => {
        toast.error(error, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      },
      initialInput: initialMessage || '',
    });

  // Update localStorage with new message
  const updateLocalStorage = (
    userId: string,
    roomId: string,
    message: ChatMessageInterface
  ) => {
    const localStorageKey = getLocalStorageKey(userId, roomId);
    const currentHistory = JSON.parse(
      localStorage.getItem(localStorageKey) || '[]'
    );
    const updatedHistory = [...currentHistory, message];
    localStorage.setItem(localStorageKey, JSON.stringify(updatedHistory));
  };

  async function saveUserMessageToSupabase(
    roomId: string,
    message: string,
    userId: string,
    sources?: string[]
  ) {
    const { data, error } = await supabase
      .from('ai_assistant_chat_history')
      .insert({
        room_id: roomId,
        user_id: userId,
        role: 'user',
        chat_content: message,
        sources: sources || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async function saveAssistantMessageToSupabase(
    roomId: string,
    message: string,
    sources?: string[],
    userId: string = user?.id || ''
  ) {
    const { data, error } = await supabase
      .from('ai_assistant_chat_history')
      .insert({
        room_id: roomId,
        user_id: userId,
        role: 'assistant',
        chat_content: message,
        sources: sources || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  useEffect(() => {
    if (roomId && user?.id && initialMessage && !isInitialLoad) {
      const submitEvent = new Event('submit') as unknown as React.FormEvent;
      clearInitialData();
      handleChatSubmit(submitEvent, initialMessage);
    }
  }, [roomId, user?.id, initialMessage, isInitialLoad]);

  const fetchAllLinkPreviews = async (sources: string[]) => {
    if (!sources.length) return;

    setIsLoadingPreviews(true);
    const previews: Record<string, LinkPreview> = { ...linkPreviews };

    try {
      const previewPromises = sources.map(async source => {
        if (previews[source]) return;

        const preview = await fetchLinkPreview(source);
        if (preview) {
          previews[source] = preview;
        }
      });

      await Promise.all(previewPromises);
      setLinkPreviews(previews);
    } catch (error) {
      console.log('Error in batch fetching link previews:', error);
    } finally {
      setIsLoadingPreviews(false);
    }
  };

  function extractJsonStrings(inpVal: any): {
    text: string;
    sources?: string[];
  } {
    const regex = /data:\s*(\{.*?\})(?=\n|$)/g;
    const matches = [];
    let match;
    let sources: string[] | undefined;

    while ((match = regex.exec(inpVal)) !== null) {
      try {
        const parsed = JSON.parse(match[1]);
        matches.push(parsed);

        if (parsed.type === 'sources') {
          sources = parsed.content;
        }
      } catch (e) {
        console.error('Error parsing JSON:', e);
      }
    }

    const line: any = matches?.map((item: any) => {
      if (item?.type === 'token') {
        return item?.content;
      }
      return '';
    });

    return {
      text: line?.join(''),
      sources,
    };
  }

  const openSourcesSlider = (sources: string[]) => {
    setCurrentSources(sources);
    // setShowSourcesSlider(true);
    fetchAllLinkPreviews(sources);
    document.body.classList.add('overflow-hidden');
  };

  const closeSourcesSlider = () => {
    setShowSourcesSlider(false);
    document.body.classList.remove('overflow-hidden');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatSubmit(e as unknown as React.FormEvent);
    }
  };

  useEffect(() => {
    if (!messages?.length) return;

    const { text: lastChatMessage, sources } = extractJsonStrings(
      messages[messages.length - 1]?.content
    );

    setConversation(prev => {
      const lastMessage = prev[prev.length - 1];
      if (lastMessage?.role === 'assistant') {
        return [
          ...prev.slice(0, -1),
          {
            ...lastMessage,
            content: lastChatMessage,
            sources,
            timestamp: new Date(),
          },
        ];
      }
      return [
        ...prev,
        {
          id: uuid4(),
          role: 'assistant',
          content: lastChatMessage,
          sources,
          timestamp: new Date(),
        },
      ];
    });
  }, [messages]);

  useEffect(() => {
    const container = document.getElementById('main_container');
    container?.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }, [conversation]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        buttonRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowPopover(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChatSubmit = async (e: React.FormEvent, message?: string) => {
    e.preventDefault();

    const submittedMessage = message || input.trim();
    if (!submittedMessage && !input.trim()) return;
    if (roomId === null) {
      onFirstSubmit?.(submittedMessage);
      return;
    }

    try {
      const userMessage = {
        id: uuid4(),
        role: 'user' as const,
        content: submittedMessage,
        timestamp: new Date(),
      };

      setConversation(prev => [...prev, userMessage]);
      setShowWelcomeCard(false);

      if (user?.id && roomId) {
        updateLocalStorage(user.id, roomId, userMessage);
      }

      if (user?.id && roomId) {
        await saveUserMessageToSupabase(roomId, submittedMessage, user.id);
      }

      // Check if there's an attachment - if so, use edit-image API
      if (attachment) {
        await handleImageSubmission(submittedMessage);
      } else {
        // Regular text-only message - use stream API
        const payload = {
          user_id: user?.id,
          thread_id: uniqueThread,
          message: submittedMessage,
        };

        handleSubmit(undefined, { body: payload });
      }

      clearInitialData();
    } catch (error) {
      console.error('Error submitting message:', error);
    }
  };

  const handleQuestionClick = (questionText: string) => {
    setInitialMessage(questionText);
    const submitEvent = new Event('submit') as unknown as React.FormEvent;
    handleChatSubmit(submitEvent, questionText);
  };

  useEffect(() => {
    if (user?.id && !isInitialLoad) {
      const search = searchparams?.get('message');
      if (search) {
        handleInputChange({
          target: { value: search },
        } as React.ChangeEvent<HTMLInputElement>);
        const submitEvent = new Event('submit') as unknown as React.FormEvent;
        handleChatSubmit(submitEvent);
      }
    }
  }, [user?.id, isInitialLoad]);

  const { handleFirstSubmit } = useCreateAssistantRoom();
  const [userInfo, setUserInfo] = useState<any>(null);
  const categories = [
    {
      icon: <BudgetTrackerIcon />,
      label: 'Budget Tracker',
      prompt: `Plan the budget breakdown for my wedding if my total expendeniture is ${
        userInfo?.estimate_budget
          ? `$${Number(userInfo.estimate_budget.replace(/,/g, '')).toLocaleString()}`
          : 'a flexible budget'
      }`,
    },
    {
      icon: <VenueDesignIcon />,
      label: 'Venue Design',
      prompt: `Find me venues based on my total budget expenditure of my wedding of ${
        userInfo?.estimate_budget
          ? `$${Number(userInfo.estimate_budget.replace(/,/g, '')).toLocaleString()}`
          : 'a flexible budget'
      } and the location is ${userInfo?.wedding_location ? userInfo.wedding_location : 'anywhere'}`,
    },
    // {
    //   icon: <MenuPlanningIcon />,
    //   label: 'Menu Planning',
    // },
    // {
    //   icon: <Gift />,
    //   label: 'Wedding card',
    // },
  ];

  const cancelAttachment = () => {
    setAttachment(null);
    setAttachmentPreview(null);
    setShowAttachmentPrompt(false);
    setAttachmentPrompt('');

    // Reset the file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    const fetchOnbodardingData = async () => {
      const { data: userInfoData } = await supabase
        .from('onboarding_userInfo')
        .select('*')
        .eq('id', user?.id)
        .single();

      setUserInfo(userInfoData);
    };
    fetchOnbodardingData();
  }, []);

  // Add file upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file.');
        return;
      }

      // Validate file size (e.g., 10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB.');
        return;
      }

      setAttachment(file);
      setAttachmentPreview(URL.createObjectURL(file));
      setShowAttachmentPrompt(true);
      setShowPopover(false);
      setIsHovered(false); // Hide the hover popover

      // Reset the file input value
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageSubmission = async (prompt: string) => {
    if (!attachment) return;

    try {
      const formData = new FormData();
      formData.append('image', attachment); // Use 'image' key to match FastAPI backend
      formData.append('prompt', prompt);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/edit-image`, // Remove '/api' prefix
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.image_urls && result.image_urls.length > 0) {
        // Add the assistant message with generated images
        const assistantMessage = {
          id: uuid4(),
          role: 'assistant' as const,
          content: `Here are the generated images based on your request:`,
          generatedImages: result.image_urls,
          timestamp: new Date(),
        };

        setConversation(prev => [...prev, assistantMessage]);

        // Save assistant message to Supabase
        if (user?.id && roomId) {
          await saveAssistantMessageToSupabase(
            roomId,
            assistantMessage.content,
            [],
            user.id
          );
          updateLocalStorage(user.id, roomId, assistantMessage);
        }
      } else {
        toast.error('No images were generated. Please try again.');
      }

      // Reset attachment states after successful submission
      setAttachment(null);
      setAttachmentPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate images. Please try again later.');
    }
  };

  const handleAttachmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!attachment || !attachmentPrompt.trim()) return;

    try {
      // Add user message with attachment preview
      const userMessage = {
        id: uuid4(),
        role: 'user' as const,
        content: attachmentPrompt,
        attachment: attachmentPreview,
        timestamp: new Date(),
      };

      setConversation(prev => [...prev, userMessage]);
      setShowWelcomeCard(false);

      if (user?.id && roomId) {
        updateLocalStorage(user.id, roomId, userMessage);
        await saveUserMessageToSupabase(roomId, attachmentPrompt, user.id);
      }

      // Handle the image submission
      await handleImageSubmission(attachmentPrompt);

      // Reset attachment states
      setAttachment(null);
      setAttachmentPreview(null);
      setShowAttachmentPrompt(false);
      setAttachmentPrompt('');

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error submitting attachment:', error);
    }
  };

  // Add a function to toggle the popover
  const togglePopover = () => {
    setShowPopover(prev => !prev);
  };

  return (
    <div className='w-full mx-auto'>
      {/* <SourcesSlider
        sources={currentSources}
        isOpen={showSourcesSlider}
        onClose={closeSourcesSlider}
        linkPreviews={linkPreviews}
        isLoading={isLoadingPreviews}
      /> */}

      {showSourcesSlider && (
        <div
          className='fixed inset-0 bg-black bg-opacity-30 z-40 backdrop-blur-sm'
          onClick={closeSourcesSlider}
        />
      )}

      <p className='text-4xl text-center font-semibold text-[#7e22ce] mt-8'>
        Wedding Assistant
      </p>
      <div className='flex space-x-4 overflow-x-auto pb-4 max-w-3xl mx-auto scrollbar-hide mt-10 justify-center'>
        {categories.map((category, index) => (
          <div
            key={index}
            className='flex w-full justify-center items-center border border-gray-100 shadow-sm space-x-2 px-5 py-3 rounded-lg bg-white hover:bg-purple-50/50 transition-all duration-200 whitespace-nowrap cursor-pointer'
            onClick={() => handleFirstSubmit(category.prompt)}
          >
            {category.icon}
            <span className='font-medium text-[14px] text-gray-700'>
              {category.label}
            </span>
          </div>
        ))}
      </div>

      <div className='max-w-5xl mx-auto px-4 py-6'>
        <div className='space-y-4 mb-8'>
          <PopularQuestionsSection
            questions={questions}
            onQuestionClick={handleQuestionClick}
          />
        </div>

        {!roomId && <WeddingAssistantInitial />}
        <div className='space-y-6'>
          {conversation.map(message => (
            <ChatMessage
              key={message.id}
              message={message}
              onViewSources={sources => openSourcesSlider(sources)}
              linkPreviews={linkPreviews}
            />
          ))}

          {isLoading && (
            <div className='flex justify-start mb-6'>
              <div className='rounded-2xl bg-white border border-gray-200 p-4 shadow-sm'>
                <LoadingRingsIcon />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      <div className='sticky bottom-0 bg-transparent p-4 pb-10 backdrop-blur-sm'>
        <div className='max-w-4xl mx-auto'>
          {showAttachmentPrompt ? (
            <form onSubmit={handleAttachmentSubmit} className='mb-4'>
              <div className='rounded-xl border border-gray-200 bg-white p-3 shadow-sm'>
                {attachmentPreview && (
                  <div className='relative mb-3 inline-block'>
                    <img
                      src={attachmentPreview || '/placeholder.svg'}
                      alt='Uploaded attachment'
                      className='h-24 w-auto rounded-md object-cover'
                    />
                    <button
                      type='button'
                      onClick={cancelAttachment}
                      className='absolute -top-2 -right-2 rounded-full bg-gray-800 p-1 text-white hover:bg-gray-900'
                    >
                      <X className='h-4 w-4' />
                    </button>
                  </div>
                )}
                <textarea
                  value={attachmentPrompt}
                  onChange={e => setAttachmentPrompt(e.target.value)}
                  placeholder='Add a description about this image...'
                  className='w-full resize-none border-0 bg-transparent p-0 placeholder-gray-400 focus:ring-0 focus:outline-none text-gray-800 sm:text-sm max-h-32'
                  rows={2}
                />
                <div className='flex justify-end pt-2 border-t border-gray-100 mt-2'>
                  <button
                    type='button'
                    onClick={cancelAttachment}
                    className='mr-2 px-4 py-2 text-gray-600 hover:text-gray-800'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='rounded-full bg-purple-600 text-white px-4 py-2 hover:bg-purple-700 transition-colors shadow-sm flex items-center gap-1.5 font-medium'
                  >
                    Send
                    <Send className='h-4 w-4' />
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleChatSubmit}>
              <div className='rounded-xl border border-gray-200 bg-white p-3 shadow-sm focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-opacity-50 transition-all duration-200'>
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder='Ask me about wedding planning...'
                  className='w-full resize-none border-0 bg-transparent p-0 placeholder-gray-400 focus:ring-0 focus:outline-none text-gray-800 sm:text-sm max-h-32'
                  rows={1}
                />
                <div className='flex items-center justify-between pt-2 border-t border-gray-100 mt-2'>
                  <div className='relative flex space-x-1 w-2/4'>
                    <button
                      type='button'
                      ref={buttonRef}
                      onClick={togglePopover}
                      className='text-gray-500 hover:text-purple-600 transition-colors p-2 rounded-full hover:bg-gray-100'
                      aria-label='Add attachment'
                    >
                      <PlusCircle className='h-5 w-5' />
                    </button>
                    <button
                      type='button'
                      className='text-gray-500 hover:text-purple-600 transition-colors p-2 rounded-full hover:bg-gray-100'
                      aria-label='Record audio'
                    >
                      <Mic className='h-5 w-5' />
                    </button>

                    {isHovered && (
                      <div
                        ref={popoverRef}
                        className='absolute bottom-8 left-0 bg-white rounded-lg shadow-lg p-3 flex space-x-4 border border-gray-200 z-10'
                      >
                        <button
                          type='button'
                          className='flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 group'
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <div className='p-2 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors mb-1'>
                            <ImageIcon className='h-5 w-5 text-purple-700' />
                          </div>
                          <span className='text-sm text-gray-700'>Photo</span>
                        </button>
                        <button className='flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 group'>
                          <div className='p-2 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors mb-1'>
                            <FileText className='h-5 w-5 text-purple-700' />
                          </div>
                          <span className='text-sm text-gray-700'>Files</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    type='submit'
                    disabled={isLoading}
                    className='rounded-full bg-purple-600 text-white px-4 py-2 hover:bg-purple-700 transition-colors shadow-sm flex items-center gap-1.5 font-medium'
                  >
                    {isLoading ? 'Sending...' : 'Send'}
                    <Send className='h-4 w-4' />
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* {showPopover && ( */}
          {showPopover && (
            <div
              ref={popoverRef}
              className='absolute bottom-20 left-4 md:left-1/4 bg-white rounded-lg shadow-lg p-3 flex space-x-4 border border-gray-200 z-10'
            >
              <button
                type='button'
                className='flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 group'
                onClick={() => fileInputRef.current?.click()}
              >
                <div className='p-2 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors mb-1'>
                  <ImageIcon className='h-5 w-5 text-purple-700' />
                </div>
                <span className='text-sm text-gray-700'>Photo</span>
              </button>
              <button className='flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 group'>
                <div className='p-2 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors mb-1'>
                  <FileText className='h-5 w-5 text-purple-700' />
                </div>
                <span className='text-sm text-gray-700'>Files</span>
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        onChange={handleFileUpload}
        className='hidden'
      />
    </div>
  );
};
