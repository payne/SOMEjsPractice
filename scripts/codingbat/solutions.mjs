// Model JavaScript solutions for the CodingBat set, keyed by CodingBat section.
// Each entry is a function, or [function, helper, ...] when the problem asks for
// helper functions. build.mjs turns each function's source into the question's solution.
// The problems themselves come from CodingBat Java (https://codingbat.com/java) by Nick Parlante.
/* eslint-disable no-unused-vars */

export default {
'Warmup-1': [
function sleepIn(weekday, vacation) {
  return !weekday || vacation;
},
function monkeyTrouble(aSmile, bSmile) {
  return aSmile === bSmile;
},
function sumDouble(a, b) {
  const sum = a + b;
  if (a === b) {
    return sum * 2;
  }
  return sum;
},
function diff21(n) {
  if (n <= 21) {
    return 21 - n;
  }
  return (n - 21) * 2;
},
function parrotTrouble(talking, hour) {
  return talking && (hour < 7 || hour > 20);
},
function makes10(a, b) {
  return a === 10 || b === 10 || a + b === 10;
},
function nearHundred(n) {
  return Math.abs(100 - n) <= 10 || Math.abs(200 - n) <= 10;
},
function posNeg(a, b, negative) {
  if (negative) {
    return a < 0 && b < 0;
  }
  return (a < 0 && b > 0) || (a > 0 && b < 0);
},
function notString(str) {
  if (str.startsWith('not')) {
    return str;
  }
  return 'not ' + str;
},
function missingChar(str, n) {
  return str.substring(0, n) + str.substring(n + 1);
},
function frontBack(str) {
  if (str.length <= 1) {
    return str;
  }
  const mid = str.substring(1, str.length - 1);
  return str.charAt(str.length - 1) + mid + str.charAt(0);
},
function front3(str) {
  const front = str.substring(0, 3);
  return front + front + front;
},
function backAround(str) {
  const last = str.charAt(str.length - 1);
  return last + str + last;
},
function or35(n) {
  return n % 3 === 0 || n % 5 === 0;
},
function front22(str) {
  const front = str.substring(0, 2);
  return front + str + front;
},
function startHi(str) {
  return str.startsWith('hi');
},
function icyHot(temp1, temp2) {
  return (temp1 < 0 && temp2 > 100) || (temp1 > 100 && temp2 < 0);
},
function in1020(a, b) {
  return (a >= 10 && a <= 20) || (b >= 10 && b <= 20);
},
function hasTeen(a, b, c) {
  return (a >= 13 && a <= 19) || (b >= 13 && b <= 19) || (c >= 13 && c <= 19);
},
function loneTeen(a, b) {
  const aTeen = a >= 13 && a <= 19;
  const bTeen = b >= 13 && b <= 19;
  return aTeen !== bTeen;
},
function delDel(str) {
  if (str.substring(1, 4) === 'del') {
    return str.charAt(0) + str.substring(4);
  }
  return str;
},
function mixStart(str) {
  return str.substring(1, 3) === 'ix';
},
function startOz(str) {
  let result = '';
  if (str.charAt(0) === 'o') {
    result += 'o';
  }
  if (str.charAt(1) === 'z') {
    result += 'z';
  }
  return result;
},
function intMax(a, b, c) {
  let max = a;
  if (b > max) {
    max = b;
  }
  if (c > max) {
    max = c;
  }
  return max;
},
function close10(a, b) {
  const aDiff = Math.abs(a - 10);
  const bDiff = Math.abs(b - 10);
  if (aDiff < bDiff) {
    return a;
  }
  if (bDiff < aDiff) {
    return b;
  }
  return 0;
},
function in3050(a, b) {
  if (a >= 30 && a <= 40 && b >= 30 && b <= 40) {
    return true;
  }
  return a >= 40 && a <= 50 && b >= 40 && b <= 50;
},
function max1020(a, b) {
  let result = 0;
  if (a >= 10 && a <= 20) {
    result = a;
  }
  if (b >= 10 && b <= 20 && b > result) {
    result = b;
  }
  return result;
},
function stringE(str) {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) === 'e') {
      count++;
    }
  }
  return count >= 1 && count <= 3;
},
function lastDigit(a, b) {
  return a % 10 === b % 10;
},
function endUp(str) {
  if (str.length <= 3) {
    return str.toUpperCase();
  }
  const cut = str.length - 3;
  return str.substring(0, cut) + str.substring(cut).toUpperCase();
},
function everyNth(str, n) {
  let result = '';
  for (let i = 0; i < str.length; i += n) {
    result += str.charAt(i);
  }
  return result;
},
],

'Warmup-2': [
function stringTimes(str, n) {
  let result = '';
  for (let i = 0; i < n; i++) {
    result += str;
  }
  return result;
},
function frontTimes(str, n) {
  const front = str.substring(0, 3);
  let result = '';
  for (let i = 0; i < n; i++) {
    result += front;
  }
  return result;
},
function countXX(str) {
  let count = 0;
  for (let i = 0; i < str.length - 1; i++) {
    if (str.substring(i, i + 2) === 'xx') {
      count++;
    }
  }
  return count;
},
function doubleX(str) {
  const i = str.indexOf('x');
  if (i === -1) {
    return false;
  }
  return str.charAt(i + 1) === 'x';
},
function stringBits(str) {
  let result = '';
  for (let i = 0; i < str.length; i += 2) {
    result += str.charAt(i);
  }
  return result;
},
function stringSplosion(str) {
  let result = '';
  for (let i = 1; i <= str.length; i++) {
    result += str.substring(0, i);
  }
  return result;
},
function last2(str) {
  if (str.length < 2) {
    return 0;
  }
  const end = str.substring(str.length - 2);
  let count = 0;
  for (let i = 0; i < str.length - 2; i++) {
    if (str.substring(i, i + 2) === end) {
      count++;
    }
  }
  return count;
},
function arrayCount9(nums) {
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 9) {
      count++;
    }
  }
  return count;
},
function arrayFront9(nums) {
  const end = Math.min(nums.length, 4);
  for (let i = 0; i < end; i++) {
    if (nums[i] === 9) {
      return true;
    }
  }
  return false;
},
function array123(nums) {
  for (let i = 0; i < nums.length - 2; i++) {
    if (nums[i] === 1 && nums[i + 1] === 2 && nums[i + 2] === 3) {
      return true;
    }
  }
  return false;
},
function stringMatch(a, b) {
  const len = Math.min(a.length, b.length);
  let count = 0;
  for (let i = 0; i < len - 1; i++) {
    if (a.substring(i, i + 2) === b.substring(i, i + 2)) {
      count++;
    }
  }
  return count;
},
function stringX(str) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const ch = str.charAt(i);
    if (ch !== 'x' || i === 0 || i === str.length - 1) {
      result += ch;
    }
  }
  return result;
},
function altPairs(str) {
  let result = '';
  for (let i = 0; i < str.length; i += 4) {
    result += str.substring(i, i + 2);
  }
  return result;
},
function stringYak(str) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    if (i + 2 < str.length && str.charAt(i) === 'y' && str.charAt(i + 2) === 'k') {
      i += 2; // skip the rest of the "yak"
    } else {
      result += str.charAt(i);
    }
  }
  return result;
},
function array667(nums) {
  let count = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] === 6 && (nums[i + 1] === 6 || nums[i + 1] === 7)) {
      count++;
    }
  }
  return count;
},
function noTriples(nums) {
  for (let i = 0; i < nums.length - 2; i++) {
    if (nums[i] === nums[i + 1] && nums[i] === nums[i + 2]) {
      return false;
    }
  }
  return true;
},
function has271(nums) {
  for (let i = 0; i < nums.length - 2; i++) {
    const val = nums[i];
    if (nums[i + 1] === val + 5 && Math.abs(nums[i + 2] - (val - 1)) <= 2) {
      return true;
    }
  }
  return false;
},
],

