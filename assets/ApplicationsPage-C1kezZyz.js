import{j as e,L as N,r as u}from"./react-vendor-BIgZFnT2.js";import{u as O}from"./data-management-CvhHSD84.js";import{B as w}from"./button-kXSeDcDx.js";import{T as P,a as k,b as j,c as v}from"./tabs-CN0fFsYQ.js";import{u as b,s as E,t as I}from"./index-CXZKCkms.js";import{F as B}from"./FilterControls-D5eUyHBt.js";import{A as M}from"./ApplicationCard-CncA42sT.js";import{A as Q,a as q}from"./alert-C8MQOhFk.js";import{P as R}from"./plus-k4r-E7oI.js";import{L as U}from"./log-out-Bc_eRftF.js";import{S as V}from"./shield-Y79D7Co8.js";import"./ui-components-CeV64dF6.js";import"./utils-CP2dCvBX.js";import"./input-BTxwilxg.js";import"./select-Cx3VnEFm.js";import"./chevron-down-6NxrOCP-.js";import"./check-DggwCmCB.js";import"./popover-5qFalyW5.js";import"./dialog-Bcqy6HQD.js";import"./search-Bc2BGA1_.js";import"./badge-DR5nUtuV.js";import"./separator-jYsjH4rQ.js";import"./filter-BKYiddMw.js";import"./card-Nfi7rt9A.js";import"./star-CSFe5NNz.js";import"./tag-DW6q7fgi.js";import"./app-window-BkgzxvZf.js";import"./circuit-board-C5aOSnNh.js";function m({type:o}){const{session:n}=b(),s=!!n.user;switch(o){case"loading":return e.jsx("div",{className:"flex justify-center p-8",children:e.jsx("p",{children:"Loading applications..."})});case"error":return e.jsx("div",{className:"flex justify-center p-8",children:e.jsx("p",{className:"text-red-500",children:"Failed to load applications"})});case"no-applications":return e.jsxs("div",{className:"flex flex-col items-center justify-center p-8 text-center",children:[e.jsx("p",{className:"mb-4 text-muted-foreground",children:"No applications found"}),e.jsx(w,{asChild:!0,children:e.jsx(N,{to:s?"/applications/new":"/login",children:"Create your first application"})})]});case"no-favorites":return e.jsxs("div",{className:"flex flex-col items-center justify-center p-8 text-center",children:[e.jsx("p",{className:"mb-4 text-muted-foreground",children:"No favorite applications found"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Mark applications as favorites to see them here"})]});default:return null}}function y({isLoading:o,error:n,applications:s,tabValue:l}){const c=l==="recent"?[...s].sort((i,p)=>new Date(p.updated_at).getTime()-new Date(i.updated_at).getTime()).slice(0,6):l==="favorites"?s.filter(i=>i.favorite):s;return o?e.jsx(m,{type:"loading"}):n?e.jsx(m,{type:"error"}):c.length===0?l==="favorites"?e.jsx(m,{type:"no-favorites"}):e.jsx(m,{type:"no-applications"}):e.jsx("div",{className:"grid gap-6 md:grid-cols-2 lg:grid-cols-3",children:c.map(i=>e.jsx(M,{application:i},i.id))})}function je(){const[o,n]=u.useState(""),[s,l]=u.useState(null),[c,i]=u.useState("all"),[p,S]=u.useState([]),{session:A,signOut:C}=b(),d=!!A.user,{data:f=[],isLoading:x,error:h}=O({queryKey:["applications"],queryFn:async()=>{try{const{data:t,error:r}=await E.from("applications").select("*").order("created_at",{ascending:!1});if(r)throw new Error(r.message);return t.map(a=>({id:a.id,name:a.name,description:a.description||"",category:a.category||"Other",status:(a.status||"active").toLowerCase(),favorite:a.favorite||!1,endpoints_count:a.endpoints_count||0,tools_count:a.tools_count||0,tags:a.tags||[],created_at:a.created_at||new Date().toISOString(),updated_at:a.updated_at||new Date().toISOString(),slug:a.slug||a.name.toLowerCase().replace(/\s+/g,"-")}))}catch(t){return console.error("Unexpected error fetching applications:",t),I({title:"Unexpected error",description:"Failed to load applications. Please try again later.",variant:"destructive"}),[]}},enabled:d}),T=Array.from(new Set(f.flatMap(t=>t.tags||[]).filter(Boolean))),L=[{value:"all",label:"All Statuses"},{value:"active",label:"Active"},{value:"inactive",label:"Inactive"},{value:"draft",label:"Draft"}],_=t=>{i(t)},D=t=>{S(t)},g=f.filter(t=>{const r=t.name.toLowerCase().includes(o.toLowerCase())||t.description.toLowerCase().includes(o.toLowerCase());return s?s==="favorite"?r&&t.favorite:s==="active"?r&&t.status==="active":s==="category"?r&&t.category===s:r:r}),F=async()=>{await C()};return e.jsxs("div",{className:"space-y-6 animate-fade-in",children:[e.jsxs("div",{className:"flex flex-col gap-4 md:flex-row md:items-center md:justify-between",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-3xl font-bold tracking-tight",children:"Applications"}),e.jsx("p",{className:"text-muted-foreground",children:"Manage your external API interfaces and applications"})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(w,{asChild:!0,children:e.jsxs(N,{to:d?"/applications/new":"/login",children:[e.jsx(R,{className:"mr-2 h-4 w-4"}),"New Application"]})}),d&&e.jsxs(w,{variant:"outline",onClick:F,children:[e.jsx(U,{className:"mr-2 h-4 w-4"}),"Log out"]})]})]}),!d&&e.jsxs(Q,{variant:"default",className:"bg-amber-50 border-amber-200",children:[e.jsx(V,{className:"h-4 w-4 text-amber-500"}),e.jsx(q,{children:"You are currently in limited access mode. Some features may be restricted."})]}),e.jsx(B,{searchQuery:o,setSearchQuery:n,activeFilter:s,setActiveFilter:l,applications:f,statusOptions:L,selectedStatus:c,onStatusChange:_,tags:T,selectedTags:p,onTagsChange:D}),e.jsxs(P,{defaultValue:"all",children:[e.jsxs(k,{children:[e.jsx(j,{value:"all",children:"All Applications"}),e.jsx(j,{value:"favorites",children:"Favorites"}),e.jsx(j,{value:"recent",children:"Recent"})]}),e.jsx(v,{value:"all",className:"mt-6",children:e.jsx(y,{isLoading:x,error:h,applications:g,tabValue:"all"})}),e.jsx(v,{value:"favorites",className:"mt-6",children:e.jsx(y,{isLoading:x,error:h,applications:g.filter(t=>t.favorite),tabValue:"favorites"})}),e.jsx(v,{value:"recent",className:"mt-6",children:e.jsx(y,{isLoading:x,error:h,applications:[...g].sort((t,r)=>new Date(r.updated_at).getTime()-new Date(t.updated_at).getTime()).slice(0,6),tabValue:"recent"})})]})]})}export{je as ApplicationsPage,je as default};
