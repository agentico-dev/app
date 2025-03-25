import{r as v,u as T,j as e,L as w}from"./react-vendor-pyaEZ1K4.js";import{B as b}from"./badge-BUdM99C2.js";import{B as x}from"./button-DgiK2e7X.js";import{C as t,a as h,d as u,e as j,b as S,c as D}from"./card-ByfXnz1U.js";import{I as F}from"./input-B2NTb4C1.js";import{T as k,a as L,b as p,c as N}from"./tabs--csU1GM2.js";import{D as M,a as B,b as $,c as E,d as P,e as m}from"./dropdown-menu-WnzKPBTw.js";import{S as r}from"./skeleton-M0Bsayo2.js";import{u as Q,s as _,t as q}from"./index-CcMg1OWm.js";import{A as R,a as V}from"./alert-COpzYVMI.js";import{P as Y}from"./plus-DxucbFu3.js";import{S as H}from"./shield-CKMwypw4.js";import{S as K}from"./search-D0jHYLql.js";import{F as U}from"./filter-DpGBqr_M.js";import{C as y}from"./circuit-board-DfSKitmh.js";import{S as A}from"./star-BAQKbNG7.js";import{A as W}from"./app-window-Dn0yrFOX.js";import"./ui-components-C95S_aop.js";import"./chevron-right-CMw8O4rl.js";import"./check-DLiLETgU.js";import"./circle-0UNeVdT7.js";import"./supabase-lLY5SY09.js";import"./utils-CP2dCvBX.js";function pe(){const[a,o]=v.useState(""),[c,n]=v.useState(null),{session:C}=Q(),d=!!C.user,{data:I=[],isLoading:f}=T({queryKey:["ai-tools"],queryFn:async()=>{try{const{data:s,error:l}=await _.from("ai_tools").select("*").order("created_at",{ascending:!1});if(l)throw l;return s}catch(s){return console.error("Error fetching AI tools:",s),q({title:"Failed to load AI tools",description:s instanceof Error?s.message:"An unexpected error occurred",variant:"destructive"}),[]}}}),i=I.filter(s=>{const l=s.name.toLowerCase().includes(a.toLowerCase())||s.description&&s.description.toLowerCase().includes(a.toLowerCase());return c?c==="favorite"?l&&s.favorite:c==="active"?l&&s.status==="active":c==="category"?l&&s.category===c:l:l});return e.jsxs("div",{className:"space-y-6 animate-fade-in",children:[e.jsxs("div",{className:"flex flex-col gap-4 md:flex-row md:items-center md:justify-between",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-3xl font-bold tracking-tight",children:"AI Tools"}),e.jsx("p",{className:"text-muted-foreground",children:"Manage your AI tools and integrations"})]}),e.jsx(x,{asChild:!0,children:e.jsxs(w,{to:d?"/ai-tools/new":"/login",children:[e.jsx(Y,{className:"mr-2 h-4 w-4"}),"New AI Tool"]})})]}),!d&&e.jsxs(R,{variant:"default",className:"bg-amber-50 border-amber-200",children:[e.jsx(H,{className:"h-4 w-4 text-amber-500"}),e.jsx(V,{children:"You're browsing in read-only mode. Sign in to create or manage AI tools."})]}),e.jsxs("div",{className:"flex flex-col gap-4 md:flex-row md:items-center",children:[e.jsxs("div",{className:"relative flex-1",children:[e.jsx(K,{className:"absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"}),e.jsx(F,{type:"search",placeholder:"Search AI tools...",className:"pl-8 w-full md:max-w-xs",value:a,onChange:s=>o(s.target.value)})]}),e.jsxs(M,{children:[e.jsx(B,{asChild:!0,children:e.jsxs(x,{variant:"outline",className:"ml-auto",children:[e.jsx(U,{className:"mr-2 h-4 w-4"}),"Filter"]})}),e.jsxs($,{align:"end",children:[e.jsx(E,{children:"Filter by"}),e.jsx(P,{}),e.jsx(m,{onClick:()=>n(null),children:"All AI Tools"}),e.jsx(m,{onClick:()=>n("favorite"),children:"Favorites"}),e.jsx(m,{onClick:()=>n("active"),children:"Active"}),e.jsx(m,{onClick:()=>n("development"),children:"In Development"})]})]})]}),e.jsxs(k,{defaultValue:"all",children:[e.jsxs(L,{children:[e.jsx(p,{value:"all",children:"All Tools"}),e.jsx(p,{value:"favorites",children:"Favorites"}),e.jsx(p,{value:"recent",children:"Recent"})]}),e.jsx(N,{value:"all",className:"mt-6",children:f?e.jsx("div",{className:"grid gap-6 md:grid-cols-2 lg:grid-cols-3",children:[1,2,3].map(s=>e.jsxs(t,{className:"overflow-hidden",children:[e.jsxs(h,{className:"p-4",children:[e.jsx(r,{className:"h-6 w-3/4 mb-2"}),e.jsx(r,{className:"h-4 w-full"})]}),e.jsx(u,{className:"p-4",children:e.jsxs("div",{className:"space-y-3",children:[e.jsx(r,{className:"h-4 w-full"}),e.jsx(r,{className:"h-4 w-3/4"})]})}),e.jsxs(j,{className:"p-4 flex justify-between",children:[e.jsx(r,{className:"h-9 w-20"}),e.jsx(r,{className:"h-9 w-24"})]})]},s))}):i.length>0?e.jsx("div",{className:"grid gap-6 md:grid-cols-2 lg:grid-cols-3",children:i.map(s=>e.jsx(g,{tool:s},s.id))}):e.jsxs(t,{className:"p-8 flex flex-col items-center justify-center",children:[e.jsx(y,{className:"h-12 w-12 text-muted-foreground mb-4"}),e.jsx("h3",{className:"text-xl font-semibold mb-2",children:"No AI tools found"}),e.jsx("p",{className:"text-muted-foreground text-center max-w-md mb-4",children:a?"No AI tools match your search criteria. Try adjusting your filters.":"There are no AI tools available yet. Create your first AI tool to get started."}),d&&e.jsx(x,{asChild:!0,children:e.jsx(w,{to:d?"/ai-tools/new":"/login",children:"Create AI Tool"})})]})}),e.jsx(N,{value:"favorites",className:"mt-6",children:f?e.jsx("div",{className:"grid gap-6 md:grid-cols-2 lg:grid-cols-3",children:[1,2].map(s=>e.jsxs(t,{className:"overflow-hidden",children:[e.jsxs(h,{className:"p-4",children:[e.jsx(r,{className:"h-6 w-3/4 mb-2"}),e.jsx(r,{className:"h-4 w-full"})]}),e.jsx(u,{className:"p-4",children:e.jsx(r,{className:"h-4 w-full"})}),e.jsx(j,{className:"p-4",children:e.jsx(r,{className:"h-9 w-full"})})]},s))}):i.filter(s=>s.favorite).length>0?e.jsx("div",{className:"grid gap-6 md:grid-cols-2 lg:grid-cols-3",children:i.filter(s=>s.favorite).map(s=>e.jsx(g,{tool:s},s.id))}):e.jsxs(t,{className:"p-8 flex flex-col items-center justify-center",children:[e.jsx(A,{className:"h-12 w-12 text-muted-foreground mb-4"}),e.jsx("h3",{className:"text-xl font-semibold mb-2",children:"No favorite AI tools"}),e.jsx("p",{className:"text-muted-foreground text-center max-w-md mb-4",children:"You haven't marked any AI tools as favorites yet."})]})}),e.jsx(N,{value:"recent",className:"mt-6",children:f?e.jsx("div",{className:"grid gap-6 md:grid-cols-2 lg:grid-cols-3",children:[1,2].map(s=>e.jsxs(t,{className:"overflow-hidden",children:[e.jsxs(h,{className:"p-4",children:[e.jsx(r,{className:"h-6 w-3/4 mb-2"}),e.jsx(r,{className:"h-4 w-full"})]}),e.jsx(u,{className:"p-4",children:e.jsx(r,{className:"h-4 w-full"})}),e.jsx(j,{className:"p-4",children:e.jsx(r,{className:"h-9 w-full"})})]},s))}):i.length>0?e.jsx("div",{className:"grid gap-6 md:grid-cols-2 lg:grid-cols-3",children:i.slice(0,3).map(s=>e.jsx(g,{tool:s},s.id))}):e.jsxs(t,{className:"p-8 flex flex-col items-center justify-center",children:[e.jsx(y,{className:"h-12 w-12 text-muted-foreground mb-4"}),e.jsx("h3",{className:"text-xl font-semibold mb-2",children:"No recent AI tools"}),e.jsx("p",{className:"text-muted-foreground text-center max-w-md mb-4",children:"There are no recent AI tools to display."})]})})]})]})}function g({tool:a}){return e.jsxs(t,{className:"overflow-hidden card-hover",children:[e.jsxs(h,{className:"p-4 pb-0",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(S,{className:"text-lg",children:a.name}),a.favorite&&e.jsx(A,{className:"h-4 w-4 fill-yellow-400 text-yellow-400"})]}),e.jsx(D,{className:"mt-1",children:a.description||"No description available"})]}),e.jsxs(u,{className:"p-4 pt-4",children:[e.jsx("div",{className:"flex flex-wrap gap-2 mb-4",children:a.tags&&a.tags.map(o=>e.jsx(b,{variant:"secondary",className:"text-xs",children:o},o))}),e.jsx("div",{className:"flex justify-between text-sm text-muted-foreground",children:e.jsxs("div",{className:"flex items-center",children:[e.jsx(W,{className:"h-4 w-4 mr-1"}),e.jsxs("span",{children:[a.applications_count||0," apps"]})]})})]}),e.jsxs(j,{className:"p-4 pt-0 flex justify-between",children:[e.jsx(b,{className:`
          ${a.status==="active"?"tag-green":""}
          ${a.status==="development"?"tag-purple":""}
          ${a.status==="maintenance"?"tag-yellow":""}
          ${a.status==="archived"?"tag-red":""}
        `,children:a.status||"Unknown"}),e.jsx(x,{asChild:!0,children:e.jsx(w,{to:`/ai-tools/${a.id}`,children:"View Details"})})]})]})}export{pe as AIToolsPage,pe as default};
