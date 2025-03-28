/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
export namespace Request {
    /**
     * search(CToken件数検索)、createAtがnull
     */
    export const SearchCreateAtNull = JSON.stringify({
        createAt: null
    });

    /**
     * search(CToken件数検索)、createAtがnull(ドキュメント)
     */
    export const SearchCreateAtNullDocument = JSON.stringify({
        createAt: null,
        document: [
            {
                _value: 1000004,
                _ver: 1
            }
        ]
    });
    /**
     * search(CToken件数検索)、createAtがnull(イベント)
     */
    export const SearchCreateAtNullEvent = JSON.stringify({
        createAt: null,
        event: [
            {
                _value: 1000005,
                _ver: 1
            }
        ]
    });

    /**
     * search(CToken件数検索)、createAtがnull(モノ)
     */
    export const SearchCreateAtNullThing = JSON.stringify({
        createAt: null,
        thing: [
            {
                _value: 1000006,
                _ver: 1
            }
        ]
    });

    /**
     * search(CToken件数検索)
     */
    export const Search = JSON.stringify({
        createAt: {}
    });

    /**
     * search(CToken件数検索、event指定なし)
     */
    export const SearchEventAll = JSON.stringify({
        createAt: {},
        event: []
    });

    /**
     * search(CToken件数検索)_ドキュメント指定
     */
    export const SearchDocumentSingle = JSON.stringify({
        createAt: {
            start: '2020-01-01T00:00:00.000+0900',
            end: '2030-03-31T00:00:00.000+0900'
        },
        document: [
            {
                _value: 1000004,
                _ver: 1
            }
        ]
    });

    /**
     * search(CToken件数検索)_ドキュメント指定(複数指定)
     */
    export const SearchDocument = JSON.stringify({
        createAt: {
            start: '2020-01-01T00:00:00.000+0900',
            end: '2030-03-31T00:00:00.000+0900'
        },
        document: [
            {
                _value: 1000004,
                _ver: 1
            },
            {
                _value: 1000014,
                _ver: 1
            }
        ]
    });

    /**
     * search(CToken件数検索)_ドキュメント指定
     */
    export const SearchDocumentId = JSON.stringify({
        createAt: {
            start: '2020-01-01T00:00:00.000+0900',
            end: '2022-03-31T00:00:00.000+0900'
        },
        identifier: {
            document: ['aaaa7e44-219e-4bbf-af4a-7589f8702d96']
        }
    });

    /**
     * search(CToken件数検索)_イベント指定(複数指定)
     */
    export const SearchEvent = JSON.stringify({
        createAt: {
            start: '2020-01-01T00:00:00.000+0900',
            end: '2022-03-31T00:00:00.000+0900'
        },
        event: [{
            _value: 1000005,
            _ver: 1
        },
        {
            _value: 1000008,
            _ver: 1
        }]
    });

    /**
     * search(CToken件数検索)_イベント指定
     */
    export const SearchEventSingle = JSON.stringify({
        createAt: {
            start: '2020-01-01T00:00:00.000+0900',
            end: '2022-03-31T00:00:00.000+0900'
        },
        event: [{
            _value: 1000005,
            _ver: 1
        }]
    });

    /**
     * search(CToken件数検索)_イベント指定
     */
    export const SearchEventId = JSON.stringify({
        createAt: {
            start: '2020-01-01T00:00:00.000+0900',
            end: '2022-03-31T00:00:00.000+0900'
        },
        identifier: {
            event: [
                'd1da7e44-219e-4bbf-af4a-7589f8702d96'
            ]
        }
    });

    /**
     * search(CToken件数検索)_モノ指定(複数指定)
     */
    export const SearchThing = JSON.stringify({
        createAt: {
            start: '2020-01-01T00:00:00.000+0900',
            end: '2022-03-31T00:00:00.000+0900'
        },
        thing: [{
            _value: 1000006,
            _ver: 1
        },
        {
            _value: 1000011,
            _ver: 1
        }]
    });

    /**
     * search(CToken件数検索)_モノ指定
     */
    export const SearchThingSingle = JSON.stringify({
        createAt: {
            start: '2020-01-01T00:00:00.000+0900',
            end: '2022-03-31T00:00:00.000+0900'
        },
        thing: [{
            _value: 1000006,
            _ver: 1
        }]
    });

    /**
     * search(CToken件数検索)_モノ指定
     */
    export const SearchThingId = JSON.stringify({
        createAt: {
            start: '2020-01-01T00:00:00.000+0900',
            end: '2022-03-31T00:00:00.000+0900'
        },
        identifier: {
            thing: [
                '667459ed-81aa-4226-8b3d-2decb7db2911'
            ]
        }
    });

    /**
     * search(PXR-ID検索、event指定なし)
     */
    export const SearchPxrIdAllEvent = JSON.stringify({
        createAt: {
            start: '2020-01-01T00:00:00.000+0900',
            end: '2022-03-31T00:00:00.000+0900'
        },
        pxrId: 'wf-pj2-2-test-01',
        event: []
    });

    /**
     * search(PXR-ID検索)
     */
    export const SearchPxrId = JSON.stringify({
        createAt: {
            start: '2020-01-01T00:00:00.000+0900',
            end: '2022-03-31T00:00:00.000+0900'
        },
        pxrId: 'wf-pj2-2-test-01',
        document: [],
        event: [],
        thing: []
    });

    /**
     * searchPxrId(PXR-ID_AND検索)
     */
    export const SearchPxrIdAnd = JSON.stringify({
        pxrId: [
            'wf-pj2-2-test-01'
        ],
        condition: [
            {
                type: 'and',
                _code: {
                    _value: 1000004,
                    _ver: 1
                },
                min: 1,
                max: 100
            },
            {
                type: 'and',
                _code: {
                    _value: 1000005,
                    _ver: 1
                },
                min: 1,
                max: 100
            },
            {
                type: 'and',
                _code: {
                    _value: 1000006,
                    _ver: 1
                },
                min: 1,
                max: 100
            }
        ]
    });

    /**
     * searchPxrId(PXR-ID_AND検索、最大値より多い)
     */
    export const SearchPxrIdAndOverMax = JSON.stringify({
        pxrId: [
            'wf-pj2-2-test-01'
        ],
        condition: [
            {
                type: 'and',
                _code: {
                    _value: 1000005,
                    _ver: 1
                },
                min: 1,
                max: 2
            }
        ]
    });

    /**
     * searchPxrId(PXR-ID_AND検索_最小値不正)
     */
    export const SearchPxrIdMin = JSON.stringify({
        pxrId: [
            'wf-pj2-2-test-01'
        ],
        condition: [
            {
                type: 'and',
                _code: {
                    _value: 1000004,
                    _ver: 1
                },
                min: 100,
                max: 100
            }
        ]
    });

    /**
     * searchPxrId(PXR-ID_AND検索_最大値不正)
     */
    export const SearchPxrIdMax = JSON.stringify({
        pxrId: [
            'wf-pj2-2-test-01'
        ],
        condition: [
            {
                type: 'and',
                _code: {
                    _value: 1000004,
                    _ver: 1
                },
                min: 2,
                max: 2
            }
        ]
    });

