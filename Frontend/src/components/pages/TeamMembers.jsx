



// // src/components/pages/TeamMembers.jsx
// import React, { useState, useEffect } from 'react';
// import { 
//   FaUsers, FaCopy, FaCheckCircle,
//   FaShareAlt, FaEnvelope, FaWhatsapp, FaTelegram,
//   FaFacebook, FaTwitter, FaSpinner,
//   FaChartLine, FaCoins, FaUser, FaGift, FaArrowRight,
//   FaSync
// } from 'react-icons/fa';
// import { Link } from 'react-router-dom';
// import axios from 'axios';

// const TeamMembers = ({ darkMode, formatCurrency }) => {
//   const [team, setTeam] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showCopySuccess, setShowCopySuccess] = useState(false);
//   const [stats, setStats] = useState({
//     totalReferrals: 0,
//     referralEarnings: 0,
//     referralCode: ''
//   });
//   const [refreshing, setRefreshing] = useState(false);

//   const API_URL = 'http://localhost:5000/api';
//   const FRONTEND_URL = window.location.origin;

//   useEffect(() => {
//     fetchTeamData();
//   }, []);

//   const fetchTeamData = async () => {
//     try {
//       setLoading(true);
//       const token = sessionStorage.getItem('token');
      
//       if (!token) {
//         console.error('No token found');
//         return;
//       }

//       // Fetch team members from the new referral endpoint
//       const response = await axios.get(`${API_URL}/referrals/team`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         setTeam(response.data.team || []);
//         setStats(response.data.stats || {
//           totalReferrals: 0,
//           referralEarnings: 0,
//           referralCode: ''
//         });
//       }

//     } catch (error) {
//       console.error('Error fetching team data:', error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchTeamData();
//   };

//   const copyReferralLink = () => {
//     const link = `${FRONTEND_URL}/signup?ref=${stats.referralCode}`;
//     navigator.clipboard.writeText(link);
//     setShowCopySuccess(true);
//     setTimeout(() => setShowCopySuccess(false), 3000);
//   };

//   const shareVia = (platform) => {
//     const text = "Join Apex Invest and start earning daily! Get 400 FRW bonus on signup!";
//     const url = `${FRONTEND_URL}/signup?ref=${stats.referralCode}`;
    
//     const shareUrls = {
//       whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
//       telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
//       facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
//       twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
//       email: `mailto:?subject=${encodeURIComponent('Join Apex Invest')}&body=${encodeURIComponent(text + '\n\n' + url)}`
//     };

//     if (shareUrls[platform]) {
//       window.open(shareUrls[platform], '_blank');
//     }
//   };

//   // Calculate total potential commission
//   const totalPotentialCommission = team.reduce((sum, member) => {
//     return sum + (member.potentialCommission || 0);
//   }, 0);

//   if (loading) {
//     return (
//       <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
//         <div className="flex items-center justify-center h-64">
//           <div className="text-center">
//             <FaSpinner className="animate-spin text-4xl mx-auto mb-4" />
//             <p>Loading your team...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`min-h-screen p-4 md:p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold flex items-center">
//             <FaUsers className="mr-3 text-green-500" />
//             Team Members
//           </h1>
//           <p className="opacity-75 mt-1">Manage your referrals and earn 10% commission</p>
//         </div>
//         <button
//           onClick={handleRefresh}
//           disabled={refreshing}
//           className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
//           title="Refresh"
//         >
//           <FaSync className={refreshing ? 'animate-spin' : ''} />
//         </button>
//       </div>

//       {/* How it works banner */}
//       <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
//         <div className="flex items-start">
//           <FaGift className="text-blue-500 text-xl mr-3 mt-1" />
//           <div>
//             <h3 className="font-bold mb-1">How Referral Commission Works</h3>
//             <p className="text-sm opacity-75">
//               You earn <span className="font-bold text-green-500">10% commission</span> on your referrals' FIRST investment only. 
//               For example, if they invest 100,000 FRW, you get 10,000 FRW instantly added to your earnings wallet!
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Referral Program Card */}
//       <div className={`mb-8 p-6 rounded-2xl bg-gradient-to-r ${darkMode ? 'from-purple-900/30 to-pink-900/30' : 'from-purple-50 to-pink-50'} border ${darkMode ? 'border-purple-800/30' : 'border-purple-200'}`}>
//         <div className="flex flex-col md:flex-row md:items-center justify-between">
//           <div className="flex-1">
//             <h2 className="text-2xl font-bold mb-2">Refer & Earn 10%</h2>
//             <p className="opacity-75 mb-4">Share your referral link and earn 10% commission from your referrals' first investment</p>
            
