/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import supertest = require('supertest');
import { Application } from '../resources/config/Application';
import { OperatorServer /*, CtokenLedgerServer */ } from './StubServer';
import { MyConditionBookManageServer /*, CtokenLedgerServer */ } from './StubServer';
import { connectDatabase } from '../common/Connection';
import { clear } from './testDatabase';
import { Request } from './Request';
import { Session } from './Session';
import Config from '../common/Config';
/* eslint-enable */
const Message = Config.ReadConfig('./config/message.json');

// 対象アプリケーションを取得
const app = new Application();
const expressApp = app.express.app;

// Unit対象のURL（ベース）
const baseURI = '/ctoken-ledger/local';

// スタブサーバー（オペレータサービス）
let _operatorServer: OperatorServer = null;

// スタブサーバー（CToken台帳サービス）
// const _ctokenLedgerServer: CtokenLedgerServer = null;

// スタブサーバー（book管理サービス）
let _myConditionBookManageServer: MyConditionBookManageServer = null;

// Ctoken-Ledger Serviceのユニットテスト
describe('Ctoken-Ledger Service', () => {
    beforeAll(async () => {
        // サーバを起動
        app.start();
        await clear();
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

        if (_myConditionBookManageServer) {
            _myConditionBookManageServer.server.close();
            _myConditionBookManageServer = null;
        }
    });
    describe('Ctoken-Ledger登録API バリデーションチェック（add）: ' + baseURI, () => {
        test('パラメータ異常: 空のオブジェクト', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .send({});

            // Expect status is bad request
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.REQUEST_IS_EMPTY);
        });
        test('パラメータ異常: リクエストが配列', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .send(Request.Array);

            // Expect status is bad request
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('リクエストボディが配列であることを許容しません');
        });
        test('正常: 全てが空配列', async () => {
            _myConditionBookManageServer = new MyConditionBookManageServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [],
                    delete: []
                });

            // Expect status is bad request
            // expect(response.status).toBe(400);
            // expect(response.body.message).toBe(Message.ALL_ARRAY_IS_EMPTY);
            expect(response.status).toBe(200);
        });
        test('パラメータ不足: add', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .send({
                    update: [],
                    delete: []
                });

            // Expect status is bad request
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('add');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ不足: update', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .send({
                    add: [],
                    delete: []
                });

            // Expect status is bad request
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('update');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ不足: delete', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .send({
                    add: [],
                    update: []
                });

            // Expect status is bad request
            expect(response.body.reasons[0].property).toBe('delete');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: add（配列以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .send({
                    add: {
                        '1_1': 'wf-pj2-2-test-01',
                        document: [],
                        event: {
                            '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                            '3_1_2_1': 1000008,
                            '3_1_2_2': 1,
                            '3_2_1': '2020-02-20T00:00:00.000+0900',
                            '3_2_2': '2020-02-21T00:00:00.000+0900',
                            '3_5_1_1': 1000004,
                            '3_5_1_2': 1,
                            '3_5_2_1': 1000007,
                            '3_5_2_2': 1,
                            '3_5_5_1': 0,
                            '3_5_5_2': 0
                        },
                        thing: [
                            {
                                '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                '4_1_2_1': 1000011,
                                '4_1_2_2': 1,
                                '4_4_1_1': 1000004,
                                '4_4_1_2': 1,
                                '4_4_2_1': 1000007,
                                '4_4_2_2': 1,
                                '4_4_5_1': 0,
                                '4_4_5_2': 0,
                                rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                            }
                        ]
                    },
                    update: [],
                    delete: []
                });

            // Expect status is bad request
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('add');
            expect(response.body.reasons[0].message).toBe(Message.validation.isArray);
        });
        test('パラメータ異常: update（配列以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .send({
                    add: [],
                    update: {
                        '1_1': 'wf-pj2-2-test-01',
                        document: [],
                        event: {
                            '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                            '3_1_2_1': 1000008,
                            '3_1_2_2': 1,
                            '3_2_1': '2020-02-20T00:00:00.000+0900',
                            '3_2_2': '2020-02-21T00:00:00.000+0900',
                            '3_5_1_1': 1000004,
                            '3_5_1_2': 1,
                            '3_5_2_1': 1000007,
                            '3_5_2_2': 1,
                            '3_5_5_1': 0,
                            '3_5_5_2': 0
                        },
                        thing: [
                            {
                                '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                '4_1_2_1': 1000011,
                                '4_1_2_2': 1,
                                '4_4_1_1': 1000004,
                                '4_4_1_2': 1,
                                '4_4_2_1': 1000007,
                                '4_4_2_2': 1,
                                '4_4_5_1': 0,
                                '4_4_5_2': 0,
                                rowHash: '5de740c1670d3fbf383274ca6301717b3a474151065e4f8384992ba3d326efff',
                                rowHashCreateAt: '2020-09-06T22:39:40.000Z'
                            }
                        ]
                    },
                    delete: []
                });

            // Expect status is bad request
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('update');
            expect(response.body.reasons[0].message).toBe(Message.validation.isArray);
        });
        test('パラメータ異常: delete（配列以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .send({
                    add: [],
                    update: [],
                    delete: {
                        '1_1': 'wf-pj2-2-test-01',
                        document: [],
                        event: {
                            '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                        },
                        thing: [
                            {
                                '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911'
                            }
                        ]
                    }
                });

            // Expect status is bad request
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('delete');
            expect(response.body.reasons[0].message).toBe(Message.validation.isArray);
        });
        test('パラメータ不足: add.1_1', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('userId');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: add.1_1（文字列以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 1234,
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('userId');
            expect(response.body.reasons[0].message).toBe(Message.validation.isString);
        });
        test('パラメータ不足: add.document', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('document');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: add.document（配列以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: {
                                '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                                '2_n_1_2_1': 52,
                                '2_n_1_2_2': 1,
                                '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                                '2_n_3_1_1': 1000004,
                                '2_n_3_1_2': 1,
                                '2_n_3_2_1': 1000007,
                                '2_n_3_2_2': 1
                            },
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('document');
            expect(response.body.reasons[0].message).toBe(Message.validation.isArray);
        });
        test('パラメータ不足: add.document.2_n_1_1', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                    '2_n_1_2_1': 52,
                                    '2_n_1_2_2': 1,
                                    '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                                    '2_n_3_1_1': 1000004,
                                    '2_n_3_1_2': 1,
                                    '2_n_3_2_1': 1000007,
                                    '2_n_3_2_2': 1
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docIdentifier');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: add.document.2_n_1_1（UUID以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                    '2_n_1_1': 'a',
                                    '2_n_1_2_1': 52,
                                    '2_n_1_2_2': 1,
                                    '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                                    '2_n_3_1_1': 1000004,
                                    '2_n_3_1_2': 1,
                                    '2_n_3_2_1': 1000007,
                                    '2_n_3_2_2': 1
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docIdentifier');
            expect(response.body.reasons[0].message).toBe(Message.validation.isUuid);
        });
        test('パラメータ不足: add.document.2_n_1_2_1', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                    '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                                    '2_n_1_2_2': 1,
                                    '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                                    '2_n_3_1_1': 1000004,
                                    '2_n_3_1_2': 1,
                                    '2_n_3_2_1': 1000007,
                                    '2_n_3_2_2': 1
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docCatalogCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: add.document.2_n_1_2_1（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                    '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                                    '2_n_1_2_1': 'a',
                                    '2_n_1_2_2': 1,
                                    '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                                    '2_n_3_1_1': 1000004,
                                    '2_n_3_1_2': 1,
                                    '2_n_3_2_1': 1000007,
                                    '2_n_3_2_2': 1
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docCatalogCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足: add.document.2_n_1_2_2', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                    '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                                    '2_n_1_2_1': 52,
                                    '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                                    '2_n_3_1_1': 1000004,
                                    '2_n_3_1_2': 1,
                                    '2_n_3_2_1': 1000007,
                                    '2_n_3_2_2': 1
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docCatalogVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: add.document.2_n_1_2_2（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                    '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                                    '2_n_1_2_1': 52,
                                    '2_n_1_2_2': 'a',
                                    '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                                    '2_n_3_1_1': 1000004,
                                    '2_n_3_1_2': 1,
                                    '2_n_3_2_1': 1000007,
                                    '2_n_3_2_2': 1
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docCatalogVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足: add.document.2_n_2_1', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                    '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                                    '2_n_1_2_1': 52,
                                    '2_n_1_2_2': 1,
                                    '2_n_3_1_1': 1000004,
                                    '2_n_3_1_2': 1,
                                    '2_n_3_2_1': 1000007,
                                    '2_n_3_2_2': 1
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docCreateAt');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: add.document.2_n_2_1（Date型以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                    '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                                    '2_n_1_2_1': 52,
                                    '2_n_1_2_2': 1,
                                    '2_n_2_1': 'a',
                                    '2_n_3_1_1': 1000004,
                                    '2_n_3_1_2': 1,
                                    '2_n_3_2_1': 1000007,
                                    '2_n_3_2_2': 1
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docCreateAt');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDate);
        });
        test('パラメータ不足: add.document.2_n_3_1_1', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                    '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                                    '2_n_1_2_1': 52,
                                    '2_n_1_2_2': 1,
                                    '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                                    '2_n_3_1_2': 1,
                                    '2_n_3_2_1': 1000007,
                                    '2_n_3_2_2': 1
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docActorCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: add.document.2_n_3_1_1（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                    '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                                    '2_n_1_2_1': 52,
                                    '2_n_1_2_2': 1,
                                    '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                                    '2_n_3_1_1': 'a',
                                    '2_n_3_1_2': 1,
                                    '2_n_3_2_1': 1000007,
                                    '2_n_3_2_2': 1
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docActorCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足: add.document.2_n_3_1_2', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                    '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                                    '2_n_1_2_1': 52,
                                    '2_n_1_2_2': 1,
                                    '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                                    '2_n_3_1_1': 1000004,
                                    '2_n_3_2_1': 1000007,
                                    '2_n_3_2_2': 1
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docActorVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: add.document.2_n_3_1_2（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                    '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                                    '2_n_1_2_1': 52,
                                    '2_n_1_2_2': 1,
                                    '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                                    '2_n_3_1_1': 1000004,
                                    '2_n_3_1_2': 'a',
                                    '2_n_3_2_1': 1000007,
                                    '2_n_3_2_2': 1
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docActorVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常: add.document.2_n_3_2_1（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                    '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                                    '2_n_1_2_1': 52,
                                    '2_n_1_2_2': 1,
                                    '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                                    '2_n_3_1_1': 1000004,
                                    '2_n_3_1_2': 1,
                                    '2_n_3_2_1': 'a',
                                    '2_n_3_2_2': 1
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docWfCatalogCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常: add.document.2_n_3_2_2（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                    '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                                    '2_n_1_2_1': 52,
                                    '2_n_1_2_2': 1,
                                    '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                                    '2_n_3_1_1': 1000004,
                                    '2_n_3_1_2': 1,
                                    '2_n_3_2_1': 1000007,
                                    '2_n_3_2_2': 'a'
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docWfCatalogVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常: add.document.2_n_3_5_1（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                    '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                                    '2_n_1_2_1': 52,
                                    '2_n_1_2_2': 1,
                                    '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                                    '2_n_3_1_1': 1000004,
                                    '2_n_3_1_2': 1,
                                    '2_n_3_5_1': 'a',
                                    '2_n_3_5_2': 1
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docAppCatalogCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常: add.document.2_n_3_5_2（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                    '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                                    '2_n_1_2_1': 52,
                                    '2_n_1_2_2': 1,
                                    '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                                    '2_n_3_1_1': 1000004,
                                    '2_n_3_1_2': 1,
                                    '2_n_3_5_1': 1000007,
                                    '2_n_3_5_2': 'a'
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docAppCatalogVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足: add.event', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('event');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ不足: add.event.3_1_1', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventIdentifier');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: add.event.3_1_1（UUID以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'a',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventIdentifier');
            expect(response.body.reasons[0].message).toBe(Message.validation.isUuid);
        });
        test('パラメータ不足: add.event.3_1_2_1', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventCatalogCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: add.event.3_1_2_1（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 'a',
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventCatalogCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足: add.event.3_1_2_2', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventCatalogVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: add.event.3_1_2_2（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 'a',
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventCatalogVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常: add.event.3_2_1（Date型以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': 'a',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventStartAt');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDate);
        });
        test('パラメータ異常: add.event.3_2_2（Date型以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': 'a',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventEndAt');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDate);
        });
        test('パラメータ不足: add.event.3_5_1_1', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventActorCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: add.event.3_5_1_1（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 'a',
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventActorCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足: add.event.3_5_1_2', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventActorVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: add.event.3_5_1_2（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 'a',
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventActorVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常: add.event.3_5_2_1（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 'a',
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventWfCatalogCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常: add.event.3_5_2_2（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 'a',
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventWfCatalogVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常: add.event.3_5_5_1（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 'a',
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventAppCatalogCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常: add.event.3_5_5_2（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 'a'
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventAppCatalogVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足: add.thing', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            }
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thing');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: add.thing（空配列）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: []
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thing');
            expect(response.body.reasons[0].message).toBe(Message.validation.arrayNotEmpty);
        });
        test('パラメータ異常: add.thing（配列以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: {
                                '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                '4_1_2_1': 1000011,
                                '4_1_2_2': 1,
                                '4_4_1_1': 1000004,
                                '4_4_1_2': 1,
                                '4_4_2_1': 1000007,
                                '4_4_2_2': 1,
                                '4_4_5_1': 0,
                                '4_4_5_2': 0,
                                rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                            }
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thing');
            expect(response.body.reasons[0].message).toBe(Message.validation.isArray);
        });
        test('パラメータ不足: add.thing.4_1_1', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thingIdentifier');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: add.thing.4_1_1（UUID以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': 'a',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thingIdentifier');
            expect(response.body.reasons[0].message).toBe(Message.validation.isUuid);
        });
        test('パラメータ不足: add.thing.4_1_2_1', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thingCatalogCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: add.thing.4_1_2_1（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 'a',
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thingCatalogCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足: add.thing.4_1_2_2', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thingCatalogVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: add.thing.4_1_2_2（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 'a',
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thingCatalogVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足: add.thing.4_4_1_1', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thingActorCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: add.thing.4_4_1_1（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 'a',
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thingActorCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足: add.thing.4_4_1_2', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thingActorVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: add.thing.4_4_1_2（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 'a',
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thingActorVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常: add.thing.4_4_2_1（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 'a',
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thingWfCatalogCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常: add.thing.4_4_2_2（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 'a',
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thingWfCatalogVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常: add.thing.4_4_5_1（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 'a',
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thingAppCatalogCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常: add.thing.4_4_5_2（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 'a',
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thingAppCatalogVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足: add.thing.rowHash', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('rowHash');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: add.thing.rowHash（文字列以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: 10,
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('rowHash');
            expect(response.body.reasons[0].message).toBe(Message.validation.isString);
        });
        test('パラメータ不足: add.thing.rowHashCreateAt', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('rowHashCreateAt');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: add.thing.rowHashCreateAt（Date型以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: 'aa'
                                }
                            ]
                        }
                    ],
                    update: [],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('rowHashCreateAt');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDate);
        });
    });
    describe('Ctoken-Ledger登録API バリデーションチェック（update）: ' + baseURI, () => {
        test('パラメータ不足: update.1_1', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('userId');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: update.1_1（文字列以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 1234,
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('userId');
            expect(response.body.reasons[0].message).toBe(Message.validation.isString);
        });
        test('パラメータ不足: update.document', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('document');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: update.document（配列以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: {
                                '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                                '2_n_1_2_1': 52,
                                '2_n_1_2_2': 1,
                                '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                                '2_n_3_1_1': 1000004,
                                '2_n_3_1_2': 1,
                                '2_n_3_2_1': 1000007,
                                '2_n_3_2_2': 1
                            },
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('document');
            expect(response.body.reasons[0].message).toBe(Message.validation.isArray);
        });
        test('パラメータ不足: update.document.2_n_1_1', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                    '2_n_1_2_1': 52,
                                    '2_n_1_2_2': 1,
                                    '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                                    '2_n_3_1_1': 1000004,
                                    '2_n_3_1_2': 1,
                                    '2_n_3_2_1': 1000007,
                                    '2_n_3_2_2': 1
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docIdentifier');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: update.document.2_n_1_1（UUID以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                    '2_n_1_1': 'a',
                                    '2_n_1_2_1': 52,
                                    '2_n_1_2_2': 1,
                                    '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                                    '2_n_3_1_1': 1000004,
                                    '2_n_3_1_2': 1,
                                    '2_n_3_2_1': 1000007,
                                    '2_n_3_2_2': 1
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docIdentifier');
            expect(response.body.reasons[0].message).toBe(Message.validation.isUuid);
        });
        test('パラメータ不足: update.document.2_n_1_2_1', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                    '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                                    '2_n_1_2_2': 1,
                                    '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                                    '2_n_3_1_1': 1000004,
                                    '2_n_3_1_2': 1,
                                    '2_n_3_2_1': 1000007,
                                    '2_n_3_2_2': 1
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docCatalogCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: update.document.2_n_1_2_1（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                    '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                                    '2_n_1_2_1': 'a',
                                    '2_n_1_2_2': 1,
                                    '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                                    '2_n_3_1_1': 1000004,
                                    '2_n_3_1_2': 1,
                                    '2_n_3_2_1': 1000007,
                                    '2_n_3_2_2': 1
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docCatalogCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足: update.document.2_n_1_2_2', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                    '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                                    '2_n_1_2_1': 52,
                                    '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                                    '2_n_3_1_1': 1000004,
                                    '2_n_3_1_2': 1,
                                    '2_n_3_2_1': 1000007,
                                    '2_n_3_2_2': 1
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docCatalogVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: update.document.2_n_1_2_2（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                    '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                                    '2_n_1_2_1': 52,
                                    '2_n_1_2_2': 'a',
                                    '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                                    '2_n_3_1_1': 1000004,
                                    '2_n_3_1_2': 1,
                                    '2_n_3_2_1': 1000007,
                                    '2_n_3_2_2': 1
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docCatalogVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足: update.document.2_n_2_1', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                    '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                                    '2_n_1_2_1': 52,
                                    '2_n_1_2_2': 1,
                                    '2_n_3_1_1': 1000004,
                                    '2_n_3_1_2': 1,
                                    '2_n_3_2_1': 1000007,
                                    '2_n_3_2_2': 1
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docCreateAt');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: update.document.2_n_2_1（Date型以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                    '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                                    '2_n_1_2_1': 52,
                                    '2_n_1_2_2': 1,
                                    '2_n_2_1': 'a',
                                    '2_n_3_1_1': 1000004,
                                    '2_n_3_1_2': 1,
                                    '2_n_3_2_1': 1000007,
                                    '2_n_3_2_2': 1
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docCreateAt');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDate);
        });
        test('パラメータ不足: update.document.2_n_3_1_1', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                    '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                                    '2_n_1_2_1': 52,
                                    '2_n_1_2_2': 1,
                                    '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                                    '2_n_3_1_2': 1,
                                    '2_n_3_2_1': 1000007,
                                    '2_n_3_2_2': 1
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docActorCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: update.document.2_n_3_1_1（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                    '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                                    '2_n_1_2_1': 52,
                                    '2_n_1_2_2': 1,
                                    '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                                    '2_n_3_1_1': 'a',
                                    '2_n_3_1_2': 1,
                                    '2_n_3_2_1': 1000007,
                                    '2_n_3_2_2': 1
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docActorCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足: update.document.2_n_3_1_2', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                    '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                                    '2_n_1_2_1': 52,
                                    '2_n_1_2_2': 1,
                                    '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                                    '2_n_3_1_1': 1000004,
                                    '2_n_3_2_1': 1000007,
                                    '2_n_3_2_2': 1
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docActorVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: update.document.2_n_3_1_2（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                    '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                                    '2_n_1_2_1': 52,
                                    '2_n_1_2_2': 1,
                                    '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                                    '2_n_3_1_1': 1000004,
                                    '2_n_3_1_2': 'a',
                                    '2_n_3_2_1': 1000007,
                                    '2_n_3_2_2': 1
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docActorVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常: update.document.2_n_3_2_1（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                    '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                                    '2_n_1_2_1': 52,
                                    '2_n_1_2_2': 1,
                                    '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                                    '2_n_3_1_1': 1000004,
                                    '2_n_3_1_2': 1,
                                    '2_n_3_2_1': 'a',
                                    '2_n_3_2_2': 1
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docWfCatalogCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常: update.document.2_n_3_2_2（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                    '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                                    '2_n_1_2_1': 52,
                                    '2_n_1_2_2': 1,
                                    '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                                    '2_n_3_1_1': 1000004,
                                    '2_n_3_1_2': 1,
                                    '2_n_3_2_1': 1000007,
                                    '2_n_3_2_2': 'a'
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docWfCatalogVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常: update.document.2_n_3_5_1（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                    '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                                    '2_n_1_2_1': 52,
                                    '2_n_1_2_2': 1,
                                    '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                                    '2_n_3_1_1': 1000004,
                                    '2_n_3_1_2': 1,
                                    '2_n_3_5_1': 'a',
                                    '2_n_3_5_2': 1
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docAppCatalogCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常: update.document.2_n_3_5_2（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                    '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                                    '2_n_1_2_1': 52,
                                    '2_n_1_2_2': 1,
                                    '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                                    '2_n_3_1_1': 1000004,
                                    '2_n_3_1_2': 1,
                                    '2_n_3_5_1': 1000007,
                                    '2_n_3_5_2': 'a'
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docAppCatalogVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足: update.event', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('event');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ不足: update.event.3_1_1', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventIdentifier');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: update.event.3_1_1（UUID以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'a',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventIdentifier');
            expect(response.body.reasons[0].message).toBe(Message.validation.isUuid);
        });
        test('パラメータ不足: update.event.3_1_2_1', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventCatalogCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: update.event.3_1_2_1（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 'a',
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventCatalogCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足: update.event.3_1_2_2', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventCatalogVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: update.event.3_1_2_2（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 'a',
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventCatalogVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常: update.event.3_2_1（Date型以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': 'a',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventStartAt');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDate);
        });
        test('パラメータ異常: update.event.3_2_2（Date型以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': 'a',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventEndAt');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDate);
        });
        test('パラメータ不足: update.event.3_5_1_1', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventActorCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: update.event.3_5_1_1（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 'a',
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventActorCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足: update.event.3_5_1_2', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventActorVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: update.event.3_5_1_2（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 'a',
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventActorVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常: update.event.3_5_2_1（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 'a',
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventWfCatalogCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常: update.event.3_5_2_2（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 'a',
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventWfCatalogVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常: update.event.3_5_5_1（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 'a',
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventAppCatalogCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常: update.event.3_5_5_2（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 'a'
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventAppCatalogVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足: update.thing', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            }
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thing');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: update.thing（空配列）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: []
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thing');
            expect(response.body.reasons[0].message).toBe(Message.validation.arrayNotEmpty);
        });
        test('パラメータ異常: update.thing（配列以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: {
                                '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                '4_1_2_1': 1000011,
                                '4_1_2_2': 1,
                                '4_4_1_1': 1000004,
                                '4_4_1_2': 1,
                                '4_4_2_1': 1000007,
                                '4_4_2_2': 1,
                                '4_4_5_1': 0,
                                '4_4_5_2': 0,
                                rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                            }
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thing');
            expect(response.body.reasons[0].message).toBe(Message.validation.isArray);
        });
        test('パラメータ不足: update.thing.4_1_1', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thingIdentifier');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: update.thing.4_1_1（UUID以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': 'a',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thingIdentifier');
            expect(response.body.reasons[0].message).toBe(Message.validation.isUuid);
        });
        test('パラメータ不足: update.thing.4_1_2_1', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thingCatalogCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: update.thing.4_1_2_1（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 'a',
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thingCatalogCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足: update.thing.4_1_2_2', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thingCatalogVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: update.thing.4_1_2_2（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 'a',
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thingCatalogVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足: update.thing.4_4_1_1', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thingActorCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: update.thing.4_4_1_1（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 'a',
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thingActorCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足: update.thing.4_4_1_2', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thingActorVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: update.thing.4_4_1_2（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 'a',
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thingActorVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常: update.thing.4_4_2_1（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 'a',
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thingWfCatalogCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常: update.thing.4_4_2_2（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 'a',
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thingWfCatalogVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常: update.thing.4_4_5_1（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 'a',
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thingAppCatalogCode');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常: update.thing.4_4_5_2（数字以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 'a',
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thingAppCatalogVersion');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足: update.thing.rowHash', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('rowHash');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: update.thing.rowHash（文字列以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: 10,
                                    rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('rowHash');
            expect(response.body.reasons[0].message).toBe(Message.validation.isString);
        });
        test('パラメータ不足: update.thing.rowHashCreateAt', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('rowHashCreateAt');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: update.thing.rowHashCreateAt（Date型以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                                '3_1_2_1': 1000008,
                                '3_1_2_2': 1,
                                '3_2_1': '2020-02-20T00:00:00.000+0900',
                                '3_2_2': '2020-02-21T00:00:00.000+0900',
                                '3_5_1_1': 1000004,
                                '3_5_1_2': 1,
                                '3_5_2_1': 1000007,
                                '3_5_2_2': 1,
                                '3_5_5_1': 0,
                                '3_5_5_2': 0
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                                    '4_1_2_1': 1000011,
                                    '4_1_2_2': 1,
                                    '4_4_1_1': 1000004,
                                    '4_4_1_2': 1,
                                    '4_4_2_1': 1000007,
                                    '4_4_2_2': 1,
                                    '4_4_5_1': 0,
                                    '4_4_5_2': 0,
                                    rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                                    rowHashCreateAt: 'aa'
                                }
                            ]
                        }
                    ],
                    delete: []
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('rowHashCreateAt');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDate);
        });
    });
    describe('Ctoken-Ledger登録API バリデーションチェック（delete）: ' + baseURI, () => {
        test('パラメータ不足: delete.1_1', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [],
                    delete: [
                        {
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911'
                                }
                            ]
                        }
                    ]
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('userId');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: delete.1_1（文字列以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [],
                    delete: [
                        {
                            '1_1': 1234,
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911'
                                }
                            ]
                        }
                    ]
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('userId');
            expect(response.body.reasons[0].message).toBe(Message.validation.isString);
        });
        test('パラメータ不足: delete.document', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [],
                    delete: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911'
                                }
                            ]
                        }
                    ]
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('document');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: delete.document（配列以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [],
                    delete: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: {
                                '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96'
                            },
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911'
                                }
                            ]
                        }
                    ]
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('document');
            expect(response.body.reasons[0].message).toBe(Message.validation.isArray);
        });
        test('パラメータ不足: delete.document.2_n_1_1', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [],
                    delete: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911'
                                }
                            ]
                        }
                    ]
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docIdentifier');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: delete.document.2_n_1_1（UUID以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [],
                    delete: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [
                                {
                                    '2_n_1_1': 'a'
                                }
                            ],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911'
                                }
                            ]
                        }
                    ]
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('docIdentifier');
            expect(response.body.reasons[0].message).toBe(Message.validation.isUuid);
        });
        test('パラメータ不足: delete.event', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [],
                    delete: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911'
                                }
                            ]
                        }
                    ]
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('event');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ不足: delete.event.3_1_1', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [],
                    delete: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911'
                                }
                            ]
                        }
                    ]
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventIdentifier');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: delete.event.3_1_1（UUID以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [],
                    delete: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'a'
                            },
                            thing: [
                                {
                                    '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911'
                                }
                            ]
                        }
                    ]
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('eventIdentifier');
            expect(response.body.reasons[0].message).toBe(Message.validation.isUuid);
        });
        test('パラメータ不足: delete.thing', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [],
                    delete: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                            }
                        }
                    ]
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thing');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: delete.thing（空配列）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [],
                    delete: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                            },
                            thing: []
                        }
                    ]
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thing');
            expect(response.body.reasons[0].message).toBe(Message.validation.arrayNotEmpty);
        });
        test('パラメータ異常: delete.thing（配列以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [],
                    delete: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                            },
                            thing: {
                                '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911'
                            }
                        }
                    ]
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thing');
            expect(response.body.reasons[0].message).toBe(Message.validation.isArray);
        });
        test('パラメータ不足: delete.thing.4_1_1', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [],
                    delete: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                            },
                            thing: [
                                {
                                }
                            ]
                        }
                    ]
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thingIdentifier');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常: delete.thing.4_1_1（UUID以外）', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send({
                    add: [],
                    update: [],
                    delete: [
                        {
                            '1_1': 'wf-pj2-2-test-01',
                            document: [],
                            event: {
                                '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                            },
                            thing: [
                                {
                                    '4_1_1': 'a'
                                }
                            ]
                        }
                    ]
                });

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thingIdentifier');
            expect(response.body.reasons[0].message).toBe(Message.validation.isUuid);
        });
    });
    describe('Ctoken-Ledger登録API POST: ' + baseURI, () => {
        test('正常: 追加', async () => {
            _myConditionBookManageServer = new MyConditionBookManageServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.Add);

            expect(response.status).toBe(200);
        });
        test('正常: 追加', async () => {
            _myConditionBookManageServer = new MyConditionBookManageServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.AddFromApp);

            expect(response.status).toBe(200);
        });
        test('正常: 追加（ドキュメントあり）', async () => {
            _myConditionBookManageServer = new MyConditionBookManageServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.AddInDoc);

            expect(response.status).toBe(200);
        });
        test('正常: 更新', async () => {
            _myConditionBookManageServer = new MyConditionBookManageServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.Update);

            expect(response.status).toBe(200);
        });
        test('正常: 更新（ドキュメントあり）', async () => {
            _myConditionBookManageServer = new MyConditionBookManageServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.UpdateInDoc);

            expect(response.status).toBe(200);
        });
        test('正常: 更新(rowHash更新無し)', async () => {
            _myConditionBookManageServer = new MyConditionBookManageServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.UpdateWithoutRowHash);

            expect(response.status).toBe(200);
        });
        test('正常: 更新（ドキュメントあり、ドキュメント更新無し）', async () => {
            _myConditionBookManageServer = new MyConditionBookManageServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.UpdateInDocWithoutUpdate);

            expect(response.status).toBe(200);
        });
        test('正常: 削除', async () => {
            _myConditionBookManageServer = new MyConditionBookManageServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.Delete);

            expect(response.status).toBe(200);
        });
        test('正常: 削除（ドキュメントあり）', async () => {
            _myConditionBookManageServer = new MyConditionBookManageServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.DeleteInDoc);

            expect(response.status).toBe(200);
        });
        test('正常: 追加（ドキュメントあり、1件以上）', async () => {
            _myConditionBookManageServer = new MyConditionBookManageServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.AddInDoc2);

            expect(response.status).toBe(200);
        });
        test('正常: 削除（ドキュメントあり、ドキュメント非削除）', async () => {
            _myConditionBookManageServer = new MyConditionBookManageServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.DeleteInDocWithoutDelete);

            expect(response.status).toBe(200);
        });
        test('正常: 削除（ドキュメントあり、1件以上）', async () => {
            _myConditionBookManageServer = new MyConditionBookManageServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.DeleteInDoc2);

            expect(response.status).toBe(200);
        });
        test('正常: Cookie（個人）', async () => {
            _myConditionBookManageServer = new MyConditionBookManageServer(200);

            _operatorServer = new OperatorServer(200, 0);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type0_session=' + '5b4fcfb619a4fd3215e3582412eecfd5ab7e06eb112c52402805a730e8737899'])
                .send(Request.Add);

            expect(response.status).toBe(200);
        });
        test('正常: Cookie（アプリケーション）', async () => {
            _myConditionBookManageServer = new MyConditionBookManageServer(200);

            _operatorServer = new OperatorServer(200, 2);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '5b4fcfb619a4fd3215e3582412eecfd5ab7e06eb112c52402805a730e8737899'])
                .send(Request.Add);

            expect(response.status).toBe(200);
        });
        test('正常: Cookie（運営メンバー）', async () => {
            _myConditionBookManageServer = new MyConditionBookManageServer(200);

            _operatorServer = new OperatorServer(200, 3);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + '5b4fcfb619a4fd3215e3582412eecfd5ab7e06eb112c52402805a730e8737899'])
                .send(Request.Add);

            expect(response.status).toBe(200);
        });
        test('異常: 未ログイン', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .send(Request.Add);

            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NOT_AUTHORIZED);
        });
        test('異常: オペレーターサービスからの応答が204', async () => {
            _operatorServer = new OperatorServer(204, 1);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '5b4fcfb619a4fd3215e3582412eecfd5ab7e06eb112c52402805a730e8737899'])
                .send(Request.Add);

            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NOT_AUTHORIZED);
        });
        test('異常: オペレーターサービスからの応答が400', async () => {
            _operatorServer = new OperatorServer(400, 1);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '5b4fcfb619a4fd3215e3582412eecfd5ab7e06eb112c52402805a730e8737899'])
                .send(Request.Add);

            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NOT_AUTHORIZED);
        });
        test('異常: オペレーターサービスからの応答が500', async () => {
            _operatorServer = new OperatorServer(500, 1);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '5b4fcfb619a4fd3215e3582412eecfd5ab7e06eb112c52402805a730e8737899'])
                .send(Request.Add);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_TAKE_SESSION);
        });
        test('異常: オペレーターサービスとの接続に失敗', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '5b4fcfb619a4fd3215e3582412eecfd5ab7e06eb112c52402805a730e8737899'])
                .send(Request.Add);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_OPERATOR);
        });
        test('異常: 登録_PXR-IDが存在しない', async () => {
            _myConditionBookManageServer = new MyConditionBookManageServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.AddNoPxrId);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe(Message.NO_PXRID);
        });
        test('異常: 更新_PXR-IDが存在しない', async () => {
            _myConditionBookManageServer = new MyConditionBookManageServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.UpdateNoPxrId);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe(Message.NO_PXRID);
        });
        test('異常: 追加（ステータスコード:400）', async () => {
            _myConditionBookManageServer = new MyConditionBookManageServer(400);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.Add);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.FAILED_BOOK_MANAGE_DATA_ACCUMU_GET);
        });
        test('異常: 追加（ステータスコード:503）', async () => {
            _myConditionBookManageServer = new MyConditionBookManageServer(500);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.Add);

            expect(response.status).toBe(503);
            expect(response.body.message).toBe(Message.FAILED_BOOK_MANAGE_DATA_ACCUMU_GET);
        });
        test('異常: 追加（ステータスコード:204）', async () => {
            _myConditionBookManageServer = new MyConditionBookManageServer(204);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.Add);

            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.FAILED_BOOK_MANAGE_DATA_ACCUMU_GET);
        });
        test('異常: Book管理サービスへの接続に失敗', async () => {
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.Add);

            expect(response.status).toBe(503);
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_BOOK_MANAGE_DATA_ACCUMU_GET);
        });
    });

    /**
     * Ctoken-Ledger登録API （6948追加分、userId重複）
     */
    describe('Ctoken-Ledger登録API（6948追加分、userId重複） POST: ' + baseURI, () => {
        /**
        test('正常: 追加、userId重複wf、同一個人', async () => {
            _myConditionBookManageServer = new MyConditionBookManageServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfManage) })
                .send(Request.AddDuplicateUserIdSelfWf);

            expect(response.status).toBe(200);
            // 標的pxrIdのctokenにリクエストのデータ識別子が紐づいていることを確認
            const connection = await connectDatabase();
            const addCtoken = await connection.query(`
            SELECT ctoken.pxr_id, row_hash."3_5_2_1", row_hash."3_5_5_1" FROM pxr_ctoken_ledger.ctoken
            INNER JOIN pxr_ctoken_ledger.cmatrix ON ctoken.id = cmatrix.ctoken_id
            INNER JOIN pxr_ctoken_ledger.row_hash ON cmatrix.id = row_hash.cmatrix_id
            WHERE cmatrix."1_1" = 'wfUser01'
            AND row_hash."3_1_1" = 'd1da7e44-219e-4bbf-af4a-7589f8702d96';
            `);
            expect(addCtoken.length).toBe(1);
            expect(addCtoken[0].pxr_id).toBe('DuplicateUserIdA');
            expect(addCtoken[0]['3_5_2_1']).toBe('1000007');
            expect(addCtoken[0]['3_5_5_1']).toBe(null);
        });
         */
        /**
        test('正常: 追加、userId重複wf、別個人', async () => {
            _myConditionBookManageServer = new MyConditionBookManageServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfManage) })
                .send(Request.AddDuplicateUseerIdOthersWf);

            expect(response.status).toBe(200);
            // 標的pxrIdのctokenにリクエストのデータ識別子が紐づいていることを確認
            const connection = await connectDatabase();
            const addCtoken = await connection.query(`
            SELECT ctoken.pxr_id, row_hash."3_5_2_1", row_hash."3_5_5_1" FROM pxr_ctoken_ledger.ctoken
            INNER JOIN pxr_ctoken_ledger.cmatrix ON ctoken.id = cmatrix.ctoken_id
            INNER JOIN pxr_ctoken_ledger.row_hash ON cmatrix.id = row_hash.cmatrix_id
            WHERE cmatrix."1_1" = 'wfUser02'
            AND row_hash."3_1_1" = 'b4cad926-78a5-b3b0-3d52-c89beb5fd294';
            `);
            expect(addCtoken.length).toBe(1);
            expect(addCtoken[0].pxr_id).toBe('DuplicateUserIdB');
            expect(addCtoken[0]['3_5_2_1']).toBe('1000017');
            expect(addCtoken[0]['3_5_5_1']).toBe(null);
        });
         */
        test('正常: 追加、userId重複app、別個人', async () => {
            _myConditionBookManageServer = new MyConditionBookManageServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManage) })
                .send(Request.AddDuplicateUseerIdOthersApp);

            expect(response.status).toBe(200);
            // 標的pxrIdのctokenにリクエストのデータ識別子が紐づいていることを確認
            const connection = await connectDatabase();
            const addCtoken = await connection.query(`
            SELECT ctoken.pxr_id, row_hash."3_5_2_1", row_hash."3_5_5_1" FROM pxr_ctoken_ledger.ctoken
            INNER JOIN pxr_ctoken_ledger.cmatrix ON ctoken.id = cmatrix.ctoken_id
            INNER JOIN pxr_ctoken_ledger.row_hash ON cmatrix.id = row_hash.cmatrix_id
            WHERE cmatrix."1_1" = 'appUser02'
            AND row_hash."3_1_1" = '2a6cfaf9-6431-27fe-ae5d-665e217646d5';
            `);
            expect(addCtoken.length).toBe(1);
            expect(addCtoken[0].pxr_id).toBe('DuplicateUserIdA');
            expect(addCtoken[0]['3_5_2_1']).toBe(null);
            expect(addCtoken[0]['3_5_5_1']).toBe('1000107');
        });
        /**
        test('正常: 追加、userId重複、wf/app間で重複、別個人', async () => {
            _myConditionBookManageServer = new MyConditionBookManageServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfManage) })
                .send(Request.AddDuplicateUseerIdOthers);

            expect(response.status).toBe(200);
            // 標的pxrIdのctokenにリクエストのデータ識別子が紐づいていることを確認
            const connection = await connectDatabase();
            const addCtoken = await connection.query(`
            SELECT ctoken.pxr_id, row_hash."3_5_2_1", row_hash."3_5_5_1" FROM pxr_ctoken_ledger.ctoken
            INNER JOIN pxr_ctoken_ledger.cmatrix ON ctoken.id = cmatrix.ctoken_id
            INNER JOIN pxr_ctoken_ledger.row_hash ON cmatrix.id = row_hash.cmatrix_id
            WHERE cmatrix."1_1" = 'user03'
            AND row_hash."3_1_1" = 'ab7f35bb-9c35-0ec7-83c9-2411f59e6390';
            `);
            expect(addCtoken.length).toBe(1);
            expect(addCtoken[0].pxr_id).toBe('DuplicateUserIdA');
            expect(addCtoken[0]['3_5_2_1']).toBe('1000027');
            expect(addCtoken[0]['3_5_5_1']).toBe(null);
        });
         */
        /**
        test('正常: 更新、userId重複、wf、同一個人', async () => {
            // 更新前ctoken取得
            const connection = await connectDatabase();
            const beforeCtoken = await connection.query(`
            SELECT ctoken.pxr_id, ctoken.ctoken FROM pxr_ctoken_ledger.ctoken
            INNER JOIN pxr_ctoken_ledger.cmatrix ON ctoken.id = cmatrix.ctoken_id
            INNER JOIN pxr_ctoken_ledger.row_hash ON cmatrix.id = row_hash.cmatrix_id
            WHERE cmatrix."1_1" = 'wfUser01'
            AND row_hash."3_5_2_1" = 1000007;
            `);
            _myConditionBookManageServer = new MyConditionBookManageServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfManage) })
                .send(Request.UpdateDuplicateUserIdSelfWf);

            expect(response.status).toBe(200);
            // 更新前後ctoken確認
            const afterCtoken = await connection.query(`
            SELECT ctoken.pxr_id, ctoken.ctoken FROM pxr_ctoken_ledger.ctoken
            INNER JOIN pxr_ctoken_ledger.cmatrix ON ctoken.id = cmatrix.ctoken_id
            INNER JOIN pxr_ctoken_ledger.row_hash ON cmatrix.id = row_hash.cmatrix_id
            WHERE cmatrix."1_1" = 'wfUser01'
            AND row_hash."3_5_2_1" = 1000007;
            `);
            expect(beforeCtoken.length).toBe(1);
            expect(afterCtoken.length).toBe(1);
            expect(beforeCtoken[0].pxr_id === afterCtoken[0].pxr_id).toBe(true);
            expect(beforeCtoken[0].ctoken === afterCtoken[0].ctoken).toBe(false);
        });
         */
        /**
        test('正常: 更新、userId重複、wf、別個人', async () => {
            // 更新前ctoken取得
            const connection = await connectDatabase();
            const beforeCtoken = await connection.query(`
            SELECT ctoken.pxr_id, ctoken.ctoken FROM pxr_ctoken_ledger.ctoken
            INNER JOIN pxr_ctoken_ledger.cmatrix ON ctoken.id = cmatrix.ctoken_id
            INNER JOIN pxr_ctoken_ledger.row_hash ON cmatrix.id = row_hash.cmatrix_id
            WHERE cmatrix."1_1" = 'wfUser02'
            AND row_hash."3_5_2_1" = 1000017;
            `);
            _myConditionBookManageServer = new MyConditionBookManageServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfManage) })
                .send(Request.UpdateDuplicateUseerIdOthersWf);

            expect(response.status).toBe(200);
            // 更新前後ctoken確認
            const afterCtoken = await connection.query(`
            SELECT ctoken.pxr_id, ctoken.ctoken FROM pxr_ctoken_ledger.ctoken
            INNER JOIN pxr_ctoken_ledger.cmatrix ON ctoken.id = cmatrix.ctoken_id
            INNER JOIN pxr_ctoken_ledger.row_hash ON cmatrix.id = row_hash.cmatrix_id
            WHERE cmatrix."1_1" = 'wfUser02'
            AND row_hash."3_5_2_1" = 1000017;
            `);
            expect(beforeCtoken.length).toBe(1);
            expect(afterCtoken.length).toBe(1);
            expect(beforeCtoken[0].pxr_id === afterCtoken[0].pxr_id).toBe(true);
            expect(beforeCtoken[0].ctoken === afterCtoken[0].ctoken).toBe(false);
        });
         */
        test('正常: 更新、userId重複、app、別個人', async () => {
            // 更新前ctoken取得
            const connection = await connectDatabase();
            const beforeCtoken = await connection.query(`
            SELECT ctoken.pxr_id, ctoken.ctoken FROM pxr_ctoken_ledger.ctoken
            INNER JOIN pxr_ctoken_ledger.cmatrix ON ctoken.id = cmatrix.ctoken_id
            INNER JOIN pxr_ctoken_ledger.row_hash ON cmatrix.id = row_hash.cmatrix_id
            WHERE cmatrix."1_1" = 'appUser02'
            AND row_hash."3_5_5_1" = 1000107;
            `);
            _myConditionBookManageServer = new MyConditionBookManageServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManage) })
                .send(Request.UpdateDuplicateUseerIdOthersApp);

            expect(response.status).toBe(200);
            // 更新前後ctoken確認
            const afterCtoken = await connection.query(`
            SELECT ctoken.pxr_id, ctoken.ctoken FROM pxr_ctoken_ledger.ctoken
            INNER JOIN pxr_ctoken_ledger.cmatrix ON ctoken.id = cmatrix.ctoken_id
            INNER JOIN pxr_ctoken_ledger.row_hash ON cmatrix.id = row_hash.cmatrix_id
            WHERE cmatrix."1_1" = 'appUser02'
            AND row_hash."3_5_5_1" = 1000107;
            `);
            expect(beforeCtoken.length).toBe(1);
            expect(afterCtoken.length).toBe(1);
            expect(beforeCtoken[0].pxr_id === afterCtoken[0].pxr_id).toBe(true);
            expect(beforeCtoken[0].ctoken === afterCtoken[0].ctoken).toBe(false);
        });
        /**
        test('正常: 更新、userId重複、wf/app間で重複、別個人', async () => {
            // 更新前ctoken取得
            const connection = await connectDatabase();
            const beforeCtoken = await connection.query(`
            SELECT ctoken.pxr_id, ctoken.ctoken FROM pxr_ctoken_ledger.ctoken
            INNER JOIN pxr_ctoken_ledger.cmatrix ON ctoken.id = cmatrix.ctoken_id
            INNER JOIN pxr_ctoken_ledger.row_hash ON cmatrix.id = row_hash.cmatrix_id
            WHERE cmatrix."1_1" = 'user03'
            AND row_hash."3_5_2_1" = 1000027;
            `);
            _myConditionBookManageServer = new MyConditionBookManageServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfManage) })
                .send(Request.UpdateDuplicateUseerIdOthers);

            expect(response.status).toBe(200);
            // 更新前後ctoken確認
            const afterCtoken = await connection.query(`
            SELECT ctoken.pxr_id, ctoken.ctoken FROM pxr_ctoken_ledger.ctoken
            INNER JOIN pxr_ctoken_ledger.cmatrix ON ctoken.id = cmatrix.ctoken_id
            INNER JOIN pxr_ctoken_ledger.row_hash ON cmatrix.id = row_hash.cmatrix_id
            WHERE cmatrix."1_1" = 'user03'
            AND row_hash."3_5_2_1" = 1000027;
            `);
            expect(beforeCtoken.length).toBe(1);
            expect(afterCtoken.length).toBe(1);
            expect(beforeCtoken[0].pxr_id === afterCtoken[0].pxr_id).toBe(true);
            expect(beforeCtoken[0].ctoken === afterCtoken[0].ctoken).toBe(false);
        });
         */
        /**
        test('正常: 削除、userId重複、wf/app間で重複、別個人', async () => {
            _myConditionBookManageServer = new MyConditionBookManageServer(200);
            // 非削除確認のため、重複している他方にも追加処理を行う
            const response0 = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManage) })
                .send(Request.AddDuplicateUserIdOthers2);
            expect(response0.status).toBe(200);
            // 標的pxrIdのctokenにリクエストのデータ識別子が紐づいていることを確認
            const connection = await connectDatabase();
            const addCtoken = await connection.query(`
            SELECT ctoken.pxr_id, row_hash."3_5_2_1", row_hash."3_5_5_1" FROM pxr_ctoken_ledger.ctoken
            INNER JOIN pxr_ctoken_ledger.cmatrix ON ctoken.id = cmatrix.ctoken_id
            INNER JOIN pxr_ctoken_ledger.row_hash ON cmatrix.id = row_hash.cmatrix_id
            WHERE cmatrix."1_1" = 'user03'
            AND row_hash."3_1_1" = '3ed6063f-8234-c46f-1947-d0c414aa0485';
            `);
            expect(addCtoken.length).toBe(1);
            expect(addCtoken[0].pxr_id).toBe('DuplicateUserIdB');
            expect(addCtoken[0]['3_5_2_1']).toBe(null);
            expect(addCtoken[0]['3_5_5_1']).toBe('1000127');

            // 削除リクエスト
            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfManage) })
                .send(Request.DeleteDuplicateUseerIdOthers);

            expect(response.status).toBe(200);
            // 標的のctokenに紐づくcmatrixが削除されていることを確認（全てのrow_hashを削除したためcmatrixも削除される）
            const deleteCtoken = await connection.query(`
            SELECT ctoken.pxr_id, row_hash."3_5_2_1", row_hash."3_5_5_1", cmatrix.is_disabled FROM pxr_ctoken_ledger.ctoken
            INNER JOIN pxr_ctoken_ledger.cmatrix ON ctoken.id = cmatrix.ctoken_id
            INNER JOIN pxr_ctoken_ledger.row_hash ON cmatrix.id = row_hash.cmatrix_id
            WHERE cmatrix."1_1" = 'user03'
            AND row_hash."3_1_1" = 'ab7f35bb-9c35-0ec7-83c9-2411f59e6390';
            `);
            expect(deleteCtoken.length).toBe(1);
            expect(deleteCtoken[0].pxr_id).toBe('DuplicateUserIdA');
            expect(deleteCtoken[0]['3_5_2_1']).toBe('1000027');
            expect(deleteCtoken[0]['3_5_5_1']).toBe(null);
            expect(deleteCtoken[0].is_disabled).toBe(true);
            // 標的以外のctokenに紐づくcmatrixが削除されていないことを確認
            const nonDeleteCtoken = await connection.query(`
            SELECT ctoken.pxr_id, row_hash."3_5_2_1", row_hash."3_5_5_1", cmatrix.is_disabled FROM pxr_ctoken_ledger.ctoken
            INNER JOIN pxr_ctoken_ledger.cmatrix ON ctoken.id = cmatrix.ctoken_id
            INNER JOIN pxr_ctoken_ledger.row_hash ON cmatrix.id = row_hash.cmatrix_id
            WHERE cmatrix."1_1" = 'user03'
            AND row_hash."3_1_1" = '3ed6063f-8234-c46f-1947-d0c414aa0485';
            `);
            expect(nonDeleteCtoken.length).toBe(1);
            expect(nonDeleteCtoken[0].pxr_id).toBe('DuplicateUserIdB');
            expect(nonDeleteCtoken[0]['3_5_2_1']).toBe(null);
            expect(nonDeleteCtoken[0]['3_5_5_1']).toBe('1000127');
            expect(nonDeleteCtoken[0].is_disabled).toBe(false);
        });
         */
        test('異常: 追加、条件に一致する連携が存在しない', async () => {
            _myConditionBookManageServer = new MyConditionBookManageServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfManage) })
                .send(Request.AddNoExistCooperate);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe(Message.NO_PXRID);
        });
        test('異常: 更新、条件に一致する連携が存在しない', async () => {
            _myConditionBookManageServer = new MyConditionBookManageServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfManage) })
                .send(Request.UpdateNoExistCooperate);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe(Message.NO_PXRID);
        });
    });
});
