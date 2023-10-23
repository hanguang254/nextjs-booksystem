export interface BookQueryType{
    name?:string;
    author?:string;
    category?:number;
    current?:number;
    pageSize?:number;
}

export interface BookAddType{
    name:string;
    author:string;
    category:string;
    cover:string;
    publishAt:number;
    stock:number;
    description:string;
}