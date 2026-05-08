'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Card,
  Row,
  Col,
  Avatar,
  Tooltip,
  Spin,
  Select,
  message,
} from 'antd';
import {
  EyeOutlined,
  PrinterOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { getOrders, updateOrderStatus } from './action';

const { Title, Text } = Typography;

const statusOptions = [
  { value: 'PENDING', label: 'قيد الانتظار', color: 'warning' },
  { value: 'COMPLETED', label: 'مكتمل', color: 'success' },
  { value: 'CANCELLED', label: 'ملغي', color: 'error' },
];

const getStatusTag = (status) => {
  switch (status) {
    case 'PENDING':
      return <Tag icon={<ClockCircleOutlined />} color="warning">قيد الانتظار</Tag>;
    case 'COMPLETED':
      return <Tag icon={<CheckCircleOutlined />} color="success">مكتمل</Tag>;
    case 'CANCELLED':
      return <Tag icon={<CloseCircleOutlined />} color="error">ملغي</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
};

const OrdersPage = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(null); // id of the row being updated

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const res = await getOrders();
    if (res.success) {
      setData(res.data.map((o) => ({ ...o, key: o.id })));
    } else {
      message.error(res.message || 'حدث خطأ أثناء جلب الطلبات');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (id, status) => {
    setStatusUpdating(id);
    const res = await updateOrderStatus(id, status);
    if (res.success) {
      message.success(res.message);
      setData((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    } else {
      message.error(res.message);
    }
    setStatusUpdating(null);
  };

  const columns = [
    {
      title: 'رقم الطلب',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <Text strong>#{id}</Text>,
    },
    {
      title: 'الزبون',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#f0f2f5', color: '#595959' }} />
          <div>
            <Text strong>{name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>{record.phoneNumber}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'التاريخ',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <Text type="secondary">
          {new Date(date).toLocaleDateString('ar-IQ', {
            year: 'numeric', month: 'short', day: 'numeric',
          })}
        </Text>
      ),
    },
    {
      title: 'المبلغ الإجمالي',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (total) => (
        <Text strong style={{ color: '#01caa8' }}>
          {Number(total).toLocaleString()} د.ع
        </Text>
      ),
    },
    {
      title: 'الحالة',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Select
          value={status}
          size="small"
          style={{ minWidth: 140 }}
          loading={statusUpdating === record.id}
          onChange={(val) => handleStatusChange(record.id, val)}
          options={statusOptions.map(({ value, label }) => ({ value, label }))}
        />
      ),
    },
    {
      title: 'الإجراءات',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="عرض التفاصيل">
            <Button
              type="primary"
              ghost
              icon={<EyeOutlined />}
              onClick={() => router.push(`/dashboard/ordders/${record.id}`)}
              style={{ borderRadius: 8 }}
            >
              التفاصيل
            </Button>
          </Tooltip>
          <Tooltip title="طباعة وصل">
            <Button
              type="text"
              icon={<PrinterOutlined />}
              onClick={() => router.push(`/dashboard/ordders/${record.id}?print=1`)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ direction: 'rtl' }}>
      <Row gutter={[24, 24]} align="middle" style={{ marginBottom: 24 }}>
        <Col span={18}>
          <Title level={2} style={{ margin: 0 }}>الطلبات</Title>
          <Text type="secondary">متابعة طلبات الزبائن وتغيير حالات التوصيل</Text>
        </Col>
        <Col span={6} style={{ textAlign: 'left' }}>
          <Tooltip title="تحديث">
            <Button icon={<ReloadOutlined />} onClick={fetchOrders} loading={loading} />
          </Tooltip>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: 'لا يوجد طلبات حتى الآن' }}
          />
        </Spin>
      </Card>

      <style jsx global>{`
        .ant-table-thead > tr > th {
          background: #fafafa !important;
          font-size: 12px !important;
          font-weight: 700 !important;
        }
      `}</style>
    </div>
  );
};

export default OrdersPage;
