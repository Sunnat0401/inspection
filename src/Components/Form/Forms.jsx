import React from 'react';
import { Form, Input, Button, notification } from 'antd';
import './Forms.css';

const passportIDValidator = (_, value) => {
  if (!value) {
    return Promise.reject(new Error('Iltimos ID karta raqamini kiriting ?!'));
  }
  const regex = /^[A-Z]{2}\d{7}$/;
  if (!regex.test(value)) {
    return Promise.reject(new Error('Pasport raqami ikkita harf va 7 ta raqamdan tashkil topishi kerak !?'));
  }
  return Promise.resolve();
};

const passwordValidator = (_, value) => {
  if (!value) {
    return Promise.reject(new Error('Iltimos parol kiriting !'));
  }
  const regex = /^\d{9}$/;
  if (!regex.test(value)) {
    return Promise.reject(new Error('Parol 9 ta raqamdan iborat bo\'lishi kerak'));
  }
  return Promise.resolve();
};

const phoneValidator = (_, value) => {
  if (!value) {
    return Promise.reject(new Error('Iltimos Raqamingizni kiriting!'));
  }
  const regex = /^\+998\d{9}$/;
  if (!regex.test(value)) {
    return Promise.reject(new Error('Raqam +998 bilan boshlanishi hamda 9 ta raqamdan tashkil topishi kerak !'));
  }
  return Promise.resolve();
};

const capitalizeUser = (string) => {
  return string.toUpperCase();
};

const Forms = () => {
  const [form] = Form.useForm();

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    form.setFieldsValue({ username: capitalizeUser(value) });
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    // Allow only numeric input and limit length to 9 digits
    const numericValue = value.replace(/\D/g, ''); // Remove non-numeric characters
    if (numericValue.length <= 9) {
      form.setFieldsValue({ password: numericValue });
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Remove non-numeric characters except '+'
    const numericValue = value.replace(/[^+\d]/g, '');
    // Allow up to 13 characters (+998 + 9 digits)
    if (numericValue.length <= 13) {
      form.setFieldsValue({ phone: numericValue });
    }
  };

  const onFinish = (values) => {
    console.log('Values:', values);
    notification.success({
      message: 'Congratulations!',
      description: 'Barcha malumotlarni to\'g\'ri kiritdingiz 👍🎉✔',
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className='forms'>
      <Form
        form={form}
        className='ant-form'
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        autoComplete="off"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.reject(new Error('Please input your username!'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input onChange={handleUsernameChange} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              validator: passwordValidator,
            },
          ]}
        >
          <Input 
            type="text" 
            onChange={handlePasswordChange} 
            maxLength={9} // Enforce length limit
            placeholder="Enter 9-digit password"
          />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[
            {
              validator: phoneValidator,
            },
          ]}
        >
          <Input 
            onChange={handlePhoneChange}
            placeholder="Enter phone number"
            maxLength={13} // Limit input length to 13 characters
          />
        </Form.Item>

        <Form.Item
          label="Passport ID"
          name="passportID"
          rules={[
            {
              validator: passportIDValidator,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Forms;
