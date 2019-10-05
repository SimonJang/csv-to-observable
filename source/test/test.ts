import { join } from 'path';
import * as fs from 'fs';
import test from 'ava';
import { tap, bufferCount } from 'rxjs/operators';
import { csvToObservable } from '../index';

const data = [
	{
		firstName: 'Bob',
		name: 'Smith',
		country: 'United States',
		age: '24',
	},
	{
		firstName: 'Alice',
		name: 'Williams',
		country: 'Canada',
		age: '23',
	},
	{
		firstName: 'Malcolm',
		name: 'Jone',
		country: '',
		age: '22',
	},
];

test('should create an observable stream ', async t => {
	const csvStream = fs.createReadStream(join(__dirname, 'test.csv'));

	let counter = 0;

	const result = await csvToObservable(csvStream, { separator: ';' })
		.pipe(
			tap(record => {
				t.is(record.firstName, data[counter].firstName);
				t.is(record.name, data[counter].name);
				t.is(record.country, data[counter].country);
				t.is(record.age, data[counter].age);

				counter++;
			}),
			bufferCount(3),
		)
		.toPromise();

	t.deepEqual(
		JSON.stringify(result),
		JSON.stringify([
			{
				firstName: 'Bob',
				name: 'Smith',
				country: 'United States',
				age: '24',
			},
			{
				firstName: 'Alice',
				name: 'Williams',
				country: 'Canada',
				age: '23',
			},
			{
				firstName: 'Malcolm',
				name: 'Jone',
				country: '',
				age: '22',
			},
		]),
	);
});

test('should fail when trying to create a CSV stream in strict mode', async t => {
	const csvStream = fs.createReadStream(join(__dirname, 'bad-csv.csv'));

	await t.throwsAsync(csvToObservable(csvStream, { strict: true, separator: ';' }).toPromise());
});
