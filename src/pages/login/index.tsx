import { Button, Form, Input, message } from 'antd'
import Head from 'next/head'
import React from 'react'
import styles from './index.module.css'
import { login } from '@/api/user'
import { useRouter } from 'next/router'

export default function Index() {
  const router = useRouter()
  const handleFinish =async (values:{name:string,password:string})=>{
    console.log(values);
    const res = await login(values);
    if(res){
      message.success('登录成功')
      router.push('/book')
    }
  }
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>管理系统</h2>
      <Form onFinish={handleFinish}>
        <Form.Item label='账号' name='name' 
        rules={[{
          required:true,
          message:"请输入账号"
          }]}>
            <Input placeholder='请输入账号'></Input>
        </Form.Item>
        <Form.Item label='密码' name='password' 
        rules={[{
          required:true,
          message:"请输入密码"
          }]}>
            <Input.Password placeholder='请输入密码'></Input.Password>
        </Form.Item>
        <Form.Item>
          <Button 
          type='primary' 
          htmlType='submit'
          className={styles.btn}
          >登录</Button>
        </Form.Item>
      </Form>
    </div>
  )
}
