/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import OperatorDomain from '../../domains/OperatorDomain';
import { Code } from '../../resources/dto/PostCountReqDto';
/* eslint-enable */

export default class CountServiceDto {
    /**
     * 検索開始日時
     */
    private startAt: Date = null;

    /**
     * 検索終了日時
     */
    private endAt: Date = null;

    /**
     * pxrId
     */
    private pxrId: string = null;

    /**
     * document
     */
    private document: Code[];

    /**
     * event
     */
    private event: Code[];

    /**
     * thing
     */
    private thing: Code[];

    /**
     * Operator
     */
    private operator: OperatorDomain = null;

    /**
     * 検索開始日時設定
     * @param startAt
     */
    public setStartAt (startAt: Date) {
        this.startAt = startAt;
    }

    /**
     * 検索開始日時取得
     */
    public getStartAt () : Date {
        return this.startAt;
    }

    /**
     * 検索終了日時設定
     * @param code
     */
    public setEndAt (endAt: Date) {
        this.endAt = endAt;
    }

    /**
     * 検索終了日時取得
     */
    public getEndAt () : Date {
        return this.endAt;
    }

    /**
     * pxrId設定
     * @param pxrId
     */
    public setPxrId (pxrId: string) {
        this.pxrId = pxrId;
    }

    /**
     * pxrId取得
     */
    public getPxrId () : string {
        return this.pxrId;
    }

    /**
     * document設定
     * @param document
     */
    public setDocument (document: Code[]) {
        this.document = document;
    }

    /**
     * document取得
     */
    public getDocument () : Code[] {
        return this.document;
    }

    /**
     * event設定
     * @param event
     */
    public setEvent (event: Code[]) {
        this.event = event;
    }

    /**
     * event取得
     */
    public getEvent () : Code[] {
        return this.event;
    }

    /**
     * thing設定
     * @param thing
     */
    public setThing (thing: Code[]) {
        this.thing = thing;
    }

    /**
     * thing取得
     */
    public getThing () : Code[] {
        return this.thing;
    }

    /**
     * OperatorDomain設定
     * @param code
     */
    public setOperator (operator: OperatorDomain) {
        this.operator = operator;
    }

    /**
     * OperatorDomain取得
     */
    public getOperator () : OperatorDomain {
        return this.operator;
    }
}
