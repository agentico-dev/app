import{j as e,l as A}from"./react-vendor-BIgZFnT2.js";import{B as h}from"./button-BwNwf_Dd.js";import{S as j}from"./skeleton-Ds1sbJrL.js";import{A as k}from"./arrow-left-DQ-A3jIw.js";import{B as g}from"./badge-B5M88Wjv.js";import{A as R,h as S,a as y,b as L,c as B,d as F,e as P,f as $,g as E}from"./alert-dialog-CgUaJole.js";import{d as f}from"./index-CCNkFhSt.js";import{S as H}from"./star-DMiDpXcl.js";import{C as p,a as N,b as C,d as b,c as I}from"./card-V8-Ke11t.js";import{T as V,a as q,b as z,c as J}from"./tabs-BczPh-l6.js";function G({isLoading:l,resource:i,resourceType:a,onGoBack:s,renderLoading:n,renderNotFound:d,renderResource:o}){const x=()=>e.jsxs("div",{className:"space-y-4",children:[e.jsx(j,{className:"h-10 w-3/4"}),e.jsx(j,{className:"h-6 w-1/2"}),e.jsx(j,{className:"h-40 w-full"})]}),c=()=>e.jsxs("div",{className:"text-center p-10",children:[e.jsxs("h2",{className:"text-2xl font-bold mb-2",children:[a," Not Found"]}),e.jsxs("p",{className:"text-muted-foreground mb-4",children:["The ",a.toLowerCase()," you're looking for does not exist or has been removed."]}),e.jsxs(h,{onClick:s,children:["Return to ",a,"s"]})]});return e.jsxs("div",{className:"space-y-6 animate-fade-in",children:[e.jsxs(h,{variant:"ghost",onClick:s,children:[e.jsx(k,{className:"mr-2 h-4 w-4"})," Back to ",a,"s"]}),l?n?n():x():i?o():d?d():c()]})}function ee({title:l,description:i,isFavorite:a=!1,status:s,tags:n=[],statusColorClass:d="",onEdit:o,onDelete:x,resourceId:c,resourceType:r,resourceSlug:u}){const m=A(),w=()=>{if(o)o();else if(r&&(u||c)){const t=u||c;switch(r){case"Project":m(`/projects/${t}/edit`);break;case"Server":m(`/servers/${t}/edit`);break}}},D=async()=>{if(x)x();else if(r&&c)try{switch(r){case"Project":f.success("Project deleted successfully"),m("/projects");break;case"Server":f.success("Server deleted successfully"),m("/servers");break}}catch(t){console.error(`Error deleting ${r}:`,t),f.error(`Failed to delete ${r}`)}};return e.jsxs("div",{className:"flex flex-col md:flex-row justify-between gap-4",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("h1",{className:"text-3xl font-bold tracking-tight",children:l}),a&&e.jsx(H,{className:"h-5 w-5 fill-yellow-400 text-yellow-400"})]}),e.jsx("p",{className:"text-muted-foreground mt-1",children:i||"No description provided"}),(s||n.length>0)&&e.jsxs("div",{className:"flex flex-wrap gap-2 my-3",children:[s&&e.jsx(g,{className:d,children:s}),n.map((t,v)=>typeof t=="string"?e.jsx(g,{variant:"outline",children:t},v):e.jsx(React.Fragment,{children:t},v))]})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(h,{variant:"outline",onClick:w,children:"Edit"}),e.jsxs(R,{children:[e.jsx(S,{asChild:!0,children:e.jsx(h,{variant:"destructive",children:"Delete"})}),e.jsxs(y,{children:[e.jsxs(L,{children:[e.jsx(B,{children:"Are you absolutely sure?"}),e.jsxs(F,{children:["This action cannot be undone. This will permanently delete the ",(r==null?void 0:r.toLowerCase())||"resource","and all associated data."]})]}),e.jsxs(P,{children:[e.jsx($,{children:"Cancel"}),e.jsx(E,{onClick:D,children:"Delete"})]})]})]})]})]})}function K({title:l,items:i}){return e.jsxs(p,{children:[e.jsx(N,{className:"pb-2",children:e.jsx(C,{className:"text-sm font-medium",children:l})}),e.jsx(b,{children:e.jsx("div",{className:"space-y-2",children:i.map((a,s)=>e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsxs("div",{className:"flex items-center",children:[a.icon,e.jsx("span",{children:a.label})]}),e.jsx("span",{className:"font-medium",children:a.value})]},s))})})]})}function se({cards:l}){return e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:l.map((i,a)=>e.jsx(K,{title:i.title,items:i.items},a))})}function ae({tabs:l,defaultTab:i}){var a;return e.jsxs(V,{defaultValue:i||((a=l[0])==null?void 0:a.value),children:[e.jsx(q,{children:l.map(s=>e.jsx(z,{value:s.value,children:s.label},s.value))}),l.map(s=>e.jsx(J,{value:s.value,className:"mt-6",children:e.jsxs(p,{children:[e.jsxs(N,{children:[e.jsx(C,{children:s.label}),s.description&&e.jsx(I,{children:s.description})]}),e.jsx(b,{children:s.content})]})},s.value))]})}export{G as D,se as R,ae as a,ee as b};
