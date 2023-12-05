import { BorrowType, BorrowQueryType } from '@/type/borrow'

import  request  from '@/utils/request'
import qs from "qs"



export async function getBorrowList(params?: BorrowQueryType) {
    return request.get(`/api/borrows?${qs.stringify(params)}`);
  }
  
  export async function borrowAdd(params: BorrowType) {
    return request.post("/api/borrows", params);
  }

  export async function borrowUpdata(params: BorrowType) {
    return request.put("/api/borrows", params);
  }
  
  export async function borrowDelete(id: string) {
    return request.delete(`/api/borrows/${id}`);
  }

  export async function getBorrowDetail(id: string) {
    return request.get(`/api/borrows/${id}`);
  }