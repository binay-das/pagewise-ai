import { Readable } from 'stream';

export type S3BodyStream = Readable | ReadableStream | Blob | AsyncIterable<Uint8Array>;
