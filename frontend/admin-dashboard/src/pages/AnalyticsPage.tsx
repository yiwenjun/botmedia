import { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Spin } from 'antd';
import { EyeOutlined, ArrowUpOutlined, FireOutlined } from '@ant-design/icons';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { analyticsAPI } from '@/services/api';
import type { DashboardStats, ViewStats, CategoryStats, Article } from '@/types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [viewData, setViewData] = useState<ViewStats[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryStats[]>([]);
  const [topArticles, setTopArticles] = useState<Article[]>([]);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Load dashboard stats
      const statsRes = await analyticsAPI.getDashboardStats();
      if (statsRes.data.code === 0) {
        setStats(statsRes.data.data);
      }

      // Load view stats (30 days)
      const viewsRes = await analyticsAPI.getViewStats(30);
      if (viewsRes.data.code === 0) {
        setViewData(viewsRes.data.data);
      }

      // Load category stats
      const categoriesRes = await analyticsAPI.getCategoryStats();
      if (categoriesRes.data.code === 0) {
        setCategoryData(categoriesRes.data.data);
      }

      // Load top articles
      const topRes = await analyticsAPI.getTopArticles(10);
      if (topRes.data.code === 0) {
        setTopArticles(topRes.data.data);
      }
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const articleColumns = [
    {
      title: 'Rank',
      key: 'rank',
      width: '10%',
      render: (_: any, __: any, index: number) => (
        <span style={{ fontWeight: 'bold', fontSize: 18 }}>#{index + 1}</span>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '50%',
      ellipsis: true,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: '20%',
    },
    {
      title: 'Views',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: '20%',
      render: (count: number) => (
        <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
          <EyeOutlined /> {count.toLocaleString()}
        </span>
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
      <h1 style={{ marginBottom: 24 }}>Analytics Dashboard</h1>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Today's Views"
              value={stats?.todayViews || 0}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Views"
              value={stats?.totalViews || 0}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Articles"
              value={stats?.totalArticles || 0}
              prefix={<FireOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Average Views/Article"
              value={
                stats?.totalArticles && stats?.totalViews
                  ? Math.round(stats.totalViews / stats.totalArticles)
                  : 0
              }
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Daily Views Line Chart */}
        <Col xs={24} lg={16}>
          <Card title="Daily Views (Last 30 Days)" bordered={false}>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={viewData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#1890ff"
                  strokeWidth={2}
                  name="Views"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Category Distribution Pie Chart */}
        <Col xs={24} lg={8}>
          <Card title="Articles by Category" bordered={false}>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, count }) => `${category}: ${count}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="category"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Top Articles Table */}
      <Card title="Top 10 Articles by Views" bordered={false}>
        <Table
          columns={articleColumns}
          dataSource={topArticles}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default AnalyticsPage;
