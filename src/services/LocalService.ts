/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Service } from 'typedi';
import OperatorDomain from '../domains/OperatorDomain';
import AppError from '../common/AppError';
import { ResponseCode } from '../common/ResponseCode';
import { EntityOperation } from '../repositories/EntityOperation';
import PostLocalReqDto, { CMatrix, Document, Event, Thing, CMatrixForDelete, DocumentForDelete, EventForDelete, ThingForDelete } from '../resources/dto/PostLocalReqDto';
import PostLocalResDto from '../resources/dto/PostLocalResDto';
import { connectDatabase } from '../common/Connection';
import { EntityManager } from 'typeorm';
/* eslint-enable */
import Config from '../common/Config';
import BookManageDto from './dto/BookManageDto';
import BookManageService from './BookManageService';
import CTokenEntity from '../repositories/postgres/CTokenEntity';
import CTokenHistoryEntity from '../repositories/postgres/CTokenHistoryEntity';
import CMatrixEntity from '../repositories/postgres/CMatrixEntity';
import RowHashEntity from '../repositories/postgres/RowHashEntity';
import DocumentEntity from '../repositories/postgres/DocumentEntity';
import crypto = require('crypto');
const Message = Config.ReadConfig('./config/message.json');
const Confiure = Config.ReadConfig('./config/config.json');

@Service()
export default class LocalService {
    /**
     * Local-CToken差分登録
     * @param operator
     * @param dto
     */
    public static async postLocal (operator: OperatorDomain, dto: PostLocalReqDto): Promise<any> {
        // Book取得
        const bookManageDto = new BookManageDto();
        bookManageDto.setOperator(operator);
        bookManageDto.setMessage(Message);
        bookManageDto.setUrl(Confiure.bookManage.search);
        const bookManageService = new BookManageService();
        const books = await bookManageService.postSearchBook(bookManageDto);

        // 登録
        const connection = await connectDatabase();
        await connection.transaction(async transaction => {
            if (dto.add.length > 0) {
                await this.insertRowHash(transaction, operator, books, dto.add);
            }
            if (dto.update.length > 0) {
                await this.updateRowHash(transaction, operator, books, dto.update);
            }
            if (dto.delete.length > 0) {
                await this.deleteCMatrix(transaction, operator, books, dto.delete);
            }
            // PXRウォレット登録
        }).catch(err => {
            throw err;
        });

        // レスポンスを生成、処理を終了
        const res = new PostLocalResDto();
        res.result = 'success';
        return res.toJSON();
    }

    private static getPxrId (books: any, cmatrix: CMatrix|CMatrixForDelete) {
        let pxrId = '';
        let exists = false;
        for (const book of books) {
            if (book['cooperation'] && Array.isArray(book['cooperation'])) {
                for (const cooperation of book['cooperation']) {
                    if (cooperation['userId'] === cmatrix.userId) {
                        pxrId = book['pxrId'];
                        exists = true;
                        break;
                    }
                }
            }
            if (exists) {
                break;
            }
        }
        if (!exists) {
            throw new AppError(Message.NO_PXRID, ResponseCode.NOT_FOUND);
        }
        return pxrId;
    }

