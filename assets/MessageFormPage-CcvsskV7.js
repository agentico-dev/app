import{u as A,n as I,r as y,q as w,j as e}from"./react-vendor-vQbJYzIl.js";import{B as h}from"./button-BuS9drMY.js";import{I as E}from"./input-XSgfOhYa.js";import{T as V}from"./textarea-BcJ2PB4q.js";import{F as _,a as l,b as c,c as d,d as m,f as u,e as p}from"./form-DIouIyc2.js";import{S as C,a as v,b as M,c as S,d as n}from"./select-BSW57vTX.js";import{C as k,a as L,b as U,c as B,d as D}from"./card-ChR_bl_w.js";import{a as $,u as P}from"./useApplicationMessages-GIxG0DF5.js";import{d as j}from"./index-CF5hanbC.js";import{A as R}from"./arrow-left-DkholcDv.js";import"./ui-components-CaI0lto7.js";import"./label-tTPk6JAI.js";import"./chevron-down-MPM69XpR.js";import"./check-BwSTKJS0.js";import"./react-query-triPzI4C.js";import"./supabase-uFuX7l-a.js";import"./utils-CP2dCvBX.js";function ne(){const{applicationId:r,messageId:o}=A(),x=I(),t=!o,{data:i,isLoading:q}=$(o),{createMessage:b,updateMessage:F}=P(r),[g,f]=y.useState(!1),a=w({defaultValues:{title:"",content:"",message_type:"notification",status:"unread"}});y.useEffect(()=>{i&&!t&&a.reset({title:i.title,content:i.content,message_type:i.message_type,status:i.status})},[i,a,t]);const N=async s=>{if(r){f(!0);try{t?(await b.mutateAsync({...s,application_id:r}),j.success("Message created successfully")):o&&(await F.mutateAsync({...s,id:o}),j.success("Message updated successfully")),x(`/applications/${r}`)}catch(T){console.error("Error saving message:",T),j.error("Failed to save message")}finally{f(!1)}}};return e.jsxs("div",{className:"container py-6 space-y-6",children:[e.jsx(h,{variant:"ghost",asChild:!0,children:e.jsxs("div",{onClick:()=>x(`/applications/${r}`),children:[e.jsx(R,{className:"mr-2 h-4 w-4"})," Back to Application"]})}),e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-bold tracking-tight",children:t?"Create New Message":"Edit Message"}),e.jsx("p",{className:"text-muted-foreground",children:t?"Create a new message for your application":"Update the message details"})]}),e.jsxs(k,{children:[e.jsxs(L,{children:[e.jsx(U,{children:"Message Details"}),e.jsx(B,{children:"Fill in the details of your message"})]}),e.jsx(D,{children:e.jsx(_,{...a,children:e.jsxs("form",{onSubmit:a.handleSubmit(N),className:"space-y-6",children:[e.jsx(l,{control:a.control,name:"title",render:({field:s})=>e.jsxs(c,{children:[e.jsx(d,{children:"Title"}),e.jsx(m,{children:e.jsx(E,{placeholder:"Enter message title",...s})}),e.jsx(u,{})]})}),e.jsx(l,{control:a.control,name:"content",render:({field:s})=>e.jsxs(c,{children:[e.jsx(d,{children:"Content"}),e.jsx(m,{children:e.jsx(V,{placeholder:"Enter message content",className:"min-h-[200px]",...s})}),e.jsx(p,{children:"The main content of your message."}),e.jsx(u,{})]})}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsx(l,{control:a.control,name:"message_type",render:({field:s})=>e.jsxs(c,{children:[e.jsx(d,{children:"Message Type"}),e.jsxs(C,{onValueChange:s.onChange,defaultValue:s.value,children:[e.jsx(m,{children:e.jsx(v,{children:e.jsx(M,{placeholder:"Select a type"})})}),e.jsxs(S,{children:[e.jsx(n,{value:"notification",children:"Notification"}),e.jsx(n,{value:"alert",children:"Alert"}),e.jsx(n,{value:"info",children:"Information"})]})]}),e.jsx(p,{children:"The type of this message."}),e.jsx(u,{})]})}),e.jsx(l,{control:a.control,name:"status",render:({field:s})=>e.jsxs(c,{children:[e.jsx(d,{children:"Status"}),e.jsxs(C,{onValueChange:s.onChange,defaultValue:s.value,children:[e.jsx(m,{children:e.jsx(v,{children:e.jsx(M,{placeholder:"Select a status"})})}),e.jsxs(S,{children:[e.jsx(n,{value:"unread",children:"Unread"}),e.jsx(n,{value:"read",children:"Read"})]})]}),e.jsx(p,{children:"The read status of this message."}),e.jsx(u,{})]})})]}),e.jsxs("div",{className:"flex justify-end space-x-4",children:[e.jsx(h,{type:"button",variant:"outline",onClick:()=>x(`/applications/${r}`),children:"Cancel"}),e.jsx(h,{type:"submit",disabled:g,children:g?t?"Creating...":"Updating...":t?"Create Message":"Update Message"})]})]})})})]})]})}export{ne as default};
