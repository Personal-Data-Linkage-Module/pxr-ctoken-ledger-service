/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { CoreOptions } from 'request';
import CatalogDto from './dto/CatalogDto';
/* eslint-enable */
import { doGetRequest, doPostRequest } from '../common/DoRequest';
import AppError from '../common/AppError';
import Config from '../common/Config';
import { ResponseCode } from '../common/ResponseCode';
import urljoin = require('url-join');
const config = Config.ReadConfig('./config/config.json');
const message = Config.ReadConfig('./config/message.json');

export default class CatalogService {
    /**
     * カタログ情報取得
     * @param catalogDto
     */
    public async getCatalogInfo (catalogDto: CatalogDto): Promise<any> {
        // URLを生成
        let url = null;
        const procNum = catalogDto.getProcNum();
        if (procNum === 0) {
            const code: string = catalogDto.getCode().toString();
            url = urljoin(config['catalog']['get'], code);
        } else {
            // ネームスペースでカタログを取得する
            url = config['catalog']['get'] + '/?ns=' + catalogDto.getNs();
        }
        const options = {
            headers: {
                accept: 'application/json',
                session: catalogDto.getOperator().encoded
            }
        };

        try {
            // カタログサービスからカタログを取得
            const result = await doGetRequest(url, options);

            // ステータスコードを判定
            const statusCode: string = result.response.statusCode.toString();
            if (result.response.statusCode === ResponseCode.BAD_REQUEST) {
                // 応答が400の場合、エラーを返す
                throw new AppError(message.FAILED_GET_CATALOG, ResponseCode.BAD_REQUEST);
            } else if (statusCode.match(/^5.+/)) {
                // 応答が500系の場合、エラーを返す
                throw new AppError(message.FAILED_GET_CATALOG, ResponseCode.SERVICE_UNAVAILABLE);
            } else if (result.response.statusCode !== ResponseCode.OK) {
                // 応答が200 OK以外の場合、エラーを返す
                throw new AppError(message.FAILED_GET_CATALOG, ResponseCode.UNAUTHORIZED);
            }
            // カタログ情報を戻す
            return result.body;
        } catch (err) {
            if (err.name === AppError.NAME) {
                throw err;
            }
            // サービスへの接続に失敗した場合
            throw new AppError(message.FAILED_CONNECT_TO_CATALOG, ResponseCode.SERVICE_UNAVAILABLE, err);
        }
    }

    /**
     * 複数カタログ情報取得
     * @param catalogDto
     * @param codeList
     */
    public async getCatalogList (catalogDto: CatalogDto, codeList: {}[]): Promise<any> {
        const operator = catalogDto.getOperator();
        const body = JSON.stringify(codeList);
        const options: CoreOptions = {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body),
                session: operator.encoded
            },
            body: body
        };
        try {
            // カタログサービスからカタログを取得
            const result = await doPostRequest(config['catalog']['get'], options);

            // ステータスコードを判定
            const statusCode: string = result.response.statusCode.toString();
            if (result.response.statusCode === ResponseCode.BAD_REQUEST) {
                // 応答が400の場合、エラーを返す
                throw new AppError(message.FAILED_GET_CATALOG, ResponseCode.BAD_REQUEST);
            } else if (statusCode.match(/^5.+/)) {
                // 応答が500系の場合、エラーを返す
                throw new AppError(message.FAILED_GET_CATALOG, ResponseCode.SERVICE_UNAVAILABLE);
            } else if (result.response.statusCode !== ResponseCode.OK) {
                // 応答が200 OK以外の場合、エラーを返す
                throw new AppError(message.FAILED_GET_CATALOG, ResponseCode.UNAUTHORIZED);
            }
            // カタログ情報を戻す
            return result.body;
        } catch (err) {
            if (err.name === AppError.NAME) {
                throw err;
            }
            // サービスへの接続に失敗した場合
            throw new AppError(message.FAILED_CONNECT_TO_CATALOG, ResponseCode.SERVICE_UNAVAILABLE, err);
        }
    }

    /**
     * カタログ取得
     * @param catalogDto
     */
    public async getCatalog (catalogDto: CatalogDto): Promise<any> {
        // ネームスペースでカタログを取得する
        const url = config['catalog']['getCatalogName'];
        const options = {
            headers: {
                accept: 'application/json',
                session: encodeURIComponent(JSON.stringify(catalogDto.getOperator()))
            }
        };

        // カタログサービスからカタログを取得
        const result = await doGetRequest(url, options);

        // ステータスコードを判定
        const statusCode: string = result.response.statusCode.toString();
        if (result.response.statusCode === ResponseCode.BAD_REQUEST) {
            // 応答が400の場合、エラーを返す
            throw new AppError(message.FAILED_GET_CATALOG, ResponseCode.BAD_REQUEST);
        } else if (statusCode.match(/^5.+/)) {
            // 応答が500系の場合、エラーを返す
            throw new AppError(message.FAILED_GET_CATALOG, ResponseCode.SERVICE_UNAVAILABLE);
        } else if (result.response.statusCode !== ResponseCode.OK) {
            // 応答が200 OK以外の場合、エラーを返す
            throw new AppError(message.FAILED_GET_CATALOG, ResponseCode.UNAUTHORIZED);
        }
        // カタログ情報を戻す
        return result.body;
    }
}
