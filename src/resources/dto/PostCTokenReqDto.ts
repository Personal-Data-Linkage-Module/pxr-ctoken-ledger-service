/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Transform, Type } from 'class-transformer';
import {
    IsString,
    IsDate,
    IsNumber,
    IsArray,
    IsOptional,
    IsDefined,
    ValidateNested
} from 'class-validator';
import { transformToDateTime } from '../../common/Transform';

export class SearchPeriod {
    /** 検索対象開始日時 */
    @IsDate()
    @IsOptional()
    @Transform(transformToDateTime)
    start: Date;

    /** 検索対象終了日時 */
    @IsDate()
    @IsOptional()
    @Transform(transformToDateTime)
    end: Date;
}

export class Code {
    @IsNumber()
    @IsDefined()
    _value: number;

    @IsNumber()
    @IsDefined()
    _ver: number;
}
/* eslint-enable */

export class Identifier {
    /** document */
    @IsArray()
    @IsOptional()
    document: string[];

    /** event */
    @IsArray()
    @IsOptional()
    event: string[];

    /** thing */
    @IsArray()
    @IsOptional()
    thing: string[];
}
export default class PostCTokenReqDto {
    /** 検索対象日付 */
    @IsOptional()
    @ValidateNested()
    @Type(() => SearchPeriod)
    createAt: SearchPeriod;

    /**
     * offset
     */
    @IsOptional()
    @IsNumber()
    offset: number = 0;

    /**
     * limit
     */
    @IsOptional()
    @IsNumber()
    limit: number = 10;

    /** 検索PXR-ID */
    @IsString()
    @IsOptional()
    pxrId: string;

    /** document */
    @IsArray()
    @IsOptional()
    @ValidateNested()
    @Type(() => Code)
    document: Code[];

    /** event */
    @IsArray()
    @IsOptional()
    @ValidateNested()
    @Type(() => Code)
    event: Code[];

    /** thing */
    @IsArray()
    @IsOptional()
    @ValidateNested()
    @Type(() => Code)
    thing: Code[];

    /** identifier */
    @IsOptional()
    @ValidateNested()
    @Type(() => Identifier)
    identifier: Identifier;
}
