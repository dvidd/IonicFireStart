import MonitoringCapture from './capture';
import { MonitoringExtra, MonitoringLogOptions, MonitoringStackTrace } from '../../definitions';
export default class MonitoringLog extends MonitoringCapture {
    constructor(msg: string, options: MonitoringLogOptions, error: MonitoringStackTrace, extra?: MonitoringExtra);
}
