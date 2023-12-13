import { getUserDetail } from '@/api/user';
import UserForm from '@/components/UserForm'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

export default function Index() {
  const router = useRouter();
  const id  = router.query.id;

  const [data,setData] = useState();

  useEffect(()=>{
    if(id){
        getUserDetail(id as string).then((res)=>{
            setData(res.data)
        });
    }
    
  },[id])

  return (
    <UserForm title='用户管理' edidata={data}></UserForm>
  )
}