    /**
     * 登録
     * @param transaction
     * @param operator
     * @param books
     * @param add
     *
     * RefactorDescription:
     *  #3814 : insertRowHashDocument
     */
    private static async insertRowHash (transaction: EntityManager, operator: OperatorDomain, books: any, add: CMatrix[]) {
        // リクエストをループさせる
        for (const cmatrix of add) {
            // PXR-IDの特定
            const pxrId = this.getPxrId(books, cmatrix);

            // matrixHashを生成する
            const cmatrixHashSrc: string[] = [];
            for (const thing of cmatrix.thing) {
                cmatrixHashSrc.push(thing.rowHash);
            }
            const cmatrixHash = crypto.createHash('sha256').update(JSON.stringify(cmatrixHashSrc), 'utf8').digest('hex');

            // PXR-IDでのCToken検索
            let cTokenEntity: CTokenEntity = await EntityOperation.getCTokenByPxrId(transaction, pxrId);

            // CTokenの作成または更新
            if (cTokenEntity) {
                // 更新
                const oldCToken = cTokenEntity.ctoken;
                const cTokenSrc: string[] = [];
                cTokenSrc.push(oldCToken);
                cTokenSrc.push(cmatrixHash);
                const cTokenHash = crypto.createHash('sha256').update(JSON.stringify(cTokenSrc), 'utf8').digest('hex');
                cTokenEntity.ctoken = cTokenHash;
                cTokenEntity.updatedBy = operator.loginId;
                const cTokenHistory = new CTokenHistoryEntity();
                cTokenHistory.ctokenId = cTokenEntity.id;
                cTokenHistory.ctokenHistory = oldCToken;
                cTokenHistory.createdBy = operator.loginId;
                cTokenHistory.updatedBy = operator.loginId;
                await EntityOperation.insertCTokenHistory(transaction, cTokenHistory);
            } else {
                // 登録
                // CTokenの生成
                const cTokenSrc: string[] = [cmatrixHash];
                const cTokenHash = crypto.createHash('sha256').update(JSON.stringify(cTokenSrc), 'utf8').digest('hex');
                cTokenEntity = new CTokenEntity();
                cTokenEntity.pxrId = pxrId;
                cTokenEntity.ctoken = cTokenHash;
                cTokenEntity.createdBy = operator.loginId;
                cTokenEntity.updatedBy = operator.loginId;
            }
            cTokenEntity = await EntityOperation.insertOrUpdateCToken(transaction, cTokenEntity);

            if (cmatrix.document && Array.isArray(cmatrix.document) && cmatrix.document.length > 0) {
                // ドキュメント登録
                await this.insertRowHashDocument(cmatrix, transaction, cTokenEntity, operator, cmatrixHash);
            } else {
                // ドキュメントがなければ新規追加
                await this.insertCMatrixAndRows(transaction, operator, cTokenEntity, cmatrixHash, cmatrix);
            }
        }
    }

    /**
     * ドキュメント登録
     * @param cmatrix
     * @param transaction
     * @param cTokenEntity
     * @param operator
     * @param cmatrixHash
     */
    private static async insertRowHashDocument (cmatrix: CMatrix, transaction: EntityManager, cTokenEntity: CTokenEntity, operator: OperatorDomain, cmatrixHash: string) {
        let newCmatrix = null;
        for (const thing of cmatrix.thing) {
            // 既に登録済のrowHashか確認
            const targetRowHash = await EntityOperation.getRowHashByIdentifier(transaction, cTokenEntity.id, cmatrix.event.eventIdentifier, thing.thingIdentifier);
            if (targetRowHash) {
                // 登録済ならdocumentのみ追加
                for (const doc of cmatrix.document) {
                    const document = new DocumentEntity();
                    document.rowHashId = targetRowHash.id;
                    document.docIdentifier = doc.docIdentifier;
                    document.docCatalogCode = doc.docCatalogCode;
                    document.docCatalogVersion = doc.docCatalogVersion;
                    document.docCreateAt = doc.docCreateAt;
                    document.docActorCode = doc.docActorCode;
                    document.docActorVersion = doc.docActorVersion;
                    document.docWfCatalogCode = null;
                    document.docWfCatalogVersion = null;
                    document.docAppCatalogCode = doc.docAppCatalogCode ? doc.docAppCatalogCode : null;
                    document.docAppCatalogVersion = doc.docAppCatalogVersion ? doc.docAppCatalogVersion : null;
                    document.createdBy = operator.loginId;
                    document.updatedBy = operator.loginId;
                    await EntityOperation.insertDocument(transaction, document);
                }
            } else {
                // 未登録なら登録用Objectを生成して次へ
                if (!newCmatrix) {
                    newCmatrix = new CMatrix();
                    newCmatrix.userId = cmatrix.userId;
                    newCmatrix.document = cmatrix.document;
                    newCmatrix.event = cmatrix.event;
                    newCmatrix.thing = [];
                }
                newCmatrix.thing.push(thing);
            }
        }
        // 最後に未登録分があれば新規追加
        if (newCmatrix) {
            await this.insertCMatrixAndRows(transaction, operator, cTokenEntity, cmatrixHash, newCmatrix);
        }
    }

