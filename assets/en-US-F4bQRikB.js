function y(t){const n=Object.prototype.toString.call(t);return t instanceof Date||typeof t=="object"&&n==="[object Date]"?new t.constructor(+t):typeof t=="number"||n==="[object Number]"||typeof t=="string"||n==="[object String]"?new Date(t):new Date(NaN)}function H(t,n){return t instanceof Date?new t.constructor(n):new Date(n)}const K=6048e5,G=864e5,Z=43200,$=1440;let b={};function tt(){return b}function et(t){const n=y(t),e=new Date(Date.UTC(n.getFullYear(),n.getMonth(),n.getDate(),n.getHours(),n.getMinutes(),n.getSeconds(),n.getMilliseconds()));return e.setUTCFullYear(n.getFullYear()),+t-+e}const g={lessThanXSeconds:{one:"less than a second",other:"less than {{count}} seconds"},xSeconds:{one:"1 second",other:"{{count}} seconds"},halfAMinute:"half a minute",lessThanXMinutes:{one:"less than a minute",other:"less than {{count}} minutes"},xMinutes:{one:"1 minute",other:"{{count}} minutes"},aboutXHours:{one:"about 1 hour",other:"about {{count}} hours"},xHours:{one:"1 hour",other:"{{count}} hours"},xDays:{one:"1 day",other:"{{count}} days"},aboutXWeeks:{one:"about 1 week",other:"about {{count}} weeks"},xWeeks:{one:"1 week",other:"{{count}} weeks"},aboutXMonths:{one:"about 1 month",other:"about {{count}} months"},xMonths:{one:"1 month",other:"{{count}} months"},aboutXYears:{one:"about 1 year",other:"about {{count}} years"},xYears:{one:"1 year",other:"{{count}} years"},overXYears:{one:"over 1 year",other:"over {{count}} years"},almostXYears:{one:"almost 1 year",other:"almost {{count}} years"}},w=(t,n,e)=>{let a;const o=g[t];return typeof o=="string"?a=o:n===1?a=o.one:a=o.other.replace("{{count}}",n.toString()),e!=null&&e.addSuffix?e.comparison&&e.comparison>0?"in "+a:a+" ago":a};function h(t){return(n={})=>{const e=n.width?String(n.width):t.defaultWidth;return t.formats[e]||t.formats[t.defaultWidth]}}const v={full:"EEEE, MMMM do, y",long:"MMMM do, y",medium:"MMM d, y",short:"MM/dd/yyyy"},P={full:"h:mm:ss a zzzz",long:"h:mm:ss a z",medium:"h:mm:ss a",short:"h:mm a"},M={full:"{{date}} 'at' {{time}}",long:"{{date}} 'at' {{time}}",medium:"{{date}}, {{time}}",short:"{{date}}, {{time}}"},W={date:h({formats:v,defaultWidth:"full"}),time:h({formats:P,defaultWidth:"full"}),dateTime:h({formats:M,defaultWidth:"full"})},p={lastWeek:"'last' eeee 'at' p",yesterday:"'yesterday at' p",today:"'today at' p",tomorrow:"'tomorrow at' p",nextWeek:"eeee 'at' p",other:"P"},D=(t,n,e,a)=>p[t];function d(t){return(n,e)=>{const a=e!=null&&e.context?String(e.context):"standalone";let o;if(a==="formatting"&&t.formattingValues){const r=t.defaultFormattingWidth||t.defaultWidth,i=e!=null&&e.width?String(e.width):r;o=t.formattingValues[i]||t.formattingValues[r]}else{const r=t.defaultWidth,i=e!=null&&e.width?String(e.width):t.defaultWidth;o=t.values[i]||t.values[r]}const s=t.argumentCallback?t.argumentCallback(n):n;return o[s]}}const k={narrow:["B","A"],abbreviated:["BC","AD"],wide:["Before Christ","Anno Domini"]},S={narrow:["1","2","3","4"],abbreviated:["Q1","Q2","Q3","Q4"],wide:["1st quarter","2nd quarter","3rd quarter","4th quarter"]},F={narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],abbreviated:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],wide:["January","February","March","April","May","June","July","August","September","October","November","December"]},C={narrow:["S","M","T","W","T","F","S"],short:["Su","Mo","Tu","We","Th","Fr","Sa"],abbreviated:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],wide:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},j={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"}},x={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"}},A=(t,n)=>{const e=Number(t),a=e%100;if(a>20||a<10)switch(a%10){case 1:return e+"st";case 2:return e+"nd";case 3:return e+"rd"}return e+"th"},T={ordinalNumber:A,era:d({values:k,defaultWidth:"wide"}),quarter:d({values:S,defaultWidth:"wide",argumentCallback:t=>t-1}),month:d({values:F,defaultWidth:"wide"}),day:d({values:C,defaultWidth:"wide"}),dayPeriod:d({values:j,defaultWidth:"wide",formattingValues:x,defaultFormattingWidth:"wide"})};function c(t){return(n,e={})=>{const a=e.width,o=a&&t.matchPatterns[a]||t.matchPatterns[t.defaultMatchWidth],s=n.match(o);if(!s)return null;const r=s[0],i=a&&t.parsePatterns[a]||t.parsePatterns[t.defaultParseWidth],m=Array.isArray(i)?N(i,l=>l.test(r)):O(i,l=>l.test(r));let u;u=t.valueCallback?t.valueCallback(m):m,u=e.valueCallback?e.valueCallback(u):u;const f=n.slice(r.length);return{value:u,rest:f}}}function O(t,n){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e)&&n(t[e]))return e}function N(t,n){for(let e=0;e<t.length;e++)if(n(t[e]))return e}function V(t){return(n,e={})=>{const a=n.match(t.matchPattern);if(!a)return null;const o=a[0],s=n.match(t.parsePattern);if(!s)return null;let r=t.valueCallback?t.valueCallback(s[0]):s[0];r=e.valueCallback?e.valueCallback(r):r;const i=n.slice(o.length);return{value:r,rest:i}}}const q=/^(\d+)(th|st|nd|rd)?/i,z=/\d+/i,J={narrow:/^(b|a)/i,abbreviated:/^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,wide:/^(before christ|before common era|anno domini|common era)/i},X={any:[/^b/i,/^(a|c)/i]},I={narrow:/^[1234]/i,abbreviated:/^q[1234]/i,wide:/^[1234](th|st|nd|rd)? quarter/i},Y={any:[/1/i,/2/i,/3/i,/4/i]},E={narrow:/^[jfmasond]/i,abbreviated:/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,wide:/^(january|february|march|april|may|june|july|august|september|october|november|december)/i},L={narrow:[/^j/i,/^f/i,/^m/i,/^a/i,/^m/i,/^j/i,/^j/i,/^a/i,/^s/i,/^o/i,/^n/i,/^d/i],any:[/^ja/i,/^f/i,/^mar/i,/^ap/i,/^may/i,/^jun/i,/^jul/i,/^au/i,/^s/i,/^o/i,/^n/i,/^d/i]},Q={narrow:/^[smtwf]/i,short:/^(su|mo|tu|we|th|fr|sa)/i,abbreviated:/^(sun|mon|tue|wed|thu|fri|sat)/i,wide:/^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i},R={narrow:[/^s/i,/^m/i,/^t/i,/^w/i,/^t/i,/^f/i,/^s/i],any:[/^su/i,/^m/i,/^tu/i,/^w/i,/^th/i,/^f/i,/^sa/i]},_={narrow:/^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,any:/^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i},U={any:{am:/^a/i,pm:/^p/i,midnight:/^mi/i,noon:/^no/i,morning:/morning/i,afternoon:/afternoon/i,evening:/evening/i,night:/night/i}},B={ordinalNumber:V({matchPattern:q,parsePattern:z,valueCallback:t=>parseInt(t,10)}),era:c({matchPatterns:J,defaultMatchWidth:"wide",parsePatterns:X,defaultParseWidth:"any"}),quarter:c({matchPatterns:I,defaultMatchWidth:"wide",parsePatterns:Y,defaultParseWidth:"any",valueCallback:t=>t+1}),month:c({matchPatterns:E,defaultMatchWidth:"wide",parsePatterns:L,defaultParseWidth:"any"}),day:c({matchPatterns:Q,defaultMatchWidth:"wide",parsePatterns:R,defaultParseWidth:"any"}),dayPeriod:c({matchPatterns:_,defaultMatchWidth:"any",parsePatterns:U,defaultParseWidth:"any"})},nt={code:"en-US",formatDistance:w,formatLong:W,formatRelative:D,localize:T,match:B,options:{weekStartsOn:0,firstWeekContainsDate:1}};export{tt as a,Z as b,H as c,G as d,nt as e,K as f,et as g,$ as m,y as t};
