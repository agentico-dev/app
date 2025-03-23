import{j as e,L as P,r as c}from"./react-vendor-vQbJYzIl.js";import{u as M}from"./useOrganizations-puREO3OO.js";import{T as B,a as F,b,c as v}from"./tabs-DZZcN9TG.js";import{B as h}from"./button-BuS9drMY.js";import{I as y}from"./input-XSgfOhYa.js";import{L as u}from"./label-tTPk6JAI.js";import{u as I,b as E}from"./index-CF5hanbC.js";import{D as U,a as k,b as q,c as R,d as H,e as V,f as Y}from"./dialog-B5RQTV7z.js";import{T as $}from"./textarea-BcJ2PB4q.js";import{C as x,a as w,d as z,e as C,b as _,c as G}from"./card-ChR_bl_w.js";import{B as J}from"./badge-CfEeq9U8.js";import{S as n}from"./skeleton-CVJZQeL1.js";import{B as K}from"./building-DJRgl7di.js";import{C as Q}from"./calendar-BHbnBahT.js";import{U as W}from"./users-DF4Unpfc.js";import{a as X}from"./utils-CP2dCvBX.js";import{A as Z,b as ee,a as se}from"./alert-DZZgGKs4.js";import{P as ae}from"./plus-DXtK0Xat.js";import{S as ie}from"./shield-ClDBN1a5.js";import"./react-query-triPzI4C.js";import"./ui-components-CaI0lto7.js";import"./supabase-uFuX7l-a.js";function O({organizations:l,isLoading:r}){return r?e.jsx("div",{className:"grid gap-4 md:grid-cols-2 lg:grid-cols-3",children:[1,2,3].map(s=>e.jsxs(x,{className:"overflow-hidden",children:[e.jsxs(w,{className:"p-4",children:[e.jsx(n,{className:"h-5 w-3/4"}),e.jsx(n,{className:"h-4 w-1/2 mt-2"})]}),e.jsxs(z,{className:"p-4",children:[e.jsx(n,{className:"h-4 w-full mb-2"}),e.jsx(n,{className:"h-4 w-3/4"})]}),e.jsxs(C,{className:"p-4 flex justify-between",children:[e.jsx(n,{className:"h-4 w-1/4"}),e.jsx(n,{className:"h-9 w-1/4"})]})]},s))}):l.length===0?e.jsxs(x,{className:"p-8 flex flex-col items-center justify-center",children:[e.jsx(K,{className:"h-12 w-12 text-muted-foreground mb-4"}),e.jsx("h3",{className:"text-xl font-semibold mb-2",children:"No organizations found"}),e.jsx("p",{className:"text-muted-foreground text-center max-w-md mb-4",children:l.length===0?"There are no organizations available yet. Create your first organization to get started.":"You're not a member of any organizations yet."})]}):e.jsx("div",{className:"grid gap-4 md:grid-cols-2 lg:grid-cols-3",children:l.map(s=>e.jsxs(x,{className:"overflow-hidden",children:[e.jsxs(w,{className:"p-4",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(_,{className:"text-lg",children:s.name}),s.role&&e.jsx(J,{variant:"outline",className:"ml-2",children:s.role})]}),e.jsx(G,{className:"line-clamp-2",children:s.description||"No description available"})]}),e.jsx(z,{className:"p-4 pt-0",children:e.jsxs("div",{className:"flex items-center text-sm text-muted-foreground mb-2",children:[e.jsx(Q,{className:"mr-2 h-4 w-4"}),"Created ",X(new Date(s.created_at),"MMM d, yyyy")]})}),e.jsxs(C,{className:"p-4 flex justify-between",children:[e.jsxs("div",{className:"flex items-center",children:[e.jsx(W,{className:"h-4 w-4 mr-1 text-muted-foreground"}),e.jsx("span",{className:"text-sm",children:"Members"})]}),e.jsx(h,{asChild:!0,children:e.jsx(P,{to:`/orgs/${s.slug}`,children:"View"})})]})]},s.id))})}function Oe(){const{organizations:l,userOrganizations:r,isLoading:s,isAuthenticated:d,createOrganization:g}=M(),{session:S}=I(),{toast:m}=E(),[A,p]=c.useState(!1),[a,o]=c.useState({name:"",slug:"",description:""}),[j,f]=c.useState(!1),[N,D]=c.useState("");c.useEffect(()=>{r&&r.length>0&&!N&&D(r[0].id)},[r,N]);const T=async i=>{if(i.preventDefault(),!S.user){m({title:"Authentication required",description:"Please sign in to create an organization.",variant:"destructive"});return}if(!a.name){m({title:"Required field missing",description:"Please provide a name for the organization.",variant:"destructive"});return}f(!0);try{console.log("Starting organization creation...",a),await g.mutateAsync(a),m({title:"Success!",description:`Organization "${a.name}" was created successfully.`}),p(!1),o({name:"",slug:"",description:""})}catch(t){console.error("Error creating organization:",t),m({title:"Failed to create organization",description:(t==null?void 0:t.message)||"An unexpected error occurred. Please try again.",variant:"destructive"})}finally{f(!1)}},L=i=>{const t=i.target.value;o({...a,name:t,slug:t.toLowerCase().replace(/\s+/g,"-")})};return e.jsxs("div",{className:"container py-6 space-y-6",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-bold tracking-tight",children:"Organizations"}),e.jsx("p",{className:"text-muted-foreground",children:"Manage your organizations, teams and projects."})]}),e.jsxs(U,{open:A,onOpenChange:i=>{i||o({name:"",slug:"",description:""}),p(i)},children:[e.jsx(k,{asChild:!0,children:e.jsxs(h,{disabled:!d,children:[e.jsx(ae,{className:"mr-2 h-4 w-4"}),"New Organization"]})}),e.jsxs(q,{children:[e.jsxs(R,{children:[e.jsx(H,{children:"Create new organization"}),e.jsx(V,{children:"Add a new organization to manage teams, projects, and billing."})]}),e.jsxs("form",{onSubmit:T,children:[e.jsxs("div",{className:"grid gap-4 py-4",children:[e.jsxs("div",{className:"grid gap-2",children:[e.jsx(u,{htmlFor:"name",children:"Name"}),e.jsx(y,{id:"name",value:a.name,onChange:L,placeholder:"Acme Inc.",required:!0})]}),e.jsxs("div",{className:"grid gap-2",children:[e.jsx(u,{htmlFor:"slug",children:"Slug"}),e.jsx(y,{id:"slug",value:a.slug,onChange:i=>o({...a,slug:i.target.value}),placeholder:"acme-inc"}),e.jsxs("p",{className:"text-sm text-muted-foreground",children:["Used in URLs: app.agentico.dev/org/",a.slug||"your-slug"]})]}),e.jsxs("div",{className:"grid gap-2",children:[e.jsx(u,{htmlFor:"description",children:"Description"}),e.jsx($,{id:"description",value:a.description,onChange:i=>o({...a,description:i.target.value}),placeholder:"A short description of your organization"})]})]}),e.jsx(Y,{children:e.jsx(h,{type:"submit",disabled:j||g.isPending,children:j||g.isPending?"Creating...":"Create Organization"})})]})]})]})]}),!d&&e.jsxs(Z,{variant:"default",className:"bg-amber-50 border-amber-200",children:[e.jsx(ie,{className:"h-4 w-4 text-amber-500"}),e.jsx(ee,{children:"Limited Access Mode"}),e.jsx(se,{children:"You're browsing in read-only mode. Sign in to create or manage organizations."})]}),e.jsxs(B,{defaultValue:"all",className:"space-y-4",children:[e.jsxs(F,{children:[e.jsx(b,{value:"all",children:"All Organizations"}),d&&e.jsx(b,{value:"my-orgs",children:"My Organizations"})]}),e.jsx(v,{value:"all",className:"space-y-4",children:e.jsx(O,{organizations:l||[],isLoading:s})}),d&&e.jsx(v,{value:"my-orgs",className:"space-y-4",children:e.jsx(O,{organizations:r||[],isLoading:s})})]})]})}export{Oe as default};