    // insertCMatrixAndRows
    private static async insertCMatrixAndRows (transaction: EntityManager, operator: OperatorDomain, cTokenEntity: CTokenEntity, cmatrixHash: string, cmatrix: CMatrix) {
        const cMatrixEntity = new CMatrixEntity();
        cMatrixEntity.ctokenId = cTokenEntity.id;
        cMatrixEntity.actorCatalogCode = operator.actorCode;
        cMatrixEntity.actorCatalogVersion = operator.actorVersion;
        cMatrixEntity.personIdentifier = cmatrix.userId;
        cMatrixEntity.cmatrixHash = cmatrixHash;
        cMatrixEntity.createdBy = operator.loginId;
        cMatrixEntity.updatedBy = operator.loginId;
        cMatrixEntity.rowHashs = [];
        const documents: DocumentEntity[] = [];
        if (cmatrix.document && Array.isArray(cmatrix.document) && cmatrix.document.length > 0) {
            for (const doc of cmatrix.document) {
                const document = new DocumentEntity();
                document.docIdentifier = doc.docIdentifier;
                document.docCatalogCode = doc.docCatalogCode;
                document.docCatalogVersion = doc.docCatalogVersion;
                document.docCreateAt = doc.docCreateAt;
                document.docActorCode = doc.docActorCode;
                document.docActorVersion = doc.docActorVersion;
                document.docWfCatalogCode = null;
                document.docWfCatalogVersion = null;
                document.docAppCatalogCode = doc.docAppCatalogCode ? doc.docAppCatalogCode : null;
                document.docAppCatalogVersion = doc.docAppCatalogVersion ? doc.docAppCatalogVersion : null;
                document.createdBy = operator.loginId;
                document.updatedBy = operator.loginId;
                documents.push(document);
            }
        }
        for (const thing of cmatrix.thing) {
            const rowHash = new RowHashEntity();
            rowHash.eventIdentifier = cmatrix.event.eventIdentifier;
            rowHash.eventCatalogCode = cmatrix.event.eventCatalogCode;
            rowHash.eventCatalogVersion = cmatrix.event.eventCatalogVersion;
            rowHash.eventStartAt = cmatrix.event.eventStartAt;
            rowHash.eventEndAt = cmatrix.event.eventEndAt;
            rowHash.eventActorCode = cmatrix.event.eventActorCode;
            rowHash.eventActorVersion = cmatrix.event.eventActorVersion;
            rowHash.eventWfCatalogCode = null;
            rowHash.eventWfCatalogVersion = null;
            rowHash.eventAppCatalogCode = cmatrix.event.eventAppCatalogCode;
            rowHash.eventAppCatalogVersion = cmatrix.event.eventAppCatalogVersion;
            rowHash.thingIdentifier = thing.thingIdentifier;
            rowHash.thingCatalogCode = thing.thingCatalogCode;
            rowHash.thingCatalogVersion = thing.thingCatalogVersion;
            rowHash.thingActorCode = thing.thingActorCode;
            rowHash.thingActorVersion = thing.thingActorVersion;
            rowHash.thingWfCatalogCode = null;
            rowHash.thingWfCatalogVersion = null;
            rowHash.thingAppCatalogCode = thing.thingAppCatalogCode;
            rowHash.thingAppCatalogVersion = thing.thingAppCatalogVersion;
            rowHash.rowHash = thing.rowHash;
            rowHash.rowHashCreateAt = thing.rowHashCreateAt;
            rowHash.createdBy = operator.loginId;
            rowHash.updatedBy = operator.loginId;
            rowHash.documents = documents;
            cMatrixEntity.rowHashs.push(rowHash);
        }
        await EntityOperation.insertCMatrixAndRows(transaction, cMatrixEntity);
    }

