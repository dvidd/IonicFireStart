import * as express from 'express';
import { ServeConfig } from './serve-config';
/**
 * Create HTTP server
 */
export declare function createHttpServer(config: ServeConfig): express.Application;
