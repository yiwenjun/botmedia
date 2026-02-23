import { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Input, Select, message, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { articleAPI } from '@/services/api';
import type { Article, ArticleQueryParams } from '@/types';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;

const ArticleList = () => {
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [filters, setFilters] = useState<ArticleQueryParams>({});
  const navigate = useNavigate();

  useEffect(() => {
    loadArticles();
  }, [pagination.current, pagination.pageSize, filters]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const response = await articleAPI.list({
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...filters,
      });

      if (response.data.code === 0) {
        setArticles(response.data.data.items);
        setTotal(response.data.data.total);
      }
    } catch (error) {
      message.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this article?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await articleAPI.delete(id);
          message.success('Article deleted successfully');
          loadArticles();
        } catch (error) {
          message.error('Failed to delete article');
        }
      },
    });
  };

  const getStatusColor = (status: Article['status']) => {
    switch (status) {
      case 'draft':
        return 'blue';
      case 'published':
        return 'green';
      case 'archived':
        return 'default';
      default:
        return 'default';
    }
  };

  const columns: ColumnsType<Article> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '30%',
      ellipsis: true,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: '12%',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (status: Article['status']) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      width: '12%',
    },
    {
      title: 'Views',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: '8%',
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '12%',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '16%',
      render: (_: any, record: Article) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/articles/edit/${record.id}`)}
          >
            Edit
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleTableChange = (paginationConfig: TablePaginationConfig) => {
    setPagination({
      current: paginationConfig.current || 1,
      pageSize: paginationConfig.pageSize || 10,
    });
  };

  const handleSearch = (value: string) => {
    setFilters({ ...filters, title: value });
    setPagination({ ...pagination, current: 1 });
  };

  const handleStatusChange = (value: string) => {
    setFilters({ ...filters, status: value as Article['status'] });
    setPagination({ ...pagination, current: 1 });
  };

  const handleCategoryChange = (value: string) => {
    setFilters({ ...filters, category: value });
    setPagination({ ...pagination, current: 1 });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>Articles</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/articles/create')}
        >
          Create Article
        </Button>
      </div>

      {/* Filters */}
      <Space style={{ marginBottom: 16 }} wrap>
        <Search
          placeholder="Search by title"
          allowClear
          enterButton={<SearchOutlined />}
          style={{ width: 300 }}
          onSearch={handleSearch}
        />
        <Select
          placeholder="Status"
          style={{ width: 150 }}
          allowClear
          onChange={handleStatusChange}
        >
          <Option value="draft">Draft</Option>
          <Option value="published">Published</Option>
          <Option value="archived">Archived</Option>
        </Select>
        <Select
          placeholder="Category"
          style={{ width: 150 }}
          allowClear
          onChange={handleCategoryChange}
        >
          <Option value="Technology">Technology</Option>
          <Option value="Business">Business</Option>
          <Option value="Lifestyle">Lifestyle</Option>
          <Option value="News">News</Option>
        </Select>
      </Space>

      <Table
        columns={columns}
        dataSource={articles}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: total,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default ArticleList;
