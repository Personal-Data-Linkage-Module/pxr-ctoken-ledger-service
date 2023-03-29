/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import OperatorDomain from 'domains/OperatorDomain';
/* eslint-enable */

/**
 * カタログサービスデータ
 */
export default class CatalogDto {
    /** コードによる取得 */
    static readonly GET_FOR_CODE = 0;

    /** ネームスペースによる取得 */
    static readonly GET_FOR_NS = 1;

    /**
     * 取得方法
     */
    private procNum: Number = 0;

    /**
     * オペレータ情報
     */
    private operator: OperatorDomain = null;

    /**
     * カタログネームスペース
     */
    private ns: string = null;

    /**
     * カタログコード
     */
    private code: number = null;

    /**
     * カタログバージョン
     */
    private version: number = null;

    /**
     * 取得方法取得
     */
    public getProcNum (): Number {
        return this.procNum;
    }

    /**
     * 取得方法設定
     */
    public setProcNum (procNum: Number): void {
        this.procNum = procNum;
    }

    /**
     * オペレータ情報取得
     */
    public getOperator (): OperatorDomain {
        return this.operator;
    }

    /**
     * オペレータ情報設定
     * @param operator
     */
    public setOperator (operator: OperatorDomain) {
        this.operator = operator;
    }

    /**
     * ネームスペース取得
     */
    public getNs (): string {
        return this.ns;
    }

    /**
     * ネームスペース設定
     * @param ns
     */
    public setNs (ns: string) {
        this.ns = ns;
    }

    /**
     * コード取得
     */
    public getCode (): number {
        return this.code;
    }

    /**
     * コード設定
     * @param code
     */
    public setCode (code: number) {
        this.code = code;
    }

    /**
     * カタログバージョン取得
     */
    public getVersion (): number {
        return this.version;
    }

    /**
     * カタログバージョン設定
     * @param version
     */
    public setVersion (version: number) {
        this.version = version;
    }
}
