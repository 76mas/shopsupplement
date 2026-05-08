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
  LoadingOutlined,
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 24 }}>
        <Col xs={20} sm={18}>
          <Title level={2} style={{ margin: 0, fontSize: '1.5rem' }}>الطلبات</Title>
          <Text type="secondary">متابعة طلبات الزبائن وتغيير حالات التوصيل</Text>
        </Col>
        <Col xs={4} sm={6} style={{ textAlign: 'left' }}>
          <Tooltip title="تحديث">
            <Button icon={<ReloadOutlined />} onClick={fetchOrders} loading={loading} />
          </Tooltip>
        </Col>
      </Row>

      {/* Orders List */}
      <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />}>
        {isMobile ? (
          <Row gutter={[16, 16]}>
            {data.map((r) => (
              <Col xs={24} key={r.id}>
                <Card 
                  variant="borderless" 
                  style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                  bodyStyle={{ padding: '16px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <Text strong style={{ fontSize: 16, display: 'block' }}>طلب #{r.id}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {new Date(r.createdAt).toLocaleDateString('ar-IQ', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </Text>
                    </div>
                    <Text strong style={{ color: '#01caa8', fontSize: 16 }}>
                      {Number(r.totalPrice).toLocaleString()} د.ع
                    </Text>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '10px', borderRadius: 12, marginBottom: 12 }}>
                    <Space>
                      <Avatar icon={<UserOutlined />} size="small" style={{ backgroundColor: '#fff', color: '#595959' }} />
                      <div>
                        <Text strong style={{ fontSize: 13, display: 'block', lineHeight: 1 }}>{r.name}</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>{r.phoneNumber}</Text>
                      </div>
                    </Space>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Select
                      value={r.status}
                      size="middle"
                      style={{ width: 130 }}
                      loading={statusUpdating === r.id}
                      onChange={(val) => handleStatusChange(r.id, val)}
                      options={statusOptions.map(({ value, label }) => ({ value, label }))}
                      className="mobile-status-select"
                    />
                    <Space>
                      <Button 
                        type="primary" 
                        ghost 
                        icon={<EyeOutlined />} 
                        onClick={() => router.push(`/dashboard/ordders/${r.id}`)}
                        style={{ borderRadius: 8 }}
                      >
                        التفاصيل
                      </Button>
                      <Button 
                        icon={<PrinterOutlined />} 
                        onClick={() => router.push(`/dashboard/ordders/${r.id}?print=1`)}
                        style={{ borderRadius: 8 }}
                      />
                    </Space>
                  </div>
                </Card>
              </Col>
            ))}
            {data.length === 0 && (
              <Col span={24}>
                <Card variant="borderless" style={{ textAlign: 'center', padding: 40, borderRadius: 16 }}>
                  <Text type="secondary">لا توجد طلبات حالياً</Text>
                </Card>
              </Col>
            )}
          </Row>
        ) : (
          <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <Table
              columns={columns}
              dataSource={data}
              pagination={{ pageSize: 10 }}
              locale={{ emptyText: 'لا يوجد طلبات حتى الآن' }}
            />
          </Card>
        )}
      </Spin>

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