    /**
     * searchPxrId(PXR-ID_AND検索、document, event, thing以外のカタログを指定)
     */
    export const SearchPxrIdAndInvalidDataType = JSON.stringify({
        pxrId: [
            'wf-pj2-2-test-01'
        ],
        condition: [
            {
                type: 'and',
                _code: {
                    _value: 1000004,
                    _ver: 1
                },
                min: 1,
                max: 100
            },
            {
                type: 'and',
                _code: {
                    _value: 1000002,
                    _ver: 1
                },
                min: 1,
                max: 100
            }
        ]
    });

    /**
     * searchPxrId(PXR-ID_OR検索)
     */
    export const SearchPxrIdOr = JSON.stringify({
        pxrId: [
            'wf-pj2-2-test-01'
        ],
        condition: [
            {
                type: 'or',
                _code: {
                    _value: 1000004,
                    _ver: 1
                },
                min: 1,
                max: 100
            },
            {
                type: 'or',
                _code: {
                    _value: 1000005,
                    _ver: 1
                },
                min: 1,
                max: 100
            },
            {
                type: 'or',
                _code: {
                    _value: 1000006,
                    _ver: 1
                },
                min: 1,
                max: 100
            }
        ]
    });

    /**
     * searchPxrId(PXR-ID_OR検索_最小値不正)
     */
    export const SearchPxrIdOrMin = JSON.stringify({
        pxrId: [
            'wf-pj2-2-test-01'
        ],
        condition: [
            {
                type: 'or',
                _code: {
                    _value: 1000004,
                    _ver: 1
                },
                min: 100,
                max: 100
            }
        ]
    });

    /**
     * searchPxrId(PXR-ID_OR検索_最大値不正)
     */
    export const SearchPxrIdOrMax = JSON.stringify({
        pxrId: [
            'wf-pj2-2-test-01'
        ],
        condition: [
            {
                type: 'or',
                _code: {
                    _value: 1000004,
                    _ver: 1
                },
                min: 1,
                max: 1
            }
        ]
    });

    /**
     * searchPxrId(PXR-ID_OR検索、最大値より多い)
     */
    export const SearchPxrIdOrOverMax = JSON.stringify({
        pxrId: [
            'wf-pj2-2-test-01'
        ],
        condition: [
            {
                type: 'or',
                _code: {
                    _value: 1000005,
                    _ver: 1
                },
                min: 1,
                max: 2
            }
        ]
    });

    /**
     * add
     */
    export const Add = JSON.stringify({
        add: [
            {
                '1_1': 'wf-pj2-2-test-01.1000007.app',
                document: [],
                event: {
                    '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                    '3_1_2_1': 1000008,
                    '3_1_2_2': 1,
                    '3_2_1': '2020-02-20T00:00:00.000+0900',
                    '3_2_2': '2020-02-21T00:00:00.000+0900',
                    '3_5_1_1': 1000004,
                    '3_5_1_2': 1,
                    '3_5_2_1': null,
                    '3_5_2_2': null,
                    '3_5_5_1': 1000007,
                    '3_5_5_2': 1
                },
                thing: [
                    {
                        '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                        '4_1_2_1': 1000011,
                        '4_1_2_2': 1,
                        '4_4_1_1': 1000004,
                        '4_4_1_2': 1,
                        '4_4_2_1': 1000007,
                        '4_4_2_2': 1,
                        '4_4_5_1': 0,
                        '4_4_5_2': 0,
                        rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                        rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                    }
                ]
            }
        ],
        update: [],
        delete: []
    });

    /**
     * add（ドキュメントあり）
     */
    export const AddInDoc = JSON.stringify({
        add: [
            {
                '1_1': 'wf-pj2-2-test-01.1000007.app',
                document: [
                    {
                        '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                        '2_n_1_2_1': 52,
                        '2_n_1_2_2': 1,
                        '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                        '2_n_3_1_1': 1000004,
                        '2_n_3_1_2': 1,
                        '2_n_3_2_1': 1000007,
                        '2_n_3_2_2': 1
                    },
                    {
                        '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                        '2_n_1_2_1': 52,
                        '2_n_1_2_2': 1,
                        '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                        '2_n_3_1_1': 1000004,
                        '2_n_3_1_2': 1,
                        '2_n_3_5_1': 1000016,
                        '2_n_3_5_2': 1
                    }
                ],
                event: {
                    '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                    '3_1_2_1': 1000008,
                    '3_1_2_2': 1,
                    '3_2_1': '2020-02-20T00:00:00.000+0900',
                    '3_2_2': '2020-02-21T00:00:00.000+0900',
                    '3_5_1_1': 1000004,
                    '3_5_1_2': 1,
                    '3_5_2_1': 0,
                    '3_5_2_2': 0,
                    '3_5_5_1': 1000007,
                    '3_5_5_2': 1
                },
                thing: [
                    {
                        '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                        '4_1_2_1': 1000011,
                        '4_1_2_2': 1,
                        '4_4_1_1': 1000004,
                        '4_4_1_2': 1,
                        '4_4_2_1': 1000007,
                        '4_4_2_2': 1,
                        '4_4_5_1': 0,
                        '4_4_5_2': 0,
                        rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                        rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                    }
                ]
            }
        ],
        update: [],
        delete: []
    });

