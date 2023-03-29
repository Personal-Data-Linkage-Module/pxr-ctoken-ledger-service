/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
/* eslint-enable */

export default class PostCountResDto {
    /** 件数オブジェクト */
    public ctoken: CToken[] = [];

    /**
     * レスポンス用のオブジェクトに変換する
     */
    public toJSON (): {}[] {
        const res: any[] = [];
        for (let index = 0; index < this.ctoken.length; index++) {
            const app = this.ctoken[index].app ? { _value: Number(this.ctoken[index].app._value) } : null;
            const wf: any = null;
            const document: any[] = [];
            for (let docIndex = 0; docIndex < this.ctoken[index].document.length; docIndex++) {
                const docEle = {
                    _code: {
                        _value: Number(this.ctoken[index].document[docIndex]._code._value),
                        _ver: Number(this.ctoken[index].document[docIndex]._code._ver)
                    },
                    count: this.ctoken[index].document[docIndex].count
                };
                document.push(docEle);
            }
            const event: any[] = [];
            for (let eventIndex = 0; eventIndex < this.ctoken[index].event.length; eventIndex++) {
                const eventEle = {
                    _code: {
                        _value: Number(this.ctoken[index].event[eventIndex]._code._value),
                        _ver: Number(this.ctoken[index].event[eventIndex]._code._ver)
                    },
                    count: this.ctoken[index].event[eventIndex].count
                };
                event.push(eventEle);
            }
            const thing: any[] = [];
            for (let thingIndex = 0; thingIndex < this.ctoken[index].thing.length; thingIndex++) {
                const thingEle = {
                    _code: {
                        _value: Number(this.ctoken[index].thing[thingIndex]._code._value),
                        _ver: Number(this.ctoken[index].thing[thingIndex]._code._ver)
                    },
                    count: this.ctoken[index].thing[thingIndex].count
                };
                thing.push(thingEle);
            }
            const ele = {
                actor: {
                    _value: Number(this.ctoken[index].actor._value)
                },
                app: app,
                wf: wf,
                document: document,
                event: event,
                thing: thing
            };
            res.push(ele);
        }

        return res;
    }
}

export class CToken {
    /** アクターカタログコード */
    public actor: CatalogCodeValue;

    /** アプリケーションカタログコード */
    public app?: CatalogCodeValue;

    /** ワークフローカタログコード */
    public wf?: CatalogCodeValue;

    /** ドキュメント件数 */
    public document: DocEventThingCount[] = [];

    /** イベント件数 */
    public event: DocEventThingCount[] = [];

    /** モノ件数 */
    public thing: DocEventThingCount[] = [];
}

export class DocEventThingCount {
    /** イベント・モノカタログコード */
    public _code: CatalogCodeValueVer;

    /** 件数 */
    public count: number
}

export class CatalogCodeValue {
    /** カタログコード */
    public _value: number;
}

export class CatalogCodeValueVer {
    /** カタログコード */
    public _value: number;

    /** カタログバージョン */
    public _ver: number;
}
