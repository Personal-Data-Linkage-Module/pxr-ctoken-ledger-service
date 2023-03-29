/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import supertest = require('supertest');
import { connectDatabase } from '../common/Connection';
import { Application } from '../resources/config/Application';
import { OperatorServer, CtokenLedgerServer, CatalogServer, MyConditionBookManageServer } from './StubServer';
import { clear } from './testDatabase';
import { insertInitialData } from './testDatabase';
import { Request } from './Request';
import { Session } from './Session';
import Config from '../common/Config';
/* eslint-enable */
const Message = Config.ReadConfig('./config/message.json');

// 対象アプリケーションを取得
const app = new Application();
const expressApp = app.express.app;

// Unit対象のURL（ベース）
const baseURI = '/ctoken-ledger';

// スタブサーバー（オペレータサービス）
let _operatorServer: OperatorServer = null;

// スタブサーバー（CToken台帳サービス）
let _ctokenLedgerServer: CtokenLedgerServer = null;

// スタブサーバー（カタログサービス）
let _catalogServer: CatalogServer = null;

// スタブサーバー（book管理サービス）
let _myConditionBookManageServer: MyConditionBookManageServer = null;

// Ctoken-Ledger Serviceのユニットテスト
describe('Ctoken-Ledger Service', () => {
    beforeAll(async () => {
        // サーバを起動
        app.start();
        await clear();
        await insertInitialData();
    });
    afterAll(async () => {
        // サーバ停止
        app.stop();
    });
    /**
     * 各テスト実行の後処理
     */
    afterEach(async () => {
        if (_operatorServer) {
            _operatorServer.server.close();
            _operatorServer = null;
        }
        if (_ctokenLedgerServer) {
            _ctokenLedgerServer.server.close();
            _ctokenLedgerServer = null;
        }
        if (_catalogServer) {
            _catalogServer.server.close();
            _catalogServer = null;
        }
        if (_myConditionBookManageServer) {
            _myConditionBookManageServer.server.close();
            _myConditionBookManageServer = null;
        }
    });
    describe('CToken取得API POST: ' + baseURI, () => {
        test('正常: データ無し', async () => {
            // テストデータ準備
            const connection = await connectDatabase();
            await connection.query(`
                UPDATE pxr_ctoken_ledger.document
                SET is_disabled = true
                ;
                UPDATE pxr_ctoken_ledger.row_hash
                SET is_disabled = true
                ;
            `);
            _catalogServer = new CatalogServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.SearchEventAll);

            // テストデータ戻し
            await connection.query(`
                UPDATE pxr_ctoken_ledger.document
                SET is_disabled = false
                ;
                UPDATE pxr_ctoken_ledger.row_hash
                SET is_disabled = false
                ;
                `);

            try {
                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    event: []
                });
            } catch (err) {
                console.log(response.body);
                throw err;
            }
        });
        test('正常: 取得(個人、イベント指定なし)', async () => {
            _catalogServer = new CatalogServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRootInd) })
                .send(Request.SearchEventAll);

            try {
                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    event: [{
                        actor: { _value: 1000004, _ver: 1 },
                        app: { _value: 1000007, _ver: 1 },
                        createdAt: '2020-02-19T15:00:00.000+0900',
                        code: { _value: 1000005, _ver: 1 },
                        identifier: 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                    }]
                });
            } catch (err) {
                console.log(response.body);
                throw err;
            }
        });
        test('正常: 取得(個人_ドキュメント)', async () => {
            _catalogServer = new CatalogServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRootInd) })
                .send(Request.SearchDocumentSingle);

            try {
                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    document: [{
                        actor: { _value: 1000004, _ver: 1 },
                        app: { _value: 1000007, _ver: 1 },
                        createdAt: '2020-02-19T15:00:00.000+0900',
                        code: { _value: 1000004, _ver: 1 },
                        identifier: 'aaaa7e44-219e-4bbf-af4a-7589f8702d96'
                    }]
                });
            } catch (err) {
                console.log(response.body);
                throw err;
            }
        });
        test('正常: 取得(個人_ドキュメント_ID)', async () => {
            _catalogServer = new CatalogServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRootInd) })
                .send(Request.SearchDocumentId);

            try {
                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    document: [{
                        actor: { _value: 1000004, _ver: 1 },
                        app: { _value: 1000007, _ver: 1 },
                        createdAt: '2020-02-19T15:00:00.000+0900',
                        code: { _value: 1000004, _ver: 1 },
                        identifier: 'aaaa7e44-219e-4bbf-af4a-7589f8702d96'
                    }]
                });
            } catch (err) {
                console.log(response.body);
                throw err;
            }
        });
        test('正常: 取得(個人_ドキュメント、createAtがnull)', async () => {
            _catalogServer = new CatalogServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRootInd) })
                .send(Request.SearchCreateAtNullDocument);

            try {
                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    document: [{
                        actor: { _value: 1000004, _ver: 1 },
                        app: { _value: 1000007, _ver: 1 },
                        createdAt: '2020-02-19T15:00:00.000+0900',
                        code: { _value: 1000004, _ver: 1 },
                        identifier: 'aaaa7e44-219e-4bbf-af4a-7589f8702d96'
                    }]
                });
            } catch (err) {
                console.log(response.body);
                throw err;
            }
        });
        test('正常: 取得(個人_イベント)', async () => {
            _catalogServer = new CatalogServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRootInd) })
                .send(Request.SearchEventAll);

            try {
                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    event: [{
                        actor: { _value: 1000004, _ver: 1 },
                        app: { _value: 1000007, _ver: 1 },
                        createdAt: '2020-02-19T15:00:00.000+0900',
                        code: { _value: 1000005, _ver: 1 },
                        identifier: 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                    }]
                });
            } catch (err) {
                console.log(response.body);
                throw err;
            }
        });
        test('正常: 取得(個人_イベント_ID)', async () => {
            _catalogServer = new CatalogServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRootInd) })
                .send(Request.SearchEventId);

            try {
                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    event: [{
                        actor: { _value: 1000004, _ver: 1 },
                        app: { _value: 1000007, _ver: 1 },
                        createdAt: '2020-02-19T15:00:00.000+0900',
                        code: { _value: 1000005, _ver: 1 },
                        identifier: 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                    }]
                });
            } catch (err) {
                console.log(response.body);
                throw err;
            }
        });
        test('正常: 取得(個人_イベント、createAtがnull)', async () => {
            _catalogServer = new CatalogServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRootInd) })
                .send(Request.SearchCreateAtNullEvent);

            try {
                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    event: [{
                        actor: { _value: 1000004, _ver: 1 },
                        app: { _value: 1000007, _ver: 1 },
                        createdAt: '2020-02-19T15:00:00.000+0900',
                        code: { _value: 1000005, _ver: 1 },
                        identifier: 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                    }]
                });
            } catch (err) {
                console.log(response.body);
                throw err;
            }
        });
        test('正常: 取得(個人_モノ)', async () => {
            _catalogServer = new CatalogServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRootInd) })
                .send(Request.SearchThingSingle);

            try {
                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    thing: [{
                        actor: { _value: 1000004, _ver: 1 },
                        app: { _value: 1000007, _ver: 1 },
                        createdAt: '2020-02-19T15:00:00.000+0900',
                        code: { _value: 1000006, _ver: 1 },
                        identifier: '667459ed-81aa-4226-8b3d-2decb7db2911'
                    }]
                });
            } catch (err) {
                console.log(response.body);
                throw err;
            }
        });
        test('正常: 取得(個人_モノ_ID)', async () => {
            _catalogServer = new CatalogServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRootInd) })
                .send(Request.SearchThingId);

            try {
                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    thing: [{
                        actor: { _value: 1000004, _ver: 1 },
                        app: { _value: 1000007, _ver: 1 },
                        createdAt: '2020-02-19T15:00:00.000+0900',
                        code: { _value: 1000006, _ver: 1 },
                        identifier: '667459ed-81aa-4226-8b3d-2decb7db2911'
                    }]
                });
            } catch (err) {
                console.log(response.body);
                throw err;
            }
        });
        test('正常: 取得(個人_モノ、createAtがnull)', async () => {
            _catalogServer = new CatalogServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRootInd) })
                .send(Request.SearchCreateAtNullThing);

            try {
                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    thing: [{
                        actor: { _value: 1000004, _ver: 1 },
                        app: { _value: 1000007, _ver: 1 },
                        createdAt: '2020-02-19T15:00:00.000+0900',
                        code: { _value: 1000006, _ver: 1 },
                        identifier: '667459ed-81aa-4226-8b3d-2decb7db2911'
                    }]
                });
            } catch (err) {
                console.log(response.body);
                throw err;
            }
        });
        test('正常: 取得、document, event, thingいずれも指定なし', async () => {
            // バグの場合異常系にする。
            _catalogServer = new CatalogServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.Search);

            try {
                expect(response.status).toBe(200);
                expect(response.body).toEqual({});
            } catch (err) {
                console.log(response.body);
                throw err;
            }
        });
        test('正常: 取得（領域運営の場合）', async () => {
            _catalogServer = new CatalogServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.regionRoot) })
                .send(Request.SearchEventAll);

            try {
                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    event: [
                        {
                            actor: { _value: 1000005, _ver: 1 },
                            app: { _value: 1000007, _ver: 1 },
                            createdAt: '2020-02-19T15:00:00.000+0900',
                            code: { _value: 1000005, _ver: 1 },
                            identifier: 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                        }
                    ]
                });
            } catch (err) {
                console.log(response.body);
                throw err;
            }
        });
        test('正常: 取得（ドキュメント）', async () => {
            _catalogServer = new CatalogServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.SearchDocumentSingle);

            try {
                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    document: [
                        {
                            actor: { _value: 1000004, _ver: 1 },
                            app: { _value: 1000007, _ver: 1 },
                            createdAt: '2020-02-19T15:00:00.000+0900',
                            code: { _value: 1000004, _ver: 1 },
                            identifier: 'aaaa7e44-219e-4bbf-af4a-7589f8702d96'
                        }
                    ]
                });
            } catch (err) {
                console.log(response.body);
                throw err;
            }
        });
        test('正常: 取得（イベント）', async () => {
            _catalogServer = new CatalogServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.SearchEventSingle);

            try {
                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    event: [
                        {
                            actor: { _value: 1000004, _ver: 1 },
                            app: { _value: 1000007, _ver: 1 },
                            createdAt: '2020-02-19T15:00:00.000+0900',
                            code: { _value: 1000005, _ver: 1 },
                            identifier: 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                        }
                    ]
                });
            } catch (err) {
                console.log(response.body);
                throw err;
            }
        });
        test('正常: 取得（モノ）', async () => {
            _catalogServer = new CatalogServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.SearchThingSingle);

            try {
                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    thing: [{
                        actor: { _value: 1000004, _ver: 1 },
                        app: { _value: 1000007, _ver: 1 },
                        createdAt: '2020-02-19T15:00:00.000+0900',
                        code: { _value: 1000006, _ver: 1 },
                        identifier: '667459ed-81aa-4226-8b3d-2decb7db2911'
                    }]
                });
            } catch (err) {
                console.log(response.body);
                throw err;
            }
        });
        test('正常: Cookie（個人）', async () => {
            _catalogServer = new CatalogServer(200);
            _operatorServer = new OperatorServer(200, 0);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type0_session=' + '5b4fcfb619a4fd3215e3582412eecfd5ab7e06eb112c52402805a730e8737899'])
                .send(Request.SearchEventAll);

            try {
                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    event: [
                        {
                            actor: { _value: 1000004, _ver: 1 },
                            app: { _value: 1000007, _ver: 1 },
                            createdAt: '2020-02-19T15:00:00.000+0900',
                            code: { _value: 1000005, _ver: 1 },
                            identifier: 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                        },
                        {
                            actor: { _value: 1000005, _ver: 1 },
                            app: { _value: 1000007, _ver: 1 },
                            createdAt: '2020-02-19T15:00:00.000+0900',
                            code: { _value: 1000005, _ver: 1 },
                            identifier: 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                        },
                        {
                            actor: { _value: 1000010, _ver: 1 },
                            app: { _value: 1000007, _ver: 1 },
                            createdAt: '2020-02-19T15:00:00.000+0900',
                            code: { _value: 1000005, _ver: 1 },
                            identifier: 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                        }
                    ]
                });
            } catch (err) {
                console.log(response.body);
                throw err;
            }
        });
        test('正常: Cookie（アプリケーション）', async () => {
            _catalogServer = new CatalogServer(200);
            _operatorServer = new OperatorServer(200, 2);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '5b4fcfb619a4fd3215e3582412eecfd5ab7e06eb112c52402805a730e8737899'])
                .send(Request.SearchEventAll);

            try {
                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    event: [
                        {
                            actor: { _value: 1000004, _ver: 1 },
                            app: { _value: 1000007, _ver: 1 },
                            createdAt: '2020-02-19T15:00:00.000+0900',
                            code: { _value: 1000005, _ver: 1 },
                            identifier: 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                        }
                    ]
                });
            } catch (err) {
                console.log(response.body);
                throw err;
            }
        });
        test('正常: Cookie（運営メンバー）', async () => {
            _catalogServer = new CatalogServer(200);
            _operatorServer = new OperatorServer(200, 3);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d'])
                .send(Request.SearchEventAll);

            try {
                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    event: [
                        {
                            actor: { _value: 1000004, _ver: 1 },
                            app: { _value: 1000007, _ver: 1 },
                            createdAt: '2020-02-19T15:00:00.000+0900',
                            code: { _value: 1000005, _ver: 1 },
                            identifier: 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                        },
                        {
                            actor: { _value: 1000005, _ver: 1 },
                            app: { _value: 1000007, _ver: 1 },
                            createdAt: '2020-02-19T15:00:00.000+0900',
                            code: { _value: 1000005, _ver: 1 },
                            identifier: 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                        },
                        {
                            actor: { _value: 1000010, _ver: 1 },
                            app: { _value: 1000007, _ver: 1 },
                            createdAt: '2020-02-19T15:00:00.000+0900',
                            code: { _value: 1000005, _ver: 1 },
                            identifier: 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                        }
                    ]
                });
            } catch (err) {
                console.log(response.body);
                throw err;
            }
        });
        test('正常: PxrId指定', async () => {
            _catalogServer = new CatalogServer(200);
            _operatorServer = new OperatorServer(200, 1);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '5b4fcfb619a4fd3215e3582412eecfd5ab7e06eb112c52402805a730e8737899'])
                .send(Request.SearchPxrIdAllEvent);

            try {
                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    event: [
                        {
                            actor: { _value: 1000004, _ver: 1 },
                            app: { _value: 1000007, _ver: 1 },
                            createdAt: '2020-02-19T15:00:00.000+0900',
                            code: { _value: 1000005, _ver: 1 },
                            identifier: 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                        },
                        {
                            actor: { _value: 1000005, _ver: 1 },
                            app: { _value: 1000007, _ver: 1 },
                            createdAt: '2020-02-19T15:00:00.000+0900',
                            code: { _value: 1000005, _ver: 1 },
                            identifier: 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                        },
                        {
                            actor: { _value: 1000010, _ver: 1 },
                            app: { _value: 1000007, _ver: 1 },
                            createdAt: '2020-02-19T15:00:00.000+0900',
                            code: { _value: 1000005, _ver: 1 },
                            identifier: 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                        }
                    ]
                });
            } catch (err) {
                console.log(response.body);
                throw err;
            }
        });
        test('異常: 取得（該当アクターなし）', async () => {
            _catalogServer = new CatalogServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.notActor) })
                .send(Request.SearchDocument);

            try {
                expect(response.status).toBe(400);
                expect(response.body.message).toBe(Message.NOT_TARGET_ACTOR);
            } catch (err) {
                console.log(response.body);
                throw err;
            }
        });
        test('異常: 取得(個人、pxrIdあり)', async () => {
            _operatorServer = new OperatorServer(200, 1);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRootInd) })
                .send(Request.SearchPxrId);

            try {
                expect(response.status).toBe(400);
                expect(response.body.message).toBe(Message.SPECIFY_NOT_PXRID);
            } catch (err) {
                console.log(response.body);
                throw err;
            }
        });
        test('異常: 取得（領域運営の場合）、app-alliance が空集合のカタログ', async () => {
            _catalogServer = new CatalogServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.regionRootInvalidRegionCatalog) })
                .send(Request.SearchEventAll);

            try {
                expect(response.status).toBe(400);
                expect(response.body.message).toBe(Message.FAILED_MAKE_SERVICE_PROVIDER_LIST);
            } catch (err) {
                console.log(response.body);
                throw err;
            }
        });
        test('異常: 未ログイン', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .send(Request.Search);

            try {
                expect(response.status).toBe(401);
                expect(response.body.message).toBe(Message.NOT_AUTHORIZED);
            } catch (err) {
                console.log(response.body);
                throw err;
            }
        });
        test('異常: オペレーターサービスからの応答が204', async () => {
            _operatorServer = new OperatorServer(204, 1);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '5b4fcfb619a4fd3215e3582412eecfd5ab7e06eb112c52402805a730e8737899'])
                .send(Request.Search);

            try {
                expect(response.status).toBe(401);
                expect(response.body.message).toBe(Message.NOT_AUTHORIZED);
            } catch (err) {
                console.log(response.body);
                throw err;
            }
        });
        test('異常: オペレーターサービスからの応答が400', async () => {
            _operatorServer = new OperatorServer(400, 1);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '5b4fcfb619a4fd3215e3582412eecfd5ab7e06eb112c52402805a730e8737899'])
                .send(Request.Search);

            try {
                expect(response.status).toBe(401);
                expect(response.body.message).toBe(Message.NOT_AUTHORIZED);
            } catch (err) {
                console.log(response.body);
                throw err;
            }
        });
        test('異常: オペレーターサービスからの応答が500', async () => {
            _operatorServer = new OperatorServer(500, 1);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '5b4fcfb619a4fd3215e3582412eecfd5ab7e06eb112c52402805a730e8737899'])
                .send(Request.Search);

            try {
                expect(response.status).toBe(500);
                expect(response.body.message).toBe(Message.FAILED_TAKE_SESSION);
            } catch (err) {
                console.log(response.body);
                throw err;
            }
        });
        test('異常: オペレーターサービスとの接続に失敗', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '5b4fcfb619a4fd3215e3582412eecfd5ab7e06eb112c52402805a730e8737899'])
                .send(Request.Search);

            try {
                expect(response.status).toBe(500);
                expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_OPERATOR);
            } catch (err) {
                console.log(response.body);
                throw err;
            }
        });
        test('異常: リクエストボディが空', async () => {
            _catalogServer = new CatalogServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) });

            try {
                expect(response.status).toBe(400);
                expect(response.body.message).toBe(Message.REQUEST_IS_EMPTY);
            } catch (err) {
                console.log(response.body);
                throw err;
            }
        });
        test('異常: データ無し（ステータスコード:400）', async () => {
            _catalogServer = new CatalogServer(400);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.Search);

            try {
                expect(response.status).toBe(400);
                expect(response.body.message).toBe(Message.FAILED_GET_CATALOG);
            } catch (err) {
                console.log(response.body);
                throw err;
            }
        });
        test('異常: データ無し（ステータスコード:503）', async () => {
            _catalogServer = new CatalogServer(500);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.Search);

            try {
                expect(response.status).toBe(503);
                expect(response.body.message).toBe(Message.FAILED_GET_CATALOG);
            } catch (err) {
                console.log(response.body);
                throw err;
            }
        });
        test('異常: データ無し（ステータスコード:204）', async () => {
            _catalogServer = new CatalogServer(204);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.Search);

            try {
                expect(response.status).toBe(401);
                expect(response.body.message).toBe(Message.FAILED_GET_CATALOG);
            } catch (err) {
                console.log(response.body);
                throw err;
            }
        });
        test('異常: サービスへの接続に失敗', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.Search);

            try {
                expect(response.status).toBe(503);
                expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_CATALOG);
            } catch (err) {
                console.log(response.body);
                throw err;
            }
        });
    });
});
