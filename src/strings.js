import * as R from 'ramda';
import * as L from 'partial.lenses';

const C = R.compose;

// String manipulation functions

export const toCapital = R.pipe(R.toLower, R.pipe(R.adjust(R.toUpper, 0), R.join('')));

// Shorthand helpers

const transformSeq = (...tfns) => L.transform(L.seq(...tfns));
const tailL = L.slice(1, undefined)

// Parametric transforms

const forEvery = fn => [L.elems, L.modifyOp(fn)];
const joinWith = sep => L.modifyOp(R.join(sep));
const eachThru = (tfn, slice = L.identity) => [slice, L.elems, L.modifyOp(tfn)];

// Generic transforms

const capitalizeAllT = forEvery(toCapital);
const lowerAllT = forEvery(R.toLower);
const upperAllT = forEvery(R.toUpper);

//

export const splitCamel = R.split(/(?=[A-Z])/g);
export const splitPascal = splitCamel;    // Is this a necessary handler?
export const splitKebab = R.split('-');
export const splitConst = R.split('_');

//

const asCamel = [lowerAllT, eachThru(toCapital, tailL), joinWith('')];
const asPascal = [lowerAllT, capitalizeAllT, joinWith('')];
const asKebab = [lowerAllT, joinWith('-')];
const asConst = [upperAllT, joinWith('_')];

export const joinCamel = transformSeq(...asCamel);
export const joinPascal = transformSeq(...asPascal);
export const joinKebab = transformSeq(...asKebab);
export const joinConst = transformSeq(...asConst);

//

export const fromOBSToken = C(joinConst, splitPascal);
export const toOBSToken = C(joinPascal, splitConst);

/**
 * Convert a kebab-cased string into camel-case
 *
 * @param {string} k
 * @returns {string}
 */
export const fromOBSKey = C(joinCamel, splitKebab);

/**
 * Convert a camel-cased string into kebab-case
 *
 * @param {string} k
 * @returns {string}
 */
export const toOBSKey = C(joinKebab, splitCamel);

/**
 * Convert any kebab-cased keys into camel-case
 *
 * @param {object} o
 * @returns {object}
 */
export const fromOBS = L.modify(L.keys, L.transform(L.modifyOp(fromOBSKey)));

/**
 * Convert any camel-cased keys into kebab-case
 *
 * @param {object} o
 * @returns {object}
 */
export const toOBS = L.modify(L.keys, L.transform(L.modifyOp(toOBSKey)));

/**
 * Isomorphism for use with objects interfacing with OBS WebSockets.
 * Ensures objects have camel-cased keys when reading an object,
 * and kebab-cased keys when writing.
 *
 * For use with `partial.lenses` operations only.
 */
export const obsI = L.iso(fromOBS, toOBS);
export const obsTokenI = L.iso(fromOBSToken, toOBSToken);

export const isos = {
  object: obsI,
  token: obsTokenI,
};
