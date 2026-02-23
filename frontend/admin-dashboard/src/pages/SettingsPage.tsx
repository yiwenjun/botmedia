import { Form, Input, Button, Card, Divider, Space, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const SettingsPage = () => {
  const [systemForm] = Form.useForm();
  const [wechatForm] = Form.useForm();

  const handleSystemSubmit = (values: any) => {
    console.log('System settings:', values);
    message.success('System settings saved successfully');
  };

  const handleWechatSubmit = (values: any) => {
    console.log('WeChat settings:', values);
    message.success('WeChat settings saved successfully');
  };

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Settings</h1>

      {/* System Settings */}
      <Card title="System Settings" style={{ marginBottom: 24 }}>
        <Form
          form={systemForm}
          layout="vertical"
          onFinish={handleSystemSubmit}
          initialValues={{
            siteName: 'BotMedia Platform',
            siteDescription: 'A comprehensive content and e-commerce platform',
            contactEmail: 'admin@botmedia.com',
            supportPhone: '+1 (555) 123-4567',
          }}
        >
          <Form.Item
            label="Site Name"
            name="siteName"
            rules={[{ required: true, message: 'Please input site name' }]}
          >
            <Input placeholder="Enter site name" size="large" />
          </Form.Item>

          <Form.Item
            label="Site Description"
            name="siteDescription"
            rules={[{ required: true, message: 'Please input site description' }]}
          >
            <Input.TextArea
              placeholder="Enter site description"
              rows={3}
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item
            label="Contact Email"
            name="contactEmail"
            rules={[
              { required: true, message: 'Please input contact email' },
              { type: 'email', message: 'Please input a valid email' },
            ]}
          >
            <Input placeholder="contact@example.com" size="large" />
          </Form.Item>

          <Form.Item
            label="Support Phone"
            name="supportPhone"
          >
            <Input placeholder="+1 (555) 123-4567" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large">
              Save System Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* WeChat Configuration */}
      <Card title="WeChat Mini Program Configuration" style={{ marginBottom: 24 }}>
        <Form
          form={wechatForm}
          layout="vertical"
          onFinish={handleWechatSubmit}
          initialValues={{
            appId: 'wx1234567890abcdef',
            appSecret: '********************************',
            token: 'botmedia_token_2024',
            encodingAESKey: '********************************',
          }}
        >
          <Form.Item
            label="App ID"
            name="appId"
            help="WeChat Mini Program App ID (Display Only)"
          >
            <Input placeholder="wxXXXXXXXXXXXXXXXX" size="large" disabled />
          </Form.Item>

          <Form.Item
            label="App Secret"
            name="appSecret"
            help="WeChat Mini Program App Secret (Hidden)"
          >
            <Input.Password placeholder="Enter App Secret" size="large" disabled />
          </Form.Item>

          <Form.Item
            label="Token"
            name="token"
            help="Server configuration token (Display Only)"
          >
            <Input placeholder="Enter token" size="large" disabled />
          </Form.Item>

          <Form.Item
            label="EncodingAESKey"
            name="encodingAESKey"
            help="Message encryption key (Hidden)"
          >
            <Input.Password placeholder="Enter EncodingAESKey" size="large" disabled />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large" disabled>
                Save WeChat Settings
              </Button>
              <span style={{ color: '#999', fontSize: 12 }}>
                (Configuration updates are managed by system administrator)
              </span>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* API Configuration */}
      <Card title="API Configuration">
        <Form layout="vertical">
          <Form.Item label="API Base URL" help="Base URL for backend API">
            <Input
              value={import.meta.env.VITE_API_BASE_URL || '/api/v1'}
              size="large"
              disabled
            />
          </Form.Item>

          <Form.Item label="API Version">
            <Input value="v1.0.0" size="large" disabled />
          </Form.Item>

          <Divider />

          <div style={{ padding: '16px', background: '#f5f5f5', borderRadius: 8 }}>
            <h3 style={{ marginTop: 0 }}>Environment Information</h3>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <strong>Mode:</strong> {import.meta.env.MODE}
              </div>
              <div>
                <strong>Base URL:</strong> {import.meta.env.BASE_URL}
              </div>
              <div>
                <strong>Production:</strong> {import.meta.env.PROD ? 'Yes' : 'No'}
              </div>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default SettingsPage;
