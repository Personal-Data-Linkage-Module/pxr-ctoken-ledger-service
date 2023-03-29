/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import ServiceDto from './dto/CountServiceDto';
import OperatorDomain from '../domains/OperatorDomain';
/* eslint-enable */
import { Service } from 'typedi';
import { EntityOperation } from '../repositories/EntityOperation';
import PostCountResDto, { CToken, DocEventThingCount, CatalogCodeValue, CatalogCodeValueVer } from '../resources/dto/PostCountResDto';
import Config from '../common/Config';
import CatalogDto from './dto/CatalogDto';
import CatalogService from './CatalogService';
import AppError from '../common/AppError';
import { ResponseCode } from '../common/ResponseCode';
import { applicationLogger } from '../common/logging';
const message = Config.ReadConfig('./config/message.json');

@Service()
export default class CountService {
    /**
     * CToken件数検索
     * @param operator
     * @param dto
     *
     * RefactorDescription:
     *  #3814 : getCatalogProviderList
     */
    public static async postCount (operator: OperatorDomain, dto: ServiceDto): Promise<PostCountResDto> {
        // 個人（PXR-ID）以外
        let pxrId: string = null;
        let actorCatalogCodes: number[] = [];
        if (operator.type !== OperatorDomain.TYPE_PERSONAL_NUMBER && !dto.getPxrId()) {
            // 指定アクターコードのカタログを取得
            const catalogDto = new CatalogDto();
            catalogDto.setOperator(operator);
            catalogDto.setCode(operator.actorCode);
            const catalogService = new CatalogService();
            const catalogInfo = await catalogService.getCatalogInfo(catalogDto);

            actorCatalogCodes = await this.getCatalogProviderList(catalogInfo, actorCatalogCodes, operator);
        } else {
            pxrId = operator.pxrId;
        }
        const actorCatalogCodesSet = new Set(actorCatalogCodes);
        actorCatalogCodes = Array.from(actorCatalogCodesSet);
        applicationLogger.info(JSON.stringify(actorCatalogCodes));

        // CToken件数を取得
        const documentList = await EntityOperation.getCTokenDocumentCount(pxrId, actorCatalogCodes, dto.getStartAt(), dto.getEndAt(), dto.getDocument(), dto.getEvent(), dto.getThing());
        const eventList = await EntityOperation.getCTokenEventCount(pxrId, actorCatalogCodes, dto.getStartAt(), dto.getEndAt(), dto.getDocument(), dto.getEvent(), dto.getThing());
        const thingList = await EntityOperation.getCTokenThingCount(pxrId, actorCatalogCodes, dto.getStartAt(), dto.getEndAt(), dto.getDocument(), dto.getEvent(), dto.getThing());

        // レスポンスを作成
        const res: PostCountResDto = new PostCountResDto();
        res.ctoken = this.createResponse(documentList, eventList, thingList);
        return res;
    }

    /**
     * 対象カタログからサービスプロバイダーを取得
     * @param catalogInfo
     * @param actorCatalogCodes
     * @param operator
     * @returns
     */
    private static async getCatalogProviderList (catalogInfo: any, actorCatalogCodes: number[], operator: OperatorDomain) {
        // 指定アクターコードのnsを取得
        const ns: string = catalogInfo['catalogItem']['ns'];

        if (ns.indexOf('pxr-root') > 0) {
            // 流通制御: すべてを検索対象とするため処理なし
        } else if (ns.indexOf('region-root') > 0) {
            // 領域運営: 提携アクター
            actorCatalogCodes = await this.makeServiceProviderList(catalogInfo['catalogItem']['_code']['_value'], operator);
        } else if (ns.indexOf('app') > 0) {
            // APP: 自Blockのみ
            actorCatalogCodes.push(operator.actorCode);
        } else {
            // 該当アクターなし: エラー
            throw new AppError(message.NOT_TARGET_ACTOR, ResponseCode.BAD_REQUEST);
        }

        // 流通制御以外でactorCatalogCodesが空の場合、(全件取得できてしまうため)エラー送出
        if (!(ns.indexOf('pxr-root') > 0) && actorCatalogCodes.length === 0) {
            throw new AppError(message.FAILED_MAKE_SERVICE_PROVIDER_LIST, ResponseCode.BAD_REQUEST);
        }
        return actorCatalogCodes;
    }

