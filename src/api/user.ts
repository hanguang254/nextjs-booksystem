import  request  from '@/utils/request'
import qs from "qs"
import { UserQueryType, UserType } from '@/type'


export async function getUserList(params?: UserQueryType){
  
    const res = await request.get(
        `/api/users?${qs.stringify(params)}`
    );

    return res
        
}
export async function getUserDetail(id:string){
    return request.get(`/api/users/${id}`)
}


export async function UserAdd(params:UserType) {

    return  request.post( "/api/users", params);
}

export async function UserDelete(id:number){
    return request.delete(`/api/users/${id}`)
}

export async function UserUpdata(params:UserType) {
    return request.put(`/api/users`,params);
}

export async function login(params: Pick<UserType, "name" | "password">) {
    return request.post("/api/login", params);
  }

export async function logout() {
    return request.get("/api/logout");
}  