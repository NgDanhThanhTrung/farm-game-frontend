import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GameHome from './pages/GameHome';
import AdminDashboard from './pages/AdminDashboard';
import RouteGuard from './components/RouteGuard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route Game dành cho User thông thường */}
        <Route path="/" element={<GameHome />} />
        
        {/* Route Guard bảo vệ tài nguyên trang Quản trị viên */}
        <Route 
          path="/admin" 
          element={
            <RouteGuard>
              <AdminDashboard />
            </RouteGuard>
          } 
        />
        
        {/* Redirect tất cả các đường dẫn lạ về màn hình chính */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
