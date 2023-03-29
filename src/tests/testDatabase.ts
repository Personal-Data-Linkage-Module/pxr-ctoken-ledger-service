/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import { connectDatabase } from '../common/Connection';

export async function clear () {
    const connection = await connectDatabase();
    await connection.query(`
        DELETE FROM pxr_ctoken_ledger.ctoken;
        DELETE FROM pxr_ctoken_ledger.cmatrix;
        DELETE FROM pxr_ctoken_ledger.ctoken_history;
        DELETE FROM pxr_ctoken_ledger.document;
        DELETE FROM pxr_ctoken_ledger.row_hash;
        SELECT SETVAL('pxr_ctoken_ledger.ctoken_id_seq', 1, false);
        SELECT SETVAL('pxr_ctoken_ledger.cmatrix_id_seq', 1, false);
        SELECT SETVAL('pxr_ctoken_ledger.ctoken_history_id_seq', 1, false);
        SELECT SETVAL('pxr_ctoken_ledger.document_id_seq', 1, false);
        SELECT SETVAL('pxr_ctoken_ledger.row_hash_id_seq', 1, false);
    `);
}

export async function insertInitialData () {
    const connection = await connectDatabase();
    await connection.query(`
    INSERT INTO pxr_ctoken_ledger.ctoken
    (
        pxr_id,
        ctoken,
        ctoken_create_at,
        is_disabled,
        created_by,
        created_at,
        updated_by,
        updated_at
    )
    VALUES
      (
        'wf-pj2-2-test-01',
        '150516b08ec7a6eeef772a1022ba23b30f3bc9b833cb86c3d92220ff9e625c5d',
        '2020-09-16 20:21:33.616',
        'false',
         'pxr_user',
        NOW(),
        'pxr_user',
        NOW()
    ),
    (
        'dummy.test.org',
        '150516b08ec7a6eeef772a1022ba23b30f3bc9b833cb86c3d92220ff9e625c5d',
        '2020-09-16 20:21:33.616',
        'false',
         'pxr_user',
        NOW(),
        'pxr_user',
        NOW()
    );

    INSERT INTO pxr_ctoken_ledger.cmatrix
    (
        ctoken_id,
        actor_catalog_code,
        actor_catalog_version,
        "1_1",
        cmatrix_hash,
        cmatrix_hash_create_at,
        is_disabled,
        created_by,
        created_at,
        updated_by,
        updated_at
    )
    VALUES
      (
        1,
        1000004,
        1,
        'wf-pj2-2-test-01',
        'df4dcd6b9da10c972409e7785c4b6f2ddbd17fd2e43c2d7d4ed062a795a5f50a',
        '2020-09-16 18:44:22.622',
        'false',
        'pxr_user',
        NOW(),
        'pxr_user',
        NOW()
    ),
    (
        2,
        1000004,
        1,
        'wf-pj2-2-test-01',
        'df4dcd6b9da10c972409e7785c4b6f2ddbd17fd2e43c2d7d4ed062a795a5f50a',
        '2020-09-16 18:44:22.622',
        'false',
        'pxr_user',
        NOW(),
        'pxr_user',
        NOW()
    );
    INSERT INTO pxr_ctoken_ledger.row_hash
    (
        cmatrix_id,
        "3_1_1",
        "3_1_2_1",
        "3_1_2_2",
        "3_2_1",
        "3_2_2",
        "3_5_1_1",
        "3_5_1_2",
        "3_5_2_1",
        "3_5_2_2",
        "3_5_5_1",
        "3_5_5_2",
        "4_1_1",
        "4_1_2_1",
        "4_1_2_2",
        "4_4_1_1",
        "4_4_1_2",
        "4_4_2_1",
        "4_4_2_2",
        "4_4_5_1",
        "4_4_5_2",
        row_hash,
        row_hash_create_at,
        is_disabled,
        created_by,
        created_at,
        updated_by,
        updated_at
    )
    VALUES
      (
        1,
        'd1da7e44-219e-4bbf-af4a-7589f8702d96',
        1000005,
        1,
        '2020-02-19 15:00:00',
        '2020-02-20 15:00:00',
        1000004,
        1,
        null,
        null,
        1000007,
        1,
        '667459ed-81aa-4226-8b3d-2decb7db2911',
        1000006,
        1,
        1000004,
        1,
        null,
        null,
        1000007,
        1,
        '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
        '2020-09-06 22:29:17',
        'false',
        'pxr_user',
        NOW(),
        'pxr_user',
        NOW()
    ),
    (
        2,
        'd1da7e44-219e-4bbf-af4a-7589f8702d96',
        1000005,
        1,
        '2020-02-19 15:00:00',
        '2020-02-20 15:00:00',
        1000004,
        1,
        null,
        null,
        1000007,
        1,
        '667459ed-81aa-4226-8b3d-2decb7db2911',
        1000006,
        1,
        1000004,
        1,
        null,
        null,
        1000007,
        1,
        '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
        '2020-09-06 22:29:17',
        'false',
        'pxr_user',
        NOW(),
        'pxr_user',
        NOW()
    ),
    (
        2,
        'd1da7e44-219e-4bbf-af4a-7589f8702d96',
        1000005,
        1,
        '2020-02-19 15:00:00',
        '2020-02-20 15:00:00',
        1000005,
        1,
        null,
        null,
        1000007,
        1,
        '667459ed-81aa-4226-8b3d-2decb7db2911',
        1000006,
        1,
        1000005,
        1,
        null,
        null,
        1000008,
        1,
        '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
        '2020-09-06 22:29:17',
        'false',
        'pxr_user',
        NOW(),
        'pxr_user',
        NOW()
    ),
    (
        2,
        'd1da7e44-219e-4bbf-af4a-7589f8702d96',
        1000005,
        1,
        '2020-02-19 15:00:00',
        '2020-02-20 15:00:00',
        1000010,
        1,
        null,
        null,
        1000007,
        1,
        '667459ed-81aa-4226-8b3d-2decb7db2911',
        1000011,
        1,
        1000005,
        1,
        null,
        null,
        1000007,
        1,
        '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
        '2020-09-06 22:29:17',
        'false',
        'pxr_user',
        NOW(),
        'pxr_user',
        NOW()
    );
    INSERT INTO pxr_ctoken_ledger.document
    (
        row_hash_id,
        _1_1,
        _1_2_1,
        _1_2_2,
        _2_1,
        _3_1_1,
        _3_1_2,
        _3_2_1,
        _3_2_2,
        _3_5_1,
        _3_5_2,
        is_disabled,
        created_by,
        created_at,
        updated_by,
        updated_at
      )
    VALUES
      (
        1,
        'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
        1000004,
        1,
        '2020-02-19 15:00:00',
        1000004,
        1,
        null,
        null,
        1000007,
        1,
        'false',
        'pxr_user',
        NOW(),
        'pxr_user',
        NOW()
    ),
    (
        2,
        'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
        1000004,
        1,
        '2020-02-19 15:00:00',
        1000004,
        1,
        null,
        null,
        1000007,
        1,
        'false',
        'pxr_user',
        NOW(),
        'pxr_user',
        NOW()
    ),
    (
        3,
        'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
        1000004,
        1,
        '2020-02-19 15:00:00',
        1000004,
        1,
        null,
        null,
        1000007,
        1,
        'false',
        'pxr_user',
        NOW(),
        'pxr_user',
        NOW()
    );
    INSERT INTO pxr_ctoken_ledger.ctoken_history
    (
        ctoken_id,
        ctoken,
        ctoken_create_at,
        is_disabled,
        created_by,
        created_at,
        updated_by,
        updated_at
    )
    VALUES
      (
        1,
        '150516b08ec7a6eeef772a1022ba23b30f3bc9b833cb86c3d92220ff9e625c5d',
        '2020-09-16 20:21:33.616',
        'false',
        'pxr_user',
        NOW(),
        'pxr_user',
        NOW()
    ),
    (
        2,
        '150516b08ec7a6eeef772a1022ba23b30f3bc9b833cb86c3d92220ff9e625c5d',
        '2020-09-16 20:21:33.616',
        'false',
        'pxr_user',
        NOW(),
        'pxr_user',
        NOW()
    );
    `);
}
