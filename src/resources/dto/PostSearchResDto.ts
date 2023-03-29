/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/**
 * POST: PXR-ID検索APIのレスポンスDto
 */
export default class PostSearchResDto {
    /**
     * データカウント
     */
    counts: Count[] = [];

    /**
     * レスポンス用のオブジェクトに変換する
     */
    public getAsJson (): {} {
        const res: any[] = [];
        for (const count of this.counts) {
            const ctokens: any[] = [];
            for (const targetCtoken of count.ctokens) {
                const data: any[] = [];
                for (const targetData of targetCtoken.data) {
                    const dataEle = {
                        _code: {
                            _value: targetData._code._value,
                            _ver: targetData._code._ver
                        },
                        count: targetData.count
                    };
                    data.push(dataEle);
                }
                const ctokenEle = {
                    actor: targetCtoken.actor,
                    data: data
                };
                ctokens.push(ctokenEle);
            }
            const ele = {
                pxrId: count.pxrId,
                ctokens: ctokens
            };
            res.push(ele);
        }
        return res;
    }
}

export class Count {
    /** PXR-ID */
    public pxrId: string = '';

    /** アクターカタログコード */
    public ctokens: CToken[] = [];
}

export class CatalogCodeValue {
    /** カタログコード */
    public _value: number = 0;
}

export class CatalogCodeValueVer {
    /** カタログコード */
    public _value: number = 0;

    /** カタログバージョン */
    public _ver: number = 0;
}

export class CToken {
    /** アクターカタログコード */
    public actor: CatalogCodeValue = new CatalogCodeValue();

    /** ドキュメント件数 */
    public data: DataCount[] = [];
}

export class DataCount {
    /** イベント・モノカタログコード */
    public _code: CatalogCodeValueVer = new CatalogCodeValueVer();

    /** 件数 */
    public count: number = 0;
}
