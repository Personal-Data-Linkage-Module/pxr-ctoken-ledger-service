/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/**
 * セッション情報
 */
export namespace Session {
    /**
    * 正常(流通制御、運営メンバー)
    */
    export const pxrRoot = {
        sessionId: 'sessionId',
        operatorId: 1,
        type: 3,
        loginId: 'loginid',
        name: 'test-user',
        mobilePhone: '0311112222',
        auth: {
            add: true,
            update: true,
            delete: true
        },
        lastLoginAt: '2020-01-01T00:00:00.000+0900',
        attributes: {},
        roles: [
            {
                _value: 1,
                _ver: 1
            }
        ],
        block: {
            _value: 1000110,
            _ver: 1
        },
        actor: {
            _value: 1000001,
            _ver: 1
        }
    };

    /**
    * 正常(WF職員)
    */
   export const wfStaff = {
       sessionId: 'sessionId',
       operatorId: 1,
       type: 1,
       loginId: 'wf_staff01',
       name: 'wf_staff01',
       lastLoginAt: '2020-01-01T00:00:00.000+0900',
       attributes: {},
       roles: [
           {
               _value: 1000005,
               _ver: 1
           }
       ],
       block: {
           _value: 1000112,
           _ver: 1
       },
       actor: {
           _value: 1000004,
           _ver: 1
       }
   };

   /**
    * 正常(流通制御)
    */
   export const pxrRootInd = {
       sessionId: 'sessionId',
       operatorId: 1,
       type: 0,
       loginId: 'wf-pj2-2-test-01',
       pxrId: 'wf-pj2-2-test-01',
       mobilePhone: '0311112222',
       lastLoginAt: '2020-01-01T00:00:00.000+0900',
       attributes: {},
       block: {
           _value: 1000110,
           _ver: 1
       },
       actor: {
           _value: 1000001,
           _ver: 1
       }
   };

   /**
    * 正常(データ取引)
    */
   export const dataTrader = {
       sessionId: 'sessionId',
       operatorId: 1,
       type: 3,
       loginId: 'loginid',
       name: 'test-user',
       mobilePhone: '0311112222',
       auth: {
           add: true,
           update: true,
           delete: true
       },
       lastLoginAt: '2020-01-01T00:00:00.000+0900',
       attributes: {},
       roles: [
           {
               _value: 1,
               _ver: 1
           }
       ],
       block: {
           _value: 1000109,
           _ver: 1
       },
       actor: {
           _value: 1000020,
           _ver: 1
       }
   };

   /**
    * 異常(データ取引、異常なデータ取引カタログ)
    */
    export const dataTraderInvalidTraderCatalog = {
        sessionId: 'sessionId',
        operatorId: 1,
        type: 3,
        loginId: 'loginid',
        name: 'test-user',
        mobilePhone: '0311112222',
        auth: {
            add: true,
            update: true,
            delete: true
        },
        lastLoginAt: '2020-01-01T00:00:00.000+0900',
        attributes: {},
        roles: [
            {
                _value: 1,
                _ver: 1
            }
        ],
        block: {
            _value: 1000109,
            _ver: 1
        },
        actor: {
            _value: 1000220,
            _ver: 1
        }
    };

   /**
    * 正常(領域運営)
    */
   export const regionRoot = {
       sessionId: 'sessionId',
       operatorId: 1,
       type: 3,
       loginId: 'loginid',
       name: 'test-user',
       mobilePhone: '0311112222',
       auth: {
           add: true,
           update: true,
           delete: true
       },
       lastLoginAt: '2020-01-01T00:00:00.000+0900',
       attributes: {},
       roles: [
           {
               _value: 1,
               _ver: 1
           }
       ],
       block: {
           _value: 1000111,
           _ver: 1
       },
       actor: {
           _value: 1000002,
           _ver: 1
       }
   };

