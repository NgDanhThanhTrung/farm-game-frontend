import React, { useState, useEffect } from 'react';
import { useAdsgram } from '../hooks/useAdsgram';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const GameHome = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Lấy dữ liệu người dùng từ Telegram WebApp SDK
  const tg = window.Telegram?.WebApp;
  const initData = tg?.initData || '';

  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand(); // Mở rộng màn hình Webview tối đa
    }
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Để lấy dữ liệu profile hiện tại, ta gọi chính API này với initData
      // Backend auth middleware sẽ tự động tạo/lấy User tương ứng từ DB
      const response = await fetch(`${API_BASE_URL}/api/claim-ads-reward`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${initData}`
        },
        body: JSON.stringify({ isDryRun: true }) // Sử dụng logic bypass nhận thưởng nếu chỉ load thông tin
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data);
      }
    } catch (error) {
      console.error('Lỗi khi nạp dữ liệu user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Callback nhận thưởng khi xem Adsgram thành công
  const handleAdsReward = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/claim-ads-reward`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${initData}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setUser(prev => ({
          ...prev,
          diamonds: data.currentDiamonds,
          gold: data.currentGold,
          isReferralActive: data.isReferralActive
        }));
        if (tg) {
          tg.showAlert(`🎉 Bạn đã nhận được ${data.rewardDiamonds} Kim Cương từ Adsgram!`);
        }
      } else {
        setErrorMsg(data.error || 'Có lỗi xảy ra khi cộng thưởng.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Lỗi kết nối mạng.');
    }
  };

  // Khởi chạy Hook Adsgram với Block ID thật của bạn
  const { showAd } = useAdsgram({
    blockId: '4277', // Thay đổi bằng Block ID thực tế từ trang Adsgram Dashboard của bạn
    onReward: handleAdsReward,
    onError: (err) => {
      console.error('Lỗi Adsgram:', err);
      if (tg) tg.showAlert('Rất tiếc! Quảng cáo không thể hoàn thành hoặc bị lỗi tải.');
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-dark">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-cyber-neonBlue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-dark p-4 flex flex-col items-center justify-between">
      {/* Header Dashboard Game */}
      <div className="w-full glass-panel rounded-2xl p-4 flex justify-between items-center neon-glow-blue">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest">Nông Dân</p>
          <p className="text-md font-bold text-cyber-neonBlue">@{tg?.initDataUnsafe?.user?.username || 'Guest'}</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-1 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
            <span className="text-yellow-400">💰</span>
            <span className="font-bold text-sm text-yellow-300">{user?.currentGold || 0}</span>
          </div>
          <div className="flex items-center gap-1 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            <span className="text-cyan-400">💎</span>
            <span className="font-bold text-sm text-cyan-300">{user?.currentDiamonds || 0}</span>
          </div>
        </div>
      </div>

      {/* Body Area - Game Action Area */}
      <div className="my-auto text-center flex flex-col items-center">
        <div className="w-40 h-40 bg-gradient-to-tr from-cyber-neonBlue to-cyber-neonPink rounded-full flex items-center justify-center p-1 mb-6 animate-pulse">
          <div className="w-full h-full bg-[#0d0d1b] rounded-full flex items-center justify-center">
            <span className="text-6xl">🌾</span>
          </div>
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">Hệ Sinh Thái Nông Trại</h2>
        <p className="text-xs text-gray-400 max-w-xs mb-4">
          Tích luỹ Vàng để nâng cấp và xem quảng cáo Adsgram để nhận ngay Kim Cương miễn phí.
        </p>

        {user?.isReferralActive ? (
          <span className="text-xs text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
            ✓ Trạng thái Tài khoản: Hoạt Động (Đã xem Ads)
          </span>
        ) : (
          <span className="text-xs text-yellow-400 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
            ⚠ Chưa kích hoạt Tài khoản (Hãy xem Ads đầu tiên)
          </span>
        )}
      </div>

      {/* Action Button - Xem quảng cáo Adsgram */}
      <div className="w-full space-y-3">
        {errorMsg && <p className="text-xs text-red-500 text-center font-semibold">{errorMsg}</p>}
        <button
          onClick={showAd}
          className="w-full py-4 bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-[#0a0a12] font-black uppercase rounded-2xl text-center shadow-lg hover:opacity-90 active:scale-[0.98] transition-transform duration-100 neon-glow-blue"
        >
          🎬 Xem Quảng Cáo (Nhận 💎)
        </button>
      </div>
    </div>
  );
};

export default GameHome;
