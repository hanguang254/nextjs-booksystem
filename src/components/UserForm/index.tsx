import { PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  TreeSelect,
  Upload,
  Image,
  message,
  Radio,
} from 'antd';
import { bookAdd } from '@/api/book';
import { BookAddType, CategoryType, UserType } from '@/type';
import { useRouter } from 'next/router';

import styles from './index.module.css'
import dayjs from 'dayjs';
import Content from '../Content';
import { getCategoryList } from '@/api/category';
import { UserAdd, UserUpdata } from '@/api/user';
import { USER_STATUS, USER_ROLE, USER_SEX } from '@/constant/user';

const { RangePicker } = DatePicker;
const { TextArea } = Input;


export default function UserForm({
  title,
  edidata ={
  sex:USER_SEX.MALE,
  role:USER_ROLE.USER,
  status: USER_STATUS.ON
}}:{
  title:string,
  edidata?:Partial<UserType>
}) {
  const [preview,setPreview] = useState("")
  const [categoryList ,setCategoryList] = useState<CategoryType[]>([]);
  const [form] = Form.useForm()
  const router = useRouter()

  const handleFinsh =async (values:UserType)=>{
    if(edidata?._id){
      await UserUpdata(values);
    }else{
      await UserAdd(values);
    }
    message.success("添加成功！")
    router.push('/user')
  }

  useEffect(() => {
    getCategoryList({all:true}).then(res =>{
      setCategoryList(res.data)
    })
  }, [])

  useEffect(()=>{
    if(edidata._id){
      form.setFieldsValue(edidata)
    }
  },[edidata,form])
  

  return (
    <Content title='用户添加'>
      <Form
        form={form}
        className={styles['form']}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        initialValues={edidata}
        layout="horizontal"
        onFinish={handleFinsh}
      >
        <Form.Item 
          label="账号" 
          name='name' 
          rules={[
            { 
              required:true,
            },
          ]}>
          <Input placeholder='请输入账号'/>
        </Form.Item>
        <Form.Item 
          label="名称" 
          name='nickName'
          rules={[
              { 
                required:true,
              },
            ]}>
          <Input placeholder='请输入名称'/>
        </Form.Item>
        <Form.Item 
          label="性别" 
          name='sex'
          rules={[
            { 
              required:true,
            },
          ]}
        >
          <Radio.Group>
            <Radio value='male'>男</Radio>
            <Radio value='female'>女</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="密码" name='password'>
            <Input.Password 
              placeholder='请输入' 
              style={{ width: "calc(100% - 63px)" }}
            />
        </Form.Item>
        <Form.Item label="状态" name='status'>
          <Radio.Group>
            <Radio value='on'>启用</Radio>
            <Radio value='off'>禁用</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="角色" name='role'>
          <Radio.Group>
            <Radio value='user'>用户</Radio>
            <Radio value='admin'>管理员</Radio>
          </Radio.Group>
        </Form.Item>
         
        <Form.Item label=" " colon={false}>
          <Button 
            type='primary' 
            htmlType='submit' 
            className={styles['btn']}
            size='large'
          >创建</Button>
        </Form.Item>
      </Form>
    </Content>
  )
}