'String-1': [
function helloName(name) {
  return 'Hello ' + name + '!';
},
function makeAbba(a, b) {
  return a + b + b + a;
},
function makeTags(tag, word) {
  return '<' + tag + '>' + word + '</' + tag + '>';
},
function makeOutWord(out, word) {
  return out.substring(0, 2) + word + out.substring(2);
},
function extraEnd(str) {
  const end = str.substring(str.length - 2);
  return end + end + end;
},
function firstTwo(str) {
  return str.substring(0, 2);
},
function firstHalf(str) {
  return str.substring(0, str.length / 2);
},
function withoutEnd(str) {
  return str.substring(1, str.length - 1);
},
function comboString(a, b) {
  if (a.length < b.length) {
    return a + b + a;
  }
  return b + a + b;
},
function nonStart(a, b) {
  return a.substring(1) + b.substring(1);
},
function left2(str) {
  return str.substring(2) + str.substring(0, 2);
},
function right2(str) {
  const cut = str.length - 2;
  return str.substring(cut) + str.substring(0, cut);
},
function theEnd(str, front) {
  if (front) {
    return str.charAt(0);
  }
  return str.charAt(str.length - 1);
},
function withouEnd2(str) {
  if (str.length < 2) {
    return '';
  }
  return str.substring(1, str.length - 1);
},
function middleTwo(str) {
  const mid = str.length / 2;
  return str.substring(mid - 1, mid + 1);
},
function endsLy(str) {
  return str.endsWith('ly');
},
function nTwice(str, n) {
  return str.substring(0, n) + str.substring(str.length - n);
},
function twoChar(str, index) {
  if (index < 0 || index + 2 > str.length) {
    index = 0;
  }
  return str.substring(index, index + 2);
},
function middleThree(str) {
  const mid = Math.floor(str.length / 2);
  return str.substring(mid - 1, mid + 2);
},
function hasBad(str) {
  return str.substring(0, 3) === 'bad' || str.substring(1, 4) === 'bad';
},
function atFirst(str) {
  if (str.length >= 2) {
    return str.substring(0, 2);
  }
  if (str.length === 1) {
    return str + '@';
  }
  return '@@';
},
function lastChars(a, b) {
  const first = a.length > 0 ? a.charAt(0) : '@';
  const last = b.length > 0 ? b.charAt(b.length - 1) : '@';
  return first + last;
},
function conCat(a, b) {
  if (a.length > 0 && b.length > 0 && a.charAt(a.length - 1) === b.charAt(0)) {
    return a + b.substring(1);
  }
  return a + b;
},
function lastTwo(str) {
  if (str.length < 2) {
    return str;
  }
  const n = str.length;
  return str.substring(0, n - 2) + str.charAt(n - 1) + str.charAt(n - 2);
},
function seeColor(str) {
  if (str.startsWith('red')) {
    return 'red';
  }
  if (str.startsWith('blue')) {
    return 'blue';
  }
  return '';
},
function frontAgain(str) {
  return str.length >= 2 && str.substring(0, 2) === str.substring(str.length - 2);
},
function minCat(a, b) {
  const len = Math.min(a.length, b.length);
  return a.substring(a.length - len) + b.substring(b.length - len);
},
function extraFront(str) {
  const front = str.substring(0, 2);
  return front + front + front;
},
function without2(str) {
  if (str.length >= 2 && str.substring(0, 2) === str.substring(str.length - 2)) {
    return str.substring(2);
  }
  return str;
},
function deFront(str) {
  let result = '';
  if (str.charAt(0) === 'a') {
    result += 'a';
  }
  if (str.charAt(1) === 'b') {
    result += 'b';
  }
  return result + str.substring(2);
},
function startWord(str, word) {
  const len = word.length;
  if (str.length >= len && str.substring(1, len) === word.substring(1)) {
    return str.substring(0, len);
  }
  return '';
},
function withoutX(str) {
  if (str.startsWith('x')) {
    str = str.substring(1);
  }
  if (str.endsWith('x')) {
    str = str.substring(0, str.length - 1);
  }
  return str;
},
function withoutX2(str) {
  let result = '';
  if (str.length > 0 && str.charAt(0) !== 'x') {
    result += str.charAt(0);
  }
  if (str.length > 1 && str.charAt(1) !== 'x') {
    result += str.charAt(1);
  }
  return result + str.substring(2);
},
],

'Array-1': [
function firstLast6(nums) {
  return nums[0] === 6 || nums[nums.length - 1] === 6;
},
function sameFirstLast(nums) {
  return nums.length >= 1 && nums[0] === nums[nums.length - 1];
},
function makePi() {
  return [3, 1, 4];
},
function commonEnd(a, b) {
  return a[0] === b[0] || a[a.length - 1] === b[b.length - 1];
},
function sum3(nums) {
  return nums[0] + nums[1] + nums[2];
},
function rotateLeft3(nums) {
  return [nums[1], nums[2], nums[0]];
},
function reverse3(nums) {
  return [nums[2], nums[1], nums[0]];
},
function maxEnd3(nums) {
  const max = Math.max(nums[0], nums[2]);
  nums[0] = max;
  nums[1] = max;
  nums[2] = max;
  return nums;
},
function sum2(nums) {
  if (nums.length >= 2) {
    return nums[0] + nums[1];
  }
  if (nums.length === 1) {
    return nums[0];
  }
  return 0;
},
function middleWay(a, b) {
  return [a[1], b[1]];
},
function makeEnds(nums) {
  return [nums[0], nums[nums.length - 1]];
},
function has23(nums) {
  return nums[0] === 2 || nums[0] === 3 || nums[1] === 2 || nums[1] === 3;
},
function no23(nums) {
  return nums[0] !== 2 && nums[0] !== 3 && nums[1] !== 2 && nums[1] !== 3;
},
function makeLast(nums) {
  const result = new Array(nums.length * 2).fill(0);
  result[result.length - 1] = nums[nums.length - 1];
  return result;
},
function double23(nums) {
  if (nums.length !== 2) {
    return false;
  }
  return (nums[0] === 2 && nums[1] === 2) || (nums[0] === 3 && nums[1] === 3);
},
function fix23(nums) {
  for (let i = 0; i < 2; i++) {
    if (nums[i] === 2 && nums[i + 1] === 3) {
      nums[i + 1] = 0;
    }
  }
  return nums;
},
function start1(a, b) {
  let count = 0;
  if (a.length > 0 && a[0] === 1) {
    count++;
  }
  if (b.length > 0 && b[0] === 1) {
    count++;
  }
  return count;
},
function biggerTwo(a, b) {
  if (b[0] + b[1] > a[0] + a[1]) {
    return b;
  }
  return a;
},
function makeMiddle(nums) {
  const mid = nums.length / 2;
  return [nums[mid - 1], nums[mid]];
},
function plusTwo(a, b) {
  return [a[0], a[1], b[0], b[1]];
},
function swapEnds(nums) {
  const first = nums[0];
  nums[0] = nums[nums.length - 1];
  nums[nums.length - 1] = first;
  return nums;
},
function midThree(nums) {
  const mid = Math.floor(nums.length / 2);
  return [nums[mid - 1], nums[mid], nums[mid + 1]];
},
function maxTriple(nums) {
  const mid = nums[Math.floor(nums.length / 2)];
  return Math.max(nums[0], mid, nums[nums.length - 1]);
},
function frontPiece(nums) {
  return nums.slice(0, 2);
},
function unlucky1(nums) {
  const n = nums.length;
  if (n >= 2 && nums[0] === 1 && nums[1] === 3) {
    return true;
  }
  if (n >= 3 && nums[1] === 1 && nums[2] === 3) {
    return true;
  }
  return n >= 2 && nums[n - 2] === 1 && nums[n - 1] === 3;
},
function make2(a, b) {
  const result = [];
  for (let i = 0; i < a.length && result.length < 2; i++) {
    result.push(a[i]);
  }
  for (let i = 0; i < b.length && result.length < 2; i++) {
    result.push(b[i]);
  }
  return result;
},
function front11(a, b) {
  const result = [];
  if (a.length > 0) {
    result.push(a[0]);
  }
  if (b.length > 0) {
    result.push(b[0]);
  }
  return result;
},
],

