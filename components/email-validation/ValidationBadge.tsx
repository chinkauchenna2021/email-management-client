import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, Clock, RefreshCw } from "lucide-react";
import { EmailValidationResult } from "@/lib/email/types";

interface ValidationBadgeProps {
  result?: EmailValidationResult;
  isLoading?: boolean;
  className?: string;
}


export function ValidationBadge({ result, isLoading, className }: ValidationBadgeProps) {
  if (isLoading) {
    return (
      <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
        <Clock className="w-3 h-3 mr-1 animate-pulse" />
        Validating...
      </Badge>
    )
  }

  if (!result) {
    return null
  }

  const { isValid, qualityScore, riskLevel } = result

  if (!isValid) {
    return (
      <Badge variant="outline" className="bg-red-500/20 text-red-300 border-red-500/30">
        <XCircle className="w-3 h-3 mr-1" />
        Invalid
      </Badge>
    )
  }

  const getVariant = () => {
    switch (riskLevel) {
      case 'high':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'low':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      default:
        return 'bg-zinc-700 text-zinc-300 border-zinc-600'
    }
  }

  const getIcon = () => {
    switch (riskLevel) {
      case 'high':
        return <AlertTriangle className="w-3 h-3 mr-1" />
      case 'medium':
        return <AlertTriangle className="w-3 h-3 mr-1" />
      case 'low':
        return <CheckCircle className="w-3 h-3 mr-1" />
      default:
        return <CheckCircle className="w-3 h-3 mr-1" />
    }
  }

  const getText = () => {
    switch (riskLevel) {
      case 'high':
        return `High Risk (${qualityScore}%)`
      case 'medium':
        return `Medium Risk (${qualityScore}%)`
      case 'low':
        return `Valid (${qualityScore}%)`
      default:
        return `Valid (${qualityScore}%)`
    }
  }

  return (
    <Badge variant="outline" className={`${getVariant()} ${className}`}>
      {getIcon()}
      {getText()}
    </Badge>
  )
}