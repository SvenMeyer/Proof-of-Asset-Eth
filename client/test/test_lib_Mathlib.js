/* eslint-disable no-console */
// node --experimental-modules test_lib_Mathlib.mjs

import MathUtils from '../src/lib/MathUtils.mjs';

const { ethers } = require("ethers");

const decimals = 6;  // has to match test case values

const a = [ // inp, out
	[       '0' ,  '0.000000'],
	[       '0' ,  '0.0'],
	[ '1000000' ,  '1.000000'],
	['-1000000' , '-1.000000'],
	[       '1' ,  '0.000001'],
	[  '123456' ,  '0.123456'],
	[  '-123456' ,  '-0.123456']
]

console.log("MathUtils.fixedPoint_toString");
a.forEach( t => {
	let [inp, out] = t;
	console.log(inp, out, MathUtils.fixedPoint_toString(inp, decimals));
});

console.log();

const test_cases = [ // inp , out
  [ '0.000000', '0' ],
  [ '0.0', '0' ],
  [ '0.', '0' ],
  [ '.0', '0' ],
  [ '0', '0' ],
  [ '1.000000', '1000000' ],
  [ '001.', '1000000' ],
  [ '001.00012', '1000120' ],
  [ '0.001200', '1200' ],
  [ '.001200', '1200' ],
  [ '0.0012', '1200' ],
  [ '.0012', '1200' ],
  [ '-1.000000', '-1000000' ],
  [ '0.000001', '1' ],
  [ '0.123456', '123456' ],
  [ '-0.123456', '-123456' ],
  [ '-.0012', '-1200' ],
  [ '123.0012', '123001200' ],
  [ '123,456.0012', '123456001200' ],
  [ '123 456.0012', '123456001200' ],
	[ '-' , 'undefined'],
	[ '.' , 'undefined'],
	[ ' ' , 'undefined'],
	[ ''  , 'undefined'],
	[ '-0' , '0'],
	[ '-0.' , '0'],
	[ '-0.0' , '0'],
	[ '-0.001' , '-1000'],
];

let error = 0;
console.log("MathUtils.fixedPoint_fromString")
test_cases.forEach( t => {
	let [inp, out] = t;
	let result = MathUtils.fixedPoint_fromString(inp, decimals);
	console.log(inp, out, result , (result ? result : 'undefined') == out ? 'ok' : '*** ERROR ' + ++error);
})
console.log("ERRORS =", error)


test_cases.forEach(t => {
  const u = MathUtils.uint_fixedPoint_fromString(t, decimals);
  const b = ethers.BigNumber.from(u);
  const s = MathUtils.uint_fixedPoint_toString(b.toString(), decimals)
  console.log(t, u, b.toString(), s);
})
