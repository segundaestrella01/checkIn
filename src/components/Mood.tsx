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
        w-[90px] h-[90px] m-2
        rounded-[18px] cursor-pointer
        transition-all duration-300 ease-in-out
        ${selected 
          ? 'bg-white hover:bg-secondary-color hover:scale-105 shadow-md' 
          :'bg-gradient text-white transform scale-105 shadow-lg' 
        }
      `}
      onClick={onSelect}
    >
      <div className="text-[1.8rem] mb-1 transition-transform duration-300 ease-in-out">
        {emoji}
      </div>
      <div className={`text-sm font-medium text-center transition-colors duration-300 ${selected ? 'text-gray-700' : 'text-white'}`}>
        {name}
      </div>
    </div>
  );
}