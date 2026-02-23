import { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Space, Card, message, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined, SaveOutlined, CheckOutlined } from '@ant-design/icons';
import { articleAPI } from '@/services/api';
import type { Article, ArticleCreateDTO } from '@/types';

const { TextArea } = Input;
const { Option } = Select;

const ArticleEdit = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      loadArticle();
    }
  }, [id]);

  const loadArticle = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await articleAPI.get(Number(id));
      if (response.data.code === 0) {
        const article = response.data.data;
        form.setFieldsValue({
          ...article,
          tags: article.tags.join(', '),
        });
      }
    } catch (error) {
      message.error('Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const data: ArticleCreateDTO = {
        ...values,
        tags: values.tags ? values.tags.split(',').map((tag: string) => tag.trim()) : [],
      };

      if (isEditMode && id) {
        await articleAPI.update(Number(id), data);
        message.success('Article updated successfully');
      } else {
        await articleAPI.create(data);
        message.success('Article created successfully');
      }

      navigate('/articles');
    } catch (error) {
      message.error(isEditMode ? 'Failed to update article' : 'Failed to create article');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublish = async () => {
    try {
      const values = await form.validateFields();
      values.status = 'published';
      await handleSubmit(values);
    } catch (error) {
      message.error('Please fill in all required fields');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/articles')}
          style={{ marginRight: 16 }}
        >
          Back
        </Button>
        <span style={{ fontSize: 24, fontWeight: 'bold' }}>
          {isEditMode ? 'Edit Article' : 'Create Article'}
        </span>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: 'draft',
            category: '',
            tags: '',
          }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please input article title' }]}
          >
            <Input placeholder="Enter article title" size="large" />
          </Form.Item>

          <Form.Item
            label="Summary"
            name="summary"
            rules={[{ required: true, message: 'Please input article summary' }]}
          >
            <TextArea
              placeholder="Enter article summary"
              rows={3}
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item
            label="Content"
            name="content"
            rules={[{ required: true, message: 'Please input article content' }]}
          >
            <TextArea
              placeholder="Enter article content (Placeholder for rich text editor)"
              rows={15}
              showCount
            />
          </Form.Item>

          <Form.Item
            label="Cover Image URL"
            name="coverImage"
          >
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select placeholder="Select category" size="large">
              <Option value="Technology">Technology</Option>
              <Option value="Business">Business</Option>
              <Option value="Lifestyle">Lifestyle</Option>
              <Option value="News">News</Option>
              <Option value="Education">Education</Option>
              <Option value="Entertainment">Entertainment</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Tags"
            name="tags"
            help="Comma-separated tags (e.g., tech, ai, innovation)"
          >
            <Input placeholder="tag1, tag2, tag3" />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select size="large">
              <Option value="draft">Draft</Option>
              <Option value="published">Published</Option>
              <Option value="archived">Archived</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={submitting}
                size="large"
              >
                Save as Draft
              </Button>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                loading={submitting}
                size="large"
                style={{ background: '#52c41a', borderColor: '#52c41a' }}
                onClick={handlePublish}
              >
                Publish
              </Button>
              <Button size="large" onClick={() => navigate('/articles')}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ArticleEdit;
