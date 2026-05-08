'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Select,
  Button,
  Space,
  message,
  Tag,
  Divider,
  Avatar,
  Spin,
} from 'antd';
import {
  SaveOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import {
  getBanners,
  upsertBanner,
  getProductsForBanner,
  getCategoriesForBanner,
} from './action';

const { Title, Text } = Typography;

const bannerMeta = {
  FIRST: {
    title: 'المنتجات المضافة حديثاً',
    description: 'اختر المنتجات التي ستظهر في قسم "المضافة حديثاً" على الصفحة الرئيسية',
    mode: 'products',
  },
  SECOND: {
    title: 'الأكثر مبيعاً',
    description: 'اختر المنتجات التي ستظهر في قسم "الأكثر مبيعاً" على الصفحة الرئيسية',
    mode: 'products',
  },
  THIRD: {
    title: 'بنر الفئات (4 فئات)',
    description: 'اختر الفئات لتظهر في قسم الفئات المميزة على الصفحة الرئيسية',
    mode: 'categories',
  },
};

const BannersPage = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(null); // banner type being saved
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Local state for each banner type
  const [bannerItems, setBannerItems] = useState({ FIRST: [], SECOND: [], THIRD: [] });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [bannersRes, productsRes, categoriesRes] = await Promise.all([
      getBanners(),
      getProductsForBanner(),
      getCategoriesForBanner(),
    ]);

    if (productsRes.success) setProducts(productsRes.data);
    if (categoriesRes.success) setCategories(categoriesRes.data);

    if (bannersRes.success) {
      const map = {};
      bannersRes.data.forEach((b) => {
        map[b.type] = Array.isArray(b.items) ? b.items : [];
      });
      setBannerItems((prev) => ({ ...prev, ...map }));
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleSave = async (type) => {
    setSaving(type);
    const res = await upsertBanner({ type, items: bannerItems[type] });
    if (res.success) {
      message.success(res.message);
    } else {
      message.error(res.message);
    }
    setSaving(null);
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <Spin size="large" />
    </div>
  );

  return (
    <div style={{ direction: 'rtl' }}>
      <Row gutter={[24, 24]} align="middle" style={{ marginBottom: 24 }}>
        <Col span={18}>
          <Title level={2} style={{ margin: 0 }}>إدارة البنرات والصفحة الرئيسية</Title>
          <Text type="secondary">التحكم في الأقسام والمنتجات المعروضة في واجهة المتجر</Text>
        </Col>
        <Col span={6} style={{ textAlign: 'left' }}>
          <Button icon={<ReloadOutlined />} onClick={fetchAll} loading={loading}>تحديث</Button>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {Object.entries(bannerMeta).map(([type, meta]) => (
          <Col span={24} key={type}>
            <Card
              bordered={false}
              style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
            >
              <Row gutter={24} align="middle">
                {/* Left: icon + title */}
                <Col xs={24} md={6}>
                  <div style={{ padding: '0 10px' }}>
                    <div style={{
                      width: 60, height: 60, borderRadius: 12,
                      background: type === 'THIRD' ? '#e6f7ff' : '#f6ffed',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: 16,
                    }}>
                      {type === 'THIRD'
                        ? <AppstoreOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                        : <ShoppingOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                      }
                    </div>
                    <Title level={4} style={{ margin: 0 }}>{meta.title}</Title>
                    <Text type="secondary">{meta.description}</Text>
                  </div>
                </Col>

                {/* Middle: selector */}
                <Col xs={24} md={14}>
                  {meta.mode === 'products' ? (
                    <>
                      <Text strong style={{ display: 'block', marginBottom: 8 }}>
                        اختيار المنتجات المرتبطة:
                      </Text>
                      <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="اختر المنتجات"
                        value={bannerItems[type]}
                        onChange={(val) => setBannerItems((prev) => ({ ...prev, [type]: val }))}
                        size="large"
                        optionFilterProp="label"
                        options={products.map((p) => ({
                          value: p.id,
                          label: (
                            <Space>
                              <Avatar
                                src={p.productImages?.[0]?.image}
                                size="small"
                                shape="square"
                              />
                              {p.name}
                            </Space>
                          ),
                        }))}
                      />
                      <Divider style={{ margin: '12px 0 8px 0' }} />
                      <Space wrap>
                        {bannerItems[type].map((id) => {
                          const prod = products.find((p) => p.id === id);
                          return prod ? (
                            <Tag key={id} color="green" style={{ borderRadius: 6, padding: '4px 12px' }}>
                              {prod.name}
                            </Tag>
                          ) : null;
                        })}
                      </Space>
                    </>
                  ) : (
                    <>
                      <Text strong style={{ display: 'block', marginBottom: 8 }}>
                        اختيار الفئات المرتبطة:
                      </Text>
                      <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="اختر الفئات (4 كحد أقصى)"
                        value={bannerItems[type]}
                        onChange={(val) => {
                          if (val.length > 4) {
                            message.warning('يمكن اختيار 4 فئات كحد أقصى');
                            return;
                          }
                          setBannerItems((prev) => ({ ...prev, [type]: val }));
                        }}
                        size="large"
                        options={categories.map((c) => ({ value: c.id, label: c.name }))}
                      />
                      <Divider style={{ margin: '12px 0 8px 0' }} />
                      <Space wrap>
                        {bannerItems[type].map((id) => {
                          const cat = categories.find((c) => c.id === id);
                          return cat ? (
                            <Tag key={id} color="blue" style={{ borderRadius: 6, padding: '4px 12px' }}>
                              {cat.name}
                            </Tag>
                          ) : null;
                        })}
                      </Space>
                    </>
                  )}
                </Col>

                {/* Right: save button */}
                <Col xs={24} md={4} style={{ textAlign: 'left' }}>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    size="large"
                    loading={saving === type}
                    onClick={() => handleSave(type)}
                    style={{ borderRadius: 8, minWidth: 140 }}
                  >
                    حفظ التغييرات
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>

      <style jsx global>{`
        .ant-select-multiple .ant-select-selection-item {
          border-radius: 6px !important;
          background: #f0f0f0 !important;
        }
      `}</style>
    </div>
  );
};

export default BannersPage;
