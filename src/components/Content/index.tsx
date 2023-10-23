import React, { ReactNode } from 'react'
import styles from './index.module.css'

interface ContentType{
    children:ReactNode,
    title:string,
    operation?:ReactNode
}

export default function Content({children,title,operation}:ContentType) {
  return (
    <>
        <div className={styles['title']}>
            {title}
            <span className={styles['btn']}>{operation}</span>
        </div>
        <div className={styles['content']}>{children}</div>
    </>
    
  )
}