'Logic-1': [
function cigarParty(cigars, isWeekend) {
  if (isWeekend) {
    return cigars >= 40;
  }
  return cigars >= 40 && cigars <= 60;
},
function dateFashion(you, date) {
  if (you <= 2 || date <= 2) {
    return 0;
  }
  if (you >= 8 || date >= 8) {
    return 2;
  }
  return 1;
},
function squirrelPlay(temp, isSummer) {
  const upper = isSummer ? 100 : 90;
  return temp >= 60 && temp <= upper;
},
function caughtSpeeding(speed, isBirthday) {
  const bonus = isBirthday ? 5 : 0;
  if (speed <= 60 + bonus) {
    return 0;
  }
  if (speed <= 80 + bonus) {
    return 1;
  }
  return 2;
},
function sortaSum(a, b) {
  const sum = a + b;
  if (sum >= 10 && sum <= 19) {
    return 20;
  }
  return sum;
},
function alarmClock(day, vacation) {
  const weekend = day === 0 || day === 6;
  if (vacation) {
    return weekend ? 'off' : '10:00';
  }
  return weekend ? '10:00' : '7:00';
},
function love6(a, b) {
  return a === 6 || b === 6 || a + b === 6 || Math.abs(a - b) === 6;
},
function in1To10(n, outsideMode) {
  if (outsideMode) {
    return n <= 1 || n >= 10;
  }
  return n >= 1 && n <= 10;
},
function specialEleven(n) {
  return n % 11 === 0 || n % 11 === 1;
},
function more20(n) {
  return n % 20 === 1 || n % 20 === 2;
},
function old35(n) {
  return (n % 3 === 0) !== (n % 5 === 0);
},
function less20(n) {
  return n % 20 === 18 || n % 20 === 19;
},
function nearTen(num) {
  const rem = num % 10;
  return rem <= 2 || rem >= 8;
},
function teenSum(a, b) {
  if ((a >= 13 && a <= 19) || (b >= 13 && b <= 19)) {
    return 19;
  }
  return a + b;
},
function answerCell(isMorning, isMom, isAsleep) {
  if (isAsleep) {
    return false;
  }
  if (isMorning) {
    return isMom;
  }
  return true;
},
function teaParty(tea, candy) {
  if (tea < 5 || candy < 5) {
    return 0;
  }
  if (tea >= 2 * candy || candy >= 2 * tea) {
    return 2;
  }
  return 1;
},
function fizzString(str) {
  const fizz = str.startsWith('f');
  const buzz = str.endsWith('b');
  if (fizz && buzz) {
    return 'FizzBuzz';
  }
  if (fizz) {
    return 'Fizz';
  }
  if (buzz) {
    return 'Buzz';
  }
  return str;
},
function fizzString2(n) {
  if (n % 15 === 0) {
    return 'FizzBuzz!';
  }
  if (n % 3 === 0) {
    return 'Fizz!';
  }
  if (n % 5 === 0) {
    return 'Buzz!';
  }
  return n + '!';
},
function twoAsOne(a, b, c) {
  return a + b === c || a + c === b || b + c === a;
},
function inOrder(a, b, c, bOk) {
  if (bOk) {
    return c > b;
  }
  return b > a && c > b;
},
function inOrderEqual(a, b, c, equalOk) {
  if (equalOk) {
    return a <= b && b <= c;
  }
  return a < b && b < c;
},
function lastDigit(a, b, c) {
  const a1 = a % 10;
  const b1 = b % 10;
  const c1 = c % 10;
  return a1 === b1 || a1 === c1 || b1 === c1;
},
function lessBy10(a, b, c) {
  return Math.abs(a - b) >= 10 || Math.abs(a - c) >= 10 || Math.abs(b - c) >= 10;
},
function withoutDoubles(die1, die2, noDoubles) {
  if (noDoubles && die1 === die2) {
    die1 = die1 === 6 ? 1 : die1 + 1;
  }
  return die1 + die2;
},
function maxMod5(a, b) {
  if (a === b) {
    return 0;
  }
  if (a % 5 === b % 5) {
    return Math.min(a, b);
  }
  return Math.max(a, b);
},
function redTicket(a, b, c) {
  if (a === 2 && b === 2 && c === 2) {
    return 10;
  }
  if (a === b && b === c) {
    return 5;
  }
  if (b !== a && c !== a) {
    return 1;
  }
  return 0;
},
function greenTicket(a, b, c) {
  if (a === b && b === c) {
    return 20;
  }
  if (a === b || b === c || a === c) {
    return 10;
  }
  return 0;
},
function blueTicket(a, b, c) {
  const ab = a + b;
  const bc = b + c;
  const ac = a + c;
  if (ab === 10 || bc === 10 || ac === 10) {
    return 10;
  }
  if (ab === bc + 10 || ab === ac + 10) {
    return 5;
  }
  return 0;
},
function shareDigit(a, b) {
  const aLeft = Math.floor(a / 10);
  const aRight = a % 10;
  const bLeft = Math.floor(b / 10);
  const bRight = b % 10;
  return aLeft === bLeft || aLeft === bRight || aRight === bLeft || aRight === bRight;
},
function sumLimit(a, b) {
  const sum = a + b;
  if (String(sum).length === String(a).length) {
    return sum;
  }
  return a;
},
],

'Logic-2': [
function makeBricks(small, big, goal) {
  if (goal > big * 5 + small) {
    return false;
  }
  return goal % 5 <= small;
},
function loneSum(a, b, c) {
  let sum = 0;
  if (a !== b && a !== c) {
    sum += a;
  }
  if (b !== a && b !== c) {
    sum += b;
  }
  if (c !== a && c !== b) {
    sum += c;
  }
  return sum;
},
function luckySum(a, b, c) {
  if (a === 13) {
    return 0;
  }
  if (b === 13) {
    return a;
  }
  if (c === 13) {
    return a + b;
  }
  return a + b + c;
},
[function noTeenSum(a, b, c) {
  return fixTeen(a) + fixTeen(b) + fixTeen(c);
},
function fixTeen(n) {
  if (n >= 13 && n <= 19 && n !== 15 && n !== 16) {
    return 0;
  }
  return n;
}],
[function roundSum(a, b, c) {
  return round10(a) + round10(b) + round10(c);
},
function round10(num) {
  const digit = num % 10;
  if (digit >= 5) {
    return num + 10 - digit;
  }
  return num - digit;
}],
function closeFar(a, b, c) {
  const bClose = Math.abs(a - b) <= 1;
  const cClose = Math.abs(a - c) <= 1;
  const bFar = Math.abs(a - b) >= 2 && Math.abs(c - b) >= 2;
  const cFar = Math.abs(a - c) >= 2 && Math.abs(b - c) >= 2;
  return (bClose && cFar) || (cClose && bFar);
},
function blackjack(a, b) {
  if (a > 21) {
    a = 0;
  }
  if (b > 21) {
    b = 0;
  }
  return Math.max(a, b);
},
function evenlySpaced(a, b, c) {
  const [small, medium, large] = [a, b, c].sort((x, y) => x - y);
  return medium - small === large - medium;
},
function makeChocolate(small, big, goal) {
  const bigUsed = Math.min(big, Math.floor(goal / 5));
  const smallNeeded = goal - bigUsed * 5;
  if (smallNeeded <= small) {
    return smallNeeded;
  }
  return -1;
},
],

