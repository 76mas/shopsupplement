'use client';
import React, { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Upload,
  Space,
  Tag,
  Typography,
  Card,
  Row,
  Col,
  message,
  ColorPicker,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  MinusCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

// Mock Categories
const categories = [
  { id: 1, name: 'بروتينات' },
  { id: 2, name: 'أحماض أمينية' },
  { id: 3, name: 'فيتامينات' },
  { id: 4, name: 'حوارق دهون' },
];

const ProductPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  
  // Mock Data for Table
  const [data, setData] = useState([
    {
      key: '1',
      id: 1,
      name: 'Whey Gold Standard',
      price: 95000,
      stock: 45,
      category: 'بروتينات',
      isAvailable: true,
      image: 'https://3km3cceozg.ucarecd.net/b0f4146b-cb83-443a-81aa-0d050ad95cf2/-/preview/1000x1000/',
      flavors: [{ name: 'شوكولاتة', color: '#4B2C20' }, { name: 'فانيليا', color: '#F3E5AB' }],
      sizes: [{ name: '2.27 كجم', price: 95000 }, { name: '1 كجم', price: 55000 }],
    },
    {
      key: '2',
      id: 2,
      name: 'C4 Original',
      price: 45000,
      stock: 12,
      category: 'طاقة',
      isAvailable: true,
      image: 'https://3km3cceozg.ucarecd.net/59156cd8-6e11-41ee-89d3-407a86abe03b/-/preview/1000x1000/',
      flavors: [{ name: 'توت بري', color: '#8A2BE2' }],
      sizes: [{ name: '30 حصة', price: 45000 }],
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
    console.log('Form Values:', values);
    message.success('تمت إضافة المنتج بنجاح (بيانات وهمية)');
    setIsModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'المنتج',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <div style={{ 
            width: 40, 
            height: 40, 
            borderRadius: 8, 
            overflow: 'hidden', 
            background: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img src={record.image} alt={text} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'الفئة',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: 'السعر',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <Text strong>{price.toLocaleString()} د.ع</Text>,
    },
    {
      title: 'المخزون',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock) => (
        <Text type={stock < 10 ? 'danger' : 'success'} strong>
          {stock} قطعة
        </Text>
      ),
    },
    {
      title: 'الحالة',
      dataIndex: 'isAvailable',
      key: 'isAvailable',
      render: (available) => (
        <Tag color={available ? 'green' : 'red'}>
          {available ? 'متوفر' : 'غير متوفر'}
        </Tag>
      ),
    },
    {
      title: 'الإجراءات',
      key: 'action',
      render: () => (
        <Space>
          <Tooltip title="عرض">
            <Button type="text" icon={<EyeOutlined />} />
          </Tooltip>
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
          <Title level={2} style={{ margin: 0 }}>المنتجات</Title>
          <Text type="secondary">إدارة منتجات المتجر وتحديث تفاصيلها</Text>
        </Col>
        <Col span={12} style={{ textAlign: 'left' }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large" 
            onClick={showModal}
            style={{ borderRadius: 10, height: 45, padding: '0 24px' }}
          >
            إضافة منتج جديد
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

      {/* Add Product Modal */}
      <Modal
        title={<Title level={4}>إضافة منتج جديد</Title>}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        width={800}
        okText="حفظ المنتج"
        cancelText="إلغاء"
        centered
        okButtonProps={{ style: { borderRadius: 8, height: 40 } }}
        cancelButtonProps={{ style: { borderRadius: 8, height: 40 } }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ isAvailable: true }}
          style={{ marginTop: 24 }}
        >
          <Row gutter={24}>
            <Col span={16}>
              <Form.Item
                name="name"
                label="اسم المنتج"
                rules={[{ required: true, message: 'يرجى إدخال اسم المنتج' }]}
              >
                <Input placeholder="مثال: Whey Gold Standard" size="large" />
              </Form.Item>
              
              <Form.Item
                name="description"
                label="وصف المنتج"
              >
                <TextArea rows={4} placeholder="اكتب وصفاً تفصيلياً للمنتج..." />
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item label="صورة المنتج الرئيسية">
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  beforeUpload={() => false}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>رفع صورة</div>
                  </div>
                </Upload>
              </Form.Item>

              <Form.Item
                name="categoryId"
                label="الفئة"
                rules={[{ required: true, message: 'يرجى اختيار الفئة' }]}
              >
                <Select placeholder="اختر الفئة" size="large">
                  {categories.map(cat => (
                    <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="price"
                label="السعر الأساسي"
                rules={[{ required: true, message: 'يرجى إدخال السعر' }]}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  size="large" 
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  addonAfter="د.ع"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="stock"
                label="المخزون"
                rules={[{ required: true, message: 'يرجى إدخال الكمية' }]}
              >
                <InputNumber style={{ width: '100%' }} size="large" min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="isAvailable"
                label="حالة التوفر"
                valuePropName="checked"
              >
                <Switch checkedChildren="متوفر" unCheckedChildren="غير متوفر" />
              </Form.Item>
            </Col>
          </Row>

          <Card title="الأحجام المتوفرة" size="small" style={{ marginBottom: 24, borderRadius: 12 }}>
            <Form.List name="sizes">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        rules={[{ required: true, message: 'اسم الحجم' }]}
                      >
                        <Input placeholder="اسم الحجم (مثلاً: 2.27 كجم)" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'price']}
                        rules={[{ required: true, message: 'السعر' }]}
                      >
                        <InputNumber placeholder="السعر الكامل" addonAfter="د.ع" style={{ width: 200 }} />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      إضافة حجم
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Card>

          <Card title="النكهات والألوان" size="small" style={{ marginBottom: 24, borderRadius: 12 }}>
            <Form.List name="flavors">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        rules={[{ required: true, message: 'اسم النكهة' }]}
                      >
                        <Input placeholder="اسم النكهة (مثلاً: شوكولاتة)" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'color']}
                        label="اللون في UI"
                      >
                        <ColorPicker showText />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      إضافة نكهة
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Card>

          <Form.Item label="صور إضافية للمنتج (المعرض)">
            <Upload
              action="/upload.do"
              listType="picture-card"
              multiple
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>رفع</div>
              </div>
            </Upload>
          </Form.Item>
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

export default ProductPage;