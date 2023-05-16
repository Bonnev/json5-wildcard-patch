import parse, { Location, Navigation } from './parser';
import tokenize from './tokenizer';

const tokens = tokenize('/marti/*/karti');
const navigations = parse(tokens);

const initialLocations = [new Location({
	root: {
		marti: {
			name: {
				karti: 3
			},
			age: {
				karti: 5
			},
			koala: {
				karti: 10
			}
		},
		test: 'mest'
	}
}, 'root')];

const locations = navigations.reduce((accLocations, current) => current.navigate(accLocations), initialLocations);

/*let locations = navigations[0].navigate();

locations = navigations[1].navigate(locations);
locations = navigations[2].navigate(locations);*/

console.log(JSON.stringify(locations, null, 2));