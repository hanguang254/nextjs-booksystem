
import axios from 'axios'
import  request  from '@/utils/request'
import qs from "qs"
import { url } from 'inspector'
import { CategoryQueryType, CategoryType } from '@/type'


export async function getCategoryList(params?: CategoryQueryType){
  
    const res = await request.get(
        `/api/categories?${qs.stringify(params)}`
    );

    return res
        
}

export async function CategoryAdd(params:CategoryType) {

    return  request.post( "/api/categories", params);
}

export async function CategoryDelete(id:number){
    return request.delete(`/api/categories/${id}`)
}