//             {/* Referral Link */}
//             <div className="flex flex-col sm:flex-row gap-3 mb-4">
//               <div className="flex-1">
//                 <div className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
//                   <code className="text-sm break-all">
//                     {`${FRONTEND_URL}/signup?ref=${stats.referralCode || 'YOUR-CODE'}`}
//                   </code>
//                 </div>
//               </div>
//               <button
//                 onClick={copyReferralLink}
//                 className={`px-6 py-3 rounded-lg flex items-center justify-center ${
//                   darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'
//                 } text-white`}
//               >
//                 {showCopySuccess ? (
//                   <>
//                     <FaCheckCircle className="mr-2" />
//                     Copied!
//                   </>
//                 ) : (
//                   <>
//                     <FaCopy className="mr-2" />
//                     Copy Link
//                   </>
//                 )}
//               </button>
//             </div>

//             {/* Share Buttons */}
//             <div className="flex flex-wrap gap-2">
//               <button onClick={() => shareVia('whatsapp')} className="p-3 rounded-lg bg-green-600 text-white hover:bg-green-700">
//                 <FaWhatsapp />
//               </button>
//               <button onClick={() => shareVia('telegram')} className="p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
//                 <FaTelegram />
//               </button>
//               <button onClick={() => shareVia('facebook')} className="p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
//                 <FaFacebook />
//               </button>
//               <button onClick={() => shareVia('twitter')} className="p-3 rounded-lg bg-sky-500 text-white hover:bg-sky-600">
//                 <FaTwitter />
//               </button>
//               <button onClick={() => shareVia('email')} className="p-3 rounded-lg bg-gray-600 text-white hover:bg-gray-700">
//                 <FaEnvelope />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <StatCard
//           darkMode={darkMode}
//           icon={<FaUsers />}
//           title="Total Referrals"
//           value={stats.totalReferrals}
//           color="blue"
//         />
//         <StatCard
//           darkMode={darkMode}
//           icon={<FaCoins />}
//           title="Commission Earned"
//           value={formatCurrency(stats.referralEarnings) + ' FRW'}
//           color="green"
//         />
//         <StatCard
//           darkMode={darkMode}
//           icon={<FaChartLine />}
//           title="Potential Earnings"
//           value={formatCurrency(totalPotentialCommission) + ' FRW'}
//           color="purple"
//           subtitle="From active referrals"
//         />
//       </div>

//       {/* Team Members List */}
//       <div className={`rounded-xl overflow-hidden border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
//         <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
//           <h3 className="font-bold text-lg">Your Team ({team.length})</h3>
//           {team.length > 0 && (
//             <span className="text-sm opacity-75">
//               Total invested: {formatCurrency(team.reduce((sum, m) => sum + m.investment, 0))} FRW
//             </span>
//           )}
//         </div>
        
