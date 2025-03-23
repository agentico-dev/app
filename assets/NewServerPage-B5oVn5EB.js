import{r as S,l as b,o as C,j as e,L as F}from"./react-vendor-BIgZFnT2.js";import{B as x}from"./button-kXSeDcDx.js";import{C as w,a as N,b as I,c as T,d as k}from"./card-Nfi7rt9A.js";import{I as v}from"./input-BTxwilxg.js";import{T as A}from"./textarea-aX6xt-XV.js";import{F as D,a as i,b as l,c,d,e as m,f as u}from"./form-DN-EFpiu.js";import{u as z,d as a,g as E,s as L}from"./index-CXZKCkms.js";import{A as B}from"./arrow-left-By3eKyga.js";import"./data-management-CvhHSD84.js";import"./ui-components-CeV64dF6.js";import"./label-BGrSP2vm.js";import"./utils-CP2dCvBX.js";function P(){const[h,n]=S.useState(!1),o=b(),{session:p}=z(),s=C({defaultValues:{name:"",description:"",type:"Virtual",status:"Offline"}}),g=async r=>{if(!p.user){a.error("You need to be logged in to create a server");return}n(!0);try{const t=localStorage.getItem("selectedOrganizationId");if(!t){a.error("Please select an organization from the top navigation bar"),n(!1);return}const y=E(r.name),{data:j,error:f}=await L.from("servers").insert({name:r.name,slug:y,description:r.description,type:r.type,status:r.status,user_id:p.user.id,organization_id:t}).select().single();if(f)throw f;a.success("Server created successfully"),o(j?`/servers/${j.slug}`:"/servers")}catch(t){console.error("Error creating server:",t),a.error(`Failed to create server: ${t.message||"Unknown error"}`)}finally{n(!1)}};return e.jsx(D,{...s,children:e.jsxs("form",{onSubmit:s.handleSubmit(g),className:"space-y-6",children:[e.jsx(i,{control:s.control,name:"name",render:({field:r})=>e.jsxs(l,{children:[e.jsx(c,{children:"Server Name"}),e.jsx(d,{children:e.jsx(v,{placeholder:"Enter server name",...r})}),e.jsx(m,{children:"The name of your server."}),e.jsx(u,{})]})}),e.jsx(i,{control:s.control,name:"description",render:({field:r})=>e.jsxs(l,{children:[e.jsx(c,{children:"Description"}),e.jsx(d,{children:e.jsx(A,{placeholder:"Describe your server",className:"min-h-[120px]",...r})}),e.jsx(m,{children:"A brief description of what this server is for."}),e.jsx(u,{})]})}),e.jsx(i,{control:s.control,name:"type",render:({field:r})=>e.jsxs(l,{children:[e.jsx(c,{children:"Server Type"}),e.jsx(d,{children:e.jsx(v,{placeholder:"e.g., Virtual, Physical, Cloud",...r})}),e.jsx(m,{children:"The type of server."}),e.jsx(u,{})]})}),e.jsxs("div",{className:"flex justify-end space-x-4",children:[e.jsx(x,{type:"button",variant:"outline",onClick:()=>o("/servers"),children:"Cancel"}),e.jsx(x,{type:"submit",disabled:h,children:h?"Creating...":"Create Server"})]})]})})}function K(){return e.jsxs("div",{className:"container py-6 space-y-6",children:[e.jsx(x,{variant:"ghost",asChild:!0,children:e.jsxs(F,{to:"/servers",children:[e.jsx(B,{className:"mr-2 h-4 w-4"})," Back to Servers"]})}),e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-bold tracking-tight",children:"Create New Server"}),e.jsx("p",{className:"text-muted-foreground",children:"Set up a new server for your AI applications"})]}),e.jsxs(w,{children:[e.jsxs(N,{children:[e.jsx(I,{children:"Server Details"}),e.jsx(T,{children:"Fill in the details to create your new server"})]}),e.jsx(k,{children:e.jsx(P,{})})]})]})}export{K as default};
