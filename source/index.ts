import { ReadStream } from 'fs';
import { Observable } from 'rxjs';
import * as stripBOM from 'strip-bom-stream';
import * as csvParser from 'csv-parser';
/**
 * Create an observable stream from the stream events.
 *
 * @param stream - Stream to create the events from.
 */
const csvStreamToObservable = <T = any>(stream: ReadStream): Observable<T> => {
	return new Observable((observer): (() => void) => {
		stream
			.on('data', (chunk: T) => {
				observer.next(chunk);
			})
			.on('error', (err: Error) => {
				observer.error(err);
			})
			.on('end', () => {
				observer.complete();
			});

		// tslint:disable-next-line:typedef
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
export const csvToObservable = <T = any>(stream: ReadStream, opts: csvParser.Options = {}): Observable<T> => {
	return csvStreamToObservable<T>(stream.pipe(stripBOM()).pipe(csvParser({ ...opts }) as any));
}