    /**
     * 更新
     * @param transaction
     * @param operator
     * @param books
     * @param update
     *
     * RefactorDescription:
     *  #3814 : updateRowHashDocument
     */
    private static async updateRowHash (transaction: EntityManager, operator: OperatorDomain, books: any, update: CMatrix[]) {
        // リクエストをループさせる
        for (const updateCmatrix of update) {
            // PXR-IDの特定
            const pxrId = this.getPxrId(books, updateCmatrix);

            // PXR-IDでのCToken検索
            const cToken: CTokenEntity = await EntityOperation.getCTokenByPxrId(transaction, pxrId);

            // 更新対象の取得条件
            const docIdentifier: string[] = [];
            const eventIdentifier: string[] = [];
            const thingIdentifier: string[] = [];
            eventIdentifier.push(updateCmatrix.event.eventIdentifier);
            for (const updateThing of updateCmatrix.thing) {
                thingIdentifier.push(updateThing.thingIdentifier);
            }
            for (const updateDocument of updateCmatrix.document) {
                docIdentifier.push(updateDocument.docIdentifier);
            }

            // 更新対象の CMatrix を取得
            const cmatrixs = await EntityOperation.getCMatrixByIdentifier(transaction, cToken.id, docIdentifier, eventIdentifier, thingIdentifier);

            for (let cmatrix of cmatrixs) {
                // 配下の rowhash をすべて含めて再取得
                cmatrix = await EntityOperation.getCMatrixById(transaction, cmatrix.id);

                // ドキュメント更新
                await this.updateRowHashDocument(cmatrix, updateCmatrix, operator, transaction);

                // rowHashの件数を確認する
                const cmatrixHashSrc: string[] = [];
                for (const rowHash of cmatrix.rowHashs) {
                    cmatrixHashSrc.push(rowHash.rowHash);
                }
                // cmatrixを作成しctokenを更新
                const cmatrixHash = crypto.createHash('sha256').update(JSON.stringify(cmatrixHashSrc), 'utf8').digest('hex');
                const oldCToken = cToken.ctoken;
                const cTokenSrc: string[] = [];
                cTokenSrc.push(oldCToken);
                cTokenSrc.push(cmatrixHash);
                const cTokenHash = crypto.createHash('sha256').update(JSON.stringify(cTokenSrc), 'utf8').digest('hex');
                cToken.ctoken = cTokenHash;
                cToken.updatedBy = operator.loginId;
                const cTokenHistory = new CTokenHistoryEntity();
                cTokenHistory.ctokenId = cToken.id;
                cTokenHistory.ctokenHistory = oldCToken;
                cTokenHistory.createdBy = operator.loginId;
                cTokenHistory.updatedBy = operator.loginId;
                await EntityOperation.updateCMatrixHash(transaction, cmatrix.id, cmatrixHash, operator);
                await EntityOperation.insertCTokenHistory(transaction, cTokenHistory);
                await EntityOperation.insertOrUpdateCToken(transaction, cToken);
            }
        }
    }