    /**
     * CToken件数検索のレスポンスオブジェクトを生成
     * @param documentList
     * @param eventList
     * @param thingList
     *
     * RefactorDescription:
     *  #3814 : createDocumentResponse
     *  #3814 : createEventResponse
     *  #3814 : createThingResponse
     */
    private static createResponse (documentList: {}[], eventList: {}[], thingList: {}[]): CToken[] {
        // 各データの存在有無を取得
        const isDocument: boolean = !!(documentList && documentList.length > 0);
        const isEvent: boolean = !!(eventList && eventList.length > 0);
        const isThing: boolean = !!(thingList && thingList.length > 0);

        const response: CToken[] = [];
        if (isDocument) {
            this.createDocumentResponse(documentList, response);
        }
        if (isEvent) {
            this.createEventResponse(eventList, response);
        }
        if (isThing) {
            this.createThingResponse(thingList, response);
        }
        return response;
    }

    /**
     * ドキュメントのレスポンスオブジェクトを生成
     * @param documentList
     * @param response
     * @returns
     */
    private static createDocumentResponse (documentList: {}[], response: CToken[]) {
        for (let index = 0; index < documentList.length; index++) {
            const ctokenIndex: number = response.findIndex((ctoken: CToken) => {
                if (Number(ctoken.actor._value) === Number(documentList[index]['actorCode'])) {
                    if (ctoken.app && Number(ctoken.app._value) === Number(documentList[index]['appCode'])) {
                        return true;
                    }
                }
            });
            let ctokenDocument = null;
            if (ctokenIndex < 0) {
                ctokenDocument = new CToken();
                ctokenDocument.actor = new CatalogCodeValue();
                ctokenDocument.actor._value = documentList[index]['actorCode'];
                if (documentList[index]['appCode']) {
                    ctokenDocument.app = new CatalogCodeValue();
                    ctokenDocument.app._value = Number(documentList[index]['appCode']);
                    ctokenDocument.wf = null;
                } else {
                    throw new AppError(message.IF_WF_HAS_BEEN_SPECIFIED, ResponseCode.BAD_REQUEST);
                }
            } else {
                ctokenDocument = response[ctokenIndex];
            }
            const document: DocEventThingCount = new DocEventThingCount();
            document._code = new CatalogCodeValueVer();
            document._code._value = Number(documentList[index]['code']);
            document._code._ver = Number(documentList[index]['version']);
            document.count = Number(documentList[index]['count']);
            ctokenDocument.document = ctokenDocument.document.concat(document);
            if (ctokenIndex < 0) {
                response.push(ctokenDocument);
            }
        }
    }

    /**
     * イベントのレスポンスオブジェクトを生成
     * @param documentList
     * @param response
     * @returns
     */
    private static createEventResponse (eventList: {}[], response: CToken[]) {
        for (let index = 0; index < eventList.length; index++) {
            const ctokenIndex: number = response.findIndex((ctoken: CToken) => {
                if (Number(ctoken.actor._value) === Number(eventList[index]['actorCode'])) {
                    if (ctoken.app && Number(ctoken.app._value) === Number(eventList[index]['appCode'])) {
                        return true;
                    }
                }
            });
            let ctokenEvent = null;
            if (ctokenIndex < 0) {
                ctokenEvent = new CToken();
                ctokenEvent.actor = new CatalogCodeValue();
                ctokenEvent.actor._value = eventList[index]['actorCode'];
                if (eventList[index]['appCode']) {
                    ctokenEvent.app = new CatalogCodeValue();
                    ctokenEvent.app._value = Number(eventList[index]['appCode']);
                    ctokenEvent.wf = null;
                } else {
                    throw new AppError(message.IF_WF_HAS_BEEN_SPECIFIED, ResponseCode.BAD_REQUEST);
                }
            } else {
                ctokenEvent = response[ctokenIndex];
            }
            const event: DocEventThingCount = new DocEventThingCount();
            event._code = new CatalogCodeValueVer();
            event._code._value = Number(eventList[index]['code']);
            event._code._ver = Number(eventList[index]['version']);
            event.count = Number(eventList[index]['count']);
            ctokenEvent.event = ctokenEvent.event.concat(event);
            if (ctokenIndex < 0) {
                response.push(ctokenEvent);
            }
        }
    }