'String-2': [
function doubleChar(str) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    result += str.charAt(i) + str.charAt(i);
  }
  return result;
},
function countHi(str) {
  let count = 0;
  for (let i = 0; i < str.length - 1; i++) {
    if (str.substring(i, i + 2) === 'hi') {
      count++;
    }
  }
  return count;
},
function catDog(str) {
  let cats = 0;
  let dogs = 0;
  for (let i = 0; i < str.length - 2; i++) {
    const three = str.substring(i, i + 3);
    if (three === 'cat') {
      cats++;
    } else if (three === 'dog') {
      dogs++;
    }
  }
  return cats === dogs;
},
function countCode(str) {
  let count = 0;
  for (let i = 0; i < str.length - 3; i++) {
    if (str.substring(i, i + 2) === 'co' && str.charAt(i + 3) === 'e') {
      count++;
    }
  }
  return count;
},
function endOther(a, b) {
  const aLow = a.toLowerCase();
  const bLow = b.toLowerCase();
  return aLow.endsWith(bLow) || bLow.endsWith(aLow);
},
function xyzThere(str) {
  for (let i = 0; i < str.length - 2; i++) {
    if (str.substring(i, i + 3) === 'xyz' && (i === 0 || str.charAt(i - 1) !== '.')) {
      return true;
    }
  }
  return false;
},
function bobThere(str) {
  for (let i = 0; i < str.length - 2; i++) {
    if (str.charAt(i) === 'b' && str.charAt(i + 2) === 'b') {
      return true;
    }
  }
  return false;
},
function xyBalance(str) {
  const lastX = str.lastIndexOf('x');
  if (lastX === -1) {
    return true;
  }
  return str.lastIndexOf('y') > lastX;
},
function mixString(a, b) {
  let result = '';
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (i < a.length) {
      result += a.charAt(i);
    }
    if (i < b.length) {
      result += b.charAt(i);
    }
  }
  return result;
},
function repeatEnd(str, n) {
  const end = str.substring(str.length - n);
  let result = '';
  for (let i = 0; i < n; i++) {
    result += end;
  }
  return result;
},
function repeatFront(str, n) {
  let result = '';
  for (let i = n; i > 0; i--) {
    result += str.substring(0, i);
  }
  return result;
},
function repeatSeparator(word, sep, count) {
  let result = '';
  for (let i = 0; i < count; i++) {
    if (i > 0) {
      result += sep;
    }
    result += word;
  }
  return result;
},
function prefixAgain(str, n) {
  const prefix = str.substring(0, n);
  return str.indexOf(prefix, 1) !== -1;
},
function xyzMiddle(str) {
  for (let i = 0; i < str.length - 2; i++) {
    if (str.substring(i, i + 3) === 'xyz') {
      const left = i;
      const right = str.length - (i + 3);
      if (Math.abs(left - right) <= 1) {
        return true;
      }
    }
  }
  return false;
},
function getSandwich(str) {
  const first = str.indexOf('bread');
  const last = str.lastIndexOf('bread');
  if (first === -1 || first === last) {
    return '';
  }
  return str.substring(first + 5, last);
},
function sameStarChar(str) {
  for (let i = 1; i < str.length - 1; i++) {
    if (str.charAt(i) === '*' && str.charAt(i - 1) !== str.charAt(i + 1)) {
      return false;
    }
  }
  return true;
},
function oneTwo(str) {
  let result = '';
  for (let i = 0; i + 3 <= str.length; i += 3) {
    result += str.charAt(i + 1) + str.charAt(i + 2) + str.charAt(i);
  }
  return result;
},
function zipZap(str) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    if (i + 2 < str.length && str.charAt(i) === 'z' && str.charAt(i + 2) === 'p') {
      result += 'zp';
      i += 2;
    } else {
      result += str.charAt(i);
    }
  }
  return result;
},
function starOut(str) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const starHere = str.charAt(i) === '*';
    const starBefore = i > 0 && str.charAt(i - 1) === '*';
    const starAfter = i < str.length - 1 && str.charAt(i + 1) === '*';
    if (!starHere && !starBefore && !starAfter) {
      result += str.charAt(i);
    }
  }
  return result;
},
function plusOut(str, word) {
  let result = '';
  let i = 0;
  while (i < str.length) {
    if (str.startsWith(word, i)) {
      result += word;
      i += word.length;
    } else {
      result += '+';
      i++;
    }
  }
  return result;
},
function wordEnds(str, word) {
  let result = '';
  const len = word.length;
  for (let i = 0; i <= str.length - len; i++) {
    if (str.substring(i, i + len) === word) {
      if (i > 0) {
        result += str.charAt(i - 1);
      }
      if (i + len < str.length) {
        result += str.charAt(i + len);
      }
    }
  }
  return result;
},
],

'String-3': [
function countYZ(str) {
  const lower = str.toLowerCase();
  let count = 0;
  for (let i = 0; i < lower.length; i++) {
    const ch = lower.charAt(i);
    const next = lower.charAt(i + 1); // '' past the end
    if ((ch === 'y' || ch === 'z') && !/[a-z]/.test(next)) {
      count++;
    }
  }
  return count;
},
function withoutString(base, remove) {
  const target = remove.toLowerCase();
  const len = remove.length;
  let result = '';
  let i = 0;
  while (i < base.length) {
    if (base.substring(i, i + len).toLowerCase() === target) {
      i += len;
    } else {
      result += base.charAt(i);
      i++;
    }
  }
  return result;
},
function equalIsNot(str) {
  let is = 0;
  let not = 0;
  for (let i = 0; i < str.length; i++) {
    if (str.startsWith('is', i)) {
      is++;
    }
    if (str.startsWith('not', i)) {
      not++;
    }
  }
  return is === not;
},
function gHappy(str) {
  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) === 'g') {
      const left = i > 0 && str.charAt(i - 1) === 'g';
      const right = str.charAt(i + 1) === 'g';
      if (!left && !right) {
        return false;
      }
    }
  }
  return true;
},
function countTriple(str) {
  let count = 0;
  for (let i = 0; i < str.length - 2; i++) {
    const ch = str.charAt(i);
    if (str.charAt(i + 1) === ch && str.charAt(i + 2) === ch) {
      count++;
    }
  }
  return count;
},
function sumDigits(str) {
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charAt(i);
    if (ch >= '0' && ch <= '9') {
      sum += parseInt(ch);
    }
  }
  return sum;
},
function sameEnds(string) {
  for (let len = Math.floor(string.length / 2); len > 0; len--) {
    const front = string.substring(0, len);
    if (front === string.substring(string.length - len)) {
      return front;
    }
  }
  return '';
},
function mirrorEnds(string) {
  let result = '';
  for (let i = 0; i < string.length; i++) {
    if (string.charAt(i) !== string.charAt(string.length - 1 - i)) {
      break;
    }
    result += string.charAt(i);
  }
  return result;
},
function maxBlock(str) {
  let max = 0;
  let run = 0;
  for (let i = 0; i < str.length; i++) {
    if (i > 0 && str.charAt(i) === str.charAt(i - 1)) {
      run++;
    } else {
      run = 1;
    }
    max = Math.max(max, run);
  }
  return max;
},
function sumNumbers(str) {
  let sum = 0;
  let digits = '';
  for (let i = 0; i <= str.length; i++) {
    const ch = str.charAt(i); // '' past the end ends the last number
    if (ch >= '0' && ch <= '9' && ch !== '') {
      digits += ch;
    } else if (digits !== '') {
      sum += parseInt(digits);
      digits = '';
    }
  }
  return sum;
},
function notReplace(str) {
  const isLetter = (ch) => /[a-zA-Z]/.test(ch);
  let result = '';
  let i = 0;
  while (i < str.length) {
    const before = i > 0 ? str.charAt(i - 1) : '';
    const after = str.charAt(i + 2);
    if (str.startsWith('is', i) && !isLetter(before) && !isLetter(after)) {
      result += 'is not';
      i += 2;
    } else {
      result += str.charAt(i);
      i++;
    }
  }
  return result;
},
],

