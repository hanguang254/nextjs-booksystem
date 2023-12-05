import  request  from '@/utils/request'
import qs from "qs"
import { UserQueryType, UserType } from '@/type'


export async function getUserList(params?: UserQueryType){
  
    const res = await request.get(
        `/api/users?${qs.stringify(params)}`
    );

    return res
        
}

export async function UserAdd(params:UserType) {

    return  request.post( "/api/users", params);
}

export async function UserDelete(id:number){
    return request.delete(`/api/users/${id}`)
}

export async function UserUpdata(params:UserType) {
    return request.put(`/api/users/${params._id}`,params);
}