    /**
     * モノのレスポンスオブジェクトを生成
     * @param documentList
     * @param response
     * @returns
     */
    private static createThingResponse (thingList: {}[], response: CToken[]) {
        for (let index = 0; index < thingList.length; index++) {
            const ctokenIndex: number = response.findIndex((ctoken: CToken) => {
                if (Number(ctoken.actor._value) === Number(thingList[index]['actorCode'])) {
                    if (ctoken.app && Number(ctoken.app._value) === Number(thingList[index]['appCode'])) {
                        return true;
                    }
                }
            });
            const ctokenThing = response[ctokenIndex];
            const thing: DocEventThingCount = new DocEventThingCount();
            thing._code = new CatalogCodeValueVer();
            thing._code._value = Number(thingList[index]['code']);
            thing._code._ver = Number(thingList[index]['version']);
            thing.count = Number(thingList[index]['count']);
            ctokenThing.thing = ctokenThing.thing.concat(thing);
        }
    }

    /**
     * Regionに属しているサービスプロバイダーをリストアップ
     * @param RegionRootCatalogCode
     * @param operator
     *
     * RefactorDescription:
     *  #3814 : makeWorkflowProviderList
     *  #3814 : makeAppProviderList
     */
    private static async makeServiceProviderList (RegionRootCatalogCode: number, operator: OperatorDomain): Promise<number[]> {
        const catalogService = new CatalogService();
        const catalogDto = new CatalogDto();
        catalogDto.setOperator(operator);
        const name = await catalogService.getCatalog(catalogDto);
        const targetNs = 'catalog/ext/' + name['ext_name'] + '/actor/region-root/actor_' + RegionRootCatalogCode + '/region';
        catalogDto.setProcNum(CatalogDto.GET_FOR_NS);
        catalogDto.setNs(targetNs);
        const regionCatalogInfos = await catalogService.getCatalogInfo(catalogDto);
        const actorCatalogCodes: number[] = [];
        if (regionCatalogInfos && Array.isArray(regionCatalogInfos) && regionCatalogInfos.length > 0) {
            for (const regionCatalogInfo of regionCatalogInfos) {
                // アプリケーションカタログからサービスプロバイダーをリストアップ
                await this.makeAppProviderList(regionCatalogInfo, operator, actorCatalogCodes);
            }
        }
        return actorCatalogCodes;
    }

    /**
     * アプリケーションカタログからサービスプロバイダーをリストアップ
     * @param regionCatalogInfo
     * @param operator
     * @param actorCatalogCodes
     * @returns
     */
    private static async makeAppProviderList (regionCatalogInfo: any, operator: OperatorDomain, actorCatalogCodes: number[]) {
        if (regionCatalogInfo['template'] && regionCatalogInfo['template']['app-alliance'] && Array.isArray(regionCatalogInfo['template']['app-alliance']) && regionCatalogInfo['template']['app-alliance'].length > 0) {
            const apps = regionCatalogInfo['template']['app-alliance'];
            for (const app of apps) {
                // アプリケーションカタログを取得
                const catalogDtoApp = new CatalogDto();
                catalogDtoApp.setOperator(operator);
                catalogDtoApp.setCode(app['_value']);
                const catalogServiceApp = new CatalogService();
                const appCatalog = await catalogServiceApp.getCatalogInfo(catalogDtoApp);
                // カタログのnsからアクターコードの抽出
                const ns: string = appCatalog['catalogItem']['ns'];
                const actorCode = ns.slice(ns.lastIndexOf('_') + 1, ns.indexOf('/', ns.lastIndexOf('_')) < 0 ? ns.length - 1 : ns.indexOf('/', ns.lastIndexOf('_')));

                if (Number(actorCode)) {
                    actorCatalogCodes.push(Number(actorCode));
                }
            }
        }
    }
}
