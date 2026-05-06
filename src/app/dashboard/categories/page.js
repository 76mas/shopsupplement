'use client';
import React, { useState } from 'react';
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
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const CategoriesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  
  // Mock Data for Categories
  const [data, setData] = useState([
    {
      key: '1',
      id: 1,
      name: 'بروتينات',
      productCount: 24,
      createdAt: '2024-05-01',
    },
    {
      key: '2',
      id: 2,
      name: 'أحماض أمينية',
      productCount: 15,
      createdAt: '2024-05-02',
    },
    {
      key: '3',
      id: 3,
      name: 'فيتامينات',
      productCount: 8,
      createdAt: '2024-05-03',
    },
    {
      key: '4',
      id: 4,
      name: 'حوارق دهون',
      productCount: 12,
      createdAt: '2024-05-04',
    },
  ]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinish = (values) => {
    console.log('Category Values:', values);
    message.success('تمت إضافة الفئة بنجاح (بيانات وهمية)');
    setIsModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'اسم الفئة',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <div style={{ 
            width: 32, 
            height: 32, 
            borderRadius: 8, 
            background: '#e6fffb', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
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
      render: () => (
        <Space>
          <Tooltip title="تعديل">
            <Button type="text" icon={<EditOutlined style={{ color: '#1677ff' }} />} />
          </Tooltip>
          <Tooltip title="حذف">
            <Button type="text" icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ direction: 'rtl' }}>
      <Row gutter={[24, 24]} align="middle" style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Title level={2} style={{ margin: 0 }}>الفئات</Title>
          <Text type="secondary">إدارة فئات المنتجات وتنظيمها</Text>
        </Col>
        <Col span={12} style={{ textAlign: 'left' }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large" 
            onClick={showModal}
            style={{ borderRadius: 10, height: 45, padding: '0 24px' }}
          >
            إضافة فئة جديدة
          </Button>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <Table 
          columns={columns} 
          dataSource={data} 
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Add Category Modal */}
      <Modal
        title={<Title level={4}>إضافة فئة جديدة</Title>}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText="حفظ الفئة"
        cancelText="إلغاء"
        centered
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
            <Input placeholder="مثال: بروتينات، فيتامينات..." size="large" />
          </Form.Item>
          
          <Text type="secondary" style={{ fontSize: 12 }}>
            * سيتم استخدام اسم الفئة لتصنيف المنتجات في المتجر وتسهيل عملية البحث للزبائن.
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