//         {team.length === 0 ? (
//           <div className="p-12 text-center">
//             <FaUsers className="mx-auto text-5xl mb-4 opacity-30" />
//             <h3 className="text-xl font-bold mb-2">No team members yet</h3>
//             <p className="opacity-75 mb-6">Share your referral link to start building your team and earn commissions!</p>
//             <button
//               onClick={copyReferralLink}
//               className={`px-6 py-3 rounded-lg font-bold ${
//                 darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'
//               } text-white inline-flex items-center`}
//             >
//               <FaCopy className="mr-2" />
//               Copy Referral Link
//             </button>
//           </div>
//         ) : (
//           <div className="divide-y dark:divide-gray-700">
//             {team.map((member) => (
//               <div key={member._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
//                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                   {/* Member Info */}
//                   <div className="flex items-center">
//                     <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center mr-3`}>
//                       <FaUser className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
//                     </div>
//                     <div>
//                       <div className="font-medium">{member.name}</div>
//                       <div className="text-xs opacity-75">{member.phone}</div>
//                       <div className="text-xs mt-1">
//                         Joined: {new Date(member.joinedAt).toLocaleDateString()}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Investment Info */}
//                   <div className="grid grid-cols-3 gap-4 flex-1">
//                     <div className="text-center">
//                       <div className="text-xs opacity-75">Invested</div>
//                       <div className="font-bold text-blue-500">
//                         {formatCurrency(member.investment)} FRW
//                       </div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-xs opacity-75">Your Commission</div>
//                       <div className="font-bold text-green-500">
//                         {formatCurrency(member.potentialCommission)} FRW
//                       </div>
//                       <div className="text-[10px] opacity-50">10% of first investment</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-xs opacity-75">Status</div>
//                       <span className={`px-2 py-1 rounded-full text-xs ${
//                         member.active 
//                           ? 'bg-green-500/20 text-green-400' 
//                           : 'bg-gray-500/20 text-gray-400'
//                       }`}>
//                         {member.active ? 'Active' : 'Inactive'}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Progress Bar (shows if they've invested) */}
//                 {member.investment > 0 && (
//                   <div className="mt-3">
//                     <div className="flex justify-between text-xs mb-1">
//                       <span>Commission paid when they invest</span>
//                       <span className="text-green-500">10%</span>
//                     </div>
//                     <div className="w-full h-1.5 bg-gray-600 rounded-full overflow-hidden">
//                       <div 
//                         className="h-full bg-green-500 rounded-full"
//                         style={{ width: '100%' }}
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Commission Summary */}
//       {team.length > 0 && (
//         <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
//           <div className="flex items-center justify-between text-sm">
//             <span className="opacity-75">Total potential commission from team:</span>
//             <span className="font-bold text-green-500">{formatCurrency(totalPotentialCommission)} FRW</span>
//           </div>
//           <p className="text-xs opacity-50 mt-2">
//             * Commission is paid when your referrals make their first investment. Already earned: {formatCurrency(stats.referralEarnings)} FRW
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// // Stat Card Component
// const StatCard = ({ darkMode, icon, title, value, color, subtitle }) => {
//   const colorClasses = {
//     blue: 'text-blue-500',
//     green: 'text-green-500',
//     yellow: 'text-yellow-500',
//     purple: 'text-purple-500',
//     red: 'text-red-500'
//   };

//   return (
//     <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
//       <div className="flex items-center mb-4">
//         <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} ${colorClasses[color]} mr-4`}>
//           {icon}
//         </div>
//         <div>
//           <h3 className="text-sm opacity-75">{title}</h3>
//           <div className="text-2xl font-bold">{value}</div>
//           {subtitle && <p className="text-xs opacity-50 mt-1">{subtitle}</p>}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TeamMembers;




















// src/components/pages/TeamMembers.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaUsers, FaCopy, FaCheckCircle,
  FaShareAlt, FaEnvelope, FaWhatsapp, FaTelegram,
  FaFacebook, FaTwitter, FaSpinner,
  FaChartLine, FaCoins, FaUser, FaGift, FaArrowRight,
  FaSync, FaArrowLeft  // Added FaArrowLeft
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import axios from 'axios';

