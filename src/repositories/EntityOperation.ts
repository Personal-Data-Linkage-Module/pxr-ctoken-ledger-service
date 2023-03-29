/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { sprintf } from "sprintf-js";
import CTokenEntity from './postgres/CTokenEntity';
import CTokenHistoryEntity from './postgres/CTokenHistoryEntity';
import DocumentEntity from './postgres/DocumentEntity';
import CMatrixEntity from './postgres/CMatrixEntity';
import RowHashEntity from './postgres/RowHashEntity';
import { Brackets, EntityManager, In } from 'typeorm';
import { connectDatabase } from '../common/Connection';
import OperatorDomain from "../domains/OperatorDomain";
import { Code } from '../resources/dto/PostCountReqDto';
/* eslint-enable */
import moment = require('moment-timezone');

/**
 * CToken台帳エンティティ操作用 サービスクラス
 */
export class EntityOperation {
    /**
     * PXR-IDでCTokenを取得
     * @param em
     * @param pxrId
     */
    static async getCTokenByPxrId (em: EntityManager, pxrId: string): Promise<CTokenEntity> {
        const repository = em.getRepository(CTokenEntity);
        const sql = repository.createQueryBuilder('ctoken')
            .where('ctoken.pxr_id = :pxr_id', { pxr_id: pxrId })
            .andWhere('ctoken.isDisabled = false');
        const result = await sql.getOne();
        return result;
    }

    /**
     * 各 Identifier が指定された rowhash を保持する CMatrix を取得
     * @param em
     * @param ctokenId
     * @param docIdentifier
     * @param eventIdentifier
     * @param thingIdentifier
     */
    static async getCMatrixByIdentifier (em: EntityManager, ctokenId: number, docIdentifier: string[], eventIdentifier: string[], thingIdentifier: string[]): Promise<CMatrixEntity[]> {
        const repository = em.getRepository(CMatrixEntity);
        const query = repository.createQueryBuilder('cmatrix')
            .innerJoinAndSelect(
                'cmatrix.rowHashs',
                'rowHashs',
                'rowHashs.isDisabled = false'
            )
            .leftJoinAndSelect(
                'rowHashs.documents',
                'documents',
                'documents.isDisabled = false'
            )
            .where('cmatrix.ctokenId = :ctokenId', { ctokenId: ctokenId })
            .andWhere('cmatrix.isDisabled = false');
        if (docIdentifier && Array.isArray(docIdentifier) && docIdentifier.length > 0) {
            query.andWhere('documents.docIdentifier in (:...docIdentifier)', { docIdentifier: docIdentifier });
        }
        if (eventIdentifier && Array.isArray(eventIdentifier) && eventIdentifier.length > 0) {
            query.andWhere('rowHashs.eventIdentifier in (:...eventIdentifier)', { eventIdentifier: eventIdentifier });
        }
        if (thingIdentifier && Array.isArray(thingIdentifier) && thingIdentifier.length > 0) {
            query.andWhere('rowHashs.thingIdentifier in (:...thingIdentifier)', { thingIdentifier: thingIdentifier });
        }
        const result = await query.getMany();
        return result;
    }

    /**
     * CMatrix を取得
     */
    static async getCMatrixById (em: EntityManager, cmatrixId: number): Promise<CMatrixEntity> {
        const repository = em.getRepository(CMatrixEntity);
        const query = repository.createQueryBuilder('cmatrix')
            .innerJoinAndSelect(
                'cmatrix.rowHashs',
                'rowHashs',
                'rowHashs.isDisabled = false'
            )
            .leftJoinAndSelect(
                'rowHashs.documents',
                'documents',
                'documents.isDisabled = false'
            )
            .where('cmatrix.id = :cmatrixId', { cmatrixId: cmatrixId })
            .andWhere('cmatrix.isDisabled = false');
        const result = await query.getOne();
        return result;
    }

    /**
     * CToken登録および更新
     * @param em
     * @param entity
     */
    static async insertOrUpdateCToken (em: EntityManager, entity: CTokenEntity): Promise<CTokenEntity> {
        const repository = em.getRepository(CTokenEntity);
        const result = await repository.save({
            id: entity.id,
            pxrId: entity.pxrId,
            ctoken: entity.ctoken,
            ctokenCreateAt: entity.ctokenCreateAt,
            isDisabled: entity.isDisabled,
            createdBy: entity.createdBy,
            createdAt: entity.createdAt,
            updatedBy: entity.updatedBy,
            updatedAt: entity.updatedAt
        });
        return result;
    }

