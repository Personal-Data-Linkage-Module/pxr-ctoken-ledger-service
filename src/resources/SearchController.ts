/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Request, Response } from 'express';
import {
    JsonController, Post, Header, Res, Req, UseBefore
} from 'routing-controllers';
/* eslint-enable */
import { transformAndValidate } from 'class-transformer-validator';
import EnableSimpleBackPressure from './backpressure/EnableSimpleBackPressure';
import OperatorService from '../services/OperatorService';
import SearchService from '../services/SearchService';
import SearchRequestValidator from './validator/SearchRequestValidator';
import PostSearchReqDto from './dto/PostSearchReqDto';
import SearchDto from '../services/dto/SearchDto';

@JsonController('/ctoken-ledger')
export default class SearchController {
    /**
     * PXR-ID検索
     * @param req
     * @param res
     */
    @Post('/search')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    @EnableSimpleBackPressure()
    @UseBefore(SearchRequestValidator)
    async postSearch (@Req() req: Request, @Res() res: Response): Promise<any> {
        // リクエストバリデーション
        let dto = await transformAndValidate(PostSearchReqDto, req.body);
        dto = <PostSearchReqDto>dto;

        // オペレーター情報を取得
        const operator = await OperatorService.authMe(req);

        // 検索を実行
        const serviceDto = new SearchDto();
        serviceDto.setOperator(operator);
        serviceDto.setRequest<PostSearchReqDto>(dto);
        const ret = await SearchService.searchPxrId(serviceDto);

        // レスポンスを返す
        return ret.getAsJson();
    }
}
