function n(e){if(e){const c=e.replace(/\D/g,"").match(/^998(\d{2})(\d{3})(\d{4})$/);return c?`+998 ${c[1]}  ${c[2]}  ${c[3].slice(0,2)} ${c[3].slice(2,4)}`:e}return""}export{n as u};
