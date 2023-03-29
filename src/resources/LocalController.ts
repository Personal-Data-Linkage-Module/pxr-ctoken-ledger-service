/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Request, Response } from 'express';
import {
    JsonController, Post, Header, Res, Req, UseBefore
} from 'routing-controllers';
import PostLocalReqDto from './dto/PostLocalReqDto';
/* eslint-enable */
import EnableSimpleBackPressure from './backpressure/EnableSimpleBackPressure';
import OperatorService from '../services/OperatorService';
import LocalService from '../services/LocalService';
import { transformAndValidate } from 'class-transformer-validator';
import LocalRequestValidator from './validator/LocalRequestValidator';

@JsonController('/ctoken-ledger')
export default class LocalController {
    /**
     * Local-CToken差分登録
     * @param req
     * @param res
     */
    @Post('/local')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    @EnableSimpleBackPressure()
    @UseBefore(LocalRequestValidator)
    async postLocal (@Req() req: Request, @Res() res: Response): Promise<any> {
        const dto = await transformAndValidate(
            PostLocalReqDto,
            req.body
        ) as PostLocalReqDto;

        // オペレーター情報を取得
        const operator = await OperatorService.authMe(req);

        // 更新を実行
        const ret = await LocalService.postLocal(operator, dto);

        // レスポンスを返す
        return ret;
    }
}
