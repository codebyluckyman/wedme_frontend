import { Question } from '@/app/@types';
import { MessageSquare } from 'lucide-react';
import { PopularQuestionCard } from './PopularQuestionCard';

export const PopularQuestionsSection = ({
  questions,
  onQuestionClick,
}: {
  questions: Question[];
  onQuestionClick: (text: string) => void;
}) => {
  return (
    <div className='rounded-xl bg-white border border-gray-100 p-5 shadow-sm'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='font-semibold text-gray-900'>Popular Questions</h2>
        <div className='flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-700'>
          <MessageSquare className='h-3.5 w-3.5' />
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
        {questions.map(question => (
          <PopularQuestionCard
            key={question.id}
            question={question}
            onClick={() => onQuestionClick(question.text)}
          />
        ))}
      </div>
    </div>
  );
};
