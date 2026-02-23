import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Select, Space, Card, message, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { productAPI } from '@/services/api';
import type { ProductCreateDTO } from '@/types';

const { TextArea } = Input;
const { Option } = Select;

const ProductEdit = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await productAPI.get(Number(id));
      if (response.data.code === 0) {
        const product = response.data.data;
        form.setFieldsValue({
          ...product,
          images: product.images.join(', '),
          specifications: JSON.stringify(product.specifications, null, 2),
        });
      }
    } catch (error) {
      message.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const data: ProductCreateDTO = {
        ...values,
        images: values.images
          ? values.images.split(',').map((img: string) => img.trim())
          : [],
        specifications: values.specifications
          ? JSON.parse(values.specifications)
          : {},
      };

      if (isEditMode && id) {
        await productAPI.update(Number(id), data);
        message.success('Product updated successfully');
      } else {
        await productAPI.create(data);
        message.success('Product created successfully');
      }

      navigate('/products');
    } catch (error: any) {
      if (error.message?.includes('JSON')) {
        message.error('Invalid JSON format in specifications');
      } else {
        message.error(isEditMode ? 'Failed to update product' : 'Failed to create product');
      }
    } finally {
      setSubmitting(false);
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
          onClick={() => navigate('/products')}
          style={{ marginRight: 16 }}
        >
          Back
        </Button>
        <span style={{ fontSize: 24, fontWeight: 'bold' }}>
          {isEditMode ? 'Edit Product' : 'Create Product'}
        </span>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: 'active',
            price: 0,
          }}
        >
          <Form.Item
            label="Product Name"
            name="name"
            rules={[{ required: true, message: 'Please input product name' }]}
          >
            <Input placeholder="Enter product name" size="large" />
          </Form.Item>

          <Form.Item
            label="Model"
            name="model"
            rules={[{ required: true, message: 'Please input product model' }]}
          >
            <Input placeholder="Enter product model" size="large" />
          </Form.Item>

          <Form.Item
            label="Brand"
            name="brand"
            rules={[{ required: true, message: 'Please input brand name' }]}
          >
            <Input placeholder="Enter brand name" size="large" />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: 'Please input price' }]}
          >
            <InputNumber
              placeholder="0.00"
              size="large"
              style={{ width: '100%' }}
              min={0}
              step={0.01}
              precision={2}
              prefix="$"
            />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select placeholder="Select category" size="large">
              <Option value="Electronics">Electronics</Option>
              <Option value="Computers">Computers</Option>
              <Option value="Smartphones">Smartphones</Option>
              <Option value="Tablets">Tablets</Option>
              <Option value="Accessories">Accessories</Option>
              <Option value="Wearables">Wearables</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
          >
            <TextArea
              placeholder="Enter product description"
              rows={4}
              showCount
              maxLength={1000}
            />
          </Form.Item>

          <Form.Item
            label="Specifications (JSON)"
            name="specifications"
            help="Enter specifications in JSON format, e.g., {&quot;CPU&quot;: &quot;Intel i7&quot;, &quot;RAM&quot;: &quot;16GB&quot;}"
          >
            <TextArea
              placeholder='{"CPU": "Intel i7", "RAM": "16GB", "Storage": "512GB SSD"}'
              rows={6}
              style={{ fontFamily: 'monospace' }}
            />
          </Form.Item>

          <Form.Item
            label="Image URLs"
            name="images"
            help="Comma-separated image URLs"
            rules={[{ required: true, message: 'Please input at least one image URL' }]}
          >
            <TextArea
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              rows={3}
            />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select size="large">
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
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
                {isEditMode ? 'Update Product' : 'Create Product'}
              </Button>
              <Button size="large" onClick={() => navigate('/products')}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProductEdit;