'Array-2': [
function countEvens(nums) {
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] % 2 === 0) {
      count++;
    }
  }
  return count;
},
function bigDiff(nums) {
  let min = nums[0];
  let max = nums[0];
  for (let i = 1; i < nums.length; i++) {
    min = Math.min(min, nums[i]);
    max = Math.max(max, nums[i]);
  }
  return max - min;
},
function centeredAverage(nums) {
  let sum = 0;
  let min = nums[0];
  let max = nums[0];
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
    min = Math.min(min, nums[i]);
    max = Math.max(max, nums[i]);
  }
  return Math.trunc((sum - min - max) / (nums.length - 2));
},
function sum13(nums) {
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 13 || (i > 0 && nums[i - 1] === 13)) {
      continue;
    }
    sum += nums[i];
  }
  return sum;
},
function sum67(nums) {
  let sum = 0;
  let inSix = false;
  for (let i = 0; i < nums.length; i++) {
    if (inSix) {
      if (nums[i] === 7) {
        inSix = false;
      }
    } else if (nums[i] === 6) {
      inSix = true;
    } else {
      sum += nums[i];
    }
  }
  return sum;
},
function has22(nums) {
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] === 2 && nums[i + 1] === 2) {
      return true;
    }
  }
  return false;
},
function lucky13(nums) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 1 || nums[i] === 3) {
      return false;
    }
  }
  return true;
},
function sum28(nums) {
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 2) {
      sum += 2;
    }
  }
  return sum === 8;
},
function more14(nums) {
  let ones = 0;
  let fours = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 1) {
      ones++;
    } else if (nums[i] === 4) {
      fours++;
    }
  }
  return ones > fours;
},
function fizzArray(n) {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(i);
  }
  return result;
},
function only14(nums) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 1 && nums[i] !== 4) {
      return false;
    }
  }
  return true;
},
function fizzArray2(n) {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(String(i));
  }
  return result;
},
function no14(nums) {
  let ones = 0;
  let fours = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 1) {
      ones++;
    } else if (nums[i] === 4) {
      fours++;
    }
  }
  return ones === 0 || fours === 0;
},
function isEverywhere(nums, val) {
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] !== val && nums[i + 1] !== val) {
      return false;
    }
  }
  return true;
},
function either24(nums) {
  let twos = false;
  let fours = false;
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] === 2 && nums[i + 1] === 2) {
      twos = true;
    }
    if (nums[i] === 4 && nums[i + 1] === 4) {
      fours = true;
    }
  }
  return twos !== fours;
},
function matchUp(nums1, nums2) {
  let count = 0;
  for (let i = 0; i < nums1.length; i++) {
    const diff = Math.abs(nums1[i] - nums2[i]);
    if (diff > 0 && diff <= 2) {
      count++;
    }
  }
  return count;
},
function has77(nums) {
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] === 7 && nums[i + 1] === 7) {
      return true;
    }
    if (i < nums.length - 2 && nums[i] === 7 && nums[i + 2] === 7) {
      return true;
    }
  }
  return false;
},
function has12(nums) {
  let seenOne = false;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 1) {
      seenOne = true;
    } else if (nums[i] === 2 && seenOne) {
      return true;
    }
  }
  return false;
},
function modThree(nums) {
  for (let i = 0; i < nums.length - 2; i++) {
    const parity = nums[i] % 2;
    if (nums[i + 1] % 2 === parity && nums[i + 2] % 2 === parity) {
      return true;
    }
  }
  return false;
},
function haveThree(nums) {
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 3) {
      if (i > 0 && nums[i - 1] === 3) {
        return false;
      }
      count++;
    }
  }
  return count === 3;
},
function twoTwo(nums) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 2) {
      const left = i > 0 && nums[i - 1] === 2;
      const right = i < nums.length - 1 && nums[i + 1] === 2;
      if (!left && !right) {
        return false;
      }
    }
  }
  return true;
},
function sameEnds(nums, len) {
  for (let i = 0; i < len; i++) {
    if (nums[i] !== nums[nums.length - len + i]) {
      return false;
    }
  }
  return true;
},
function tripleUp(nums) {
  for (let i = 0; i < nums.length - 2; i++) {
    if (nums[i + 1] === nums[i] + 1 && nums[i + 2] === nums[i] + 2) {
      return true;
    }
  }
  return false;
},
function fizzArray3(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
},
function shiftLeft(nums) {
  if (nums.length === 0) {
    return nums;
  }
  const first = nums[0];
  for (let i = 0; i < nums.length - 1; i++) {
    nums[i] = nums[i + 1];
  }
  nums[nums.length - 1] = first;
  return nums;
},
function tenRun(nums) {
  let current = null;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] % 10 === 0) {
      current = nums[i];
    } else if (current !== null) {
      nums[i] = current;
    }
  }
  return nums;
},
function pre4(nums) {
  const result = [];
  for (let i = 0; nums[i] !== 4; i++) {
    result.push(nums[i]);
  }
  return result;
},
function post4(nums) {
  const result = [];
  for (let i = nums.length - 1; nums[i] !== 4; i--) {
    result.unshift(nums[i]);
  }
  return result;
},
function notAlone(nums, val) {
  for (let i = 1; i < nums.length - 1; i++) {
    if (nums[i] === val && nums[i - 1] !== val && nums[i + 1] !== val) {
      nums[i] = Math.max(nums[i - 1], nums[i + 1]);
    }
  }
  return nums;
},
function zeroFront(nums) {
  const zeros = [];
  const others = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 0) {
      zeros.push(0);
    } else {
      others.push(nums[i]);
    }
  }
  return zeros.concat(others);
},
function withoutTen(nums) {
  const result = new Array(nums.length).fill(0);
  let j = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 10) {
      result[j] = nums[i];
      j++;
    }
  }
  return result;
},
function zeroMax(nums) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 0) {
      let maxOdd = 0;
      for (let j = i + 1; j < nums.length; j++) {
        if (nums[j] % 2 !== 0 && nums[j] > maxOdd) {
          maxOdd = nums[j];
        }
      }
      nums[i] = maxOdd;
    }
  }
  return nums;
},
function evenOdd(nums) {
  const evens = [];
  const odds = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] % 2 === 0) {
      evens.push(nums[i]);
    } else {
      odds.push(nums[i]);
    }
  }
  return evens.concat(odds);
},
function fizzBuzz(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    if (i % 15 === 0) {
      result.push('FizzBuzz');
    } else if (i % 3 === 0) {
      result.push('Fizz');
    } else if (i % 5 === 0) {
      result.push('Buzz');
    } else {
      result.push(String(i));
    }
  }
  return result;
},
],

