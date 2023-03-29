/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import OperatorDomain from '../../domains/OperatorDomain';
/* eslint-enable */

/**
 * My-Condition-Book管理サービスデータ
 */
export default class BookManageDto {
    /**
     * オペレータ情報
     */
    private operator: OperatorDomain = null;

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
     * My-Condition-Book管理サービスURL
     */
    private url: string = null;

    /**
     * My-Condition-Book管理サービスURL取得
     */
    public getUrl (): string {
        return this.url;
    }

    /**
     * My-Condition-Book管理サービスURL設定
     * @param url
     */
    public setUrl (url: string) {
        this.url = url;
    }

    /**
     * identifyCode
     */
    private identifyCode: string = null;

    /**
     * identifyCode取得
     */
    public getIdentifyCode (): string {
        return this.identifyCode;
    }

    /**
     * identifyCode設定
     */
    public setIdentifyCode (identifyCode: string) {
        this.identifyCode = identifyCode;
    }

    /**
     * message
     */
    private message: any = null;

    /**
     * message
     */
    public getMessage (): any {
        return this.message;
    }

    /**
     * message
     * @param message
     */
    public setMessage (message: any) {
        this.message = message;
    }

    /**
     * userId
     */
    private userId: string = null;

    /**
     * userId取得
     */
    public getUserId (): string {
        return this.userId;
    }

    /**
     * userId設定
     */
    public setUserId (userId: string) {
        this.userId = userId;
    }

    /**
     * appCode
     */
    private appCode: number = null;

    /**
     * appCode取得
     */
    public getAppCode (): number {
        return this.appCode;
    }

    /**
     * appCode設定
     */
    public setAppCode (appCode: number) {
        this.appCode = appCode;
    }

    /**
     * appVersion
     */
    private appVersion: number = null;

    /**
     * appVersion取得
     */
    public getAppVersion (): number {
        return this.appVersion;
    }

    /**
     * appVersion設定
     */
    public setAppVersion (appVersion: number) {
        this.appVersion = appVersion;
    }

    /**
     * wfCode
     */
    private wfCode: number = null;

    /**
     * wfCode取得
     */
    public getWfCode (): number {
        return this.wfCode;
    }

    /**
     * wfCode設定
     */
    public setWfCode (wfCode: number) {
        this.wfCode = wfCode;
    }

    /**
     * wfVersion
     */
    private wfVersion: number = null;

    /**
     * wfVersion取得
     */
    public getWfVersion (): number {
        return this.wfVersion;
    }

    /**
     * wfVersion設定
     */
    public setWfVersion (wfVersion: number) {
        this.wfVersion = wfVersion;
    }
}
