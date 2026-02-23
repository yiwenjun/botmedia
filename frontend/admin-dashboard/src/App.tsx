import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import ArticleList from './pages/ArticleList';
import ArticleEdit from './pages/ArticleEdit';
import ProductList from './pages/ProductList';
import ProductEdit from './pages/ProductEdit';
import UserList from './pages/UserList';
import OrderList from './pages/OrderList';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import { isAuthenticated } from './services/auth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="articles" element={<ArticleList />} />
          <Route path="articles/create" element={<ArticleEdit />} />
          <Route path="articles/edit/:id" element={<ArticleEdit />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/create" element={<ProductEdit />} />
          <Route path="products/edit/:id" element={<ProductEdit />} />
          <Route path="users" element={<UserList />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </ConfigProvider>
  );
}

export default App;
