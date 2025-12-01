import { Question } from '@/app/@types';

export const PopularQuestionCard = ({
  question,
  onClick,
}: {
  question: Question;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className='group w-full rounded-xl bg-white border border-gray-100 p-4 text-left shadow-sm transition-all duration-300 hover:shadow-md hover:border-purple-200 hover:bg-purple-50'
    >
      <div className='flex items-start gap-3'>
        <div>
          <p className='font-medium text-gray-800 group-hover:text-purple-700 transition-colors'>
            {question.text}
          </p>
        </div>
      </div>
    </button>
  );
};
