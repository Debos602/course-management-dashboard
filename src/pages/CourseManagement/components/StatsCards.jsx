import React from 'react';
import { Hash, Globe, Eye, Users, DollarSign } from 'lucide-react';

const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {Object.entries(stats).map(([key, value]) => (
        <div key={key} className="stat-card bg-white rounded-xl shadow-sm p-4 border border-gray-200 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
              <p className="text-2xl font-bold text-gray-900">{key === 'totalRevenue' ? `$${value.toLocaleString()}` : value.toLocaleString()}</p>
            </div>
            <div className={`p-2 ${key === 'total' ? 'bg-blue-100' : key === 'published' ? 'bg-green-100' : key === 'draft' ? 'bg-yellow-100' : key === 'totalEnrollment' ? 'bg-purple-100' : 'bg-yellow-100'} rounded-lg`}>
              {key === 'total' ? <Hash className="w-5 h-5 text-blue-600" /> : key === 'published' ? <Globe className="w-5 h-5 text-green-600" /> : key === 'draft' ? <Eye className="w-5 h-5 text-yellow-600" /> : key === 'totalEnrollment' ? <Users className="w-5 h-5 text-purple-600" /> : <DollarSign className="w-5 h-5 text-yellow-600" />}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
