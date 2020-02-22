// @param :  string representing a float number
// @param :  decimals (int) : number of decimals of fractional
// @return : fixed point integer string
function uint_fixedPoint_fromFloatSting(s, decimals) {
  s = s.split(',').join('');  // replace  1000 separator
  s = s.split(' ').join('');  // replace space separator
  if (s=='' || s=='.') //  || s.slice(0, 1) == '-')  // some simple error checks
    return undefined;
  let [i,f] = s.split('.');
  return [i, f, '0'.repeat(Math.max(decimals-(f || '').length,0)).substr(0,decimals)].join('').replace(/^0+/, '') || 0;
}

function fixedPoint_fromFloatSting(s, decimals) {
  if (s.slice(0, 1) == '-') {
    let fp = uint_fixedPoint_fromFloatSting(s.slice(1), decimals);  // from index 1 to the end
    if (fp)
      return '-' + fp;
    else
     return undefined;
  }
  else
    return uint_fixedPoint_fromFloatSting(s, decimals);
}

// @param fps (String)   : long integer number
// @param decimals (int) : number of decimals which represent fractional part
// @return (String)      : 123.456000
function uint_fixedPoint_toFloatString (fp, decimals) {
  if (fp.length <= decimals)
    return '0.' + '0'.repeat(decimals-fp.length) + fp;
  else
    return  fp.substr(0, fp.length-decimals) + '.' + fp.substr(fp.length-decimals, decimals);
}

function fixedPoint_toFloatString(s, decimals) {
  if (s.slice(0, 1) == '-')
    return '-' + uint_fixedPoint_toFloatString(s.slice(1), decimals);  // from index 1 to the end
  else
    return uint_fixedPoint_toFloatString(s, decimals);
}

export default {uint_fixedPoint_fromFloatSting, fixedPoint_fromFloatSting, uint_fixedPoint_toFloatString, fixedPoint_toFloatString};