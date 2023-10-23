import { 
  Button, 
  Col, 
  Form, 
  Input, 
  Row, 
  Select, 
  Space, 
  Table, 
  TablePaginationConfig,
  Image,
  message
 } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

import styles from './index.module.css'

import {bookDelete, getBookList} from '@/api/book'
import { BookQueryType, CategoryType } from '@/type'
import dayjs from 'dayjs'

import Content from '@/components/Content'
import { getCategoryList } from '@/api/category'



export default function Index() {
  const [form] =Form.useForm();
  const router = useRouter();
  const [data,setData] = useState();
  const [categoryList ,setCategoryList] = useState<CategoryType[]>([]);
  

  const [pagination,setPagination] = useState<TablePaginationConfig>({
    current:1,
    pageSize:10,
    showSizeChanger:true,
    total:0
  });

  async function fetchData(search?:any) {
      //数据
      const res = await getBookList(
      {
        current : pagination.current, 
        pageSize : pagination.pageSize,
        ...search
      });
      // console.log(res);
      const { data } =res
      
      const dataWithKey = data.map((item:object, index:Number) => ({
        ...item,
        key: index.toString(), // 使用数组索引作为key，或者使用item.id（如果有的话）
      }));
      // console.log(dataWithKey);
      setData(dataWithKey);
      setPagination({...pagination, total:res.total})
  }

  useEffect(() => {
    
    fetchData()
    getCategoryList({all:true}).then(res =>{
      setCategoryList(res.data)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  
  

  //搜索点击事件
  const handleSerchClick=async (values:BookQueryType)=>{
    // console.log(values);
    const res = await getBookList({...values,current:1,pageSize:pagination.pageSize})
    setData(res.data)
    setPagination({...pagination,current:1,total:res.total})
  }

  //搜索清空
  const handleSerchResetClick =( ) =>{
    console.log(form);
    form.resetFields()
    
  }

  //编辑跳转
  const handleEditClick = ()=>{
    router.push('/book/edit/id')
  }

  //Table事件
  const handleTableChange =(pagination: TablePaginationConfig)=>{
      console.log(pagination);
      setPagination(pagination)
      const query = form.getFieldsValue()
      getBookList({
        current: pagination.current,
        pageSize: pagination.pageSize,
        ...query
      })
      
  }

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width:200
    },
    {
      title: '封面',
      dataIndex: 'cover',
      key: 'cover',
      width:120,
      render:(text:string)=>{
        return <Image width={100} src={text} alt=''/>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      width:120,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width:80
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width:300
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
      width:80
    },
    {
      title: '创建时间',
      dataIndex: 'time',
      key: 'time',
      width:120,
      render:(text:string)=> dayjs().format("YYYY-MM-DD")
    },
    {
      title: '操作',
      key:'action',
      fixed: 'right',
      width:120,
      render: (_:any, record:any) => (
        <Space size="middle">
          <Button type='link' onClick={handleEditClick}>编辑</Button>
          <Button type='link' 
            onClick={()=>{
              handleDeleteClick(record.id)
            }}
            danger>删除</Button>
        </Space>
      )
    }
  ];

  const handleDeleteClick =async (id:string)=>{
      await bookDelete(id)
      message.success('删除成功')
      fetchData(form.getFieldsValue())
  }

  return (
    <Content title='图书列表' operation={
      <Button  type='primary'
      onClick={()=>{
        router.push('/book/add')
      }}>
        添加
      </Button>
    }>
       <Form
       style={{height:"50px"}}
        name="serch"
        form={form}
        layout="inline"
        onFinish={handleSerchClick}
        initialValues={{
          name:'', auther:'',category:''
        }}
      >
        <Row gutter={24}>
          <Col span={7}>
            <Form.Item name="name" label="名称" >
              <Input placeholder='请输入'  allowClear/>
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item name="auther" label="作者" >
              <Input placeholder='请输入'  allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="category" label="分类" >
              <Select 
                allowClear
                showSearch
                // style={{width:100}}  
                placeholder='请选择'
                options={categoryList.map(item =>({
                  label:item.name,value:item._id}))}/>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  搜索
                </Button>
                <Button onClick={handleSerchResetClick}>清空</Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className={styles['TableWrap']}>
        <Table 
          dataSource={data} 
          columns={columns} 
          scroll={{x:1300}}
          onChange={handleTableChange}
          pagination={{...pagination,showTotal:()=>`共${pagination.total}`}}
          // rowKey={data.id}
        />
      </div>
    </Content>
  )
}
