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
    ManyToOne,
    JoinColumn,
    OneToMany
} from 'typeorm';
import CTokenEntity from './CTokenEntity';
import RowHashEntity from './RowHashEntity';

/**
 * 行列ハッシュテーブルエンティティ
 */
@Entity('cmatrix')
export default class CMatrixEntity extends BaseEntity {
    /** ID */
    @PrimaryGeneratedColumn({ type: 'bigint' })
    readonly id: number;

    /** CTokenID */
    @Column({ type: 'bigint', nullable: false, name: 'ctoken_id' })
    ctokenId: number;

    /** アクターカタログコード */
    @Column({ type: 'bigint', nullable: false, name: 'actor_catalog_code' })
    actorCatalogCode: number;

    /** アクターカタログバージョン */
    @Column({ type: 'bigint', nullable: false, name: 'actor_catalog_version' })
    actorCatalogVersion: number;

    /** 1_1: 個人識別子 */
    @Column({ type: 'varchar', length: 255, nullable: false, name: '1_1' })
    personIdentifier: string;

    /** 行列ハッシュ */
    @Column({ type: 'varchar', length: 255, nullable: false, name: 'cmatrix_hash' })
    cmatrixHash: string;

    /** 行列ハッシュ生成時間 */
    @Column({ type: 'timestamp without time zone', nullable: false, name: 'cmatrix_hash_create_at', onUpdate: 'now()' })
    cmatrixHashCreateAt: Date;

    /** 削除フラグ */
    @Column({ type: 'boolean', nullable: false, default: false, name: 'is_disabled' })
    isDisabled: boolean = false;

    /** 登録者 */
    @Column({ type: 'varchar', length: 255, nullable: false, name: 'created_by' })
    createdBy: string = '';

    /** 登録日時 */
    @CreateDateColumn({ type: 'timestamp without time zone', name: 'created_at' })
    readonly createdAt: Date;

    /** 更新者 */
    @Column({ type: 'varchar', length: 255, nullable: false, name: 'updated_by' })
    updatedBy: string = '';

    /** 更新日時 */
    @UpdateDateColumn({ type: 'timestamp without time zone', name: 'updated_at', onUpdate: 'now()' })
    readonly updatedAt: Date;

    /** CTokenテーブルのレコード */
    @ManyToOne(type => CTokenEntity, ctoken => ctoken.cmatrixs)
    @JoinColumn({ name: 'ctoken_id', referencedColumnName: 'id' })
    ctoken: CTokenEntity;

    /** 行ハッシュテーブルのレコード */
    @OneToMany(type => RowHashEntity, rowHash => rowHash.matrix)
    @JoinColumn({ name: 'id', referencedColumnName: 'matrixId' })
    rowHashs: RowHashEntity[];
}
