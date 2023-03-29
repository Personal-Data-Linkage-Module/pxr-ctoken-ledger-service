/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { createConnection, getConnectionManager, Connection, getConnection } from 'typeorm';
/* eslint-enable */
import CTokenEntity from '../repositories/postgres/CTokenEntity';
import CTokenHistoryEntity from '../repositories/postgres/CTokenHistoryEntity';
import DocumentEntity from '../repositories/postgres/DocumentEntity';
import CMatrixEntity from '../repositories/postgres/CMatrixEntity';
import RowHashEntity from '../repositories/postgres/RowHashEntity';
import fs = require('fs');

// 環境ごとにconfigファイルを読み込む
let connectOption: any = null;
connectOption = JSON.parse(fs.readFileSync('./config/ormconfig.json', 'utf-8'));

// エンティティを設定
connectOption['entities'] = [
    CTokenEntity,
    CTokenHistoryEntity,
    DocumentEntity,
    CMatrixEntity,
    RowHashEntity
];

/**
 * コネクションの生成
 */
export async function connectDatabase (): Promise<Connection> {
    let connection = null;
    try {
        // データベースに接続
        connection = await createConnection(connectOption);
    } catch (err) {
        if (err.name === 'AlreadyHasActiveConnectionError') {
            // すでにコネクションが張られている場合には、流用する
            connection = getConnectionManager().get('postgres');
        } else {
            throw err;
        }
    }
    // 接続したコネクションを返却
    return connection;
}
