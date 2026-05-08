'use client';
import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Space, message, ConfigProvider } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from './action';

const { Title, Text } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values) => {
    setLoading(true);
    
    const formData = new FormData();
    formData.append('phoneNumber', values.phoneNumber);
    formData.append('password', values.password);

    try {
      const res = await loginAdmin(null, formData);
      if (res.success) {
        message.success(res.message);
        router.push('/dashboard');
        router.refresh();
      } else {
        message.error(res.message);
        setLoading(false);
      }
    } catch (err) {
      message.error('حدث خطأ غير متوقع');
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
      position: 'relative',
      overflow: 'hidden',
      direction: 'rtl'
    }}>
      {/* Background Decorative Elements */}
      <div style={{ 
        position: 'absolute', 
        width: '600px', 
        height: '600px', 
        borderRadius: '50%', 
        background: 'rgba(1, 202, 168, 0.05)', 
        top: '-200px', 
        right: '-200px',
        zIndex: 0
      }} />
      <div style={{ 
        position: 'absolute', 
        width: '400px', 
        height: '400px', 
        borderRadius: '50%', 
        background: 'rgba(1, 202, 168, 0.03)', 
        bottom: '-100px', 
        left: '-100px',
        zIndex: 0
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ zIndex: 1, width: '100%', maxWidth: '420px', padding: '0 20px' }}
      >
        <Card
          variant="borderless"
          style={{ 
            borderRadius: '24px', 
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              background: '#01caa8', 
              borderRadius: '16px', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '16px',
              boxShadow: '0 10px 15px -3px rgba(1, 202, 168, 0.3)'
            }}>
              <SafetyCertificateOutlined style={{ fontSize: '32px', color: '#fff' }} />
            </div>
            <Title level={2} style={{ margin: 0, fontWeight: 900, color: '#111827' }}>لوحة التحكم</Title>
            <Text type="secondary">يرجى تسجيل الدخول للمتابعة</Text>
          </div>

          <Form
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            requiredMark={false}
          >
            <Form.Item
              name="phoneNumber"
              label={<Text strong>رقم الهاتف</Text>}
              rules={[{ required: true, message: 'يرجى إدخال رقم الهاتف' }]}
            >
              <Input 
                prefix={<UserOutlined style={{ color: '#9ca3af' }} />} 
                placeholder="077XXXXXXXX" 
                size="large"
                style={{ borderRadius: '12px', height: '48px' }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<Text strong>كلمة المرور</Text>}
              rules={[{ required: true, message: 'يرجى إدخال كلمة المرور' }]}
              style={{ marginBottom: '8px' }}
            >
              <Input.Password 
                prefix={<LockOutlined style={{ color: '#9ca3af' }} />} 
                placeholder="••••••••" 
                size="large"
                style={{ borderRadius: '12px', height: '48px' }}
              />
            </Form.Item>

            <div style={{ textAlign: 'left', marginBottom: '24px' }}>
              <Button type="link" style={{ padding: 0, color: '#01caa8' }}>نسيت كلمة المرور؟</Button>
            </div>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large" 
                block 
                loading={loading}
                style={{ 
                  height: '52px', 
                  borderRadius: '14px', 
                  fontSize: '16px', 
                  fontWeight: 'bold',
                  boxShadow: '0 4px 14px 0 rgba(1, 202, 168, 0.39)',
                  background: '#01caa8',
                  border: 'none'
                }}
              >
                تسجيل الدخول
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{ margin: '24px 0' }}>أو</Divider>

          <Button 
            icon={<ArrowLeftOutlined />} 
            block 
            type="text" 
            onClick={() => router.push('/')}
            style={{ color: '#6b7280' }}
          >
            العودة للمتجر
          </Button>
        </Card>
        
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Text type="secondary" style={{ fontSize: '13px' }}>
            جميع الحقوق محفوظة © {new Date().getFullYear()} متجر المكملات
          </Text>
        </div>
      </motion.div>

      <style jsx global>{`
        .ant-form-item-label label {
          font-size: 14px !important;
          color: #374151 !important;
        }
        .ant-input:focus, .ant-input-focused {
          border-color: #01caa8 !important;
          box-shadow: 0 0 0 2px rgba(1, 202, 168, 0.1) !important;
        }
        .ant-btn-primary:hover {
          background: #00b395 !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(1, 202, 168, 0.23) !important;
        }
        .ant-btn:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

// Simple Divider since I don't want to import more components
const Divider = ({ children, style }) => (
  <div style={{ display: 'flex', alignItems: 'center', ...style }}>
    <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
    <span style={{ padding: '0 16px', color: '#9ca3af', fontSize: '14px' }}>{children}</span>
    <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
  </div>
);

export default LoginPage;