const TeamMembers = ({ darkMode, formatCurrency }) => {
  const navigate = useNavigate(); // Added navigate
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    referralEarnings: 0,
    referralCode: ''
  });
  const [refreshing, setRefreshing] = useState(false);

  const API_URL = 'http://localhost:5000/api';
  const FRONTEND_URL = window.location.origin;

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      
      if (!token) {
        console.error('No token found');
        return;
      }

      // Fetch team members from the new referral endpoint
      const response = await axios.get(`${API_URL}/referrals/team`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setTeam(response.data.team || []);
        setStats(response.data.stats || {
          totalReferrals: 0,
          referralEarnings: 0,
          referralCode: ''
        });
      }

    } catch (error) {
      console.error('Error fetching team data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTeamData();
  };

  const copyReferralLink = () => {
    const link = `${FRONTEND_URL}/signup?ref=${stats.referralCode}`;
    navigator.clipboard.writeText(link);
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 3000);
  };

  const shareVia = (platform) => {
    const text = "Join Apex Invest and start earning daily! Get 400 FRW bonus on signup!";
    const url = `${FRONTEND_URL}/signup?ref=${stats.referralCode}`;
    
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

  // Calculate total potential commission
  const totalPotentialCommission = team.reduce((sum, member) => {
    return sum + (member.potentialCommission || 0);
  }, 0);

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
      {/* Header with Back Button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className={`p-2 rounded-lg mr-4 ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
          title="Back to Dashboard"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            <FaUsers className="mr-3 text-green-500" />
            Team Members
          </h1>
          <p className="opacity-75 mt-1">Manage your referrals and earn 10% commission</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="Refresh"
        >
          <FaSync className={refreshing ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* How it works banner */}
      <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
        <div className="flex items-start">
          <FaGift className="text-blue-500 text-xl mr-3 mt-1" />
          <div>
            <h3 className="font-bold mb-1">How Referral Commission Works</h3>
            <p className="text-sm opacity-75">
              You earn <span className="font-bold text-green-500">10% commission</span> on your referrals' FIRST investment only. 
              For example, if they invest 100,000 FRW, you get 10,000 FRW instantly added to your earnings wallet!
            </p>
          </div>
        </div>
      </div>

      {/* Referral Program Card */}
      <div className={`mb-8 p-6 rounded-2xl bg-gradient-to-r ${darkMode ? 'from-purple-900/30 to-pink-900/30' : 'from-purple-50 to-pink-50'} border ${darkMode ? 'border-purple-800/30' : 'border-purple-200'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Refer & Earn 10%</h2>
            <p className="opacity-75 mb-4">Share your referral link and earn 10% commission from your referrals' first investment</p>
            
            {/* Referral Link */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1">
                <div className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <code className="text-sm break-all">
                    {`${FRONTEND_URL}/signup?ref=${stats.referralCode || 'YOUR-CODE'}`}
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

            {/* Share Buttons */}
            <div className="flex flex-wrap gap-2">
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
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
          title="Commission Earned"
          value={formatCurrency(stats.referralEarnings) + ' FRW'}
          color="green"
        />
        <StatCard
          darkMode={darkMode}
          icon={<FaChartLine />}
          title="Potential Earnings"
          value={formatCurrency(totalPotentialCommission) + ' FRW'}
          color="purple"
          subtitle="From active referrals"
        />
      </div>

      {/* Team Members List */}
      <div className={`rounded-xl overflow-hidden border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h3 className="font-bold text-lg">Your Team ({team.length})</h3>
          {team.length > 0 && (
            <span className="text-sm opacity-75">
              Total invested: {formatCurrency(team.reduce((sum, m) => sum + m.investment, 0))} FRW
            </span>
          )}
        </div>
        
        {team.length === 0 ? (
          <div className="p-12 text-center">
            <FaUsers className="mx-auto text-5xl mb-4 opacity-30" />
            <h3 className="text-xl font-bold mb-2">No team members yet</h3>
            <p className="opacity-75 mb-6">Share your referral link to start building your team and earn commissions!</p>
            <button
              onClick={copyReferralLink}
              className={`px-6 py-3 rounded-lg font-bold ${
                darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'
              } text-white inline-flex items-center`}
            >
              <FaCopy className="mr-2" />
              Copy Referral Link
            </button>
          </div>
        ) : (
          <div className="divide-y dark:divide-gray-700">
            {team.map((member) => (
              <div key={member._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Member Info */}
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center mr-3`}>
                      <FaUser className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                    </div>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-xs opacity-75">{member.phone}</div>
                      <div className="text-xs mt-1">
                        Joined: {new Date(member.joinedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Investment Info */}
                  <div className="grid grid-cols-3 gap-4 flex-1">
                    <div className="text-center">
                      <div className="text-xs opacity-75">Invested</div>
                      <div className="font-bold text-blue-500">
                        {formatCurrency(member.investment)} FRW
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs opacity-75">Your Commission</div>
                      <div className="font-bold text-green-500">
                        {formatCurrency(member.potentialCommission)} FRW
                      </div>
                      <div className="text-[10px] opacity-50">10% of first investment</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs opacity-75">Status</div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        member.active 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {member.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar (shows if they've invested) */}
                {member.investment > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Commission paid when they invest</span>
                      <span className="text-green-500">10%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-600 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Commission Summary */}
      {team.length > 0 && (
        <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
          <div className="flex items-center justify-between text-sm">
            <span className="opacity-75">Total potential commission from team:</span>
            <span className="font-bold text-green-500">{formatCurrency(totalPotentialCommission)} FRW</span>
          </div>
          <p className="text-xs opacity-50 mt-2">
            * Commission is paid when your referrals make their first investment. Already earned: {formatCurrency(stats.referralEarnings)} FRW
          </p>
        </div>
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ darkMode, icon, title, value, color, subtitle }) => {
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
          {subtitle && <p className="text-xs opacity-50 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

export default TeamMembers;