    /**
     * CTokenHistory登録
     * @param em
     * @param entity
     */
    static async insertCTokenHistory (em: EntityManager, entity: CTokenHistoryEntity): Promise<CTokenHistoryEntity> {
        const repository = em.getRepository(CTokenHistoryEntity);
        const result = await repository.save(entity);
        return result;
    }

    /**
     * CMatrixおよびRowHash, Document登録
     * @param em
     * @param entity
     */
    static async insertCMatrixAndRows (em: EntityManager, entity: CMatrixEntity): Promise<CMatrixEntity> {
        const repository = em.getRepository(CMatrixEntity);
        const cMatrixResult = await repository.save(entity);
        const rowHashRepository = em.getRepository(RowHashEntity);
        for (const rowHash of entity.rowHashs) {
            rowHash.cmatrixId = cMatrixResult.id;
            const rowHashResult = await rowHashRepository.save(rowHash);
            const documentRepository = em.getRepository(DocumentEntity);
            if (rowHash.documents && rowHash.documents.length > 0) {
                for (const document of rowHash.documents) {
                    document.rowHashId = rowHashResult.id;
                    await documentRepository.save(document);
                }
            }
        }
        return cMatrixResult;
    }

    /**
     * Document登録
     * @param em
     * @param entity
     */
    static async insertDocument (em: EntityManager, entity: DocumentEntity): Promise<DocumentEntity> {
        const repository = em.getRepository(DocumentEntity);
        const result = await repository.save(entity);
        return result;
    }

    /**
     * rowHashを論理削除する
     */
    static async updateRowHash (em: EntityManager, entity: RowHashEntity) {
        await em.getRepository(RowHashEntity).save(entity);
    }

    /**
     * documentを論理削除する
     */
    static async updateDocument (em: EntityManager, entity: DocumentEntity) {
        await em.getRepository(DocumentEntity).save(entity);
    }

    /**
     * cmatrixhashを更新する
     */
    static async updateCMatrixHash (em: EntityManager, id: number, cmatrixHash: string, operator: OperatorDomain) {
        const entity = await em.getRepository(CMatrixEntity).findOne(id);
        entity.cmatrixHash = cmatrixHash;
        entity.updatedBy = operator.loginId;
        await em.getRepository(CMatrixEntity).save(entity);
    }

    /**
     * cmatrixを論理削除する
     */
    static async deleteCMatrix (em: EntityManager, id: number, operator: OperatorDomain) {
        const entity = await em.getRepository(CMatrixEntity).findOne(id);
        entity.isDisabled = true;
        entity.updatedBy = operator.loginId;
        await em.getRepository(CMatrixEntity).save(entity);
    }

    /**
     * rowHashを論理削除する
     */
    static async deleteRowHash (em: EntityManager, id: number, operator: OperatorDomain) {
        const entity = await em.getRepository(RowHashEntity).findOne(id);
        entity.isDisabled = true;
        entity.updatedBy = operator.loginId;
        await em.getRepository(RowHashEntity).save(entity);
    }

    /**
     * documentを論理削除する
     */
    static async deleteDocument (em: EntityManager, id: number, operator: OperatorDomain) {
        const entity = await em.getRepository(DocumentEntity).findOne(id);
        entity.isDisabled = true;
        entity.updatedBy = operator.loginId;
        await em.getRepository(DocumentEntity).save(entity);
    }

