/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import OperatorDomain from '../domains/OperatorDomain';
import ServiceDto from './dto/CTokenServiceDto';
/* eslint-enable */
import { Service } from 'typedi';
import AppError from '../common/AppError';
import Config from '../common/Config';
import { ResponseCode } from '../common/ResponseCode';
import { EntityOperation } from '../repositories/EntityOperation';
import PostCTokenResDto from '../resources/dto/PostCTokenResDto';
import CatalogDto from './dto/CatalogDto';
import CatalogService from './CatalogService';
const message = Config.ReadConfig('./config/message.json');

@Service()
export default class CTokenService {
    /**
     * CToken件数検索
     * @param operator
     * @param dto
     *
     * RefactorDescription:
     *  #3814 : getCatalogProviderList
     */
    public static async postGetCToken (dto: ServiceDto): Promise<PostCTokenResDto> {
        const operator = dto.getOperator();

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

        // CToken件数を取得
        let dataList: any[] = [];
        const isDocument: boolean = !!dto.getDocument() || !!dto.getDocumentIdentifier();
        const isEvent: boolean = !!dto.getEvent() || !!dto.getEventIdentifier();
        const isThing: boolean = !!dto.getThing() || !!dto.getThingIdentifier();
        if (isDocument) {
            dataList = await EntityOperation.getCTokenDocument(pxrId, actorCatalogCodes, dto.getStartAt(), dto.getEndAt(), dto.getDocument(), dto.getDocumentIdentifier(), dto.getOffset(), dto.getLimit());
        } else if (isEvent) {
            dataList = await EntityOperation.getCTokenEvent(pxrId, actorCatalogCodes, dto.getStartAt(), dto.getEndAt(), dto.getEvent(), dto.getEventIdentifier(), dto.getOffset(), dto.getLimit());
        } else if (isThing) {
            dataList = await EntityOperation.getCTokenThing(pxrId, actorCatalogCodes, dto.getStartAt(), dto.getEndAt(), dto.getThing(), dto.getThingIdentifier(), dto.getOffset(), dto.getLimit());
        }

        // レスポンスを作成
        const res: PostCTokenResDto = new PostCTokenResDto();
        res.dataList = dataList;
        res.isDocument = isDocument;
        res.isEvent = isEvent;
        res.isThing = isThing;
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
     * Regionに属しているサービスプロバイダーをリストアップ
     * @param RegionRootCatalogCode
     * @param operator
     *
     * RefactorDescription:
     *  #3814 : setListToRegionCatalogInfos
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
            this.setListToRegionCatalogInfos(regionCatalogInfos, actorCatalogCodes);
        }
        return actorCatalogCodes;
    }

    /**
     * Regionに属しているサービスプロバイダーをリストに追加
     * @param regionCatalogInfos
     * @param actorCatalogCodes
     */
    private static setListToRegionCatalogInfos (regionCatalogInfos: any[], actorCatalogCodes: number[]) {
        for (const regionCatalogInfo of regionCatalogInfos) {
            if (regionCatalogInfo['template'] && regionCatalogInfo['template']['app-alliance'] && Array.isArray(regionCatalogInfo['template']['app-alliance']) && regionCatalogInfo['template']['app-alliance'].length > 0) {
                const apps = regionCatalogInfo['template']['app-alliance'];
                for (const app of apps) {
                    actorCatalogCodes.push(app['_value']);
                }
            }
        }
    }
}
