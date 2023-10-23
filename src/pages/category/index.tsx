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
  Tag,
  Modal,
  message
 } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

import styles from './index.module.css'

import {CategoryDelete, getCategoryList} from '@/api/category'
import { CategoryQueryType } from '@/type'
import dayjs from 'dayjs'

import Content from '@/components/Content'


const LEVEL = {
  ONE:1,
  TWO:2
}

export const LEVEL_OPTIONS=[
  {label:'一级',value:LEVEL.ONE},
  {label:'二级',value:LEVEL.TWO}
]

export default function Index() {
  const [form] =Form.useForm();
  const router = useRouter();
  const [data,setData] = useState();

  const [pagination,setPagination] = useState<TablePaginationConfig>({
    current:1,
    pageSize:10,
    showSizeChanger:true,
    total:0
  });


  async function fetchData(values?:any) {
      //数据
      const res = await getCategoryList(
        {
          current : pagination.current,
          pageSize : pagination.pageSize,
          ...values
        });
      // console.log(res);
      const { data } =res
      console.log(data);
      
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  
  

  //搜索点击事件
  const handleSerchClick=async (values:CategoryQueryType)=>{
    // console.log(values);
    const res = await getCategoryList({...values,current:1,pageSize:pagination.pageSize})
    setData(res.data)
    setPagination({...pagination,current:1,total:res.total})
  }

  //搜索清空
  const handleSerchResetClick =( ) =>{
    console.log(form);
    form.resetFields()
    
  }

  //编辑跳转
  const handleEditClick = (id:string)=>{
    router.push(`/category/edit/${id}`)
  }

  //Table事件
  const handleTableChange =(pagination: TablePaginationConfig)=>{
      console.log(pagination);
      setPagination(pagination)
      const query = form.getFieldsValue()
      getCategoryList({
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
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width:120,
      render:(text:number)=>{
        return <Tag color={text == 1?'green':'cyan'}>{`级别${text}`}</Tag>
      }
    },
    {
      title: '所属分类',
      dataIndex: 'parent',
      key: 'parent',
      width:120,
      render:(text:{name:string})=>{
        return text?.name ?? '-'
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      key: 'createAt',
      width:130,
      render:(text:string)=> dayjs(text).format('YYYY-MM-DD')
    },
    {
      title: '操作',
      key:'action',
      fixed: 'right',
      width:120,
      render: (_:any, record:any) => (
        <Space size="middle">
          <Button type='link' onClick={()=>{
            // console.log(record);
            handleEditClick(record._id)
          }}>编辑</Button>
          <Button type='link'
            onClick={()=>{
              handleDeleteClick(record._id)
            }}
            danger>删除</Button>
        </Space>
      )
    }
  ];

  const handleDeleteClick =(id:number)=>{
    Modal.confirm({
      title:'确认删除',
      okText:'确认',
      cancelText:'取消',
      async onOk(){
        await CategoryDelete(id)
        message.success('删除成功')
        await fetchData(form.getFieldsValue())
      }
    })
  }

  return (
    <Content title='分类列表' operation={
      <Button  type='primary'
      onClick={()=>{
        router.push('/category/add')
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
          <Col span={10}>
            <Form.Item name="name" label="名称" >
              <Input placeholder='请输入'  allowClear/>
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item name="level" label="级别" >
              <Select 
                allowClear
                showSearch
                // style={{width:100}}  
                placeholder='请选择'
                options={LEVEL_OPTIONS}/>
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
