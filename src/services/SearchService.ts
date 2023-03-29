/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import { Service } from 'typedi';
/* eslint-disable */
import SearchDto from './dto/SearchDto';
import PostSearchResDto, { Count, CToken, DataCount, CatalogCodeValue, CatalogCodeValueVer } from '../resources/dto/PostSearchResDto';
/* eslint-enable */
import CatalogService from './CatalogService';
import CatalogDto from './dto/CatalogDto';
import { EntityOperation } from '../repositories/EntityOperation';

@Service()
export default class SearchService {
    /**
     * PXR-ID検索
     * @param dto
     *
     * RefactorDescription:
     *  #3814 : getCatalogCode
     *  #3814 : setAndDataCounts
     *  #3814 : setOrDataCounts
     *  #3814 : getAndTargetCounts
     *  #3814 : getOrTargetCounts
     *  #3814 : checkCatalogType
     *  #3814 : createResponse
     */
    public static async searchPxrId (dto: SearchDto): Promise<PostSearchResDto> {
        // リクエストを取得
        const request = dto.getRequest();

        // オペレータ情報を取得
        const operator = dto.getOperator();

        // 検索対象PXR-IDリストを取得
        const pxrIdList: string[] = request['pxrId'];

        // 検索条件リストを取得
        const conditionList: {}[] = request['condition'];

        // 検索条件リストからAND条件のみを抽出
        const andConditionList: {}[] = conditionList.filter((element: {}) => {
            if (element['type'] === 'and') {
                return true;
            }
        });

        // 検索条件リストからOR条件のみを抽出
        const orConditionList: {}[] = conditionList.filter((element: {}) => {
            if (element['type'] === 'or') {
                return true;
            }
        });

        // カタログコードのみを抽出
        const codeList: {}[] = this.getCatalogCode(conditionList);

        // 各カタログをカタログサービスから取得
        const catalogDto = new CatalogDto();
        catalogDto.setOperator(operator);
        const catalogService = new CatalogService();
        const catalogList: {}[] = await catalogService.getCatalogList(catalogDto, codeList);

        // 取得した各カタログのタイプをチェック
        const catalogCheckResult: {}[] = this.checkCatalogType(catalogList);

        // AND条件の検索条件リストから全ての件数を取得
        const tempAndCounts: {}[] = await this.getAndAllCounts(catalogCheckResult, andConditionList);

        // OR条件の検索条件リストから全ての件数を取得
        const tempOrCounts: {}[] = await this.getOrAllCounts(catalogCheckResult, orConditionList);

        // 各検索条件に従って検索
        const res = new PostSearchResDto();

        // 各PXRIDの対象種別件数を取得
        for (let index = 0; index < pxrIdList.length; index++) {
            const dataCounts: {
                actor: number,
                dataValue: number,
                dataVer: number,
                count: number
            }[] = [];
            // and条件が存在する場合
            if (tempAndCounts && tempAndCounts.length > 0) {
                let isCheck = true;
                let tempDataCounts = [];
                // AND条件の検索条件リストから対象種別件数を取得
                ({ isCheck, tempDataCounts } = await this.getAndTargetCounts(tempAndCounts, pxrIdList, index));

                // チェック結果がOKの場合
                this.setAndDataCounts(isCheck, tempDataCounts, dataCounts);
            }

            // or条件が存在する場合
            if (tempOrCounts && tempOrCounts.length > 0) {
                for (let orIndex = 0; orIndex < tempOrCounts.length; orIndex++) {
                    let type = null;
                    let targetCounts = [];
                    let count = 0;
                    // OR条件の検索条件リストから対象種別件数を取得
                    ({ count, targetCounts, type } = await this.getOrTargetCounts(tempOrCounts, pxrIdList, index, orIndex));

                    // 範囲判定
                    const min: number = tempOrCounts[orIndex]['additional_min'];
                    if (count < min) {
                        continue;
                    }
                    const max: number = tempOrCounts[orIndex]['additional_max'];
                    if (max && count > max) {
                        continue;
                    }

                    // チェック結果がOKの場合
                    this.setOrDataCounts(targetCounts, dataCounts, type);
                }
            }
            // レスポンスを作成
            this.createResponse(dataCounts, pxrIdList, index, res);
        }
        // レスポンスを返却する
        return res;
    }