    /**
     * ドキュメント更新
     * @param cmatrix
     * @param updateCmatrix
     * @param operator
     * @param transaction
     */
    private static async updateRowHashDocument (cmatrix: CMatrixEntity, updateCmatrix: CMatrix, operator: OperatorDomain, transaction: EntityManager) {
        for (const rowHash of cmatrix.rowHashs) {
            for (const updateThing of updateCmatrix.thing) {
                if (rowHash.eventIdentifier === updateCmatrix.event.eventIdentifier && rowHash.thingIdentifier === updateThing.thingIdentifier) {
                    // rowHashの更新を行う
                    rowHash.eventCatalogCode = updateCmatrix.event.eventCatalogCode;
                    rowHash.eventCatalogVersion = updateCmatrix.event.eventCatalogVersion;
                    rowHash.eventStartAt = updateCmatrix.event.eventStartAt;
                    rowHash.eventEndAt = updateCmatrix.event.eventEndAt;
                    rowHash.eventActorCode = updateCmatrix.event.eventActorCode;
                    rowHash.eventActorVersion = updateCmatrix.event.eventActorVersion;
                    rowHash.eventAppCatalogCode = updateCmatrix.event.eventAppCatalogCode;
                    rowHash.eventAppCatalogVersion = updateCmatrix.event.eventAppCatalogVersion;
                    rowHash.thingCatalogCode = updateThing.thingCatalogCode;
                    rowHash.thingCatalogVersion = updateThing.thingCatalogVersion;
                    rowHash.thingActorCode = updateThing.thingActorCode;
                    rowHash.thingActorVersion = updateThing.thingActorVersion;
                    rowHash.thingAppCatalogCode = updateThing.thingAppCatalogCode;
                    rowHash.thingAppCatalogVersion = updateThing.thingAppCatalogVersion;
                    rowHash.rowHash = updateThing.rowHash;
                    rowHash.rowHashCreateAt = updateThing.rowHashCreateAt;
                    rowHash.updatedBy = operator.loginId;
                    await EntityOperation.updateRowHash(transaction, rowHash);
                }
                // 紐づくdocumentも更新を行う
                for (const document of rowHash.documents) {
                    for (const updateDocument of updateCmatrix.document) {
                        if (document.docIdentifier === updateDocument.docIdentifier) {
                            // documentの更新を行う
                            document.docCatalogCode = updateDocument.docCatalogCode;
                            document.docCatalogVersion = updateDocument.docCatalogVersion;
                            document.docCreateAt = updateDocument.docCreateAt;
                            document.docActorCode = updateDocument.docActorCode;
                            document.docActorVersion = updateDocument.docActorVersion;
                            document.docAppCatalogCode = updateDocument.docAppCatalogCode;
                            document.docAppCatalogVersion = updateDocument.docAppCatalogVersion;
                            document.updatedBy = operator.loginId;
                            await EntityOperation.updateDocument(transaction, document);
                        }
                    }
                }
            }
        }
    }

