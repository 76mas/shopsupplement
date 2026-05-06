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
  Avatar,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UserOutlined,
  PhoneOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const AdminsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  
  // Mock Data for Admins
  const [data, setData] = useState([
    {
      key: '1',
      name: 'احمد',
      id: 1,
      phoneNumber: '07701234567',
      createdAt: '2024-05-01',
    },
    {
      key: '2',
      name: 'ياسين',
      id: 2,
      phoneNumber: '07812345678',
      createdAt: '2024-05-05',
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
    console.log('Admin Values:', values);
    message.success('تمت إضافة المدير بنجاح (بيانات وهمية)');
    setIsModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'الاسم',
      dataIndex: 'name',
      key: 'name',
        render: (text) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#e6fffb', color: '#01caa8' }} />
          <div>
            <Text strong>{text}</Text>
            <br />
            {/* <Text type="secondary" style={{ fontSize: 12 }}>رتبة: مدير نظام</Text> */}
          </div>
        </Space>)
    },
    {
      title: 'المدير',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (text) => (
        <Space>
          <div>
            <Text strong>{text}</Text>
            <br />
            {/* <Text type="secondary" style={{ fontSize: 12 }}>رتبة: مدير نظام</Text> */}
          </div>
        </Space>
      ),
    },
    {
      title: 'تاريخ الإضافة',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => <Text type="secondary">{date}</Text>,
    },
    {
      title: 'الحالة',
      key: 'status',
      render: () => <Tag color="green">نشط</Tag>,
    },
    {
      title: 'الإجراءات',
      key: 'action',
      render: () => (
        <Space>
          <Tooltip title="تعديل">
            <Button type="text" icon={<EditOutlined style={{ color: '#1677ff' }} />} />
          </Tooltip>
          <Tooltip title="تغيير كلمة المرور">
            <Button type="text" icon={<LockOutlined style={{ color: '#faad14' }} />} />
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
          <Title level={2} style={{ margin: 0 }}>المدراء</Title>
          <Text type="secondary">إدارة حسابات المسؤولين عن لوحة التحكم</Text>
        </Col>
        <Col span={12} style={{ textAlign: 'left' }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large" 
            onClick={showModal}
            style={{ borderRadius: 10, height: 45, padding: '0 24px' }}
          >
            إضافة مدير جديد
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

      {/* Add Admin Modal */}
      <Modal
        title={<Title level={4}>إضافة مدير جديد</Title>}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText="حفظ الحساب"
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
            name="phoneNumber"
            label="رقم الهاتف"
            rules={[
              { required: true, message: 'يرجى إدخال رقم الهاتف' },
              { pattern: /^[0-9]{11}$/, message: 'يرجى إدخال رقم هاتف عراقي صحيح (11 رقم)' }
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="077XXXXXXXX" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label="كلمة المرور"
            rules={[{ required: true, message: 'يرجى إدخال كلمة المرور' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="كلمة المرور" size="large" />
          </Form.Item>
          
          <div style={{ background: '#fff7e6', padding: '12px', borderRadius: '8px', border: '1px solid #ffe58f' }}>
            <Text type="warning" style={{ fontSize: 12 }}>
              * ملاحظة: سيتمكن صاحب هذا الرقم من الدخول إلى لوحة التحكم بالكامل وتعديل كافة البيانات.
            </Text>
          </div>
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

export default AdminsPage;
