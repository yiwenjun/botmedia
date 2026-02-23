import { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Button, Spin } from 'antd';
import {
  FileTextOutlined,
  ShoppingOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  EyeOutlined,
  ArrowUpOutlined,
  PlusOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { analyticsAPI, articleAPI } from '@/services/api';
import type { DashboardStats, Article } from '@/types';
import dayjs from 'dayjs';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [viewData, setViewData] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load dashboard stats
      const statsRes = await analyticsAPI.getDashboardStats();
      if (statsRes.data.code === 0) {
        setStats(statsRes.data.data);
      }

      // Load recent articles
      const articlesRes = await articleAPI.list({ page: 1, pageSize: 5 });
      if (articlesRes.data.code === 0) {
        setRecentArticles(articlesRes.data.data.items);
      }

      // Load view stats for chart
      const viewsRes = await analyticsAPI.getViewStats(7);
      if (viewsRes.data.code === 0) {
        setViewData(viewsRes.data.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Views',
      dataIndex: 'viewCount',
      key: 'viewCount',
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Article) => (
        <Button
          type="link"
          size="small"
          icon={<EditOutlined />}
          onClick={() => navigate(`/articles/edit/${record.id}`)}
        >
          Edit
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Dashboard</h1>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Articles"
              value={stats?.totalArticles || 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Products"
              value={stats?.totalProducts || 0}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats?.totalUsers || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={stats?.totalOrders || 0}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Views Chart */}
        <Col xs={24} lg={16}>
          <Card title="Views Over Time (Last 7 Days)" bordered={false}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={viewData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#1890ff" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col xs={24} lg={8}>
          <Card title="Quick Actions" bordered={false}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              block
              style={{ marginBottom: 12 }}
              onClick={() => navigate('/articles/create')}
            >
              Create Article
            </Button>
            <Button
              type="default"
              icon={<PlusOutlined />}
              block
              style={{ marginBottom: 12 }}
              onClick={() => navigate('/products/create')}
            >
              Create Product
            </Button>
            <Button
              type="default"
              icon={<EyeOutlined />}
              block
              onClick={() => navigate('/analytics')}
            >
              View Analytics
            </Button>
            
            <div style={{ marginTop: 24, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
              <Statistic
                title="Today's Views"
                value={stats?.todayViews || 0}
                prefix={<ArrowUpOutlined />}
                suffix={`/ ${stats?.totalViews || 0}`}
                valueStyle={{ color: '#3f8600', fontSize: 20 }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Articles */}
      <Card
        title="Recent Articles"
        style={{ marginTop: 24 }}
        extra={
          <Button type="link" onClick={() => navigate('/articles')}>
            View All
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={recentArticles}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
