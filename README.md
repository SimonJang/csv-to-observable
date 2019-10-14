# csv-to-observable [![Build Status](https://travis-ci.org/SimonJang/csv-to-observable.svg?branch=master)](https://travis-ci.org/SimonJang/csv-to-observable)

Transform a CSV stream to an [RxJS](https://www.npmjs.com/package/rxjs) observable stream. Wrapper around [csv-parser](https://www.npmjs.com/package/csv-parser)

## Requirements

 - [RxJS](https://www.npmjs.com/package/rxjs)
 - Node 8+

## Install

```
$ npm install csv-to-observable
```

## Usage

```js
import * as fs from 'fs';
import csvToObservable from 'csv-to-observable';
import {tap} from 'rxjs/operators'

const stream = fs.createReadStream(join(__dirname, 'test.csv'));

// Seperator defaults to `,` if not provided
csvToObservable(csvStream, { separator: ';' })
	.pipe(
		tap(item => console.log(item)) // JSON object
	)
	.subscribe()

```

## API

### csvToObservable(stream, options)

#### stream

Type: `ReadableStream`

Stream of CSV records. Could be from a file or generated yourself.

#### options

Type: `Object`

Same configuration options as defined in [csv-parser](https://www.npmjs.com/package/csv-parser)
