import { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Input, Select, message, Switch } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { userAPI } from '@/services/api';
import type { User, UserQueryParams } from '@/types';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;

const UserList = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [filters, setFilters] = useState<UserQueryParams>({});

  useEffect(() => {
    loadUsers();
  }, [pagination.current, pagination.pageSize, filters]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await userAPI.list({
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...filters,
      });

      if (response.data.code === 0) {
        setUsers(response.data.data.items);
        setTotal(response.data.data.total);
      }
    } catch (error) {
      message.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (id: number, currentStatus: User['status']) => {
    const newStatus = currentStatus === 'active' ? 'banned' : 'active';
    try {
      await userAPI.toggleStatus(id, newStatus);
      message.success(`User ${newStatus === 'active' ? 'activated' : 'banned'} successfully`);
      loadUsers();
    } catch (error) {
      message.error('Failed to update user status');
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      width: '15%',
      render: (text: string, record: User) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Nickname',
      dataIndex: 'nickname',
      key: 'nickname',
      width: '15%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '18%',
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      width: '15%',
      render: (roles: string[]) => (
        <>
          {roles.map((role) => (
            <Tag key={role} color="blue">
              {role.toUpperCase()}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (status: User['status']) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '12%',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '15%',
      render: (_: any, record: User) => (
        <Space size="small">
          <Switch
            checked={record.status === 'active'}
            checkedChildren="Active"
            unCheckedChildren="Banned"
            onChange={() => handleStatusToggle(record.id, record.status)}
          />
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
    setFilters({ ...filters, username: value });
    setPagination({ ...pagination, current: 1 });
  };

  const handleStatusChange = (value: string) => {
    setFilters({ ...filters, status: value as User['status'] });
    setPagination({ ...pagination, current: 1 });
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h1>Users</h1>
      </div>

      {/* Filters */}
      <Space style={{ marginBottom: 16 }} wrap>
        <Search
          placeholder="Search by username"
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
          <Option value="banned">Banned</Option>
        </Select>
      </Space>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: total,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} users`,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default UserList;
