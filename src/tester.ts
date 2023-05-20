// this file is for debugging

import parse, { ArrayOrObject, Location } from './parser';
import { AddPatcher } from './patcher';
import tokenize from './tokenizer';

const query = '/marti/*/karti/*';
const patchValue = { patch: 3 };
const data: ArrayOrObject = {
	marti: {
		name: {
			karti: [
				{ },
				{ }
			]
		},
		age: {
			karti: [
				{ },
				{ }
			]
		},
		koala: {
			karti: [
				{ },
				{ }
			]
		}
	},
	test: 'mest'
};

const tokens = tokenize(query);
const navigations = parse(tokens);

const initialLocations = [new Location({ root: data }, 'root')];

const locations = navigations.reduce((accLocations, current) => current.navigate(accLocations), initialLocations);

new AddPatcher({ test: 3 }).patch(locations);

console.log(JSON.stringify(data, null, 2));