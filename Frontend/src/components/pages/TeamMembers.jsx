

// src/components/pages/TeamMembers.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaUsers, FaUserPlus, FaCopy, FaCheckCircle,
  FaShareAlt, FaEnvelope, FaWhatsapp, FaTelegram,
  FaFacebook, FaTwitter, FaSpinner,
  FaChartLine, FaCoins, FaUser
} from 'react-icons/fa';
import axios from 'axios';

const TeamMembers = ({ darkMode, formatCurrency }) => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    referralEarnings: 0,
    referralCode: ''
  });

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Get user data
      const response = await axios.get('http://localhost:5000/api/user/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        const data = response.data;
        setStats({
          totalReferrals: data.stats?.totalReferrals || 0,
          referralEarnings: data.stats?.referralEarnings || 0,
          referralCode: data.referralCode || ''
        });

        // If you have a team members endpoint, use it here
        // For now, we'll keep the array empty or use sample data
        setTeam([]);
      }
    } catch (error) {
      console.error('Error fetching team data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const link = `http://localhost:3000/signup?ref=${stats.referralCode}`;
    navigator.clipboard.writeText(link);
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 3000);
  };

  const shareVia = (platform) => {
    const text = "Join Apex Invest and start earning daily!";
    const url = `http://localhost:3000/signup?ref=${stats.referralCode}`;
    
    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      email: `mailto:?subject=${encodeURIComponent('Join Apex Invest')}&body=${encodeURIComponent(text + '\n\n' + url)}`
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank');
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl mx-auto mb-4" />
            <p>Loading your team...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 md:p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            <FaUsers className="mr-3 text-green-500" />
            Team Members
          </h1>
          <p className="opacity-75 mt-1">Manage your referrals and team performance</p>
        </div>
        <button
          onClick={fetchTeamData}
          className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          <FaUsers />
        </button>
      </div>

      {/* Referral Program Card - Keeping your design */}
      <div className={`mb-8 p-6 rounded-2xl bg-gradient-to-r ${darkMode ? 'from-purple-900/30 to-pink-900/30' : 'from-purple-50 to-pink-50'} border ${darkMode ? 'border-purple-800/30' : 'border-purple-200'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Refer & Earn 10%</h2>
            <p className="opacity-75 mb-4">Share your referral link and earn 10% commission from your referrals' daily profits</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <div className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <code className="text-sm break-all">
                    {`http://localhost:3000/signup?ref=${stats.referralCode || 'YOUR-CODE'}`}
                  </code>
                </div>
              </div>
              <button
                onClick={copyReferralLink}
                className={`px-6 py-3 rounded-lg flex items-center justify-center ${
                  darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'
                } text-white`}
              >
                {showCopySuccess ? (
                  <>
                    <FaCheckCircle className="mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <FaCopy className="mr-2" />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Share Buttons - Keeping your design */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => shareVia('whatsapp')} className="p-3 rounded-lg bg-green-600 text-white hover:bg-green-700">
            <FaWhatsapp />
          </button>
          <button onClick={() => shareVia('telegram')} className="p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
            <FaTelegram />
          </button>
          <button onClick={() => shareVia('facebook')} className="p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
            <FaFacebook />
          </button>
          <button onClick={() => shareVia('twitter')} className="p-3 rounded-lg bg-sky-500 text-white hover:bg-sky-600">
            <FaTwitter />
          </button>
          <button onClick={() => shareVia('email')} className="p-3 rounded-lg bg-gray-600 text-white hover:bg-gray-700">
            <FaEnvelope />
          </button>
        </div>
      </div>

      {/* Stats Cards - Keeping your design */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatCard
          darkMode={darkMode}
          icon={<FaUsers />}
          title="Total Referrals"
          value={stats.totalReferrals}
          color="blue"
        />
        <StatCard
          darkMode={darkMode}
          icon={<FaCoins />}
          title="Referral Earnings"
          value={formatCurrency(stats.referralEarnings) + ' FRW'}
          color="green"
        />
      </div>

      {/* Team Members List - Keeping your design */}
      <div className={`rounded-xl overflow-hidden border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="p-4 border-b dark:border-gray-700">
          <h3 className="font-bold text-lg">Your Team ({team.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-100'}>
              <tr>
                <th className="p-4 text-left">Member</th>
                <th className="p-4 text-left">Joined</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {team.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-8 text-center">
                    <FaUsers className="mx-auto text-3xl mb-3 opacity-50" />
                    <p>No team members yet</p>
                    <p className="text-sm opacity-75 mt-2">Share your referral link to start building your team</p>
                  </td>
                </tr>
              ) : (
                team.map((member, index) => (
                  <tr 
                    key={member._id || index}
                    className={`border-b ${darkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} flex items-center justify-center mr-3`}>
                          <FaUser className="text-sm" />
                        </div>
                        <div>
                          <div className="font-medium">{member.name || 'User'}</div>
                          <div className="text-xs opacity-75">{member.phone || 'No phone'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{new Date(member.joinedAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        member.active 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {member.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component - Keeping your design
const StatCard = ({ darkMode, icon, title, value, color }) => {
  const colorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    yellow: 'text-yellow-500',
    purple: 'text-purple-500',
    red: 'text-red-500'
  };

  return (
    <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} ${colorClasses[color]} mr-4`}>
          {icon}
        </div>
        <div>
          <h3 className="text-sm opacity-75">{title}</h3>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </div>
    </div>
  );
};

export default TeamMembers;