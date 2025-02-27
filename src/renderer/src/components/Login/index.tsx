import { useState } from 'react';
import { Input, Form, Button, Divider, message } from 'antd';
import { PhoneFilled, MessageOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import { useNavigate } from "react-router";
import * as service from '@renderer/api/login'
import { setLocalStorage, TokenKey } from '@renderer/utils/common';
import { ILoginField } from '@renderer/interface/login';


function Page() {
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const phone = Form.useWatch('phone', form);

  const onFinish: FormProps<ILoginField>['onFinish'] = async (values) => {
    setLoading(true);
    try {
      const { access_token, token_type } = await service.login({
        json: { phone: values.phone, code: values.code },
      });
      setLocalStorage(TokenKey, `${token_type} ${access_token}`);
      navigate('/versions');
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSendCode = async () => {
    try {
      await service.sendCode({ params: { phone } });
      let count = 60;
      setCountdown(count);
      const interval = setInterval(() => {
        count -= 1;
        setCountdown(count);
        if (count <= 0) {
          clearInterval(interval);
          setCountdown(0);
        }
      }, 1000);
    } catch (error) {
      message.error('发送验证码失败，请稍后再试');
    }
  };

  function validatePhoneNumber(rule: any, value: string, callback: (error?: string) => void) {
    // 正则表达式验证电话号码
    const phoneNumberRegex = /^1[3-9]\d{9}$/;
    if (!value) {
      setDisabled(true);
      return Promise.reject('请输入电话号码');
    }
    if (phoneNumberRegex.test(value)) {
      setDisabled(false);
      return Promise.resolve();
    }
    setDisabled(true);
    return Promise.reject('请输入有效的电话号码');
  }

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='bg-white p-8 rounded-md shadow-md w-96'>
        <div>后台管理系统</div>
        <Divider />
        <Form form={form} onFinish={onFinish} autoComplete='off'>
          <Form.Item<ILoginField> name='phone' rules={[{ validator: validatePhoneNumber }]}>
            <Input
              id='phone'
              prefix={<PhoneFilled style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder='电话号码'
              maxLength={11}
            />
          </Form.Item>

          <Form.Item<ILoginField> name='code' rules={[{ required: true, message: '请输入验证码!' }]}>
            <div className='flex items-center'>
              <Input
                prefix={<MessageOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder='验证码'
                maxLength={6}
                style={{ marginRight: '8px', flexGrow: 1 }}
              />
              <Button type='default' onClick={handleSendCode} disabled={countdown > 0 || disabled}>
                {countdown > 0 ? `${countdown}s 后重发` : '发送验证码'}
              </Button>
            </div>
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Page;
