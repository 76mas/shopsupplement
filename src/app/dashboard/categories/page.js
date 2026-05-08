'use client';
import React, { useState, useEffect, useTransition } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Typography,
  Card,
  Row,
  Col,
  message,
  Tooltip,
  Tag,
  Popconfirm,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from './action';

const { Title, Text } = Typography;

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // null = add mode
  const [isPending, startTransition] = useTransition();
  const [form] = Form.useForm();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ─── جلب البيانات ───────────────────────────────────────
  const fetchCategories = async () => {
    setLoading(true);
    const res = await getCategories();
    if (res.success) {
      setCategories(
        res.data.map((c) => ({
          key: c.id,
          id: c.id,
          name: c.name,
          productCount: c._count?.products ?? 0,
          createdAt: new Date(c.createdAt).toLocaleDateString('ar-IQ'),
        }))
      );
    } else {
      message.error(res.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ─── فتح المودال ─────────────────────────────────────────
  const openAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditingCategory(record);
    form.setFieldsValue({ name: record.name });
    setModalOpen(true);
  };

  const handleCancel = () => {
    setModalOpen(false);
    form.resetFields();
    setEditingCategory(null);
  };

  // ─── حفظ (إضافة أو تعديل) ────────────────────────────────
  const onFinish = (values) => {
    startTransition(async () => {
      let res;
      if (editingCategory) {
        res = await updateCategory(editingCategory.id, values);
      } else {
        res = await createCategory(values);
      }

      if (res.success) {
        message.success(res.message);
        setModalOpen(false);
        form.resetFields();
        setEditingCategory(null);
        fetchCategories();
      } else {
        message.error(res.message);
      }
    });
  };

  // ─── حذف ─────────────────────────────────────────────────
  const handleDelete = (id) => {
    startTransition(async () => {
      const res = await deleteCategory(id);
      if (res.success) {
        message.success(res.message);
        fetchCategories();
      } else {
        message.error(res.message);
      }
    });
  };

  // ─── أعمدة الجدول ────────────────────────────────────────
  const columns = [
    {
      title: 'اسم الفئة',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: '#e6fffb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AppstoreOutlined style={{ color: '#01caa8' }} />
          </div>
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'عدد المنتجات',
      dataIndex: 'productCount',
      key: 'productCount',
      render: (count) => (
        <Tag color="cyan" style={{ borderRadius: 6, padding: '0 12px' }}>
          {count} منتج
        </Tag>
      ),
    },
    {
      title: 'تاريخ الإنشاء',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => <Text type="secondary">{date}</Text>,
    },
    {
      title: 'الإجراءات',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="تعديل">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: '#1677ff' }} />}
              onClick={() => openEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="حذف الفئة"
            description={`هل أنت متأكد من حذف فئة "${record.name}"؟`}
            onConfirm={() => handleDelete(record.id)}
            okText="نعم، احذف"
            cancelText="إلغاء"
            okButtonProps={{ danger: true }}
            placement="topLeft"
          >
            <Tooltip title="حذف">
              <Button
                type="text"
                icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                loading={isPending}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ direction: 'rtl' }}>
      {/* Header */}
      <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12}>
          <Title level={2} style={{ margin: 0, fontSize: '1.5rem' }}>
            الفئات
          </Title>
          <Text type="secondary">إدارة فئات المنتجات وتنظيمها</Text>
        </Col>
        <Col xs={24} sm={12} style={{ textAlign: 'left' }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={openAdd}
            style={{ borderRadius: 10, height: 45, padding: '0 24px', width: 'auto' }}
            block={false}
          >
            إضافة فئة جديدة
          </Button>
        </Col>
      </Row>

      {/* Categories List */}
      <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />}>
        {isMobile ? (
          <Row gutter={[16, 16]}>
            {categories.map((c) => (
              <Col xs={24} key={c.id}>
                <Card 
                  variant="borderless" 
                  style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                  bodyStyle={{ padding: '16px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space size={12}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: '#e6fffb', display: 'flex',
                        alignItems: 'center', justifyContent: 'center'
                      }}>
                        <AppstoreOutlined style={{ color: '#01caa8', fontSize: 20 }} />
                      </div>
                      <div>
                        <Text strong style={{ fontSize: 16, display: 'block' }}>{c.name}</Text>
                        <Tag color="cyan" style={{ marginTop: 4, borderRadius: 4 }}>{c.productCount} منتج</Tag>
                      </div>
                    </Space>
                    
                    <Space>
                      <Button 
                        type="text" 
                        icon={<EditOutlined style={{ color: '#1677ff' }} />} 
                        onClick={() => openEdit(c)}
                        style={{ background: '#f0f7ff', borderRadius: 8 }}
                      />
                      <Popconfirm
                        title="حذف الفئة"
                        onConfirm={() => handleDelete(c.id)}
                        okText="حذف" cancelText="إلغاء"
                        okButtonProps={{ danger: true }}
                      >
                        <Button 
                          type="text" 
                          icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />} 
                          style={{ background: '#fff1f0', borderRadius: 8 }}
                        />
                      </Popconfirm>
                    </Space>
                  </div>
                </Card>
              </Col>
            ))}
            {categories.length === 0 && (
              <Col span={24}>
                <Card variant="borderless" style={{ textAlign: 'center', padding: 40, borderRadius: 16 }}>
                  <Text type="secondary">لا توجد فئات حالياً</Text>
                </Card>
              </Col>
            )}
          </Row>
        ) : (
          <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <Table
              columns={columns}
              dataSource={categories}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        )}
      </Spin>

      {/* Add / Edit Modal */}
      <Modal
        title={
          <Title level={4} style={{ margin: 0 }}>
            {editingCategory ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
          </Title>
        }
        open={modalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText={editingCategory ? 'حفظ التعديلات' : 'حفظ الفئة'}
        cancelText="إلغاء"
        centered
        confirmLoading={isPending}
        okButtonProps={{ style: { borderRadius: 8, height: 40 } }}
        cancelButtonProps={{ style: { borderRadius: 8, height: 40 } }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            name="name"
            label="اسم الفئة"
            rules={[{ required: true, message: 'يرجى إدخال اسم الفئة' }]}
          >
            <Input
              placeholder="مثال: بروتينات، فيتامينات..."
              size="large"
            />
          </Form.Item>

          <Text type="secondary" style={{ fontSize: 12 }}>
            * سيتم استخدام اسم الفئة لتصنيف المنتجات في المتجر وتسهيل عملية
            البحث للزبائن.
          </Text>
        </Form>
      </Modal>

      <style jsx global>{`
        .ant-modal-title {
          direction: rtl;
        }
        .ant-form-item-label {
          padding-bottom: 4px !important;
        }
        .ant-form-item-label label {
          font-weight: 600 !important;
          font-size: 13px !important;
        }
      `}</style>
    </div>
  );
};

export default CategoriesPage;
