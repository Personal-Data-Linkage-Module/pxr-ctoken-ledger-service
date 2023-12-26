/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import {
    IsDefined,
    IsString,
    IsNumber,
    ValidateNested,
    IsOptional,
    IsNotEmpty,
    IsArray
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { transformToNumber } from '../../common/Transform';
/* eslint-enable */

/**
 * POST: PXR-ID検索APIのリクエストDto
 */
export class CodeVersionObject {
    /**
     * コード
     */
    @Transform(({ value }) => { return transformToNumber(value); })
    @IsNumber()
    @IsNotEmpty()
    @IsDefined()
        _value: number;

    /**
     * バージョン
     */
    @Transform(({ value }) => { return transformToNumber(value); })
    @IsNumber()
    @IsDefined()
        _ver: number;
}

export class Condition {
    /**
     * 検索種別
     */
    @IsDefined()
    @IsNotEmpty()
    @IsString()
        type: string;

    /**
     * カタログコード
     */
    @IsDefined()
    @IsNotEmpty()
    @Type(() => CodeVersionObject)
    @ValidateNested()
        _code: CodeVersionObject;

    /**
     * 最小値
     */
    @IsDefined()
    @IsNotEmpty()
    @Transform(({ value }) => { return transformToNumber(value); })
    @IsNumber()
        min: number;

    /**
     * 最大値
     */
    @IsOptional()
    @Transform(({ value }) => { return transformToNumber(value); })
    @IsNumber()
        max: number;
}

export default class PostSearchReqDto {
    /**
     * 検索対象PXR-ID配列
     */
    @IsDefined()
    @IsNotEmpty()
    @IsArray()
        pxrId: string[];

    /**
     * 検索条件
     */
    @IsDefined()
    @IsNotEmpty()
    @IsArray()
    @Type(() => Condition)
    @ValidateNested({ each: true })
        condition: Condition[];
}
