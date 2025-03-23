import{r as t,l as E,j as e,L as F}from"./react-vendor-BIgZFnT2.js";import{B as m}from"./button-kXSeDcDx.js";import{I as d}from"./input-BTxwilxg.js";import{L as u}from"./label-BGrSP2vm.js";import{C as I,a as R,b as D,c as q,d as U,e as B}from"./card-Nfi7rt9A.js";import{A as T,a as K}from"./alert-C8MQOhFk.js";import{c as Z,u as _,b as z}from"./index-CXZKCkms.js";import{z as r}from"./form-components-KkGWRa5t.js";import{u as H,P as J}from"./usePlans-BcJ6OtnZ.js";import{C as Y}from"./circle-alert-CNPlcFBt.js";import{U as G}from"./user-_nJStIKV.js";import{A as M}from"./arrow-right-DPrf0TVY.js";import{A as O}from"./arrow-left-By3eKyga.js";import"./data-management-CvhHSD84.js";import"./ui-components-CeV64dF6.js";import"./utils-CP2dCvBX.js";import"./radio-group-CGmvQLw7.js";import"./circle-BMOyQHMR.js";import"./check-DggwCmCB.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q=Z("Key",[["path",{d:"m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4",key:"g0fldk"}],["path",{d:"m21 2-9.6 9.6",key:"1j0ho8"}],["circle",{cx:"7.5",cy:"15.5",r:"5.5",key:"yqb3hr"}]]),y=r.object({fullName:r.string().min(2,"Name must be at least 2 characters"),email:r.string().email("Please enter a valid email"),password:r.string().min(6,"Password must be at least 6 characters")});function he(){const[o,p]=t.useState(1),[n,v]=t.useState(""),[c,w]=t.useState(""),[i,C]=t.useState(""),[x,b]=t.useState("free"),[h,f]=t.useState(!1),[j,l]=t.useState(null),{signUp:S}=_(),{plans:A}=H(),P=E(),{toast:g}=z(),k=async s=>{s.preventDefault(),f(!0),l(null);try{const a=y.parse({fullName:n,email:c,password:i}),{error:N}=await S(a.email,a.password,{full_name:a.fullName,plan_id:x});if(N)throw N;g({title:"Registration successful",description:"Your account has been created and you are now logged in."}),P("/")}catch(a){console.error("Registration error:",a),a instanceof r.ZodError?l(a.errors[0].message):l(a.message||"Failed to register"),g({title:"Registration failed",description:a.message||"There was a problem creating your account.",variant:"destructive"})}finally{f(!1)}},L=()=>{try{o===1&&(y.parse({fullName:n,email:c,password:i}),p(2))}catch(s){s instanceof r.ZodError&&l(s.errors[0].message)}};return e.jsx("div",{className:"min-h-screen flex items-center justify-center bg-muted/40 px-4",children:e.jsxs(I,{className:"w-full max-w-md",children:[e.jsxs(R,{className:"space-y-1",children:[e.jsx(D,{className:"text-2xl text-center",children:"Create an account"}),e.jsx(q,{className:"text-center",children:o===1?"Enter your details to create an account":"Choose your plan (all free during beta)"})]}),e.jsxs(U,{className:"space-y-4",children:[j&&e.jsxs(T,{variant:"destructive",children:[e.jsx(Y,{className:"h-4 w-4"}),e.jsx(K,{children:j})]}),o===1?e.jsxs("form",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(u,{htmlFor:"fullName",children:"Full Name"}),e.jsxs("div",{className:"relative",children:[e.jsx(G,{className:"absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4"}),e.jsx(d,{id:"fullName",placeholder:"John Doe",value:n,onChange:s=>v(s.target.value),className:"pl-9",required:!0})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(u,{htmlFor:"email",children:"Email"}),e.jsx(d,{id:"email",type:"email",placeholder:"you@example.com",value:c,onChange:s=>w(s.target.value),required:!0})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(u,{htmlFor:"password",children:"Password"}),e.jsxs("div",{className:"relative",children:[e.jsx(Q,{className:"absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4"}),e.jsx(d,{id:"password",type:"password",value:i,onChange:s=>C(s.target.value),className:"pl-9",required:!0})]})]}),e.jsxs(m,{type:"button",onClick:L,className:"w-full",children:["Continue ",e.jsx(M,{className:"ml-2 h-4 w-4"})]})]}):e.jsxs("div",{className:"space-y-6",children:[e.jsx(J,{plans:A,selectedPlan:x,onSelectPlan:b}),e.jsxs("div",{className:"flex space-x-4",children:[e.jsxs(m,{variant:"outline",type:"button",onClick:()=>p(1),className:"flex-1",children:[e.jsx(O,{className:"mr-2 h-4 w-4"})," Back"]}),e.jsx(m,{type:"button",onClick:k,className:"flex-1",disabled:h,children:h?"Creating Account...":"Create Account"})]})]})]}),e.jsx(B,{className:"flex flex-col space-y-4",children:e.jsxs("div",{className:"text-center text-sm text-muted-foreground",children:["Already have an account?"," ",e.jsx(F,{to:"/login",className:"text-primary hover:underline",children:"Sign in"})]})})]})})}export{he as default};
