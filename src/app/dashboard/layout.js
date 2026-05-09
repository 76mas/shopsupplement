"use client";
import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  ConfigProvider,
  theme,
  Button,
  Avatar,
  Dropdown,
  Space,
  Typography,
  Badge,
} from "antd";
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  PictureOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  GlobalOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { logoutAdmin } from "./login/action";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Handle responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992);
      if (window.innerWidth <= 992) {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    setMounted(true);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!mounted) return null;

  // Don't show layout on login page
  if (pathname === "/dashboard/login") {
    return (
      <ConfigProvider
        direction="rtl"
        theme={{
          token: {
            fontFamily: '"Playpen Sans Arabic", cursive',
            colorPrimary: "#01caa8",
            borderRadius: 12,
          },
        }}
      >
        {children}
      </ConfigProvider>
    );
  }

  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard">لوحة التحكم</Link>,
    },
    {
      key: "/dashboard/ordders",
      icon: <ShoppingCartOutlined />,
      label: <Link href="/dashboard/ordders">الطلبات</Link>,
    },
    {
      key: "/dashboard/products",
      icon: <ShoppingOutlined />,
      label: <Link href="/dashboard/products">المنتجات</Link>,
    },
    {
      key: "/dashboard/categories",
      icon: <AppstoreOutlined />,
      label: <Link href="/dashboard/categories">الفئات</Link>,
    },
    {
      key: "/dashboard/bannars",
      icon: <PictureOutlined />,
      label: <Link href="/dashboard/bannars">البنرات</Link>,
    },
    {
      key: "/dashboard/admins",
      icon: <UserOutlined />,
      label: <Link href="/dashboard/admins">المدراء</Link>,
    },
    {
      type: "divider",
    },
    {
      key: "/dashboard/settings",
      icon: <SettingOutlined />,
      label: <Link href="/dashboard/settings">الإعدادات</Link>,
    },
  ];

  // For Mobile Bottom Tabs
  const mobileTabs = [
    { key: "/dashboard", icon: <DashboardOutlined />, label: "الرئيسية" },
    {
      key: "/dashboard/ordders",
      icon: <ShoppingCartOutlined />,
      label: "الطلبات",
    },
    {
      key: "/dashboard/products",
      icon: <ShoppingOutlined />,
      label: "المنتجات",
    },
    {
      key: "/dashboard/categories",
      icon: <AppstoreOutlined />,
      label: "الفئات",
    },
    { key: "more", icon: <MoreOutlined />, label: "المزيد" },
  ];

  return (
    <ConfigProvider
      direction="rtl"
      theme={{
        token: {
          fontFamily: '"Playpen Sans Arabic", cursive',
          colorPrimary: "#01caa8",
          borderRadius: 12,
          colorBgContainer: "#ffffff",
        },
        components: {
          Layout: {
            headerBg: "#ffffff",
            siderBg: "#ffffff",
          },
          Menu: {
            itemSelectedBg: "#e6fffb",
            itemSelectedColor: "#01caa8",
            activeBarBorderWidth: 0,
          },
        },
      }}
    >
      <Layout style={{ minHeight: "100vh", direction: "rtl" }}>
        {/* Sidebar on the Right - Hidden on Mobile */}
        {!isMobile && (
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            trigger={null}
            theme="light"
            width={280}
            reverseArrow
            style={{
              overflow: "auto",
              height: "100vh",
              position: "fixed",
              right: 0,
              left: "auto",
              zIndex: 100,
              boxShadow: "0 0 20px rgba(0,0,0,0.05)",
              borderLeft: "1px solid #f0f0f0",
            }}
          >
            <div
              style={{
                height: 80,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 50,
                  background:
                    "linear-gradient(135deg, #01caa8 0%, #00b497 100%)",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s",
                  boxShadow: "0 4px 12px rgba(1, 202, 168, 0.2)",
                }}
              >
                {!collapsed ? (
                  <Title
                    level={4}
                    style={{ margin: 0, color: "white", fontSize: 18 }}
                  >
                    متجر المكملات
                  </Title>
                ) : (
                  <Title level={4} style={{ margin: 0, color: "white" }}>
                    S
                  </Title>
                )}
              </div>
            </div>

            <div style={{ padding: "0 16px", marginBottom: 16 }}>
              <Text
                type="secondary"
                style={{
                  fontSize: 12,
                  padding: "0 12px",
                  display: collapsed ? "none" : "block",
                }}
              >
                القائمة الرئيسية
              </Text>
            </div>

            <Menu
              theme="light"
              mode="inline"
              selectedKeys={[pathname]}
              items={menuItems}
              style={{ borderLeft: 0, borderRight: 0 }}
            />

            {!collapsed && (
              <div
                style={{
                  position: "absolute",
                  bottom: 24,
                  left: 24,
                  right: 24,
                  padding: 16,
                  background: "#f8fafc",
                  borderRadius: 12,
                  textAlign: "center",
                }}
              >
                <GlobalOutlined
                  style={{ color: "#01caa8", fontSize: 24, marginBottom: 8 }}
                />
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  نسخة النظام
                </div>
                <div
                  style={{ fontSize: 14, fontWeight: "bold", color: "#1e293b" }}
                >
                  v2.4.0
                </div>
              </div>
            )}
          </Sider>
        )}

        {/* Main Content Area */}
        <Layout
          style={{
            marginRight: isMobile ? 0 : collapsed ? 80 : 280,
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            background: "#f1f5f9",
            minHeight: "100vh",
            paddingBottom: isMobile ? 80 : 0, // Space for bottom tabs
          }}
        >
          <Header
            style={{
              padding: isMobile ? "0 16px" : "0 24px",
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "sticky",
              top: 0,
              zIndex: 99,
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              borderBottom: "1px solid #f1f5f9",
              height: 64,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: isMobile ? 8 : 16,
              }}
            >
              {!isMobile && (
                <Button
                  type="text"
                  icon={
                    collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                  }
                  onClick={() => setCollapsed(!collapsed)}
                  style={{
                    fontSize: "18px",
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f8fafc",
                  }}
                />
              )}
              {isMobile && (
                <div
                  style={{
                    width: 35,
                    height: 35,
                    background:
                      "linear-gradient(135deg, #01caa8 0%, #00b497 100%)",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  S
                </div>
              )}
              <Title
                level={5}
                style={{ margin: 0, fontSize: isMobile ? 16 : 20 }}
              >
                {menuItems.find((item) => item.key === pathname)?.label?.props
                  ?.children || "لوحة التحكم"}
              </Title>
            </div>

            <Space size={isMobile ? 8 : 20}>
              <Dropdown
                menu={{
                  onClick: async (e) => {
                    if (e.key === "logout") {
                      await logoutAdmin();
                      router.push("/dashboard/login");
                      router.refresh();
                    }

                    if (e.key === "settings") {
                      router.push("/dashboard/settings");
                    }
                  },
                  items: [
                    {
                      key: "settings",
                      label: "إعدادات الحساب",
                      icon: <SettingOutlined />,
                    },
                    { type: "divider" },
                    {
                      key: "logout",
                      label: "تسجيل الخروج",
                      icon: <LogoutOutlined />,
                      danger: true,
                    },
                  ],
                }}
                placement="bottomLeft"
                arrow
              >
                <Space
                  style={{
                    cursor: "pointer",
                    padding: isMobile ? "4px 4px" : "4px 12px",
                    borderRadius: 12,
                  }}
                >
                  <Avatar
                    src="https://api.dicebear.com/9.x/notionists/svg?seed=Felix"
                    style={{
                      backgroundColor: "#01caa8",
                      width: isMobile ? 32 : 40,
                      height: isMobile ? 32 : 40,
                    }}
                  />
                  {!isMobile && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        lineHeight: 1.2,
                      }}
                    >
                      <Text strong style={{ fontSize: 13 }}>
                        الادمن
                      </Text>
                      {/* <Text type="secondary" style={{ fontSize: 11 }}>المدير العام</Text> */}
                    </div>
                  )}
                </Space>
              </Dropdown>
            </Space>
          </Header>

          <Content
            style={{
              padding: isMobile ? "16px" : "32px",
              minHeight: 280,
            }}
          >
            <div
              style={{
                maxWidth: 1400,
                margin: "0 auto",
                animation: "fadeIn 0.5s ease-out",
              }}
            >
              {children}
            </div>
          </Content>
        </Layout>

        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <div className="mobile-bottom-nav">
            {mobileTabs.map((tab) => {
              if (tab.key === "more") {
                return (
                  <Dropdown
                    key="more"
                    menu={{
                      items: [
                        {
                          key: "/dashboard/bannars",
                          icon: <PictureOutlined />,
                          label: <Link href="/dashboard/bannars">البنرات</Link>,
                        },
                        {
                          key: "/dashboard/admins",
                          icon: <UserOutlined />,
                          label: <Link href="/dashboard/admins">المدراء</Link>,
                        },
                        {
                          key: "/dashboard/settings",
                          icon: <SettingOutlined />,
                          label: (
                            <Link href="/dashboard/settings">الإعدادات</Link>
                          ),
                        },
                      ],
                    }}
                    placement="topCenter"
                    trigger={["click"]}
                  >
                    <div className="nav-item">
                      <div className="nav-icon">
                        <MoreOutlined />
                      </div>
                      <div className="nav-label">المزيد</div>
                    </div>
                  </Dropdown>
                );
              }
              const isActive = pathname === tab.key;
              return (
                <Link
                  href={tab.key}
                  key={tab.key}
                  className={`nav-item ${isActive ? "active" : ""}`}
                >
                  <div className="nav-icon">{tab.icon}</div>
                  <div className="nav-label">{tab.label}</div>
                </Link>
              );
            })}
          </div>
        )}
      </Layout>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .ant-menu-item {
          margin: 4px 12px !important;
          border-radius: 8px !important;
          width: calc(100% - 24px) !important;
        }

        .ant-layout-sider-trigger {
          background: #ffffff !important;
          color: #1e293b !important;
          border-top: 1px solid #f0f0f0;
        }

        /* Mobile Bottom Nav Styles */
        .mobile-bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 70px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 0 10px;
          border-top: 1px solid #f1f5f9;
          z-index: 1000;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          text-decoration: none;
          transition: all 0.3s ease;
          flex: 1;
          height: 100%;
        }

        .nav-item.active {
          color: #01caa8;
        }

        .nav-icon {
          font-size: 20px;
          margin-bottom: 4px;
          transition: transform 0.3s ease;
        }

        .nav-item.active .nav-icon {
          transform: translateY(-2px);
        }

        .nav-label {
          font-size: 11px;
          font-weight: 500;
        }

        /* Fix for scrollbar in sidebar */
        .ant-layout-sider-children::-webkit-scrollbar {
          width: 4px;
        }
        .ant-layout-sider-children::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }

        /* Responsive adjustments for tables and cards */
        @media (max-width: 768px) {
          .ant-table-wrapper {
            overflow-x: auto;
          }
          .ant-card-body {
            padding: 12px !important;
          }
        }

        @media print {
          .mobile-bottom-nav,
          .ant-layout-sider,
          .ant-layout-header,
          .no-print {
            display: none !important;
          }
          .ant-layout {
            background: #fff !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .ant-layout-content {
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </ConfigProvider>
  );
}