    /**
     * 検索条件リストからカタログコードを取得
     * @param conditionList
     */
    private static getCatalogCode (conditionList: {}[]) {
        const codeList: {}[] = [];
        for (let index = 0; index < conditionList.length; index++) {
            codeList.push({
                _code: {
                    _value: conditionList[index]['_code']['_value'],
                    _ver: conditionList[index]['_code']['_ver']
                }
            });
        }
        return codeList;
    }

    /**
     * AND条件の検索条件リストから全ての件数を取得
     * @param catalogCheckResult
     * @param andConditionList
     */
    private static async getAndAllCounts (catalogCheckResult: {}[], andConditionList: {}[]) {
        const tempAndCounts: any[] = [];
        for (let andIndex = 0; andIndex < andConditionList.length; andIndex++) {
            // 対象種別を取得
            const type = catalogCheckResult.find((element: {}) => {
                if (element['_code']['_value'] === andConditionList[andIndex]['_code']['_value'] &&
                    element['_code']['_value'] === andConditionList[andIndex]['_code']['_value']) {
                    return true;
                }
            });
            // PXR-IDをキーに対象カタログの件数を取得
            const andCounts = {
                data: await EntityOperation.getRowCountWithPxrIdType(type),
                additional_type: type,
                additional_min: andConditionList[andIndex]['min'],
                additional_max: andConditionList[andIndex]['max']
            };
            tempAndCounts.push(andCounts);
        }
        return tempAndCounts;
    }

    /**
     * OR条件の検索条件リストから全ての件数を取得
     * @param catalogCheckResult
     * @param orConditionList
     */
    private static async getOrAllCounts (catalogCheckResult: {}[], orConditionList: {}[]) {
        const tempOrCounts: any[] = [];
        for (let orIndex = 0; orIndex < orConditionList.length; orIndex++) {
            // 対象種別を取得
            const type = catalogCheckResult.find((element: {}) => {
                if (element['_code']['_value'] === orConditionList[orIndex]['_code']['_value'] &&
                    element['_code']['_value'] === orConditionList[orIndex]['_code']['_value']) {
                    return true;
                }
            });
            // PXR-IDをキーに対象カタログの件数を取得
            const orCounts = {
                data: await EntityOperation.getRowCountWithPxrIdType(type),
                additional_type: type,
                additional_min: orConditionList[orIndex]['min'],
                additional_max: orConditionList[orIndex]['max']
            };
            tempOrCounts.push(orCounts);
        }
        return tempOrCounts;
    }

    /**
     * AND条件の対象種別件数をdataCountsに追加
     * @param isCheck
     * @param tempDataCounts
     * @param dataCounts
     */
    private static setAndDataCounts (isCheck: boolean, tempDataCounts: any[], dataCounts: { actor: number; dataValue: number; dataVer: number; count: number; }[]) {
        if (isCheck) {
            for (const tempDataCount of tempDataCounts) {
                dataCounts.push({
                    actor: Number(tempDataCount['actor']),
                    dataValue: Number(tempDataCount['dataValue']),
                    dataVer: Number(tempDataCount['dataVer']),
                    count: Number(tempDataCount['count'])
                });
            }
        }
    }

    /**
     * OR条件の対象種別件数をdataCountsに追加
     * @param targetCounts
     * @param dataCounts
     * @param type
     */
    private static setOrDataCounts (targetCounts: any[], dataCounts: { actor: number; dataValue: number; dataVer: number; count: number; }[], type: {}) {
        for (const targetCount of targetCounts) {
            dataCounts.push({
                actor: Number(targetCount['actor']),
                dataValue: Number(type['_code']['_value']),
                dataVer: Number(type['_code']['_ver']),
                count: Number(targetCount['count'])
            });
        }
    }

