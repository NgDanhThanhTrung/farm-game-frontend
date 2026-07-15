import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const AdminDashboard = () => {
  const tg = window.Telegram?.WebApp;
  const initData = tg?.initData || '';

  // State Config
  const [config, setConfig] = useState({
    ecpmRate: 2.0,
    userSharePercentage: 50,
    usdToDiamondRate: 1000
  });
  
  // State Broadcast & Users
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [usersList, setUsersList] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    fetchConfig();
    fetchUsers();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/config`, {
        headers: { 'Authorization': `Bearer ${initData}` }
      });
      const resData = await response.json();
      if (response.ok && resData.data) setConfig(resData.data);
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${initData}` }
      });
      const resData = await response.json();
      if (response.ok && resData.data) setUsersList(resData.data);
    } catch (err) { console.error(err); }
  };

  const handleUpdateConfig = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${initData}`
        },
        body: JSON.stringify(config)
      });
      if (response.ok) {
        setStatusMessage('✓ Cập nhật cấu hình kinh tế thành công!');
        setTimeout(() => setStatusMessage(''), 3000);
      }
    } catch (err) { console.error(err); }
  };

  const handleSendBroadcast = async () => {
    if (!broadcastMessage.trim()) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/broadcast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${initData}`
        },
        body: JSON.stringify({ message: broadcastMessage })
      });
      const data = await response.json();
      if (response.ok) {
        setStatusMessage(`✓ Đã phát sóng tin nhắn thành công tới mọi User!`);
        setBroadcastMessage('');
        setTimeout(() => setStatusMessage(''), 4000);
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-white p-6 space-y-6">
      <div className="border-b border-cyber-border pb-4">
        <h1 className="text-3xl font-black uppercase tracking-widest text-cyber-neonBlue">Admin Control</h1>
        <p className="text-xs text-gray-400">Trung tâm điều khiển tài chính & dữ liệu người dùng</p>
      </div>

      {statusMessage && (
        <div className="bg-cyber-neonBlue/10 border border-cyber-neonBlue/30 text-cyber-neonBlue p-3 rounded-xl text-xs font-semibold">
          {statusMessage}
        </div>
      )}

      {/* Khu vực 1: Điều chỉnh thông số SystemConfig */}
      <section className="glass-panel p-5 rounded-2xl">
        <h2 className="text-lg font-extrabold text-cyber-neonPink mb-4 uppercase tracking-wider">🛠 Cấu Hình Kinh Tế Adsgram</h2>
        <form onSubmit={handleUpdateConfig} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">eCPM Rate ($)</label>
              <input 
                type="number" step="0.1"
                value={config.ecpmRate} 
                onChange={e => setConfig({...config, ecpmRate: parseFloat(e.target.value)})}
                className="w-full bg-[#0d0d1b] border border-cyber-border rounded-xl p-2.5 text-sm text-cyber-neonBlue outline-none focus:border-cyber-neonBlue"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">User Share (%)</label>
              <input 
                type="number"
                value={config.userSharePercentage} 
                onChange={e => setConfig({...config, userSharePercentage: parseInt(e.target.value)})}
                className="w-full bg-[#0d0d1b] border border-cyber-border rounded-xl p-2.5 text-sm text-cyber-neonBlue outline-none focus:border-cyber-neonBlue"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Tỷ giá USD sang Kim Cương ($1 = ? 💎)</label>
            <input 
              type="number"
              value={config.usdToDiamondRate} 
              onChange={e => setConfig({...config, usdToDiamondRate: parseInt(e.target.value)})}
              className="w-full bg-[#0d0d1b] border border-cyber-border rounded-xl p-2.5 text-sm text-cyber-neonBlue outline-none focus:border-cyber-neonBlue"
            />
          </div>
          <button type="submit" className="w-full py-3 bg-cyber-neonBlue text-[#0a0a12] font-black rounded-xl text-sm uppercase hover:opacity-90 active:scale-[0.98]">
            Lưu Cấu Hình Mới
          </button>
        </form>
      </section>

      {/* Khu vực 2: Soạn thảo tin nhắn Broadcast */}
      <section className="glass-panel p-5 rounded-2xl">
        <h2 className="text-lg font-extrabold text-cyber-neonPink mb-4 uppercase tracking-wider">📢 Phát sóng Tin Nhắn (Broadcast)</h2>
        <div className="space-y-3">
          <textarea
            placeholder="Nhập nội dung thông báo khẩn gửi qua Telegram Bot..."
            rows="3"
            value={broadcastMessage}
            onChange={e => setBroadcastMessage(e.target.value)}
            className="w-full bg-[#0d0d1b] border border-cyber-border rounded-xl p-3 text-sm text-white outline-none focus:border-cyber-neonPink resize-none"
          />
          <button 
            onClick={handleSendBroadcast}
            className="w-full py-3 bg-cyber-neonPink text-[#0a0a12] font-black rounded-xl text-sm uppercase hover:opacity-90 active:scale-[0.98]"
          >
            Phát Sóng Ngay
          </button>
        </div>
      </section>

      {/* Khu vực 3: Danh sách hiển thị người dùng */}
      <section className="glass-panel p-5 rounded-2xl overflow-hidden">
        <h2 className="text-lg font-extrabold text-cyber-neonPink mb-4 uppercase tracking-wider">👥 Danh sách Nông Dân ({usersList.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-cyber-border text-xs text-gray-400">
                <th className="py-2">User / ID</th>
                <th className="py-2 text-right">Vàng (💰)</th>
                <th className="py-2 text-right">Kim Cương (💎)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border/40 text-sm">
              {usersList.map((user) => (
                <tr key={user._id}>
                  <td className="py-3">
                    <p className="font-bold text-cyber-neonBlue">@{user.username || 'ẩn danh'}</p>
                    <p className="text-[10px] text-gray-400">{user.telegramId}</p>
                  </td>
                  <td className="py-3 text-right text-yellow-400 font-semibold">{user.gold}</td>
                  <td className="py-3 text-right text-cyan-400 font-semibold">{user.diamonds}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
