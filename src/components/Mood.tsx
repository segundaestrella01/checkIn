interface MoodProps {
  emoji: string;
  name: string;
  selected?: boolean;
  onSelect: () => void;
}

export default function Mood({ emoji, name, selected = false, onSelect }: MoodProps) {
  return (
    <div 
      className={`
        flex flex-col items-center justify-center
        w-[100px] h-[100px] m-2.5 p-[15px]
        rounded-xl cursor-pointer
        transition-all duration-200 ease-in-out
        border-2 border-transparent
        bg-gray-100
        hover:transform hover:-translate-y-[3px]
        hover:shadow-lg
        ${selected ? 'border-[#4a90e2] bg-[#e6f2ff] -translate-y-[3px] shadow-lg' : ''}
      `}
      onClick={onSelect}
    >
      <div className="text-[2.5rem] mb-2">{emoji}</div>
      <div className="text-sm font-medium text-center text-gray-800">{name}</div>
    </div>
  );
}