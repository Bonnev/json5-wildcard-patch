import { Location as MyLocation, ArrayOrObject } from './parser';

export interface Patcher {
	patch(locations: MyLocation[]): boolean;
}

export class AddPatcher implements Patcher {
	constructor(private obj: {[key: string]: unknown}) {}

	patch(locations: MyLocation[]): boolean {
		const hadChangesObj = { hasChanges: false };

		locations.forEach(location => {
			if (location.data instanceof Array && typeof location.key === 'number' && typeof location.data[location.key] !== 'undefined') {
				const data = location.data[location.key];
				if (data instanceof Object) {
					for (const key in this.obj) {
						data[key] = this.obj[key];
						hadChangesObj.hasChanges = true;
					}
				}
			}
			if (location.data instanceof Object && typeof location.data[location.key] !== 'undefined') {
				const data = location.data[location.key];
				if (data instanceof Object) {
					for (const key in this.obj) {
						data[key] = this.obj[key] as ArrayOrObject;
						hadChangesObj.hasChanges = true;
					}
				}
			}
		});

		return hadChangesObj.hasChanges;
	}
}