'Array-3': [
function maxSpan(nums) {
  let max = 0;
  for (let i = 0; i < nums.length; i++) {
    let j = nums.length - 1;
    while (nums[j] !== nums[i]) {
      j--;
    }
    max = Math.max(max, j - i + 1);
  }
  return max;
},
function fix34(nums) {
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] === 3 && nums[i + 1] !== 4) {
      // find a 4 that is not already placed after a 3
      let j = 0;
      while (!(nums[j] === 4 && (j === 0 || nums[j - 1] !== 3))) {
        j++;
      }
      nums[j] = nums[i + 1];
      nums[i + 1] = 4;
    }
  }
  return nums;
},
function fix45(nums) {
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] === 4 && nums[i + 1] !== 5) {
      // find a 5 that is not already placed after a 4
      let j = 0;
      while (!(nums[j] === 5 && (j === 0 || nums[j - 1] !== 4))) {
        j++;
      }
      nums[j] = nums[i + 1];
      nums[i + 1] = 5;
    }
  }
  return nums;
},
function canBalance(nums) {
  let total = 0;
  for (let i = 0; i < nums.length; i++) {
    total += nums[i];
  }
  let left = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    left += nums[i];
    if (left === total - left) {
      return true;
    }
  }
  return false;
},
function linearIn(outer, inner) {
  let i = 0;
  for (let j = 0; j < inner.length; j++) {
    while (i < outer.length && outer[i] < inner[j]) {
      i++;
    }
    if (i === outer.length || outer[i] !== inner[j]) {
      return false;
    }
  }
  return true;
},
function squareUp(n) {
  const result = [];
  for (let group = 1; group <= n; group++) {
    for (let j = n; j >= 1; j--) {
      result.push(j <= group ? j : 0);
    }
  }
  return result;
},
function seriesUp(n) {
  const result = [];
  for (let group = 1; group <= n; group++) {
    for (let j = 1; j <= group; j++) {
      result.push(j);
    }
  }
  return result;
},
function maxMirror(nums) {
  let max = 0;
  for (let i = 0; i < nums.length; i++) {
    for (let j = nums.length - 1; j >= 0; j--) {
      let len = 0;
      while (i + len < nums.length && j - len >= 0 && nums[i + len] === nums[j - len]) {
        len++;
      }
      max = Math.max(max, len);
    }
  }
  return max;
},
function countClumps(nums) {
  let count = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] === nums[i + 1] && (i === 0 || nums[i - 1] !== nums[i])) {
      count++;
    }
  }
  return count;
},
],

'AP-1': [
function scoresIncreasing(scores) {
  for (let i = 0; i < scores.length - 1; i++) {
    if (scores[i + 1] < scores[i]) {
      return false;
    }
  }
  return true;
},
function scores100(scores) {
  for (let i = 0; i < scores.length - 1; i++) {
    if (scores[i] === 100 && scores[i + 1] === 100) {
      return true;
    }
  }
  return false;
},
function scoresClump(scores) {
  for (let i = 0; i < scores.length - 2; i++) {
    if (scores[i + 2] - scores[i] <= 2) {
      return true;
    }
  }
  return false;
},
[function scoresAverage(scores) {
  const half = Math.floor(scores.length / 2);
  return Math.max(average(scores, 0, half), average(scores, half, scores.length));
},
function average(scores, start, end) {
  let sum = 0;
  for (let i = start; i < end; i++) {
    sum += scores[i];
  }
  return Math.trunc(sum / (end - start));
}],
function wordsCount(words, len) {
  let count = 0;
  for (let i = 0; i < words.length; i++) {
    if (words[i].length === len) {
      count++;
    }
  }
  return count;
},
function wordsFront(words, n) {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(words[i]);
  }
  return result;
},
function wordsWithoutList(words, len) {
  const result = [];
  for (let i = 0; i < words.length; i++) {
    if (words[i].length !== len) {
      result.push(words[i]);
    }
  }
  return result;
},
function hasOne(n) {
  while (n > 0) {
    if (n % 10 === 1) {
      return true;
    }
    n = Math.floor(n / 10);
  }
  return false;
},
function dividesSelf(n) {
  let rest = n;
  while (rest > 0) {
    const digit = rest % 10;
    if (digit === 0 || n % digit !== 0) {
      return false;
    }
    rest = Math.floor(rest / 10);
  }
  return true;
},
function copyEvens(nums, count) {
  const result = [];
  for (let i = 0; i < nums.length && result.length < count; i++) {
    if (nums[i] % 2 === 0) {
      result.push(nums[i]);
    }
  }
  return result;
},
[function copyEndy(nums, count) {
  const result = [];
  for (let i = 0; i < nums.length && result.length < count; i++) {
    if (isEndy(nums[i])) {
      result.push(nums[i]);
    }
  }
  return result;
},
function isEndy(n) {
  return (n >= 0 && n <= 10) || (n >= 90 && n <= 100);
}],
function matchUp(a, b) {
  let count = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i].length > 0 && b[i].length > 0 && a[i].charAt(0) === b[i].charAt(0)) {
      count++;
    }
  }
  return count;
},
function scoreUp(key, answers) {
  let score = 0;
  for (let i = 0; i < key.length; i++) {
    if (answers[i] === key[i]) {
      score += 4;
    } else if (answers[i] !== '?') {
      score -= 1;
    }
  }
  return score;
},
function wordsWithout(words, target) {
  const result = [];
  for (let i = 0; i < words.length; i++) {
    if (words[i] !== target) {
      result.push(words[i]);
    }
  }
  return result;
},
[function scoresSpecial(a, b) {
  return largestSpecial(a) + largestSpecial(b);
},
function largestSpecial(scores) {
  let max = 0;
  for (let i = 0; i < scores.length; i++) {
    if (scores[i] % 10 === 0 && scores[i] > max) {
      max = scores[i];
    }
  }
  return max;
}],
function sumHeights(heights, start, end) {
  let sum = 0;
  for (let i = start; i < end; i++) {
    sum += Math.abs(heights[i + 1] - heights[i]);
  }
  return sum;
},
function sumHeights2(heights, start, end) {
  let sum = 0;
  for (let i = start; i < end; i++) {
    const change = heights[i + 1] - heights[i];
    sum += change > 0 ? change * 2 : -change;
  }
  return sum;
},
function bigHeights(heights, start, end) {
  let count = 0;
  for (let i = start; i < end; i++) {
    if (Math.abs(heights[i + 1] - heights[i]) >= 5) {
      count++;
    }
  }
  return count;
},
function userCompare(aName, aId, bName, bId) {
  if (aName < bName) {
    return -1;
  }
  if (aName > bName) {
    return 1;
  }
  if (aId < bId) {
    return -1;
  }
  if (aId > bId) {
    return 1;
  }
  return 0;
},
function mergeTwo(a, b, n) {
  const result = [];
  let i = 0;
  let j = 0;
  while (result.length < n) {
    if (a[i] < b[j]) {
      result.push(a[i]);
      i++;
    } else if (b[j] < a[i]) {
      result.push(b[j]);
      j++;
    } else {
      result.push(a[i]);
      i++;
      j++;
    }
  }
  return result;
},
function commonTwo(a, b) {
  let count = 0;
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      count++;
      const word = a[i];
      while (i < a.length && a[i] === word) {
        i++;
      }
      while (j < b.length && b[j] === word) {
        j++;
      }
    } else if (a[i] < b[j]) {
      i++;
    } else {
      j++;
    }
  }
  return count;
},
],

