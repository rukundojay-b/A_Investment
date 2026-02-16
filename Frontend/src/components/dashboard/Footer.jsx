// src/components/dashboard/Footer.jsx
import React from 'react';

const Footer = () => (
  <footer className="mt-8 pt-6 border-t border-gray-700/30">
    <div className="text-center">
      <p className="text-sm opacity-75">
        Apex Invest © {new Date().getFullYear()} • All rights reserved
      </p>
      <p className="text-xs mt-2 opacity-60">
        Investment involves risk. Past performance is not indicative of future results.
      </p>
      <div className="flex justify-center space-x-4 mt-4">
        <button className="text-xs opacity-75 hover:opacity-100">Terms</button>
        <button className="text-xs opacity-75 hover:opacity-100">Privacy</button>
        <button className="text-xs opacity-75 hover:opacity-100">Support</button>
        <button className="text-xs opacity-75 hover:opacity-100">Contact</button>
      </div>
    </div>
  </footer>
);

export default Footer;