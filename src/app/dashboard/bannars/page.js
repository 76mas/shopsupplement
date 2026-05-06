'use client';
import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Select,
  Button,
  Upload,
  Space,
  message,
  Tag,
  Divider,
  List,
  Avatar,
} from 'antd';
import {
  UploadOutlined,
  SaveOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  PlusOutlined,
  PictureOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const BannersPage = () => {
  // Mock Products & Categories for selection
  const allProducts = [
    { id: 1, name: 'Whey Gold Standard', image: 'https://3km3cceozg.ucarecd.net/b0f4146b-cb83-443a-81aa-0d050ad95cf2/-/preview/1000x1000/' },
    { id: 2, name: 'C4 Original', image: 'https://3km3cceozg.ucarecd.net/59156cd8-6e11-41ee-89d3-407a86abe03b/-/preview/1000x1000/' },
    { id: 3, name: 'Creatine Monohydrate', image: 'https://3km3cceozg.ucarecd.net/a744ef8d-4021-4d9e-aeeb-4b848423427a/-/preview/1000x1000/' },
    { id: 4, name: 'Hydro Whey Protein', image: 'https://3km3cceozg.ucarecd.net/9f4cdacc-cb08-4d36-b675-841dbc65f346/-/preview/1000x1000/' },
  ];

  const allCategories = [
    { id: 1, name: 'بروتينات' },
    { id: 2, name: 'أحماض أمينية' },
    { id: 3, name: 'فيتامينات' },
    { id: 4, name: 'حوارق دهون' },
    { id: 5, name: 'طاقة وباور' },
  ];

  const [banners, setBanners] = useState([
    {
      type: 'FIRST',
      title: 'المنتجات المضافة حديثاً',
      description: 'اختر المنتجات التي ستظهر في قسم "المضافة حديثاً" على الصفحة الرئيسية',
      items: [1, 2],
      image: '',
    },
    {
      type: 'SECOND',
      title: 'الأكثر مبيعاً',
      description: 'اختر المنتجات التي ستظهر في قسم "الأكثر مبيعاً" على الصفحة الرئيسية',
      items: [3, 4],
      image: '',
    },
    {
      type: 'THIRD',
      title: 'بنر الفئات (4 فئات)',
      description: 'اختر 4 فئات لتظهر في قسم الفئات المميزة على الصفحة الرئيسية',
      items: [1, 2, 3, 4],
      image: '',
    },
  ]);

  const handleSave = (type) => {
    message.success(`تم حفظ تعديلات بنر: ${type}`);
  };

  const updateBannerItems = (type, newItems) => {
    setBanners(banners.map(b => b.type === type ? { ...b, items: newItems } : b));
  };

  return (
    <div style={{ direction: 'rtl' }}>
      <Row gutter={[24, 24]} align="middle" style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Title level={2} style={{ margin: 0 }}>إدارة البنرات والصفحة الرئيسية</Title>
          <Text type="secondary">التحكم في الأقسام والمنتجات المعروضة في واجهة المتجر</Text>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {banners.map((banner) => (
          <Col span={24} key={banner.type}>
            <Card 
              bordered={false} 
              style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
            >
              <Row gutter={24} align="middle">
                <Col xs={24} md={6}>
                  <div style={{ padding: '0 10px' }}>
                    <div style={{ 
                      width: 60, 
                      height: 60, 
                      borderRadius: 12, 
                      background: banner.type === 'THIRD' ? '#e6f7ff' : '#f6ffed', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      marginBottom: 16
                    }}>
                      {banner.type === 'THIRD' ? 
                        <AppstoreOutlined style={{ fontSize: 24, color: '#1890ff' }} /> : 
                        <ShoppingOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                      }
                    </div>
                    <Title level={4} style={{ margin: 0 }}>{banner.title}</Title>
                    <Text type="secondary">{banner.description}</Text>
                  </div>
                </Col>

                <Col xs={24} md={banner.type === 'THIRD' ? 18 : 12}>
                  <div style={{ marginTop: { xs: 20, md: 0 } }}>
                    {banner.type === 'THIRD' ? (
                      <Row gutter={[16, 16]}>
                        {[0, 1, 2, 3].map((index) => (
                          <Col span={6} key={index}>
                            <Card size="small" style={{ borderRadius: 8, background: '#f8fafc' }}>
                              <Select
                                style={{ width: '100%', marginBottom: 8 }}
                                placeholder="اختر الفئة"
                                value={banner.items[index]?.categoryId}
                                onChange={(val) => {
                                  const newItems = [...banner.items];
                                  newItems[index] = { ...newItems[index], categoryId: val };
                                  updateBannerItems(banner.type, newItems);
                                }}
                              >
                                {allCategories.map(cat => (
                                  <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
                                ))}
                              </Select>
                              <Upload 
                                maxCount={1} 
                                showUploadList={false}
                                beforeUpload={() => false}
                              >
                                <div style={{ 
                                  width: '100%', 
                                  height: 80, 
                                  border: '1px dashed #d9d9d9', 
                                  borderRadius: 8,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  overflow: 'hidden',
                                  background: '#fff'
                                }}>
                                  {banner.items[index]?.image ? (
                                    <img src={banner.items[index].image} alt="cat" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  ) : (
                                    <div style={{ textAlign: 'center' }}>
                                      <PlusOutlined />
                                      <div style={{ fontSize: 10 }}>صورة</div>
                                    </div>
                                  )}
                                </div>
                              </Upload>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    ) : (
                      <>
                        <Text strong style={{ display: 'block', marginBottom: 8 }}>
                          اختيار المنتجات المرتبطة:
                        </Text>
                        <Select
                          mode="multiple"
                          style={{ width: '100%' }}
                          placeholder="اختر المنتجات"
                          value={banner.items}
                          onChange={(val) => updateBannerItems(banner.type, val)}
                          size="large"
                        >
                          {allProducts.map(prod => (
                            <Select.Option key={prod.id} value={prod.id}>
                              <Space>
                                <Avatar src={prod.image} size="small" />
                                {prod.name}
                              </Space>
                            </Select.Option>
                          ))}
                        </Select>
                      </>
                    )}
                  </div>
                </Col>

                <Col xs={24} md={banner.type === 'THIRD' ? 24 : 6}>
                  <div style={{ marginTop: banner.type === 'THIRD' ? 24 : 0, textAlign: banner.type === 'THIRD' ? 'left' : 'right' }}>
                    <Space direction={banner.type === 'THIRD' ? "horizontal" : "vertical"} style={{ width: '100%', justifyContent: banner.type === 'THIRD' ? 'flex-end' : 'flex-start' }}>
                      {banner.type !== 'THIRD' && (
                        <Upload maxCount={1} listType="picture">
                          <Button icon={<PictureOutlined />} block>تغيير صورة القسم</Button>
                        </Upload>
                      )}
                      <Button 
                        type="primary" 
                        icon={<SaveOutlined />} 
                        size="large" 
                        onClick={() => handleSave(banner.title)}
                        style={{ borderRadius: 8, minWidth: 150 }}
                      >
                        حفظ التغييرات
                      </Button>
                    </Space>
                  </div>
                </Col>
              </Row>

              {banner.type !== 'THIRD' && (
                <>
                  <Divider style={{ margin: '24px 0 12px 0' }} />
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>العناصر المختارة حالياً:</Text>
                    <div style={{ marginTop: 8 }}>
                      <Space wrap>
                        {banner.items.map(itemId => {
                          const item = allProducts.find(p => p.id === itemId);
                          return item ? (
                            <Tag 
                              key={itemId} 
                              color="green"
                              style={{ borderRadius: 6, padding: '4px 12px' }}
                            >
                              {item.name}
                            </Tag>
                          ) : null;
                        })}
                      </Space>
                    </div>
                  </div>
                </>
              )}
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
