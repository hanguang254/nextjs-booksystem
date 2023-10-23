import { BookAddType, BookQueryType } from '@/type/book'
import axios from 'axios'
import  request  from '@/utils/request'
import qs from "qs"
import { url } from 'inspector'


export async function getBookList(params?: BookQueryType){
  
    const res = await request.get(
        `/api/books?${qs.stringify(params)}`
    );

    return res
        
}

export async function bookAdd(params:BookAddType) {

    return  request.post( "/api/books", params);
}

export async function bookDelete(id:string) {
    return request.delete(`/api/books/${id}`)
}