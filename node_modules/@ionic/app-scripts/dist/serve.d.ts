import { BuildContext } from './util/interfaces';
import { ServeConfig } from './dev-server/serve-config';
export declare function serve(context: BuildContext): Promise<ServeConfig>;
export declare function getNotificationPort(context: BuildContext): number;
