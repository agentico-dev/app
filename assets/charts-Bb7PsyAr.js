import"./react-vendor-h7CPgmbB.js";function i(r){var o,n,t="";if(typeof r=="string"||typeof r=="number")t+=r;else if(typeof r=="object")if(Array.isArray(r)){var f=r.length;for(o=0;o<f;o++)r[o]&&(n=i(r[o]))&&(t&&(t+=" "),t+=n)}else for(n in r)r[n]&&(t&&(t+=" "),t+=n);return t}function s(){for(var r,o,n=0,t="",f=arguments.length;n<f;n++)(r=arguments[n])&&(o=i(r))&&(t&&(t+=" "),t+=o);return t}export{s as c};
