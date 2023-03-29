/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import express = require('express');
import { Server } from 'net';
import Config from './Config'
/* eslint-enable */

const identification = Config.ReadConfig('./src/tests/Book/personal_member01.json');

const catalog1000002 = Config.ReadConfig('./src/tests/Catalog/1000002.json');
const catalog1000202 = Config.ReadConfig('./src/tests/Catalog/1000202.json');
const catalog1000004 = Config.ReadConfig('./src/tests/Catalog/1000004.json');
const catalog1000204 = Config.ReadConfig('./src/tests/Catalog/1000204.json');
const catalog1000007 = Config.ReadConfig('./src/tests/Catalog/1000007.json');
const catalog1000005 = Config.ReadConfig('./src/tests/Catalog/1000005.json');
const catalog1000205 = Config.ReadConfig('./src/tests/Catalog/1000205.json');
const catalog1000008 = Config.ReadConfig('./src/tests/Catalog/1000008.json');
const catalog1000020 = Config.ReadConfig('./src/tests/Catalog/1000020.json');
const catalog1000220 = Config.ReadConfig('./src/tests/Catalog/1000220.json');
const catalog1000108 = Config.ReadConfig('./src/tests/Catalog/1000108.json');
const catalog1000109 = Config.ReadConfig('./src/tests/Catalog/1000109.json');
const catalog1000110 = Config.ReadConfig('./src/tests/Catalog/1000110.json');
const catalog1000111 = Config.ReadConfig('./src/tests/Catalog/1000111.json');
const catalog1000112 = Config.ReadConfig('./src/tests/Catalog/1000112.json');
const catalog1000114 = Config.ReadConfig('./src/tests/Catalog/1000114.json');
const catalog1000214 = Config.ReadConfig('./src/tests/Catalog/1000214.json');
const catalog1000314 = Config.ReadConfig('./src/tests/Catalog/1000314.json');
const catalog1000115 = Config.ReadConfig('./src/tests/Catalog/1000115.json');

export class CtokenLedgerServer {
    app: express.Express;
    server: Server;
    constructor (status: number) {
        this.app = express();
        this.app.use(express.json({ limit: '100mb' }));
        this.app.use(express.urlencoded({ extended: false }));
        this.app.post('/ctoken-ledger/local', (req: express.Request, res: express.Response) => {
            res.status(status).end();
        });
        this.server = this.app.listen(3008);
    }
}

export class OperatorServer {
    app: express.Express;
    server: Server;
    constructor (status: number, type: number) {
        this.app = express();
        this.app.use(express.json({ limit: '100mb' }));
        this.app.use(express.urlencoded({ extended: false }));
        this.app.post('/operator/session', (req: express.Request, res: express.Response) => {
            if (status === 200 && req.body.sessionId === '5b4fcfb619a4fd3215e3582412eecfd5ab7e06eb112c52402805a730e8737899') {
                res.status(200)
                    .json({
                        sessionId: '5b4fcfb619a4fd3215e3582412eecfd5ab7e06eb112c52402805a730e8737899',
                        operatorId: 1,
                        type: type,
                        pxrId: 'dummy.test.org',
                        loginId: 'root_member01',
                        lastLoginAt: '2020-02-18 18:07:55.906',
                        auth: {
                            member: {
                                add: true,
                                update: true,
                                delete: true
                            }
                        },
                        block: {
                            _value: 1000112,
                            _ver: 1
                        },
                        actor: {
                            _value: 1000004,
                            _ver: 1
                        }
                    })
                    .end();
            } else if (status === 200) {
                res.status(200)
                    .json({
                        sessionId: '5b4fcfb619a4fd3215e3582412eecfd5ab7e06eb112c52402805a730e8737899',
                        operatorId: 1,
                        type: type,
                        pxrId: 'dummy.test.org',
                        loginId: 'root_member01',
                        lastLoginAt: '2020-02-18 18:07:55.906',
                        auth: {
                            member: {
                                add: true,
                                update: true,
                                delete: true
                            }
                        },
                        block: {
                            _value: 1000112,
                            _ver: 1
                        },
                        actor: {
                            _value: 1000110,
                            _ver: 1
                        }
                    })
                    .end();
            } else {
                res.status(status).end();
            }
        });
        this.server = this.app.listen(3000);
    }
}

