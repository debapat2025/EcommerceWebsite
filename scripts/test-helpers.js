const { getPagination, buildMeta } = require('../src/utils/pagination');
const { parseSort, escapeRegex } = require('../src/utils/queryHelpers');

console.log(getPagination({}));
console.log(getPagination({ page: '3', limit: '20' }));
console.log(getPagination({ page: '-5', limit: '1000' }));
console.log(getPagination({ page: 'abc', limit: 'abc' }));

console.log(buildMeta(95, 2, 10));
console.log(buildMeta(0, 1, 10));

const allowed = ['createdAt', 'name'];
console.log(parseSort('-createdAt,name', allowed));
console.log(parseSort('password', allowed));
console.log(parseSort(undefined, allowed));

console.log(escapeRegex('a.b(c)'));
try { new RegExp('a('); } catch (e) { console.log('raw regex fails:', e.message); }
console.log('escaped regex works:', new RegExp(escapeRegex('a(')).test('a('));