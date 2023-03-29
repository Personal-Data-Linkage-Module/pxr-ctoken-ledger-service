/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import CTokenEntity from '../postgres/CTokenEntity';
import CTokenHistoryEntity from '../postgres/CTokenHistoryEntity';
import DocumentEntity from '../postgres/DocumentEntity';
import CMatrixEntity from '../postgres/CMatrixEntity';
import RowHashEntity from '../postgres/RowHashEntity';
import { EntityManager, In } from 'typeorm';
import OperatorDomain from "../../domains/OperatorDomain";
import { Code } from '../../resources/dto/PostCountReqDto';
import Config from '../../common/Config';
import AppError from '../../common/AppError';
const Message = Config.ReadConfig('./config/message.json');

/**
 * CToken台帳エンティティ操作用 サービスクラス
 */
export class EntityOperation {
    /**
     * PXR-ID配列でCToken, CMatrixを取得
     * @param em
     * @param pxrIds
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
        throw new AppError(Message.FAILED_SAVE_ENTITY, 500);
    }

    /**
     * CTokenHistory登録
     * @param em
     * @param entity
     */
    static async insertCTokenHistory (em: EntityManager, entity: CTokenHistoryEntity): Promise<CTokenHistoryEntity> {
        throw new AppError(Message.FAILED_SAVE_ENTITY, 500);
    }

    /**
     * CMatrixおよびRowHash, Document登録
     * @param em
     * @param entity
     */
    static async insertCMatrixAndRows (em: EntityManager, entity: CMatrixEntity): Promise<CMatrixEntity> {
        throw new AppError(Message.FAILED_SAVE_ENTITY, 500);
    }

    /**
     * rowHashを論理削除する
     */
    static async updateRowHash (em: EntityManager, entity: RowHashEntity) {
        throw new AppError(Message.FAILED_SAVE_ENTITY, 500);
    }

    /**
     * documentを論理削除する
     */
    static async updateDocument (em: EntityManager, entity: DocumentEntity) {
        throw new AppError(Message.FAILED_SAVE_ENTITY, 500);
    }

    /**
     * cmatrixhashを更新する
     */
    static async updateCMatrixHash (em: EntityManager, id: number, cmatrixHash: string, operator: OperatorDomain) {
        throw new AppError(Message.FAILED_SAVE_ENTITY, 500);
    }

    /**
     * cmatrixを論理削除する
     */
    static async deleteCMatrix (em: EntityManager, id: number, operator: OperatorDomain) {
        throw new AppError(Message.FAILED_SAVE_ENTITY, 500);
    }

    /**
     * rowHashを論理削除する
     */
    static async deleteRowHash (em: EntityManager, id: number, operator: OperatorDomain) {
        throw new AppError(Message.FAILED_SAVE_ENTITY, 500);
    }

    /**
     * documentを論理削除する
     */
    static async deleteDocument (em: EntityManager, id: number, operator: OperatorDomain) {
        throw new AppError(Message.FAILED_SAVE_ENTITY, 500);
    }

    /**
     * アクターに関連付けされているエンティティを含めてオブジェクトを取得する
     * @param actorCatalogCodes
     * @param startDate
     * @param endDate
     * @param document
     * @param event
     * @param thing
     */
    static async getCToken (actorCatalogCodes: number[], startDate: Date, endDate: Date, document: Code[], event: Code[], thing: Code[]): Promise<RowHashEntity[]> {
        return [];
    }

    /**
     * PXR-IDをキーに、関連付されているエンティティを含めてオブジェクトを取得する
     * @param notificationId 通知ID
     */
    static async getCTokenWithPxrId (pxrId: string, startDate: Date, endDate: Date, document: Code[], event: Code[], thing: Code[]): Promise<CTokenEntity> {
        return null;
    }
}
