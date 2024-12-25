"use client"
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.bubble.css';
import { useMemo } from 'react';


interface PreviewProps{
    value:string



}

export const Editor=({ value}:PreviewProps)=>{
    const ReactQuill=useMemo(()=>dynamic(()=>import("react-quill"), {ssr:false}),[])
    return <div className='bg-white'>
        <ReactQuill value={value} theme='readOnly'/>
    </div>
}