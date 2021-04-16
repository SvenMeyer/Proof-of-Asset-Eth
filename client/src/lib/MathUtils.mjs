// @param :  string representing a float number
// @param :  decimals (int) : number of decimals of fractional
// @return : fixed point integer string
function uint_fixedPoint_fromString(s, decimals) {
  s = s.split(',').join('');  // replace  1000 separator
  s = s.split(' ').join('');  // replace space separator
  if (s=='' || s=='.') //  || s.slice(0, 1) == '-')  // some simple error checks
    return undefined;
  let [i,f] = s.split('.');
  return [i, f, '0'.repeat(Math.max(decimals-(f || '').length,0)).substr(0,decimals)].join('').replace(/^0+/, '') || 0;
}


// @param fps (String)   : long integer number
// @param decimals (int) : number of decimals which represent fractional part
// @return (String)      : 123.456000
function uint_fixedPoint_toString (fp, decimals) {
  if (fp === '0') return "0";
  if (fp.length <= decimals)
    // only fractional part (<1) => remove trailing zeros with replace
    return '0.' + '0'.repeat(decimals-fp.length) + fp.replace(/(\d*[1-9])0+$/g,'$1');
  else {
    const is = fp.substr(0, fp.length-decimals);  // extract integer string
    const fs = fp.substr(fp.length-decimals, decimals);  // extract fractional string
    return (fs.match(/[^0]+/g) === null) ? is : is + '.' + fs.replace(/(\d*[1-9])0+$/g,'$1');
  }
}


function fixedPoint_fromString(s, decimals) {
  if (s.slice(0, 1) == '-') {
    let fp = uint_fixedPoint_fromString(s.slice(1), decimals);  // from index 1 to the end
    if (fp)
      return '-' + fp;
    else
     return undefined;
  }
  else
    return uint_fixedPoint_fromString(s, decimals);
}


function fixedPoint_toString(s, decimals) {
  if (s.slice(0, 1) == '-')
    return '-' + uint_fixedPoint_toString(s.slice(1), decimals);  // from index 1 to the end
  else
    return uint_fixedPoint_toString(s, decimals);
}

export default {uint_fixedPoint_fromString, fixedPoint_fromString, uint_fixedPoint_toString, fixedPoint_toString};