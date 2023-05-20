import { readLine } from './input';
import parse, { ArrayOrObject, Location } from './parser';
import { AddPatcher } from './patcher';
import tokenize from './tokenizer';

if (process.argv.length < 4) {
	console.error('Usage: index.js //some/*/query {patching:3}');
	process.exit(1);
}

const query = process.argv[2];
const patchValueString = process.argv[3];

readLine((line) => {
	const tokens = tokenize(query);
	const navigations = parse(tokens);

	// const dataString = '{"marti":{"name":{"karti":[{},{}]},"age":{"karti":[{},{}]},"koala":{"karti":[{},{}]}},"test":"mest"}';
	// const data: ArrayOrObject = JSON.parse(dataString);

	const data: ArrayOrObject = JSON.parse(line);

	const initialLocations = [new Location({ root: data }, 'root')];

	const locations = navigations.reduce((accLocations, current) => current.navigate(accLocations), initialLocations);

	const patchValue = JSON.parse(patchValueString);

	new AddPatcher(patchValue).patch(locations);

	console.log(JSON.stringify(data));
})