   /**
    * 異常(領域運営、wf-alliance, app-alliance が空集合の領域運営カタログ)
    */
    export const regionRootInvalidRegionCatalog = {
        sessionId: 'sessionId',
        operatorId: 1,
        type: 3,
        loginId: 'loginid',
        name: 'test-user',
        mobilePhone: '0311112222',
        auth: {
            add: true,
            update: true,
            delete: true
        },
        lastLoginAt: '2020-01-01T00:00:00.000+0900',
        attributes: {},
        roles: [
            {
                _value: 1,
                _ver: 1
            }
        ],
        block: {
            _value: 1000111,
            _ver: 1
        },
        actor: {
            _value: 1000202,
            _ver: 1
        }
    };

   /**
    * 正常(コンシューマー)
    */
   export const consumer = {
       sessionId: 'sessionId',
       operatorId: 1,
       type: 3,
       loginId: 'loginid',
       name: 'test-user',
       mobilePhone: '0311112222',
       auth: {
           add: true,
           update: true,
           delete: true
       },
       lastLoginAt: '2020-01-01T00:00:00.000+0900',
       attributes: {},
       roles: [
           {
               _value: 1,
               _ver: 1
           }
       ],
       block: {
           _value: 1000108,
           _ver: 1
       },
       actor: {
           _value: 1000114,
           _ver: 1
       }
   };

   /**
    * 異常(コンシューマー、異常なコンシューマーカタログ)
    */
    export const consumerInvalidConsumerCatalog = {
        sessionId: 'sessionId',
        operatorId: 1,
        type: 3,
        loginId: 'loginid',
        name: 'test-user',
        mobilePhone: '0311112222',
        auth: {
            add: true,
            update: true,
            delete: true
        },
        lastLoginAt: '2020-01-01T00:00:00.000+0900',
        attributes: {},
        roles: [
            {
                _value: 1,
                _ver: 1
            }
        ],
        block: {
            _value: 1000108,
            _ver: 1
        },
        actor: {
            _value: 1000214,
            _ver: 1
        }
    };

    /**
    * 異常(コンシューマー、異常なデータ取引を紐づけるコンシューマーカタログ)
    */
    export const consumerInvalidTraderCatalog = {
        sessionId: 'sessionId',
        operatorId: 1,
        type: 3,
        loginId: 'loginid',
        name: 'test-user',
        mobilePhone: '0311112222',
        auth: {
            add: true,
            update: true,
            delete: true
        },
        lastLoginAt: '2020-01-01T00:00:00.000+0900',
        attributes: {},
        roles: [
            {
                _value: 1,
                _ver: 1
            }
        ],
        block: {
            _value: 1000108,
            _ver: 1
        },
        actor: {
            _value: 1000314,
            _ver: 1
        }
    };

    /**
    * 異常(該当アクターなし)
    */
    export const notActor = {
        sessionId: 'sessionId',
        operatorId: 1,
        type: 3,
        loginId: 'loginid',
        name: 'test-user',
        mobilePhone: '0311112222',
        auth: {
            add: true,
            update: true,
            delete: true
        },
        lastLoginAt: '2020-01-01T00:00:00.000+0900',
        attributes: {},
        roles: [
            {
                _value: 1,
                _ver: 1
            }
        ],
        block: {
            _value: 1000108,
            _ver: 1
        },
        actor: {
            _value: 1000115,
            _ver: 1
        }
    };
    /**
    * 異常(アクターコードなし)
    */
    export const noActorCode = {
        sessionId: 'sessionId',
        operatorId: 1,
        type: 3,
        loginId: 'loginid',
        name: 'test-user',
        mobilePhone: '0311112222',
        auth: {
            add: true,
            update: true,
            delete: true
        },
        lastLoginAt: '2020-01-01T00:00:00.000+0900',
        attributes: {},
        roles: [
            {
                _value: 1,
                _ver: 1
            }
        ],
        block: {
            _value: 1000108,
            _ver: 1
        },
        actor: {}
    };
}
