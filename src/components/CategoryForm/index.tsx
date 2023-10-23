import { PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useMemo, useState } from 'react';
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
import {  CategoryAdd} from '@/api/category';
import { getCategoryList } from '@/api/category';
import { BookAddType, CategoryType } from '@/type';
import { useRouter } from 'next/router';

import styles from './index.module.css'
import dayjs from 'dayjs';
import Content from '../Content';
import { LEVEL_OPTIONS } from '@/pages/category';

const { RangePicker } = DatePicker;
const { TextArea } = Input;


export default function CategoryForm({title}:{title:string}) {
  const [level ,setLevel] = useState(1);
  const [levelOneList,setLevelOneList] = useState<CategoryType[]>([])

  const [form] = Form.useForm()
  const router = useRouter()

  const handleFinsh =async (values:CategoryType)=>{
    if(values.publishAt){
      values.publishAt =dayjs(values.publishAt).valueOf();
    }
    console.log(values);
    await  CategoryAdd(values)
    message.success("添加成功！")
    router.push('/category')
  }

  //获取级别的数据
  useEffect(() => {
    async function fetchData() {
      const res =await getCategoryList({ all:true,level:1 });
      console.log(res.data);
      
      setLevelOneList(res.data)
    }
    fetchData()
  },[])


  const levelOneOptions = useMemo(()=>{
    return levelOneList.map(item=>({
      value:item._id,
      label:item.name,
    }))
  },[levelOneList])
      
  return (
    <Content title={title}>
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
          label="级别" 
          name='level'
          rules={[
              { 
                required:true,
                message:'请选择级别'
              },
            ]}>
          <Select onChange={(value)=>{
            console.log(value);
            setLevel(value)
          }} placeholder='请选择' options={LEVEL_OPTIONS} />
        </Form.Item>

        {level === 2 &&<Form.Item 
          label="所属级别" 
          name='parent'
          rules={[
              { 
                required:true,
              },
            ]}>
          <Select options={levelOneOptions} />
        </Form.Item>}
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
