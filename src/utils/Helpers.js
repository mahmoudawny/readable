export function capitalize (str = '') {
  return typeof str !== 'string'
    ? ''
    : str[0].toUpperCase() + str.slice(1)
}

export function delay(t) {
   return new Promise(function(resolve) { 
       setTimeout(resolve, t)
   });
}