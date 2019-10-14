import test from 'ava';
import * as fs from 'fs';
import { join } from 'path';
import { expectType,  } from 'tsd';
import { Observable } from 'rxjs';
import { csvToObservable } from '../index';

test('Type should be correct', t => {
	const csvStream = fs.createReadStream(join(__dirname, 'test.csv'));

	t.notThrows(() => {
		expectType<Observable<{name: string}>>(csvToObservable<{name: string}>(csvStream));
		expectType<Observable<{amount: number; addres: {zip: string; street: string}}>>(csvToObservable<{amount: number; addres: {zip: string; street: string}}>(csvStream));
	});
});
