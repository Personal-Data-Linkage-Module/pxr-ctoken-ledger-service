/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import Operator from '../../domains/OperatorDomain';
/* eslint-enable */

export default class SearchDto {
    /**
     * オペレータ情報
     */
    private operator: Operator = null;

    /**
     * リクエスト情報
     */
    private request: any = null;

    /**
     * オペレータ情報取得
     */
    public getOperator (): Operator {
        return this.operator;
    }

    /**
     * オペレータ情報設定
     * @param operator
     */
    public setOperator (operator: Operator) {
        this.operator = operator;
    }

    /**
     * リクエスト情報取得
     */
    public getRequest<T> (): T {
        return this.request;
    }

    /**
     * リクエスト情報設定
     * @param request
     */
    public setRequest<T> (request: T) {
        this.request = request;
    }
}
