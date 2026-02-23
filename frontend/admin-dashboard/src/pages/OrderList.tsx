import { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Input, Select, message, Modal } from 'antd';
import { SearchOutlined, DollarOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { orderAPI } from '@/services/api';
import type { Order, OrderQueryParams } from '@/types';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;

const OrderList = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [filters, setFilters] = useState<OrderQueryParams>({});

  useEffect(() => {
    loadOrders();
  }, [pagination.current, pagination.pageSize, filters]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await orderAPI.list({
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...filters,
      });

      if (response.data.code === 0) {
        setOrders(response.data.data.items);
        setTotal(response.data.data.total);
      }
    } catch (error) {
      message.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = (id: number, orderNo: string) => {
    Modal.confirm({
      title: 'Confirm Refund',
      content: `Are you sure you want to refund order ${orderNo}?`,
      okText: 'Yes, Refund',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await orderAPI.refund(id);
          message.success('Order refunded successfully');
          loadOrders();
        } catch (error) {
          message.error('Failed to refund order');
        }
      },
    });
  };

  const getStatusColor = (status: Order['status']) => {
    const colors: Record<Order['status'], string> = {
      pending: 'orange',
      paid: 'blue',
      shipped: 'cyan',
      completed: 'green',
      cancelled: 'default',
      refunded: 'red',
    };
    return colors[status] || 'default';
  };

  const getPaymentMethodColor = (method?: Order['paymentMethod']) => {
    if (!method) return 'default';
    const colors: Record<Order['paymentMethod'], string> = {
      wechat: 'green',
      alipay: 'blue',
      credit_card: 'purple',
    };
    return colors[method] || 'default';
  };

  const columns: ColumnsType<Order> = [
    {
      title: 'Order No',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: '12%',
    },
    {
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
      width: '10%',
    },
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      width: '18%',
      ellipsis: true,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: '10%',
      render: (amount: number) => (
        <span style={{ fontWeight: 'bold' }}>
          <DollarOutlined /> {amount.toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (status: Order['status']) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Payment',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: '10%',
      render: (method?: Order['paymentMethod']) =>
        method ? (
          <Tag color={getPaymentMethodColor(method)}>
            {method.replace('_', ' ').toUpperCase()}
          </Tag>
        ) : (
          <span style={{ color: '#999' }}>-</span>
        ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '12%',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '18%',
      render: (_: any, record: Order) => (
        <Space size="small">
          {record.status === 'paid' && (
            <Button
              type="link"
              size="small"
              danger
              onClick={() => handleRefund(record.id, record.orderNo)}
            >
              Refund
            </Button>
          )}
          {!['paid', 'refunded', 'cancelled'].includes(record.status) && (
            <span style={{ color: '#999' }}>-</span>
          )}
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
    setFilters({ ...filters, orderNo: value });
    setPagination({ ...pagination, current: 1 });
  };

  const handleStatusChange = (value: string) => {
    setFilters({ ...filters, status: value as Order['status'] });
    setPagination({ ...pagination, current: 1 });
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h1>Orders</h1>
      </div>

      {/* Filters */}
      <Space style={{ marginBottom: 16 }} wrap>
        <Search
          placeholder="Search by order number"
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
          <Option value="pending">Pending</Option>
          <Option value="paid">Paid</Option>
          <Option value="shipped">Shipped</Option>
          <Option value="completed">Completed</Option>
          <Option value="cancelled">Cancelled</Option>
          <Option value="refunded">Refunded</Option>
        </Select>
      </Space>

      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: total,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} orders`,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default OrderList;