'Recursion-1': [
function factorial(n) {
  if (n <= 1) {
    return 1;
  }
  return n * factorial(n - 1);
},
function bunnyEars(bunnies) {
  if (bunnies === 0) {
    return 0;
  }
  return 2 + bunnyEars(bunnies - 1);
},
function fibonacci(n) {
  if (n < 2) {
    return n;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
},
function bunnyEars2(bunnies) {
  if (bunnies === 0) {
    return 0;
  }
  const ears = bunnies % 2 === 0 ? 3 : 2;
  return ears + bunnyEars2(bunnies - 1);
},
function triangle(rows) {
  if (rows === 0) {
    return 0;
  }
  return rows + triangle(rows - 1);
},
function sumDigits(n) {
  if (n < 10) {
    return n;
  }
  return (n % 10) + sumDigits(Math.floor(n / 10));
},
function count7(n) {
  if (n === 0) {
    return 0;
  }
  const here = n % 10 === 7 ? 1 : 0;
  return here + count7(Math.floor(n / 10));
},
function count8(n) {
  if (n === 0) {
    return 0;
  }
  const rest = Math.floor(n / 10);
  if (n % 10 === 8) {
    const points = rest % 10 === 8 ? 2 : 1;
    return points + count8(rest);
  }
  return count8(rest);
},
function powerN(base, n) {
  if (n === 1) {
    return base;
  }
  return base * powerN(base, n - 1);
},
function countX(str) {
  if (str.length === 0) {
    return 0;
  }
  const here = str.charAt(0) === 'x' ? 1 : 0;
  return here + countX(str.substring(1));
},
function countHi(str) {
  if (str.length < 2) {
    return 0;
  }
  if (str.startsWith('hi')) {
    return 1 + countHi(str.substring(2));
  }
  return countHi(str.substring(1));
},
function changeXY(str) {
  if (str.length === 0) {
    return '';
  }
  const first = str.charAt(0) === 'x' ? 'y' : str.charAt(0);
  return first + changeXY(str.substring(1));
},
function changePi(str) {
  if (str.length < 2) {
    return str;
  }
  if (str.startsWith('pi')) {
    return '3.14' + changePi(str.substring(2));
  }
  return str.charAt(0) + changePi(str.substring(1));
},
function noX(str) {
  if (str.length === 0) {
    return '';
  }
  const first = str.charAt(0) === 'x' ? '' : str.charAt(0);
  return first + noX(str.substring(1));
},
function array6(nums, index) {
  if (index >= nums.length) {
    return false;
  }
  return nums[index] === 6 || array6(nums, index + 1);
},
function array11(nums, index) {
  if (index >= nums.length) {
    return 0;
  }
  const here = nums[index] === 11 ? 1 : 0;
  return here + array11(nums, index + 1);
},
function array220(nums, index) {
  if (index >= nums.length - 1) {
    return false;
  }
  return nums[index] * 10 === nums[index + 1] || array220(nums, index + 1);
},
function allStar(str) {
  if (str.length <= 1) {
    return str;
  }
  return str.charAt(0) + '*' + allStar(str.substring(1));
},
function pairStar(str) {
  if (str.length < 2) {
    return str;
  }
  if (str.charAt(0) === str.charAt(1)) {
    return str.charAt(0) + '*' + pairStar(str.substring(1));
  }
  return str.charAt(0) + pairStar(str.substring(1));
},
function endX(str) {
  if (str.length === 0) {
    return '';
  }
  if (str.charAt(0) === 'x') {
    return endX(str.substring(1)) + 'x';
  }
  return str.charAt(0) + endX(str.substring(1));
},
function countPairs(str) {
  if (str.length < 3) {
    return 0;
  }
  const here = str.charAt(0) === str.charAt(2) ? 1 : 0;
  return here + countPairs(str.substring(1));
},
function countAbc(str) {
  if (str.length < 3) {
    return 0;
  }
  const three = str.substring(0, 3);
  const here = three === 'abc' || three === 'aba' ? 1 : 0;
  return here + countAbc(str.substring(1));
},
function count11(str) {
  if (str.length < 2) {
    return 0;
  }
  if (str.startsWith('11')) {
    return 1 + count11(str.substring(2));
  }
  return count11(str.substring(1));
},
function stringClean(str) {
  if (str.length < 2) {
    return str;
  }
  if (str.charAt(0) === str.charAt(1)) {
    return stringClean(str.substring(1));
  }
  return str.charAt(0) + stringClean(str.substring(1));
},
function countHi2(str) {
  if (str.length < 2) {
    return 0;
  }
  if (str.startsWith('xhi')) {
    return countHi2(str.substring(3));
  }
  if (str.startsWith('hi')) {
    return 1 + countHi2(str.substring(2));
  }
  return countHi2(str.substring(1));
},
function parenBit(str) {
  if (str.charAt(0) !== '(') {
    return parenBit(str.substring(1));
  }
  if (str.charAt(str.length - 1) !== ')') {
    return parenBit(str.substring(0, str.length - 1));
  }
  return str;
},
function nestParen(str) {
  if (str.length === 0) {
    return true;
  }
  if (str.charAt(0) === '(' && str.charAt(str.length - 1) === ')') {
    return nestParen(str.substring(1, str.length - 1));
  }
  return false;
},
function strCount(str, sub) {
  if (str.length < sub.length) {
    return 0;
  }
  if (str.startsWith(sub)) {
    return 1 + strCount(str.substring(sub.length), sub);
  }
  return strCount(str.substring(1), sub);
},
function strCopies(str, sub, n) {
  if (n === 0) {
    return true;
  }
  if (str.length < sub.length) {
    return false;
  }
  if (str.startsWith(sub)) {
    return strCopies(str.substring(1), sub, n - 1);
  }
  return strCopies(str.substring(1), sub, n);
},
function strDist(str, sub) {
  if (str.length < sub.length) {
    return 0;
  }
  if (!str.startsWith(sub)) {
    return strDist(str.substring(1), sub);
  }
  if (!str.endsWith(sub)) {
    return strDist(str.substring(0, str.length - 1), sub);
  }
  return str.length;
},
],

'Recursion-2': [
function groupSum(start, nums, target) {
  if (start >= nums.length) {
    return target === 0;
  }
  if (groupSum(start + 1, nums, target - nums[start])) {
    return true;
  }
  return groupSum(start + 1, nums, target);
},
function groupSum6(start, nums, target) {
  if (start >= nums.length) {
    return target === 0;
  }
  if (nums[start] === 6) {
    return groupSum6(start + 1, nums, target - 6);
  }
  return groupSum6(start + 1, nums, target - nums[start]) ||
    groupSum6(start + 1, nums, target);
},
function groupNoAdj(start, nums, target) {
  if (start >= nums.length) {
    return target === 0;
  }
  return groupNoAdj(start + 2, nums, target - nums[start]) ||
    groupNoAdj(start + 1, nums, target);
},
function groupSum5(start, nums, target) {
  if (start >= nums.length) {
    return target === 0;
  }
  if (nums[start] % 5 === 0) {
    if (start + 1 < nums.length && nums[start + 1] === 1) {
      return groupSum5(start + 2, nums, target - nums[start]);
    }
    return groupSum5(start + 1, nums, target - nums[start]);
  }
  return groupSum5(start + 1, nums, target - nums[start]) ||
    groupSum5(start + 1, nums, target);
},
function groupSumClump(start, nums, target) {
  if (start >= nums.length) {
    return target === 0;
  }
  let end = start;
  while (end < nums.length && nums[end] === nums[start]) {
    end++;
  }
  const clumpSum = nums[start] * (end - start);
  return groupSumClump(end, nums, target - clumpSum) ||
    groupSumClump(end, nums, target);
},
[function splitArray(nums) {
  return splitHelper(0, nums, 0, 0);
},
function splitHelper(index, nums, sum1, sum2) {
  if (index >= nums.length) {
    return sum1 === sum2;
  }
  const value = nums[index];
  return splitHelper(index + 1, nums, sum1 + value, sum2) ||
    splitHelper(index + 1, nums, sum1, sum2 + value);
}],
[function splitOdd10(nums) {
  return splitOdd10Helper(0, nums, 0, 0);
},
function splitOdd10Helper(index, nums, sum10, sumOdd) {
  if (index >= nums.length) {
    return sum10 % 10 === 0 && sumOdd % 2 !== 0;
  }
  const value = nums[index];
  return splitOdd10Helper(index + 1, nums, sum10 + value, sumOdd) ||
    splitOdd10Helper(index + 1, nums, sum10, sumOdd + value);
}],
[function split53(nums) {
  return split53Helper(0, nums, 0, 0);
},
function split53Helper(index, nums, sum5, sum3) {
  if (index >= nums.length) {
    return sum5 === sum3;
  }
  const value = nums[index];
  if (value % 5 === 0) {
    return split53Helper(index + 1, nums, sum5 + value, sum3);
  }
  if (value % 3 === 0) {
    return split53Helper(index + 1, nums, sum5, sum3 + value);
  }
  return split53Helper(index + 1, nums, sum5 + value, sum3) ||
    split53Helper(index + 1, nums, sum5, sum3 + value);
}],
],

'Map-1': [
function mapBully(map) {
  if ('a' in map) {
    map.b = map.a;
    map.a = '';
  }
  return map;
},
function mapShare(map) {
  if ('a' in map) {
    map.b = map.a;
  }
  delete map.c;
  return map;
},
function mapAB(map) {
  if ('a' in map && 'b' in map) {
    map.ab = map.a + map.b;
  }
  return map;
},
function topping1(map) {
  if ('ice cream' in map) {
    map['ice cream'] = 'cherry';
  }
  map.bread = 'butter';
  return map;
},
function topping2(map) {
  if ('ice cream' in map) {
    map.yogurt = map['ice cream'];
  }
  if ('spinach' in map) {
    map.spinach = 'nuts';
  }
  return map;
},
function topping3(map) {
  if ('potato' in map) {
    map.fries = map.potato;
  }
  if ('salad' in map) {
    map.spinach = map.salad;
  }
  return map;
},
function mapAB2(map) {
  if ('a' in map && 'b' in map && map.a === map.b) {
    delete map.a;
    delete map.b;
  }
  return map;
},
function mapAB3(map) {
  const hasA = 'a' in map;
  const hasB = 'b' in map;
  if (hasA && !hasB) {
    map.b = map.a;
  } else if (hasB && !hasA) {
    map.a = map.b;
  }
  return map;
},
function mapAB4(map) {
  if ('a' in map && 'b' in map) {
    const a = map.a;
    const b = map.b;
    if (a.length > b.length) {
      map.c = a;
    } else if (b.length > a.length) {
      map.c = b;
    } else {
      map.a = '';
      map.b = '';
    }
  }
  return map;
},
],

'Map-2': [
function word0(strings) {
  const map = {};
  for (const s of strings) {
    map[s] = 0;
  }
  return map;
},
function wordLen(strings) {
  const map = {};
  for (const s of strings) {
    map[s] = s.length;
  }
  return map;
},
function pairs(strings) {
  const map = {};
  for (const s of strings) {
    map[s.charAt(0)] = s.charAt(s.length - 1);
  }
  return map;
},
function wordCount(strings) {
  const map = {};
  for (const s of strings) {
    if (s in map) {
      map[s]++;
    } else {
      map[s] = 1;
    }
  }
  return map;
},
function firstChar(strings) {
  const map = {};
  for (const s of strings) {
    const key = s.charAt(0);
    if (key in map) {
      map[key] += s;
    } else {
      map[key] = s;
    }
  }
  return map;
},
function wordAppend(strings) {
  const counts = {};
  let result = '';
  for (const s of strings) {
    counts[s] = (counts[s] || 0) + 1;
    if (counts[s] % 2 === 0) {
      result += s;
    }
  }
  return result;
},
function wordMultiple(strings) {
  const map = {};
  for (const s of strings) {
    map[s] = s in map;
  }
  return map;
},
function allSwap(strings) {
  const waiting = {}; // first char -> index of an unmatched string
  for (let i = 0; i < strings.length; i++) {
    const key = strings[i].charAt(0);
    if (key in waiting) {
      const j = waiting[key];
      const temp = strings[i];
      strings[i] = strings[j];
      strings[j] = temp;
      delete waiting[key];
    } else {
      waiting[key] = i;
    }
  }
  return strings;
},
function firstSwap(strings) {
  const seen = {}; // first char -> index, or -1 once that char has swapped
  for (let i = 0; i < strings.length; i++) {
    const key = strings[i].charAt(0);
    if (!(key in seen)) {
      seen[key] = i;
    } else if (seen[key] !== -1) {
      const j = seen[key];
      const temp = strings[i];
      strings[i] = strings[j];
      strings[j] = temp;
      seen[key] = -1;
    }
  }
  return strings;
},
],

'Functional-1': [
function doubling(nums) {
  return nums.map((n) => n * 2);
},
function square(nums) {
  return nums.map((n) => n * n);
},
function addStar(strings) {
  return strings.map((s) => s + '*');
},
function copies3(strings) {
  return strings.map((s) => s + s + s);
},
function moreY(strings) {
  return strings.map((s) => 'y' + s + 'y');
},
function math1(nums) {
  return nums.map((n) => (n + 1) * 10);
},
function rightDigit(nums) {
  return nums.map((n) => n % 10);
},
function lower(strings) {
  return strings.map((s) => s.toLowerCase());
},
function noX(strings) {
  return strings.map((s) => s.replaceAll('x', ''));
},
],

'Functional-2': [
function noNeg(nums) {
  return nums.filter((n) => n >= 0);
},
function no9(nums) {
  return nums.filter((n) => n % 10 !== 9);
},
function noTeen(nums) {
  return nums.filter((n) => n < 13 || n > 19);
},
function noZ(strings) {
  return strings.filter((s) => !s.includes('z'));
},
function noLong(strings) {
  return strings.filter((s) => s.length < 4);
},
function no34(strings) {
  return strings.filter((s) => s.length !== 3 && s.length !== 4);
},
function noYY(strings) {
  return strings.map((s) => s + 'y').filter((s) => !s.includes('yy'));
},
function two2(nums) {
  return nums.map((n) => n * 2).filter((n) => n % 10 !== 2);
},
function square56(nums) {
  return nums.map((n) => n * n + 10).filter((n) => n % 10 !== 5 && n % 10 !== 6);
},
],
};
