/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    JoinColumn,
    ManyToOne
} from 'typeorm';
import CTokenEntity from './CTokenEntity';

/**
 * CToken履歴テーブルエンティティ
 */
@Entity('ctoken_history')
export default class CTokenHistoryEntity extends BaseEntity {
    /** ID */
    @PrimaryGeneratedColumn({ type: 'bigint' })
    readonly id: number;

    /** CTokenID */
    @Column({ type: 'bigint', nullable: false, name: 'ctoken_id' })
    ctokenId: number;

    /** CToken */
    @Column({ type: 'varchar', length: 255, nullable: false, name: 'ctoken' })
    ctokenHistory: string = '';

    /** CToken作成時間 */
    @Column({ type: 'timestamp without time zone', nullable: false, name: 'ctoken_create_at', onUpdate: 'now()' })
    ctokenCreateAt: Date;

    /** 削除フラグ */
    @Column({ type: 'boolean', nullable: false, default: false, name: 'is_disabled' })
    isDisabled: boolean = false;

    /** 登録者 */
    @Column({ type: 'varchar', length: 255, nullable: false, name: 'created_by' })
    createdBy: string = '';

    /** 登録日時 */
    @CreateDateColumn({ type: 'timestamp without time zone', nullable: false, name: 'created_at' })
    readonly createdAt: Date;

    /** 更新者 */
    @Column({ type: 'varchar', length: 255, nullable: false, name: 'updated_by' })
    updatedBy: string = '';

    /** 更新日時 */
    @UpdateDateColumn({ type: 'timestamp without time zone', nullable: false, name: 'updated_at', onUpdate: 'now()' })
    readonly updatedAt: Date;

    /** CTokenテーブルのレコード */
    @ManyToOne(type => CTokenEntity, ctoken => ctoken.cmatrixs)
    @JoinColumn({ name: 'ctoken_id', referencedColumnName: 'id' })
    ctoken: CTokenEntity;
}
