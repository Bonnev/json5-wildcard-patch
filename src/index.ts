import { readLine } from './input';
import parse, { ArrayOrObject, Location } from './parser';
import { AddPatcher } from './patcher';
import tokenize from './tokenizer';

if (process.argv.length < 4) {
	console.error('Usage: index.js \\/some/*/query {patching:3}');
	process.exit(1);
}

const query = process.argv[2];
console.log(query)
const patchValue = process.argv[3];

readLine((line) => {
	console.log(line);
	const tokens = tokenize(query);
	const navigations = parse(tokens);

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

	const initialLocations = [new Location({ root: data }, 'root')];

	const locations = navigations.reduce((accLocations, current) => current.navigate(accLocations), initialLocations);

	new AddPatcher({ test: 3 }).patch(locations);

	console.log(JSON.stringify(data, null, 2));
})