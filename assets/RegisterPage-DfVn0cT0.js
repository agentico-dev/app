import{r,t as D,j as e,L as E}from"./react-vendor-TyuC8qxg.js";import{B as m}from"./button-CrjcO5GY.js";import{I as u}from"./input-DR-AxXjG.js";import{L as p}from"./label-ppAVubx0.js";import{C as L,a as F,b as R,d as _,c as T,e as q}from"./card-DAAmTFtc.js";import{A as U,a as B}from"./alert-CHHnXdcp.js";import{c as K,u as Z,f as z}from"./index-D5uhiMQB.js";import{z as l}from"./form-components-Bc0kd4dJ.js";import{u as H,P as J}from"./usePlans-CZ0bocCl.js";import{C as Y}from"./circle-alert-BjO_ybi6.js";import{U as G}from"./user-BuEUrPAo.js";import{A as M}from"./arrow-right-JamrFweG.js";import{A as O}from"./arrow-left-B-jkszN4.js";import"./ui-components-CAmpQbeX.js";import"./supabase-DLYUZSEu.js";import"./utils-DVqAV-fM.js";import"./radio-group-BcLi_fAC.js";import"./circle-C2I3inlC.js";import"./check-CG9NCPd3.js";try{let s=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{},o=new s.Error().stack;o&&(s._sentryDebugIds=s._sentryDebugIds||{},s._sentryDebugIds[o]="bc490bcd-5f5e-4b1f-af2b-6f2bf7d9bd98",s._sentryDebugIdIdentifier="sentry-dbid-bc490bcd-5f5e-4b1f-af2b-6f2bf7d9bd98")}catch{}/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q=K("Key",[["path",{d:"m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4",key:"g0fldk"}],["path",{d:"m21 2-9.6 9.6",key:"1j0ho8"}],["circle",{cx:"7.5",cy:"15.5",r:"5.5",key:"yqb3hr"}]]),b=l.object({fullName:l.string().min(2,"Name must be at least 2 characters"),email:l.string().email("Please enter a valid email"),password:l.string().min(6,"Password must be at least 6 characters")});function he(){const[s,o]=r.useState(1),[i,N]=r.useState(""),[c,v]=r.useState(""),[d,w]=r.useState(""),[f,C]=r.useState("free"),[h,x]=r.useState(!1),[g,n]=r.useState(null),{signUp:S}=Z(),{plans:A}=H(),I=D(),{toast:y}=z(),P=async a=>{a.preventDefault(),x(!0),n(null);try{const t=b.parse({fullName:i,email:c,password:d}),{error:j}=await S(t.email,t.password,{full_name:t.fullName,plan_id:f});if(j)throw j;y({title:"Registration successful",description:"Your account has been created and you are now logged in."}),I("/")}catch(t){console.error("Registration error:",t),t instanceof l.ZodError?n(t.errors[0].message):n(t.message||"Failed to register"),y({title:"Registration failed",description:t.message||"There was a problem creating your account.",variant:"destructive"})}finally{x(!1)}},k=()=>{try{s===1&&(b.parse({fullName:i,email:c,password:d}),o(2))}catch(a){a instanceof l.ZodError&&n(a.errors[0].message)}};return e.jsx("div",{className:"min-h-screen flex items-center justify-center bg-muted/40 px-4",children:e.jsxs(L,{className:"w-full max-w-md",children:[e.jsxs(F,{className:"space-y-1",children:[e.jsx(R,{className:"text-2xl text-center",children:"Create an account"}),e.jsx(_,{className:"text-center",children:s===1?"Enter your details to create an account":"Choose your plan (all free during beta)"})]}),e.jsxs(T,{className:"space-y-4",children:[g&&e.jsxs(U,{variant:"destructive",children:[e.jsx(Y,{className:"h-4 w-4"}),e.jsx(B,{children:g})]}),s===1?e.jsxs("form",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(p,{htmlFor:"fullName",children:"Full Name"}),e.jsxs("div",{className:"relative",children:[e.jsx(G,{className:"absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4"}),e.jsx(u,{id:"fullName",placeholder:"John Doe",value:i,onChange:a=>N(a.target.value),className:"pl-9",required:!0})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(p,{htmlFor:"email",children:"Email"}),e.jsx(u,{id:"email",type:"email",placeholder:"you@example.com",value:c,onChange:a=>v(a.target.value),required:!0})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(p,{htmlFor:"password",children:"Password"}),e.jsxs("div",{className:"relative",children:[e.jsx(Q,{className:"absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4"}),e.jsx(u,{id:"password",type:"password",value:d,onChange:a=>w(a.target.value),className:"pl-9",required:!0})]})]}),e.jsxs(m,{type:"button",onClick:k,className:"w-full",children:["Continue ",e.jsx(M,{className:"ml-2 h-4 w-4"})]})]}):e.jsxs("div",{className:"space-y-6",children:[e.jsx(J,{plans:A,selectedPlan:f,onSelectPlan:C}),e.jsxs("div",{className:"flex space-x-4",children:[e.jsxs(m,{variant:"outline",type:"button",onClick:()=>o(1),className:"flex-1",children:[e.jsx(O,{className:"mr-2 h-4 w-4"})," Back"]}),e.jsx(m,{type:"button",onClick:P,className:"flex-1",disabled:h,children:h?"Creating Account...":"Create Account"})]})]})]}),e.jsx(q,{className:"flex flex-col space-y-4",children:e.jsxs("div",{className:"text-center text-sm text-muted-foreground",children:["Already have an account?"," ",e.jsx(E,{to:"/login",className:"text-primary hover:underline",children:"Sign in"})]})})]})})}export{he as default};
//# sourceMappingURL=RegisterPage-DfVn0cT0.js.map
