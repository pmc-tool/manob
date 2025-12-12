// MIGRATION: Support page from PMC
'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Input, Form, Select, Collapse, Empty, Tag, message } from 'antd';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { DashboardLayout } from '@/components/pmc-migrated/shared/DashboardLayout';
import { supportApi } from '@/lib/api/support';
import type { SupportTicket } from '@/lib/api/types';
import { handleError } from '@/lib/api/error-handler';
import { LoadingState } from '@/components/pmc-migrated/shared/LoadingState';
import { useAuth } from '@/context/AuthContext';

const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;

export default function SupportPage() {
  const { isAuthenticated } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [faq, setFaq] = useState<{ id: string; question: string; answer: string; category: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ticketsData, faqData] = await Promise.all([
          isAuthenticated ? supportApi.getTickets() : Promise.resolve({ tickets: [] }),
          supportApi.getFAQ(),
        ]);
        setTickets(ticketsData.tickets);
        setFaq(faqData.articles);
      } catch (err) {
        handleError(err as Parameters<typeof handleError>[0], { showToast: true });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const handleCreateTicket = async (values: { subject: string; description: string; category: string; priority: string }) => {
    try {
      setCreating(true);
      const ticket = await supportApi.createTicket(values as any);
      setTickets((prev) => [ticket, ...prev]);
      message.success('Support ticket created');
      setShowCreateForm(false);
      form.resetFields();
    } catch (err) {
      handleError(err as Parameters<typeof handleError>[0], { showToast: true });
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Support">
        <LoadingState message="Loading..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Support"
      subtitle="Get help and submit support requests"
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Support' }]}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* FAQ */}
          <Card title="Frequently Asked Questions" className="rounded-2xl">
            {faq.length === 0 ? (
              <Empty description="No FAQ articles available" />
            ) : (
              <Collapse accordion>
                {faq.map((item) => (
                  <Panel
                    header={item.question}
                    key={item.id}
                    extra={<Tag>{item.category}</Tag>}
                  >
                    <p>{item.answer}</p>
                  </Panel>
                ))}
              </Collapse>
            )}
          </Card>

          {/* My Tickets */}
          {isAuthenticated && (
            <Card
              title="My Support Tickets"
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setShowCreateForm(true)}
                >
                  New Ticket
                </Button>
              }
              className="rounded-2xl"
            >
              {tickets.length === 0 ? (
                <Empty description="No support tickets" />
              ) : (
                <div className="space-y-3">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                    >
                      <div>
                        <h4 className="font-medium">{ticket.subject}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Tag
                        color={
                          ticket.status === 'open'
                            ? 'blue'
                            : ticket.status === 'resolved'
                            ? 'green'
                            : 'default'
                        }
                      >
                        {ticket.status}
                      </Tag>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Create Ticket Form */}
          {showCreateForm && (
            <Card title="Create Support Ticket" className="rounded-2xl">
              <Form form={form} layout="vertical" onFinish={handleCreateTicket}>
                <Form.Item
                  name="subject"
                  label="Subject"
                  rules={[{ required: true, message: 'Please enter a subject' }]}
                >
                  <Input placeholder="Brief description of your issue" />
                </Form.Item>
                <Form.Item
                  name="category"
                  label="Category"
                  rules={[{ required: true, message: 'Please select a category' }]}
                >
                  <Select placeholder="Select category">
                    <Option value="general">General Inquiry</Option>
                    <Option value="order">Order Issue</Option>
                    <Option value="payment">Payment Problem</Option>
                    <Option value="account">Account Help</Option>
                    <Option value="technical">Technical Support</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="priority"
                  label="Priority"
                  initialValue="medium"
                >
                  <Select>
                    <Option value="low">Low</Option>
                    <Option value="medium">Medium</Option>
                    <Option value="high">High</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[{ required: true, message: 'Please describe your issue' }]}
                >
                  <TextArea rows={4} placeholder="Describe your issue in detail" />
                </Form.Item>
                <div className="flex gap-3">
                  <Button type="primary" htmlType="submit" loading={creating}>
                    Submit Ticket
                  </Button>
                  <Button onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="rounded-2xl text-center">
            <QuestionCircleOutlined className="mb-4 text-4xl text-blue-500" />
            <h3 className="mb-2 text-lg font-semibold">Need Help?</h3>
            <p className="mb-4 text-gray-500">
              Our support team is here to help you with any questions.
            </p>
            {!isAuthenticated && (
              <Link href="/sign-in">
                <Button type="primary" block>
                  Sign In to Submit a Ticket
                </Button>
              </Link>
            )}
          </Card>

          <Card title="Contact Us" className="rounded-2xl">
            <div className="space-y-3 text-sm">
              <p>
                <strong>Email:</strong> support@packmycode.com
              </p>
              <p>
                <strong>Hours:</strong> Mon-Fri 9am-6pm EST
              </p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
