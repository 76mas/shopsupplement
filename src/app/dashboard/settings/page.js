'use client';
import React, { useState, useEffect, useCallback } from 'react';
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
  message,
  Switch,
  Divider,
  Spin,
} from 'antd';
import {
  ShopOutlined,
  GlobalOutlined,
  ShareAltOutlined,
  LockOutlined,
  SaveOutlined,
  WhatsAppOutlined,
  InstagramOutlined,
  FacebookOutlined,
} from '@ant-design/icons';
import { getShopInfo, updateShopInfo, changeMyPassword } from './action';

const { Title, Text } = Typography;

const SettingsPage = () => {
  const [shopForm] = Form.useForm();
  const [shippingForm] = Form.useForm();
  const [socialForm] = Form.useForm();
  const [pwForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState('1');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  // ── Fetch shop info ──────────────────────────
  const fetchShopInfo = useCallback(async () => {
    setLoading(true);
    const res = await getShopInfo();
    if (res.success && res.data) {
      const d = res.data;
      const links = Array.isArray(d.soicalLinks) ? d.soicalLinks : [];
      shopForm.setFieldsValue({
        storeName: d.name || '',
        storeDescription: d.description || '',
        storePhone: d.phoneNumbers || '',
      });
      shippingForm.setFieldsValue({
        shippingFee: Number(d.deliveryPrice) || 5000,
        orderEnabled: d.acceptOrders ?? true,
      });
      socialForm.setFieldsValue({
        whatsapp: links[0] || '',
        instagram: links[1] || '',
        facebook: links[2] || '',
        tiktok: links[3] || '',
      });
    }
    setLoading(false);
  }, [shopForm, shippingForm, socialForm]);

  useEffect(() => { fetchShopInfo(); }, [fetchShopInfo]);

  // ── Save shop info ───────────────────────────
  const saveShopInfo = async () => {
    setSaving(true);
    try {
      const shop = shopForm.getFieldsValue();
      const shipping = shippingForm.getFieldsValue();
      const social = socialForm.getFieldsValue();

      const soicalLinks = [
        social.whatsapp || '',
        social.instagram || '',
        social.facebook || '',
        social.tiktok || '',
      ];

      const res = await updateShopInfo({
        name: shop.storeName,
        description: shop.storeDescription,
        phoneNumbers: shop.storePhone,
        deliveryPrice: shipping.shippingFee,
        acceptOrders: shipping.orderEnabled,
        soicalLinks,
      });

      if (res.success) {
        message.success(res.message);
      } else {
        message.error(res.message);
      }
    } catch {
      message.error('حدث خطأ أثناء الحفظ');
    }
    setSaving(false);
  };

  // ── Change password ──────────────────────────
  const handlePwChange = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('كلمتا المرور غير متطابقتين');
      return;
    }
    setPwSaving(true);
    // Note: adminId should come from session – using 1 as placeholder
    // In production, read from your auth session/cookie
    const res = await changeMyPassword(1, {
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
    if (res.success) {
      message.success(res.message);
      pwForm.resetFields();
    } else {
      message.error(res.message);
    }
    setPwSaving(false);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;

  const items = [
    {
      key: '1',
      label: <Space><ShopOutlined />معلومات المتجر</Space>,
      children: (
        <Card bordered={false}>
          <Form form={shopForm} layout="vertical">
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item label="اسم المتجر" name="storeName">
                  <Input size="large" />
                </Form.Item>
                <Form.Item label="وصف المتجر (SEO)" name="storeDescription">
                  <Input.TextArea rows={4} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="رقم هاتف المتجر الرسمي" name="storePhone">
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      ),
    },
    {
      key: '2',
      label: <Space><GlobalOutlined />الشحن والطلبات</Space>,
      children: (
        <Card bordered={false}>
          <Form form={shippingForm} layout="vertical">
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item label="سعر التوصيل الافتراضي" name="shippingFee">
                  <InputNumber
                    style={{ width: '100%' }}
                    size="large"
                    addonAfter="د.ع"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value.replace(/,/g, '')}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="تفعيل استقبال الطلبات حالياً" name="orderEnabled" valuePropName="checked">
                  <Switch checkedChildren="مفتوح" unCheckedChildren="مغلق" />
                </Form.Item>
                <Text type="secondary">عند الإغلاق، لن يتمكن الزبائن من إتمام عملية الشراء في المتجر.</Text>
              </Col>
            </Row>
          </Form>
        </Card>
      ),
    },
    {
      key: '3',
      label: <Space><ShareAltOutlined />التواصل الاجتماعي</Space>,
      children: (
        <Card bordered={false}>
          <Form form={socialForm} layout="vertical">
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item label="رابط واتساب" name="whatsapp">
                  <Input prefix={<WhatsAppOutlined style={{ color: '#25D366' }} />} size="large" />
                </Form.Item>
                <Form.Item label="رابط انستغرام" name="instagram">
                  <Input prefix={<InstagramOutlined style={{ color: '#E1306C' }} />} size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="رابط فيسبوك" name="facebook">
                  <Input prefix={<FacebookOutlined style={{ color: '#1877F2' }} />} size="large" />
                </Form.Item>
                <Form.Item label="رابط تيك توك" name="tiktok">
                  <Input placeholder="https://tiktok.com/@store" size="large" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
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
              <Form form={pwForm} layout="vertical" onFinish={handlePwChange}>
                <Form.Item label="كلمة المرور الحالية" name="currentPassword" rules={[{ required: true, message: 'مطلوب' }]}>
                  <Input.Password size="large" />
                </Form.Item>
                <Form.Item label="كلمة المرور الجديدة" name="newPassword" rules={[{ required: true, message: 'مطلوب' }, { min: 6, message: '6 أحرف على الأقل' }]}>
                  <Input.Password size="large" />
                </Form.Item>
                <Form.Item label="تأكيد كلمة المرور الجديدة" name="confirmPassword" rules={[{ required: true, message: 'مطلوب' }]}>
                  <Input.Password size="large" />
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={pwSaving} style={{ borderRadius: 8 }}>
                  تغيير كلمة المرور
                </Button>
              </Form>
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
            loading={saving}
            onClick={saveShopInfo}
            style={{ borderRadius: 10, height: 45, padding: '0 24px' }}
          >
            حفظ كافة التعديلات
          </Button>
        </Col>
      </Row>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
        type="card"
        className="settings-tabs"
      />

      <style jsx global>{`
        .settings-tabs .ant-tabs-nav::before { border-bottom: none !important; }
        .settings-tabs .ant-tabs-tab {
          border-radius: 12px 12px 0 0 !important;
          border: 1px solid #f0f0f0 !important;
          background: #fafafa !important;
          margin-left: 8px !important;
          transition: all 0.3s !important;
        }
        .settings-tabs .ant-tabs-tab-active { background: #fff !important; border-bottom: 2px solid #01caa8 !important; }
        .settings-tabs .ant-tabs-tab-active .ant-tabs-tab-btn { color: #01caa8 !important; }
        .ant-form-item-label label { font-weight: 600 !important; color: #595959 !important; }
      `}</style>
    </div>
  );
};

export default SettingsPage;
