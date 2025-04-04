import{p as w,u as h,q as u}from"./react-vendor-TyuC8qxg.js";import{u as m,f as q,s as o}from"./index-D5uhiMQB.js";try{let t=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{},s=new t.Error().stack;s&&(t._sentryDebugIds=t._sentryDebugIds||{},t._sentryDebugIds[s]="2d3469dc-6068-41f5-8b6d-c3e8ffe97681",t._sentryDebugIdIdentifier="sentry-dbid-2d3469dc-6068-41f5-8b6d-c3e8ffe97681")}catch{}function E(){const{session:t}=m(),{toast:s}=q(),a=w(),d=!!t.user,{data:c,isLoading:l,error:f}=h({queryKey:["servers"],queryFn:async()=>{let e=o.from("servers").select("*").order("created_at",{ascending:!1});const{data:r,error:n}=await e;if(n)throw n;return r}}),y=u({mutationFn:async e=>{if(!t.user)throw new Error("Authentication required");const{data:r,error:n}=await o.from("servers").insert({name:e.name,description:e.description,type:e.type||"Standard",status:e.status||"development",organization_id:e.organization_id,user_id:t.user.id,tags:e.tags||[]}).select().single();if(n)throw n;return r},onSuccess:()=>{a.invalidateQueries({queryKey:["servers"]}),s({title:"Server created",description:"Your new server has been created successfully."})},onError:e=>{s({title:"Error creating server",description:e.message,variant:"destructive"})}}),v=u({mutationFn:async({id:e,...r})=>{if(!t.user)throw new Error("Authentication required");const{data:n,error:i}=await o.from("servers").update({name:r.name,description:r.description,type:r.type,status:r.status,tags:r.tags,updated_at:new Date().toISOString()}).eq("id",e).select().single();if(i)throw i;return n},onSuccess:()=>{a.invalidateQueries({queryKey:["servers"]}),s({title:"Server updated",description:"The server has been updated successfully."})},onError:e=>{s({title:"Error updating server",description:e.message,variant:"destructive"})}}),p=u({mutationFn:async e=>{if(!t.user)throw new Error("Authentication required");const{error:r}=await o.from("servers").delete().eq("id",e);if(r)throw r;return e},onSuccess:()=>{a.invalidateQueries({queryKey:["servers"]}),s({title:"Server deleted",description:"The server has been deleted successfully."})},onError:e=>{s({title:"Error deleting server",description:e.message,variant:"destructive"})}}),g=u({mutationFn:async({id:e,favorite:r})=>{if(!t.user)throw new Error("Authentication required");const{data:n,error:i}=await o.from("servers").update({favorite:r}).eq("id",e).select().single();if(i)throw i;return n},onSuccess:()=>{a.invalidateQueries({queryKey:["servers"]})},onError:e=>{s({title:"Error updating favorite status",description:e.message,variant:"destructive"})}});return{servers:c,isLoading:l,error:f,isAuthenticated:d,createServer:y,updateServer:v,deleteServer:p,toggleFavorite:g}}export{E as u};
//# sourceMappingURL=useServers-CDZfCJte.js.map
