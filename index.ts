import parse from './parser';
import tokenize from './tokenizer';

console.log(JSON.stringify(parse(tokenize('/marti/*/karti'))));