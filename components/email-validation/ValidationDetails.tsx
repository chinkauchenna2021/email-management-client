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
  const { checks, qualityScore, riskLevel, suggestions } = result;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const CheckItem = ({ label, passed, warning = false }: { label: string; passed: boolean; warning?: boolean }) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
      <span className={`text-sm ${warning ? 'text-amber-600' : passed ? 'text-green-600' : 'text-red-600'}`}>
        {label}
      </span>
      <div className="flex items-center space-x-1">
        {passed ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : (
          <XCircle className="w-4 h-4 text-red-500" />
        )}
        <Badge 
          variant="outline" 
          className={`text-xs ${passed ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}
        >
          {passed ? 'PASS' : 'FAIL'}
        </Badge>
      </div>
    </div>
  );

  return (
    <Card className={`border-l-4 ${
      riskLevel === 'high' ? 'border-l-red-500' : 
      riskLevel === 'medium' ? 'border-l-yellow-500' : 
      'border-l-green-500'
    } ${className}`}>
      <CardContent className="p-4 space-y-4">
        {/* Quality Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Quality Score</span>
            <Badge variant="outline" className={getRiskColor(riskLevel)}>
              {qualityScore}% - {riskLevel.toUpperCase()} RISK
            </Badge>
          </div>
          <Progress 
            value={qualityScore} 
            className={`h-2 ${
              riskLevel === 'high' ? 'bg-red-200' : 
              riskLevel === 'medium' ? 'bg-yellow-200' : 
              'bg-green-200'
            }`}
          />
        </div>

        {/* Validation Checks */}
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Validation Checks</h4>
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
              <Info className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-700">Suggestions</span>
            </div>
            <ul className="space-y-1">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="text-xs text-amber-600 flex items-start space-x-2">
                  <span className="mt-0.5">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}