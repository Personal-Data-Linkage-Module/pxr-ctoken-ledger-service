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
    OneToMany,
    JoinColumn
} from 'typeorm';
import CMatrixEntity from './CMatrixEntity';
import CTokenHistoryEntity from './CTokenHistoryEntity';

/**
 * CTokenテーブルエンティティ
 */
@Entity('ctoken')
export default class CTokenEntity extends BaseEntity {
    /** ID */
    @PrimaryGeneratedColumn({ type: 'bigint' })
    readonly id: number;

    /** PXR-ID */
    @Column({ type: 'varchar', length: 255, nullable: false, name: 'pxr_id' })
    pxrId: string = '';

    /** CToken */
    @Column({ type: 'varchar', length: 255, nullable: false })
    ctoken: string = '';

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

    /** CToken履歴テーブルのレコード */
    @OneToMany(type => CTokenHistoryEntity, history => history.ctoken)
    @JoinColumn({ name: 'id', referencedColumnName: 'ctokenId' })
    ctokenHistorys: CTokenHistoryEntity[];

    /** 行列ハッシュテーブルのレコード */
    @OneToMany(type => CMatrixEntity, matrix => matrix.ctoken)
    @JoinColumn({ name: 'id', referencedColumnName: 'ctokenId' })
    cmatrixs: CMatrixEntity[];
}