export class CatalogServer {
    app: express.Express;
    server: Server;
    constructor (status: number) {
        this.app = express();
        this.app.use(express.json({ limit: '100mb' }));
        this.app.use(express.urlencoded({ extended: false }));
        this.app.get('/catalog/name', (req: express.Request, res: express.Response) => {
            res.status(status);
            res.json({
                ext_name: 'test-org'
            });
            res.end();
        });
        this.app.get('/catalog/:code', (req: express.Request, res: express.Response) => {
            if (status === 200) {
                if (req.params.code + '' === 1000002 + '') {
                    res.status(200).json(catalog1000002).end();
                } else if (req.params.code + '' === 1000202 + '') {
                    res.status(200).json(catalog1000202).end();
                } else if (req.params.code + '' === 1000004 + '') {
                    res.status(200).json(catalog1000004).end();
                } else if (req.params.code + '' === 1000204 + '') {
                    res.status(200).json(catalog1000204).end();
                } else if (req.params.code + '' === 1000005 + '') {
                    res.status(200).json(catalog1000005).end();
                } else if (req.params.code + '' === 1000205 + '') {
                    res.status(200).json(catalog1000205).end();
                } else if (req.params.code + '' === 1000007 + '') {
                    res.status(200).json(catalog1000007).end();
                } else if (req.params.code + '' === 1000008 + '') {
                    res.status(200).json(catalog1000008).end();
                } else if (req.params.code + '' === 1000020 + '') {
                    res.status(200).json(catalog1000020).end();
                } else if (req.params.code + '' === 1000220 + '') {
                    res.status(200).json(catalog1000220).end();
                } else if (req.params.code + '' === 1000108 + '') {
                    res.status(200).json(catalog1000108).end();
                } else if (req.params.code + '' === 1000109 + '') {
                    res.status(200).json(catalog1000109).end();
                } else if (req.params.code + '' === 1000110 + '') {
                    res.status(200).json(catalog1000110).end();
                } else if (req.params.code + '' === 1000111 + '') {
                    res.status(200).json(catalog1000111).end();
                } else if (req.params.code + '' === 1000112 + '') {
                    res.status(200).json(catalog1000112).end();
                } else if (req.params.code + '' === 1000114 + '') {
                    res.status(200).json(catalog1000114).end();
                } else if (req.params.code + '' === 1000214 + '') {
                    res.status(200).json(catalog1000214).end();
                } else if (req.params.code + '' === 1000314 + '') {
                    res.status(200).json(catalog1000314).end();
                } else if (req.params.code + '' === 1000115 + '') {
                    res.status(200).json(catalog1000115).end();
                } else {
                    res.status(204).end();
                }
            } else if (status === 400) {
                res.status(400).end();
            } else if (status === 500) {
                res.status(500).end();
            } else if (status === 204) {
                res.status(204).end();
            }
        });
        this.app.get('/catalog', (req: express.Request, res: express.Response) => {
            if (status === 200) {
                if (typeof req.query.ns !== 'string') {
                    res.status(500).end();
                } else if (decodeURIComponent(req.query.ns) === 'catalog/ext/test-org/actor/region-root/actor_1000002/region') {
                    res.status(200).json([catalog1000002]).end();
                } else if (decodeURIComponent(req.query.ns) === 'catalog/ext/test-org/actor/region-root/actor_1000202/region') {
                    res.status(200).json([catalog1000202]).end();
                } else if (decodeURIComponent(req.query.ns) === 'catalog/ext/test-org/actor/app') {
                    res.status(200).json([catalog1000005]).end();
                } else if (decodeURIComponent(req.query.ns) === 'catalog/ext/test-org/actor/wf') {
                    res.status(200).json([catalog1000004]).end();
                } else if (decodeURIComponent(req.query.ns) === 'catalog/ext/test-org/setting/pxr-root') {
                    res.status(200).json([catalog1000004]).end();
                } else {
                    res.status(204).end();
                }
            } else if (status === 400) {
                res.status(400).end();
            } else if (status === 500) {
                res.status(500).end();
            } else if (status === 204) {
                res.status(204).end();
            }
        });
        this.app.post('/catalog', (req, res) => {
            if (status === 200) {
                const resultList = [];
                for (const codeVersion of req.body) {
                    if (codeVersion._code._value === 1000004) {
                        resultList.push({
                            catalogItem: {
                                ns: 'catalog/document',
                                name: 'cm',
                                description: 'ドキュメント',
                                _code: {
                                    _value: 1000004,
                                    _ver: 1
                                },
                                inherit: null
                            },
                            _code: {
                                _value: 1,
                                _ver: null
                            }
                        });
                    } else if (codeVersion._code._value === 1000005) {
                        resultList.push({
                            catalogItem: {
                                ns: 'catalog/event',
                                name: 'cm',
                                description: 'イベント',
                                _code: {
                                    _value: 1000005,
                                    _ver: 1
                                },
                                inherit: null
                            },
                            _code: {
                                _value: 2,
                                _ver: null
                            }
                        });
                    } else if (codeVersion._code._value === 1000006) {
                        resultList.push({
                            catalogItem: {
                                ns: 'catalog/thing',
                                name: 'cm',
                                description: 'モノ',
                                _code: {
                                    _value: 1000006,
                                    _ver: 1
                                },
                                inherit: null
                            },
                            _code: {
                                _value: 3,
                                _ver: null
                            }
                        });
                    } else if (codeVersion._code._value === 1000014) {
                        resultList.push({
                            catalogItem: {
                                ns: 'catalog/document',
                                name: 'cm',
                                description: 'ドキュメント',
                                _code: {
                                    _value: 1000014,
                                    _ver: 1
                                },
                                inherit: null
                            },
                            _code: {
                                _value: 3,
                                _ver: null
                            }
                        });
                    } else if (codeVersion._code._value === 1000002) {
                        resultList.push({
                            catalogItem: {
                                ns: 'catalog/ext/test-org/actor/region-root',
                                name: 'organization',
                                description: 'organizationの定義です。',
                                _code: {
                                    _value: 1000002,
                                    _ver: 1
                                },
                                inherit: null
                            },
                            template: {
                                _code: {
                                    _value: 1000002,
                                    _ver: 1
                                }
                            }
                        });
                    }
                }
                res.status(200).json(resultList).end();
            } else if (status === 400) {
                res.status(400).end();
            } else if (status === 500) {
                res.status(500).end();
            } else if (status === 204) {
                res.status(204).end();
            }
        });
        this.server = this.app.listen(3001);
    }
}

