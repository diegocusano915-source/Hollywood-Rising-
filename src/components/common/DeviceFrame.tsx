/**
 * HOLLYWOOD RISING - Mobile Device Frame Container
 * Clean, native-fit viewport designed specifically for Android mobile devices.
 */

import React from 'react';

export const DeviceFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="w-full min-h-screen bg-[#050510] text-[#F0F0F0] flex flex-col font-sans select-none overflow-x-hidden">
      {children}
    </div>
  );
};
