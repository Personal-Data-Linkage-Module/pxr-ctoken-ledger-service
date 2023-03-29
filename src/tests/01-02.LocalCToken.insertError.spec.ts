/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import supertest = require('supertest');
import { Application } from '../resources/config/Application';
import { OperatorServer /*, CtokenLedgerServer */ } from './StubServer';
import { MyConditionBookManageServer /*, CtokenLedgerServer */ } from './StubServer';
import { clear } from './testDatabase';
import { insertInitialData } from './testDatabase';
import { Request } from './Request';
import { Session } from './Session';
import Config from '../common/Config';
/* eslint-enable */
const Message = Config.ReadConfig('./config/message.json');

// テストモジュールをインポート
jest.mock('../repositories/EntityOperation');

// 対象アプリケーションを取得
const app = new Application();
const expressApp = app.express.app;

// Unit対象のURL（ベース）
const baseURI = '/ctoken-ledger/local';

// スタブサーバー（オペレータサービス）
let _operatorServer: OperatorServer = null;

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

        if (_myConditionBookManageServer) {
            _myConditionBookManageServer.server.close();
            _myConditionBookManageServer = null;
        }
    });
    describe('Ctoken-Ledger登録API POST: ' + baseURI, () => {
        test('異常: insert時にエラー（追加）', async () => {
            _myConditionBookManageServer = new MyConditionBookManageServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.Add);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_SAVE_ENTITY);
        });

        test('異常: insert時にエラー（更新）', async () => {
            _myConditionBookManageServer = new MyConditionBookManageServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.Update);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_SAVE_ENTITY);
        });

        test('異常: insert時にエラー（削除）', async () => {
            _myConditionBookManageServer = new MyConditionBookManageServer(200);

            const response = await supertest(expressApp)
                .post(baseURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wfStaff) })
                .send(Request.Delete);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_SAVE_ENTITY);
        });
    });
});
