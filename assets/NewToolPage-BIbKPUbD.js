import{r as j,t as b,w as A,j as e,L as C}from"./react-vendor-TyuC8qxg.js";import{B as h}from"./button-CrjcO5GY.js";import{C as w,a as T,b as F,d as N,c as v}from"./card-DAAmTFtc.js";import{I}from"./input-DR-AxXjG.js";import{T as D}from"./textarea-CzliNkd6.js";import{F as S,a as i,b as l,c,d,e as m,f as u}from"./form-Cq2_NWTX.js";import{u as _,g as a,i as z,s as E}from"./index-D5uhiMQB.js";import{A as L}from"./arrow-left-B-jkszN4.js";import"./ui-components-CAmpQbeX.js";import"./label-ppAVubx0.js";import"./supabase-DLYUZSEu.js";import"./utils-DVqAV-fM.js";try{let s=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{},t=new s.Error().stack;t&&(s._sentryDebugIds=s._sentryDebugIds||{},s._sentryDebugIds[t]="5050da6b-0c16-44de-99e4-22c92aa853d7",s._sentryDebugIdIdentifier="sentry-dbid-5050da6b-0c16-44de-99e4-22c92aa853d7")}catch{}function k(){const[s,t]=j.useState(!1),x=b(),{session:g}=_(),r=A({defaultValues:{name:"",description:"",category:"AI",status:"Development",tags:[]}});j.useEffect(()=>{const o=localStorage.getItem("selectedOrganizationId");o&&r.setValue("organization_id",o)},[r]);const y=async o=>{if(!g.user){a.error("You need to be logged in to create an AI tool");return}const f=localStorage.getItem("selectedOrganizationId");if(!f){a.error("Please select an organization from the top navigation bar");return}t(!0);try{const n=z(o.name),{error:p}=await E.from("ai_tools").insert({name:o.name,slug:n,description:o.description,category:o.category,status:o.status,tags:o.tags,user_id:g.user.id,organization_id:f});if(p)throw p;a.success("AI Tool created successfully"),x("/ai-tools")}catch(n){console.error("Error creating AI tool:",n),a.error("Failed to create AI tool")}finally{t(!1)}};return e.jsx(S,{...r,children:e.jsxs("form",{onSubmit:r.handleSubmit(y),className:"space-y-6",children:[e.jsx(i,{control:r.control,name:"name",render:({field:o})=>e.jsxs(l,{children:[e.jsx(c,{children:"Tool Name"}),e.jsx(d,{children:e.jsx(I,{placeholder:"Enter AI tool name",...o})}),e.jsx(m,{children:"The name of your AI tool."}),e.jsx(u,{})]})}),e.jsx(i,{control:r.control,name:"description",render:({field:o})=>e.jsxs(l,{children:[e.jsx(c,{children:"Description"}),e.jsx(d,{children:e.jsx(D,{placeholder:"Describe your AI tool",className:"min-h-[120px]",...o})}),e.jsx(m,{children:"A brief description of what this AI tool does."}),e.jsx(u,{})]})}),e.jsx(i,{control:r.control,name:"category",render:({field:o})=>e.jsxs(l,{children:[e.jsx(c,{children:"Category"}),e.jsx(d,{children:e.jsx(I,{placeholder:"e.g., NLP, Computer Vision, ML",...o})}),e.jsx(m,{children:"The category this AI tool belongs to."}),e.jsx(u,{})]})}),e.jsxs("div",{className:"flex justify-end space-x-4",children:[e.jsx(h,{type:"button",variant:"outline",onClick:()=>x("/ai-tools"),children:"Cancel"}),e.jsx(h,{type:"submit",disabled:s,children:s?"Creating...":"Create AI Tool"})]})]})})}function Q(){return e.jsxs("div",{className:"container py-6 space-y-6",children:[e.jsx(h,{variant:"ghost",asChild:!0,children:e.jsxs(C,{to:"/ai-tools",children:[e.jsx(L,{className:"mr-2 h-4 w-4"})," Back to AI Tools"]})}),e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-bold tracking-tight",children:"Create New AI Tool"}),e.jsx("p",{className:"text-muted-foreground",children:"Set up a new AI tool for your projects"})]}),e.jsxs(w,{children:[e.jsxs(T,{children:[e.jsx(F,{children:"AI Tool Details"}),e.jsx(N,{children:"Fill in the details to create your new AI tool"})]}),e.jsx(v,{children:e.jsx(k,{})})]})]})}export{Q as default};
//# sourceMappingURL=NewToolPage-BIbKPUbD.js.map
