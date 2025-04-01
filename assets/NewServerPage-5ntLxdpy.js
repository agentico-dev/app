import{r as y,t as S,x as w,j as e,L as C}from"./react-vendor-D9Z7L--9.js";import{B as h}from"./button-DyydDRsx.js";import{C as F,a as I,b as N,c as D,d as T}from"./card-j9p50iY2.js";import{I as g}from"./input-C9MDm0T4.js";import{T as k}from"./textarea-CWRfT5sV.js";import{F as _,a as l,b as c,c as d,d as m,e as u,f}from"./form-DOOl_B3Y.js";import{u as A,d as o,g as E,s as z}from"./index-AU1k0GBq.js";import{A as L}from"./arrow-left-CoG1BIxl.js";import"./ui-components-CC8ri8vc.js";import"./label-Cq7s04FH.js";import"./supabase-BVXwAj-b.js";import"./utils-DVqAV-fM.js";try{let s=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{},t=new s.Error().stack;t&&(s._sentryDebugIds=s._sentryDebugIds||{},s._sentryDebugIds[t]="1bf68dcc-4f59-4bfd-b6d8-dd6804f049f4",s._sentryDebugIdIdentifier="sentry-dbid-1bf68dcc-4f59-4bfd-b6d8-dd6804f049f4")}catch{}function B(){const[s,t]=y.useState(!1),i=S(),{session:x}=A(),n=w({defaultValues:{name:"",description:"",type:"Virtual",status:"Offline"}}),v=async r=>{if(!x.user){o.error("You need to be logged in to create a server");return}t(!0);try{const a=localStorage.getItem("selectedOrganizationId");if(!a){o.error("Please select an organization from the top navigation bar"),t(!1);return}const b=E(r.name),{data:p,error:j}=await z.from("servers").insert({name:r.name,slug:b,description:r.description,type:r.type,status:r.status,user_id:x.user.id,organization_id:a}).select().single();if(j)throw j;o.success("Server created successfully"),i(p?`/servers/${p.slug}`:"/servers")}catch(a){console.error("Error creating server:",a),o.error(`Failed to create server: ${a.message||"Unknown error"}`)}finally{t(!1)}};return e.jsx(_,{...n,children:e.jsxs("form",{onSubmit:n.handleSubmit(v),className:"space-y-6",children:[e.jsx(l,{control:n.control,name:"name",render:({field:r})=>e.jsxs(c,{children:[e.jsx(d,{children:"Server Name"}),e.jsx(m,{children:e.jsx(g,{placeholder:"Enter server name",...r})}),e.jsx(u,{children:"The name of your server."}),e.jsx(f,{})]})}),e.jsx(l,{control:n.control,name:"description",render:({field:r})=>e.jsxs(c,{children:[e.jsx(d,{children:"Description"}),e.jsx(m,{children:e.jsx(k,{placeholder:"Describe your server",className:"min-h-[120px]",...r})}),e.jsx(u,{children:"A brief description of what this server is for."}),e.jsx(f,{})]})}),e.jsx(l,{control:n.control,name:"type",render:({field:r})=>e.jsxs(c,{children:[e.jsx(d,{children:"Server Type"}),e.jsx(m,{children:e.jsx(g,{placeholder:"e.g., Virtual, Physical, Cloud",...r})}),e.jsx(u,{children:"The type of server."}),e.jsx(f,{})]})}),e.jsxs("div",{className:"flex justify-end space-x-4",children:[e.jsx(h,{type:"button",variant:"outline",onClick:()=>i("/servers"),children:"Cancel"}),e.jsx(h,{type:"submit",disabled:s,children:s?"Creating...":"Create Server"})]})]})})}function K(){return e.jsxs("div",{className:"container py-6 space-y-6",children:[e.jsx(h,{variant:"ghost",asChild:!0,children:e.jsxs(C,{to:"/servers",children:[e.jsx(L,{className:"mr-2 h-4 w-4"})," Back to Servers"]})}),e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-bold tracking-tight",children:"Create New Server"}),e.jsx("p",{className:"text-muted-foreground",children:"Set up a new server for your AI applications"})]}),e.jsxs(F,{children:[e.jsxs(I,{children:[e.jsx(N,{children:"Server Details"}),e.jsx(D,{children:"Fill in the details to create your new server"})]}),e.jsx(T,{children:e.jsx(B,{})})]})]})}export{K as default};
//# sourceMappingURL=NewServerPage-5ntLxdpy.js.map