    /**
     * 削除
     * @param transaction
     * @param operator
     * @param books
     * @param del
     *
     * RefactorDescription:
     *  #3814 : deleteRowHashDocument
     */
    private static async deleteCMatrix (transaction: EntityManager, operator: OperatorDomain, books: any, del: CMatrixForDelete[]) {
        // リクエストをループさせる
        for (const delCmatrix of del) {
            // PXR-IDの特定
            const pxrId = this.getPxrId(books, delCmatrix);

            // PXR-IDでのCToken検索
            const cToken: CTokenEntity = await EntityOperation.getCTokenByPxrId(transaction, pxrId);
            if (!cToken) {
                continue;
            }

            // 更新対象の取得条件
            const docIdentifier: string[] = [];
            const eventIdentifier: string[] = [];
            const thingIdentifier: string[] = [];
            eventIdentifier.push(delCmatrix.event.eventIdentifier);
            for (const updateThing of delCmatrix.thing) {
                thingIdentifier.push(updateThing.thingIdentifier);
            }
            for (const updateDocument of delCmatrix.document) {
                docIdentifier.push(updateDocument.docIdentifier);
            }

            // 更新対象の CMatrix を取得
            const cmatrixs = await EntityOperation.getCMatrixByIdentifier(transaction, cToken.id, docIdentifier, eventIdentifier, thingIdentifier);

            for (let cmatrix of cmatrixs) {
                // 配下の rowhash をすべて含めて再取得
                cmatrix = await EntityOperation.getCMatrixById(transaction, cmatrix.id);

                // ドキュメント削除
                await this.deleteRowHashDocument(cmatrix, delCmatrix, transaction, operator);

                // rowHashの件数を確認する
                const cmatrixHashSrc: string[] = [];
                for (const rowHash of cmatrix.rowHashs) {
                    if (rowHash.isDisabled === false) {
                        cmatrixHashSrc.push(rowHash.rowHash);
                    }
                }
                // 1件以上あるのであれば、それでcmatrixを作成しctokenを更新
                if (cmatrixHashSrc.length > 0) {
                    const cmatrixHash = crypto.createHash('sha256').update(JSON.stringify(cmatrixHashSrc), 'utf8').digest('hex');
                    const oldCToken = cToken.ctoken;
                    const cTokenSrc: string[] = [];
                    cTokenSrc.push(oldCToken);
                    cTokenSrc.push(cmatrixHash);
                    const cTokenHash = crypto.createHash('sha256').update(JSON.stringify(cTokenSrc), 'utf8').digest('hex');
                    cToken.ctoken = cTokenHash;
                    cToken.updatedBy = operator.loginId;
                    const cTokenHistory = new CTokenHistoryEntity();
                    cTokenHistory.ctokenId = cToken.id;
                    cTokenHistory.ctokenHistory = oldCToken;
                    cTokenHistory.createdBy = operator.loginId;
                    cTokenHistory.updatedBy = operator.loginId;
                    await EntityOperation.updateCMatrixHash(transaction, cmatrix.id, cmatrixHash, operator);
                    await EntityOperation.insertCTokenHistory(transaction, cTokenHistory);
                    await EntityOperation.insertOrUpdateCToken(transaction, cToken);
                } else {
                    // 0件であれば、そのcmatrixでctokenを更新し、cmatrixを削除
                    const oldCToken = cToken.ctoken;
                    const cTokenSrc: string[] = [];
                    cTokenSrc.push(oldCToken);
                    cTokenSrc.push(cmatrix.cmatrixHash);
                    const cTokenHash = crypto.createHash('sha256').update(JSON.stringify(cTokenSrc), 'utf8').digest('hex');
                    cToken.ctoken = cTokenHash;
                    cToken.updatedBy = operator.loginId;
                    const cTokenHistory = new CTokenHistoryEntity();
                    cTokenHistory.ctokenId = cToken.id;
                    cTokenHistory.ctokenHistory = oldCToken;
                    cTokenHistory.createdBy = operator.loginId;
                    cTokenHistory.updatedBy = operator.loginId;
                    await EntityOperation.deleteCMatrix(transaction, cmatrix.id, operator);
                    await EntityOperation.insertCTokenHistory(transaction, cTokenHistory);
                    await EntityOperation.insertOrUpdateCToken(transaction, cToken);
                }
            }
        }
    }

    /**
     * ドキュメント削除
     * @param cmatrix
     * @param delCmatrix
     * @param transaction
     * @param operator
     */
    private static async deleteRowHashDocument (cmatrix: CMatrixEntity, delCmatrix: CMatrixForDelete, transaction: EntityManager, operator: OperatorDomain) {
        for (const rowHash of cmatrix.rowHashs) {
            for (const delThing of delCmatrix.thing) {
                if (rowHash.eventIdentifier === delCmatrix.event.eventIdentifier && rowHash.thingIdentifier === delThing.thingIdentifier) {
                    // rowHashの削除を行う
                    await EntityOperation.deleteRowHash(transaction, rowHash.id, operator);
                    rowHash.isDisabled = true;
                }
                // 紐づくdocumentも削除を行う
                for (const document of rowHash.documents) {
                    for (const delDocument of delCmatrix.document) {
                        if (document.docIdentifier === delDocument.docIdentifier) {
                            // documentの削除を行う
                            await EntityOperation.deleteDocument(transaction, document.id, operator);
                            document.isDisabled = true;
                        }
                    }
                }
            }
        }
    }
}
