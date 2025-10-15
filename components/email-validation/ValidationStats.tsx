import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, Mail } from "lucide-react";

interface ValidationStatsProps {
  total: number;
  valid: number;
  invalid: number;
  pending: number;
}

export function ValidationStats({ total, valid, invalid, pending }: ValidationStatsProps) {
  const stats = [
    {
      label: "Total",
      value: total,
      icon: Mail,
      color: "text-gray-600 bg-gray-50 border-gray-200"
    },
    {
      label: "Valid",
      value: valid,
      icon: CheckCircle,
      color: "text-green-600 bg-green-50 border-green-200"
    },
    {
      label: "Invalid",
      value: invalid,
      icon: XCircle,
      color: "text-red-600 bg-red-50 border-red-200"
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock,
      color: "text-blue-600 bg-blue-50 border-blue-200"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}