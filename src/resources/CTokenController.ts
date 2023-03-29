/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Request, Response } from 'express';
import {
    JsonController, Post, Header, Res, Req, UseBefore
} from 'routing-controllers';
import { transformAndValidate } from 'class-transformer-validator';
import EnableSimpleBackPressure from './backpressure/EnableSimpleBackPressure';
import AppError from '../common/AppError';
import Config from '../common/Config';
import { ResponseCode } from '../common/ResponseCode';
import OperatorDomain from '../domains/OperatorDomain';
import PostCTokenReqDto from './dto/PostCTokenReqDto';
import CTokenRequestValidator from './validator/CTokenRequestValidator';
import CTokenServiceDto from '../services/dto/CTokenServiceDto';
import CTokenService from '../services/CTokenService';
import OperatorService from '../services/OperatorService';
/* eslint-enable */
const message = Config.ReadConfig('./config/message.json');

@JsonController('/ctoken-ledger')
export default class CTokenController {
    /**
     * CToken取得
     * @param req
     * @param res
     */
    @Post()
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    @EnableSimpleBackPressure()
    @UseBefore(CTokenRequestValidator)
    async postCount (@Req() req: Request, @Res() res: Response): Promise<any> {
        const dto = await transformAndValidate(
            PostCTokenReqDto,
            req.body
        ) as PostCTokenReqDto;

        // オペレーター情報を取得
        const operator = await OperatorService.authMe(req);

        // 個人の場合、PXR-IDは指定出来ない
        if (operator.type === OperatorDomain.TYPE_PERSONAL_NUMBER && dto.pxrId) {
            throw new AppError(message.SPECIFY_NOT_PXRID, ResponseCode.BAD_REQUEST);
        }

        // dtoに値を設定
        const serviceDto = new CTokenServiceDto();
        serviceDto.setStartAt(dto.createAt ? dto.createAt.start : null);
        serviceDto.setEndAt(dto.createAt ? dto.createAt.end : null);
        serviceDto.setOffset(dto.offset);
        serviceDto.setLimit(dto.limit);
        serviceDto.setPxrId(dto.pxrId);
        serviceDto.setDocument(dto.document);
        serviceDto.setEvent(dto.event);
        serviceDto.setThing(dto.thing);
        if (dto.identifier) {
            serviceDto.setDocumentIdentifier(dto.identifier.document);
            serviceDto.setEventIdentifier(dto.identifier.event);
            serviceDto.setThingIdentifier(dto.identifier.thing);
        }
        serviceDto.setOperator(operator);

        // 本人性確認コード照合を実行
        const ret = await CTokenService.postGetCToken(serviceDto);

        // レスポンスを返す
        return ret.toJSON();
    }
}
