import{m as D,t as T,r as S,x as A,j as e}from"./react-vendor-D9Z7L--9.js";import{B as x}from"./button-DyydDRsx.js";import{I as j}from"./input-C9MDm0T4.js";import{T as _}from"./textarea-CWRfT5sV.js";import{F as E,a as n,b as o,c as l,d,f as p,e as u}from"./form-DOOl_B3Y.js";import{S as k,a as B,b as L,c as V,d as f}from"./select-DduSmGHa.js";import{C as M,a as P,b as U,c as $,d as z}from"./card-j9p50iY2.js";import{a as H,u as R}from"./useApplicationServices-nKQmCirh.js";import{d as v}from"./index-AU1k0GBq.js";import{A as q}from"./arrow-left-CoG1BIxl.js";import"./ui-components-CC8ri8vc.js";import"./label-Cq7s04FH.js";import"./chevron-down-lRykjHmp.js";import"./check-B_vNfbYE.js";import"./chevron-up-6oX-8_Pk.js";import"./supabase-BVXwAj-b.js";import"./utils-DVqAV-fM.js";try{let r=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{},a=new r.Error().stack;a&&(r._sentryDebugIds=r._sentryDebugIds||{},r._sentryDebugIds[a]="a5cf177f-ac35-4f6d-ad63-82fe549dee3d",r._sentryDebugIdIdentifier="sentry-dbid-a5cf177f-ac35-4f6d-ad63-82fe549dee3d")}catch{}function le(){const{applicationId:r,serviceId:a}=D(),h=T(),t=!a,{data:c,isLoading:G}=H(a),{createService:b,updateService:C}=R(r),[g,y]=S.useState(!1),i=A({defaultValues:{name:"",description:"",status:"active",service_type:"",tags:[]}});S.useEffect(()=>{c&&!t&&i.reset({name:c.name,description:c.description,status:c.status,service_type:c.service_type,tags:c.tags})},[c,i,t]);const I=async s=>{if(r){y(!0);try{t?(await b.mutateAsync({...s,application_id:r}),v.success("Service created successfully")):a&&(await C.mutateAsync({...s,id:a}),v.success("Service updated successfully")),h(`/applications/${r}`)}catch(m){console.error("Error saving service:",m),v.error("Failed to save service")}finally{y(!1)}}};return e.jsxs("div",{className:"container py-6 space-y-6",children:[e.jsx(x,{variant:"ghost",asChild:!0,children:e.jsxs("div",{onClick:()=>h(`/applications/${r}`),children:[e.jsx(q,{className:"mr-2 h-4 w-4"})," Back to Application"]})}),e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-bold tracking-tight",children:t?"Create New Service":"Edit Service"}),e.jsx("p",{className:"text-muted-foreground",children:t?"Define a new service for your application":"Update the service details"})]}),e.jsxs(M,{children:[e.jsxs(P,{children:[e.jsx(U,{children:"Service Details"}),e.jsx($,{children:"Fill in the details of your service"})]}),e.jsx(z,{children:e.jsx(E,{...i,children:e.jsxs("form",{onSubmit:i.handleSubmit(I),className:"space-y-6",children:[e.jsx(n,{control:i.control,name:"name",render:({field:s})=>e.jsxs(o,{children:[e.jsx(l,{children:"Service Name"}),e.jsx(d,{children:e.jsx(j,{placeholder:"Enter service name",...s})}),e.jsx(p,{})]})}),e.jsx(n,{control:i.control,name:"description",render:({field:s})=>e.jsxs(o,{children:[e.jsx(l,{children:"Description"}),e.jsx(d,{children:e.jsx(_,{placeholder:"Describe your service",className:"min-h-[120px]",...s})}),e.jsx(u,{children:"Provide a brief description of what this service does."}),e.jsx(p,{})]})}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsx(n,{control:i.control,name:"status",render:({field:s})=>e.jsxs(o,{children:[e.jsx(l,{children:"Status"}),e.jsxs(k,{onValueChange:s.onChange,defaultValue:s.value,children:[e.jsx(d,{children:e.jsx(B,{children:e.jsx(L,{placeholder:"Select a status"})})}),e.jsxs(V,{children:[e.jsx(f,{value:"active",children:"Active"}),e.jsx(f,{value:"inactive",children:"Inactive"}),e.jsx(f,{value:"maintenance",children:"Maintenance"})]})]}),e.jsx(u,{children:"The current status of this service."}),e.jsx(p,{})]})}),e.jsx(n,{control:i.control,name:"service_type",render:({field:s})=>e.jsxs(o,{children:[e.jsx(l,{children:"Service Type"}),e.jsx(d,{children:e.jsx(j,{placeholder:"e.g., Microservice, Database, AI",...s})}),e.jsx(u,{children:"The type of this service."}),e.jsx(p,{})]})})]}),e.jsx(n,{control:i.control,name:"tags",render:({field:s})=>{var m;return e.jsxs(o,{children:[e.jsx(l,{children:"Tags"}),e.jsx(d,{children:e.jsx(j,{placeholder:"Enter tags separated by commas",value:((m=s.value)==null?void 0:m.join(", "))||"",onChange:w=>{const F=w.target.value.split(",").map(N=>N.trim()).filter(Boolean);s.onChange(F)}})}),e.jsx(u,{children:"Tags help categorize and find your services."}),e.jsx(p,{})]})}}),e.jsxs("div",{className:"flex justify-end space-x-4",children:[e.jsx(x,{type:"button",variant:"outline",onClick:()=>h(`/applications/${r}`),children:"Cancel"}),e.jsx(x,{type:"submit",disabled:g,children:g?t?"Creating...":"Updating...":t?"Create Service":"Update Service"})]})]})})})]})]})}export{le as default};
//# sourceMappingURL=ServiceFormPage-DomjuG-t.js.map
