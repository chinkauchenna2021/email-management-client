import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, Clock } from "lucide-react";
import { EmailValidationResult } from "@/lib/email/types";

interface ValidationBadgeProps {
  result?: EmailValidationResult;
  isLoading?: boolean;
  className?: string;
}

export function ValidationBadge({ result, isLoading, className }: ValidationBadgeProps) {
  if (isLoading) {
    return (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        <Clock className="w-3 h-3 mr-1 animate-pulse" />
        Validating...
      </Badge>
    );
  }

  if (!result) {
    return null;
  }

  const { isValid, qualityScore, riskLevel } = result;

  if (!isValid) {
    return (
      <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200">
        <XCircle className="w-3 h-3 mr-1" />
        Invalid
      </Badge>
    );
  }

  const getVariant = () => {
    switch (riskLevel) {
      case 'high':
        return "bg-red-50 text-red-700 border-red-200";
      case 'medium':
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case 'low':
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getIcon = () => {
    switch (riskLevel) {
      case 'high':
        return <AlertTriangle className="w-3 h-3 mr-1" />;
      case 'medium':
        return <AlertTriangle className="w-3 h-3 mr-1" />;
      case 'low':
        return <CheckCircle className="w-3 h-3 mr-1" />;
      default:
        return <CheckCircle className="w-3 h-3 mr-1" />;
    }
  };

  const getText = () => {
    switch (riskLevel) {
      case 'high':
        return `High Risk (${qualityScore}%)`;
      case 'medium':
        return `Medium Risk (${qualityScore}%)`;
      case 'low':
        return `Valid (${qualityScore}%)`;
      default:
        return `Valid (${qualityScore}%)`;
    }
  };

  return (
    <Badge variant="outline" className={`${getVariant()} ${className}`}>
      {getIcon()}
      {getText()}
    </Badge>
  );
}