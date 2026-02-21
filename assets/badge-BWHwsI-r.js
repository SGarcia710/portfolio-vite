import{j as n}from"./vendor-motion-Cd1B4yyT.js";const a={default:"bg-muted text-muted-foreground",primary:"bg-primary text-primary-foreground",secondary:"bg-secondary text-secondary-foreground",success:"bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",warning:"bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",error:"bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",outline:"border border-border text-foreground"},s={sm:"px-2 py-0.5 text-xs",md:"px-2.5 py-1 text-sm",lg:"px-3 py-1.5 text-base"};function g({variant:e="default",size:r="md",className:t="",children:o,...d}){return n.jsx("span",{className:`
        inline-flex items-center
        rounded-full font-medium
        transition-colors duration-200
        ${a[e]}
        ${s[r]}
        ${t}
      `,...d,children:o})}export{g as B};