    /**
     * add（ドキュメントあり、1件以上_event:3_1_1(eventIdentifier)1件目と2件目は異なるデータを使用）
     */
    export const AddInDoc2 = JSON.stringify({
        add: [
            {
                '1_1': 'wf-pj2-2-test-01.1000007.app',
                document: [
                    {
                        '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                        '2_n_1_2_1': 52,
                        '2_n_1_2_2': 1,
                        '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                        '2_n_3_1_1': 1000004,
                        '2_n_3_1_2': 1,
                        '2_n_3_2_1': 1000007,
                        '2_n_3_2_2': 1
                    }
                ],
                event: {
                    '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                    '3_1_2_1': 1000008,
                    '3_1_2_2': 1,
                    '3_2_1': '2020-02-20T00:00:00.000+0900',
                    '3_2_2': '2020-02-21T00:00:00.000+0900',
                    '3_5_1_1': 1000004,
                    '3_5_1_2': 1,
                    '3_5_2_1': null,
                    '3_5_2_2': null,
                    '3_5_5_1': 1000007,
                    '3_5_5_2': 1
                },
                thing: [
                    {
                        '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                        '4_1_2_1': 1000011,
                        '4_1_2_2': 1,
                        '4_4_1_1': 1000004,
                        '4_4_1_2': 1,
                        '4_4_2_1': 1000007,
                        '4_4_2_2': 1,
                        '4_4_5_1': 0,
                        '4_4_5_2': 0,
                        rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                        rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                    },
                    {
                        '4_1_1': '767459ed-81aa-4226-8b3d-2decb7db2911',
                        '4_1_2_1': 1000011,
                        '4_1_2_2': 1,
                        '4_4_1_1': 1000004,
                        '4_4_1_2': 1,
                        '4_4_2_1': 1000007,
                        '4_4_2_2': 1,
                        '4_4_5_1': 0,
                        '4_4_5_2': 0,
                        rowHash: '4411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                        rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                    }
                ]
            },
            {
                '1_1': 'wf-pj2-2-test-02.1000007.app',
                document: [
                    {
                        '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                        '2_n_1_2_1': 52,
                        '2_n_1_2_2': 1,
                        '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                        '2_n_3_1_1': 1000004,
                        '2_n_3_1_2': 1,
                        '2_n_3_5_1': 1000016,
                        '2_n_3_5_2': 1
                    }
                ],
                event: {
                    '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                    '3_1_2_1': 1000008,
                    '3_1_2_2': 1,
                    '3_2_1': '2020-02-20T00:00:00.000+0900',
                    '3_2_2': '2020-02-21T00:00:00.000+0900',
                    '3_5_1_1': 1000004,
                    '3_5_1_2': 1,
                    '3_5_2_1': null,
                    '3_5_2_2': null,
                    '3_5_5_1': 1000007,
                    '3_5_5_2': 1
                },
                thing: [
                    {
                        '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                        '4_1_2_1': 1000011,
                        '4_1_2_2': 1,
                        '4_4_1_1': 1000004,
                        '4_4_1_2': 1,
                        '4_4_2_1': 1000007,
                        '4_4_2_2': 1,
                        '4_4_5_1': 0,
                        '4_4_5_2': 0,
                        rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                        rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                    }
                ]
            }
        ],
        update: [],
        delete: []
    });

    /**
     * add（app）
     */
    export const AddFromApp = JSON.stringify({
        add: [
            {
                '1_1': 'wf-pj2-2-test-01.1000107.app',
                document: [],
                event: {
                    '3_1_1': '3cd642e0-b01c-5b30-f027-33cb7aa8ba55',
                    '3_1_2_1': 1000008,
                    '3_1_2_2': 1,
                    '3_2_1': '2020-02-20T00:00:00.000+0900',
                    '3_2_2': '2020-02-21T00:00:00.000+0900',
                    '3_5_1_1': 1000004,
                    '3_5_1_2': 1,
                    '3_5_2_1': 0,
                    '3_5_2_2': 0,
                    '3_5_5_1': 1000107,
                    '3_5_5_2': 1
                },
                thing: [
                    {
                        '4_1_1': 'a4ee20d2-f72d-da4c-dde4-868bf25bec8b',
                        '4_1_2_1': 1000011,
                        '4_1_2_2': 1,
                        '4_4_1_1': 1000004,
                        '4_4_1_2': 1,
                        '4_4_2_1': 0,
                        '4_4_2_2': 0,
                        '4_4_5_1': 1000107,
                        '4_4_5_2': 1,
                        rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                        rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                    }
                ]
            }
        ],
        update: [],
        delete: []
    });

    /**
     * add（PXR_ID無し）
     */
    export const AddNoPxrId = JSON.stringify({
        add: [
            {
                '1_1': 'no_pxr_id_user',
                document: [],
                event: {
                    '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                    '3_1_2_1': 1000008,
                    '3_1_2_2': 1,
                    '3_2_1': '2020-02-20T00:00:00.000+0900',
                    '3_2_2': '2020-02-21T00:00:00.000+0900',
                    '3_5_1_1': 1000004,
                    '3_5_1_2': 1,
                    '3_5_2_1': 0,
                    '3_5_2_2': 0,
                    '3_5_5_1': 1000007,
                    '3_5_5_2': 1
                },
                thing: [
                    {
                        '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                        '4_1_2_1': 1000011,
                        '4_1_2_2': 1,
                        '4_4_1_1': 1000004,
                        '4_4_1_2': 1,
                        '4_4_2_1': 0,
                        '4_4_2_2': 0,
                        '4_4_5_1': 1000007,
                        '4_4_5_2': 1,
                        rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                        rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                    }
                ]
            }
        ],
        update: [],
        delete: []
    });

    /**
     * update
     */
    export const Update = JSON.stringify({
        add: [],
        update: [
            {
                '1_1': 'wf-pj2-2-test-01.1000007.app',
                document: [],
                event: {
                    '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                    '3_1_2_1': 1000008,
                    '3_1_2_2': 1,
                    '3_2_1': '2020-02-20T00:00:00.000+0900',
                    '3_2_2': '2020-02-21T00:00:00.000+0900',
                    '3_5_1_1': 1000004,
                    '3_5_1_2': 1,
                    '3_5_2_1': null,
                    '3_5_2_2': null,
                    '3_5_5_1': 1000007,
                    '3_5_5_2': 1
                },
                thing: [
                    {
                        '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                        '4_1_2_1': 1000011,
                        '4_1_2_2': 1,
                        '4_4_1_1': 1000004,
                        '4_4_1_2': 1,
                        '4_4_2_1': 1000007,
                        '4_4_2_2': 1,
                        '4_4_5_1': 0,
                        '4_4_5_2': 0,
                        rowHash: '5de740c1670d3fbf383274ca6301717b3a474151065e4f8384992ba3d326efff',
                        rowHashCreateAt: '2020-09-06T22:39:40.000Z'
                    }
                ]
            }
        ],
        delete: []
    });

    /**
     * update（ドキュメントあり）
     */
    export const UpdateInDoc = JSON.stringify({
        add: [],
        update: [
            {
                '1_1': 'wf-pj2-2-test-01.1000007.app',
                document: [
                    {
                        '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96',
                        '2_n_1_2_1': 52,
                        '2_n_1_2_2': 1,
                        '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                        '2_n_3_1_1': 1000004,
                        '2_n_3_1_2': 1,
                        '2_n_3_2_1': 1000007,
                        '2_n_3_2_2': 1
                    }
                ],
                event: {
                    '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                    '3_1_2_1': 1000008,
                    '3_1_2_2': 1,
                    '3_2_1': '2020-02-20T00:00:00.000+0900',
                    '3_2_2': '2020-02-21T00:00:00.000+0900',
                    '3_5_1_1': 1000004,
                    '3_5_1_2': 1,
                    '3_5_2_1': null,
                    '3_5_2_2': null,
                    '3_5_5_1': 1000007,
                    '3_5_5_2': 1
                },
                thing: [
                    {
                        '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                        '4_1_2_1': 1000011,
                        '4_1_2_2': 1,
                        '4_4_1_1': 1000004,
                        '4_4_1_2': 1,
                        '4_4_2_1': 1000007,
                        '4_4_2_2': 1,
                        '4_4_5_1': 0,
                        '4_4_5_2': 0,
                        rowHash: '5de740c1670d3fbf383274ca6301717b3a474151065e4f8384992ba3d326efff',
                        rowHashCreateAt: '2020-09-06T22:39:40.000Z'
                    }
                ]
            }
        ],
        delete: []
    });

    /**
     * update (rowHash更新無し)
     * update から event.'3_1_1'末尾を変更
     */
    export const UpdateWithoutRowHash = JSON.stringify({
        add: [],
        update: [
            {
                '1_1': 'wf-pj2-2-test-01.1000007.app',
                document: [],
                event: {
                    '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d99',
                    '3_1_2_1': 1000008,
                    '3_1_2_2': 1,
                    '3_2_1': '2020-02-20T00:00:00.000+0900',
                    '3_2_2': '2020-02-21T00:00:00.000+0900',
                    '3_5_1_1': 1000004,
                    '3_5_1_2': 1,
                    '3_5_2_1': null,
                    '3_5_2_2': null,
                    '3_5_5_1': 1000007,
                    '3_5_5_2': 1
                },
                thing: [
                    {
                        '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                        '4_1_2_1': 1000011,
                        '4_1_2_2': 1,
                        '4_4_1_1': 1000004,
                        '4_4_1_2': 1,
                        '4_4_2_1': 1000007,
                        '4_4_2_2': 1,
                        '4_4_5_1': 0,
                        '4_4_5_2': 0,
                        rowHash: '5de740c1670d3fbf383274ca6301717b3a474151065e4f8384992ba3d326efff',
                        rowHashCreateAt: '2020-09-06T22:39:40.000Z'
                    }
                ]
            }
        ],
        delete: []
    });

    /**
     * update（ドキュメントあり、ドキュメント更新無し）
     * update（ドキュメントあり）から document.'2_n_1_1' 末尾を変更
     */
    export const UpdateInDocWithoutUpdate = JSON.stringify({
        add: [],
        update: [
            {
                '1_1': 'wf-pj2-2-test-01.1000007.app',
                document: [
                    {
                        '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d99',
                        '2_n_1_2_1': 52,
                        '2_n_1_2_2': 1,
                        '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                        '2_n_3_1_1': 1000004,
                        '2_n_3_1_2': 1,
                        '2_n_3_2_1': 1000007,
                        '2_n_3_2_2': 1
                    }
                ],
                event: {
                    '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                    '3_1_2_1': 1000008,
                    '3_1_2_2': 1,
                    '3_2_1': '2020-02-20T00:00:00.000+0900',
                    '3_2_2': '2020-02-21T00:00:00.000+0900',
                    '3_5_1_1': 1000004,
                    '3_5_1_2': 1,
                    '3_5_2_1': null,
                    '3_5_2_2': null,
                    '3_5_5_1': 1000007,
                    '3_5_5_2': 1
                },
                thing: [
                    {
                        '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                        '4_1_2_1': 1000011,
                        '4_1_2_2': 1,
                        '4_4_1_1': 1000004,
                        '4_4_1_2': 1,
                        '4_4_2_1': 1000007,
                        '4_4_2_2': 1,
                        '4_4_5_1': 0,
                        '4_4_5_2': 0,
                        rowHash: '5de740c1670d3fbf383274ca6301717b3a474151065e4f8384992ba3d326efff',
                        rowHashCreateAt: '2020-09-06T22:39:40.000Z'
                    }
                ]
            }
        ],
        delete: []
    });

    /**
     * update（PXR_ID無し）
     */
    export const UpdateNoPxrId = JSON.stringify({
        add: [],
        update: [
            {
                '1_1': 'no_pxr_id_user',
                document: [],
                event: {
                    '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                    '3_1_2_1': 1000008,
                    '3_1_2_2': 1,
                    '3_2_1': '2020-02-20T00:00:00.000+0900',
                    '3_2_2': '2020-02-21T00:00:00.000+0900',
                    '3_5_1_1': 1000004,
                    '3_5_1_2': 1,
                    '3_5_2_1': 0,
                    '3_5_2_2': 0,
                    '3_5_5_1': 1000007,
                    '3_5_5_2': 1
                },
                thing: [
                    {
                        '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                        '4_1_2_1': 1000011,
                        '4_1_2_2': 1,
                        '4_4_1_1': 1000004,
                        '4_4_1_2': 1,
                        '4_4_2_1': 1000007,
                        '4_4_2_2': 1,
                        '4_4_5_1': 0,
                        '4_4_5_2': 0,
                        rowHash: '5de740c1670d3fbf383274ca6301717b3a474151065e4f8384992ba3d326efff',
                        rowHashCreateAt: '2020-09-06T22:39:40.000Z'
                    }
                ]
            }
        ],
        delete: []
    });

    /**
     * delete
     */
    export const Delete = JSON.stringify({
        add: [],
        update: [],
        delete: [
            {
                '1_1': 'wf-pj2-2-test-01.1000007.wf',
                document: [],
                event: {
                    '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                },
                thing: [
                    {
                        '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911'
                    }
                ]
            }
        ]
    });

    /**
     * delete（ドキュメントあり）
     */
    export const DeleteInDoc = JSON.stringify({
        add: [],
        update: [],
        delete: [
            {
                '1_1': 'wf-pj2-2-test-01.1000007.wf',
                document: [
                    {
                        '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96'
                    }
                ],
                event: {
                    '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                },
                thing: [
                    {
                        '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911'
                    }
                ]
            }
        ]
    });

    /**
     * delete（ドキュメントあり、1件以上）
     */
    export const DeleteInDoc2 = JSON.stringify({
        add: [],
        update: [],
        delete: [
            {
                '1_1': 'wf-pj2-2-test-01.1000007.wf',
                document: [
                    {
                        '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96'
                    }
                ],
                event: {
                    '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                },
                thing: [
                    {
                        '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911'
                    }
                ]
            },
            {
                '1_1': 'wf-pj2-2-test-02.1000007.wf',
                document: [
                    {
                        '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d96'
                    }
                ],
                event: {
                    '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                },
                thing: [
                    {
                        '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911'
                    }
                ]
            }
        ]
    });

    /**
     * delete（ドキュメントあり、ドキュメント削除なし）
     * DeleteInDoc2 から '2_n_1_1' の末尾を変更
     */
    export const DeleteInDocWithoutDelete = JSON.stringify({
        add: [],
        update: [],
        delete: [
            {
                '1_1': 'wf-pj2-2-test-02.1000007.wf',
                document: [
                    {
                        '2_n_1_1': 'aaaa7e44-219e-4bbf-af4a-7589f8702d98'
                    }
                ],
                event: {
                    '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                },
                thing: [
                    {
                        '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911'
                    }
                ]
            }
        ]
    });

    /**
     * delete（PXR_ID無し）
     */
    export const DeleteNoPxrId = JSON.stringify({
        add: [],
        update: [],
        delete: [
            {
                '1_1': '',
                document: [],
                event: {
                    '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96'
                },
                thing: [
                    {
                        '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911'
                    }
                ]
            }
        ]
    });

    /**
     * array
     */
    export const Array = JSON.stringify([{
        add: [
            {
                '1_1': 'wf-pj2-2-test-01',
                document: [],
                event: {
                    '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                    '3_1_2_1': 1000008,
                    '3_1_2_2': 1,
                    '3_2_1': '2020-02-20T00:00:00.000+0900',
                    '3_2_2': '2020-02-21T00:00:00.000+0900',
                    '3_5_1_1': 1000004,
                    '3_5_1_2': 1,
                    '3_5_2_1': 1000007,
                    '3_5_2_2': 1,
                    '3_5_5_1': 0,
                    '3_5_5_2': 0
                },
                thing: [
                    {
                        '4_1_1': '667459ed-81aa-4226-8b3d-2decb7db2911',
                        '4_1_2_1': 1000011,
                        '4_1_2_2': 1,
                        '4_4_1_1': 1000004,
                        '4_4_1_2': 1,
                        '4_4_2_1': 1000007,
                        '4_4_2_2': 1,
                        '4_4_5_1': 0,
                        '4_4_5_2': 0,
                        rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                        rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                    }
                ]
            }
        ],
        update: [],
        delete: []
    }]);

    /**
     * add
     */
    export const AllEmpty = JSON.stringify({
        add: [],
        update: [],
        delete: []
    });

    /**
     * テストデータ01(アクターコードが一致するドキュメントが複数ある、かつそれらのappコードが一致)
     */
    export const TestData01 = JSON.stringify({
        add: [
            {
                '1_1': 'wf-pj2-2-test-01',
                document: [
                    {
                        '2_n_1_1': 'aaaa6e11-219e-4bbf-af4a-7589f8702d96',
                        '2_n_1_2_1': 1000004,
                        '2_n_1_2_2': 1,
                        '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                        '2_n_3_1_1': 1000004,
                        '2_n_3_1_2': 1,
                        '2_n_3_2_1': null,
                        '2_n_3_2_2': null,
                        '2_n_3_5_1': 1000016,
                        '2_n_3_5_2': 1
                    }
                ],
                event: {
                    '3_1_1': 'aaaa7e11-219e-4bbf-af4a-7589f8702d96',
                    '3_1_2_1': 1000008,
                    '3_1_2_2': 1,
                    '3_2_1': '2020-02-20T00:00:00.000+0900',
                    '3_2_2': '2020-02-21T00:00:00.000+0900',
                    '3_5_1_1': 1000004,
                    '3_5_1_2': 1,
                    '3_5_2_1': null,
                    '3_5_2_2': null,
                    '3_5_5_1': 1000016,
                    '3_5_5_2': 1
                },
                thing: [
                    {
                        '4_1_1': 'aaaa59ed-81aa-4226-8b3d-2decb7db2911',
                        '4_1_2_1': 1000011,
                        '4_1_2_2': 1,
                        '4_4_1_1': 1000004,
                        '4_4_1_2': 1,
                        '4_4_2_1': 1000007,
                        '4_4_2_2': 1,
                        '4_4_5_1': 0,
                        '4_4_5_2': 0,
                        rowHash: '5111d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                        rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                    }
                ]
            },
            {
                '1_1': 'wf-pj2-2-test-01',
                document: [
                    {
                        '2_n_1_1': 'aabb7e11-219e-4bbf-af4a-7589f8702d96',
                        '2_n_1_2_1': 1000004,
                        '2_n_1_2_2': 2,
                        '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                        '2_n_3_1_1': 1000004,
                        '2_n_3_1_2': 1,
                        '2_n_3_2_1': null,
                        '2_n_3_2_2': null,
                        '2_n_3_5_1': 1000015,
                        '2_n_3_5_2': 1
                    }
                ],
                event: {
                    '3_1_1': 'aabb7e11-219e-4bbf-af4a-7589f8702d96',
                    '3_1_2_1': 1000008,
                    '3_1_2_2': 1,
                    '3_2_1': '2020-02-20T00:00:00.000+0900',
                    '3_2_2': '2020-02-21T00:00:00.000+0900',
                    '3_5_1_1': 1000004,
                    '3_5_1_2': 1,
                    '3_5_2_1': null,
                    '3_5_2_2': null,
                    '3_5_5_1': 1000015,
                    '3_5_5_2': 1
                },
                thing: [
                    {
                        '4_1_1': 'aabb59ed-81aa-4226-8b3d-2decb7db2911',
                        '4_1_2_1': 1000011,
                        '4_1_2_2': 1,
                        '4_4_1_1': 1000004,
                        '4_4_1_2': 1,
                        '4_4_2_1': 1000007,
                        '4_4_2_2': 1,
                        '4_4_5_1': 0,
                        '4_4_5_2': 0,
                        rowHash: '2222d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                        rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                    }
                ]
            }
        ],
        update: [],
        delete: []
    });

    /**
     * テストデータ11(アクターコードが一致するドキュメントが複数ある、かつそれらのwfコードが一致)
     */
    export const TestData11 = JSON.stringify({
        add: [
            {
                '1_1': 'wf-pj2-2-test-01',
                document: [
                    {
                        '2_n_1_1': 'bbaa7e11-219e-4bbf-af4a-7589f8702d96',
                        '2_n_1_2_1': 1000014,
                        '2_n_1_2_2': 1,
                        '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                        '2_n_3_1_1': 1000004,
                        '2_n_3_1_2': 1,
                        '2_n_3_2_1': 1000007,
                        '2_n_3_2_2': 1
                    }
                ],
                event: {
                    '3_1_1': 'bbaa7e11-219e-4bbf-af4a-7589f8702d96',
                    '3_1_2_1': 1000008,
                    '3_1_2_2': 1,
                    '3_2_1': '2020-02-20T00:00:00.000+0900',
                    '3_2_2': '2020-02-21T00:00:00.000+0900',
                    '3_5_1_1': 1000004,
                    '3_5_1_2': 1,
                    '3_5_2_1': 1000017,
                    '3_5_2_2': 1,
                    '3_5_5_1': null,
                    '3_5_5_2': null
                },
                thing: [
                    {
                        '4_1_1': 'bbaa59ed-81aa-4226-8b3d-2decb7db2911',
                        '4_1_2_1': 1000011,
                        '4_1_2_2': 1,
                        '4_4_1_1': 1000004,
                        '4_4_1_2': 1,
                        '4_4_2_1': 1000007,
                        '4_4_2_2': 1,
                        '4_4_5_1': 0,
                        '4_4_5_2': 0,
                        rowHash: '5111d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                        rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                    }
                ]
            },
            {
                '1_1': 'wf-pj2-2-test-01',
                document: [
                    {
                        '2_n_1_1': 'bbbb7e11-219e-4bbf-af4a-7589f8702d96',
                        '2_n_1_2_1': 1000014,
                        '2_n_1_2_2': 2,
                        '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                        '2_n_3_1_1': 1000004,
                        '2_n_3_1_2': 1,
                        '2_n_3_2_1': 1000007,
                        '2_n_3_2_2': 1
                    }
                ],
                event: {
                    '3_1_1': 'bbbb7e11-219e-4bbf-af4a-7589f8702d96',
                    '3_1_2_1': 1000008,
                    '3_1_2_2': 1,
                    '3_2_1': '2020-02-20T00:00:00.000+0900',
                    '3_2_2': '2020-02-21T00:00:00.000+0900',
                    '3_5_1_1': 1000004,
                    '3_5_1_2': 1,
                    '3_5_2_1': 1000017,
                    '3_5_2_2': 1,
                    '3_5_5_1': null,
                    '3_5_5_2': null
                },
                thing: [
                    {
                        '4_1_1': 'bbbb59ed-81aa-4226-8b3d-2decb7db2911',
                        '4_1_2_1': 1000011,
                        '4_1_2_2': 1,
                        '4_4_1_1': 1000004,
                        '4_4_1_2': 1,
                        '4_4_2_1': 1000007,
                        '4_4_2_2': 1,
                        '4_4_5_1': 0,
                        '4_4_5_2': 0,
                        rowHash: '2222d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                        rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                    }
                ]
            }
        ],
        update: [],
        delete: []
    });

    /**
     * テストデータ02
     */
    export const TestData02 = JSON.stringify({
        add: [
            {
                '1_1': 'wf-pj2-2-test-01',
                document: [],
                event: {
                    '3_1_1': '45da7e11-219e-4bbf-af4a-7589f8702d96',
                    '3_1_2_1': 1000008,
                    '3_1_2_2': 1,
                    '3_2_1': '2020-02-20T00:00:00.000+0900',
                    '3_2_2': '2020-02-21T00:00:00.000+0900',
                    '3_5_1_1': 1000004,
                    '3_5_1_2': 1,
                    '3_5_2_1': null,
                    '3_5_2_2': null,
                    '3_5_5_1': 1000007,
                    '3_5_5_2': 1
                },
                thing: [
                    {
                        '4_1_1': '647459ed-81aa-4226-8b3d-2decb7db2911',
                        '4_1_2_1': 1000011,
                        '4_1_2_2': 1,
                        '4_4_1_1': 1000004,
                        '4_4_1_2': 1,
                        '4_4_2_1': null,
                        '4_4_2_2': null,
                        '4_4_5_1': 1000007,
                        '4_4_5_2': 1,
                        rowHash: '5111d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                        rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                    }
                ]
            }
        ],
        update: [],
        delete: []
    });

    /**
     * テストデータ03
     */
    export const TestData03 = JSON.stringify({
        add: [
            {
                '1_1': 'wf-pj2-2-test-01',
                document: [],
                event: {
                    '3_1_1': '45da7e11-219e-4bbf-af4a-7589f8702d96',
                    '3_1_2_1': 1000008,
                    '3_1_2_2': 1,
                    '3_2_1': '2020-02-20T00:00:00.000+0900',
                    '3_2_2': '2020-02-21T00:00:00.000+0900',
                    '3_5_1_1': 1000014,
                    '3_5_1_2': 1,
                    '3_5_2_1': null,
                    '3_5_2_2': null,
                    '3_5_5_1': 1000007,
                    '3_5_5_2': 1
                },
                thing: [
                    {
                        '4_1_1': '647459ed-81aa-4226-8b3d-2decb7db2911',
                        '4_1_2_1': 1000011,
                        '4_1_2_2': 1,
                        '4_4_1_1': 1000004,
                        '4_4_1_2': 1,
                        '4_4_2_1': null,
                        '4_4_2_2': null,
                        '4_4_5_1': 1000007,
                        '4_4_5_2': 1,
                        rowHash: '5111d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                        rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                    }
                ]
            }
        ],
        update: [],
        delete: []
    });

    /**
     * テストデータ04
     */
    export const TestData04 = JSON.stringify({
        add: [
            {
                '1_1': 'wf-pj2-2-test-01',
                document: [
                    {
                        '2_n_1_1': '17b668ad-fc3e-e0a4-0a00-a49340a36d49',
                        '2_n_1_2_1': 52,
                        '2_n_1_2_2': 1,
                        '2_n_2_1': '2020-02-20T00:00:00.000+0900',
                        '2_n_3_1_1': 1000004,
                        '2_n_3_1_2': 1,
                        '2_n_3_5_1': 9999999,
                        '2_n_3_5_2': 1
                    }
                ],
                event: {
                    '3_1_1': '7744c61f-6f86-62fa-683e-9eefbd7b420d',
                    '3_1_2_1': 1000008,
                    '3_1_2_2': 1,
                    '3_2_1': '2020-02-20T00:00:00.000+0900',
                    '3_2_2': '2020-02-21T00:00:00.000+0900',
                    '3_5_1_1': 1000004,
                    '3_5_1_2': 1,
                    '3_5_2_1': 0,
                    '3_5_2_2': 0,
                    '3_5_5_1': 9999999,
                    '3_5_5_2': 1
                },
                thing: [
                    {
                        '4_1_1': 'c742a333-079e-68ea-1a3f-233b6529c20e',
                        '4_1_2_1': 1000011,
                        '4_1_2_2': 1,
                        '4_4_1_1': 1000004,
                        '4_4_1_2': 1,
                        '4_4_2_1': 0,
                        '4_4_2_2': 0,
                        '4_4_5_1': 9999999,
                        '4_4_5_2': 1,
                        rowHash: '5111d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                        rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                    }
                ]
            }
        ],
        update: [],
        delete: []
    });

    /**
     * add（userId重複, wf, 同一個人）
     */
    export const AddDuplicateUserIdSelfWf = JSON.stringify({
        add: [
            {
                '1_1': 'wfUser01',
                document: [],
                event: {
                    '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                    '3_1_2_1': 1000101,
                    '3_1_2_2': 1,
                    '3_2_1': '2020-02-20T00:00:00.000+0900',
                    '3_2_2': '2020-02-21T00:00:00.000+0900',
                    '3_5_1_1': 1000511,
                    '3_5_1_2': 1,
                    '3_5_2_1': 0,
                    '3_5_2_2': 0,
                    '3_5_5_1': 1000007,
                    '3_5_5_2': 1
                },
                thing: [
                    {
                        '4_1_1': '660b9db8-0250-4e56-64e0-47a49957ff6b',
                        '4_1_2_1': 1000201,
                        '4_1_2_2': 1,
                        '4_4_1_1': 1000511,
                        '4_4_1_2': 1,
                        '4_4_2_1': 1000007,
                        '4_4_2_2': 1,
                        '4_4_5_1': null,
                        '4_4_5_2': null,
                        rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                        rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                    }
                ]
            }
        ],
        update: [],
        delete: []
    });

    /**
     * add（userId重複, wf, 別個人）
     */
    export const AddDuplicateUseerIdOthersWf = JSON.stringify({
        add: [
            {
                '1_1': 'wfUser02',
                document: [],
                event: {
                    '3_1_1': 'b4cad926-78a5-b3b0-3d52-c89beb5fd294',
                    '3_1_2_1': 1000101,
                    '3_1_2_2': 1,
                    '3_2_1': '2020-02-20T00:00:00.000+0900',
                    '3_2_2': '2020-02-21T00:00:00.000+0900',
                    '3_5_1_1': 1000511,
                    '3_5_1_2': 1,
                    '3_5_2_1': 1000017,
                    '3_5_2_2': 1,
                    '3_5_5_1': null,
                    '3_5_5_2': null
                },
                thing: [
                    {
                        '4_1_1': 'e8e7e000-9d3a-e9ac-295d-d06a92580a78',
                        '4_1_2_1': 1000201,
                        '4_1_2_2': 1,
                        '4_4_1_1': 1000511,
                        '4_4_1_2': 1,
                        '4_4_2_1': 1000017,
                        '4_4_2_2': 1,
                        '4_4_5_1': null,
                        '4_4_5_2': null,
                        rowHash: '3511d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                        rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                    }
                ]
            }
        ],
        update: [],
        delete: []
    });

    /**
     * add（userId重複, app, 別個人）
     */
    export const AddDuplicateUseerIdOthersApp = JSON.stringify({
        add: [
            {
                '1_1': 'appUser02',
                document: [],
                event: {
                    '3_1_1': '2a6cfaf9-6431-27fe-ae5d-665e217646d5',
                    '3_1_2_1': 1000101,
                    '3_1_2_2': 1,
                    '3_2_1': '2020-02-20T00:00:00.000+0900',
                    '3_2_2': '2020-02-21T00:00:00.000+0900',
                    '3_5_1_1': 1000512,
                    '3_5_1_2': 1,
                    '3_5_2_1': null,
                    '3_5_2_2': null,
                    '3_5_5_1': 1000107,
                    '3_5_5_2': 1
                },
                thing: [
                    {
                        '4_1_1': '99483f8d-339a-882c-7092-18427f127302',
                        '4_1_2_1': 1000201,
                        '4_1_2_2': 1,
                        '4_4_1_1': 1000512,
                        '4_4_1_2': 1,
                        '4_4_2_1': null,
                        '4_4_2_2': null,
                        '4_4_5_1': 1000107,
                        '4_4_5_2': 1,
                        rowHash: '6511d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                        rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                    }
                ]
            }
        ],
        update: [],
        delete: []
    });

    /**
     * add（userId重複, wf/app間で重複, 別個人）
     */
    export const AddDuplicateUseerIdOthers = JSON.stringify({
        add: [
            {
                '1_1': 'user03',
                document: [],
                event: {
                    '3_1_1': 'ab7f35bb-9c35-0ec7-83c9-2411f59e6390',
                    '3_1_2_1': 1000101,
                    '3_1_2_2': 1,
                    '3_2_1': '2020-02-20T00:00:00.000+0900',
                    '3_2_2': '2020-02-21T00:00:00.000+0900',
                    '3_5_1_1': 1000511,
                    '3_5_1_2': 1,
                    '3_5_2_1': 1000027,
                    '3_5_2_2': 1,
                    '3_5_5_1': null,
                    '3_5_5_2': null
                },
                thing: [
                    {
                        '4_1_1': '70adf2a7-03fd-28f7-9948-97f99f121fe3',
                        '4_1_2_1': 1000201,
                        '4_1_2_2': 1,
                        '4_4_1_1': 1000511,
                        '4_4_1_2': 1,
                        '4_4_2_1': 1000027,
                        '4_4_2_2': 1,
                        '4_4_5_1': null,
                        '4_4_5_2': null,
                        rowHash: '8511d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                        rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                    }
                ]
            }
        ],
        update: [],
        delete: []
    });

    /**
     * update（userId重複, wf, 同一個人）
     */
    export const UpdateDuplicateUserIdSelfWf = JSON.stringify({
        add: [],
        update: [
            {
                '1_1': 'wfUser01',
                document: [],
                event: {
                    '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                    '3_1_2_1': 1000101,
                    '3_1_2_2': 1,
                    '3_2_1': '2020-02-20T00:00:00.000+0900',
                    '3_2_2': '2020-02-21T00:00:00.000+0900',
                    '3_5_1_1': 1000511,
                    '3_5_1_2': 1,
                    '3_5_2_1': 0,
                    '3_5_2_2': 0,
                    '3_5_5_1': 1000007,
                    '3_5_5_2': 1
                },
                thing: [
                    {
                        '4_1_1': '660b9db8-0250-4e56-64e0-47a49957ff6b',
                        '4_1_2_1': 1000201,
                        '4_1_2_2': 1,
                        '4_4_1_1': 1000511,
                        '4_4_1_2': 1,
                        '4_4_2_1': 1000007,
                        '4_4_2_2': 1,
                        '4_4_5_1': null,
                        '4_4_5_2': null,
                        rowHash: '4411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                        rowHashCreateAt: '2020-09-07T22:29:17.000Z'
                    }
                ]
            }
        ],
        delete: []
    });

    /**
     * update（userId重複, wf, 別個人）
     */
    export const UpdateDuplicateUseerIdOthersWf = JSON.stringify({
        add: [],
        update: [
            {
                '1_1': 'wfUser02',
                document: [],
                event: {
                    '3_1_1': 'b4cad926-78a5-b3b0-3d52-c89beb5fd294',
                    '3_1_2_1': 1000101,
                    '3_1_2_2': 1,
                    '3_2_1': '2020-02-20T00:00:00.000+0900',
                    '3_2_2': '2020-02-21T00:00:00.000+0900',
                    '3_5_1_1': 1000511,
                    '3_5_1_2': 1,
                    '3_5_2_1': 1000017,
                    '3_5_2_2': 1,
                    '3_5_5_1': null,
                    '3_5_5_2': null
                },
                thing: [
                    {
                        '4_1_1': 'e8e7e000-9d3a-e9ac-295d-d06a92580a78',
                        '4_1_2_1': 1000201,
                        '4_1_2_2': 1,
                        '4_4_1_1': 1000511,
                        '4_4_1_2': 1,
                        '4_4_2_1': 1000017,
                        '4_4_2_2': 1,
                        '4_4_5_1': null,
                        '4_4_5_2': null,
                        rowHash: '4511d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                        rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                    }
                ]
            }
        ],
        delete: []
    });

    /**
     * update（userId重複, app, 別個人）
     */
    export const UpdateDuplicateUseerIdOthersApp = JSON.stringify({
        add: [],
        update: [
            {
                '1_1': 'appUser02',
                document: [],
                event: {
                    '3_1_1': '2a6cfaf9-6431-27fe-ae5d-665e217646d5',
                    '3_1_2_1': 1000101,
                    '3_1_2_2': 1,
                    '3_2_1': '2020-02-20T00:00:00.000+0900',
                    '3_2_2': '2020-02-21T00:00:00.000+0900',
                    '3_5_1_1': 1000512,
                    '3_5_1_2': 1,
                    '3_5_2_1': null,
                    '3_5_2_2': null,
                    '3_5_5_1': 1000107,
                    '3_5_5_2': 1
                },
                thing: [
                    {
                        '4_1_1': '99483f8d-339a-882c-7092-18427f127302',
                        '4_1_2_1': 1000201,
                        '4_1_2_2': 1,
                        '4_4_1_1': 1000512,
                        '4_4_1_2': 1,
                        '4_4_2_1': null,
                        '4_4_2_2': null,
                        '4_4_5_1': 1000107,
                        '4_4_5_2': 1,
                        rowHash: '7511d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                        rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                    }
                ]
            }
        ],
        delete: []
    });

    /**
     * update（userId重複, wf/app間で重複, 別個人）
     */
    export const UpdateDuplicateUseerIdOthers = JSON.stringify({
        add: [],
        update: [
            {
                '1_1': 'user03',
                document: [],
                event: {
                    '3_1_1': 'ab7f35bb-9c35-0ec7-83c9-2411f59e6390',
                    '3_1_2_1': 1000101,
                    '3_1_2_2': 1,
                    '3_2_1': '2020-02-20T00:00:00.000+0900',
                    '3_2_2': '2020-02-21T00:00:00.000+0900',
                    '3_5_1_1': 1000511,
                    '3_5_1_2': 1,
                    '3_5_2_1': 1000027,
                    '3_5_2_2': 1,
                    '3_5_5_1': null,
                    '3_5_5_2': null
                },
                thing: [
                    {
                        '4_1_1': '70adf2a7-03fd-28f7-9948-97f99f121fe3',
                        '4_1_2_1': 1000201,
                        '4_1_2_2': 1,
                        '4_4_1_1': 1000511,
                        '4_4_1_2': 1,
                        '4_4_2_1': 1000027,
                        '4_4_2_2': 1,
                        '4_4_5_1': null,
                        '4_4_5_2': null,
                        rowHash: '9511d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                        rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                    }
                ]
            }
        ],
        delete: []
    });

    /**
     * add（userId重複, wf/app間で重複, 別個人, 他方）
     */
    export const AddDuplicateUserIdOthers2 = JSON.stringify({
        add: [
            {
                '1_1': 'user03',
                document: [],
                event: {
                    '3_1_1': '3ed6063f-8234-c46f-1947-d0c414aa0485',
                    '3_1_2_1': 1000101,
                    '3_1_2_2': 1,
                    '3_2_1': '2020-02-20T00:00:00.000+0900',
                    '3_2_2': '2020-02-21T00:00:00.000+0900',
                    '3_5_1_1': 1000512,
                    '3_5_1_2': 1,
                    '3_5_2_1': null,
                    '3_5_2_2': null,
                    '3_5_5_1': 1000127,
                    '3_5_5_2': 1
                },
                thing: [
                    {
                        '4_1_1': 'c0cee86e-d3e5-6c36-29a3-708d1d10f274',
                        '4_1_2_1': 1000201,
                        '4_1_2_2': 1,
                        '4_4_1_1': 1000512,
                        '4_4_1_2': 1,
                        '4_4_2_1': null,
                        '4_4_2_2': null,
                        '4_4_5_1': 1000127,
                        '4_4_5_2': 1,
                        rowHash: '1011d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                        rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                    }
                ]
            }
        ],
        update: [],
        delete: []
    });

    /**
     * delete（userId重複, wf, 別個人）
     */
    export const DeleteDuplicateUseerIdOthers = JSON.stringify({
        add: [],
        update: [],
        delete: [
            {
                '1_1': 'user03',
                document: [],
                event: {
                    '3_1_1': 'ab7f35bb-9c35-0ec7-83c9-2411f59e6390'
                },
                thing: [
                    {
                        '4_1_1': '70adf2a7-03fd-28f7-9948-97f99f121fe3'
                    }
                ]
            }
        ]
    });

    /**
     * add（異常、条件に該当する連携が無い）
     */
    export const AddNoExistCooperate = JSON.stringify({
        add: [
            {
                '1_1': 'wfUser01',
                document: [],
                event: {
                    '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                    '3_1_2_1': 1000101,
                    '3_1_2_2': 1,
                    '3_2_1': '2020-02-20T00:00:00.000+0900',
                    '3_2_2': '2020-02-21T00:00:00.000+0900',
                    '3_5_1_1': 1000511,
                    '3_5_1_2': 1,
                    '3_5_2_1': 10000037,
                    '3_5_2_2': 1,
                    '3_5_5_1': null,
                    '3_5_5_2': null
                },
                thing: [
                    {
                        '4_1_1': '660b9db8-0250-4e56-64e0-47a49957ff6b',
                        '4_1_2_1': 1000201,
                        '4_1_2_2': 1,
                        '4_4_1_1': 1000511,
                        '4_4_1_2': 1,
                        '4_4_2_1': 1000037,
                        '4_4_2_2': 1,
                        '4_4_5_1': null,
                        '4_4_5_2': null,
                        rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                        rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                    }
                ]
            }
        ],
        update: [],
        delete: []
    });

    /**
     * update（異常、条件に該当する連携が無い）
     */
    export const UpdateNoExistCooperate = JSON.stringify({
        add: [],
        update: [
            {
                '1_1': 'wfUser01',
                document: [],
                event: {
                    '3_1_1': 'd1da7e44-219e-4bbf-af4a-7589f8702d96',
                    '3_1_2_1': 1000101,
                    '3_1_2_2': 1,
                    '3_2_1': '2020-02-20T00:00:00.000+0900',
                    '3_2_2': '2020-02-21T00:00:00.000+0900',
                    '3_5_1_1': 1000511,
                    '3_5_1_2': 1,
                    '3_5_2_1': 10000037,
                    '3_5_2_2': 1,
                    '3_5_5_1': null,
                    '3_5_5_2': null
                },
                thing: [
                    {
                        '4_1_1': '660b9db8-0250-4e56-64e0-47a49957ff6b',
                        '4_1_2_1': 1000201,
                        '4_1_2_2': 1,
                        '4_4_1_1': 1000511,
                        '4_4_1_2': 1,
                        '4_4_2_1': 1000037,
                        '4_4_2_2': 1,
                        '4_4_5_1': null,
                        '4_4_5_2': null,
                        rowHash: '3411d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                        rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                    }
                ]
            }
        ],
        delete: []
    });

    export const noUserId = JSON.stringify({
        add: [
            {
                '1_1': null,
                document: [],
                event: {
                    '3_1_1': 'b4cad926-78a5-b3b0-3d52-c89beb5fd294',
                    '3_1_2_1': 1000101,
                    '3_1_2_2': 1,
                    '3_2_1': '2020-02-20T00:00:00.000+0900',
                    '3_2_2': '2020-02-21T00:00:00.000+0900',
                    '3_5_1_1': 1000511,
                    '3_5_1_2': 1,
                    '3_5_2_1': 1000017,
                    '3_5_2_2': 1,
                    '3_5_5_1': null,
                    '3_5_5_2': null
                },
                thing: [
                    {
                        '4_1_1': 'e8e7e000-9d3a-e9ac-295d-d06a92580a78',
                        '4_1_2_1': 1000201,
                        '4_1_2_2': 1,
                        '4_4_1_1': 1000511,
                        '4_4_1_2': 1,
                        '4_4_2_1': 1000017,
                        '4_4_2_2': 1,
                        '4_4_5_1': null,
                        '4_4_5_2': null,
                        rowHash: '3511d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                        rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                    }
                ]
            }
        ],
        update: [],
        delete: []
    });

    export const noApp = JSON.stringify({
        add: [
            {
                '1_1': 'appUser01',
                document: [],
                event: {
                    '3_1_1': 'b4cad926-78a5-b3b0-3d52-c89beb5fd294',
                    '3_1_2_1': 1000101,
                    '3_1_2_2': 1,
                    '3_2_1': '2020-02-20T00:00:00.000+0900',
                    '3_2_2': '2020-02-21T00:00:00.000+0900',
                    '3_5_1_1': 1000511,
                    '3_5_1_2': 1,
                    '3_5_2_1': null,
                    '3_5_2_2': null,
                    '3_5_5_1': null,
                    '3_5_5_2': null
                },
                thing: [
                    {
                        '4_1_1': 'e8e7e000-9d3a-e9ac-295d-d06a92580a78',
                        '4_1_2_1': 1000201,
                        '4_1_2_2': 1,
                        '4_4_1_1': 1000511,
                        '4_4_1_2': 1,
                        '4_4_2_1': null,
                        '4_4_2_2': null,
                        '4_4_5_1': null,
                        '4_4_5_2': null,
                        rowHash: '3511d7186b490dcd934b2398f96082c8010738b05840c5eda5b5571fab83494d',
                        rowHashCreateAt: '2020-09-06T22:29:17.000Z'
                    }
                ]
            }
        ],
        update: [],
        delete: []
    });
}
