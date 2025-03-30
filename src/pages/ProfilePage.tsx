
// Update this file to make sure it correctly renders the Outlet component for nested routes
import React from 'react';
import { Outlet } from 'react-router';

const ProfilePage = () => {
  return (
    <div className="container mx-auto py-8">
      <Outlet />
    </div>
  );
};

export default ProfilePage;
