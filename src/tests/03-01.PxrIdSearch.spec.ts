/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import supertest = require('supertest');
import { connectDatabase } from '../common/Connection';
import { Application } from '../resources/config/Application';
import { OperatorServer, CtokenLedgerServer, MyConditionBookManageServer, CatalogServer } from './StubServer';
import { clear } from './testDatabase';
import { insertInitialData } from './testDatabase';
import { Request } from './Request';
import { Session } from './Session';
import Config from '../common/Config';
/* eslint-enable */
// const Message = Config.ReadConfig('./config/message.json');
const Message = Config.ReadConfig('./config/message.json');

// 対象アプリケーションを取得
const app = new Application();
const expressApp = app.express.app;

// Unit対象のURL（ベース）
const baseURI = '/ctoken-ledger/search';

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
        if (_myConditionBookManageServer) {
            _myConditionBookManageServer.server.close();
            _myConditionBookManageServer = null;
        }
        if (_catalogServer) {
            _catalogServer.server.close();
            _catalogServer = null;
        }
    });

    describe('PXR-ID検索API POST: ' + baseURI, () => {
        test('正常: AND検索', async () => {
            _catalogServer = new CatalogServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.SearchPxrIdAnd);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([
                {
                    pxrId: 'wf-pj2-2-test-01',
                    ctokens: [
                        {
                            actor: { _value: 1000004 },
                            data: [
                                { _code: { _value: 1000004, _ver: 1 }, count: 1 },
                                { _code: { _value: 1000005, _ver: 1 }, count: 1 },
                                { _code: { _value: 1000006, _ver: 1 }, count: 1 }
                            ]
                        }
                    ]
                }
            ]);
        });
        test('正常: OR検索', async () => {
            _catalogServer = new CatalogServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.SearchPxrIdOr);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([
                {
                    pxrId: 'wf-pj2-2-test-01',
                    ctokens: [
                        {
                            actor: { _value: 1000004 },
                            data: [
                                { _code: { _value: 1000004, _ver: 1 }, count: 1 },
                                { _code: { _value: 1000005, _ver: 1 }, count: 1 },
                                { _code: { _value: 1000006, _ver: 1 }, count: 1 }
                            ]
                        }
                    ]
                }
            ]);
        });
        test('正常: OR検索、異なるactor のcToken 取得', async () => {
            _catalogServer = new CatalogServer(200);
            // データ準備
            const connection = await connectDatabase();
            await connection.query(`
                INSERT INTO pxr_ctoken_ledger.row_hash
                (
                    cmatrix_id, "3_1_1", "3_1_2_1", "3_1_2_2", "3_2_1", "3_2_2", "3_5_1_1", "3_5_1_2", "3_5_2_1", "3_5_2_2", "3_5_5_1", "3_5_5_2",
                    "4_1_1", "4_1_2_1", "4_1_2_2", "4_4_1_1", "4_4_1_2", "4_4_2_1", "4_4_2_2", "4_4_5_1", "4_4_5_2",
                    row_hash, row_hash_create_at,
                    is_disabled, created_by, created_at, updated_by, updated_at
                )
                VALUES
                (
                    1, 'd1da7e44-219e-4bbf-af4a-7589f8702d96', 1000005, 2, '2020-02-19 15:00:00', '2020-02-20 15:00:00', 1000004, 1, 1000007, 1, null, null,
                    '667459ed-81aa-4226-8b3d-2decb7db2911', 1000006, 2, 2000004, 1, 1000007, 1, null, null,
                    '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d', '2020-09-06 22:29:17',
                     'false', 'pxr_user', NOW(), 'pxr_user', NOW()
                )
            `);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.SearchPxrIdOr);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([
                {
                    pxrId: 'wf-pj2-2-test-01',
                    ctokens: [
                        {
                            actor: { _value: 1000004 },
                            data: [
                                { _code: { _value: 1000004, _ver: 1 }, count: 1 },
                                { _code: { _value: 1000005, _ver: 1 }, count: 1 },
                                { _code: { _value: 1000006, _ver: 1 }, count: 1 }
                            ]
                        }
                    ]
                }
            ]);
        });
        test('正常: OR検索_最小値判定', async () => {
            _catalogServer = new CatalogServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.SearchPxrIdOrMin);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
        test('正常: OR検索_最大値判定', async () => {
            _catalogServer = new CatalogServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.SearchPxrIdOrMax);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([
                {
                    pxrId: 'wf-pj2-2-test-01',
                    ctokens: [
                        {
                            actor: { _value: 1000004 },
                            data: [
                                { _code: { _value: 1000004, _ver: 1 }, count: 1 }
                            ]
                        }
                    ]
                }
            ]);
        });
        test('正常: OR検索_最大値超過', async () => {
            // データ準備
            const connection = await connectDatabase();
            await connection.query(`
                INSERT INTO pxr_ctoken_ledger.document
                (
                    row_hash_id, _1_1, _1_2_1, _1_2_2, _2_1, _3_1_1, _3_1_2, _3_2_1, _3_2_2, _3_5_1, _3_5_2,
                    is_disabled, created_by, created_at, updated_by, updated_at
                )
                VALUES
                (
                    1, 'aaaa7e44-219e-4bbf-af4a-7589f8702d97', 1000004, 2, '2020-02-19 15:00:00', 1000004, 1, 1000007, 1, null, null,
                    'false', 'pxr_user', NOW(), 'pxr_user', NOW()
                ),
                (
                    1, 'aaaa7e44-219e-4bbf-af4a-7589f8702d98', 1000004, 3, '2020-02-19 15:00:00', 1000004, 1, 1000007, 1, null, null,
                    'false', 'pxr_user', NOW(), 'pxr_user', NOW()
                ),
                (
                    1, 'aaaa7e44-219e-4bbf-af4a-7589f8702d98', 1000004, 4, '2020-02-19 15:00:00', 1000004, 1, 1000007, 1, null, null,
                    'false', 'pxr_user', NOW(), 'pxr_user', NOW()
                )
            `);
            _catalogServer = new CatalogServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.SearchPxrIdOrOverMax);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
        test('正常: AND検索_データベース登録失敗_最小値不正', async () => {
            _catalogServer = new CatalogServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.SearchPxrIdMin);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
        test('正常: AND検索_データベース登録失敗_最大値不正', async () => {
            _catalogServer = new CatalogServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.SearchPxrIdMax);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
        test('正常: AND検索_最大値超過', async () => {
            _catalogServer = new CatalogServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.SearchPxrIdAndOverMax);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
        test('正常: AND検索、document, event, thing以外のデータ型を含む', async () => {
            // バグの場合異常系テストに変更する。
            _catalogServer = new CatalogServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.SearchPxrIdAndInvalidDataType);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([
                {
                    pxrId: 'wf-pj2-2-test-01',
                    ctokens: [
                        {
                            actor: { _value: 1000004 },
                            data: [
                                { _code: { _value: 1000004, _ver: 1 }, count: 1 },
                                { _code: { _value: 1000002, _ver: 1 }, count: 4 }
                            ]
                        },
                        {
                            actor: { _value: 2000004 },
                            data: [
                                { _code: { _value: 1000002, _ver: 1 }, count: 1 }
                            ]
                        }
                    ]
                }
            ]);
        });
        test('異常: AND検索（ステータスコード:400）', async () => {
            _catalogServer = new CatalogServer(400);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.SearchPxrIdAnd);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.FAILED_GET_CATALOG);
        });
        test('異常: AND検索（ステータスコード:503）', async () => {
            _catalogServer = new CatalogServer(500);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.SearchPxrIdAnd);

            expect(response.status).toBe(503);
            expect(response.body.message).toBe(Message.FAILED_GET_CATALOG);
        });
        test('異常: AND検索（ステータスコード:204）', async () => {
            _catalogServer = new CatalogServer(204);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.SearchPxrIdAnd);

            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.FAILED_GET_CATALOG);
        });
        test('異常: サービスへの接続に失敗', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.SearchPxrIdAnd);

            expect(response.status).toBe(503);
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_CATALOG);
        });
    });
});
