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
import CMatrixEntity from './CMatrixEntity';
import DocumentEntity from './DocumentEntity';

/**
 * 行ハッシュテーブルエンティティ
 */
@Entity('row_hash')
export default class RowHashEntity extends BaseEntity {
    /** ID */
    @PrimaryGeneratedColumn({ type: 'bigint' })
    readonly id: number;

    /** CMatrixID */
    @Column({ type: 'bigint', nullable: false, name: 'cmatrix_id' })
    cmatrixId: number;

    /** イベント識別子 */
    @Column({ type: 'varchar', length: 255, nullable: false, name: '3_1_1' })
    eventIdentifier: string;

    /** イベント種別カタログコード */
    @Column({ type: 'bigint', nullable: false, name: '3_1_2_1' })
    eventCatalogCode: number

    /** イベント種別カタログバージョン */
    @Column({ type: 'bigint', nullable: false, name: '3_1_2_2' })
    eventCatalogVersion: number;

    /** イベント開始時間 */
    @Column({ type: 'timestamp without time zone', name: '3_2_1' })
    eventStartAt: Date;

    /** イベント終了時間 */
    @Column({ type: 'timestamp without time zone', name: '3_2_2' })
    eventEndAt: Date;

    /** イベントを発生させたアクター識別子カタログコード */
    @Column({ type: 'bigint', nullable: false, name: '3_5_1_1' })
    eventActorCode: number;

    /** イベントを発生させたアクター識別子カタログバージョン */
    @Column({ type: 'bigint', nullable: false, name: '3_5_1_2' })
    eventActorVersion: number;

    /** ワークフロー識別子カタログコード */
    @Column({ type: 'bigint', name: '3_5_2_1' })
    eventWfCatalogCode: number;

    /** ワークフロー識別子カタログバージョン */
    @Column({ type: 'bigint', name: '3_5_2_2' })
    eventWfCatalogVersion: number;

    /** アプリケーション識別子カタログコード */
    @Column({ type: 'bigint', name: '3_5_5_1' })
    eventAppCatalogCode: number;

    /** アプリケーション識別子カタログバージョン */
    @Column({ type: 'bigint', name: '3_5_5_2' })
    eventAppCatalogVersion: number;

    /** モノ識別子 */
    @Column({ type: 'varchar', length: 255, nullable: false, name: '4_1_1' })
    thingIdentifier: string;

    /** モノ識別子カタログコード */
    @Column({ type: 'bigint', nullable: false, name: '4_1_2_1' })
    thingCatalogCode: number;

    /** モノ識別子カタログバージョン */
    @Column({ type: 'bigint', nullable: false, name: '4_1_2_2' })
    thingCatalogVersion: number;

    /** モノを発生させたアクター識別子カタログコード */
    @Column({ type: 'bigint', nullable: false, name: '4_4_1_1' })
    thingActorCode: number;

    /** モノを発生させたアクター識別子カタログバージョン */
    @Column({ type: 'bigint', nullable: false, name: '4_4_1_2' })
    thingActorVersion: number;

    /** ワークフロー識別子カタログコード */
    @Column({ type: 'bigint', name: '4_4_2_1' })
    thingWfCatalogCode: number;

    /** ワークフロー識別子カタログバージョン */
    @Column({ type: 'bigint', name: '4_4_2_2' })
    thingWfCatalogVersion: number;

    /** アプリケーション識別子カタログコード */
    @Column({ type: 'bigint', name: '4_4_5_1' })
    thingAppCatalogCode: number;

    /** アプリケーション識別子カタログバージョン */
    @Column({ type: 'bigint', name: '4_4_5_2' })
    thingAppCatalogVersion: number;

    /** 行ハッシュ */
    @Column({ type: 'varchar', length: 255, nullable: false, name: 'row_hash' })
    rowHash: string;

    /** 行ハッシュ生成時間 */
    @Column({ type: 'timestamp without time zone', nullable: false, name: 'row_hash_create_at' })
    rowHashCreateAt: Date;

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
    @ManyToOne(type => CMatrixEntity, matrix => matrix.rowHashs)
    @JoinColumn({ name: 'cmatrix_id', referencedColumnName: 'id' })
    matrix: CMatrixEntity;

    /** 行列ハッシュテーブルのレコード */
    @OneToMany(type => DocumentEntity, document => document.rowHash)
    @JoinColumn({ name: 'id', referencedColumnName: 'rowHashId' })
    documents: DocumentEntity[];
}
