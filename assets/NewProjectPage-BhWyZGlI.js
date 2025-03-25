import{r as u,t as y,x as F,j as e,L as w}from"./react-vendor-pyaEZ1K4.js";import{B as i}from"./button-DgiK2e7X.js";import{C as N,a as P,b as v,c as I,d as S}from"./card-ByfXnz1U.js";import{I as z}from"./input-B2NTb4C1.js";import{T as D}from"./textarea-Bjxf63cc.js";import{F as k,a as p,b as x,c as h,d as f,e as g,f as b}from"./form-C1C73khX.js";import{u as E,d as s,g as A,s as L}from"./index-CcMg1OWm.js";import{A as T}from"./arrow-left-7XQ4XEQi.js";import"./ui-components-C95S_aop.js";import"./label-DjmmHS8Y.js";import"./supabase-lLY5SY09.js";import"./utils-CP2dCvBX.js";function B(){const[n,c]=u.useState(!1),o=y(),{session:l}=E(),t=F({defaultValues:{name:"",description:"",status:"Development",tags:[]}});u.useEffect(()=>{const r=localStorage.getItem("selectedOrganizationId");r&&t.setValue("organization_id",r)},[t]);const C=async r=>{if(!l.user){s.error("You need to be logged in to create a project");return}const d=localStorage.getItem("selectedOrganizationId");if(!d){s.error("Please select an organization from the top navigation bar");return}c(!0);try{const a=A(r.name),{data:m,error:j}=await L.from("projects").insert({name:r.name,slug:a,description:r.description,status:r.status,tags:r.tags,user_id:l.user.id,organization_id:d}).select().single();if(j)throw j;s.success("Project created successfully"),o(m?`/projects/${m.slug}`:"/projects")}catch(a){console.error("Error creating project:",a),s.error("Failed to create project")}finally{c(!1)}};return e.jsx(k,{...t,children:e.jsxs("form",{onSubmit:t.handleSubmit(C),className:"space-y-6",children:[e.jsx(p,{control:t.control,name:"name",render:({field:r})=>e.jsxs(x,{children:[e.jsx(h,{children:"Project Name"}),e.jsx(f,{children:e.jsx(z,{placeholder:"Enter project name",...r})}),e.jsx(g,{children:"The name of your project."}),e.jsx(b,{})]})}),e.jsx(p,{control:t.control,name:"description",render:({field:r})=>e.jsxs(x,{children:[e.jsx(h,{children:"Description"}),e.jsx(f,{children:e.jsx(D,{placeholder:"Describe your project",className:"min-h-[120px]",...r})}),e.jsx(g,{children:"A brief description of what this project is about."}),e.jsx(b,{})]})}),e.jsxs("div",{className:"flex justify-end space-x-4",children:[e.jsx(i,{type:"button",variant:"outline",onClick:()=>o("/projects"),children:"Cancel"}),e.jsx(i,{type:"submit",disabled:n,children:n?"Creating...":"Create Project"})]})]})})}function Q(){return e.jsxs("div",{className:"container py-6 space-y-6",children:[e.jsx(i,{variant:"ghost",asChild:!0,children:e.jsxs(w,{to:"/projects",children:[e.jsx(T,{className:"mr-2 h-4 w-4"})," Back to Projects"]})}),e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-bold tracking-tight",children:"Create New Project"}),e.jsx("p",{className:"text-muted-foreground",children:"Set up a new project workspace for your team"})]}),e.jsxs(N,{children:[e.jsxs(P,{children:[e.jsx(v,{children:"Project Details"}),e.jsx(I,{children:"Fill in the details to create your new project"})]}),e.jsx(S,{children:e.jsx(B,{})})]})]})}export{Q as default};