    /**
     * ドキュメントのCToken件数を取得する
     * @param pxrId
     * @param actorCatalogCodes
     * @param startDate
     * @param endDate
     * @param document
     */
    static async getCTokenDocument (pxrId: string, actorCatalogCodes: number[], startDate: Date, endDate: Date, document: Code[], documentIdentifier: string[], offset: number, limit: number): Promise<{}[]> {
        // 開始、終了時間を取得
        const start = startDate ? moment(startDate).format('YYYY-MM-DD HH:mm:ss') : null;
        const end = endDate ? moment(endDate).format('YYYY-MM-DD HH:mm:ss') : null;

        const connection = await connectDatabase();
        let sql = connection
            .createQueryBuilder()
            .select('document."_1_1"', 'identifier')
            .addSelect('document."_1_2_1"', 'code')
            .addSelect('document."_1_2_2"', 'version')
            .addSelect('document."_2_1"', 'createdAt')
            .addSelect('document."_3_1_1"', 'actorCode')
            .addSelect('document."_3_1_2"', 'actorVer')
            .addSelect('document."_3_5_1"', 'appCode')
            .addSelect('document."_3_5_2"', 'appVer')
            .addSelect('document."_3_2_1"', 'wfCode')
            .addSelect('document."_3_2_2"', 'wfVer')
            .from(CTokenEntity, 'ctoken')
            .innerJoin(CMatrixEntity, 'cmatrix', 'cmatrix.ctoken_id = ctoken.id')
            .innerJoin(RowHashEntity, 'row_hash', 'row_hash.cmatrix_id = cmatrix.id')
            .innerJoin(DocumentEntity, 'document', 'document.row_hash_id = row_hash.id')
            .where('ctoken.is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('cmatrix.is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('row_hash.is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('document.is_disabled = :is_disabled', { is_disabled: false });
        if (pxrId) {
            sql = sql.andWhere('ctoken.pxr_id = :id', { id: pxrId });
        }
        if (actorCatalogCodes && actorCatalogCodes.length > 0) {
            sql = sql.andWhere('document."_3_1_1" IN (:...codes)', { codes: actorCatalogCodes });
        }
        if (start) {
            sql = sql.andWhere('document."_2_1" >= :start', { start: start });
        }
        if (end) {
            sql = sql.andWhere('document."_2_1" < :end', { end: end });
        }
        if (document && document.length > 0) {
            sql = sql.andWhere(new Brackets(qb => {
                for (let index = 0; index < document.length; index++) {
                    qb.orWhere(new Brackets(oqb => {
                        oqb.andWhere(`document."_1_2_1" = :code${index}`, { ['code' + index]: document[index]._value })
                            .andWhere(`document."_1_2_2" = :version${index}`, { ['version' + index]: document[index]._ver });
                    }));
                }
            }));
        }
        if (documentIdentifier && documentIdentifier.length > 0) {
            sql = sql.andWhere('document."_1_1" IN (:...documentIdentifier)', { documentIdentifier: documentIdentifier });
        }
        sql = sql.groupBy('document."_1_1"')
            .addGroupBy('document."_1_2_1"')
            .addGroupBy('document."_1_2_2"')
            .addGroupBy('document."_2_1"')
            .addGroupBy('document."_3_1_1"')
            .addGroupBy('document."_3_1_2"')
            .addGroupBy('document."_3_5_1"')
            .addGroupBy('document."_3_5_2"')
            .addGroupBy('document."_3_2_1"')
            .addGroupBy('document."_3_2_2"')
            .orderBy('document."_1_2_1"')
            .addOrderBy('document."_1_2_2"')
            .addOrderBy('document."_2_1"', 'DESC')
            .offset(offset)
            .limit(limit);
        const entity = await sql.getRawMany();
        return entity;
    }

    /**
     * イベントのCToken件数を取得する
     * @param pxrId
     * @param actorCatalogCodes
     * @param startDate
     * @param endDate
     * @param event
     */
    static async getCTokenEvent (pxrId: string, actorCatalogCodes: number[], startDate: Date, endDate: Date, event: Code[], eventIdentifier: string[], offset: number, limit: number): Promise<{}[]> {
        // 開始、終了時間を取得
        const start = startDate ? moment(startDate).format('YYYY-MM-DD HH:mm:ss') : null;
        const end = endDate ? moment(endDate).format('YYYY-MM-DD HH:mm:ss') : null;

        const connection = await connectDatabase();
        let sql = connection
            .createQueryBuilder()
            .select('row_hash."3_1_1"', 'identifier')
            .addSelect('row_hash."3_1_2_1"', 'code')
            .addSelect('row_hash."3_1_2_2"', 'version')
            .addSelect('row_hash."3_2_1"', 'createdAt')
            .addSelect('row_hash."3_5_1_1"', 'actorCode')
            .addSelect('row_hash."3_5_1_2"', 'actorVer')
            .addSelect('row_hash."3_5_5_1"', 'appCode')
            .addSelect('row_hash."3_5_5_2"', 'appVer')
            .addSelect('row_hash."3_5_2_1"', 'wfCode')
            .addSelect('row_hash."3_5_2_2"', 'wfVer')
            .from(CTokenEntity, 'ctoken')
            .innerJoin(CMatrixEntity, 'cmatrix', 'cmatrix.ctoken_id = ctoken.id')
            .innerJoin(RowHashEntity, 'row_hash', 'row_hash.cmatrix_id = cmatrix.id')
            .where('ctoken.is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('cmatrix.is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('row_hash.is_disabled = :is_disabled', { is_disabled: false });
        if (pxrId) {
            sql = sql.andWhere('ctoken.pxr_id = :id', { id: pxrId });
        }
        if (actorCatalogCodes && actorCatalogCodes.length > 0) {
            sql = sql.andWhere('row_hash."3_5_1_1" IN (:...codes)', { codes: actorCatalogCodes });
        }
        if (start) {
            sql = sql.andWhere('row_hash."3_2_1" >= :start', { start: start });
        }
        if (end) {
            sql = sql.andWhere('row_hash."3_2_1" < :end', { end: end });
        }
        if (event && event.length > 0) {
            sql = sql.andWhere(new Brackets(qb => {
                for (let index = 0; index < event.length; index++) {
                    qb.orWhere(new Brackets(oqb => {
                        oqb.andWhere(`row_hash."3_1_2_1" = :code${index}`, { ['code' + index]: event[index]._value })
                            .andWhere(`row_hash."3_1_2_2" = :version${index}`, { ['version' + index]: event[index]._ver });
                    }));
                }
            }));
        }
        if (eventIdentifier && eventIdentifier.length > 0) {
            sql = sql.andWhere('row_hash."3_1_1" IN (:...eventIdentifier)', { eventIdentifier: eventIdentifier });
        }
        sql = sql.groupBy('row_hash."3_1_1"')
            .addGroupBy('row_hash."3_1_2_1"')
            .addGroupBy('row_hash."3_1_2_2"')
            .addGroupBy('row_hash."3_2_1"')
            .addGroupBy('row_hash."3_5_1_1"')
            .addGroupBy('row_hash."3_5_1_2"')
            .addGroupBy('row_hash."3_5_5_1"')
            .addGroupBy('row_hash."3_5_5_2"')
            .addGroupBy('row_hash."3_5_2_1"')
            .addGroupBy('row_hash."3_5_2_2"')
            .orderBy('row_hash."3_1_2_1"')
            .addOrderBy('row_hash."3_1_2_2"')
            .addOrderBy('row_hash."3_2_1"', 'DESC')
            .offset(offset)
            .limit(limit);
        const entity = await sql.getRawMany();
        return entity;
    }

    /**
     * モノのCToken件数を取得する
     * @param pxrId
     * @param actorCatalogCodes
     * @param startDate
     * @param endDate
     * @param document
     * @param event
     * @param thing
     */
    static async getCTokenThing (pxrId: string, actorCatalogCodes: number[], startDate: Date, endDate: Date, thing: Code[], thingIdentifier: string[], offset: number, limit: number): Promise<{}[]> {
        // 開始、終了時間を取得
        const start = startDate ? moment(startDate).format('YYYY-MM-DD HH:mm:ss') : null;
        const end = endDate ? moment(endDate).format('YYYY-MM-DD HH:mm:ss') : null;

        const connection = await connectDatabase();
        let sql = connection
            .createQueryBuilder()
            .select('row_hash."4_1_1"', 'identifier')
            .addSelect('row_hash."4_1_2_1"', 'code')
            .addSelect('row_hash."4_1_2_2"', 'version')
            .addSelect('row_hash."3_2_1"', 'createdAt')
            .addSelect('row_hash."4_4_1_1"', 'actorCode')
            .addSelect('row_hash."4_4_1_2"', 'actorVer')
            .addSelect('row_hash."4_4_5_1"', 'appCode')
            .addSelect('row_hash."4_4_5_2"', 'appVer')
            .addSelect('row_hash."4_4_2_1"', 'wfCode')
            .addSelect('row_hash."4_4_2_2"', 'wfVer')
            .from(CTokenEntity, 'ctoken')
            .innerJoin(CMatrixEntity, 'cmatrix', 'cmatrix.ctoken_id = ctoken.id')
            .innerJoin(RowHashEntity, 'row_hash', 'row_hash.cmatrix_id = cmatrix.id')
            .where('ctoken.is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('cmatrix.is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('row_hash.is_disabled = :is_disabled', { is_disabled: false });
        if (pxrId) {
            sql = sql.andWhere('ctoken.pxr_id = :id', { id: pxrId });
        }
        if (actorCatalogCodes && actorCatalogCodes.length > 0) {
            sql = sql.andWhere('row_hash."3_5_1_1" IN (:...codes)', { codes: actorCatalogCodes });
        }
        if (start) {
            sql = sql.andWhere('row_hash."3_2_1" >= :start', { start: start });
        }
        if (end) {
            sql = sql.andWhere('row_hash."3_2_1" < :end', { end: end });
        }
        if (thing && thing.length > 0) {
            sql = sql.andWhere(new Brackets(qb => {
                for (let index = 0; index < thing.length; index++) {
                    qb.orWhere(new Brackets(oqb => {
                        oqb.andWhere(`row_hash."4_1_2_1" = :code${index}`, { ['code' + index]: thing[index]._value })
                            .andWhere(`row_hash."4_1_2_2" = :version${index}`, { ['version' + index]: thing[index]._ver });
                    }));
                }
            }));
        }
        if (thingIdentifier && thingIdentifier.length > 0) {
            sql = sql.andWhere('row_hash."4_1_1" IN (:...thingIdentifier)', { thingIdentifier: thingIdentifier });
        }
        sql = sql.groupBy('row_hash."4_1_1"')
            .addGroupBy('row_hash."4_1_2_1"')
            .addGroupBy('row_hash."4_1_2_2"')
            .addGroupBy('row_hash."3_2_1"')
            .addGroupBy('row_hash."4_4_1_1"')
            .addGroupBy('row_hash."4_4_1_2"')
            .addGroupBy('row_hash."4_4_5_1"')
            .addGroupBy('row_hash."4_4_5_2"')
            .addGroupBy('row_hash."4_4_2_1"')
            .addGroupBy('row_hash."4_4_2_2"')
            .orderBy('row_hash."4_1_2_1"')
            .addOrderBy('row_hash."4_1_2_2"')
            .addOrderBy('row_hash."3_2_1"', 'DESC')
            .offset(offset)
            .limit(limit);
        const entity = await sql.getRawMany();
        return entity;
    }

    /**
     * ドキュメントのCToken件数を取得する
     * @param pxrId
     * @param actorCatalogCodes
     * @param startDate
     * @param endDate
     * @param document
     * @param event
     * @param thing
     */
    static async getCTokenDocumentCount (pxrId: string, actorCatalogCodes: number[], startDate: Date, endDate: Date, document: Code[], event: Code[], thing: Code[]): Promise<{}[]> {
        // 開始、終了時間を取得
        const start = startDate ? moment(startDate).format('YYYY-MM-DD HH:mm:ss') : null;
        const end = endDate ? moment(endDate).format('YYYY-MM-DD HH:mm:ss') : null;

        // 各データの存在有無を取得
        const isDocument: boolean = !!(document && document.length > 0);
        const isEvent: boolean = !!(event && event.length > 0);
        const isThing: boolean = !!(thing && thing.length > 0);

        const connection = await connectDatabase();
        let sql = connection
            .createQueryBuilder()
            .select('document."_1_2_1"', 'code')
            .addSelect('document."_1_2_2"', 'version')
            .addSelect('row_hash."3_5_2_1"', 'wfCode')
            .addSelect('row_hash."3_5_5_1"', 'appCode')
            .addSelect('row_hash."3_5_1_1"', 'actorCode')
            .addSelect('COUNT(*)', 'count')
            .from(CTokenEntity, 'ctoken')
            .innerJoin(CMatrixEntity, 'cmatrix', 'cmatrix.ctoken_id = ctoken.id')
            .innerJoin(RowHashEntity, 'row_hash', 'row_hash.cmatrix_id = cmatrix.id')
            .innerJoin(DocumentEntity, 'document', 'document.row_hash_id = row_hash.id')
            .where('ctoken.is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('cmatrix.is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('row_hash.is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('document.is_disabled = :is_disabled', { is_disabled: false });

        if (pxrId) {
            sql = sql.andWhere('ctoken.pxr_id = :id', { id: pxrId });
        }
        if (actorCatalogCodes && actorCatalogCodes.length > 0) {
            sql = sql.andWhere('row_hash."3_5_1_1" IN (:...codes)', { codes: actorCatalogCodes });
        }
        if (start) {
            sql = sql.andWhere('row_hash."3_2_1" >= :start', { start: start });
        }
        if (end) {
            sql = sql.andWhere('row_hash."3_2_1" < :end', { end: end });
        }
        if (isDocument) {
            sql = sql.andWhere(new Brackets(qb => {
                for (let index = 0; index < document.length; index++) {
                    qb.orWhere(new Brackets(oqb => {
                        oqb.andWhere(`document."_1_2_1" = :code${index}`, { ['code' + index]: document[index]._value })
                            .andWhere(`document."_1_2_2" = :version${index}`, { ['version' + index]: document[index]._ver });
                    }));
                }
            }));
        }
        if (isEvent) {
            sql = sql.andWhere(new Brackets(qb => {
                for (let index = 0; index < event.length; index++) {
                    qb.orWhere(new Brackets(oqb => {
                        oqb.andWhere(`row_hash."3_1_2_1" = :code${index}`, { ['code' + index]: event[index]._value })
                            .andWhere(`row_hash."3_1_2_2" = :version${index}`, { ['version' + index]: event[index]._ver });
                    }));
                }
            }));
        }
        if (isThing) {
            sql = sql.andWhere(new Brackets(qb => {
                for (let index = 0; index < thing.length; index++) {
                    qb.orWhere(new Brackets(oqb => {
                        oqb.andWhere(`row_hash."4_1_2_1" = :code${index}`, { ['code' + index]: thing[index]._value })
                            .andWhere(`row_hash."4_1_2_2" = :version${index}`, { ['version' + index]: thing[index]._ver });
                    }));
                }
            }));
        }
        sql = sql.groupBy('document."_1_2_1"')
            .addGroupBy('document."_1_2_2"')
            .addGroupBy('row_hash."3_5_2_1"')
            .addGroupBy('row_hash."3_5_5_1"')
            .addGroupBy('row_hash."3_5_1_1"')
            .orderBy('document."_1_2_1"')
            .addOrderBy('document."_1_2_2"')
            .addOrderBy('row_hash."3_5_2_1"')
            .addOrderBy('row_hash."3_5_5_1"')
            .addOrderBy('row_hash."3_5_1_1"');
        const entity = await sql.getRawMany();
        return entity;
    }

    /**
     * イベントのCToken件数を取得する
     * @param pxrId
     * @param actorCatalogCodes
     * @param startDate
     * @param endDate
     * @param document
     * @param event
     * @param thing
     */
    static async getCTokenEventCount (pxrId: string, actorCatalogCodes: number[], startDate: Date, endDate: Date, document: Code[], event: Code[], thing: Code[]): Promise<{}[]> {
        // 開始、終了時間を取得
        const start = startDate ? moment(startDate).format('YYYY-MM-DD HH:mm:ss') : null;
        const end = endDate ? moment(endDate).format('YYYY-MM-DD HH:mm:ss') : null;

        // 各データの存在有無を取得
        const isDocument: boolean = !!(document && document.length > 0);
        const isEvent: boolean = !!(event && event.length > 0);
        const isThing: boolean = !!(thing && thing.length > 0);

        const connection = await connectDatabase();
        let sql = connection
            .createQueryBuilder()
            .select('row_hash."3_1_2_1"', 'code')
            .addSelect('row_hash."3_1_2_2"', 'version')
            .addSelect('row_hash."3_5_2_1"', 'wfCode')
            .addSelect('row_hash."3_5_5_1"', 'appCode')
            .addSelect('row_hash."3_5_1_1"', 'actorCode')
            .addSelect('COUNT(*)', 'count')
            .from(CTokenEntity, 'ctoken')
            .innerJoin(CMatrixEntity, 'cmatrix', 'cmatrix.ctoken_id = ctoken.id')
            .innerJoin(RowHashEntity, 'row_hash', 'row_hash.cmatrix_id = cmatrix.id')
            .leftJoin(DocumentEntity, 'document', 'document.row_hash_id = row_hash.id AND document.is_disabled = :is_disabled', { is_disabled: false })
            .where('ctoken.is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('cmatrix.is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('row_hash.is_disabled = :is_disabled', { is_disabled: false });

        if (pxrId) {
            sql = sql.andWhere('ctoken.pxr_id = :id', { id: pxrId });
        }
        if (actorCatalogCodes && actorCatalogCodes.length > 0) {
            sql = sql.andWhere('row_hash."3_5_1_1" IN (:...codes)', { codes: actorCatalogCodes });
        }
        if (start) {
            sql = sql.andWhere('row_hash."3_2_1" >= :start', { start: start });
        }
        if (end) {
            sql = sql.andWhere('row_hash."3_2_1" < :end', { end: end });
        }
        if (isDocument) {
            sql = sql.andWhere(new Brackets(qb => {
                for (let index = 0; index < document.length; index++) {
                    qb.orWhere(new Brackets(oqb => {
                        oqb.andWhere('document."_1_2_1" = :code', { code: document[index]._value })
                            .andWhere('document."_1_2_2" = :version', { version: document[index]._ver });
                    }));
                }
            }));
        }
        if (isEvent) {
            sql = sql.andWhere(new Brackets(qb => {
                for (let index = 0; index < event.length; index++) {
                    qb.orWhere(new Brackets(oqb => {
                        oqb.andWhere('row_hash."3_1_2_1" = :code', { code: event[index]._value })
                            .andWhere('row_hash."3_1_2_2" = :version', { version: event[index]._ver });
                    }));
                }
            }));
        }
        if (isThing) {
            sql = sql.andWhere(new Brackets(qb => {
                for (let index = 0; index < thing.length; index++) {
                    qb.orWhere(new Brackets(oqb => {
                        oqb.andWhere('row_hash."4_1_2_1" = :code', { code: thing[index]._value })
                            .andWhere('row_hash."4_1_2_2" = :version', { version: thing[index]._ver });
                    }));
                }
            }));
        }
        sql = sql.groupBy('row_hash."3_1_2_1"')
            .addGroupBy('row_hash."3_1_2_2"')
            .addGroupBy('row_hash."3_5_2_1"')
            .addGroupBy('row_hash."3_5_5_1"')
            .addGroupBy('row_hash."3_5_1_1"')
            .orderBy('row_hash."3_1_2_1"')
            .addOrderBy('row_hash."3_1_2_2"')
            .addOrderBy('row_hash."3_5_2_1"')
            .addOrderBy('row_hash."3_5_5_1"')
            .addOrderBy('row_hash."3_5_1_1"');
        const entity = await sql.getRawMany();
        return entity;
    }

    /**
     * モノのCToken件数を取得する
     * @param pxrId
     * @param actorCatalogCodes
     * @param startDate
     * @param endDate
     * @param document
     * @param event
     * @param thing
     */
    static async getCTokenThingCount (pxrId: string, actorCatalogCodes: number[], startDate: Date, endDate: Date, document: Code[], event: Code[], thing: Code[]): Promise<{}[]> {
        // 開始、終了時間を取得
        const start = startDate ? moment(startDate).format('YYYY-MM-DD HH:mm:ss') : null;
        const end = endDate ? moment(endDate).format('YYYY-MM-DD HH:mm:ss') : null;

        // 各データの存在有無を取得
        const isDocument: boolean = !!(document && document.length > 0);
        const isEvent: boolean = !!(event && event.length > 0);
        const isThing: boolean = !!(thing && thing.length > 0);

        const connection = await connectDatabase();
        let sql = connection
            .createQueryBuilder()
            .select('row_hash."4_1_2_1"', 'code')
            .addSelect('row_hash."4_1_2_2"', 'version')
            .addSelect('row_hash."3_5_2_1"', 'wfCode')
            .addSelect('row_hash."3_5_5_1"', 'appCode')
            .addSelect('row_hash."3_5_1_1"', 'actorCode')
            .addSelect('COUNT(*)', 'count')
            .from(CTokenEntity, 'ctoken')
            .innerJoin(CMatrixEntity, 'cmatrix', 'cmatrix.ctoken_id = ctoken.id')
            .innerJoin(RowHashEntity, 'row_hash', 'row_hash.cmatrix_id = cmatrix.id')
            .leftJoin(DocumentEntity, 'document', 'document.row_hash_id = row_hash.id AND document.is_disabled = :is_disabled', { is_disabled: false })
            .where('ctoken.is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('cmatrix.is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('row_hash.is_disabled = :is_disabled', { is_disabled: false });

        if (pxrId) {
            sql = sql.andWhere('ctoken.pxr_id = :id', { id: pxrId });
        }
        if (actorCatalogCodes && actorCatalogCodes.length > 0) {
            sql = sql.andWhere('row_hash."3_5_1_1" IN (:...codes)', { codes: actorCatalogCodes });
        }
        if (start) {
            sql = sql.andWhere('row_hash."3_2_1" >= :start', { start: start });
        }
        if (end) {
            sql = sql.andWhere('row_hash."3_2_1" < :end', { end: end });
        }
        if (isDocument) {
            sql = sql.andWhere(new Brackets(qb => {
                for (let index = 0; index < document.length; index++) {
                    qb.orWhere(new Brackets(oqb => {
                        oqb.andWhere('document."_1_2_1" = :code', { code: document[index]._value })
                            .andWhere('document."_1_2_2" = :version', { version: document[index]._ver });
                    }));
                }
            }));
        }
        if (isEvent) {
            sql = sql.andWhere(new Brackets(qb => {
                for (let index = 0; index < event.length; index++) {
                    qb.orWhere(new Brackets(oqb => {
                        oqb.andWhere('row_hash."3_1_2_1" = :code', { code: event[index]._value })
                            .andWhere('row_hash."3_1_2_2" = :version', { version: event[index]._ver });
                    }));
                }
            }));
        }
        if (isThing) {
            sql = sql.andWhere(new Brackets(qb => {
                for (let index = 0; index < thing.length; index++) {
                    qb.orWhere(new Brackets(oqb => {
                        oqb.andWhere('row_hash."4_1_2_1" = :code', { code: thing[index]._value })
                            .andWhere('row_hash."4_1_2_2" = :version', { version: thing[index]._ver });
                    }));
                }
            }));
        }
        sql = sql.groupBy('row_hash."4_1_2_1"')
            .addGroupBy('row_hash."4_1_2_2"')
            .addGroupBy('row_hash."3_5_2_1"')
            .addGroupBy('row_hash."3_5_5_1"')
            .addGroupBy('row_hash."3_5_1_1"')
            .orderBy('row_hash."4_1_2_1"')
            .addOrderBy('row_hash."4_1_2_2"')
            .addOrderBy('row_hash."3_5_2_1"')
            .addOrderBy('row_hash."3_5_5_1"')
            .addOrderBy('row_hash."3_5_1_1"');
        const entity = await sql.getRawMany();
        return entity;
    }

    /**
     *  PXR-ID、種別、カタログコードをキーに、対象種別の件数を取得
     * @param targetList
     */
    static async getRowCountWithPxrIdType (targetList: {}): Promise<any[]> {
        const connection = await connectDatabase();
        const repository = connection.getRepository(CTokenEntity);
        let sql = repository.createQueryBuilder('ctoken')
            .select(['"pxr_id" as pxr_id', '"4_4_1_1" AS actor', 'COUNT(*) AS count'])
            .leftJoin(
                'ctoken.cmatrixs',
                'cmatrixs',
                'cmatrixs.isDisabled = false'
            )
            .leftJoin(
                'cmatrixs.rowHashs',
                'rowHashs',
                'rowHashs.isDisabled = false'
            )
            .leftJoin(
                'rowHashs.documents',
                'documents',
                'documents.isDisabled = false'
            )
            .where('ctoken.isDisabled = false');
        if (targetList['type'] === 'document') {
            sql = sql.andWhere('"_1_2_1" = :code', { code: targetList['_code']['_value'] })
                .andWhere('"_1_2_2" = :version', { version: targetList['_code']['_ver'] });
        } else if (targetList['type'] === 'event') {
            sql = sql.andWhere('"3_1_2_1" = :code', { code: targetList['_code']['_value'] })
                .andWhere('"3_1_2_2" = :version', { version: targetList['_code']['_ver'] });
        } else if (targetList['type'] === 'thing') {
            sql = sql.andWhere('"4_1_2_1" = :code', { code: targetList['_code']['_value'] })
                .andWhere('"4_1_2_2" = :version', { version: targetList['_code']['_ver'] });
        }
        sql = sql.groupBy('"pxr_id"').addGroupBy('"4_4_1_1"');
        const result = await sql.getRawMany();
        return result;
    }

    // ctokenに紐づくrowHashをidentifierを指定して取得する
    static async getRowHashByIdentifier (em: EntityManager, ctokenId: number, eventIdentifier: string, thingIdentifier: string): Promise<RowHashEntity> {
        const sql = em.createQueryBuilder()
            .select('row_hash.*')
            .from(RowHashEntity, 'row_hash')
            .innerJoin(CMatrixEntity, 'cmatrix', 'cmatrix.id = row_hash.cmatrix_id')
            .where('cmatrix.ctoken_id = :ctoken_id', { ctoken_id: ctokenId })
            .andWhere('cmatrix.is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('row_hash.is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('row_hash."3_1_1" = :event_identifier', { event_identifier: eventIdentifier })
            .andWhere('row_hash."4_1_1" = :thing_identifier', { thing_identifier: thingIdentifier });
        const entity = await sql.getRawOne();
        return entity;
    }
}
