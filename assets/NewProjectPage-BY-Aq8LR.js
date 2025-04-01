import{y as S,t as I,r,j as e}from"./react-vendor-D9Z7L--9.js";import{B as c}from"./button-DyydDRsx.js";import{I as P}from"./input-C9MDm0T4.js";import{T as D}from"./textarea-CWRfT5sV.js";import{C as k}from"./checkbox-CsTkomXz.js";import{L as l}from"./label-Cq7s04FH.js";import{C as T,a as A,b as E,c as G,d as L,e as F}from"./card-j9p50iY2.js";import{u as _,d as j}from"./index-AU1k0GBq.js";import{L as x}from"./loader-circle-B7D_2ByN.js";import{A as B}from"./arrow-left-CoG1BIxl.js";import"./ui-components-CC8ri8vc.js";import"./check-B_vNfbYE.js";import"./supabase-BVXwAj-b.js";import"./utils-DVqAV-fM.js";try{let t=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{},a=new t.Error().stack;a&&(t._sentryDebugIds=t._sentryDebugIds||{},t._sentryDebugIds[a]="5f2cf7f2-3f31-4ebd-a362-b9b1c4b97536",t._sentryDebugIdIdentifier="sentry-dbid-5f2cf7f2-3f31-4ebd-a362-b9b1c4b97536")}catch{}function Z(){const[t]=S(),a=I(),{user:W}=_(),i=t.get("aiGenerated")==="true",o=t.get("prompt")||"",[d,m]=r.useState(""),[b,u]=r.useState(""),[g,y]=r.useState(!1),[C,N]=r.useState(i),[p,w]=r.useState(!1);r.useEffect(()=>{if(i&&o){const s=setTimeout(()=>{const n=o.split(" ").slice(0,3).map(f=>f.charAt(0).toUpperCase()+f.slice(1)).join(" ")+" Workflow";m(n),u(o),N(!1)},2e3);return()=>clearTimeout(s)}},[i,o]);const v=s=>{if(s.preventDefault(),!d.trim()){j.error("Project name is required");return}w(!0),setTimeout(()=>{const n=Date.now().toString();j.success("Project created successfully"),a(`/studio/projects/${n}`)},1e3)},h=()=>{a("/studio")};return C?e.jsx("div",{className:"container mx-auto p-6 flex flex-col items-center justify-center min-h-[50vh]",children:e.jsxs("div",{className:"text-center",children:[e.jsx(x,{className:"h-12 w-12 animate-spin mx-auto mb-4 text-primary"}),e.jsx("h2",{className:"text-2xl font-semibold mb-2",children:"Generating Your Project"}),e.jsxs("p",{className:"text-muted-foreground mb-8 max-w-md",children:["We're using AI to create a project based on your prompt:",e.jsx("br",{}),e.jsxs("span",{className:"font-medium italic",children:['"',o,'"']})]})]})}):e.jsxs("div",{className:"container mx-auto p-6",children:[e.jsx("div",{className:"mb-6",children:e.jsxs(c,{variant:"ghost",onClick:h,children:[e.jsx(B,{className:"mr-2 h-4 w-4"})," Back to Studio"]})}),e.jsxs(T,{className:"mx-auto max-w-xl",children:[e.jsxs(A,{children:[e.jsx(E,{children:"Create New Project"}),e.jsx(G,{children:i?"We've generated this project based on your prompt. You can edit the details before creating it.":"Set up a new project to organize your AI workflows."})]}),e.jsxs("form",{onSubmit:v,children:[e.jsxs(L,{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(l,{htmlFor:"name",children:"Project Name"}),e.jsx(P,{id:"name",value:d,onChange:s=>m(s.target.value),placeholder:"Enter project name",required:!0})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(l,{htmlFor:"description",children:"Description"}),e.jsx(D,{id:"description",value:b,onChange:s=>u(s.target.value),placeholder:"Describe what this project will do",rows:4})]}),e.jsxs("div",{className:"flex items-center space-x-2 pt-2",children:[e.jsx(k,{id:"shared",checked:g,onCheckedChange:s=>y(s)}),e.jsx(l,{htmlFor:"shared",className:"text-sm font-normal",children:"Share this project with my team"})]})]}),e.jsxs(F,{className:"flex justify-between",children:[e.jsx(c,{type:"button",variant:"outline",onClick:h,children:"Cancel"}),e.jsxs(c,{type:"submit",disabled:p,children:[p&&e.jsx(x,{className:"mr-2 h-4 w-4 animate-spin"}),"Create Project"]})]})]})]})]})}export{Z as default};
//# sourceMappingURL=NewProjectPage-BY-Aq8LR.js.map