    /**
     * AND条件の検索条件リストから対象種別件数を取得
     * @param tempAndCounts
     * @param pxrIdList
     * @param index
     */
    private static async getAndTargetCounts (tempAndCounts: {}[], pxrIdList: string[], index: number) {
        let isCheck: boolean = true;
        const tempDataCounts: any[] = [];
        for (let andIndex = 0; andIndex < tempAndCounts.length; andIndex++) {
            // PXR-IDをキーに対象カタログの件数を取得
            const targetCounts: any[] = [];
            for (const tempAndCount of tempAndCounts[andIndex]['data']) {
                if (tempAndCount['pxr_id'] === pxrIdList[index]) {
                    targetCounts.push(tempAndCount);
                }
            }

            let count = 0;
            for (const targetCount of targetCounts) {
                count += Number(targetCount['count']);
            }

            // 範囲判定
            const min: number = tempAndCounts[andIndex]['additional_min'];
            if (count < min) {
                isCheck = false;
                break;
            }
            const max: number = tempAndCounts[andIndex]['additional_max'];
            if (max && count > max) {
                isCheck = false;
                break;
            }
            for (const targetCount of targetCounts) {
                tempDataCounts.push({
                    actor: Number(targetCount['actor']),
                    dataValue: Number(tempAndCounts[andIndex]['additional_type']['_code']['_value']),
                    dataVer: Number(tempAndCounts[andIndex]['additional_type']['_code']['_ver']),
                    count: Number(targetCount['count'])
                });
            }
        }
        return { isCheck, tempDataCounts };
    }

    /**
     * OR条件の検索条件リストから対象種別件数を取得
     * @param catalogCheckResult
     * @param orConditionList
     * @param pxrIdList
     * @param index
     */
    private static async getOrTargetCounts (tempOrCounts: {}[], pxrIdList: string[], index: number, orIndex: number) {
        // PXR-IDをキーに対象カタログの件数を取得
        const targetCounts: any[] = [];
        for (const tempOrCount of tempOrCounts[orIndex]['data']) {
            if (tempOrCount['pxr_id'] === pxrIdList[index]) {
                targetCounts.push(tempOrCount);
            }
        }
        const type: {} = tempOrCounts[orIndex]['additional_type'];

        let count = 0;
        for (const targetCount of targetCounts) {
            count += Number(targetCount['count']);
        }
        return { count, targetCounts, type };
    }

    /**
     * カタログのタイプをチェック
     * @param catalogList
     */
    private static checkCatalogType (catalogList: {}[]) {
        const catalogCheckResult: {}[] = [];
        for (let index = 0; index < catalogList.length; index++) {
            const ns: string = catalogList[index]['catalogItem']['ns'];
            let type: string = null;
            if (ns.indexOf('document') >= 0) {
                type = 'document';
            } else if (ns.indexOf('event') >= 0) {
                type = 'event';
            } else if (ns.indexOf('thing') >= 0) {
                type = 'thing';
            }
            catalogCheckResult.push({
                _code: catalogList[index]['catalogItem']['_code'],
                type: type
            });
        }
        return catalogCheckResult;
    }

    /**
     * レスポンスを作成
     * @param dataCounts
     * @param pxrIdList
     * @param index
     * @param res
     */
    private static createResponse (dataCounts: { actor: number; dataValue: number; dataVer: number; count: number; }[], pxrIdList: string[], index: number, res: PostSearchResDto) {
        if (dataCounts.length > 0) {
            const ctokens: CToken[] = [];
            for (const dataCount of dataCounts) {
                let ctoken = ctokens.find((ele) => {
                    if (Number(ele.actor._value) === dataCount.actor) {
                        return true;
                    }
                });
                if (ctoken) {
                    ctoken.data.push({
                        _code: {
                            _value: dataCount.dataValue,
                            _ver: dataCount.dataVer
                        },
                        count: dataCount.count
                    });
                } else {
                    ctoken = new CToken();
                    ctoken.actor._value = dataCount.actor;
                    ctoken.data.push({
                        _code: {
                            _value: dataCount.dataValue,
                            _ver: dataCount.dataVer
                        },
                        count: dataCount.count
                    });
                    ctokens.push(ctoken);
                }
            }
            const count: Count = {
                pxrId: pxrIdList[index],
                ctokens: ctokens
            };
            res.counts.push(count);
        }
    }
}
