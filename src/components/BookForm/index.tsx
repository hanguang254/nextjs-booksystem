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
} from 'antd';
import { bookAdd } from '@/api/book';
import { BookAddType, CategoryType } from '@/type';
import { useRouter } from 'next/router';

import styles from './index.module.css'
import dayjs from 'dayjs';
import Content from '../Content';
import { getCategoryList } from '@/api/category';

const { RangePicker } = DatePicker;
const { TextArea } = Input;


export default function BookForm() {
  const [preview,setPreview] = useState("")
  const [categoryList ,setCategoryList] = useState<CategoryType[]>([]);
  const [form] = Form.useForm()
  const router = useRouter()

  const handleFinsh =async (values:BookAddType)=>{
    if(values.publishAt){
      values.publishAt =dayjs(values.publishAt).valueOf();
    }
    console.log(values);
    await bookAdd(values)
    message.success("添加成功！")
    router.push('/book')
  }

  useEffect(() => {
    getCategoryList({all:true}).then(res =>{
      setCategoryList(res.data)
    })
  }, [])
  

  return (
    <Content title='图书添加'>
      <Form
        form={form}
        className={styles['form']}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
        onFinish={handleFinsh}
      >
        <Form.Item 
          label="名称" 
          name='name' 
          rules={[
            { 
              required:true,
            },
          ]}>
          <Input placeholder='请输入'/>
        </Form.Item>
        <Form.Item 
          label="作者" 
          name='author'
          rules={[
              { 
                required:true,
              },
            ]}>
          <Input placeholder='请输入'/>
        </Form.Item>
        <Form.Item 
          label="分类" 
          name='category'
          rules={[
            { 
              required:true,
            },
          ]}
        >
          <Select placeholder='请选择' options={categoryList.map(item =>({label:item.name,value:item._id}))}></Select>
        </Form.Item>
        <Form.Item 
          label="封面" 
          name='cover'
        >
          <Input.Group compact>
            <Input 
              placeholder='请输入' 
              style={{ width: "calc(100% - 63px)" }}
              onChange={(e)=>{
                  console.log(e.target.value);
                  form.setFieldValue('cover',e.target.value)
                  
                }}
              />
            <Button 
              type='primary'
              onClick={()=>{
                setPreview(form.getFieldValue('cover'))
              }}
            >预览</Button>
          </Input.Group>
        </Form.Item>
        {preview && <Form.Item label=' ' colon={false}>
          <Image src={preview} width={100} height={100} alt=''/>
        </Form.Item>}
        <Form.Item label="出版日期" name='publishAt'>
          <DatePicker />
        </Form.Item>
        <Form.Item 
          label="库存" 
          name='stock'
        >
          <InputNumber placeholder='请输入' />
        </Form.Item>
        <Form.Item label="描述" name='description'>
          <TextArea rows={4} placeholder='请输入'/>
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
