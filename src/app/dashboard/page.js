'use client';
import React from 'react';
import { Row, Col, Card, Statistic, Typography, Table, Tag, Space, Button } from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  ShoppingCartOutlined, 
  UserOutlined, 
  DollarOutlined, 
  RiseOutlined,
  EyeOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function DashboardPage() {
  const stats = [
    {
      title: 'إجمالي المبيعات',
      value: '1,240,000',
      prefix: 'IQD',
      trend: '+12.5%',
      trendType: 'up',
      icon: <DollarOutlined style={{ color: '#01caa8' }} />,
      color: '#01caa8'
    },
    {
      title: 'الطلبات الجديدة',
      value: '42',
      trend: '+4.2%',
      trendType: 'up',
      icon: <ShoppingCartOutlined style={{ color: '#1677ff' }} />,
      color: '#1677ff'
    },
    {
      title: 'الزبائن الجدد',
      value: '12',
      trend: '-2.1%',
      trendType: 'down',
      icon: <UserOutlined style={{ color: '#722ed1' }} />,
      color: '#722ed1'
    },
    {
      title: 'زيارات اليوم',
      value: '850',
      trend: '+15.8%',
      trendType: 'up',
      icon: <RiseOutlined style={{ color: '#faad14' }} />,
      color: '#faad14'
    }
  ];

  const columns = [
    {
      title: 'رقم الطلب',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <a>#{text}</a>,
    },
    {
      title: 'الزبون',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'التاريخ',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'المبلغ',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'الحالة',
      key: 'status',
      dataIndex: 'status',
      render: (status) => {
        let color = 'geekblue';
        let text = 'قيد المعالجة';
        if (status === 'completed') {
          color = 'green';
          text = 'مكتمل';
        } else if (status === 'pending') {
          color = 'volcano';
          text = 'قيد الانتظار';
        }
        return (
          <Tag color={color} key={status}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: 'الإجراءات',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="text" icon={<EyeOutlined />} />
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      id: '1024',
      customer: 'محمد جاسم',
      date: '2024-05-06',
      amount: '45,000 IQD',
      status: 'completed',
    },
    {
      key: '2',
      id: '1025',
      customer: 'علي حسين',
      date: '2024-05-06',
      amount: '25,000 IQD',
      status: 'pending',
    },
    {
      key: '3',
      id: '1026',
      customer: 'سارة أحمد',
      date: '2024-05-05',
      amount: '120,000 IQD',
      status: 'processing',
    },
  ];

  return (
    <div style={{ padding: '0 0 32px 0' }}>
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col span={24}>
          <Title level={2}>نظرة عامة</Title>
          <Text type="secondary">مرحباً بك مجدداً، إليك ملخص لأداء المتجر اليوم.</Text>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: 14 }}>{stat.title}</Text>
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <Title level={3} style={{ margin: 0 }}>{stat.value}</Title>
                    {stat.prefix && <Text type="secondary">{stat.prefix}</Text>}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Text 
                      style={{ 
                        color: stat.trendType === 'up' ? '#52c41a' : '#ff4d4f',
                        fontSize: 12,
                        fontWeight: 'bold',
                        background: stat.trendType === 'up' ? '#f6ffed' : '#fff1f0',
                        padding: '2px 8px',
                        borderRadius: 4
                      }}
                    >
                      {stat.trendType === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {stat.trend}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12, marginRight: 8 }}>مقارنة بالشهر الماضي</Text>
                  </div>
                </div>
                <div style={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: 12, 
                  background: `${stat.color}15`, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: 24
                }}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
        <Col span={24}>
          <Card 
            title="آخر الطلبات" 
            bordered={false} 
            style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
            extra={<Button type="link">عرض الكل</Button>}
          >
            <Table columns={columns} dataSource={data} pagination={false} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
