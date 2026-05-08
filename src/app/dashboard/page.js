'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Row, Col, Card, Typography, Table, Tag, Space,
  Button, Spin, Statistic,
} from 'antd';
import {
  ArrowUpOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
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
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }} align="middle">
        <Col flex="auto">
          <Title level={2} style={{ margin: 0 }}>نظرة عامة</Title>
          <Text type="secondary">مرحباً بك مجدداً، إليك ملخص لأداء المتجر.</Text>
        </Col>
        <Col>
          <Button icon={<ReloadOutlined />} onClick={fetchStats} loading={loading}>
            تحديث
          </Button>
        </Col>
      </Row>

      {/* Stat Cards */}
      <Row gutter={[24, 24]}>
        {statCards.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: 14 }}>{stat.title}</Text>
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <Title level={3} style={{ margin: 0 }}>{stat.value}</Title>
                    {stat.suffix && <Text type="secondary" style={{ fontSize: 13 }}>{stat.suffix}</Text>}
                  </div>
                  <Text type="secondary" style={{ fontSize: 12, marginTop: 6, display: 'block' }}>
                    {stat.sub}
                  </Text>
                </div>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: `${stat.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24,
                }}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Order Status Summary */}
      {stats && (
        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col xs={24} sm={8}>
            <Card bordered={false} style={{ borderRadius: 16, textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <ClockCircleOutlined style={{ fontSize: 28, color: '#faad14', marginBottom: 8 }} />
              <Statistic title="قيد الانتظار" value={stats.pendingOrders} valueStyle={{ color: '#faad14' }} />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card bordered={false} style={{ borderRadius: 16, textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <CheckCircleOutlined style={{ fontSize: 28, color: '#52c41a', marginBottom: 8 }} />
              <Statistic title="مكتملة" value={stats.completedOrders} valueStyle={{ color: '#52c41a' }} />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card bordered={false} style={{ borderRadius: 16, textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <CloseCircleOutlined style={{ fontSize: 28, color: '#ff4d4f', marginBottom: 8 }} />
              <Statistic title="ملغية" value={stats.cancelledOrders} valueStyle={{ color: '#ff4d4f' }} />
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
            <Table
              columns={columns}
              dataSource={(stats?.recentOrders ?? []).map((o) => ({ ...o, key: o.id }))}
              pagination={false}
              locale={{ emptyText: 'لا يوجد طلبات حتى الآن' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
