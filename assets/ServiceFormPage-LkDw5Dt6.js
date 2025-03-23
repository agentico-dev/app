import{u as T,n as w,r as y,q as D,j as e}from"./react-vendor-vQbJYzIl.js";import{B as u}from"./button-BuS9drMY.js";import{I as j}from"./input-XSgfOhYa.js";import{T as E}from"./textarea-BcJ2PB4q.js";import{F as _,a as c,b as n,c as o,d as l,f as d,e as x}from"./form-DIouIyc2.js";import{S as k,a as B,b as L,c as V,d as v}from"./select-BSW57vTX.js";import{C as M,a as P,b as U,c as $,d as q}from"./card-ChR_bl_w.js";import{a as z,u as H}from"./useApplicationServices-DMtxzwzi.js";import{d as f}from"./index-CF5hanbC.js";import{A as R}from"./arrow-left-DkholcDv.js";import"./ui-components-CaI0lto7.js";import"./label-tTPk6JAI.js";import"./chevron-down-MPM69XpR.js";import"./check-BwSTKJS0.js";import"./react-query-triPzI4C.js";import"./supabase-uFuX7l-a.js";import"./utils-CP2dCvBX.js";function le(){const{applicationId:t,serviceId:m}=T(),h=w(),i=!m,{data:a,isLoading:G}=z(m),{createService:C,updateService:b}=H(t),[g,S]=y.useState(!1),r=D({defaultValues:{name:"",description:"",status:"active",service_type:"",tags:[]}});y.useEffect(()=>{a&&!i&&r.reset({name:a.name,description:a.description,status:a.status,service_type:a.service_type,tags:a.tags})},[a,r,i]);const F=async s=>{if(t){S(!0);try{i?(await C.mutateAsync({...s,application_id:t}),f.success("Service created successfully")):m&&(await b.mutateAsync({...s,id:m}),f.success("Service updated successfully")),h(`/applications/${t}`)}catch(p){console.error("Error saving service:",p),f.error("Failed to save service")}finally{S(!1)}}};return e.jsxs("div",{className:"container py-6 space-y-6",children:[e.jsx(u,{variant:"ghost",asChild:!0,children:e.jsxs("div",{onClick:()=>h(`/applications/${t}`),children:[e.jsx(R,{className:"mr-2 h-4 w-4"})," Back to Application"]})}),e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-bold tracking-tight",children:i?"Create New Service":"Edit Service"}),e.jsx("p",{className:"text-muted-foreground",children:i?"Define a new service for your application":"Update the service details"})]}),e.jsxs(M,{children:[e.jsxs(P,{children:[e.jsx(U,{children:"Service Details"}),e.jsx($,{children:"Fill in the details of your service"})]}),e.jsx(q,{children:e.jsx(_,{...r,children:e.jsxs("form",{onSubmit:r.handleSubmit(F),className:"space-y-6",children:[e.jsx(c,{control:r.control,name:"name",render:({field:s})=>e.jsxs(n,{children:[e.jsx(o,{children:"Service Name"}),e.jsx(l,{children:e.jsx(j,{placeholder:"Enter service name",...s})}),e.jsx(d,{})]})}),e.jsx(c,{control:r.control,name:"description",render:({field:s})=>e.jsxs(n,{children:[e.jsx(o,{children:"Description"}),e.jsx(l,{children:e.jsx(E,{placeholder:"Describe your service",className:"min-h-[120px]",...s})}),e.jsx(x,{children:"Provide a brief description of what this service does."}),e.jsx(d,{})]})}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsx(c,{control:r.control,name:"status",render:({field:s})=>e.jsxs(n,{children:[e.jsx(o,{children:"Status"}),e.jsxs(k,{onValueChange:s.onChange,defaultValue:s.value,children:[e.jsx(l,{children:e.jsx(B,{children:e.jsx(L,{placeholder:"Select a status"})})}),e.jsxs(V,{children:[e.jsx(v,{value:"active",children:"Active"}),e.jsx(v,{value:"inactive",children:"Inactive"}),e.jsx(v,{value:"maintenance",children:"Maintenance"})]})]}),e.jsx(x,{children:"The current status of this service."}),e.jsx(d,{})]})}),e.jsx(c,{control:r.control,name:"service_type",render:({field:s})=>e.jsxs(n,{children:[e.jsx(o,{children:"Service Type"}),e.jsx(l,{children:e.jsx(j,{placeholder:"e.g., Microservice, Database, AI",...s})}),e.jsx(x,{children:"The type of this service."}),e.jsx(d,{})]})})]}),e.jsx(c,{control:r.control,name:"tags",render:({field:s})=>{var p;return e.jsxs(n,{children:[e.jsx(o,{children:"Tags"}),e.jsx(l,{children:e.jsx(j,{placeholder:"Enter tags separated by commas",value:((p=s.value)==null?void 0:p.join(", "))||"",onChange:N=>{const A=N.target.value.split(",").map(I=>I.trim()).filter(Boolean);s.onChange(A)}})}),e.jsx(x,{children:"Tags help categorize and find your services."}),e.jsx(d,{})]})}}),e.jsxs("div",{className:"flex justify-end space-x-4",children:[e.jsx(u,{type:"button",variant:"outline",onClick:()=>h(`/applications/${t}`),children:"Cancel"}),e.jsx(u,{type:"submit",disabled:g,children:g?i?"Creating...":"Updating...":i?"Create Service":"Update Service"})]})]})})})]})]})}export{le as default};
