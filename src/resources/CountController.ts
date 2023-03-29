/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Request, Response } from 'express';
import {
    JsonController, Post, Body, Header, Res, Req, UseBefore
} from 'routing-controllers';
import AppError from '../common/AppError';
import PostCountReqDto from './dto/PostCountReqDto';
import EnableSimpleBackPressure from './backpressure/EnableSimpleBackPressure';
import OperatorService from '../services/OperatorService';
import CountService from '../services/CountService';
import CountServiceDto from '../services/dto/CountServiceDto';
import CountRequestValidator from './validator/CountRequestValidator';
import { transformAndValidate } from 'class-transformer-validator';
import OperatorDomain from '../domains/OperatorDomain';
import { ResponseCode } from '../common/ResponseCode';
/* eslint-enable */
import Config from '../common/Config';
const message = Config.ReadConfig('./config/message.json');

@JsonController('/ctoken-ledger')
export default class CountController {
    /**
     * CToken件数検索
     * @param req
     * @param res
     */
    @Post('/count')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    @EnableSimpleBackPressure()
    @UseBefore(CountRequestValidator)
    async postCount (@Req() req: Request, @Res() res: Response): Promise<any> {
        const dto = await transformAndValidate(
            PostCountReqDto,
            req.body
        ) as PostCountReqDto;

        // オペレーター情報を取得
        const operator = await OperatorService.authMe(req);

        // 個人の場合、PXR-IDは出来ない
        if (operator.type === OperatorDomain.TYPE_PERSONAL_NUMBER && dto.pxrId) {
            throw new AppError(message.SPECIFY_NOT_PXRID, ResponseCode.BAD_REQUEST);
        }

        // dtoに値を設定
        const serviceDto = new CountServiceDto();
        serviceDto.setStartAt(dto.createAt ? dto.createAt.start : null);
        serviceDto.setEndAt(dto.createAt ? dto.createAt.end : null);
        serviceDto.setPxrId(dto.pxrId);
        serviceDto.setDocument(dto.document);
        serviceDto.setEvent(dto.event);
        serviceDto.setThing(dto.thing);
        serviceDto.setOperator(operator);

        // 本人性確認コード照合を実行
        const ret = await CountService.postCount(operator, serviceDto);

        // レスポンスを返す
        return ret.toJSON();
    }
}
