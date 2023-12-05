
import { getBorrowDetail } from '@/api/borrow';
import BorrowForm from '@/components/BorrowForm'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'



export default function BorrowAdd() {

  return (
      <BorrowForm title='借阅添加'></BorrowForm>
  )
}
