'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Card,
  Row,
  Col,
  Descriptions,
  Divider,
  Avatar,
  Select,
  Input,
  InputNumber,
  message,
  Breadcrumb,
  Popconfirm,
} from 'antd';
import {
  ArrowRightOutlined,
  SaveOutlined,
  PrinterOutlined,
  DeleteOutlined,
  PlusOutlined,
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text } = Typography;

const OrderDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId;

  // Mock data for a single order (usually fetched from DB)
  const [order, setOrder] = useState({
    id: orderId,
    customerName: 'محمد جاسم العلي',
    phone: '07701234567',
    address: 'بغداد، المنصور، شارع 14 رمضان',
    status: 'PENDING',
    createdAt: '2024-05-06 14:30',
    items: [
      { id: 1, name: 'Whey Gold Standard', flavor: 'شوكولاتة', size: '2.27 كجم', quantity: 1, price: 95000, image: 'https://3km3cceozg.ucarecd.net/b0f4146b-cb83-443a-81aa-0d050ad95cf2/-/preview/1000x1000/' },
      { id: 2, name: 'Creatine Monohydrate', flavor: 'بدون نكهة', size: '300 جم', quantity: 1, price: 35000, image: 'https://3km3cceozg.ucarecd.net/a744ef8d-4021-4d9e-aeeb-4b848423427a/-/preview/1000x1000/' },
    ]
  });

  const [isEditing, setIsEditing] = useState(false);

  const subtotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 5000;
  const total = subtotal + shipping;

  const handleStatusChange = (value) => {
    setOrder({ ...order, status: value });
    message.success(`تم تغيير حالة الطلب إلى: ${value}`);
  };

  const updateQuantity = (id, q) => {
    const newItems = order.items.map(item => 
      item.id === id ? { ...item, quantity: q } : item
    );
    setOrder({ ...order, items: newItems });
  };

  const removeItem = (id) => {
    const newItems = order.items.filter(item => item.id !== id);
    setOrder({ ...order, items: newItems });
    message.warning('تم حذف المنتج من الطلب');
  };

  const handleSave = () => {
    setIsEditing(false);
    message.success('تم حفظ التعديلات بنجاح');
  };

  const columns = [
    {
      title: 'المنتج',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar src={record.image} shape="square" size={64} />
          <div>
            <Text strong>{text}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>{record.flavor} - {record.size}</Text>
          </div>
        </Space>
      )
    },
    {
      title: 'السعر',
      dataIndex: 'price',
      key: 'price',
      render: (p) => <Text>{p.toLocaleString()} د.ع</Text>
    },
    {
      title: 'الكمية',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (q, record) => (
        <InputNumber 
          min={1} 
          value={q} 
          onChange={(val) => updateQuantity(record.id, val)} 
          disabled={!isEditing}
          style={{ width: 70 }}
        />
      )
    },
    {
      title: 'المجموع',
      key: 'total',
      render: (_, record) => <Text strong>{(record.price * record.quantity).toLocaleString()} د.ع</Text>
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => isEditing && (
        <Popconfirm title="هل أنت متأكد من حذف هذا المنتج؟" onConfirm={() => removeItem(record.id)} okText="نعم" cancelText="لا">
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      )
    }
  ];

  return (
    <div style={{ direction: 'rtl', paddingBottom: 50 }}>
      <Row gutter={[24, 24]} align="middle" style={{ marginBottom: 24 }} className="no-print">
        <Col span={24}>
          <Breadcrumb 
            items={[
              { title: <Link href="/dashboard">لوحة التحكم</Link> },
              { title: <Link href="/dashboard/ordders">الطلبات</Link> },
              { title: `طلب #${orderId}` },
            ]} 
            style={{ marginBottom: 16 }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space size={16}>
              <Button 
                icon={<ArrowRightOutlined />} 
                onClick={() => router.back()} 
                style={{ borderRadius: 10 }}
              />
              <Title level={2} style={{ margin: 0 }}>تفاصيل الطلب #{orderId}</Title>
              <Tag 
                color={order.status === 'COMPLETED' ? 'green' : order.status === 'CANCELLED' ? 'red' : 'gold'}
                style={{ fontSize: 14, padding: '4px 12px', borderRadius: 8 }}
              >
                {order.status === 'PENDING' ? 'قيد الانتظار' : order.status === 'COMPLETED' ? 'مكتمل' : 'ملغي'}
              </Tag>
            </Space>
            
            <Space>
              {!isEditing ? (
                <Button type="primary" ghost onClick={() => setIsEditing(true)}>تعديل الطلب</Button>
              ) : (
                <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>حفظ التعديلات</Button>
              )}
              <Button icon={<PrinterOutlined />} onClick={() => window.print()}>طباعة الوصل</Button>
            </Space>
          </div>
        </Col>
      </Row>

      {/* Printable Receipt (Premium Invoice Layout) */}
      <div className="print-only" style={{ display: 'none' }}>
        <div style={{ 
          padding: '40px', 
          direction: 'rtl', 
          fontFamily: '"Playpen Sans Arabic", sans-serif',
          color: '#1a1a1a',
          width: '100%'
        }}>
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '50px',
            borderBottom: '4px solid #01caa8',
            paddingBottom: '20px'
          }}>
            <div>
              <h1 style={{ margin: 0, color: '#01caa8', fontSize: '32px', fontWeight: 900 }}>متجر المكملات</h1>
              <p style={{ margin: '5px 0', color: '#666' }}>أفضل المكملات الغذائية في العراق</p>
            </div>
            <div style={{ textAlign: 'left' }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>وصل طلب رقم # {orderId}</h2>
              <p style={{ margin: '5px 0', color: '#666' }}>تاريخ الطلب: {order.createdAt}</p>
            </div>
          </div>
          
          {/* Info Section */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '30px', 
            marginBottom: '40px' 
          }}>
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
              <h3 style={{ margin: '0 0 15px 0', borderBottom: '1px solid #ddd', paddingBottom: '10px', fontSize: '16px' }}>معلومات الزبون</h3>
              <p style={{ margin: '8px 0' }}><strong>الاسم:</strong> {order.customerName}</p>
              <p style={{ margin: '8px 0' }}><strong>الهاتف:</strong> {order.phone}</p>
              <p style={{ margin: '8px 0' }}><strong>العنوان:</strong> {order.address}</p>
            </div>
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
              <h3 style={{ margin: '0 0 15px 0', borderBottom: '1px solid #ddd', paddingBottom: '10px', fontSize: '16px' }}>تفاصيل الشحن</h3>
              <p style={{ margin: '8px 0' }}><strong>طريقة الدفع:</strong> دفع عند الاستلام</p>
              <p style={{ margin: '8px 0' }}><strong>حالة الطلب:</strong> {order.status === 'PENDING' ? 'قيد الانتظار' : 'مؤكد'}</p>
              <p style={{ margin: '8px 0' }}><strong>الوقت المتوقع:</strong> 2-4 أيام عمل</p>
            </div>
          </div>

          {/* Table */}
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            marginBottom: '30px',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <thead>
              <tr style={{ background: '#01caa8', color: 'white' }}>
                <th style={{ textAlign: 'right', padding: '15px' }}>المنتج</th>
                <th style={{ textAlign: 'center', padding: '15px' }}>السعر</th>
                <th style={{ textAlign: 'center', padding: '15px' }}>الكمية</th>
                <th style={{ textAlign: 'left', padding: '15px' }}>المجموع</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #eee', background: index % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ padding: '15px' }}>
                    <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{item.flavor} - {item.size}</div>
                  </td>
                  <td style={{ textAlign: 'center', padding: '15px' }}>{item.price.toLocaleString()} د.ع</td>
                  <td style={{ textAlign: 'center', padding: '15px' }}>{item.quantity}</td>
                  <td style={{ textAlign: 'left', padding: '15px', fontWeight: 'bold' }}>{(item.price * item.quantity).toLocaleString()} د.ع</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '30px' }}>
            <div style={{ width: '300px', background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#666' }}>المجموع الفرعي:</span>
                <span>{subtotal.toLocaleString()} د.ع</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#666' }}>أجور التوصيل:</span>
                <span>{shipping.toLocaleString()} د.ع</span>
              </div>
              <div style={{ borderTop: '2px solid #ddd', marginTop: '15px', paddingTop: '15px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold', fontSize: '18px' }}>الإجمالي الكلي:</span>
                <span style={{ fontWeight: 'bold', fontSize: '20px', color: '#01caa8' }}>{total.toLocaleString()} د.ع</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ 
            marginTop: '80px', 
            textAlign: 'center', 
            borderTop: '1px solid #eee', 
            paddingTop: '30px',
            color: '#999',
            fontSize: '12px'
          }}>
            <p style={{ marginBottom: '5px' }}>شكراً لتسوقكم من متجر المكملات الغذائية</p>
            <p>في حال وجود أي استفسار يرجى التواصل معنا عبر واتساب: 0770XXXXXXX</p>
          </div>
        </div>
      </div>

      <Row gutter={[24, 24]} className="no-print">
        <Col xs={24} lg={16}>
          <Card 
            title="المنتجات" 
            bordered={false} 
            style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
            extra={isEditing && <Button type="dashed" icon={<PlusOutlined />}>إضافة منتج</Button>}
          >
            <Table 
              dataSource={order.items} 
              columns={columns} 
              pagination={false} 
              rowKey="id" 
            />
            
            <div style={{ marginTop: 32, padding: 24, background: '#f8fafc', borderRadius: 16 }}>
              <Row justify="end" gutter={[0, 12]}>
                <Col span={12}><Text type="secondary" style={{ fontSize: 16 }}>المجموع الفرعي:</Text></Col>
                <Col span={8} style={{ textAlign: 'left' }}><Text strong style={{ fontSize: 16 }}>{subtotal.toLocaleString()} د.ع</Text></Col>
                
                <Col span={12}><Text type="secondary" style={{ fontSize: 16 }}>أجور التوصيل:</Text></Col>
                <Col span={8} style={{ textAlign: 'left' }}><Text strong style={{ fontSize: 16 }}>{shipping.toLocaleString()} د.ع</Text></Col>
                
                <Col span={24}><Divider style={{ margin: '12px 0' }} /></Col>
                
                <Col span={12}><Text strong style={{ fontSize: 20 }}>المجموع الكلي:</Text></Col>
                <Col span={8} style={{ textAlign: 'left' }}>
                  <Text strong style={{ fontSize: 24, color: '#01caa8' }}>{total.toLocaleString()} د.ع</Text>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Space direction="vertical" style={{ width: '100%' }} size={24}>
            <Card 
              title="إدارة الحالة" 
              bordered={false} 
              style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
            >
              <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>تحديث حالة الطلب الحالية:</Text>
              <Select 
                style={{ width: '100%' }} 
                size="large" 
                value={order.status}
                onChange={handleStatusChange}
              >
                <Select.Option value="PENDING">قيد الانتظار</Select.Option>
                <Select.Option value="COMPLETED">مكتمل (تم التوصيل)</Select.Option>
                <Select.Option value="CANCELLED">ملغي</Select.Option>
              </Select>
            </Card>

            <Card 
              title="معلومات الزبون" 
              bordered={false} 
              style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
              extra={!isEditing && <Button type="link" onClick={() => setIsEditing(true)}>تعديل</Button>}
            >
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>الاسم الكامل</Text>
                  {isEditing ? (
                    <Input value={order.customerName} onChange={(e) => setOrder({...order, customerName: e.target.value})} />
                  ) : (
                    <Text strong>{order.customerName}</Text>
                  )}
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>رقم الهاتف</Text>
                  {isEditing ? (
                    <Input value={order.phone} onChange={(e) => setOrder({...order, phone: e.target.value})} />
                  ) : (
                    <Text strong>{order.phone}</Text>
                  )}
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>العنوان</Text>
                  {isEditing ? (
                    <Input.TextArea value={order.address} onChange={(e) => setOrder({...order, address: e.target.value})} />
                  ) : (
                    <Text strong>{order.address}</Text>
                  )}
                </div>
                <Divider style={{ margin: '8px 0' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ClockCircleOutlined style={{ color: '#8c8c8c' }} />
                  <Text type="secondary">تاريخ الطلب: {order.createdAt}</Text>
                </div>
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>

      <style jsx global>{`
        @media print {
          /* Reset everything */
          body, html {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            background: #fff !important;
          }
          @page {
            margin: 0;
            size: auto;
          }
          .no-print, 
          .ant-layout-sider, 
          .ant-layout-header, 
          .ant-breadcrumb, 
          .ant-btn, 
          .ant-select, 
          .ant-input-number, 
          .ant-input, 
          .ant-popover,
          .ant-modal-root {
            display: none !important;
          }
          .ant-layout {
            background: #fff !important;
            display: block !important;
          }
          .ant-layout-content {
            margin: 0 !important;
            padding: 0 !important;
            display: block !important;
          }
          .print-only {
            display: block !important;
            width: 100% !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            margin: 0 !important;
            padding: 20px !important;
          }
        }
        .ant-breadcrumb-link {
          font-size: 14px;
        }
        .ant-card-head-title {
          font-weight: 800 !important;
          font-size: 16px !important;
        }
      `}</style>
    </div>
  );
};

export default OrderDetailsPage;
