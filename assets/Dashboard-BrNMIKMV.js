import{j as e}from"./ui-components-TzlODp5W.js";import{u as l}from"./data-management-D5n4p4qF.js";import{L as f}from"./react-vendor-h7CPgmbB.js";import{B as N}from"./button-BQg0x-Iw.js";import{C as p,a as u,b as x,c as w,d as h}from"./card-BSrBs7BE.js";import{B as D}from"./badge-HFADNs-e.js";import{c as v,u as T}from"./index-qFUq4l6H.js";import{C as a}from"./circuit-board-Cvj-IcmO.js";import{S as j}from"./server-CiFvi2uO.js";import{U}from"./users-r4KQHlz_.js";import"./charts-Bb7PsyAr.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=v("ArrowUpRight",[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=v("Briefcase",[["path",{d:"M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16",key:"jecpp"}],["rect",{width:"20",height:"14",x:"2",y:"6",rx:"2",key:"i6l2r4"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M=v("ChartColumn",[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]),C=[{id:"1",name:"Customer Support Bot",tools_count:8,servers_count:2,status:"Active"},{id:"2",name:"Data Analysis Pipeline",tools_count:12,servers_count:4,status:"Active"},{id:"3",name:"Content Generation System",tools_count:6,servers_count:2,status:"Development"},{id:"4",name:"Recommendation Engine",tools_count:9,servers_count:3,status:"Maintenance"}],A=[{icon:a,description:'New AI Tool "Text Summarizer" was created',time:"2 hours ago"},{icon:j,description:'Server "NLP-Processor-01" was restarted',time:"4 hours ago"},{icon:U,description:'User "Alex Kim" was added to "Data Analysis Pipeline" project',time:"6 hours ago"},{icon:a,description:'Application "Customer Portal" deployed to production',time:"1 day ago"}],b={projects:{count:12,trend:"+2 this month",trendUp:!0},applications:{count:8,trend:"+1 this week",trendUp:!0},servers:{count:23,trend:"No change",trendUp:null},aiTools:{count:35,trend:"+5 this month",trendUp:!0}};function G(){const{session:g}=T(),{data:n,isLoading:d}=l({queryKey:["dashboard","projects"],queryFn:async()=>C}),{data:i,isLoading:o}=l({queryKey:["dashboard","activity"],queryFn:async()=>A}),{data:r,isLoading:k}=l({queryKey:["dashboard","stats"],queryFn:async()=>b}),t=k||!r?b:r,S=d||!n?C:n,L=o||!i?A:i.map(s=>({icon:(()=>{switch(s.type||"info"){case"project":return m;case"application":return a;case"server":return j;case"user":return U;default:return a}})(),description:s.message,time:new Date(s.created_at).toLocaleDateString()}));return e.jsxs("div",{className:"space-y-8 animate-fade-in",children:[e.jsxs("div",{className:"flex flex-col gap-4 md:flex-row md:items-center md:justify-between",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-3xl font-bold tracking-tight",children:"Dashboard"}),e.jsx("p",{className:"text-muted-foreground",children:"Welcome to your AI Tools Hub dashboard"})]}),e.jsx("div",{className:"flex items-center gap-2",children:e.jsx(N,{asChild:!0,children:e.jsx(f,{to:"/projects/new",children:"Create new project"})})})]}),e.jsxs("div",{className:"grid gap-4 md:grid-cols-2 lg:grid-cols-4",children:[e.jsx(c,{title:"Projects",value:t.projects.count.toString(),description:"Total projects",icon:m,trend:t.projects.trend,trendUp:t.projects.trendUp}),e.jsx(c,{title:"Applications",value:t.applications.count.toString(),description:"Deployed applications",icon:a,trend:t.applications.trend,trendUp:t.applications.trendUp}),e.jsx(c,{title:"Servers",value:t.servers.count.toString(),description:"Active servers",icon:j,trend:t.servers.trend,trendUp:t.servers.trendUp}),e.jsx(c,{title:"AI Tools",value:t.aiTools.count.toString(),description:"Total AI tools",icon:M,trend:t.aiTools.trend,trendUp:t.aiTools.trendUp})]}),e.jsxs("div",{className:"grid gap-4 md:grid-cols-2 lg:grid-cols-3",children:[e.jsxs(p,{className:"col-span-2",children:[e.jsxs(u,{children:[e.jsx(x,{children:"Recent Projects"}),e.jsx(w,{children:"Your recently updated projects"})]}),e.jsx(h,{children:e.jsx("div",{className:"space-y-4",children:S.map(s=>e.jsxs("div",{className:"flex items-center justify-between space-x-4",children:[e.jsxs("div",{className:"flex items-center space-x-4",children:[e.jsx("div",{className:"h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center",children:e.jsx(m,{className:"h-5 w-5 text-primary"})}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-medium leading-none",children:s.name}),e.jsxs("p",{className:"text-sm text-muted-foreground",children:[s.tools_count," tools · ",s.servers_count," servers"]})]})]}),e.jsxs("div",{className:"flex items-center",children:[e.jsx(D,{variant:"outline",className:"mr-2",children:s.status}),e.jsx(N,{variant:"ghost",size:"icon",asChild:!0,children:e.jsxs(f,{to:`/projects/${s.id}`,children:[e.jsx(_,{className:"h-4 w-4"}),e.jsx("span",{className:"sr-only",children:"View project"})]})})]})]},s.id))})})]}),e.jsxs(p,{children:[e.jsxs(u,{children:[e.jsx(x,{children:"Recent Activity"}),e.jsx(w,{children:"Latest actions in your workspace"})]}),e.jsx(h,{children:e.jsx("div",{className:"space-y-4",children:L.map((s,y)=>e.jsxs("div",{className:"flex items-start gap-4",children:[e.jsx(s.icon,{className:"mt-0.5 h-5 w-5 text-muted-foreground"}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("p",{className:"text-sm",children:s.description}),e.jsx("p",{className:"text-xs text-muted-foreground",children:s.time})]})]},y))})})]})]})]})}function c({title:g,value:n,description:d,icon:i,trend:o,trendUp:r}){return e.jsxs(p,{className:"card-hover",children:[e.jsxs(u,{className:"flex flex-row items-center justify-between pb-2",children:[e.jsx(x,{className:"text-sm font-medium",children:g}),e.jsx(i,{className:"h-4 w-4 text-muted-foreground"})]}),e.jsxs(h,{children:[e.jsx("div",{className:"text-2xl font-bold",children:n}),e.jsx("p",{className:"text-xs text-muted-foreground",children:d}),o&&e.jsx("div",{className:`mt-2 flex items-center text-xs ${r===!0?"text-green-500":r===!1?"text-red-500":"text-muted-foreground"}`,children:o})]})]})}export{G as Dashboard,G as default};
