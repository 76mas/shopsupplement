'use client';
import React, { useState, useEffect, useTransition } from 'react';
import {
  Table, Button, Modal, Form, Input, InputNumber,
  Select, Switch, Space, Tag, Typography, Card,
  Row, Col, message, Tooltip, Popconfirm,
  Image, Upload, ColorPicker, Spin
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  LoadingOutlined, MinusCircleOutlined,
} from '@ant-design/icons';
import {
  getProducts, createProduct, updateProduct,
  deleteProduct, getCategoriesList,
} from './action';
// import LoadingOutlined from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;
const UPLOADCARE_PUB_KEY  = process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY;
const UPLOADCARE_CDN_BASE = process.env.NEXT_PUBLIC_UPLOADCARE_CDN_BASE ?? 'https://ucarecdn.com';

// ─── Uploadcare thumbnail URL ─────────────────────────────
// تحوّل: https://{cdn}/{uuid}/{filename}
// إلى:   https://{cdn}/{uuid}/-/preview/200x200/{filename}
function ucThumb(url, size = '200x200') {
  if (!url) return url;
  const uuidRe = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;
  const m = url.match(uuidRe);
  if (!m) return url;
  const idx = url.indexOf(m[1]) + m[1].length;
  return `${url.slice(0, idx)}/-/preview/${size}${url.slice(idx)}`;
}

// ─── رفع صورة إلى Uploadcare وإرجاع الرابط الحقيقي ────────
async function uploadToUploadcare(file) {
  // 1) رفع الملف
  const fd = new FormData();
  fd.append('UPLOADCARE_PUB_KEY', UPLOADCARE_PUB_KEY);
  fd.append('UPLOADCARE_STORE', '1');
  fd.append('file', file);

  const uploadRes = await fetch('https://upload.uploadcare.com/base/', {
    method: 'POST',
    body: fd,
  });
  const uploadJson = await uploadRes.json();
  if (!uploadJson.file) throw new Error('فشل رفع الصورة');

  const uuid = uploadJson.file;

  // 2) جلب اسم الملف الحقيقي من /info/
  const infoRes = await fetch(
    `https://upload.uploadcare.com/info/?pub_key=${UPLOADCARE_PUB_KEY}&file_id=${uuid}`
  );
  const infoJson = await infoRes.json();
  const filename = infoJson.filename ?? file.name ?? '';

  // 3) بناء الرابط الكامل: {CDN_BASE}/{uuid}/{filename}
  const encodedName = encodeURIComponent(filename);
  return `${UPLOADCARE_CDN_BASE}/${uuid}/${encodedName}`;
}


// ─── مكوّن Upload مخصص ────────────────────────────────────
const ImageUploader = ({ value = [], onChange, max = 5 }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async ({ file }) => {
    try {
      setUploading(true);
      const url = await uploadToUploadcare(file);
      onChange([...value, { uid: url, url, thumbUrl: ucThumb(url), status: 'done', name: file.name }]);
    } catch {
      message.error('فشل رفع الصورة');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (file) => {
    onChange(value.filter((f) => f.uid !== file.uid));
  };

  return (
    <Upload
      listType="picture-card"
      fileList={value}
      customRequest={handleUpload}
      onRemove={handleRemove}
      accept="image/*"
      disabled={uploading || value.length >= max}
    >
      {value.length < max && (
        <div>
          {uploading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 4, fontSize: 12 }}>رفع</div>
        </div>
      )}
    </Upload>
  );
};

// ─── الصفحة الرئيسية ─────────────────────────────────────
const ProductPage = () => {
  const [products, setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [isPending, startTransition] = useTransition();
  const [form] = Form.useForm();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // صور موجودة (عند التعديل) — لعرضها ومتابعة الحذف
  const [existingImages, setExistingImages] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);

  // ─── جلب البيانات ───────────────────────────────────────
  const fetchAll = async () => {
    setLoading(true);
    const [pRes, cRes] = await Promise.all([getProducts(), getCategoriesList()]);
    if (pRes.success) setProducts(pRes.data.map((p) => ({ ...p, key: p.id })));
    if (cRes.success) setCategories(cRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  // ─── فتح مودال الإضافة ───────────────────────────────────
  const openAdd = () => {
    setEditing(null);
    setExistingImages([]);
    setRemovedImageIds([]);
    form.resetFields();
    form.setFieldsValue({ isAvailable: true, images: [] });
    setModalOpen(true);
  };

  // ─── فتح مودال التعديل ───────────────────────────────────
  const openEdit = (record) => {
    setEditing(record);
    setRemovedImageIds([]);
    const imgs = record.productImages ?? [];
    setExistingImages(imgs);

    // نصفي أولاً لمنع بقايا القيم من جلسة سابقة
    form.resetFields();
    form.setFieldsValue({
      name: record.name,
      description: record.description ?? '',
      price: Number(record.price),
      endPrice: Number(record.endPrice),
      stock: record.stock,
      isAvailable: record.isAvailable,
      categoryId: record.categoryId ?? undefined,
      sizes: (record.sizes ?? []).map((s) => ({
        name: s.name,
        price: Number(s.price),
      })),
      flavors: (record.flavors ?? []).map((f) => ({
        name: f.name,
        color: f.color ?? '#000000',
      })),
      images: [],
    });
    setModalOpen(true);
  };

  const handleCancel = () => {
    setModalOpen(false);
    form.resetFields();
    setEditing(null);
    setExistingImages([]);
    setRemovedImageIds([]);
  };

  // ─── حفظ ─────────────────────────────────────────────────
  const onFinish = (values) => {
    startTransition(async () => {
      // استخراج روابط الصور الجديدة
      const newImageUrls = (values.images ?? []).map((f) => f.url);

      // تنسيق الـ flavors (ColorPicker يُرجع object)
      const flavors = (values.flavors ?? []).map((f) => ({
        name: f.name,
        color: typeof f.color === 'string' ? f.color : f.color?.toHexString?.() ?? f.color,
      }));

      let res;
      if (editing) {
        res = await updateProduct(editing.id, {
          ...values,
          flavors,
          newImages: newImageUrls,
          removedImageIds,
        });
      } else {
        res = await createProduct({
          ...values,
          flavors,
          images: newImageUrls,
        });
      }

      if (res.success) {
        message.success(res.message);
        handleCancel();
        fetchAll();
      } else {
        message.error(res.message);
      }
    });
  };

  // ─── حذف ─────────────────────────────────────────────────
  const handleDelete = (id) => {
    startTransition(async () => {
      const res = await deleteProduct(id);
      if (res.success) { message.success(res.message); fetchAll(); }
      else message.error(res.message);
    });
  };

  // ─── أعمدة الجدول ────────────────────────────────────────
  const columns = [
    {
      title: 'المنتج',
      key: 'name',
      render: (_, r) => (
        <Space>
          <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', background: '#f5f5f5', flexShrink: 0 }}>
            {r.productImages?.[0]?.image ? (
              <Image src={r.productImages[0].image} alt={r.name}
                width={44} height={44} style={{ objectFit: 'cover' }} preview={false} />
            ) : (
              <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                <PlusOutlined />
              </div>
            )}
          </div>
          <div>
            <Text strong style={{ display: 'block' }}>{r.name}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{r.description?.slice(0, 40)}{r.description?.length > 40 ? '...' : ''}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'الفئة',
      key: 'category',
      render: (_, r) => r.category ? <Tag color="blue">{r.category.name}</Tag> : <Text type="secondary">—</Text>,
    },
    {
      title: 'السعر',
      key: 'price',
      render: (_, r) => (
        <Space direction="vertical" size={0}>
          <Text strong>{Number(r.endPrice).toLocaleString()} د.ع</Text>
          {Number(r.price) !== Number(r.endPrice) && (
            <Text delete type="secondary" style={{ fontSize: 12 }}>{Number(r.price).toLocaleString()} د.ع</Text>
          )}
        </Space>
      ),
    },
    {
      title: 'المخزون',
      dataIndex: 'stock',
      key: 'stock',
      render: (s) => <Text type={s < 10 ? 'danger' : 'success'} strong>{s} قطعة</Text>,
    },
    {
      title: 'الحالة',
      dataIndex: 'isAvailable',
      key: 'isAvailable',
      render: (a) => <Tag color={a ? 'green' : 'red'}>{a ? 'متوفر' : 'غير متوفر'}</Tag>,
    },
    {
      title: 'الإجراءات',
      key: 'action',
      render: (_, r) => (
        <Space>
          <Tooltip title="تعديل">
            <Button type="text" icon={<EditOutlined style={{ color: '#1677ff' }} />} onClick={() => openEdit(r)} />
          </Tooltip>
          <Popconfirm
            title="حذف المنتج"
            description={`هل أنت متأكد من حذف "${r.name}"؟`}
            onConfirm={() => handleDelete(r.id)}
            okText="نعم، احذف" cancelText="إلغاء"
            okButtonProps={{ danger: true }}
            placement="topLeft"
          >
            <Tooltip title="حذف">
              <Button type="text" icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />} />
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
          <Title level={2} style={{ margin: 0, fontSize: '1.5rem' }}>المنتجات</Title>
          <Text type="secondary">إدارة منتجات المتجر وتحديث تفاصيلها</Text>
        </Col>
        <Col xs={24} sm={12} style={{ textAlign: 'left' }}>
          <Button type="primary" icon={<PlusOutlined />} size="large" onClick={openAdd}
            style={{ borderRadius: 10, height: 45, padding: '0 24px', width: 'auto' }} block={false}>
            إضافة منتج جديد
          </Button>
        </Col>
      </Row>

      {/* Products List */}
      <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />}>
        {isMobile ? (
          <Row gutter={[16, 16]}>
            {products.map((r) => (
              <Col xs={24} key={r.id}>
                <Card 
                  variant="borderless" 
                  style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                  bodyStyle={{ padding: '12px' }}
                >
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ width: 80, height: 80, borderRadius: 12, overflow: 'hidden', background: '#f5f5f5', flexShrink: 0 }}>
                      {r.productImages?.[0]?.image ? (
                        <Image src={r.productImages[0].image} alt={r.name}
                          width={80} height={80} style={{ objectFit: 'cover' }} preview={false} />
                      ) : (
                        <div style={{ width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                          <ShoppingOutlined style={{ fontSize: 24 }} />
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <Text strong style={{ fontSize: 15, display: 'block' }}>{r.name}</Text>
                          {r.category && <Tag color="blue" style={{ marginTop: 4, borderRadius: 4 }}>{r.category.name}</Tag>}
                        </div>
                        <div style={{ textAlign: 'left' }}>
                          <Text strong style={{ color: '#01caa8', display: 'block' }}>{Number(r.endPrice).toLocaleString()} د.ع</Text>
                          {Number(r.price) !== Number(r.endPrice) && (
                            <Text delete type="secondary" style={{ fontSize: 11 }}>{Number(r.price).toLocaleString()} د.ع</Text>
                          )}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                        <Space>
                           <Tag color={r.stock < 10 ? 'red' : 'green'} style={{ borderRadius: 4 }}>
                             {r.stock} قطعة
                           </Tag>
                           <Tag color={r.isAvailable ? 'cyan' : 'default'} style={{ borderRadius: 4 }}>
                             {r.isAvailable ? 'متوفر' : 'غير متوفر'}
                           </Tag>
                        </Space>
                        <Space size={4}>
                          <Button 
                            type="text" 
                            size="small"
                            icon={<EditOutlined style={{ color: '#1677ff' }} />} 
                            onClick={() => openEdit(r)} 
                            style={{ background: '#f0f7ff' }}
                          />
                          <Popconfirm
                            title="حذف المنتج"
                            onConfirm={() => handleDelete(r.id)}
                            okText="حذف" cancelText="إلغاء"
                            okButtonProps={{ danger: true }}
                          >
                            <Button 
                              type="text" 
                              size="small"
                              icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />} 
                              style={{ background: '#fff1f0' }}
                            />
                          </Popconfirm>
                        </Space>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
            {products.length === 0 && (
              <Col span={24}>
                <Card variant="borderless" style={{ textAlign: 'center', padding: 40, borderRadius: 16 }}>
                  <Text type="secondary">لا توجد منتجات حالياً</Text>
                </Card>
              </Col>
            )}
          </Row>
        ) : (
          <Card variant="borderless" style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <Table columns={columns} dataSource={products} pagination={{ pageSize: 10 }} />
          </Card>
        )}
      </Spin>

      {/* Modal Add / Edit */}
      <Modal
        title={<Title level={4} style={{ margin: 0 }}>{editing ? 'تعديل المنتج' : 'إضافة منتج جديد'}</Title>}
        open={modalOpen} onCancel={handleCancel} onOk={() => form.submit()}
        width={860} okText={editing ? 'حفظ التعديلات' : 'حفظ المنتج'}
        cancelText="إلغاء" centered confirmLoading={isPending}
        okButtonProps={{ style: { borderRadius: 8, height: 40 } }}
        cancelButtonProps={{ style: { borderRadius: 8, height: 40 } }}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}
          initialValues={{ isAvailable: true, images: [] }}
          style={{ marginTop: 16 }}>
          
          <Row gutter={[16, 16]}>
            <Col xs={24} md={16}>
              <Form.Item name="name" label="اسم المنتج"
                rules={[{ required: true, message: 'يرجى إدخال اسم المنتج' }]}>
                <Input placeholder="مثال: Whey Gold Standard" size="large" />
              </Form.Item>
              <Form.Item name="description" label="وصف المنتج">
                <TextArea rows={3} placeholder="اكتب وصفاً تفصيلياً للمنتج..." />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item name="categoryId" label="الفئة">
                <Select placeholder="اختر الفئة" size="large" allowClear>
                  {categories.map((c) => (
                    <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="isAvailable" label="حالة التوفر" valuePropName="checked">
                <Switch checkedChildren="متوفر" unCheckedChildren="غير متوفر" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Form.Item name="price" label="السعر الأساسي"
                rules={[{ required: true, message: 'يرجى إدخال السعر' }]}>
                <InputNumber style={{ width: '100%' }} size="large" min={0}
                  formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(v) => v.replace(/,*/g, '')} addonAfter="د.ع" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="endPrice" label="سعر البيع"
                rules={[{ required: true, message: 'يرجى إدخال سعر البيع' }]}>
                <InputNumber style={{ width: '100%' }} size="large" min={0}
                  formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(v) => v.replace(/,*/g, '')} addonAfter="د.ع" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="stock" label="المخزون"
                rules={[{ required: true, message: 'يرجى إدخال الكمية' }]}>
                <InputNumber style={{ width: '100%' }} size="large" min={0} />
              </Form.Item>
            </Col>
          </Row>

          {/* صور المنتج */}
          <Card size="small" title="صور المنتج" style={{ marginBottom: 16, borderRadius: 12 }}>
            {/* صور موجودة (وضع التعديل) */}
            {existingImages.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
                  الصور الحالية — اضغط ✕ لحذف صورة
                </Text>
                <Space wrap>
                  {existingImages.map((img) => {
                    const isRemoved = removedImageIds.includes(img.id);
                    return (
                      <div key={img.id} style={{ position: 'relative', display: 'inline-block' }}>
                        <Image
                          src={ucThumb(img.image, '120x120')}
                          preview={{ src: img.image }}
                          width={80} height={80}
                          style={{ objectFit: 'cover', borderRadius: 8, opacity: isRemoved ? 0.35 : 1, display: 'block' }}
                        />
                        {!isRemoved ? (
                          <Button
                            size="small" danger shape="circle"
                            style={{ position: 'absolute', top: -7, insetInlineStart: -7, minWidth: 22, width: 22, height: 22, fontSize: 11, padding: 0, lineHeight: '22px' }}
                            onClick={() => setRemovedImageIds((p) => [...p, img.id])}
                          >✕</Button>
                        ) : (
                          <div
                            style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            onClick={() => setRemovedImageIds((p) => p.filter((x) => x !== img.id))}
                          >
                            <Tag color="red" style={{ margin: 0, fontSize: 10 }}>تراجع</Tag>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </Space>
              </div>
            )}
            <Form.Item name="images" label="رفع صور جديدة">
              <ImageUploader max={8 - existingImages.length + removedImageIds.length} />
            </Form.Item>
          </Card>

          {/* الأحجام */}
          <Card size="small" title="الأحجام المتوفرة" style={{ marginBottom: 16, borderRadius: 12 }}>
            <Form.List name="sizes">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...rest }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item {...rest} name={[name, 'name']}
                        rules={[{ required: true, message: 'اسم الحجم' }]}>
                        <Input placeholder="مثلاً: 2.27 كجم" />
                      </Form.Item>
                      <Form.Item {...rest} name={[name, 'price']}
                        rules={[{ required: true, message: 'السعر' }]}>
                        <InputNumber placeholder="السعر" addonAfter="د.ع" style={{ width: 180 }} min={0} />
                      </Form.Item>
                      <MinusCircleOutlined style={{ color: '#ff4d4f' }} onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    إضافة حجم
                  </Button>
                </>
              )}
            </Form.List>
          </Card>

          {/* النكهات */}
          <Card size="small" title="النكهات والألوان" style={{ marginBottom: 8, borderRadius: 12 }}>
            <Form.List name="flavors">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...rest }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item {...rest} name={[name, 'name']}
                        rules={[{ required: true, message: 'اسم النكهة' }]}>
                        <Input placeholder="مثلاً: شوكولاتة" />
                      </Form.Item>
                      <Form.Item {...rest} name={[name, 'color']} label="اللون">
                        <ColorPicker showText />
                      </Form.Item>
                      <MinusCircleOutlined style={{ color: '#ff4d4f' }} onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    إضافة نكهة
                  </Button>
                </>
              )}
            </Form.List>
          </Card>
        </Form>
      </Modal>

      <style jsx global>{`
        .ant-modal-title { direction: rtl; }
        .ant-form-item-label { padding-bottom: 4px !important; }
        .ant-form-item-label label { font-weight: 600 !important; font-size: 13px !important; }
      `}</style>
    </div>
  );
};

export default ProductPage;