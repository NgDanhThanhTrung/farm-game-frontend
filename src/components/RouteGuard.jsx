import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Component bảo vệ Router cho phân vùng Quản trị hệ thống
 */
const RouteGuard = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminPrivilege = async () => {
      // 1. Lấy thông tin Telegram initData để gửi lên Backend kiểm chứng thực tế
      const tg = window.Telegram?.WebApp;
      const initData = tg?.initData || '';

      if (!initData) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Gửi request lên Admin Config API để Backend tiến hành xác thực HMAC và check field isAdmin
        const response = await fetch(`${API_BASE_URL}/api/admin/config`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${initData}`
          }
        });

        if (response.ok) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error verifying admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminPrivilege();
  }, []);

  if (loading) {
    return (
      <div class="min-h-screen flex items-center justify-center bg-[#0a0a12]">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyber-neonBlue"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a12] px-4">
        <div className="glass-panel p-8 rounded-2xl text-center max-w-md border-red-500/30">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest">Từ Chối Quyền Truy Cập</h1>
          <p className="text-gray-400 text-sm">
            Tài khoản Telegram của bạn không thuộc danh sách Quản trị viên (Admin) của hệ thống Farm Game.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default RouteGuard;
