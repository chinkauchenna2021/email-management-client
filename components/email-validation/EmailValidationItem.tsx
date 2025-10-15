import { useState } from "react";
import { ValidationBadge } from "./ValidationBadge";
import { ValidationDetails } from "./ValidationDetails";
import { ChevronDown, ChevronUp, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmailValidationResult } from "@/lib/email/types";

interface EmailValidationItemProps {
  email: string;
  result?: EmailValidationResult;
  isLoading?: boolean;
  onRemove?: (email: string) => void;
  className?: string;
}

export function EmailValidationItem({ 
  email, 
  result, 
  isLoading, 
  onRemove, 
  className 
}: EmailValidationItemProps) {
  const [showDetails, setShowDetails] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
  };

  return (
    <div className={`border rounded-lg bg-white hover:shadow-sm transition-shadow ${className}`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <span className="font-medium text-sm truncate" title={email}>
              {email}
            </span>
            <ValidationBadge result={result} isLoading={isLoading} />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 w-8 p-0"
            >
              <Copy className="w-4 h-4" />
            </Button>
            
            {result && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="h-8 w-8 p-0"
              >
                {showDetails ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            )}
            
            {onRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(email)}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {showDetails && result && (
          <div className="mt-4">
            <ValidationDetails result={result} />
          </div>
        )}
      </div>
    </div>
  );
}