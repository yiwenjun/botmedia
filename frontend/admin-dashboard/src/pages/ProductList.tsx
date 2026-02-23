import { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Input, Select, message, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { productAPI } from '@/services/api';
import type { Product, ProductQueryParams } from '@/types';

const { Search } = Input;
const { Option } = Select;

const ProductList = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [filters, setFilters] = useState<ProductQueryParams>({});
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, [pagination.current, pagination.pageSize, filters]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await productAPI.list({
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...filters,
      });

      if (response.data.code === 0) {
        setProducts(response.data.data.items);
        setTotal(response.data.data.total);
      }
    } catch (error) {
      message.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this product?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await productAPI.delete(id);
          message.success('Product deleted successfully');
          loadProducts();
        } catch (error) {
          message.error('Failed to delete product');
        }
      },
    });
  };

  const columns: ColumnsType<Product> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      ellipsis: true,
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
      width: '12%',
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
      width: '12%',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: '10%',
      render: (price: number) => `$${price.toFixed(2)}`,
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
      render: (status: Product['status']) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '19%',
      render: (_: any, record: Product) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/products/edit/${record.id}`)}
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
    setFilters({ ...filters, name: value });
    setPagination({ ...pagination, current: 1 });
  };

  const handleStatusChange = (value: string) => {
    setFilters({ ...filters, status: value as Product['status'] });
    setPagination({ ...pagination, current: 1 });
  };

  const handleCategoryChange = (value: string) => {
    setFilters({ ...filters, category: value });
    setPagination({ ...pagination, current: 1 });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>Products</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/products/create')}
        >
          Create Product
        </Button>
      </div>

      {/* Filters */}
      <Space style={{ marginBottom: 16 }} wrap>
        <Search
          placeholder="Search by name"
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
          <Option value="active">Active</Option>
          <Option value="inactive">Inactive</Option>
        </Select>
        <Select
          placeholder="Category"
          style={{ width: 150 }}
          allowClear
          onChange={handleCategoryChange}
        >
          <Option value="Electronics">Electronics</Option>
          <Option value="Computers">Computers</Option>
          <Option value="Smartphones">Smartphones</Option>
          <Option value="Accessories">Accessories</Option>
        </Select>
      </Space>

      <Table
        columns={columns}
        dataSource={products}
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

export default ProductList;
