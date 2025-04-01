import{u as m,j as s,L as u}from"./react-vendor-D9Z7L--9.js";import{C as g,a as f,b as x,c as h,d as b,e as j}from"./card-j9p50iY2.js";import{B as n}from"./badge-DQslapAQ.js";import{B as y}from"./button-DyydDRsx.js";import{e as v,X as w,t as i,s as p}from"./index-AU1k0GBq.js";import{S as N}from"./star-DSolPrZb.js";import{T as C}from"./tag-DrRrhomQ.js";import{A as _}from"./app-window-C_29jRGv.js";import{C as T}from"./circuit-board-CDaRFIRg.js";try{let e=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{},a=new e.Error().stack;a&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[a]="a25681ec-fb50-4629-afb9-2cef82e0bdca",e._sentryDebugIdIdentifier="sentry-dbid-a25681ec-fb50-4629-afb9-2cef82e0bdca")}catch{}function q({application:e}){var o;const{removeTagFromResource:a}=v(),{data:z}=m({queryKey:["organization",e.organization_id],queryFn:async()=>{if(!e.organization_id)return null;const{data:r,error:t}=await p.from("organizations").select("slug").eq("id",e.organization_id).single();if(t)throw t;return r},enabled:!!e.organization_id&&!e.organization_slug}),d=r=>{switch(r.toLowerCase()){case"active":return"bg-green-500 hover:bg-green-600";case"development":return"bg-purple-500 hover:bg-purple-600";case"maintenance":return"bg-yellow-500 hover:bg-yellow-600";case"archived":return"bg-red-500 hover:bg-red-600";default:return"bg-slate-500 hover:bg-slate-600"}},l=async r=>{try{i({title:"Tag removed",description:`Tag "${r}" was removed from ${e.name}`})}catch(t){console.error("Error removing tag:",t),i({title:"Error",description:"Failed to remove tag",variant:"destructive"})}},c=()=>`/applications/${e.id}`;return s.jsxs(g,{className:"overflow-hidden transition-all hover:shadow-md",children:[s.jsx(f,{className:"p-4 pb-0 flex justify-between",children:s.jsxs("div",{children:[s.jsxs("div",{className:"flex items-center justify-between",children:[s.jsx(x,{className:"text-lg",children:e.name}),e.favorite&&s.jsx(N,{className:"h-4 w-4 fill-yellow-400 text-yellow-400 ml-2"})]}),s.jsx(h,{className:"mt-1",children:((o=e.description)==null?void 0:o.length)>150?`${e.description.slice(0,150)}...`:e.description})]})}),s.jsxs(b,{className:"p-4 pt-4",children:[s.jsxs("div",{className:"flex flex-wrap gap-2 mb-4",children:[s.jsxs(n,{variant:"outline",className:"text-xs flex items-center gap-1",children:[s.jsx(C,{className:"h-3 w-3"}),e.category]}),e.tags.map(r=>s.jsxs(n,{variant:"secondary",className:"text-xs flex items-center gap-1 group",children:[r,s.jsx("button",{onClick:()=>l(r),className:"opacity-0 group-hover:opacity-100 transition-opacity","aria-label":`Remove ${r} tag`,children:s.jsx(w,{className:"h-3 w-3"})})]},r))]}),s.jsxs("div",{className:"flex justify-between text-sm",children:[s.jsxs("div",{className:"flex items-center",children:[s.jsx(_,{className:"h-4 w-4 mr-1 text-muted-foreground"}),s.jsxs("span",{children:[e.endpoints_count," endpoints"]})]}),s.jsxs("div",{className:"flex items-center",children:[s.jsx(T,{className:"h-4 w-4 mr-1 text-muted-foreground"}),s.jsxs("span",{children:[e.tools_count," AI tools"]})]})]})]}),s.jsxs(j,{className:"p-4 pt-0 flex justify-between",children:[s.jsx(n,{className:`${d(e.status)} text-white`,children:e.status.charAt(0).toUpperCase()+e.status.slice(1)}),s.jsx(y,{asChild:!0,children:s.jsx(u,{to:c(),children:"View API"})})]})]})}export{q as A};
//# sourceMappingURL=ApplicationCard-CHw7hYap.js.map
