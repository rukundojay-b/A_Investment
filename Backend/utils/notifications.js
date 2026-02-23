// backend/utils/notifications.js
const Notification = require('../models/Notification');

const notifyUser = {
  // Generic notification creator
  async create(userId, type, title, message, action = 'other', actionId = null, data = {}) {
    try {
      const notification = new Notification({
        user: userId,
        type,
        title,
        message,
        action,
        actionId,
        data
      });
      await notification.save();
      console.log(`✅ Notification created for user ${userId}: ${title}`);
      return notification;
    } catch (error) {
      console.error('❌ Error creating notification:', error);
      return null;
    }
  },

  // Deposit notifications
  async depositRequest(userId, amount, transactionId) {
    return this.create(
      userId,
      'info',
      'Deposit Request Submitted',
      `Your deposit request of ${amount.toLocaleString()} FRW has been submitted for approval.`,
      'deposit',
      transactionId,
      { amount }
    );
  },

  async depositApproved(userId, amount, transactionId) {
    return this.create(
      userId,
      'success',
      'Deposit Approved',
      `Your deposit of ${amount.toLocaleString()} FRW has been approved and added to your account.`,
      'deposit',
      transactionId,
      { amount }
    );
  },

  async depositRejected(userId, amount, reason, transactionId) {
    return this.create(
      userId,
      'error',
      'Deposit Rejected',
      `Your deposit of ${amount.toLocaleString()} FRW was rejected. Reason: ${reason}`,
      'deposit',
      transactionId,
      { amount, reason }
    );
  },

  // Withdrawal notifications
  async withdrawRequest(userId, amount, transactionId) {
    return this.create(
      userId,
      'info',
      'Withdrawal Request Submitted',
      `Your withdrawal request of ${amount.toLocaleString()} FRW has been submitted for approval.`,
      'withdraw',
      transactionId,
      { amount }
    );
  },

  async withdrawApproved(userId, amount, phoneNumber, paymentMethod, transactionId) {
    return this.create(
      userId,
      'success',
      'Withdrawal Approved',
      `Your withdrawal of ${amount.toLocaleString()} FRW has been approved. Funds will be sent to ${phoneNumber} via ${paymentMethod}.`,
      'withdraw',
      transactionId,
      { amount, phoneNumber, paymentMethod }
    );
  },

  async withdrawRejected(userId, amount, reason, transactionId) {
    return this.create(
      userId,
      'error',
      'Withdrawal Rejected',
      `Your withdrawal of ${amount.toLocaleString()} FRW was rejected. Reason: ${reason}`,
      'withdraw',
      transactionId,
      { amount, reason }
    );
  },

  // Investment notifications
  async investmentSuccess(userId, productName, amount, investmentId) {
    return this.create(
      userId,
      'success',
      'Investment Successful',
      `You have successfully invested ${amount.toLocaleString()} FRW in ${productName}.`,
      'investment',
      investmentId,
      { productName, amount }
    );
  },

  // Referral notifications
  async referralBonus(userId, amount, referrerName) {
    return this.create(
      userId,
      'success',
      'Referral Bonus Earned',
      `You earned ${amount.toLocaleString()} FRW from ${referrerName}'s investment!`,
      'referral',
      null,
      { amount, referrerName }
    );
  },

  async newReferral(userId, newUserName) {
    return this.create(
      userId,
      'info',
      'New Referral',
      `${newUserName} joined using your referral link!`,
      'referral',
      null,
      { newUserName }
    );
  },

  // Transfer notifications
  async transferSuccess(userId, amount, transactionId) {
    return this.create(
      userId,
      'success',
      'Transfer Successful',
      `${amount.toLocaleString()} FRW transferred from earnings to main wallet.`,
      'transfer',
      transactionId,
      { amount }
    );
  },

  // Welcome notification
  async welcome(userId, username) {
    return this.create(
      userId,
      'success',
      'Welcome to Apex Invest!',
      `Thank you for joining, ${username}! Start your investment journey today.`,
      'system'
    );
  },

  // Daily earnings notification
  async dailyEarnings(userId, amount) {
    return this.create(
      userId,
      'success',
      'Daily Earnings Added',
      `You earned ${amount.toLocaleString()} FRW from your investments today!`,
      'earning',
      null,
      { amount }
    );
  },

  // Status change notification
  async statusChanged(userId, newStatus) {
    const messages = {
      active: 'Your account has been activated.',
      suspended: 'Your account has been suspended. Please contact support.',
      inactive: 'Your account has been deactivated.'
    };
    
    const types = {
      active: 'success',
      suspended: 'error',
      inactive: 'warning'
    };

    return this.create(
      userId,
      types[newStatus] || 'info',
      `Account ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
      messages[newStatus] || `Your account status has been changed to ${newStatus}.`,
      'system'
    );
  }
};

module.exports = notifyUser;