// @ts-nocheck
import { MessageCircle } from 'lucide-react';

interface WallyPromoProps {
  title: string;
  description: string;
  buttonText?: string;
}

export default function WallyPromo({ 
  title, 
  description, 
  buttonText = "💬 Open Chat" 
}: WallyPromoProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Trigger Wally chat to open
    const wallyButton = document.querySelector('[aria-label="Open chat met Wally"]') as HTMLButtonElement;
    if (wallyButton) {
      wallyButton.click();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <a
        href="#wally-chat"
        onClick={handleClick}
        className="block max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-700 dark:to-teal-600 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
      >
        <div className="flex flex-col md:flex-row items-center gap-6 p-6">
          {/* Wally Logo */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center p-3 shadow-lg">
              <img 
                src="/repayz-wally-statiegeld-ai-logo.webp" 
                alt="Wally AI Chatbot - Eerste Statiegeld AI van Nederland" 
                className="w-full h-full"
                width="96"
                height="96"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
              {title}
            </h3>
            <p className="text-blue-100 text-sm md:text-base">
              {description}
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex-shrink-0">
            <div className="bg-white text-blue-600 font-bold px-6 py-3 rounded-full hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-md">
              <MessageCircle className="w-5 h-5" />
              <span>{buttonText}</span>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
