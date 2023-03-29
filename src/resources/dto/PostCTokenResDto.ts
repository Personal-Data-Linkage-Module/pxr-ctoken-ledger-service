/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
/* eslint-enable */
import Config from '../../common/Config';
import moment = require('moment-timezone');
const config = Config.ReadConfig('./config/config.json');

export default class PostCTokenResDto {
    /** 件数オブジェクト */
    public dataList: {}[] = [];

    /** isDocument */
    public isDocument: boolean = false;

    /** isEvent */
    public isEvent: boolean = false;

    /** isThing */
    public isThing: boolean = false;

    /**
     * レスポンス用のオブジェクトに変換する
     */
    public toJSON () {
        const resDataList: {}[] = [];
        const wf: any = undefined;
        for (const data of this.dataList) {
            const resData = {
                actor: {
                    _value: Number(data['actorCode']),
                    _ver: Number(data['actorVer'])
                },
                app: data['appCode'] ? {
                    _value: Number(data['appCode']),
                    _ver: Number(data['appVer'])
                } : undefined,
                wf: wf,
                createdAt: data['createdAt'] ? moment(data['createdAt']).tz(config['timezone']).format('YYYY-MM-DDTHH:mm:ss.SSSZZ') : null,
                code: {
                    _value: Number(data['code']),
                    _ver: Number(data['version'])
                },
                identifier: data['identifier']
            };
            resDataList.push(resData);
        }

        const res = {
            document: this.isDocument ? resDataList : undefined,
            event: this.isEvent ? resDataList : undefined,
            thing: this.isThing ? resDataList : undefined
        };
        return res;
    }
}
