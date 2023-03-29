/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import BookManageDto from './dto/BookManageDto';
import { CoreOptions } from 'request';
/* eslint-enable */
import { doPostRequest } from '../common/DoRequest';
import AppError from '../common/AppError';
import { ResponseCode } from '../common/ResponseCode';

export default class BookManageService {
    /**
     * My-Condition-Book管理サービスのBook一覧取得で全Bookを取得する
     * @param bookManageDto
     */
    public async postSearchBook (bookManageDto: BookManageDto): Promise<any> {
        const operator = bookManageDto.getOperator();
        const message = bookManageDto.getMessage();
        const bodyStr = JSON.stringify({
            pxrId: null,
            createdAt: null,
            includeDeleteCoop: true
        });

        // 接続のためのオプションを生成
        const options: CoreOptions = {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                session: operator.encoded
            },
            body: bodyStr
        };

        try {
            // MyConditionBook管理サービスからデータ蓄積定義取得を呼び出す
            const result = await doPostRequest(bookManageDto.getUrl(), options);

            // レスポンスコードが200以外の場合
            // ステータスコードを判定
            const statusCode: string = result.response.statusCode.toString();
            if (result.response.statusCode === ResponseCode.BAD_REQUEST) {
                // 応答が400の場合、エラーを返す
                throw new AppError(message.FAILED_BOOK_MANAGE_DATA_ACCUMU_GET, ResponseCode.BAD_REQUEST);
            } else if (statusCode.match(/^5.+/)) {
                // 応答が500系の場合、エラーを返す
                throw new AppError(message.FAILED_BOOK_MANAGE_DATA_ACCUMU_GET, ResponseCode.SERVICE_UNAVAILABLE);
            } else if (result.response.statusCode !== ResponseCode.OK) {
                // 応答が200以外の場合、エラーを返す
                throw new AppError(message.FAILED_BOOK_MANAGE_DATA_ACCUMU_GET, ResponseCode.UNAUTHORIZED);
            }
            // 利用者ID連携取得情報を戻す
            return result.body;
        } catch (err) {
            if (err.name === AppError.NAME) {
                throw err;
            }
            // サービスへの接続に失敗した場合
            throw new AppError(message.FAILED_CONNECT_TO_BOOK_MANAGE_DATA_ACCUMU_GET, ResponseCode.SERVICE_UNAVAILABLE, err);
        }
    }
}
