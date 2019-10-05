import { ReadStream } from 'fs';
import { Observable } from 'rxjs';
import * as stripBOM from 'strip-bom-stream';
import * as csvParser from 'csv-parser';
import { JsonObject } from 'type-fest';

/**
 * Create an observable stream from the stream events.
 *
 * @param stream - Stream to create the events from.
 */
function csvStreamToObservable(stream: ReadStream): Observable<JsonObject> {
	return new Observable((observer): (() => void) => {
		stream
			.on('data', (chunk: JsonObject) => {
				observer.next(chunk);
			})
			.on('error', (err: Error) => {
				observer.error(err);
			})
			.on('end', () => {
				observer.complete();
			});

		return () => {
			stream.destroy();
		};
	});
}

/**
 * Converts the CSV stream to an observable that will emit every row
 *
 * @param stream - CSV read stream.
 * @param options - Configuration options for the stream.
 */
export function csvToObservable(stream: ReadStream, opts: csvParser.Options): Observable<JsonObject> {
	return csvStreamToObservable(stream.pipe(stripBOM()).pipe(csvParser({ ...opts }) as any));
}
