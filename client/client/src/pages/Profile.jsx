import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="h1">Profile</h1>
        <p className="text-body">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="card-header">
              <h2 className="h2">Personal Information</h2>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">First Name</label>
                  <div className="form-input bg-gray-50">{user.firstName}</div>
                </div>
                <div>
                  <label className="form-label">Last Name</label>
                  <div className="form-input bg-gray-50">{user.lastName}</div>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="form-label">Email</label>
                <div className="form-input bg-gray-50">{user.email}</div>
              </div>
              
              <div className="mt-4">
                <label className="form-label">Role</label>
                <div className="form-input bg-gray-50 capitalize">{user.role}</div>
              </div>
            </div>
          </div>

          {/* Farm Summary */}
          <div className="card">
            <div className="card-header">
              <h2 className="h2">Farm Summary</h2>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {user.farms?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Farms</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {user.farms?.filter(farm => farm.isActive).length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Active Farms</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </div>
                  <div className="text-sm text-gray-600">Last Login</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="h3">Quick Actions</h3>
            </div>
            <div className="card-body space-y-3">
              <button className="btn btn-outline w-full">
                Edit Profile
              </button>
              <button className="btn btn-outline w-full">
                Change Password
              </button>
              <button className="btn btn-outline w-full">
                Notification Settings
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="h3">Account Status</h3>
            </div>
            <div className="card-body">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Email Verification</span>
                <span className={`health-indicator ${user.isVerified ? 'health-good' : 'health-poor'}`}>
                  {user.isVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Account Status</span>
                <span className={`health-indicator ${user.isActive ? 'health-good' : 'health-poor'}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;