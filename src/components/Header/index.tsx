import React from 'react'
import { Breadcrumb, Layout, Menu, theme } from 'antd';
const { Header, Content, Sider } = Layout;
// css
import styles from './index.module.css'

export default function index() {
  return (
    <Header className={styles['header']}>
        <div className={styles['logo']} >
            {/* <Image  src={}/> */}
            logo图标
        </div>
      </Header>
  )
}
