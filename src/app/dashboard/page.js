'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Row, Col, Card, Typography, Table, Tag, Space,
  Button, Spin, Statistic,Avatar
} from 'antd';
import {
  ArrowUpOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
  LoadingOutlined,
  DollarOutlined,
  AppstoreOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  ReloadOutlined,
  
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { getDashboardStats } from './action';

const { Title, Text } = Typography;

const getStatusTag = (status) => {
  switch (status) {
    case 'PENDING':    return <Tag icon={<ClockCircleOutlined />}  color="warning">قيد الانتظار</Tag>;
    case 'COMPLETED':  return <Tag icon={<CheckCircleOutlined />}  color="success">مكتمل</Tag>;
    case 'CANCELLED':  return <Tag icon={<CloseCircleOutlined />}  color="error">ملغي</Tag>;
    default:           return <Tag>{status}</Tag>;
  }
};

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsiveness
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    const res = await getDashboardStats();
    if (res.success) setStats(res.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const statCards = stats ? [
    {
      title: 'إجمالي المبيعات',
      value: stats.totalRevenue.toLocaleString(),
      suffix: 'د.ع',
      icon: <DollarOutlined style={{ color: '#01caa8' }} />,
      color: '#01caa8',
      sub: `${stats.completedOrders} طلب مكتمل`,
    },
    {
      title: 'الطلبات المعلقة',
      value: stats.pendingOrders,
      icon: <ShoppingCartOutlined style={{ color: '#faad14' }} />,
      color: '#faad14',
      sub: `${stats.totalOrders} إجمالي الطلبات`,
    },
    {
      title: 'المنتجات النشطة',
      value: stats.totalProducts,
      icon: <ShoppingOutlined style={{ color: '#1677ff' }} />,
      color: '#1677ff',
      sub: `${stats.totalCategories} فئة`,
    },
    {
      title: 'المدراء',
      value: stats.totalAdmins,
      icon: <UserOutlined style={{ color: '#722ed1' }} />,
      color: '#722ed1',
      sub: 'حساب نشط',
    },
  ] : [];

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
      render: (name) => <Text>{name}</Text>,
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
      title: 'المبلغ',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (v) => <Text strong style={{ color: '#01caa8' }}>{Number(v).toLocaleString()} د.ع</Text>,
    },
    {
      title: 'الحالة',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'الإجراءات',
      key: 'action',
      render: (_, record) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => router.push(`/dashboard/ordders/${record.id}`)}
        />
      ),
    },
  ];

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <Spin size="large" />
    </div>
  );

  return (
    <div style={{ padding: '0 0 32px 0', direction: 'rtl' }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }} align="middle">
        <Col xs={24} sm={18}>
          <Title level={2} style={{ margin: 0, fontSize: isMobile ? '1.5rem' : '1.8rem' }}>نظرة عامة</Title>
          <Text type="secondary">مرحباً بك مجدداً، إليك ملخص لأداء المتجر.</Text>
        </Col>
        {!isMobile && (
          <Col sm={6} style={{ textAlign: 'left' }}>
            <Button icon={<ReloadOutlined />} onClick={fetchStats} loading={loading}>
              تحديث
            </Button>
          </Col>
        )}
      </Row>

      <Row gutter={[16, 16]}>
        {statCards.map((stat, index) => (
          <Col xs={12} sm={12} lg={6} key={index}>
            <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: 14 }}>{stat.title}</Text>
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 4, flexWrap: 'wrap' }}>
                    <Title level={isMobile ? 4 : 3} style={{ margin: 0 }}>{stat.value}</Title>
                    {stat.suffix && <Text type="secondary" style={{ fontSize: isMobile ? 10 : 13 }}>{stat.suffix}</Text>}
                  </div>
                  <Text type="secondary" style={{ fontSize: isMobile ? 10 : 12, marginTop: 4, display: 'block' }}>
                    {stat.sub}
                  </Text>
                </div>
                {!isMobile && (
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: `${stat.color}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24,
                  }}>
                    {stat.icon}
                  </div>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Order Status Summary */}
      {stats && (
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col xs={8} sm={8}>
            <Card bordered={false} style={{ borderRadius: 16, textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', padding: isMobile ? '8px 0' : '24px 0' }}>
              <ClockCircleOutlined style={{ fontSize: isMobile ? 20 : 28, color: '#faad14', marginBottom: 8 }} />
              <Statistic 
                title={<span style={{ fontSize: isMobile ? 11 : 14 }}>قيد الانتظار</span>} 
                value={stats.pendingOrders} 
                valueStyle={{ color: '#faad14', fontSize: isMobile ? 18 : 24, fontWeight: 700 }} 
              />
            </Card>
          </Col>
          <Col xs={8} sm={8}>
            <Card bordered={false} style={{ borderRadius: 16, textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', padding: isMobile ? '8px 0' : '24px 0' }}>
              <CheckCircleOutlined style={{ fontSize: isMobile ? 20 : 28, color: '#52c41a', marginBottom: 8 }} />
              <Statistic 
                title={<span style={{ fontSize: isMobile ? 11 : 14 }}>مكتملة</span>} 
                value={stats.completedOrders} 
                valueStyle={{ color: '#52c41a', fontSize: isMobile ? 18 : 24, fontWeight: 700 }} 
              />
            </Card>
          </Col>
          <Col xs={8} sm={8}>
            <Card bordered={false} style={{ borderRadius: 16, textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', padding: isMobile ? '8px 0' : '24px 0' }}>
              <CloseCircleOutlined style={{ fontSize: isMobile ? 20 : 28, color: '#ff4d4f', marginBottom: 8 }} />
              <Statistic 
                title={<span style={{ fontSize: isMobile ? 11 : 14 }}>ملغية</span>} 
                value={stats.cancelledOrders} 
                valueStyle={{ color: '#ff4d4f', fontSize: isMobile ? 18 : 24, fontWeight: 700 }} 
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Recent Orders Table */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card
            title="آخر الطلبات"
            bordered={false}
            style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
            extra={
              <Button type="link" onClick={() => router.push('/dashboard/ordders')}>
                عرض الكل
              </Button>
            }
          >
            {isMobile ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {(stats?.recentOrders ?? []).map((order) => (
                  <div key={order.id} style={{ 
                    padding: 16, 
                    background: '#f8fafc', 
                    borderRadius: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text strong style={{ fontSize: 15 }}>طلب #{order.id}</Text>
                      <Text strong style={{ color: '#01caa8' }}>{Number(order.totalPrice).toLocaleString()} د.ع</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space>
                        <Avatar size="small" icon={<UserOutlined />} style={{ background: '#fff', color: '#595959' }} />
                        <Text style={{ fontSize: 13 }}>{order.name}</Text>
                      </Space>
                      {getStatusTag(order.status)}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {new Date(order.createdAt).toLocaleDateString('ar-IQ')}
                      </Text>
                      <Button 
                        type="primary" 
                        ghost 
                        size="small" 
                        icon={<EyeOutlined />}
                        onClick={() => router.push(`/dashboard/ordders/${order.id}`)}
                        style={{ borderRadius: 6 }}
                      >
                        عرض
                      </Button>
                    </div>
                  </div>
                ))}
                {(stats?.recentOrders?.length === 0) && (
                  <Text type="secondary" style={{ textAlign: 'center', padding: 20 }}>لا توجد طلبات</Text>
                )}
              </div>
            ) : (
              <Table
                columns={columns}
                dataSource={(stats?.recentOrders ?? []).map((o) => ({ ...o, key: o.id }))}
                pagination={false}
                locale={{ emptyText: 'لا يوجد طلبات حتى الآن' }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
