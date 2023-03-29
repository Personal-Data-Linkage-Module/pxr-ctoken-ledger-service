/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Request, Response, NextFunction } from 'express';
import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
/* eslint-enable */
import AppError from '../../common/AppError';
import { ResponseCode } from '../../common/ResponseCode';
import Config from '../../common/Config';
import PostCountReqDto from '../dto/PostCountReqDto';
import { transformAndValidate } from 'class-transformer-validator';
const Message = Config.ReadConfig('./config/message.json');

/**
 * 本人性確認コード照合のバリデーションチェック
 */
@Middleware({ type: 'before' })
export default class CountRequestValidator implements ExpressMiddlewareInterface {
    async use (request: Request, response: Response, next: NextFunction) {
        // リクエストが空か、確認する
        if (!request.body || JSON.stringify(request.body) === JSON.stringify({})) {
            throw new AppError(Message.REQUEST_IS_EMPTY, ResponseCode.BAD_REQUEST);
        }

        let dto = await transformAndValidate(
            PostCountReqDto,
            request.body
        );
        if (Array.isArray(dto)) {
            throw new AppError('リクエストボディが配列であることを許容しません', 400);
        }
        dto = dto as PostCountReqDto;

        // document, event, thingのいずれか2つ以上が指定されている場合、エラーとする
        if (
            (dto.document && dto.event && dto.document.length > 0 && dto.event.length > 0) ||
            (dto.document && dto.thing && dto.document.length > 0 && dto.thing.length > 0) ||
            (dto.event && dto.thing && dto.event.length > 0 && dto.thing.length > 0)
        ) {
            throw new AppError(Message.CONDITION_DUPLICATE, ResponseCode.BAD_REQUEST);
        }

        next();
    }
}
