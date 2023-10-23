import axios, { AxiosInstance, AxiosRequestConfig } from "axios"
import Router from "next/router";
import {message as Antdmessage} from 'antd'

interface AxiosInstanceType extends AxiosInstance {
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    options<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
      ): Promise<T>;
      put<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
      ): Promise<T>;
      patch<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
      ): Promise<T>;
}


export const CreateAxiosInstance = (config?:AxiosRequestConfig) :AxiosInstanceType=>{
    const instance = axios.create({
        timeout:50000,
        ...config,
    })

    //中间件重写request方法
    instance.interceptors.request.use(
        function(config) {
            return config;
        },
        function(error) {
            return Promise.reject(error)
        }
    )
    
    instance.interceptors.response.use(
        function(response){
            //判断是否登录
            const {status,data,message} = response as any;
            if(status==200){
                return data
            }else if(status== 401){
                //没权限或者没登录
                return Router.push('/login')
            }else{
                Antdmessage.error(message || '服务端异常')
            }

        },
        function(error){
            if(error.response && error.response.status ==401){
                return Router.push('/login')
            }
            Antdmessage.error(error?.response?.data?.message || '服务端异常')
            return Promise.reject(error)
        }
    )
    return instance;
}

export default CreateAxiosInstance({});