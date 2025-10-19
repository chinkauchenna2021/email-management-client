import { useState } from "react";
import { ValidationBadge } from "./ValidationBadge";
import { ValidationDetails } from "./ValidationDetails";
import { Badge, CheckCircle, ChevronDown, ChevronUp, Copy, Trash2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmailValidationResult } from "@/lib/email/types";

interface EmailValidationItemProps {
  email: string;
  result?: EmailValidationResult;
  isLoading?: boolean;
  onRemove?: (email: string) => void;
  className?: string;
}



// export function EmailValidationItem({ 
//   email, 
//   result, 
//   isLoading, 
//   onRemove, 
//   className 
// }: EmailValidationItemProps) {
//   const [showDetails, setShowDetails] = useState(false);

//   const handleCopy = () => {
//     navigator.clipboard.writeText(email);
//     // You might want to add a toast notification here
//   };

//   return (
//     <div className={`
//       group relative bg-white border border-gray-200 rounded-xl 
//       hover:border-gray-300 hover:shadow-sm transition-all duration-200
//       ${showDetails ? 'shadow-sm border-blue-200' : ''}
//       ${className}
//     `}>
//       {/* Main Content - Compact Layout */}
//       <div className="p-3">
//         <div className="flex items-center gap-3">
//           {/* Status Icon with Animation */}
//           <div className="flex-shrink-0">
//             {isLoading ? (
//               <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
//             ) : result?.isValid ? (
//               <CheckCircle className="w-5 h-5 text-green-500" />
//             ) : (
//               <XCircle className="w-5 h-5 text-red-500" />
//             )}
//           </div>

//           {/* Email and Badge - Optimized Space */}
//           <div className="flex-1 min-w-0 flex items-center gap-3">
//             <span 
//               className="font-medium text-gray-900 text-sm truncate flex-1" 
//               title={email}
//             >
//               {email}
//             </span>
            
//             <div className="flex-shrink-0">
//               <ValidationBadge result={result} isLoading={isLoading} />
//             </div>
//           </div>

//           {/* Action Buttons - Compact and Clean */}
//           <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={handleCopy}
//               className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
//               title="Copy email"
//             >
//               <Copy className="w-3.5 h-3.5" />
//             </Button>
            
//             {result && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setShowDetails(!showDetails)}
//                 className={`h-7 w-7 p-0 transition-all ${
//                   showDetails 
//                     ? 'text-blue-600 bg-blue-50' 
//                     : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
//                 }`}
//                 title={showDetails ? "Hide details" : "Show details"}
//               >
//                 {showDetails ? (
//                   <ChevronUp className="w-3.5 h-3.5" />
//                 ) : (
//                   <ChevronDown className="w-3.5 h-3.5" />
//                 )}
//               </Button>
//             )}
            
//             {onRemove && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => onRemove(email)}
//                 className="h-7 w-7 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
//                 title="Remove email"
//               >
//                 <Trash2 className="w-3.5 h-3.5" />
//               </Button>
//             )}
//           </div>
//         </div>

//         {/* Quick Status Summary - Only show for invalid emails */}

//         {/* Quality Indicator - Only show for valid emails */}
//       </div>

//       {/* Expandable Details - Smooth Animation */}
//       {showDetails && result && (
//         <div className="border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
//           <div className="p-4">
//             <ValidationDetails result={result} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

















export function EmailValidationItem({
  email,
  result,
  isLoading,
  onRemove,
  className,
}: EmailValidationItemProps) {
  const [showDetails, setShowDetails] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(email)
  }

  return (
    <div
      className={`
      group relative  border  rounded-lg 
      hover:border-zinc-700 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200
      ${showDetails ? 'shadow-lg shadow-blue-500/20 border-blue-500/30' : ''}
      ${className}
    `}
    >
      {/* Main Content */}
      <div className="p-3">
        <div className="flex items-center gap-3">
          {/* Status Icon */}
          <div className="flex-shrink-0">
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            ) : result?.isValid ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
          </div>

          {/* Email and Badge */}
          <div className="flex-1 min-w-0 flex items-center gap-3">
            <span className="font-medium text-white text-sm truncate flex-1" title={email}>
              {email}
            </span>

            <div className="flex-shrink-0">
              <ValidationBadge result={result} isLoading={isLoading} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 w-7 p-0 text-zinc-400 hover:text-white hover:bg-zinc-800"
              title="Copy email"
            >
              <Copy className="w-3.5 h-3.5" />
            </Button>

            {result && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className={`h-7 w-7 p-0 transition-all ${
                  showDetails
                    ? 'text-blue-400 bg-blue-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
                title={showDetails ? 'Hide details' : 'Show details'}
              >
                {showDetails ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </Button>
            )}

            {onRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(email)}
                className="h-7 w-7 p-0 text-zinc-400 hover:text-red-400 hover:bg-red-500/20 transition-colors"
                title="Remove email"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Details */}
      {showDetails && result && (
        <div className="border-t border-zinc-800 bg-zinc-950/50 rounded-b-lg">
          <div className="p-4">
            <ValidationDetails result={result} />
          </div>
        </div>
      )}
    </div>
  )
}
// Validation Details Component


// Validation Badge Component




