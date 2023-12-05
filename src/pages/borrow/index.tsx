import { 
  Button, 
  Col, 
  Form, 
  Row, 
  Select, 
  Space, 
  Table, 
  TablePaginationConfig,
  Image,
  message,
  Tag
 } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import {borrowDelete, getBorrowList} from '@/api/borrow'
import { bookDelete, getBookList } from "@/api/book";
import { BorrowType, BorrowQueryType,  } from '@/type'
import dayjs from 'dayjs'
import Content from '@/components/Content'
import { log } from 'console'



const STATUS_OPTIONS =[
  {
    label:'借出',
    value:'on'
  },
  {
    label:'归还',
    value:'off'
  }
]

export default function Borrow() {
  const [form] =Form.useForm();
  const router = useRouter();
  const [data,setData] = useState();
  //todo ts type
  const [userlist,setUserList] = useState<any[]>([])

  const [booklist,setBookList] = useState<BorrowType[]>([])
  

  const [pagination,setPagination] = useState<TablePaginationConfig>({
    current:1,
    pageSize:10,
    showSizeChanger:true,
    total:0
  });

  async function fetchData(search?:any) {
      //数据
      const res = await getBorrowList(
      {
        current : pagination.current, 
        pageSize : pagination.pageSize,
        ...search
      });

      const newData = res.data.map((item: BorrowType) => ({
        ...item,
        bookName: item.book.name,
        borrowUser: item.user.nickName,
      }));
      setData(newData);
      
      setPagination({...pagination, total:res.total})
  }

  useEffect(() => {
    fetchData()
    getBookList({all:true}).then((res)=>{
      setBookList(res.data)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  
  

  //搜索点击事件
  const handleSerchClick = async (values:BorrowQueryType)=>{
    // console.log(values);
    const res = await getBorrowList({...values,current:1,pageSize:pagination.pageSize})

    // console.log(res.data);
    
    const newData = res.data.map((item:BorrowType) =>({
      ...item,
      bookName:item.book.name,
      borrowUser:item.user.nickName,
    }))
    console.log(newData);
    
    setData(newData)
    setPagination({...pagination,current:1,total:res.total})
  }

  //搜索清空
  const handleSerchResetClick =( ) =>{
    console.log(form);
    form.resetFields()
    
  }

  //编辑跳转
  const handleEditClick = (id)=>{
    router.push(`/borrow/edit/${id}`)
  }

  //Table事件
  const handleTableChange =(pagination: TablePaginationConfig)=>{
      console.log(pagination);
      setPagination(pagination)
      const query = form.getFieldsValue()
      getBorrowList({
        current: pagination.current,
        pageSize: pagination.pageSize,
        ...query
      })
      
  }

  const columns:any = [
    {
      title: '名称',
      dataIndex: 'bookName',
      key: 'bookName',
      width:20
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 10,
      render: (text: string) =>
        text === "on" ? (
          <Tag color="red">借出</Tag>
        ) : (
          <Tag color="green">已还</Tag>
        ),
    },
    {
      title: '借阅人',
      dataIndex: 'borrowUser',
      key: 'borrowUser',
      width:20
    },
    {
      title: '借阅时间',
      dataIndex: 'borrowAt',
      key: 'borrowA',
      width:20,
      render:(text:string)=> dayjs().format("YYYY-MM-DD")
    },
    {
      title: "归还时间",
      dataIndex: "backAt",
      key: "backAt",
      width: 20,
      render: (text: string) => dayjs(text).format("YYYY-MM-DD"),
    },
    {
      title: '操作',
      key:'action',
      fixed: 'right',
      width:15,
      render: (_:any, record:any) => (
        <Space size="middle">
          <Button type='link' 
          onClick={()=>{
            // console.log(record);
            
            handleEditClick(record._id)
          }}>编辑</Button>
          <Button type='link' 
            onClick={()=>{
              // console.log(record);
              
              handleDeleteClick(record._id)
            }}
            danger>删除</Button>
        </Space>
      )
    }
  ];

  const handleDeleteClick =async (id:string)=>{
      await borrowDelete(id)
      message.success('删除成功')
      fetchData(form.getFieldsValue())
  }

  return (
    <Content title='借阅列表' operation={
      <Button  type='primary'
      onClick={()=>{
        router.push('/borrow/add')
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
            <Form.Item name="name" label="书籍名称" >
              <Select 
                allowClear 
                showSearch 
                optionFilterProp='label'
                options={booklist.map(item=>(
                {
                  label:item.name,
                  value:item._id
                }
                ))}></Select>
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item name="auther" label="状态" >
              <Select allowClear showSearch options={STATUS_OPTIONS}></Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="category" label="借阅人" >
              <Select 
                allowClear
                showSearch
                // style={{width:100}}  
                placeholder='请选择'
                options={userlist.map(item =>({
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
