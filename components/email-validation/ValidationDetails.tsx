import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import { EmailValidationResult } from "@/lib/email/types";
import { Progress } from "@/components/ui/progress";

interface ValidationDetailsProps {
  result: EmailValidationResult;
  className?: string;
}

export function ValidationDetails({ result, className }: ValidationDetailsProps) {
  const { checks, qualityScore, riskLevel, suggestions } = result

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-red-300 bg-red-500/10 border-red-500/30'
      case 'medium':
        return 'text-yellow-300 bg-yellow-500/10 border-yellow-500/30'
      case 'low':
        return 'text-green-300 bg-green-500/10 border-green-500/30'
      default:
        return 'text-zinc-300 bg-zinc-800 border-zinc-700'
    }
  }

  const CheckItem = ({
    label,
    passed,
    warning = false,
  }: {
    label: string
    passed: boolean
    warning?: boolean
  }) => (
    <div className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-b-0">
      <span
        className={`text-sm ${warning ? 'text-amber-300' : passed ? 'text-green-300' : 'text-red-300'}`}
      >
        {label}
      </span>
      <div className="flex items-center space-x-1">
        {passed ? (
          <CheckCircle className="w-4 h-4 text-green-400" />
        ) : (
          <XCircle className="w-4 h-4 text-red-400" />
        )}
        <Badge
          variant="outline"
          className={`text-xs ${passed ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}`}
        >
          {passed ? 'PASS' : 'FAIL'}
        </Badge>
      </div>
    </div>
  )

  return (
    <Card
      className={`border-l-4 bg-zinc-900/50 border-zinc-800 ${
        riskLevel === 'high'
          ? 'border-l-red-500'
          : riskLevel === 'medium'
            ? 'border-l-yellow-500'
            : 'border-l-green-500'
      } ${className}`}
    >
      <CardContent className="p-4 space-y-4">
        {/* Quality Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-300">Quality Score</span>
            <Badge variant="outline" className={getRiskColor(riskLevel)}>
              {qualityScore}% - {riskLevel.toUpperCase()} RISK
            </Badge>
          </div>
          <Progress value={qualityScore} className="h-2 bg-zinc-800" />
        </div>

        {/* Validation Checks */}
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-zinc-300 mb-2">Validation Checks</h4>
          <CheckItem label="Syntax Validation" passed={checks.syntax} />
          <CheckItem label="Domain Exists" passed={checks.domain} />
          <CheckItem label="MX Records" passed={checks.mxRecords} />
          <CheckItem label="Disposable Email" passed={!checks.disposable} warning={checks.disposable} />
          <CheckItem label="Role-based Account" passed={!checks.roleBased} warning={checks.roleBased} />
          <CheckItem label="Free Provider" passed={!checks.freeProvider} warning={checks.freeProvider} />
        </div>

        {/* Suggestions */}
        {suggestions && suggestions.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-300">Suggestions</span>
            </div>
            <ul className="space-y-1">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="text-xs text-amber-300 flex items-start space-x-2">
                  <span className="mt-0.5">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}