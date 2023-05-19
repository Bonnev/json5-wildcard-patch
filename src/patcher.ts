import { Location as MyLocation, ArrayOrObject, getArrayOrObject, setArrayOrObject } from './parser';

export interface Patcher {
	patch(locations: MyLocation[]): boolean;
}

export class AddPatcher implements Patcher {
	constructor(private obj: {[key: string]: unknown}) {}

	patch(locations: MyLocation[]): boolean {
		const hadChangesObj = { hasChanges: false };

		locations.forEach(location => {
			if (location.data instanceof Object && !(location.data instanceof Array) && typeof location.data[location.key] !== 'undefined' ||
					location.data instanceof Array && typeof location.key === 'number' && typeof location.data[location.key] !== 'undefined') {
				const data = getArrayOrObject(location.data, location.key);
				if (data instanceof Object) {
					for (const key in this.obj) {
						setArrayOrObject(data, key, this.obj[key] as ArrayOrObject);
						hadChangesObj.hasChanges = true;
					}
				}
			}
		});

		return hadChangesObj.hasChanges;
	}
}