import { useEffect } from 'react';

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, visible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      <div className="bg-white rounded-lg px-8 py-6 max-w-sm mx-4 relative z-50 transform transition-all">
        <div className="flex items-center space-x-3">
          <svg className="h-6 w-6 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M5 13l4 4L19 7"></path>
          </svg>
          <p className="text-gray-800 font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
}