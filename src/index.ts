import parse, { Location } from './parser';
import { AddPatcher } from './patcher';
import tokenize from './tokenizer';

const tokens = tokenize('/marti/*/karti/*');
const navigations = parse(tokens);

const data = {
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

const initialLocations = [new Location({ root: data }, 'root')];

const locations = navigations.reduce((accLocations, current) => current.navigate(accLocations), initialLocations);



new AddPatcher({ test: 3 }).patch(locations);

console.log(JSON.stringify(data, null, 2));