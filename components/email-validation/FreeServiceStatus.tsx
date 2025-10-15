import { Badge } from "@/components/ui/badge";
import { CheckCircle, Shield, Network, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FreeServiceStatusProps {
  services: Array<{
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    priority: number;
    checks: string[];
  }>;
}

export function FreeServiceStatus({ services }: FreeServiceStatusProps) {
  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'dns':
        return <Network className="w-4 h-4" />;
      case 'smtp':
        return <Search className="w-4 h-4" />;
      case 'advanced':
        return <Shield className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getChecksBadges = (checks: string[]) => {
    const checkLabels: { [key: string]: string } = {
      'syntax': 'Syntax',
      'domain': 'Domain',
      'mx': 'MX Records',
      'spf': 'SPF',
      'dmarc': 'DMARC',
      'smtp': 'SMTP',
      'disposable': 'Disposable',
      'role': 'Role-based',
      'free': 'Free Provider',
      'typos': 'Typos'
    };

    return checks.map(check => (
      <Badge key={check} variant="secondary" className="text-xs">
        {checkLabels[check] || check}
      </Badge>
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-green-600" />
          <span>Free Verification Services</span>
        </CardTitle>
        <CardDescription>
          Comprehensive email validation using DNS lookups and pattern analysis - No API keys required
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-blue-50 border-green-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="p-2 bg-green-100 rounded-full mt-1">
                    {getServiceIcon(service.id)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Priority {service.priority}
                      </Badge>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        FREE
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {getChecksBadges(service.checks)}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Features Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Free Service Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>No API keys required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>DNS-based validation</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Syntax and domain checking</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>MX record verification</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Security record analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Risk assessment</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}