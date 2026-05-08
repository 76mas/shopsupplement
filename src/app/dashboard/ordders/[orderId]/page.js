'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Table, Button, Space, Tag, Typography, Card, Row, Col,
  Divider, Avatar, Select, Input, InputNumber, message,
  Breadcrumb, Popconfirm, Spin, Modal, Form,
} from 'antd';
import {
  ArrowRightOutlined, SaveOutlined, PrinterOutlined,
  DeleteOutlined, ClockCircleOutlined, PlusOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import {
  getOrderById, updateOrderStatus, updateOrder,
  addOrderItem, removeOrderItem,
} from '../action';
import { getProducts } from '@/app/dashboard/products/action';

const { Title, Text } = Typography;

const OrderDetailsPage = () => {
  const params  = useParams();
  const router  = useRouter();
  const orderId = params.orderId;

  const [order,    setOrder]    = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData,  setEditData]  = useState({ name: '', phoneNumber: '', address: '' });
  const [isMobile,  setIsMobile]  = useState(false);

  // Handle responsiveness
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── Add-item modal ────────────────────────────────────
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [allProducts,  setAllProducts]  = useState([]);
  const [addForm]      = Form.useForm();
  const [addingItem,   setAddingItem]   = useState(false);

  // ── Fetch order ───────────────────────────────────────
  const fetchOrder = useCallback(async () => {
    setLoading(true);
    const res = await getOrderById(orderId);
    if (res.success) {
      setOrder(res.data);
      setEditData({ name: res.data.name, phoneNumber: res.data.phoneNumber, address: res.data.address });
    } else {
      message.error(res.message);
    }
    setLoading(false);
  }, [orderId]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  // ── Load products for the modal ───────────────────────
  const openAddModal = async () => {
    setAddModalOpen(true);
    if (allProducts.length === 0) {
      const res = await getProducts();
      if (res.success) setAllProducts(res.data);
    }
  };

  // ── Computed totals ───────────────────────────────────
  const subtotal = order?.items?.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0) ?? 0;
  const shipping  = Number(order?.totalPrice ?? 0) - subtotal; // يستخدم قيمة DB
  const total     = Number(order?.totalPrice ?? 0);

  // ── Status change ─────────────────────────────────────
  const handleStatusChange = async (value) => {
    const res = await updateOrderStatus(orderId, value);
    if (res.success) {
      setOrder((prev) => ({ ...prev, status: value }));
      message.success(res.message);
    } else {
      message.error(res.message);
    }
  };

  // ── Remove item ───────────────────────────────────────
  const handleRemoveItem = async (itemId) => {
    const res = await removeOrderItem(orderId, itemId);
    if (res.success) {
      message.success(res.message);
      // نعيد جلب الطلب من DB ليتحدث totalPrice + shipping بشكل صحيح
      fetchOrder();
    } else {
      message.error(res.message);
    }
  };

  // ── Add item ──────────────────────────────────────────
  const handleAddItem = async (values) => {
    setAddingItem(true);
    const res = await addOrderItem(orderId, { productId: values.productId, quantity: values.quantity });
    if (res.success) {
      setOrder((prev) => ({ ...prev, items: [...prev.items, res.item] }));
      message.success(res.message);
      setAddModalOpen(false);
      addForm.resetFields();
      // أعد جلب الطلب لتحديث الإجمالي
      fetchOrder();
    } else {
      message.error(res.message);
    }
    setAddingItem(false);
  };

  // ── Save customer info ────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    const res = await updateOrder(orderId, editData);
    if (res.success) {
      setOrder((prev) => ({ ...prev, ...editData }));
      setIsEditing(false);
      message.success(res.message);
    } else {
      message.error(res.message);
    }
    setSaving(false);
  };

  // ── Table columns ─────────────────────────────────────
  const columns = [
    {
      title: 'المنتج',
      key: 'product',
      render: (_, record) => {
        const img  = record.product?.productImages?.[0]?.image;
        const name = record.product?.name ?? '—';
        return (
          <Space>
            <Avatar
              src={img}
              shape="square"
              size={56}
              style={{ borderRadius: 8, background: '#f0f0f0', flexShrink: 0 }}
            />
            <div>
              <Text strong>{name}</Text>
            </div>
          </Space>
        );
      },
    },
    {
      title: 'السعر',
      dataIndex: 'price',
      key: 'price',
      render: (p) => <Text>{Number(p).toLocaleString()} د.ع</Text>,
    },
    {
      title: 'الكمية',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (q, record) => (
        <InputNumber
          min={1}
          value={q}
          disabled={!isEditing}
          onChange={(val) =>
            setOrder((prev) => ({
              ...prev,
              items: prev.items.map((item) => item.id === record.id ? { ...item, quantity: val } : item),
            }))
          }
          style={{ width: 70 }}
        />
      ),
    },
    {
      title: 'المجموع',
      key: 'total',
      render: (_, record) => (
        <Text strong>{(Number(record.price) * record.quantity).toLocaleString()} د.ع</Text>
      ),
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title="هل أنت متأكد من حذف هذا المنتج؟"
          onConfirm={() => handleRemoveItem(record.id)}
          okText="نعم" cancelText="لا"
        >
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;
  if (!order)  return <div style={{ textAlign: 'center', padding: 80 }}>الطلب غير موجود</div>;

  return (
    <div style={{ direction: 'rtl', paddingBottom: 50 }}>

      {/* ── Header ──────────────────────────────────── */}
      {/* ── Header ──────────────────────────────────── */}
      <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 24 }} className="no-print">
        <Col span={24}>
          <Breadcrumb
            items={[
              { title: <Link href="/dashboard">لوحة التحكم</Link> },
              { title: <Link href="/dashboard/ordders">الطلبات</Link> },
              { title: `طلب #${orderId}` },
            ]}
            style={{ marginBottom: 16 }}
          />
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: 16 }}>
            <Space size={16} wrap>
              <Button icon={<ArrowRightOutlined />} onClick={() => router.back()} style={{ borderRadius: 10 }} />
              <Title level={isMobile ? 3 : 2} style={{ margin: 0 }}>تفاصيل الطلب #{orderId}</Title>
              <Tag
                color={order.status === 'COMPLETED' ? 'green' : order.status === 'CANCELLED' ? 'red' : 'gold'}
                style={{ fontSize: 14, padding: '4px 12px', borderRadius: 8 }}
              >
                {order.status === 'PENDING' ? 'قيد الانتظار' : order.status === 'COMPLETED' ? 'مكتمل' : 'ملغي'}
              </Tag>
            </Space>
            <Space wrap style={{ width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'flex-start' : 'flex-end' }}>
              {!isEditing ? (
                <Button type="primary" ghost onClick={() => setIsEditing(true)}>تعديل الطلب</Button>
              ) : (
                <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={handleSave}>حفظ التعديلات</Button>
              )}
              <Button icon={<PrinterOutlined />} onClick={() => window.print()}>طباعة الوصل</Button>
            </Space>
          </div>
        </Col>
      </Row>

      {/* ── Printable Receipt ───────────────────────── */}
      <div className="print-only" style={{ display: 'none' }}>
        <div style={{ padding: '40px', direction: 'rtl', fontFamily: 'sans-serif', color: '#1a1a1a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '3px solid #000', paddingBottom: '20px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 900 }}>متجر المكملات</h1>
              <p style={{ margin: '4px 0', color: '#666' }}>أفضل المكملات الغذائية في العراق</p>
            </div>
            <div style={{ textAlign: 'left' }}>
              <h2 style={{ margin: 0 }}>وصل طلب رقم #{orderId}</h2>
              <p style={{ margin: '4px 0', color: '#666' }}>
                {new Date(order.createdAt).toLocaleDateString('ar-IQ', { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
            <div style={{ background: '#f8f8f8', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 12px 0', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>معلومات الزبون</h3>
              <p style={{ margin: '6px 0' }}><strong>الاسم:</strong> {order.name}</p>
              <p style={{ margin: '6px 0' }}><strong>الهاتف:</strong> {order.phoneNumber}</p>
              <p style={{ margin: '6px 0' }}><strong>العنوان:</strong> {order.address}</p>
            </div>
            <div style={{ background: '#f8f8f8', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 12px 0', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>تفاصيل الشحن</h3>
              <p style={{ margin: '6px 0' }}><strong>طريقة الدفع:</strong> دفع عند الاستلام</p>
              <p style={{ margin: '6px 0' }}><strong>الحالة:</strong> {order.status === 'PENDING' ? 'قيد الانتظار' : order.status === 'COMPLETED' ? 'مكتمل' : 'ملغي'}</p>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
            <thead>
              <tr style={{ background: '#000', color: '#fff' }}>
                <th style={{ textAlign: 'right', padding: '12px' }}>المنتج</th>
                <th style={{ textAlign: 'center', padding: '12px' }}>السعر</th>
                <th style={{ textAlign: 'center', padding: '12px' }}>الكمية</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>المجموع</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #eee', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ padding: '12px' }}>{item.product?.name ?? '—'}</td>
                  <td style={{ textAlign: 'center', padding: '12px' }}>{Number(item.price).toLocaleString()} د.ع</td>
                  <td style={{ textAlign: 'center', padding: '12px' }}>{item.quantity}</td>
                  <td style={{ textAlign: 'left', padding: '12px', fontWeight: 'bold' }}>{(Number(item.price) * item.quantity).toLocaleString()} د.ع</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ width: '260px', background: '#f8f8f8', padding: '16px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#666' }}>المجموع الفرعي:</span>
                <span>{subtotal.toLocaleString()} د.ع</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#666' }}>التوصيل:</span>
                <span>{shipping > 0 ? shipping.toLocaleString() : '—'} {shipping > 0 ? 'د.ع' : ''}</span>
              </div>
              <div style={{ borderTop: '2px solid #ddd', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>الإجمالي:</span>
                <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{total.toLocaleString()} د.ع</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '60px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '24px', color: '#999', fontSize: '12px' }}>
            <p>شكراً لتسوقكم من متجر المكملات الغذائية</p>
          </div>
        </div>
      </div>

      {/* ── Main Content ────────────────────────────── */}
      <Row gutter={[24, 24]} className="no-print">
        {/* Items Table */}
        <Col xs={24} lg={16}>
          <Card
            title="المنتجات"
            bordered={false}
            style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
            extra={
              <Button type="dashed" icon={<PlusOutlined />} onClick={openAddModal}>
                إضافة منتج
              </Button>
            }
          >
            {isMobile ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {order.items.map((item) => {
                   const img = item.product?.productImages?.[0]?.image;
                   return (
                     <div key={item.id} style={{ 
                       padding: 16, 
                       background: '#f8fafc', 
                       borderRadius: 12,
                       display: 'flex',
                       gap: 12,
                       position: 'relative'
                     }}>
                        <Avatar
                          src={img}
                          shape="square"
                          size={64}
                          style={{ borderRadius: 8, background: '#fff', flexShrink: 0 }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                           <Text strong style={{ display: 'block', fontSize: 14 }}>{item.product?.name ?? '—'}</Text>
                           <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <Text type="secondary" style={{ fontSize: 12 }}>الكمية: </Text>
                                <InputNumber
                                  min={1}
                                  value={item.quantity}
                                  disabled={!isEditing}
                                  onChange={(val) =>
                                    setOrder((prev) => ({
                                      ...prev,
                                      items: prev.items.map((it) => it.id === item.id ? { ...it, quantity: val } : it),
                                    }))
                                  }
                                  size="small"
                                  style={{ width: 60 }}
                                />
                              </div>
                              <Text strong style={{ fontSize: 14 }}>{(Number(item.price) * item.quantity).toLocaleString()} د.ع</Text>
                           </div>
                        </div>
                        <Popconfirm
                          title="حذف المنتج؟"
                          onConfirm={() => handleRemoveItem(item.id)}
                          okText="نعم" cancelText="لا"
                        >
                          <Button 
                            type="text" 
                            danger 
                            icon={<DeleteOutlined />} 
                            style={{ position: 'absolute', top: 8, left: 8 }}
                          />
                        </Popconfirm>
                     </div>
                   );
                })}
                {order.items.length === 0 && <Text type="secondary" style={{ textAlign: 'center', padding: 20 }}>لا توجد منتجات</Text>}
              </div>
            ) : (
              <Table
                dataSource={order.items}
                columns={columns}
                pagination={false}
                rowKey="id"
                locale={{ emptyText: 'لا توجد منتجات في هذا الطلب' }}
              />
            )}

            <div style={{ marginTop: 32, padding: 24, background: '#f8fafc', borderRadius: 16 }}>
              <Row justify="end" gutter={[0, 12]}>
                <Col span={12}><Text type="secondary" style={{ fontSize: 16 }}>المجموع الفرعي:</Text></Col>
                <Col span={8} style={{ textAlign: 'left' }}><Text strong style={{ fontSize: 16 }}>{subtotal.toLocaleString()} د.ع</Text></Col>
                <Col span={12}><Text type="secondary" style={{ fontSize: 16 }}>أجور التوصيل:</Text></Col>
                <Col span={8} style={{ textAlign: 'left' }}><Text strong style={{ fontSize: 16 }}>{shipping > 0 ? shipping.toLocaleString() : '—'} {shipping > 0 ? 'د.ع' : ''}</Text></Col>
                <Col span={24}><Divider style={{ margin: '12px 0' }} /></Col>
                <Col span={12}><Text strong style={{ fontSize: 20 }}>المجموع الكلي:</Text></Col>
                <Col span={8} style={{ textAlign: 'left' }}>
                  <Text strong style={{ fontSize: 24, color: '#01caa8' }}>{total.toLocaleString()} د.ع</Text>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={8}>
          <Space direction="vertical" style={{ width: '100%' }} size={24}>
            {/* Status */}
            <Card title="إدارة الحالة" bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>تحديث حالة الطلب الحالية:</Text>
              <Select style={{ width: '100%' }} size="large" value={order.status} onChange={handleStatusChange}>
                <Select.Option value="PENDING">قيد الانتظار</Select.Option>
                <Select.Option value="COMPLETED">مكتمل (تم التوصيل)</Select.Option>
                <Select.Option value="CANCELLED">ملغي</Select.Option>
              </Select>
            </Card>

            {/* Customer Info */}
            <Card
              title="معلومات الزبون"
              bordered={false}
              style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
              extra={!isEditing && <Button type="link" onClick={() => setIsEditing(true)}>تعديل</Button>}
            >
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>الاسم الكامل</Text>
                  {isEditing ? (
                    <Input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                  ) : (
                    <Text strong>{order.name}</Text>
                  )}
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>رقم الهاتف</Text>
                  {isEditing ? (
                    <Input value={editData.phoneNumber} onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })} />
                  ) : (
                    <Text strong>{order.phoneNumber}</Text>
                  )}
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>العنوان</Text>
                  {isEditing ? (
                    <Input.TextArea value={editData.address} onChange={(e) => setEditData({ ...editData, address: e.target.value })} />
                  ) : (
                    <Text strong>{order.address}</Text>
                  )}
                </div>
                <Divider style={{ margin: '8px 0' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ClockCircleOutlined style={{ color: '#8c8c8c' }} />
                  <Text type="secondary">
                    {new Date(order.createdAt).toLocaleDateString('ar-IQ', {
                      year: 'numeric', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </Text>
                </div>
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>

      {/* ── Add Product Modal ────────────────────────── */}
      <Modal
        title="إضافة منتج للطلب"
        open={addModalOpen}
        onCancel={() => { setAddModalOpen(false); addForm.resetFields(); }}
        footer={null}
        style={{ direction: 'rtl' }}
        destroyOnClose
      >
        <Form form={addForm} layout="vertical" onFinish={handleAddItem} style={{ marginTop: 16 }}>
          <Form.Item
            name="productId"
            label="اختر المنتج"
            rules={[{ required: true, message: 'يرجى اختيار منتج' }]}
          >
            <Select
              showSearch
              placeholder="ابحث عن منتج..."
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={allProducts.map((p) => ({
                value: p.id,
                label: p.name,
              }))}
              optionRender={(option) => {
                const p = allProducts.find((x) => x.id === option.value);
                const img = p?.productImages?.[0]?.image;
                return (
                  <Space>
                    {img && <Avatar src={img} shape="square" size={32} style={{ borderRadius: 4 }} />}
                    <div>
                      <div style={{ fontWeight: 600 }}>{option.label}</div>
                      <div style={{ fontSize: 11, color: '#888' }}>{Number(p?.endPrice ?? 0).toLocaleString()} د.ع</div>
                    </div>
                  </Space>
                );
              }}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="quantity"
            label="الكمية"
            initialValue={1}
            rules={[{ required: true, message: 'يرجى إدخال الكمية' }]}
          >
            <InputNumber min={1} max={999} style={{ width: '100%' }} size="large" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => { setAddModalOpen(false); addForm.resetFields(); }}>إلغاء</Button>
              <Button type="primary" htmlType="submit" loading={addingItem} icon={<PlusOutlined />}>
                إضافة للطلب
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* ── Print CSS ────────────────────────────────── */}
      <style jsx global>{`
        @media print {
          body, html { margin: 0 !important; padding: 0 !important; background: #fff !important; }
          @page { margin: 0; size: auto; }
          .no-print, .ant-layout-sider, .ant-layout-header,
          .ant-btn, .ant-select, .ant-input-number, .ant-input,
          .ant-popover, .ant-modal-root { display: none !important; }
          .ant-layout { background: #fff !important; display: block !important; }
          .ant-layout-content { margin: 0 !important; padding: 0 !important; display: block !important; }
          .print-only {
            display: block !important;
            width: 100% !important;
            position: absolute !important;
            top: 0 !important; left: 0 !important; right: 0 !important;
            margin: 0 !important; padding: 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderDetailsPage;
