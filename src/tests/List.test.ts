/* eslint-disable @typescript-eslint/ban-ts-comment */
import { List, Nil } from '../collections/immutable';

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const list = List.of(...arr);

test('Assign unknown property', () => {
  expect(() => {
    // @ts-expect-error
    list.q = 0;
  }).toThrow();
});

test('Assign head', () => {
  expect(() => {
    // @ts-expect-error
    list.head = 0;
  }).toThrow();
});

test('Assign size', () => {
  expect(() => {
    // @ts-expect-error
    list.size = 0;
  }).toThrow();
});

test('Redefine head', () => {
  expect(() => {
    Object.defineProperty(list, 'head', {
      get() {
        throw new Error('123');
      },
    });
  }).toThrow();
});

test('Define new property `prop1` on `Nil`', () => {
  expect(() => {
    Object.defineProperty(Nil, 'prop1', { configurable: true });
  }).toThrow();
});

test('Access to tail of Nil', () => {
  expect(() => {
    console.log(Nil.tail);
  }).toThrow();
});

test('Access to head of Nil', () => {
  expect(() => {
    console.log(Nil.head);
  }).toThrow('Can not read head of empty list');
});

test('reduce', () => {
  expect(list.reduce((acc, v) => ({ ...acc, [v]: v }), {})).toEqual({
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
  });
});

test('reverse', () => {
  expect(list.reverse().toArray()).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
});

test('map', () => {
  expect(list.map((_) => _ * 2).toArray()).toEqual([2, 4, 6, 8, 10, 12, 14, 16, 18, 20]);
  expect(Nil.map((_) => _ * 2)).toBe(Nil);
});

test('append', () => {
  expect(list.append(100, 200).toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 100, 200]);
});

test('prepend', () => {
  expect(list.prepend(100, 200).toArray()).toEqual([100, 200, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  expect(Nil.prepend(1).toArray()).toEqual([1]);
});

test('concat', () => {
  expect(Nil.concat(List.of(0)).toArray()).toEqual([0]);
  expect(list.concat(List.of(0)).toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0]);
});

test('filter', () => {
  expect(list.filter((_) => _ > 10)).toBe(Nil);
  expect(list.filter((_) => _ > 8).toArray()).toEqual([9, 10]);
  expect(Nil.filter((_) => _ > 8)).toBe(Nil);

  const l = list
    .filter((_) => _ > 8)
    .concat(List.of(0))
    .replace((v) => v === 0, 100);
  expect(l.size()).toEqual(l.toArray().length);
});

test('replace', () => {
  expect(list.replace((_) => _ === 5, 500).toArray()).toEqual([1, 2, 3, 4, 500, 6, 7, 8, 9, 10]);
  expect(list.replace((_) => _ === 1, 100).toArray()).toEqual([100, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  expect(list.replace((_) => _ === 10, 1000).toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 1000]);
  expect(list.replace((_) => _ === -1, 500)).toBe(list);
  expect(Nil.replace((_) => _ === -1, 500)).toBe(Nil);
});

test('join', () => {
  expect(list.join()).toBe('1, 2, 3, 4, 5, 6, 7, 8, 9, 10');
});

test('iterator', () => {
  let iterator = list[Symbol.iterator]();
  let values = [];
  for (let result = iterator.next(); result.done !== true; result = iterator.next()) {
    values.push(result.value);
  }
  expect(values).toEqual(arr);

  iterator = list[Symbol.iterator]();
  values = [];
  for (let result = iterator.next(); result.done !== true; result = iterator.next()) {
    values.push(result.value);
  }
  expect(values).toEqual(arr);
});

// const list = List.of(1, 2, 3, 4, 5);
// console.dir(list);

// for (const v of list) {
//   console.log(v);
// }

// console.log(list.map((v, i, ar) => v).join('-'));
// list.forEach(v => console.log(v));
// arr.forEach(v => v);
// console.log('arr');

// for (const v of list) {}
// console.log('for list');

// list.forEach(v => v);
// console.log('list');
