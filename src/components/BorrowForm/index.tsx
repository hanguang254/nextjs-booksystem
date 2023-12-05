import styles from '@/styles/home.module.css'
import Content from '@/components/Content'
import { Button, Form,  Select, message,} from 'antd'
import React, { useEffect, useState } from 'react'
import { getUserList } from '@/api/user';
import { getBookList } from '@/api/book';
import { BorrowType } from '@/type';
import { borrowAdd, borrowUpdata } from '@/api/borrow';

export default function BorrowForm({title,editData}:{title:string}) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [form] =Form.useForm();

  const [userList,setuserList] = useState([]);
  const [bookList,setbookList] = useState([]);
  const [stock,setStock] = useState(0)


  const handleFinsh = async(value:BorrowType)=>{
    console.log(value);
    try {
      if (editData?.id) { //编辑
        await borrowUpdata(value).then(()=>{
          message.success('编辑成功')
        })
      } else {//创建
        await borrowAdd(value).then(()=>{
          message.success('创建成功')
        })
      }
    } catch (error) {
      console.log(error);
      
    }
    
  };


  useEffect(() => {
    getUserList().then(res=>{
      setuserList(res.data);
    });
    getBookList().then(res=>{
      setbookList(res.data);
    });
  }, []);
  
  const handleBookChange =(value,options)=>{
    console.log(value,options);
    setStock(options.stock);
    
  }

  return (
    <Content title={title}>
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
        onFinish={handleFinsh}
      >
        <Form.Item 
          label="书籍名称" 
          name='book' 
          rules={[
            { 
              required:true,
            },
          ]}>
          <Select 
            onChange = {handleBookChange}
            placeholder='请选择' 
            options={
              bookList.map(item =>({
                label:item.name,
                value:item._id,
                stock:item.stock
              }))
            }>
          </Select>
        </Form.Item>
        <Form.Item 
          label="借阅用户" 
          name='user'
          rules={[
              { 
                required:true,
              },
            ]}>
          <Select placeholder='请选择' options={userList.map(item =>({label:item.name,value:item._id}))}></Select>
        </Form.Item>
        <Form.Item 
          label="书籍库存" 
          rules={[
            { 
              required:true,
            },
          ]}
        >
          {stock}
        </Form.Item>
        <Form.Item label=" " colon={false}>
          <Button 
            type='primary' 
            htmlType='submit' 
            className={styles['btn']}
            size='large'
            disabled={stock<=0}
          >创建</Button>
        </Form.Item>
      </Form>
    </Content>
  )
}