export class MyConditionBookManageServer {
    app: express.Express;
    server: Server;
    constructor (status: number) {
        this.app = express();
        this.app.use(express.json({ limit: '100mb' }));
        this.app.use(express.urlencoded({ extended: false }));

        // 本人性確認事項検索
        this.app.post('/book-manage/identity', (req: express.Request, res: express.Response) => {
            if (req.body.pxrId === 'personal_member01') {
                res.status(200).json(identification);
            } else {
                res.status(204).end();
            }
        });

        // My-Condition-Book一覧取得
        this.app.post('/book-manage/search', (req: express.Request, res: express.Response) => {
            if (status === 200) {
                res.status(200).json([
                    {
                        pxrId: 'dummy.test.org',
                        attributes: null,
                        cooperation: null,
                        userInformation: [
                            {
                                template: {
                                    _code: {
                                        _value: 30001,
                                        _ver: 1
                                    },
                                    'item-group': [
                                        {
                                            title: '氏名',
                                            item: [
                                                {
                                                    title: '姓',
                                                    type: {
                                                        _value: 30019,
                                                        _ver: 1
                                                    },
                                                    content: 'デモ０１'
                                                },
                                                {
                                                    title: '名',
                                                    type: {
                                                        _value: 30020,
                                                        _ver: 1
                                                    },
                                                    content: '太郎'
                                                }
                                            ]
                                        },
                                        {
                                            title: '性別',
                                            item: [
                                                {
                                                    title: '性別',
                                                    type: {
                                                        _value: 30021,
                                                        _ver: 1
                                                    },
                                                    content: '男'
                                                }
                                            ]
                                        },
                                        {
                                            title: '生年月日',
                                            item: [
                                                {
                                                    title: '生年月日',
                                                    type: {
                                                        _value: 30022,
                                                        _ver: 1
                                                    },
                                                    content: '2000-01-01'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        pxrId: 'wf-pj2-2-test-01',
                        attributes: null,
                        cooperation: [
                            {
                                actor: {
                                    _value: '1000020',
                                    _ver: '1'
                                },
                                app: null,
                                wf: null,
                                userId: 'wf-pj2-2-test-01',
                                startAt: '2020-07-31T01:40:23.279+0900',
                                status: 1
                            },
                            {
                                actor: {
                                    _value: '1000004',
                                    _ver: '1'
                                },
                                app: null,
                                wf: {
                                    _value: '1000007',
                                    _ver: '1'
                                },
                                userId: 'wf-pj2-2-test-01.1000007.wf',
                                startAt: '2020-07-31T01:42:08.504+0900',
                                status: 1
                            }
                        ],
                        userInformation: [
                            {
                                template: {
                                    _code: {
                                        _value: 30001,
                                        _ver: 1
                                    },
                                    'item-group': [
                                        {
                                            title: '氏名',
                                            item: [
                                                {
                                                    title: '姓',
                                                    type: {
                                                        _value: 30019,
                                                        _ver: 1
                                                    },
                                                    content: 'デモ０１'
                                                },
                                                {
                                                    title: '名',
                                                    type: {
                                                        _value: 30020,
                                                        _ver: 1
                                                    },
                                                    content: '太郎'
                                                }
                                            ]
                                        },
                                        {
                                            title: '性別',
                                            item: [
                                                {
                                                    title: '性別',
                                                    type: {
                                                        _value: 30021,
                                                        _ver: 1
                                                    },
                                                    content: '男'
                                                }
                                            ]
                                        },
                                        {
                                            title: '生年月日',
                                            item: [
                                                {
                                                    title: '生年月日',
                                                    type: {
                                                        _value: 30022,
                                                        _ver: 1
                                                    },
                                                    content: '2000-01-01'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        pxrId: 'wf-pj2-2-test-02',
                        attributes: null,
                        cooperation: [
                            {
                                actor: {
                                    _value: '1000020',
                                    _ver: '1'
                                },
                                app: null,
                                wf: null,
                                userId: 'wf-pj2-2-test-02',
                                startAt: '2020-07-31T01:45:29.641+0900',
                                status: 1
                            },
                            {
                                actor: {
                                    _value: '1000004',
                                    _ver: '1'
                                },
                                app: null,
                                wf: {
                                    _value: '1000007',
                                    _ver: '1'
                                },
                                userId: 'wf-pj2-2-test-02.1000007.wf',
                                startAt: '2020-07-31T01:47:24.649+0900',
                                status: 0
                            }
                        ],
                        userInformation: [
                            {
                                template: {
                                    _code: {
                                        _value: 30001,
                                        _ver: 1
                                    },
                                    'item-group': [
                                        {
                                            title: '氏名',
                                            item: [
                                                {
                                                    title: '姓',
                                                    type: {
                                                        _value: 30019,
                                                        _ver: 1
                                                    },
                                                    content: 'デモ０１'
                                                },
                                                {
                                                    title: '名',
                                                    type: {
                                                        _value: 30020,
                                                        _ver: 1
                                                    },
                                                    content: '太郎'
                                                }
                                            ]
                                        },
                                        {
                                            title: '性別',
                                            item: [
                                                {
                                                    title: '性別',
                                                    type: {
                                                        _value: 30021,
                                                        _ver: 1
                                                    },
                                                    content: '男'
                                                }
                                            ]
                                        },
                                        {
                                            title: '生年月日',
                                            item: [
                                                {
                                                    title: '生年月日',
                                                    type: {
                                                        _value: 30022,
                                                        _ver: 1
                                                    },
                                                    content: '2000-01-01'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                ]);
            } else if (status === 400) {
                res.status(400).end();
            } else if (status === 500) {
                res.status(500).end();
            } else if (status === 204) {
                res.status(204).end();
            }
        });
        this.server = this.app.listen(3005);
    }
}
