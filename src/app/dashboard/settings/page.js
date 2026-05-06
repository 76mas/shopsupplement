'use client';
import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Tabs,
  Space,
  InputNumber,
  Upload,
  message,
  Switch,
  Divider,
} from 'antd';
import {
  ShopOutlined,
  GlobalOutlined,
  ShareAltOutlined,
  LockOutlined,
  UploadOutlined,
  SaveOutlined,
  WhatsAppOutlined,
  InstagramOutlined,
  FacebookOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const SettingsPage = () => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('1');

  const onFinish = (values) => {
    console.log('Settings Saved:', values);
    message.success('تم حفظ الإعدادات بنجاح');
  };

  const items = [
    {
      key: '1',
      label: <Space><ShopOutlined />معلومات المتجر</Space>,
      children: (
        <Card bordered={false}>
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item label="اسم المتجر" name="storeName" initialValue="متجر المكملات">
                <Input size="large" />
              </Form.Item>
              <Form.Item label="وصف المتجر (SEO)" name="storeDescription" initialValue="أفضل المتجر للمكملات الغذائية في العراق">
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="شعار المتجر">
                <Upload listType="picture-card" maxCount={1}>
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>تغيير الشعار</div>
                  </div>
                </Upload>
              </Form.Item>
              <Form.Item label="رقم هاتف المتجر الرسمي" name="storePhone" initialValue="0770XXXXXXX">
                <Input size="large" />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      ),
    },
    {
      key: '2',
      label: <Space><GlobalOutlined />الشحن والطلبات</Space>,
      children: (
        <Card bordered={false}>
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item label="سعر التوصيل الافتراضي" name="shippingFee" initialValue={5000}>
                <InputNumber 
                  style={{ width: '100%' }} 
                  size="large" 
                  addonAfter="د.ع"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
              <Form.Item label="توصيل مجاني للطلبات فوق" name="freeShippingThreshold" initialValue={100000}>
                <InputNumber 
                  style={{ width: '100%' }} 
                  size="large" 
                  addonAfter="د.ع"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="تفعيل استقبال الطلبات حالياً" name="orderEnabled" valuePropName="checked" initialValue={true}>
                <Switch checkedChildren="مفتوح" unCheckedChildren="مغلق" />
              </Form.Item>
              <Text type="secondary">عند الإغلاق، لن يتمكن الزبائن من إتمام عملية الشراء في المتجر.</Text>
            </Col>
          </Row>
        </Card>
      ),
    },
    {
      key: '3',
      label: <Space><ShareAltOutlined />التواصل الاجتماعي</Space>,
      children: (
        <Card bordered={false}>
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item label="رابط واتساب" name="whatsapp" initialValue="https://wa.me/9647700000000">
                <Input prefix={<WhatsAppOutlined style={{ color: '#25D366' }} />} size="large" />
              </Form.Item>
              <Form.Item label="رابط انستغرام" name="instagram" initialValue="https://instagram.com/store">
                <Input prefix={<InstagramOutlined style={{ color: '#E1306C' }} />} size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="رابط فيسبوك" name="facebook" initialValue="https://facebook.com/store">
                <Input prefix={<FacebookOutlined style={{ color: '#1877F2' }} />} size="large" />
              </Form.Item>
              <Form.Item label="رابط تيك توك" name="tiktok">
                <Input placeholder="https://tiktok.com/@store" size="large" />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      ),
    },
    {
      key: '4',
      label: <Space><LockOutlined />الحماية والأمان</Space>,
      children: (
        <Card bordered={false}>
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Title level={5}>تغيير كلمة المرور الخاصة بك</Title>
              <Form.Item label="كلمة المرور الحالية" name="currentPassword">
                <Input.Password size="large" />
              </Form.Item>
              <Form.Item label="كلمة المرور الجديدة" name="newPassword">
                <Input.Password size="large" />
              </Form.Item>
              <Form.Item label="تأكيد كلمة المرور الجديدة" name="confirmPassword">
                <Input.Password size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Title level={5}>جلسات النشاط</Title>
              <Text type="secondary">أنت مسجل الدخول حالياً من جهاز Windows - بغداد، العراق.</Text>
              <Divider />
              <Button danger block>تسجيل الخروج من كافة الأجهزة</Button>
            </Col>
          </Row>
        </Card>
      ),
    },
  ];

  return (
    <div style={{ direction: 'rtl' }}>
      <Row gutter={[24, 24]} align="middle" style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Title level={2} style={{ margin: 0 }}>الإعدادات</Title>
          <Text type="secondary">تخصيص معلومات المتجر، الشحن، وروابط التواصل</Text>
        </Col>
        <Col span={12} style={{ textAlign: 'left' }}>
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            size="large" 
            onClick={() => form.submit()}
            style={{ borderRadius: 10, height: 45, padding: '0 24px' }}
          >
            حفظ كافة التعديلات
          </Button>
        </Col>
      </Row>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
      >
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab} 
          items={items} 
          type="card"
          className="settings-tabs"
        />
      </Form>

      <style jsx global>{`
        .settings-tabs .ant-tabs-nav::before {
          border-bottom: none !important;
        }
        .settings-tabs .ant-tabs-tab {
          border-radius: 12px 12px 0 0 !important;
          border: 1px solid #f0f0f0 !important;
          background: #fafafa !important;
          margin-left: 8px !important;
          transition: all 0.3s !important;
        }
        .settings-tabs .ant-tabs-tab-active {
          background: #fff !important;
          border-bottom: 2px solid #01caa8 !important;
        }
        .settings-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #01caa8 !important;
        }
        .ant-form-item-label label {
          font-weight: 600 !important;
          color: #595959 !important;
        }
      `}</style>
    </div>
  );
};

export default SettingsPage;
