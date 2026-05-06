'use client';
import React, { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Space,
  Tag,
  Typography,
  Card,
  Row,
  Col,
  Descriptions,
  Divider,
  Avatar,
  Tooltip,
} from 'antd';
import {
  EyeOutlined,
  PrinterOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

const OrdersPage = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock Data for Orders
  const mockOrders = [
    {
      key: '1',
      id: 1024,
      customerName: 'محمد جاسم العلي',
      phone: '07701234567',
      address: 'بغداد، المنصور، شارع 14 رمضان',
      status: 'PENDING',
      totalPrice: 135000,
      createdAt: '2024-05-06 14:30',
      items: [
        { id: 1, name: 'Whey Gold Standard', flavor: 'شوكولاتة', size: '2.27 كجم', quantity: 1, price: 95000, image: 'https://3km3cceozg.ucarecd.net/b0f4146b-cb83-443a-81aa-0d050ad95cf2/-/preview/1000x1000/' },
        { id: 2, name: 'Creatine Monohydrate', flavor: 'بدون نكهة', size: '300 جم', quantity: 1, price: 35000, image: 'https://3km3cceozg.ucarecd.net/a744ef8d-4021-4d9e-aeeb-4b848423427a/-/preview/1000x1000/' },
      ]
    },
    {
      key: '2',
      id: 1025,
      customerName: 'سارة أحمد محمود',
      phone: '07812345678',
      address: 'أربيل، شارع 60، مجمع كولان',
      status: 'COMPLETED',
      totalPrice: 45000,
      createdAt: '2024-05-06 11:20',
      items: [
        { id: 3, name: 'C4 Original', flavor: 'توت أزرق', size: '30 حصة', quantity: 1, price: 45000, image: 'https://3km3cceozg.ucarecd.net/59156cd8-6e11-41ee-89d3-407a86abe03b/-/preview/1000x1000/' },
      ]
    },
    {
      key: '3',
      id: 1026,
      customerName: 'علي حسين كاظم',
      phone: '07509876543',
      address: 'البصرة، العشار، قرب ساحة أم البروم',
      status: 'CANCELLED',
      totalPrice: 110000,
      createdAt: '2024-05-05 18:45',
      items: [
        { id: 4, name: 'Hydro Whey Protein', flavor: 'شوكولاتة', size: '1.6 كجم', quantity: 1, price: 110000, image: 'https://3km3cceozg.ucarecd.net/9f4cdacc-cb08-4d36-b675-841dbc65f346/-/preview/1000x1000/' },
      ]
    }
  ];

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

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

  const columns = [
    {
      title: 'رقم الطلب',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <Text strong>#{id}</Text>,
    },
    {
      title: 'الزبون',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (name) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#f0f2f5', color: '#595959' }} />
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title: 'التاريخ',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => <Text type="secondary">{date}</Text>,
    },
    {
      title: 'المبلغ الإجمالي',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (total) => <Text strong style={{ color: '#01caa8' }}>{total.toLocaleString()} د.ع</Text>,
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
      render: (record) => (
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
            <Button type="text" icon={<PrinterOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ direction: 'rtl' }}>
      <Row gutter={[24, 24]} align="middle" style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Title level={2} style={{ margin: 0 }}>الطلبات</Title>
          <Text type="secondary">متابعة طلبات الزبائن وتغيير حالات التوصيل</Text>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <Table 
          columns={columns} 
          dataSource={mockOrders} 
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Order Details Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 32 }}>
            <Title level={4} style={{ margin: 0 }}>تفاصيل الطلب #{selectedOrder?.id}</Title>
            {selectedOrder && getStatusTag(selectedOrder.status)}
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="print" icon={<PrinterOutlined />} onClick={() => window.print()}>طباعة الوصل</Button>,
          <Button key="close" type="primary" onClick={handleCancel} style={{ borderRadius: 8 }}>إغلاق</Button>,
        ]}
        width={750}
        centered
      >
        {selectedOrder && (
          <div style={{ marginTop: 24 }}>
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Descriptions title="معلومات الزبون" bordered size="small" column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
                  <Descriptions.Item label={<Space><UserOutlined /> الاسم</Space>}>{selectedOrder.customerName}</Descriptions.Item>
                  <Descriptions.Item label={<Space><PhoneOutlined /> رقم الهاتف</Space>}>{selectedOrder.phone}</Descriptions.Item>
                  <Descriptions.Item label={<Space><EnvironmentOutlined /> العنوان</Space>} span={2}>{selectedOrder.address}</Descriptions.Item>
                  <Descriptions.Item label="تاريخ الطلب">{selectedOrder.createdAt}</Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>

            <Divider orientation="right">المنتجات المطلوبة</Divider>

            <Table 
              dataSource={selectedOrder.items} 
              pagination={false}
              size="small"
              rowKey="id"
              columns={[
                {
                  title: 'المنتج',
                  dataIndex: 'name',
                  key: 'name',
                  render: (text, record) => (
                    <Space>
                      <Avatar src={record.image} shape="square" size={40} />
                      <div>
                        <Text strong style={{ fontSize: 12 }}>{text}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 10 }}>{record.flavor} - {record.size}</Text>
                      </div>
                    </Space>
                  )
                },
                {
                  title: 'الكمية',
                  dataIndex: 'quantity',
                  key: 'quantity',
                  align: 'center',
                  render: (q) => <Text strong>{q}</Text>
                },
                {
                  title: 'السعر',
                  dataIndex: 'price',
                  key: 'price',
                  align: 'left',
                  render: (p) => <Text>{p.toLocaleString()} د.ع</Text>
                },
                {
                  title: 'المجموع',
                  key: 'total',
                  align: 'left',
                  render: (_, record) => <Text strong>{(record.price * record.quantity).toLocaleString()} د.ع</Text>
                }
              ]}
            />

            <div style={{ marginTop: 24, textAlign: 'left', background: '#fafafa', padding: '16px 24px', borderRadius: 12 }}>
              <Row justify="end" gutter={[0, 8]}>
                <Col span={12}><Text type="secondary">المجموع الفرعي:</Text></Col>
                <Col span={6} style={{ textAlign: 'left' }}><Text strong>{selectedOrder.totalPrice.toLocaleString()} د.ع</Text></Col>
                
                <Col span={12}><Text type="secondary">أجور التوصيل:</Text></Col>
                <Col span={6} style={{ textAlign: 'left' }}><Text strong>5,000 د.ع</Text></Col>
                
                <Col span={24}><Divider style={{ margin: '8px 0' }} /></Col>
                
                <Col span={12}><Text strong style={{ fontSize: 18 }}>المجموع النهائي:</Text></Col>
                <Col span={6} style={{ textAlign: 'left' }}>
                  <Text strong style={{ fontSize: 20, color: '#01caa8' }}>{(selectedOrder.totalPrice + 5000).toLocaleString()} د.ع</Text>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </Modal>

      <style jsx global>{`
        .ant-modal-title {
          direction: rtl;
        }
        .ant-descriptions-title {
          font-size: 14px !important;
          color: #8c8c8c !important;
        }
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
