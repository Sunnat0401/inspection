import React from 'react';
import { Form, Input, Button, notification } from 'antd';
import './Forms.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const passportIDValidator = (_, value) => {
  if (!value) {
    return Promise.reject(new Error('Iltimos ID karta raqamini kiriting ?!'));
  }
  const regex = /^[A-Z]{2}\d{7}$/;
  if (!regex.test(value)) {
    return Promise.reject(new Error('Pasport raqami faqat ikkita katta harf va 7 ta raqamdan tashkil topishi kerak !?'));
  }
  return Promise.resolve();
};

const passwordValidator = (_, value) => {
  if (!value) {
    return Promise.reject(new Error('Iltimos parol kiriting !'));
  }
  const regex = /^\d{9}$/;
  if (!regex.test(value)) {
    return Promise.reject(new Error('Parol 9 ta raqamdan iborat bo"lishi kerak'));
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

const formatPassportID = (value) => {
  const cleanedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const letters = cleanedValue.slice(0, 2); 
  const digits = cleanedValue.slice(2);    
  const formattedDigits = digits.replace(/\D/g, '').slice(0, 7);
  return letters + formattedDigits;
};

const Forms = () => {
  const [form] = Form.useForm();

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    form.setFieldsValue({ username: capitalizeUser(value) });
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, ''); 
    if (numericValue.length <= 9) {
      form.setFieldsValue({ password: numericValue });
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^+\d]/g, '');
    if (numericValue.length <= 13) {
      form.setFieldsValue({ phone: numericValue });
    }
  };

  const handlePassportIDChange = (e) => {
    const value = e.target.value;
    form.setFieldsValue({ passportID: formatPassportID(value) });
  };

  const exportToExcel = (data, fileName) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, `${fileName}.xlsx`);
  };

  const onFinish = (values) => {
    console.log('Values:', values);
    notification.success({
      message: 'Congratulations!',
      description: 'Barcha malumotlarni to\'g\'ri kiritdingiz 👍🎉✔',
    });
    exportToExcel([values], 'Form_Data');
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
          label="Ism"
          name="username"
          rules={[
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.reject(new Error('Iltimos ismingizni kiriting !'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
           onChange={handleUsernameChange}
           placeholder="Ismingizni kiriting "
           />
        </Form.Item>

        <Form.Item
          label="Parol"
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
            maxLength={9}
            placeholder="9 xonali parolni kiriting "
          />
        </Form.Item>

        <Form.Item
          label="Telefon raqam"
          name="phone"
          rules={[
            {
              validator: phoneValidator,
            },
          ]}
        >
          <Input 
            onChange={handlePhoneChange}
            placeholder="Raqamingizni kiriting !"
            maxLength={13}
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
          <Input
           onChange={handlePassportIDChange}
             placeholder="Passport ID ni kiriting !"
           />
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
