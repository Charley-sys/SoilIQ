import React from 'react';
import { useAuth } from '../context/AuthContext';

const FarmManagement = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="h1">My Farms</h1>
        <p className="text-body">Manage your farms and their locations</p>
      </div>

      {!user?.farms || user.farms.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-4xl mb-4">🏠</div>
          <h3 className="h3 mb-2">No Farms Added</h3>
          <p className="text-body text-gray-600 mb-6">
            Get started by adding your first farm to monitor soil health
          </p>
          <button className="btn btn-primary">
            Add Your First Farm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.farms.map((farm) => (
            <div key={farm._id} className="card">
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="h3">{farm.name}</h3>
                  <span className={`health-indicator ${farm.isActive ? 'health-good' : 'health-poor'}`}>
                    {farm.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-gray-500">Crop Type</div>
                    <div className="font-medium">{farm.cropType}</div>
                  </div>
                  
                  <div>
                    <div className="text-gray-500">Location</div>
                    <div className="font-medium">{farm.location?.address}</div>
                  </div>
                  
                  <div>
                    <div className="text-gray-500">Farm Size</div>
                    <div className="font-medium">
                      {farm.farmSize?.value} {farm.farmSize?.unit}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-gray-500">Soil Type</div>
                    <div className="font-medium capitalize">
                      {farm.soilType || 'Not specified'}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-6">
                  <button className="btn btn-outline btn-sm flex-1">
                    View Details
                  </button>
                  <button className="btn btn-outline btn-sm">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmManagement;