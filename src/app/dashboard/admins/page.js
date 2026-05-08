'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Popconfirm,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UserOutlined,
  PhoneOutlined,
  ReloadOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import {
  getAdmins,
  createAdmin,
  updateAdmin,
  changeAdminPassword,
  deleteAdmin,
} from './action';

const { Title, Text } = Typography;

const AdminsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── Add Modal ──
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addForm] = Form.useForm();

  // ── Edit Modal ──
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm] = Form.useForm();
  const [editingAdmin, setEditingAdmin] = useState(null);
  const editingAdminRef = useRef(null); // ref لتجنب stale closure

  // ── Change Password Modal ──
  const [pwModalOpen, setPwModalOpen] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwForm] = Form.useForm();
  const [pwAdminId, setPwAdminId] = useState(null);

  // ─── جلب البيانات ───────────────────────────
  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    const res = await getAdmins();
    if (res.success) {
      setData(res.data.map((a) => ({ ...a, key: a.id })));
    } else {
      message.error(res.message || 'حدث خطأ أثناء جلب المدراء');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // ─── إضافة مدير ─────────────────────────────
  const handleAddFinish = async (values) => {
    setAddLoading(true);
    const res = await createAdmin(values);
    if (res.success) {
      message.success(res.message);
      setAddModalOpen(false);
      addForm.resetFields();
      fetchAdmins();
    } else {
      message.error(res.message);
    }
    setAddLoading(false);
  };

  // ─── تعديل مدير ─────────────────────────────
  const openEditModal = (admin) => {
    editingAdminRef.current = admin; // حفظ فوري بدون انتظار re-render
    setEditingAdmin(admin);
    editForm.setFieldsValue({ name: admin.name, phoneNumber: admin.phoneNumber });
    setEditModalOpen(true);
  };

  const handleEditFinish = async (values) => {
    const target = editingAdminRef.current;
    if (!target?.id) {
      message.error('حدث خطأ: لم يتم تحديد المدير');
      return;
    }
    setEditLoading(true);
    const res = await updateAdmin(target.id, values);
    if (res.success) {
      message.success(res.message);
      setEditModalOpen(false);
      editForm.resetFields();
      fetchAdmins();
    } else {
      message.error(res.message);
    }
    setEditLoading(false);
  };

  // ─── تغيير كلمة المرور ───────────────────────
  const pwAdminIdRef = useRef(null); // ref لتجنب stale closure
  const openPwModal = (adminId) => {
    pwAdminIdRef.current = adminId;
    setPwAdminId(adminId);
    setPwModalOpen(true);
  };

  const handlePwFinish = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('كلمتا المرور غير متطابقتين');
      return;
    }
    const targetId = pwAdminIdRef.current;
    if (!targetId) {
      message.error('حدث خطأ: لم يتم تحديد المدير');
      return;
    }
    setPwLoading(true);
    const res = await changeAdminPassword(targetId, values.newPassword);
    if (res.success) {
      message.success(res.message);
      setPwModalOpen(false);
      pwForm.resetFields();
    } else {
      message.error(res.message);
    }
    setPwLoading(false);
  };

  // ─── حذف مدير ───────────────────────────────
  const handleDelete = async (id) => {
    const res = await deleteAdmin(id);
    if (res.success) {
      message.success(res.message);
      fetchAdmins();
    } else {
      message.error(res.message);
    }
  };

  // ─── الأعمدة ─────────────────────────────────
  const columns = [
    {
      title: 'الاسم',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#e6fffb', color: '#01caa8' }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'رقم الهاتف',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: 'تاريخ الإضافة',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <Text type="secondary">
          {new Date(date).toLocaleDateString('ar-IQ', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </Text>
      ),
    },
    {
      title: 'الحالة',
      key: 'status',
      render: () => <Tag color="green">نشط</Tag>,
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
              onClick={() => openEditModal(record)}
            />
          </Tooltip>
          <Tooltip title="تغيير كلمة المرور">
            <Button
              type="text"
              icon={<LockOutlined style={{ color: '#faad14' }} />}
              onClick={() => openPwModal(record.id)}
            />
          </Tooltip>
          <Tooltip title="حذف">
            <Popconfirm
              title="هل أنت متأكد من حذف هذا المدير؟"
              okText="نعم، احذف"
              cancelText="إلغاء"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDelete(record.id)}
            >
              <Button type="text" icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ direction: 'rtl' }}>
      <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12}>
          <Title level={2} style={{ margin: 0, fontSize: '1.5rem' }}>المدراء</Title>
          <Text type="secondary">إدارة حسابات المسؤولين عن لوحة التحكم</Text>
        </Col>
        <Col xs={24} sm={12} style={{ textAlign: 'left' }}>
          <Space wrap>
            <Tooltip title="تحديث">
              <Button icon={<ReloadOutlined />} onClick={fetchAdmins} loading={loading} />
            </Tooltip>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => setAddModalOpen(true)}
              style={{ borderRadius: 10, height: 45, padding: '0 24px' }}
            >
              إضافة مدير جديد
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Admins List */}
      <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />}>
        {isMobile ? (
          <Row gutter={[16, 16]}>
            {data.map((r) => (
              <Col xs={24} key={r.id}>
                <Card 
                  variant="borderless" 
                  style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                  bodyStyle={{ padding: '16px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <Space size={12}>
                      <Avatar icon={<UserOutlined />} size="large" style={{ backgroundColor: '#e6fffb', color: '#01caa8' }} />
                      <div>
                        <Text strong style={{ fontSize: 16, display: 'block' }}>{r.name}</Text>
                        <Text type="secondary" style={{ fontSize: 13 }}>{r.phoneNumber}</Text>
                      </div>
                    </Space>
                    <Tag color="green" style={{ borderRadius: 4 }}>نشط</Tag>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa', padding: '8px 12px', borderRadius: 10 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {new Date(r.createdAt).toLocaleDateString('ar-IQ', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </Text>
                    <Space size={4}>
                      <Tooltip title="تعديل">
                        <Button 
                          type="text" 
                          icon={<EditOutlined style={{ color: '#1677ff' }} />} 
                          onClick={() => openEditModal(r)}
                          style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                        />
                      </Tooltip>
                      <Tooltip title="كلمة المرور">
                        <Button 
                          type="text" 
                          icon={<LockOutlined style={{ color: '#faad14' }} />} 
                          onClick={() => openPwModal(r.id)}
                          style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                        />
                      </Tooltip>
                      <Popconfirm
                        title="حذف المدير"
                        onConfirm={() => handleDelete(r.id)}
                        okText="حذف" cancelText="إلغاء"
                        okButtonProps={{ danger: true }}
                      >
                        <Button 
                          type="text" 
                          icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />} 
                          style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                        />
                      </Popconfirm>
                    </Space>
                  </div>
                </Card>
              </Col>
            ))}
            {data.length === 0 && (
              <Col span={24}>
                <Card variant="borderless" style={{ textAlign: 'center', padding: 40, borderRadius: 16 }}>
                  <Text type="secondary">لا يوجد مدراء حالياً</Text>
                </Card>
              </Col>
            )}
          </Row>
        ) : (
          <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <Table
              columns={columns}
              dataSource={data}
              pagination={{ pageSize: 10 }}
              locale={{ emptyText: 'لا يوجد مدراء حتى الآن' }}
            />
          </Card>
        )}
      </Spin>

      {/* ── Modal: إضافة مدير ── */}
      <Modal
        title={<Title level={4}>إضافة مدير جديد</Title>}
        open={addModalOpen}
        onCancel={() => { setAddModalOpen(false); addForm.resetFields(); }}
        onOk={() => addForm.submit()}
        okText="حفظ الحساب"
        cancelText="إلغاء"
        centered
        confirmLoading={addLoading}
        okButtonProps={{ style: { borderRadius: 8, height: 40 } }}
        cancelButtonProps={{ style: { borderRadius: 8, height: 40 } }}
      >
        <Form form={addForm} layout="vertical" onFinish={handleAddFinish} style={{ marginTop: 24 }}>
          <Form.Item
            name="name"
            label="الاسم"
            rules={[{ required: true, message: 'يرجى إدخال الاسم' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="اسم المدير" size="large" />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="رقم الهاتف"
            rules={[
              { required: true, message: 'يرجى إدخال رقم الهاتف' },
              { pattern: /^[0-9]{11}$/, message: 'يرجى إدخال رقم هاتف عراقي صحيح (11 رقم)' },
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="077XXXXXXXX" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label="كلمة المرور"
            rules={[
              { required: true, message: 'يرجى إدخال كلمة المرور' },
              { min: 6, message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' },
            ]}
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

      {/* ── Modal: تعديل مدير ── */}
      <Modal
        title={<Title level={4}>تعديل بيانات المدير</Title>}
        open={editModalOpen}
        onCancel={() => { setEditModalOpen(false); editForm.resetFields(); }}
        onOk={() => editForm.submit()}
        okText="حفظ التعديلات"
        cancelText="إلغاء"
        centered
        confirmLoading={editLoading}
        okButtonProps={{ style: { borderRadius: 8, height: 40 } }}
        cancelButtonProps={{ style: { borderRadius: 8, height: 40 } }}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditFinish} style={{ marginTop: 24 }}>
          <Form.Item
            name="name"
            label="الاسم"
            rules={[{ required: true, message: 'يرجى إدخال الاسم' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="اسم المدير" size="large" />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="رقم الهاتف"
            rules={[
              { required: true, message: 'يرجى إدخال رقم الهاتف' },
              { pattern: /^[0-9]{11}$/, message: 'يرجى إدخال رقم هاتف عراقي صحيح (11 رقم)' },
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="077XXXXXXXX" size="large" />
          </Form.Item>
        </Form>
      </Modal>

      {/* ── Modal: تغيير كلمة المرور ── */}
      <Modal
        title={<Title level={4}>تغيير كلمة المرور</Title>}
        open={pwModalOpen}
        onCancel={() => { setPwModalOpen(false); pwForm.resetFields(); }}
        onOk={() => pwForm.submit()}
        okText="تغيير كلمة المرور"
        cancelText="إلغاء"
        centered
        confirmLoading={pwLoading}
        okButtonProps={{ style: { borderRadius: 8, height: 40 } }}
        cancelButtonProps={{ style: { borderRadius: 8, height: 40 } }}
      >
        <Form form={pwForm} layout="vertical" onFinish={handlePwFinish} style={{ marginTop: 24 }}>
          <Form.Item
            name="newPassword"
            label="كلمة المرور الجديدة"
            rules={[
              { required: true, message: 'يرجى إدخال كلمة المرور الجديدة' },
              { min: 6, message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="كلمة المرور الجديدة" size="large" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="تأكيد كلمة المرور"
            rules={[{ required: true, message: 'يرجى تأكيد كلمة المرور' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="أعد كتابة كلمة المرور" size="large" />
          </Form.Item>
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

export default AdminsPage;
