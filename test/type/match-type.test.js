//==============================================================
// gobal defined

import { jest } from '@jest/globals';
import { Type } from '../../src/type';

const T = true;
const F = false;
//==============================================================
// test

describe('Type.isMatchType(type, target): bool  <타입 매치 여부> ', () => {
    describe('단일타입(Leaf) ', () => {
        it('- Type.isMatchType() : undefined ', () => {
            var type1 = undefined
            var type2 = { aa: undefined }
            var type3 = { aa: [[{}]] }
            var type4 = { aa: String }
            var type5 = { aa: [[String, Number]] }
            var type6 = { aa: [['_req_', String, Number]] }
            
            // type1
            expect(Type.isMatchType(type1)                   ).toBe(T);
            expect(Type.isMatchType(type1, undefined)        ).toBe(T);
            expect(Type.isMatchType(type1, null)             ).toBe(false); 
            // type2
            expect(Type.isMatchType(type2, {aa: undefined})  ).toBe(T);
            expect(Type.isMatchType(type2, {})               ).toBe(T); // aa 프로퍼티 없음
            // type3
            expect(Type.isMatchType(type3, {aa: undefined})  ).toBe(T);
            expect(Type.isMatchType(type3, {})               ).toBe(T);
            // type4
            expect(Type.isMatchType(type4, {aa: 'str'})      ).toBe(T);
            expect(Type.isMatchType(type4, {aa: undefined})  ).toBe(false);
            expect(Type.isMatchType(type4, {})               ).toBe(false);
            // type5
            expect(Type.isMatchType(type5, {aa: 'str'})      ).toBe(T);
            expect(Type.isMatchType(type5, {aa: 10})         ).toBe(T);
            expect(Type.isMatchType(type5, {aa: undefined})  ).toBe(T);
            expect(Type.isMatchType(type5, {})               ).toBe(T);
            // type6
            expect(Type.isMatchType(type6, {aa: 'str'})      ).toBe(T);
            expect(Type.isMatchType(type6, {aa: 10})         ).toBe(T);
            expect(Type.isMatchType(type6, {aa: undefined})  ).toBe(false);
            expect(Type.isMatchType(type6, {})               ).toBe(false);

        });
        it('- Type.isMatchType() : null ', () => {
            var type1 = null;
            
            expect(Type.isMatchType(type1, null)     ).toBe(T);
            expect(Type.isMatchType(type1, undefined)).toBe(false); 
        });
        it('- Type.isMatchType() : string 선택, 리터럴, 기본값 ', () => {
            var type1 = String
            var type2 = 'str'
            var type3 = { a: 'str' }
            var type4 = [[String]]
            var type5 = [['str']]
            
            var tar01 = {a: undefined}
            var tar02 = {}

            // 타입
            expect(Type.isMatchType(type1, '')       ).toBe(T);
            expect(Type.isMatchType(type1, undefined)).toBe(false);                
            expect(Type.isMatchType(type1, 0)        ).toBe(false);
            expect(Type.isMatchType(type1, String)   ).toBe(false);
            // 기본값
            expect(Type.isMatchType(type2, '')       ).toBe(T);
            expect(Type.isMatchType(type2, undefined)).toBe(T);
            expect(Type.isMatchType(type2, 0)        ).toBe(false);
            expect(Type.isMatchType(type2, String)   ).toBe(false);
            expect(Type.isMatchType(type3, tar01)    ).toBe(T);
            expect(tar01                        ).toEqual({a: 'str'});
            expect(Type.isMatchType(type3, tar02)    ).toBe(T);
            expect(tar02                        ).toEqual({a: 'str'});
            // 선택
            expect(Type.isMatchType(type4, '')       ).toBe(T);
            expect(Type.isMatchType(type4, 'str')    ).toBe(T);
            expect(Type.isMatchType(type4, undefined)).toBe(T);
            expect(Type.isMatchType(type4, 0)        ).toBe(false);
            // 리터럴
            expect(Type.isMatchType(type5, '')       ).toBe(false);
            expect(Type.isMatchType(type5, 'str')    ).toBe(T);
            expect(Type.isMatchType(type5, undefined)).toBe(T);
            expect(Type.isMatchType(type5, 0)        ).toBe(false);
        });
        it('- Type.isMatchType() : number 선택, 리터럴, 기본값 ', () => {
            var type1 = Number
            var type2 = 1
            var type3 = { a: 1 }
            var type4 = [[Number]]
            var type5 = [[10]]
            
            var tar01 = { a: undefined }
            var tar02 = {}

            // 타입
            expect(Type.isMatchType(type1, 0)        ).toBe(T);
            expect(Type.isMatchType(type1, undefined)).toBe(false);                
            expect(Type.isMatchType(type1, '')       ).toBe(false);
            expect(Type.isMatchType(type1, Number)   ).toBe(false);
            // 기본값
            expect(Type.isMatchType(type2, 0)        ).toBe(T);
            expect(Type.isMatchType(type2, undefined)).toBe(T);
            expect(Type.isMatchType(type2, '')       ).toBe(false);
            expect(Type.isMatchType(type2, Number)   ).toBe(false);
            expect(Type.isMatchType(type3, tar01)    ).toBe(T);
            expect(tar01                        ).toEqual({a: 1});
            expect(Type.isMatchType(type3, tar02)    ).toBe(T);
            expect(tar02                        ).toEqual({a: 1});
            // 선택
            expect(Type.isMatchType(type4, 1)        ).toBe(T);
            expect(Type.isMatchType(type4, 10)       ).toBe(T);
            expect(Type.isMatchType(type4, undefined)).toBe(T);
            expect(Type.isMatchType(type4, '')       ).toBe(false);
            // 리터럴
            expect(Type.isMatchType(type5, 1)        ).toBe(false);
            expect(Type.isMatchType(type5, 10)       ).toBe(T);
            expect(Type.isMatchType(type5, undefined)).toBe(T);
            expect(Type.isMatchType(type5, '')       ).toBe(false);
        });
        it('- Type.isMatchType() : boolean 선택, 리터럴, 기본값 ', () => {
            var type1 = Boolean
            var type2 = false
            var type3 = { a: true }
            var type4 = [[Boolean]]
            var type5 = [[true]]               

            var tar01 = { a: undefined }
            var tar02 = {}

            // 타입
            expect(Type.isMatchType(type1, true)     ).toBe(T);
            expect(Type.isMatchType(type1, undefined)).toBe(false);                
            expect(Type.isMatchType(type1, '')       ).toBe(false);
            expect(Type.isMatchType(type1, Boolean)  ).toBe(false);
            // 기본값
            expect(Type.isMatchType(type2, true)     ).toBe(T);
            expect(Type.isMatchType(type2, undefined)).toBe(T);
            expect(Type.isMatchType(type2, '')       ).toBe(false);
            expect(Type.isMatchType(type2, Boolean)  ).toBe(false);
            expect(Type.isMatchType(type3, tar01)    ).toBe(T);
            expect(tar01                        ).toEqual({a: true});
            expect(Type.isMatchType(type3, tar02)    ).toBe(T);
            expect(tar02                        ).toEqual({a: true});
            // 선택
            expect(Type.isMatchType(type4, false)    ).toBe(T);
            expect(Type.isMatchType(type4, true)     ).toBe(T);
            expect(Type.isMatchType(type4, undefined)).toBe(T);
            expect(Type.isMatchType(type4, '')       ).toBe(false);
            // 리터럴
            expect(Type.isMatchType(type5, false)    ).toBe(false);
            expect(Type.isMatchType(type5, true)     ).toBe(T);
            expect(Type.isMatchType(type5, undefined)).toBe(T);
            expect(Type.isMatchType(type5, '')       ).toBe(false);
        });
        it('- Type.isMatchType() : regexp 선택, 리터럴, 기본값 ', () => {
            var type1 = RegExp
            var type2 = /aa/
            var type3 = { a: /aa/ }
            var type4 = [[RegExp]]
            var type5 = [[/bb/]]

            var tar01 = { a: undefined }
            var tar02 = {}

            // 타입
            expect(Type.isMatchType(type1, /bb/)     ).toBe(T);
            expect(Type.isMatchType(type1, undefined)).toBe(false);                
            expect(Type.isMatchType(type1, '')       ).toBe(false);
            expect(Type.isMatchType(type1, RegExp)   ).toBe(false);
            // 기본값
            expect(Type.isMatchType(type2, /bb/)   ).toBe(T);
            expect(Type.isMatchType(type2, undefined)).toBe(T);
            expect(Type.isMatchType(type2, '')       ).toBe(false);
            expect(Type.isMatchType(type2, RegExp)   ).toBe(false);
            expect(Type.isMatchType(type3, tar01)    ).toBe(T);
            expect(tar01                        ).toEqual({a: /aa/});
            expect(Type.isMatchType(type3, tar02)    ).toBe(T);
            expect(tar02                        ).toEqual({a: /aa/});
            // 선택
            expect(Type.isMatchType(type4, /aa/)     ).toBe(T);
            expect(Type.isMatchType(type4, /bb/)     ).toBe(T);
            expect(Type.isMatchType(type4, undefined)).toBe(T);
            expect(Type.isMatchType(type4, '')       ).toBe(false);
            // 리터럴
            expect(Type.isMatchType(type5, /aa/)     ).toBe(false);
            expect(Type.isMatchType(type5, /bb/)     ).toBe(T);
            expect(Type.isMatchType(type5, undefined)).toBe(T);
            expect(Type.isMatchType(type5, '')       ).toBe(false);
        });
        it('- Type.isMatchType() : bigint 선택, 리터럴, 기본값 (ES6+) ', () => {
            var type1 = BigInt
            var type2 = 10n
            var type3 = { a: 10n }
            var type4 = [[BigInt]]
            var type5 = [[20n]]

            var tar01 = {a: undefined}
            var tar02 = {}

            // 타입
            expect(Type.isMatchType(type1, 20n)      ).toBe(T);
            expect(Type.isMatchType(type1, undefined)).toBe(false);                
            expect(Type.isMatchType(type1, '')       ).toBe(false);
            expect(Type.isMatchType(type1, BigInt)   ).toBe(false);
            // 기본값
            expect(Type.isMatchType(type2, 20n)      ).toBe(T);
            expect(Type.isMatchType(type2, undefined)).toBe(T);
            expect(Type.isMatchType(type2, '')       ).toBe(false);
            expect(Type.isMatchType(type2, BigInt)   ).toBe(false);
            expect(Type.isMatchType(type3, tar01)    ).toBe(T);
            expect(tar01                        ).toEqual({a: 10n});
            expect(Type.isMatchType(type3, tar02)    ).toBe(T);
            expect(tar02                        ).toEqual({a: 10n});
            // 선택
            expect(Type.isMatchType(type4, 10n)      ).toBe(T);
            expect(Type.isMatchType(type4, 20n)      ).toBe(T);
            expect(Type.isMatchType(type4, undefined)).toBe(T);
            expect(Type.isMatchType(type4, '')       ).toBe(false);
            // 리터럴
            expect(Type.isMatchType(type5, 10n)      ).toBe(false);
            expect(Type.isMatchType(type5, 20n)      ).toBe(T);
            expect(Type.isMatchType(type5, undefined)).toBe(T);
            expect(Type.isMatchType(type5, '')       ).toBe(false);
        });
        it('- Type.isMatchType() : symbol (ES6+) ', () => {
            var type1 = Symbol
            var type2 = Symbol()

            // type1
            expect(Type.isMatchType(type1, Symbol()) ).toBe(T);
            expect(Type.isMatchType(type1, undefined)).toBe(false);                
            expect(Type.isMatchType(type1, '')       ).toBe(false);
            expect(Type.isMatchType(type1, Symbol)   ).toBe(false);
            // type2
            expect(Type.isMatchType(type2, Symbol()) ).toBe(T);
            expect(Type.isMatchType(type2, undefined)).toBe(false);                
            expect(Type.isMatchType(type2, '')       ).toBe(false);
            expect(Type.isMatchType(type2, Symbol)   ).toBe(false);
        });
        it('- Type.isMatchType() : object ', () => {
            var type1 = Object     // object
            var type2 = new Date   // object
            var type3 = {}         // union
            var type4 = Date       // class 

            // type1
            expect(Type.isMatchType(type1, {})           ).toBe(false);
            expect(Type.isMatchType(type1, new Date)     ).toBe(T);
            expect(Type.isMatchType(type1, /reg/)        ).toBe(false);
            // type2
            expect(Type.isMatchType(type2, {})           ).toBe(false);
            expect(Type.isMatchType(type2, new Date)     ).toBe(T);
            expect(Type.isMatchType(type2, /reg/)        ).toBe(false);
            // type3
            expect(Type.isMatchType(type3, {})           ).toBe(T);
            expect(Type.isMatchType(type3, new Date)     ).toBe(false);
            expect(Type.isMatchType(type3, /reg/)        ).toBe(false);
            // type4
            expect(Type.isMatchType(type4, {})           ).toBe(false);
            expect(Type.isMatchType(type4, new Date)     ).toBe(T);
            expect(Type.isMatchType(type4, /reg/)        ).toBe(false);
        });
    });
    describe('복합타입 ', () => {
        describe('array ', () => {
            it('- Type.isMatchType() : array 단일타입 ', () => {
                var type1 = [String]
                var type2 = [Number]
                var type3 = [Boolean]
                var type4 = [BigInt]
                var type5 = [RegExp]
                var type6 = [null]
                var type7 = [undefined]
                var type8 = [Symbol]
                var type9 = [Object]

                // type1
                expect(Type.isMatchType(type1, [])               ).toBe(T);
                expect(Type.isMatchType(type1, [''])             ).toBe(T);
                expect(Type.isMatchType(type1, [10])             ).toBe(false);
                expect(Type.isMatchType(type1, ['', 10])         ).toBe(false);
                // type2
                expect(Type.isMatchType(type2, [])               ).toBe(T);
                expect(Type.isMatchType(type2, [10])             ).toBe(T);
                expect(Type.isMatchType(type2, [''])             ).toBe(false);
                expect(Type.isMatchType(type2, ['', 10])         ).toBe(false);
                // type3
                expect(Type.isMatchType(type3, [])               ).toBe(T);
                expect(Type.isMatchType(type3, [true])           ).toBe(T);
                expect(Type.isMatchType(type3, [''])             ).toBe(false);
                expect(Type.isMatchType(type3, ['', true])       ).toBe(false);
                // type4
                expect(Type.isMatchType(type4, [])               ).toBe(T);
                expect(Type.isMatchType(type4, [10n])            ).toBe(T);
                expect(Type.isMatchType(type4, [''])             ).toBe(false);
                expect(Type.isMatchType(type4, ['', 10n])        ).toBe(false);
                // type5
                expect(Type.isMatchType(type5, [])               ).toBe(T);
                expect(Type.isMatchType(type5, [/reg/])          ).toBe(T);
                expect(Type.isMatchType(type5, [''])             ).toBe(false);
                expect(Type.isMatchType(type5, ['', /reg/])      ).toBe(false);
                // type6
                expect(Type.isMatchType(type6, [])               ).toBe(T);
                expect(Type.isMatchType(type6, [null])           ).toBe(T);
                expect(Type.isMatchType(type6, [''])             ).toBe(false);
                expect(Type.isMatchType(type6, ['', null])       ).toBe(false);
                // type7
                expect(Type.isMatchType(type7, [])               ).toBe(T);
                expect(Type.isMatchType(type7, [undefined])      ).toBe(T);
                expect(Type.isMatchType(type7, [''])             ).toBe(false);
                expect(Type.isMatchType(type7, ['', undefined])  ).toBe(false);
                // type8
                expect(Type.isMatchType(type8, [])               ).toBe(T);
                expect(Type.isMatchType(type8, [Symbol()])       ).toBe(T);
                expect(Type.isMatchType(type8, [''])             ).toBe(false);
                expect(Type.isMatchType(type8, ['', Symbol()])   ).toBe(false);
                // type9
                expect(Type.isMatchType(type9, [])               ).toBe(T);
                expect(Type.isMatchType(type9, [new Date()])     ).toBe(T);
                expect(Type.isMatchType(type9, [''])             ).toBe(false);
                expect(Type.isMatchType(type9, ['', new Date()]) ).toBe(false);
            });
            it('- Type.isMatchType() : array 다중타입 ', () => {
                var type1 = [String, Number, Boolean]
                var type2 = [BigInt, RegExp, Symbol, Object]
                var type3 = [null, undefined]

                var tar01 = []
                var tar02 = ['str']
                var tar03 = [10]
                var tar04 = [true]
                var tar05 = ['str', true, 10]

                var tar06 = [10n]
                var tar07 = [/reg/]
                var tar08 = [Symbol()]
                var tar09 = [new Date()]
                var tar10 = [10n, /reg/, Symbol(), new Date()]
                
                var tar11 = [null]
                var tar12 = [undefined]
                var tar13 = [null, undefined]

                // string, number, boolean
                expect(Type.isMatchType(type1, tar01)).toBe(T);
                expect(Type.isMatchType(type1, tar02)).toBe(T);
                expect(Type.isMatchType(type1, tar03)).toBe(T);
                expect(Type.isMatchType(type1, tar04)).toBe(T);
                expect(Type.isMatchType(type1, tar05)).toBe(T);
                expect(Type.isMatchType(type1, tar06)).toBe(false);
                expect(Type.isMatchType(type1, tar07)).toBe(false);
                expect(Type.isMatchType(type1, tar08)).toBe(false);
                expect(Type.isMatchType(type1, tar09)).toBe(false);
                expect(Type.isMatchType(type1, tar10)).toBe(false);
                expect(Type.isMatchType(type1, tar11)).toBe(false);
                expect(Type.isMatchType(type1, tar12)).toBe(false);
                expect(Type.isMatchType(type1, tar13)).toBe(false);
                // bigint, regexp, symbol, object
                expect(Type.isMatchType(type2, tar01)).toBe(T);
                expect(Type.isMatchType(type2, tar02)).toBe(false);
                expect(Type.isMatchType(type2, tar03)).toBe(false);
                expect(Type.isMatchType(type2, tar04)).toBe(false);
                expect(Type.isMatchType(type2, tar05)).toBe(false);
                expect(Type.isMatchType(type2, tar06)).toBe(T);
                expect(Type.isMatchType(type2, tar07)).toBe(T);
                expect(Type.isMatchType(type2, tar08)).toBe(T);
                expect(Type.isMatchType(type2, tar09)).toBe(T);
                expect(Type.isMatchType(type2, tar10)).toBe(T);
                expect(Type.isMatchType(type2, tar11)).toBe(false);
                expect(Type.isMatchType(type2, tar12)).toBe(false);
                expect(Type.isMatchType(type2, tar13)).toBe(false);
                // null, undefined
                expect(Type.isMatchType(type3, tar01)).toBe(T);
                expect(Type.isMatchType(type3, tar02)).toBe(false);
                expect(Type.isMatchType(type3, tar03)).toBe(false);
                expect(Type.isMatchType(type3, tar04)).toBe(false);
                expect(Type.isMatchType(type3, tar05)).toBe(false);
                expect(Type.isMatchType(type3, tar06)).toBe(false);
                expect(Type.isMatchType(type3, tar07)).toBe(false);
                expect(Type.isMatchType(type3, tar08)).toBe(false);
                expect(Type.isMatchType(type3, tar09)).toBe(false);
                expect(Type.isMatchType(type3, tar10)).toBe(false);
                expect(Type.isMatchType(type3, tar11)).toBe(T);
                expect(Type.isMatchType(type3, tar12)).toBe(T);
                expect(Type.isMatchType(type3, tar13)).toBe(T);
            });
            it('- Type.isMatchType() : array _opt_ ', () => {
                var type1 = ['_opt_', String]
                var type2 = [String]           // === type1 
                var type3 = [String, Number]

                var tar01 = []
                var tar02 = ['str']
                var tar03 = [10]
                var tar04 = ['str', 10]
                var tar05 = ['str', 10, true]

                // type1
                expect(Type.isMatchType(type1, tar01)).toBe(T);
                expect(Type.isMatchType(type1, tar02)).toBe(T);
                expect(Type.isMatchType(type1, tar03)).toBe(false);
                expect(Type.isMatchType(type1, tar04)).toBe(false);
                expect(Type.isMatchType(type1, tar05)).toBe(false);
                // type2
                expect(Type.isMatchType(type2, tar01)).toBe(T);
                expect(Type.isMatchType(type2, tar02)).toBe(T);
                expect(Type.isMatchType(type2, tar03)).toBe(false);
                expect(Type.isMatchType(type2, tar04)).toBe(false);
                expect(Type.isMatchType(type2, tar05)).toBe(false);
                // type3
                expect(Type.isMatchType(type3, tar01)).toBe(T);
                expect(Type.isMatchType(type3, tar02)).toBe(T);
                expect(Type.isMatchType(type3, tar03)).toBe(T);
                expect(Type.isMatchType(type3, tar04)).toBe(T);
                expect(Type.isMatchType(type3, tar05)).toBe(false);
            });
            it('- Type.isMatchType() : array _opt_ 리터럴 ', () => {
                var type1 = ['aa', 'bb']
                var type2 = [10, true, /reg/, 10n]

                var tar01 = []
                var tar02 = ['aa']
                var tar03 = ['bb']

                var tar04 = [10, true, /reg/, 10n]
                var tar05 = [20]
                var tar06 = [/reg2/]
                var tar07 = [false]
                var tar08 = [20n]

                // type1
                expect(Type.isMatchType(type1, tar01)).toBe(T);
                expect(Type.isMatchType(type1, tar02)).toBe(T);
                expect(Type.isMatchType(type1, tar03)).toBe(T);
                expect(Type.isMatchType(type1, tar04)).toBe(false);
                expect(Type.isMatchType(type1, tar05)).toBe(false);
                expect(Type.isMatchType(type1, tar06)).toBe(false);
                expect(Type.isMatchType(type1, tar07)).toBe(false);
                expect(Type.isMatchType(type1, tar08)).toBe(false);
                // type2
                expect(Type.isMatchType(type2, tar01)).toBe(T);
                expect(Type.isMatchType(type2, tar02)).toBe(false);
                expect(Type.isMatchType(type2, tar03)).toBe(false);
                expect(Type.isMatchType(type2, tar04)).toBe(T);
                expect(Type.isMatchType(type2, tar05)).toBe(false);
                expect(Type.isMatchType(type2, tar06)).toBe(false);
                expect(Type.isMatchType(type2, tar07)).toBe(false);
                expect(Type.isMatchType(type2, tar08)).toBe(false);
            });
            it('- Type.isMatchType() : array _req_ ', () => {
                var type1 = ['_req_', String]
                var type2 = ['_req_', String, Number]

                var tar01 = []
                var tar02 = ['str']
                var tar03 = [10]
                var tar04 = ['str', 10]
                var tar05 = ['str', 10, true]

                // type1
                expect(Type.isMatchType(type1, tar01)).toBe(false);
                expect(Type.isMatchType(type1, tar02)).toBe(T);
                expect(Type.isMatchType(type1, tar03)).toBe(false);
                expect(Type.isMatchType(type1, tar04)).toBe(false);
                expect(Type.isMatchType(type1, tar05)).toBe(false);
                // type2
                expect(Type.isMatchType(type2, tar01)).toBe(false);
                expect(Type.isMatchType(type2, tar02)).toBe(T);
                expect(Type.isMatchType(type2, tar03)).toBe(T);
                expect(Type.isMatchType(type2, tar04)).toBe(T);
                expect(Type.isMatchType(type2, tar05)).toBe(false);
            });
            it('- Type.isMatchType() : array _req_ 리터럴 ', () => {
                var type1 = ['_req_', 'aa', 'bb']
                var type2 = ['_req_', 10, true, /reg/, 10n]

                var tar01 = []
                var tar02 = ['aa']
                var tar03 = ['bb']

                var tar04 = [true, /reg/, 10n]
                var tar05 = [20]
                var tar06 = [/reg2/]
                var tar07 = [false]
                var tar08 = [20n]

                // type1
                expect(Type.isMatchType(type1, tar01)).toBe(false);
                expect(Type.isMatchType(type1, tar02)).toBe(T);
                expect(Type.isMatchType(type1, tar03)).toBe(T);
                expect(Type.isMatchType(type1, tar04)).toBe(false);
                expect(Type.isMatchType(type1, tar05)).toBe(false);
                expect(Type.isMatchType(type1, tar06)).toBe(false);
                expect(Type.isMatchType(type1, tar07)).toBe(false);
                expect(Type.isMatchType(type1, tar08)).toBe(false);
                // type2
                expect(Type.isMatchType(type2, tar01)).toBe(false);
                expect(Type.isMatchType(type2, tar02)).toBe(false);
                expect(Type.isMatchType(type2, tar03)).toBe(false);
                expect(Type.isMatchType(type2, tar04)).toBe(T);
                expect(Type.isMatchType(type2, tar05)).toBe(false);
                expect(Type.isMatchType(type2, tar06)).toBe(false);
                expect(Type.isMatchType(type2, tar07)).toBe(false);
                expect(Type.isMatchType(type2, tar08)).toBe(false);
            });
            it('- Type.isMatchType() : array _seq_ ', () => {
                var type1 = ['_seq_', String, Number]
                var type2 = ['_seq_']

                var tar01 = []
                var tar02 = ['aa']
                var tar03 = [10]
                var tar04 = [10, 'aa']
                var tar05 = ['aa', 10]
                var tar06 = ['aa', 10, true]
                
                // type1
                expect(Type.isMatchType(type1, tar01)).toBe(false);
                expect(Type.isMatchType(type1, tar02)).toBe(false);
                expect(Type.isMatchType(type1, tar03)).toBe(false);
                expect(Type.isMatchType(type1, tar04)).toBe(false);
                expect(Type.isMatchType(type1, tar05)).toBe(T);
                expect(Type.isMatchType(type1, tar06)).toBe(T);
                // type2
                expect(Type.isMatchType(type2, tar01)).toBe(false);
                expect(Type.isMatchType(type2, tar02)).toBe(false);
                expect(Type.isMatchType(type2, tar03)).toBe(false);
                expect(Type.isMatchType(type2, tar04)).toBe(false);
                expect(Type.isMatchType(type2, tar05)).toBe(false);
                expect(Type.isMatchType(type2, tar06)).toBe(false);
            });
            it('- Type.isMatchType() : array _seq_ 리터럴 ', () => {
                var type1 = ['_seq_', 'aa', 'bb']
                var type2 = ['_seq_', 10, true, /reg/, 10n]

                var tar11 = []
                var tar12 = ['aa']
                var tar13 = ['aa', 'bb']
                var tar14 = ['aa', 'bb', 'cc']
                
                var tar21 = [10, true, /reg/, 10n]
                var tar22 = ['str', 10, true, /reg/, 10n]
                var tar23 = [20, true, /reg/, 10n]
                var tar24 = [10, false, /reg/, 10n]
                var tar25 = [10, true, /reg2/, 10n]
                var tar26 = [10, true, /reg/, 20n]
                var tar27 = [true, 10, /reg/, 10n]

                // type1
                expect(Type.isMatchType(type1, tar11)).toBe(false);
                expect(Type.isMatchType(type1, tar12)).toBe(false);
                expect(Type.isMatchType(type1, tar13)).toBe(T);
                expect(Type.isMatchType(type1, tar14)).toBe(T);
                // type2
                expect(Type.isMatchType(type2, tar21)).toBe(T);
                expect(Type.isMatchType(type2, tar22)).toBe(false);
                expect(Type.isMatchType(type2, tar23)).toBe(false);
                expect(Type.isMatchType(type2, tar24)).toBe(false);
                expect(Type.isMatchType(type2, tar25)).toBe(false);
                expect(Type.isMatchType(type2, tar26)).toBe(false);
                expect(Type.isMatchType(type2, tar27)).toBe(false);
            });
            it('- Type.isMatchType() : array _all_ ', () => {
                var type1 = ['_all_']  // === Array
                var type2 = Array

                // type1
                expect(Type.isMatchType(type1, [])           ).toBe(T);
                expect(Type.isMatchType(type1, ['str'])      ).toBe(T);
                expect(Type.isMatchType(type1, ['aa', 1])    ).toBe(T);
                expect(Type.isMatchType(type1, ['str', 10])  ).toBe(T);
                expect(Type.isMatchType(type1, undefined)    ).toBe(false);
                // type2
                expect(Type.isMatchType(type2, [])           ).toBe(T);
                expect(Type.isMatchType(type2, ['str'])      ).toBe(T);
                expect(Type.isMatchType(type2, ['aa', 1])    ).toBe(T);
                expect(Type.isMatchType(type2, ['str', 10])  ).toBe(T);
                expect(Type.isMatchType(type2, undefined)    ).toBe(false);
            });
            it('- Type.isMatchType() : array _any_ ', () => {
                var type1 = ['_any_']  // === []
                var type2 = []

                // type1
                expect(Type.isMatchType(type1, [])           ).toBe(false);
                expect(Type.isMatchType(type1, ['str'])      ).toBe(T);
                expect(Type.isMatchType(type1, ['aa', 1])    ).toBe(T);
                expect(Type.isMatchType(type1, ['str', 10])  ).toBe(T);
                expect(Type.isMatchType(type1, undefined)    ).toBe(false);
                // type2
                expect(Type.isMatchType(type2, [])           ).toBe(false);
                expect(Type.isMatchType(type2, ['str'])      ).toBe(T);
                expect(Type.isMatchType(type2, ['aa', 1])    ).toBe(T);
                expect(Type.isMatchType(type2, ['str', 10])  ).toBe(T);
                expect(Type.isMatchType(type2, undefined)    ).toBe(false);
            });
            
            it('- Type.isMatchType() : array 중첩타입 array ', () => { 
                var type1 = [ [String], [Number] ]
                var type2 = ['_opt_', [String, Number] ]

                var tar01 = []
                var tar02 = [ [] ]
                var tar03 = [['aa', 'bb'] ]
                var tar04 = [ [10, 20] ]
                var tar05 = [ ['aa', 'bb'], [10, 20] ]
                var tar06 = [ [10, 'bb'], [10, 20] ]
                var tar07 = [ [true] ]
                var tar08 = ['aa']  

                // type1
                expect(Type.isMatchType(type1, tar01)).toBe(T);
                expect(Type.isMatchType(type1, tar02)).toBe(T);
                expect(Type.isMatchType(type1, tar03)).toBe(T);
                expect(Type.isMatchType(type1, tar04)).toBe(T);
                expect(Type.isMatchType(type1, tar05)).toBe(T);
                expect(Type.isMatchType(type1, tar06)).toBe(false);
                expect(Type.isMatchType(type1, tar07)).toBe(false);
                expect(Type.isMatchType(type1, tar08)).toBe(false);
                // type2
                expect(Type.isMatchType(type2, tar01)).toBe(T);
                expect(Type.isMatchType(type2, tar02)).toBe(T);
                expect(Type.isMatchType(type2, tar03)).toBe(T);
                expect(Type.isMatchType(type2, tar04)).toBe(T);
                expect(Type.isMatchType(type2, tar05)).toBe(T);
                expect(Type.isMatchType(type2, tar06)).toBe(T);
                expect(Type.isMatchType(type2, tar07)).toBe(false);
                expect(Type.isMatchType(type2, tar08)).toBe(false);
            });
            it('- Type.isMatchType() : array 중첩타입 choice ', () => {
                var type1 = [ [[Boolean, Number]] ]   // === type2
                var type2 = [ Boolean, Number ]
                var type3 = [ [[Boolean, Number]], [['aa', 'bb']] ]

                var tar01 = []
                var tar02 = [true, false]
                var tar03 = [10]
                var tar04 = [true, false, 10]
                var tar05 = ['aa']
                var tar06 = [true, false, 10, 'aa', 'bb']
                var tar07 = [true, false, 10, 'cc']

                // type1
                expect(Type.isMatchType(type1, tar01)).toBe(T);
                expect(Type.isMatchType(type1, tar02)).toBe(T);
                expect(Type.isMatchType(type1, tar03)).toBe(T);
                expect(Type.isMatchType(type1, tar04)).toBe(T);
                expect(Type.isMatchType(type1, tar05)).toBe(false);
                expect(Type.isMatchType(type1, tar06)).toBe(false);
                expect(Type.isMatchType(type1, tar07)).toBe(false);
                // type2
                expect(Type.isMatchType(type2, tar01)).toBe(T);
                expect(Type.isMatchType(type2, tar02)).toBe(T);
                expect(Type.isMatchType(type2, tar03)).toBe(T);
                expect(Type.isMatchType(type2, tar04)).toBe(T);
                expect(Type.isMatchType(type2, tar05)).toBe(false);
                expect(Type.isMatchType(type2, tar06)).toBe(false);
                expect(Type.isMatchType(type2, tar07)).toBe(false);
                // type3
                expect(Type.isMatchType(type3, tar01)).toBe(T);
                expect(Type.isMatchType(type3, tar02)).toBe(T);
                expect(Type.isMatchType(type3, tar03)).toBe(T);
                expect(Type.isMatchType(type3, tar04)).toBe(T);
                expect(Type.isMatchType(type3, tar05)).toBe(T);
                expect(Type.isMatchType(type3, tar06)).toBe(T);
                expect(Type.isMatchType(type3, tar07)).toBe(false);
            });
            it('- Type.isMatchType() : array 중첩타입 class ', () => {
                class ClassA { aa = String }
                class ClassB { aa = Number }
                class ClassC { aa = Boolean }

                var type1 = [ ClassA, ClassB ]

                var tar01 = [ ClassA, ClassB ]
                var tar02 = [ ClassC ]
                var tar03 = [ {aa: 'str'}, {aa: 10} ]
                var tar04 = [ {aa: true} ]

                expect(Type.isMatchType(type1, tar01)).toBe(T);
                expect(Type.isMatchType(type1, tar02)).toBe(false);
                expect(Type.isMatchType(type1, tar03)).toBe(false);
                expect(Type.isMatchType(type1, tar04)).toBe(false);
                // opt === 1 (확장모드)
                expect(Type.isMatchType(type1, tar01, 1)).toBe(T);
                expect(Type.isMatchType(type1, tar02, 1)).toBe(false);
                expect(Type.isMatchType(type1, tar03, 1)).toBe(T);
                expect(Type.isMatchType(type1, tar04, 1)).toBe(false);
            });
            it('- Type.isMatchType() : array 중첩타입 union ', () => {
                var type1 = [ { aa: String }, { aa: Number } ]

                var tar01 = [ { aa: 'str' } ]
                var tar02 = [ { aa: 10 } ]
                var tar03 = [ { aa: 'str' }, { aa: 10 }  ]
                var tar04 = [ { aa: true } ]
                var tar05 = [ { aa: 'str' }, { aa: 10 }, { aa: true } ]

                expect(Type.isMatchType(type1, tar01)).toBe(T);
                expect(Type.isMatchType(type1, tar02)).toBe(T);
                expect(Type.isMatchType(type1, tar03)).toBe(T);
                expect(Type.isMatchType(type1, tar04)).toBe(false);
                expect(Type.isMatchType(type1, tar05)).toBe(false);
            });
            it('- Type.isMatchType() : array 중첩타입 function ', () => {
                var type1 = [String=>Number, String=>Boolean];

                var tar01 = [String=>Number]
                var tar02 = [String=>Boolean]
                var tar03 = [String=>{}]
                var tar04 = [String=>Number, String=>Boolean]

                expect(Type.isMatchType(type1, tar01)).toBe(T);
                expect(Type.isMatchType(type1, tar02)).toBe(T);
                expect(Type.isMatchType(type1, tar03)).toBe(false);
                expect(Type.isMatchType(type1, tar04)).toBe(T);
            });
        });
        describe('choice ', () => {
            it('- Type.isMatchType() : choice _opt_ ', () => {
                var type1 = [[String]]
                var type2 = [[String, Number]]
                var type3 = [[String, 10]]
                var type4 = [['aa', /reg/]]
                var type5 = [['_opt_']]

                // type1 
                expect(Type.isMatchType(type1, '')           ).toBe(T);
                expect(Type.isMatchType(type1, 10)           ).toBe(false);
                expect(Type.isMatchType(type1, undefined)    ).toBe(T);
                expect(Type.isMatchType(type1, true)         ).toBe(false);
                // type2
                expect(Type.isMatchType(type2, '')           ).toBe(T);
                expect(Type.isMatchType(type2, 10)           ).toBe(T);
                expect(Type.isMatchType(type2, undefined)    ).toBe(T);
                expect(Type.isMatchType(type2, true)         ).toBe(false);
                // type3
                expect(Type.isMatchType(type3, '')           ).toBe(T);
                expect(Type.isMatchType(type3, 10)           ).toBe(T);
                expect(Type.isMatchType(type3, 20)           ).toBe(false);
                expect(Type.isMatchType(type3, undefined)    ).toBe(T);
                expect(Type.isMatchType(type3, true)         ).toBe(false);
                // type4
                expect(Type.isMatchType(type4, '')           ).toBe(false);
                expect(Type.isMatchType(type4, 'aa')         ).toBe(T);
                expect(Type.isMatchType(type4, /reg2/)       ).toBe(false);
                expect(Type.isMatchType(type4, /reg/)        ).toBe(T);
                expect(Type.isMatchType(type4, 10)           ).toBe(false);
                expect(Type.isMatchType(type4, undefined)    ).toBe(T);
                expect(Type.isMatchType(type4, true)         ).toBe(false);
                // type5 : 모두 실패
                expect(Type.isMatchType(type5, '')           ).toBe(false);
                expect(Type.isMatchType(type5, 10)           ).toBe(false);
                expect(Type.isMatchType(type5, undefined)    ).toBe(false);
                expect(Type.isMatchType(type5, true)         ).toBe(false);
            });
            it('- Type.isMatchType() : choice _req_ ', () => {
                var type1 = [['_req_', String]]
                var type2 = [['_req_', String, Number]]
                var type3 = [['_req_', String, 10]]
                var type4 = [['_req_', 'aa', /reg/]]
                var type5 = [['_req_']]

                // type1
                expect(Type.isMatchType(type1, '')           ).toBe(T);
                expect(Type.isMatchType(type1, 10)           ).toBe(false);
                expect(Type.isMatchType(type1, undefined)    ).toBe(false);
                expect(Type.isMatchType(type1, true)         ).toBe(false);
                // type2
                expect(Type.isMatchType(type2, '')           ).toBe(T);
                expect(Type.isMatchType(type2, 10)           ).toBe(T);
                expect(Type.isMatchType(type2, undefined)    ).toBe(false);
                expect(Type.isMatchType(type2, true)         ).toBe(false);
                // type3
                expect(Type.isMatchType(type3, '')           ).toBe(T);
                expect(Type.isMatchType(type3, 10)           ).toBe(T);
                expect(Type.isMatchType(type3, 20)           ).toBe(false);
                expect(Type.isMatchType(type3, undefined)    ).toBe(false);
                expect(Type.isMatchType(type3, true)         ).toBe(false);
                // type4
                expect(Type.isMatchType(type4, '')           ).toBe(false);
                expect(Type.isMatchType(type4, 'aa')         ).toBe(T);
                expect(Type.isMatchType(type4, /reg/)        ).toBe(T);
                expect(Type.isMatchType(type4, 10)           ).toBe(false);
                expect(Type.isMatchType(type4, undefined)    ).toBe(false);
                expect(Type.isMatchType(type4, true)         ).toBe(false);
                // type5 : 모두 실패
                expect(Type.isMatchType(type5, '')           ).toBe(false);
                expect(Type.isMatchType(type5, 10)           ).toBe(false);
                expect(Type.isMatchType(type5, undefined)    ).toBe(false);
                expect(Type.isMatchType(type5, true)         ).toBe(false);
            });
            it('- Type.isMatchType() : choice _all_ ', () => {
                var type1 = [['_all_']]

                // 모든 타입 허용
                expect(Type.isMatchType(type1, '')           ).toBe(T);
                expect(Type.isMatchType(type1, 10)           ).toBe(T);
                expect(Type.isMatchType(type1, true)         ).toBe(T);
                expect(Type.isMatchType(type1, 1n)           ).toBe(T);
                expect(Type.isMatchType(type1, Symbol())     ).toBe(T);
                expect(Type.isMatchType(type1, /reg/)        ).toBe(T);
                expect(Type.isMatchType(type1, {})           ).toBe(T);
                expect(Type.isMatchType(type1, {a: 1})       ).toBe(T);
                expect(Type.isMatchType(type1, Date)         ).toBe(T);
                expect(Type.isMatchType(type1, [[]])         ).toBe(T);
                expect(Type.isMatchType(type1, [])           ).toBe(T);
                expect(Type.isMatchType(type1, undefined)    ).toBe(T);
            });
            it('- Type.isMatchType() : choice _any_ ', () => {
                var type1 = [['_any_']]

                // undefined 제외 허용, 필수값 의미
                expect(Type.isMatchType(type1, '')           ).toBe(T);
                expect(Type.isMatchType(type1, 10)           ).toBe(T);
                expect(Type.isMatchType(type1, true)         ).toBe(T);
                expect(Type.isMatchType(type1, 1n)           ).toBe(T);
                expect(Type.isMatchType(type1, Symbol())     ).toBe(T);
                expect(Type.isMatchType(type1, /reg/)        ).toBe(T);
                expect(Type.isMatchType(type1, {})           ).toBe(T);
                expect(Type.isMatchType(type1, {a: 1})       ).toBe(T);
                expect(Type.isMatchType(type1, Date)         ).toBe(T);
                expect(Type.isMatchType(type1, [[]])         ).toBe(T);
                expect(Type.isMatchType(type1, [])           ).toBe(T);
                expect(Type.isMatchType(type1, undefined)    ).toBe(false);
            });
            it('- Type.isMatchType() : choice _non_ ', () => {
                var type1 = [['_non_']]    // === undfined

                // undefined 만 허용
                expect(Type.isMatchType(type1, '')           ).toBe(false);
                expect(Type.isMatchType(type1, 10)           ).toBe(false);
                expect(Type.isMatchType(type1, true)         ).toBe(false);
                expect(Type.isMatchType(type1, 1n)           ).toBe(false);
                expect(Type.isMatchType(type1, Symbol())     ).toBe(false);
                expect(Type.isMatchType(type1, /reg/)        ).toBe(false);
                expect(Type.isMatchType(type1, {})           ).toBe(false);
                expect(Type.isMatchType(type1, {a: 1})       ).toBe(false);
                expect(Type.isMatchType(type1, Date)         ).toBe(false);
                expect(Type.isMatchType(type1, [[]])         ).toBe(false);
                expect(Type.isMatchType(type1, [])           ).toBe(false);
                expect(Type.isMatchType(type1, undefined)    ).toBe(T);
            });
            it('- Type.isMatchType() : choice _eum_ ', () => {  
                var type1 = [['_eum_']]
                var type2 = [['_eum_', 'aa']]
                var type3 = [['_eum_', 'aa', /reg/, 10]]
                var type4 = [['_eum_', 'aa', Number]]     // 오류

                // type1
                expect(Type.isMatchType(type1, '')           ).toBe(false);
                expect(Type.isMatchType(type1, 'aa')         ).toBe(false);
                // type2
                expect(Type.isMatchType(type2, '')           ).toBe(false);
                expect(Type.isMatchType(type2, 'aa')         ).toBe(T);
                expect(Type.isMatchType(type2, undefined)    ).toBe(false);
                // type3
                expect(Type.isMatchType(type3, '')           ).toBe(false);
                expect(Type.isMatchType(type3, 'aa')         ).toBe(T);
                expect(Type.isMatchType(type3, /reg/)        ).toBe(T);
                expect(Type.isMatchType(type3, 10)           ).toBe(T);
                expect(Type.isMatchType(type3, undefined)    ).toBe(false);
                // type4, 리터럴값만 허용
                expect(Type.isMatchType(type4, 'aa')         ).toBe(false);
                expect(Type.isMatchType(type4, 10)           ).toBe(false);
                expect(Type.isMatchType(type4, undefined)    ).toBe(false);
            });
            it('- Type.isMatchType() : choice _def_ ', () => {
                var type1 = [['_def_']]
                var type2 = [['_def_', 'aa']]
                var type3 = [['_def_', 'aa', /reg/, 10]]
                var type4 = [['_def_', 'aa', Number]]
                var type5 = [['_def_', String, 10]]   // 오류

                // type1
                expect(Type.isMatchType(type1, '')           ).toBe(false);
                expect(Type.isMatchType(type1, 'aa')         ).toBe(false);
                // type2
                expect(Type.isMatchType(type2, '')           ).toBe(false);
                expect(Type.isMatchType(type2, 'aa')         ).toBe(T);
                expect(Type.isMatchType(type2, undefined)    ).toBe(T);
                // type3
                expect(Type.isMatchType(type3, '')           ).toBe(false);
                expect(Type.isMatchType(type3, 'aa')         ).toBe(T);
                expect(Type.isMatchType(type3, /reg/)        ).toBe(T);
                expect(Type.isMatchType(type3, 10)           ).toBe(T);
                expect(Type.isMatchType(type3, undefined)    ).toBe(T);
                // type4
                expect(Type.isMatchType(type4, '')           ).toBe(false);
                expect(Type.isMatchType(type4, 'aa')         ).toBe(T);
                expect(Type.isMatchType(type4, /reg/)        ).toBe(false);
                expect(Type.isMatchType(type4, 10)           ).toBe(T);
                expect(Type.isMatchType(type4, undefined)    ).toBe(T);
                // type5, 첫째 값은 리터럴만 허용
                expect(Type.isMatchType(type5, 'aa')         ).toBe(false);
                expect(Type.isMatchType(type5, 10)           ).toBe(false);
                expect(Type.isMatchType(type5, undefined)    ).toBe(false);
            });
            
            it('- Type.isMatchType() : choice 중첩타입 array ', () => {
                var type1 = [[ [String], [Number] ]]
                var type2 = [[ [String, Number] ]]

                var tar01 = []
                var tar02 = ['str']
                var tar03 = [10]
                var tar04 = ['str', 10]

                // type1 : 단일 요소만 허용
                expect(Type.isMatchType(type1, tar01)).toBe(T);
                expect(Type.isMatchType(type1, tar02)).toBe(T);
                expect(Type.isMatchType(type1, tar03)).toBe(T);
                expect(Type.isMatchType(type1, tar04)).toBe(false);
                // type2
                expect(Type.isMatchType(type2, tar01)).toBe(T);
                expect(Type.isMatchType(type2, tar02)).toBe(T);
                expect(Type.isMatchType(type2, tar03)).toBe(T);
                expect(Type.isMatchType(type2, tar04)).toBe(T);
            }); 
            it('- Type.isMatchType() : choice 중첩타입 choice ', () => {
                var type1 = [[ [[String]], [[Number]] ]]   // === type2
                var type2 = [[ [[String, Number]] ]]
                var type3 = [['_req_', [[String, Number]] ]]   // ** opt는 undefined 도 포함함 **
                var type4 = [['_req_', [['_req_', String, Number]] ]]

                var tar01 = 'str'
                var tar02 = 10
                var tar03 = true
                var tar04 = undefined
                
                // type1
                expect(Type.isMatchType(type1, tar01)).toBe(T);
                expect(Type.isMatchType(type1, tar02)).toBe(T);
                expect(Type.isMatchType(type1, tar03)).toBe(false);
                expect(Type.isMatchType(type1, tar04)).toBe(T);
                // type2
                expect(Type.isMatchType(type2, tar01)).toBe(T);
                expect(Type.isMatchType(type2, tar02)).toBe(T);
                expect(Type.isMatchType(type2, tar03)).toBe(false);
                expect(Type.isMatchType(type2, tar04)).toBe(T);
                // type3
                expect(Type.isMatchType(type3, tar01)).toBe(T);
                expect(Type.isMatchType(type3, tar02)).toBe(T);
                expect(Type.isMatchType(type3, tar03)).toBe(false);
                expect(Type.isMatchType(type3, tar04)).toBe(T);
                // type4
                expect(Type.isMatchType(type4, tar01)).toBe(T);
                expect(Type.isMatchType(type4, tar02)).toBe(T);
                expect(Type.isMatchType(type4, tar03)).toBe(false);
                expect(Type.isMatchType(type4, tar04)).toBe(false);
            }); 
            it('- Type.isMatchType() : choice 중첩타입 class ', () => {
                class ClassA { aa = String }
                class ClassB { aa = Number }
                class ClassC { aa = Boolean }

                var type1 = [[ClassA, ClassB]]

                var tar01 = ClassA
                var tar02 = ClassB
                var tar03 = ClassC
                var tar04 = { aa: 'str' }
                var tar05 = { aa: 10 }
                var tar06 = { aa: true }
                
                expect(Type.isMatchType(type1, tar01)).toBe(T);
                expect(Type.isMatchType(type1, tar02)).toBe(T);
                expect(Type.isMatchType(type1, tar03)).toBe(false);
                expect(Type.isMatchType(type1, tar04)).toBe(false);
                expect(Type.isMatchType(type1, tar05)).toBe(false);
                expect(Type.isMatchType(type1, tar06)).toBe(false);
                // opt = 1, 확장모드
                expect(Type.isMatchType(type1, tar01, 1)).toBe(T);
                expect(Type.isMatchType(type1, tar02, 1)).toBe(T);
                expect(Type.isMatchType(type1, tar03, 1)).toBe(false);
                expect(Type.isMatchType(type1, tar04, 1)).toBe(T);
                expect(Type.isMatchType(type1, tar05, 1)).toBe(T);
                expect(Type.isMatchType(type1, tar06, 1)).toBe(false);
            });
            it('- Type.isMatchType() : choice 중첩타입 union ', () => {
                var type1 = [[ { aa: String }, { aa: Number } ]]
                var type2 = [[ { aa: String, bb: Boolean } ]]
                
                var tar01 = { aa: 'str' }
                var tar02 = { aa: 10 }
                var tar03 = { bb: true }
                var tar04 = { aa: 'str', bb: true }

                // type1
                expect(Type.isMatchType(type1, tar01)).toBe(T);
                expect(Type.isMatchType(type1, tar02)).toBe(T);
                expect(Type.isMatchType(type1, tar03)).toBe(false);
                expect(Type.isMatchType(type1, tar04)).toBe(T);
                // type2
                expect(Type.isMatchType(type2, tar01)).toBe(false);
                expect(Type.isMatchType(type2, tar02)).toBe(false);
                expect(Type.isMatchType(type2, tar03)).toBe(false);
                expect(Type.isMatchType(type2, tar04)).toBe(T);
            }); 
            it('- Type.isMatchType() : choice 중첩타입 function ', () => {
                var type1 = [[ String=>Number, String=>Boolean ]]
                var type2 = [[ String=>{} ]]
                var type3 = [[ { $type: 'function', return: [['_non_']] } ]]
                // var type3 = [[ String=>{ [['_non_']] } ]]; TODO: [['_non_']] 표현식 파싱을 못하는 문제

                var tar01 = { $type: 'function', params: [String], return: Number } 
                var tar02 = { $type: 'function', params: [String], return: Boolean }
                var tar03 = { $type: 'function', params: [String], return: String }
                var tar04 = { $type: 'function', params: [String], return: [['_non_']] }

                // type1
                expect(Type.isMatchType(type1, tar01)).toBe(T);
                expect(Type.isMatchType(type1, tar02)).toBe(T);
                expect(Type.isMatchType(type1, tar03)).toBe(false);
                expect(Type.isMatchType(type1, tar04)).toBe(false);
                // type2, string 으로 시작하는 모든 타입 허용
                expect(Type.isMatchType(type2, tar01)).toBe(T);
                expect(Type.isMatchType(type2, tar02)).toBe(T);
                expect(Type.isMatchType(type2, tar03)).toBe(T);
                expect(Type.isMatchType(type2, tar04)).toBe(T);
                // type3
                expect(Type.isMatchType(type3, tar01)).toBe(false);
                expect(Type.isMatchType(type3, tar02)).toBe(false);
                expect(Type.isMatchType(type3, tar03)).toBe(false);
                expect(Type.isMatchType(type3, tar04)).toBe(T);
            }); 
        });
        describe('class', () => {
            it('- Type.isMatchType() : class instainceof, union ', () => {
                function ClassA() { this.age = Number; this.fun = (a,b)=>{} }
                class ClassB { age = 10; fun = function(){} }

                var tar01 = new ClassA()               // union
                var tar02 = new ClassB()               // union
                var tar03 = { age: 10, fun: ()=>{} }   // union
                var tar04 = { age: 10 }                // union 

                // class to class
                expect(Type.isMatchType(ClassA, ClassA)).toBe(T);
                expect(Type.isMatchType(ClassA, ClassB)).toBe(false);
                expect(Type.isMatchType(ClassB, ClassA)).toBe(false);
                expect(Type.isMatchType(ClassB, ClassB)).toBe(T);
                
                // class to union
                
                // opt === 0 : proto, instanceof 만 허용
                // ClassA
                expect(Type.isMatchType(ClassA, tar01)).toBe(T); 
                expect(Type.isMatchType(ClassA, tar02)).toBe(false);   
                expect(Type.isMatchType(ClassA, tar03)).toBe(false);
                expect(Type.isMatchType(ClassA, tar04)).toBe(false);
                // ClassB
                expect(Type.isMatchType(ClassB, tar01)).toBe(false);
                expect(Type.isMatchType(ClassB, tar02)).toBe(T);
                expect(Type.isMatchType(ClassB, tar03)).toBe(false);
                expect(Type.isMatchType(ClassB, tar04)).toBe(false);
                
                // opt == 1, 확장모드
                // ClassA
                expect(Type.isMatchType(ClassA, tar01, 1)).toBe(T); 
                expect(Type.isMatchType(ClassA, tar02, 1)).toBe(T);   
                expect(Type.isMatchType(ClassA, tar03, 1)).toBe(T);
                expect(Type.isMatchType(ClassA, tar04, 1)).toBe(false);
                // ClassB
                expect(Type.isMatchType(ClassB, tar01, 1)).toBe(false);
                expect(Type.isMatchType(ClassB, tar02, 1)).toBe(T);
                expect(Type.isMatchType(ClassB, tar03, 1)).toBe(T);
                expect(Type.isMatchType(ClassB, tar04, 1)).toBe(false);

            });
            it('- Type.isMatchType() : class instanceof(내장함수) ', () => {
                var type1 = Date

                var tar01 = {}
                var tar02 = new Date()

                expect(Type.isMatchType(type1, tar01)).toBe(false);
                expect(Type.isMatchType(type1, tar02)).toBe(T);
            });
            it('- Type.isMatchType() : class proto(상속)', () => {
                class ClassA { age = Number }
                class ClassB extends ClassA { color = String }
                class ClassC { color = String; age = Number }

                // ClassA
                expect(Type.isMatchType(ClassA, ClassA)).toBe(T);
                expect(Type.isMatchType(ClassA, ClassB)).toBe(T);   
                expect(Type.isMatchType(ClassA, ClassC)).toBe(false);
                // ClassB
                expect(Type.isMatchType(ClassB, ClassA)).toBe(false);
                expect(Type.isMatchType(ClassB, ClassB)).toBe(T);
                expect(Type.isMatchType(ClassB, ClassC)).toBe(false);
                // ClassC
                expect(Type.isMatchType(ClassC, ClassA)).toBe(false);
                expect(Type.isMatchType(ClassC, ClassB)).toBe(false);
                expect(Type.isMatchType(ClassC, ClassC)).toBe(T);
            });
        });
        describe('union', () => {
            it('- Type.isMatchType() : union ', () => {
                var type1 = { str: '', num: Number }
                var type2 = { arr: ['blue'] }
 
                var tar11 = { str: 's' }
                var tar12 = { num: 10 }
                var tar13 = { str: 's', num: 10 }
                var tar14 = { str: 10, num: 10 }

                var tar21 = { arr:['blue'] }
                var tar22 = { arr:['red'] }
                var tar23 = { arr:[] }
                
                 // type1
                expect(Type.isMatchType(type1, tar11)).toBe(false);
                expect(Type.isMatchType(type1, tar12)).toBe(T);
                expect(Type.isMatchType(type1, tar13)).toBe(T);
                expect(Type.isMatchType(type1, tar14)).toBe(false);
                // type2
                expect(Type.isMatchType(type2, tar21)).toBe(T);
                expect(Type.isMatchType(type2, tar22)).toBe(false);
                expect(Type.isMatchType(type2, tar23)).toBe(T);
            });
            it('- Type.isMatchType() : union 단일타입 ', () => {
                var type1 = { aa: String }
                var type2 = { aa: Number }
                var type3 = { aa: Boolean }
                var type4 = { aa: BigInt }
                var type5 = { aa: null }
                var type6 = { aa: undefined }
                var type7 = { aa: [['_NON_']] }
                var type8 = { aa: RegExp }
                var type9 = { aa: Object }
                var type10 = { aa: Symbol }

                // type1
                expect(Type.isMatchType(type1, {aa: ''})         ).toBe(T);
                expect(Type.isMatchType(type1, {aa: 's'})        ).toBe(T);
                expect(Type.isMatchType(type1, {aa: 10})         ).toBe(false);
                expect(Type.isMatchType(type1, {aa: undefined})  ).toBe(false);
                // type2
                expect(Type.isMatchType(type2, {aa: 10})         ).toBe(T);
                expect(Type.isMatchType(type2, {aa: 0})          ).toBe(T);
                expect(Type.isMatchType(type2, {aa: ''})         ).toBe(false);
                expect(Type.isMatchType(type2, {aa: undefined})  ).toBe(false);
                // type3
                expect(Type.isMatchType(type3, {aa: true})       ).toBe(T);
                expect(Type.isMatchType(type3, {aa: false})      ).toBe(T);
                expect(Type.isMatchType(type3, {aa: ''})         ).toBe(false);
                expect(Type.isMatchType(type3, {aa: undefined})  ).toBe(false);
                // type4
                expect(Type.isMatchType(type4, {aa: 10n})        ).toBe(T);
                expect(Type.isMatchType(type4, {aa: 0n})         ).toBe(T);
                expect(Type.isMatchType(type4, {aa: ''})         ).toBe(false);
                expect(Type.isMatchType(type4, {aa: undefined})  ).toBe(false);
                // type5
                expect(Type.isMatchType(type5, {aa: null})       ).toBe(T);
                expect(Type.isMatchType(type5, {aa: ''})         ).toBe(false);
                expect(Type.isMatchType(type5, {aa: undefined})  ).toBe(false);
                // type6
                expect(Type.isMatchType(type6, {aa: undefined})  ).toBe(T);
                expect(Type.isMatchType(type6, {aa: null})       ).toBe(false);
                expect(Type.isMatchType(type6, {aa: ''})         ).toBe(false);
                // type7
                expect(Type.isMatchType(type7, {aa: undefined})  ).toBe(T);
                expect(Type.isMatchType(type7, {aa: null})       ).toBe(false);
                expect(Type.isMatchType(type7, {aa: ''})         ).toBe(false);
                // type8
                expect(Type.isMatchType(type8, {aa: /reg/})      ).toBe(T);
                expect(Type.isMatchType(type8, {aa: null})       ).toBe(false);
                expect(Type.isMatchType(type8, {aa: ''})         ).toBe(false);
                // type9
                expect(Type.isMatchType(type9, {aa: new Date()}) ).toBe(T);
                expect(Type.isMatchType(type9, {aa: null})       ).toBe(false);
                expect(Type.isMatchType(type9, {aa: ''})         ).toBe(false);
                // type10
                expect(Type.isMatchType(type10, {aa: Symbol()})  ).toBe(T);
                expect(Type.isMatchType(type10, {aa: Symbol})    ).toBe(false);
                expect(Type.isMatchType(type10, {aa: ''})        ).toBe(false);
            });
            it('- Type.isMatchType() : union 기본값 ', () => {
                var type1 = { aa: 'str', bb: 10, cc: true, dd: 10n, ee: /reg/ }
                
                var tar01 = {}
                var after = { aa: 'str', bb: 10, cc: true, dd: 10n, ee: /reg/ }

                expect(Type.isMatchType(type1, tar01)).toBe(T);
                expect(after).toEqual(after);
            });
            it('- Type.isMatchType() : union 중첩타입 array ', () => {
                var type1 = { aa: Array }

                var tar01 = { aa: [] }
                var tar02 = { aa: ['str', 10] }
                var tar03 = { aa: 10 }

                expect(Type.isMatchType(type1, tar01)).toBe(T);
                expect(Type.isMatchType(type1, tar02)).toBe(T);
                expect(Type.isMatchType(type1, tar03)).toBe(false);
            });
            it('- Type.isMatchType() : union 중첩타입 array + 요소 ', () => {
                var type1 = { aa: [] }
                var type2 = { aa: ['_req_', String] }
                var type3 = { aa: ['_req_', String, Number] }
                var type4 = { aa: Array }
                var type5 = { aa: [String] }
                var type6 = { aa: [String, Number] }

                var tar01 = { aa: [] }
                var tar02 = { aa: ['str'] }
                var tar03 = { aa: [10] }
                var tar04 = { aa: ['str', 10] }
                var tar05 = { aa: ['str', 10, true] }

                // type1
                expect(Type.isMatchType(type1, tar01)).toBe(false);
                expect(Type.isMatchType(type1, tar02)).toBe(T);
                expect(Type.isMatchType(type1, tar03)).toBe(T);
                expect(Type.isMatchType(type1, tar04)).toBe(T);
                expect(Type.isMatchType(type1, tar05)).toBe(T);
                // type2
                expect(Type.isMatchType(type2, tar01)).toBe(false);
                expect(Type.isMatchType(type2, tar02)).toBe(T);
                expect(Type.isMatchType(type2, tar03)).toBe(false);
                expect(Type.isMatchType(type2, tar04)).toBe(false);
                expect(Type.isMatchType(type2, tar05)).toBe(false);
                // type3
                expect(Type.isMatchType(type3, tar01)).toBe(false);
                expect(Type.isMatchType(type3, tar02)).toBe(T);
                expect(Type.isMatchType(type3, tar03)).toBe(T);
                expect(Type.isMatchType(type3, tar04)).toBe(T);
                expect(Type.isMatchType(type3, tar05)).toBe(false);
                // type4
                expect(Type.isMatchType(type4, tar01)).toBe(T);
                expect(Type.isMatchType(type4, tar02)).toBe(T);
                expect(Type.isMatchType(type4, tar03)).toBe(T);
                expect(Type.isMatchType(type4, tar04)).toBe(T);
                expect(Type.isMatchType(type4, tar05)).toBe(T);
                // type5
                expect(Type.isMatchType(type5, tar01)).toBe(T);
                expect(Type.isMatchType(type5, tar02)).toBe(T);
                expect(Type.isMatchType(type5, tar03)).toBe(false);
                expect(Type.isMatchType(type5, tar04)).toBe(false);
                expect(Type.isMatchType(type5, tar05)).toBe(false);
                // type6
                expect(Type.isMatchType(type6, tar01)).toBe(T);
                expect(Type.isMatchType(type6, tar02)).toBe(T);
                expect(Type.isMatchType(type6, tar03)).toBe(T);
                expect(Type.isMatchType(type6, tar04)).toBe(T);
                expect(Type.isMatchType(type6, tar05)).toBe(false);
            });
            it('- Type.isMatchType() : union 중첩타입 choice ', () => {
                var type1 = { aa: [['_req_', String, Number]] }

                var tar01 = { aa: 'str' }
                var tar02 = { aa: 10 }
                var tar03 = { aa: true }

                expect(Type.isMatchType(type1, tar01)).toBe(T);
                expect(Type.isMatchType(type1, tar02)).toBe(T);
                expect(Type.isMatchType(type1, tar03)).toBe(false);
            });
            it('- Type.isMatchType() : union 중첩타입 class ', () => {
                class ClassA { bb = String;}
                class ClassB extends ClassA { cc = Number;}
                class ClassC { bb = String;}

                var type1 = { aa: ClassA }

                var tar01 = { aa: { bb: 'str' } } 
                var tar02 = { aa: { bb: 10 } }
                var tar03 = { aa: ClassA }
                var tar04 = { aa: ClassB }
                var tar05 = { aa: ClassC }

                // opt === 0
                expect(Type.isMatchType(type1, tar01)).toBe(false);
                expect(Type.isMatchType(type1, tar02)).toBe(false);
                expect(Type.isMatchType(type1, tar03)).toBe(T);
                expect(Type.isMatchType(type1, tar04)).toBe(T);
                expect(Type.isMatchType(type1, tar05)).toBe(false);
                // opt === 1
                expect(Type.isMatchType(type1, tar01, 1)).toBe(T);
                expect(Type.isMatchType(type1, tar02, 1)).toBe(false);
                expect(Type.isMatchType(type1, tar03, 1)).toBe(T);
                expect(Type.isMatchType(type1, tar04, 1)).toBe(T);
                expect(Type.isMatchType(type1, tar05, 1)).toBe(false);
            });
            it('- Type.isMatchType() : union 복합타입 union ', () => {
                var type1 = { aa: { bb: String } }
                 
                var tar01 = { aa: { bb: 'str' } }
                var tar02 = { aa: { bb: 10 } }
                var tar03 = { aa: {} }

                expect(Type.isMatchType(type1, tar01)).toBe(T);
                expect(Type.isMatchType(type1, tar02)).toBe(false);
                expect(Type.isMatchType(type1, tar03)).toBe(false);
            });
            it('- Type.isMatchType() : union 중첩타입 function ', () => {
                var type1 = { aa: String=>Boolean }

                var tar01 = { aa: { $type: 'function', params: [String], return: Boolean } }
                var tar02 = { aa: { $type: 'function', params: [String] } }
                var tar03 = { aa: { $type: 'function', params: [] } }

                expect(Type.isMatchType(type1, tar01)).toBe(T);
                expect(Type.isMatchType(type1, tar02)).toBe(false);
                expect(Type.isMatchType(type1, tar03)).toBe(false);
            });
        });
        describe('function', () => {
            it('- Type.isMatchType() : function ', () => {
                var type1 = Function
                var type2 = ()=>{}
                var type3 = (String, Number)=>{Object}
                
                var tar01 = { $type: 'function' }
                var tar02 = { $type: 'function', params: [String, Number], return: [Object] }
                var tar03 = { $type: 'function', params: [String, Number], return: Object }
                var tar04 = { $type: 'function', params: [], return: [[Object]] }

                // type1
                expect(Type.isMatchType(type1,tar01)).toBe(T);
                expect(Type.isMatchType(type1,tar02)).toBe(T);
                expect(Type.isMatchType(type1,tar03)).toBe(T);
                expect(Type.isMatchType(type1,tar04)).toBe(T);
                // type2
                expect(Type.isMatchType(type2,tar01)).toBe(T);
                expect(Type.isMatchType(type2,tar02)).toBe(T);
                expect(Type.isMatchType(type2,tar03)).toBe(T);
                expect(Type.isMatchType(type2,tar04)).toBe(T);
                // type3
                expect(Type.isMatchType(type3,tar01)).toBe(false);
                expect(Type.isMatchType(type3,tar02)).toBe(false);
                expect(Type.isMatchType(type3,tar03)).toBe(T);
                expect(Type.isMatchType(type3,tar04)).toBe(false);
            });
            it('- Type.isMatchType() : function 스페셜값 name, func ', () => {
                function funcA(){}
                class funcB extends funcA {}    /** 함수 상속임 */ 
                function funcC(){}
                
                var type1 = { $type: 'function' }
                var type2 = { $type: 'function', name: 'funcA' }
                var type3 = { $type: 'function', func: funcA }

                var tar01 = { $type: 'function' };
                var tar02 = { $type: 'function', name: 'funcA' }
                var tar03 = { $type: 'function', func: funcA }
                var tar04 = { $type: 'function', func: funcB }
                var tar05 = { $type: 'function', func: funcC }

                // type1  
                expect(Type.isMatchType(type1,tar01)).toBe(T);
                expect(Type.isMatchType(type1,tar02)).toBe(T);
                expect(Type.isMatchType(type1,tar03)).toBe(T);
                expect(Type.isMatchType(type1,tar04)).toBe(T);
                expect(Type.isMatchType(type1,tar05)).toBe(T);
                // type2
                expect(Type.isMatchType(type2,tar01)).toBe(false);
                expect(Type.isMatchType(type2,tar02)).toBe(T);
                expect(Type.isMatchType(type2,tar03)).toBe(T); 
                expect(Type.isMatchType(type2,tar04)).toBe(false);
                expect(Type.isMatchType(type2,tar05)).toBe(false);
                // type3
                expect(Type.isMatchType(type3,tar01)).toBe(false);
                expect(Type.isMatchType(type3,tar02)).toBe(false);
                expect(Type.isMatchType(type3,tar03)).toBe(T);
                expect(Type.isMatchType(type3,tar04)).toBe(T);
                expect(Type.isMatchType(type3,tar05)).toBe(false);
            });

            it('- Type.isMatchType() : function params ', () => {
                var type1 = (String)=>{}
                var type2 = (Number)=>{}
                var type3 = (String, Number)=>{}

                var tar01 = { $type: 'function', params: [String] }
                var tar02 = { $type: 'function', params: [Number] }
                var tar03 = { $type: 'function', params: [String, Number] }
                var tar04 = { $type: 'function', params: ['str', 10] }
                var tar05 = { $type: 'function', params: [Boolean] }

                // type1 
                expect(Type.isMatchType(type1,tar01)).toBe(T);
                expect(Type.isMatchType(type1,tar02)).toBe(false);
                expect(Type.isMatchType(type1,tar03)).toBe(T);
                expect(Type.isMatchType(type1,tar04)).toBe(T);
                expect(Type.isMatchType(type1,tar05)).toBe(false);
                // type2
                expect(Type.isMatchType(type2,tar01)).toBe(false);
                expect(Type.isMatchType(type2,tar02)).toBe(T);
                expect(Type.isMatchType(type2,tar03)).toBe(false);
                expect(Type.isMatchType(type2,tar04)).toBe(false);
                expect(Type.isMatchType(type2,tar05)).toBe(false);
                // type3
                expect(Type.isMatchType(type3,tar01)).toBe(false);
                expect(Type.isMatchType(type3,tar02)).toBe(false);
                expect(Type.isMatchType(type3,tar03)).toBe(T);
                expect(Type.isMatchType(type3,tar04)).toBe(T);
                expect(Type.isMatchType(type3,tar05)).toBe(false);
            });
            it('- Type.isMatchType() : function params 리터럴 ', () => {
                var type1 = { $type: 'function', params: ['aa'] }
                var type2 = { $type: 'function', params: [10] } 
                var type3 = { $type: 'function', params: ['aa', 10] }

                var tar11 = { $type: 'function', params: [String] }
                var tar12 = { $type: 'function', params: ['aa'] }
                var tar13 = { $type: 'function', params: ['bb'] }
                 
                var tar21 = { $type: 'function', params: [Number] }
                var tar22 = { $type: 'function', params: [10] }
                var tar23 = { $type: 'function', params: [20] }
                 
                var tar31 = { $type: 'function', params: ['aa', 10] }
                var tar32 = { $type: 'function', params: ['aa', 10, true] }
                var tar33 = { $type: 'function', params: ['bb', 20] }

                // type1
                expect(Type.isMatchType(type1,tar11)).toBe(false);
                expect(Type.isMatchType(type1,tar12)).toBe(T);
                expect(Type.isMatchType(type1,tar13)).toBe(false);
                // type2
                expect(Type.isMatchType(type2,tar21)).toBe(false);
                expect(Type.isMatchType(type2,tar22)).toBe(T);
                expect(Type.isMatchType(type2,tar23)).toBe(false);
                // type3
                expect(Type.isMatchType(type3,tar31)).toBe(T);
                expect(Type.isMatchType(type3,tar32)).toBe(T);
                expect(Type.isMatchType(type3,tar33)).toBe(false);

            });
            it('- Type.isMatchType() : function return ', () => {
                var type1 = ()=> {}
                var type2 = ()=> {String}
                var type3 = ()=> {Number}

                var tar01 = { $type: 'function' }
                var tar02 = { $type: 'function', return: String }
                var tar03 = { $type: 'function', return: Number }
                var tar04 = { $type: 'function', return: 'str' }
                var tar05 = { $type: 'function', return: 10 }

                expect(Type.isMatchType(type1,tar01) ).toBe(T);
                expect(Type.isMatchType(type1,tar02) ).toBe(T);
                expect(Type.isMatchType(type1,tar03) ).toBe(T);
                expect(Type.isMatchType(type1,tar04) ).toBe(T);
                expect(Type.isMatchType(type1,tar05) ).toBe(T);

                expect(Type.isMatchType(type2,tar01) ).toBe(false);
                expect(Type.isMatchType(type2,tar02) ).toBe(T);
                expect(Type.isMatchType(type2,tar03) ).toBe(false);
                expect(Type.isMatchType(type2,tar04) ).toBe(T);
                expect(Type.isMatchType(type2,tar05) ).toBe(false);

                expect(Type.isMatchType(type3,tar01) ).toBe(false);
                expect(Type.isMatchType(type3,tar02) ).toBe(false);
                expect(Type.isMatchType(type3,tar03) ).toBe(T);
                expect(Type.isMatchType(type3,tar04) ).toBe(false);
                expect(Type.isMatchType(type3,tar05) ).toBe(T);
            });
            it('- Type.isMatchType() : function return 리터럴 ', () => {
                var type1 = { $type: 'function', return: 'aa' }
                var type2 = { $type: 'function', return: 10 }
                var type3 = { $type: 'function', return: ['aa', 10] }

                var tar11 = { $type: 'function', return: String }
                var tar12 = { $type: 'function', return: 'aa' }
                var tar13 = { $type: 'function', return: 'bb' }
                 
                var tar21 = { $type: 'function', return: Number }
                var tar22 = { $type: 'function', return: 10 }
                var tar23 = { $type: 'function', return: 20 }
             
                var tar31 = { $type: 'function', return: ['aa'] }
                var tar32 = { $type: 'function', return: ['aa', 10] }
                var tar33 = { $type: 'function', return: ['aa', 10, true] }
                var tar34 = { $type: 'function', return: ['bb', 20] }

                // type1
                expect(Type.isMatchType(type1,tar11)).toBe(false);
                expect(Type.isMatchType(type1,tar12)).toBe(T);
                expect(Type.isMatchType(type1,tar13)).toBe(false);
                // type2 
                expect(Type.isMatchType(type2,tar21)).toBe(false);
                expect(Type.isMatchType(type2,tar22)).toBe(T);
                expect(Type.isMatchType(type2,tar23)).toBe(false);
                // type3
                expect(Type.isMatchType(type3,tar31)).toBe(T);
                expect(Type.isMatchType(type3,tar32)).toBe(T);
                expect(Type.isMatchType(type3,tar33)).toBe(false);
                expect(Type.isMatchType(type3,tar34)).toBe(false);
            });
            it('- Type.isMatchType() : function 중첩타입 array params  ', () => {
                var type1 = { $type: 'function', params: [ [String] ] }
                var type2 = { $type: 'function', params: [ [String, Number] ] }

                var tar11 = { $type: 'function', params: [ [] ] }
                var tar12 = { $type: 'function', params: [ [String] ] }
                var tar13 = { $type: 'function', params: [ [String, Number] ] }

                var tar21 = { $type: 'function', params: [ [] ] }
                var tar22 = { $type: 'function', params: [ [String] ] }
                var tar23 = { $type: 'function', params: [ [String, Number] ] }
                var tar24 = { $type: 'function', params: [ [String, Number, Boolean] ] }

                // type1
                expect(Type.isMatchType(type1,tar11)).toBe(false);
                expect(Type.isMatchType(type1,tar12)).toBe(T);
                expect(Type.isMatchType(type1,tar13)).toBe(false);
                // type2 
                expect(Type.isMatchType(type2,tar21)).toBe(false);
                expect(Type.isMatchType(type2,tar22)).toBe(T);
                expect(Type.isMatchType(type2,tar23)).toBe(T);
                expect(Type.isMatchType(type2,tar24)).toBe(false);
            });
            it('- Type.isMatchType() : function 중첩타입 array return  ', () => {
                var type1 = { $type: 'function', return: [ String ] }
                var type2 = { $type: 'function', return: [ String, Number ] }

                var tar11 = { $type: 'function', return: [] }
                var tar12 = { $type: 'function', return: [String] }
                var tar13 = { $type: 'function', return: [String, Number] }

                var tar21 = { $type: 'function', return: [] }
                var tar22 = { $type: 'function', return: [String] }
                var tar23 = { $type: 'function', return: [String, Number] }
                var tar24 = { $type: 'function', return: [String, Number, Boolean] }

                // type1
                expect(Type.isMatchType(type1,tar11)).toBe(false);
                expect(Type.isMatchType(type1,tar12)).toBe(T);
                expect(Type.isMatchType(type1,tar13)).toBe(false);
                // type2 
                expect(Type.isMatchType(type2,tar21)).toBe(false);
                expect(Type.isMatchType(type2,tar22)).toBe(T);
                expect(Type.isMatchType(type2,tar23)).toBe(T);
                expect(Type.isMatchType(type2,tar24)).toBe(false);
            });
            it('- Type.isMatchType() : function 중첩타입 choice params  ', () => {
                var type1 = { $type: 'function', params: [ [[String]] ] }
                var type2 = { $type: 'function', params: [ [[String, Number]] ] }

                var tar11 = { $type: 'function', params: [ String ]}
                var tar12 = { $type: 'function', params: [ [[String]] ] }
                var tar13 = { $type: 'function', params: [ [[String, Number]] ] }

                var tar21 = { $type: 'function', params: [ String ] }
                var tar22 = { $type: 'function', params: [ Number ] }
                var tar23 = { $type: 'function', params: [ [[String]] ] }
                var tar24 = { $type: 'function', params: [ [[String, Number]] ] }
                var tar25 = { $type: 'function', params: [ [[String, Number, Boolean]] ] }

                // type1
                expect(Type.isMatchType(type1,tar11)).toBe(T);
                expect(Type.isMatchType(type1,tar12)).toBe(T);
                expect(Type.isMatchType(type1,tar13)).toBe(false);
                // type2 
                expect(Type.isMatchType(type2,tar21)).toBe(T);
                expect(Type.isMatchType(type2,tar22)).toBe(T);
                expect(Type.isMatchType(type2,tar23)).toBe(T);
                expect(Type.isMatchType(type2,tar24)).toBe(T);
                expect(Type.isMatchType(type2,tar25)).toBe(false);
            });
            it('- Type.isMatchType() : function 중첩타입 choice return  ', () => {
                var type1 = { $type: 'function', return: [[String]] }
                var type2 = { $type: 'function', return: [[String, Number]] }

                var tar11 = { $type: 'function', return: String }
                var tar12 = { $type: 'function', return: [[String]] }
                var tar13 = { $type: 'function', return: [[String, Number]] }

                var tar21 = { $type: 'function', return: String }
                var tar22 = { $type: 'function', return: Number }
                var tar23 = { $type: 'function', return: [[String]] }
                var tar24 = { $type: 'function', return: [[String, Number]] }
                var tar25 = { $type: 'function', return: [[String, Number, Boolean]] }

                // type1
                expect(Type.isMatchType(type1,tar11)).toBe(T);
                expect(Type.isMatchType(type1,tar12)).toBe(T);
                expect(Type.isMatchType(type1,tar13)).toBe(false);
                // type2 
                expect(Type.isMatchType(type2,tar21)).toBe(T);
                expect(Type.isMatchType(type2,tar22)).toBe(T);
                expect(Type.isMatchType(type2,tar23)).toBe(T);
                expect(Type.isMatchType(type2,tar24)).toBe(T);
                expect(Type.isMatchType(type2,tar25)).toBe(false);
            });
            it('- Type.isMatchType() : function 중첩타입 class params  ', () => {
                class ClassA { bb = String; }
                class ClassB extends ClassA { cc = Number; }
                class ClassC { bb = String; }

                var type1 = { $type: 'function', params: [ ClassA] }
                var type2 = { $type: 'function', params: [ ClassA, ClassB] }

                var tar11 = { $type: 'function', params: [ ClassA] }
                var tar12 = { $type: 'function', params: [ ClassB] }
                var tar13 = { $type: 'function', params: [ ClassA, ClassB] }
                var tar14 = { $type: 'function', params: [ ClassC] }

                var tar21 = { $type: 'function', params: [ ClassA] }
                var tar22 = { $type: 'function', params: [ ClassA, ClassB] }
                var tar23 = { $type: 'function', params: [ ClassB, ClassB] }
                var tar24 = { $type: 'function', params: [ ClassA, ClassB, ClassC] }
                var tar25 = { $type: 'function', params: [ ClassC, ClassB] }

                // type1
                expect(Type.isMatchType(type1,tar11)).toBe(T);
                expect(Type.isMatchType(type1,tar12)).toBe(T);
                expect(Type.isMatchType(type1,tar13)).toBe(T);
                expect(Type.isMatchType(type1,tar14)).toBe(false);
                // type2 
                expect(Type.isMatchType(type2,tar21)).toBe(false);
                expect(Type.isMatchType(type2,tar22)).toBe(T);
                expect(Type.isMatchType(type2,tar23)).toBe(T);
                expect(Type.isMatchType(type2,tar24)).toBe(T);
                expect(Type.isMatchType(type2,tar25)).toBe(false);
            });
            it('- Type.isMatchType() : function 중첩타입 class return  ', () => {
                class ClassA { bb = String;}
                class ClassB extends ClassA { cc = Number;}
                class ClassC { bb = String;}

                var type1 = { $type: 'function', return: ClassA }
                var type2 = { $type: 'function', return: ClassB }

                var tar01 = { $type: 'function', return: ClassA }
                var tar02 = { $type: 'function', return: ClassB }
                var tar03 = { $type: 'function', return: ClassC }

                // type1
                expect(Type.isMatchType(type1,tar01)).toBe(T);
                expect(Type.isMatchType(type1,tar02)).toBe(T);
                expect(Type.isMatchType(type1,tar03)).toBe(false);
                // type2 
                expect(Type.isMatchType(type2,tar01)).toBe(false);
                expect(Type.isMatchType(type2,tar02)).toBe(T);
                expect(Type.isMatchType(type2,tar03)).toBe(false);
            });
            it('- Type.isMatchType() : function 중첩타입 union params  ', () => {
                var type1 = { $type: 'function', params: [ {} ] }
                var type2 = { $type: 'function', params: [ {aa: String} ] }
                var type3 = { $type: 'function', params: [ {aa: String, bb: Number} ] }

                var tar01 = { $type: 'function', params: [ {} ] }
                var tar02 = { $type: 'function', params: [ {aa: String} ] }
                var tar03 = { $type: 'function', params: [ {aa: String, bb: Number} ] }
                var tar04 = { $type: 'function', params: [ {aa: Boolean} ]}

                // type1
                expect(Type.isMatchType(type1,tar01)).toBe(T);
                expect(Type.isMatchType(type1,tar02)).toBe(T);
                expect(Type.isMatchType(type1,tar03)).toBe(T);
                expect(Type.isMatchType(type1,tar04)).toBe(T);
                // type2 
                expect(Type.isMatchType(type2,tar01)).toBe(false);
                expect(Type.isMatchType(type2,tar02)).toBe(T);
                expect(Type.isMatchType(type2,tar03)).toBe(T);
                expect(Type.isMatchType(type2,tar04)).toBe(false);
                // type3
                expect(Type.isMatchType(type3,tar01)).toBe(false);
                expect(Type.isMatchType(type3,tar02)).toBe(false);
                expect(Type.isMatchType(type3,tar03)).toBe(T);
                expect(Type.isMatchType(type3,tar04)).toBe(false);
            });
            it('- Type.isMatchType() : function 중첩타입 union return  ', () => {
                var type1 = { $type: 'function', return: {} }
                var type2 = { $type: 'function', return: {aa: String} }
                var type3 = { $type: 'function', return: {aa: String, bb: Number} }

                var tar01 = { $type: 'function', return: {} }
                var tar02 = { $type: 'function', return: {aa: String} }
                var tar03 = { $type: 'function', return: {aa: String, bb: Number} }
                var tar04 = { $type: 'function', return: {aa: Boolean} }

                // type1
                expect(Type.isMatchType(type1,tar01) ).toBe(T);
                expect(Type.isMatchType(type1,tar02) ).toBe(T);
                expect(Type.isMatchType(type1,tar03) ).toBe(T);
                expect(Type.isMatchType(type1,tar04) ).toBe(T);
                // type2 
                expect(Type.isMatchType(type2,tar01) ).toBe(false);
                expect(Type.isMatchType(type2,tar02) ).toBe(T);
                expect(Type.isMatchType(type2,tar03) ).toBe(T);
                expect(Type.isMatchType(type2,tar04) ).toBe(false);
                // type3
                expect(Type.isMatchType(type3,tar01) ).toBe(false);
                expect(Type.isMatchType(type3,tar02) ).toBe(false);
                expect(Type.isMatchType(type3,tar03) ).toBe(T);
                expect(Type.isMatchType(type3,tar04) ).toBe(false);
            });
            it('- Type.isMatchType() : function 중첩타입 function params  ', () => {
                var type1 = { $type: 'function', params: [ ()=>{} ] }
                var type2 = { $type: 'function', params: [ (String)=>{} ] }
                var type3 = { $type: 'function', params: [ (String, Number)=>{} ] }

                var tar01 = { $type: 'function', params: [ ()=>{} ] }
                var tar02 = { $type: 'function', params: [ (String)=>{} ] }
                var tar03 = { $type: 'function', params: [ (String, Number)=>{} ] }

                // type1
                expect(Type.isMatchType(type1,tar01) ).toBe(T);
                expect(Type.isMatchType(type1,tar02) ).toBe(T);
                expect(Type.isMatchType(type1,tar03) ).toBe(T);
                // type2 
                expect(Type.isMatchType(type2,tar01) ).toBe(false);
                expect(Type.isMatchType(type2,tar02) ).toBe(T);
                expect(Type.isMatchType(type2,tar03) ).toBe(T);
                // type3
                expect(Type.isMatchType(type3,tar01) ).toBe(false);
                expect(Type.isMatchType(type3,tar02) ).toBe(false);
                expect(Type.isMatchType(type3,tar03) ).toBe(T);
            });
            it('- Type.isMatchType() : function 중첩타입 function return  ', () => {
                var type1 = { $type: 'function', return: ()=>{} }
                var type2 = { $type: 'function', return: (String)=>{} }
                var type3 = { $type: 'function', return: (String, Number)=>{} }

                var tar01 = { $type: 'function', return: ()=>{} }
                var tar02 = { $type: 'function', return: (String)=>{} }
                var tar03 = { $type: 'function', return: (String, Number)=>{} }

                // type1
                expect(Type.isMatchType(type1,tar01) ).toBe(T);
                expect(Type.isMatchType(type1,tar02) ).toBe(T);
                expect(Type.isMatchType(type1,tar03) ).toBe(T);
                // type2 
                expect(Type.isMatchType(type2,tar01) ).toBe(false);
                expect(Type.isMatchType(type2,tar02) ).toBe(T);
                expect(Type.isMatchType(type2,tar03) ).toBe(T);
                // type3
                expect(Type.isMatchType(type3,tar01) ).toBe(false);
                expect(Type.isMatchType(type3,tar02) ).toBe(false);
                expect(Type.isMatchType(type3,tar03) ).toBe(T);
            });
        });
    });
});

describe('type.matchType(type, target): bool  <타입 매치 예외> ', () => {
    // ES024
    it('- Object, {} : object 타입 (regex, new, null) ', () => {
        expect(()=> Type.matchType(Object, 'str'     )).toThrow('EL01102');
        expect(()=> Type.matchType(Object, 1         )).toThrow('EL01102');
        expect(()=> Type.matchType(Object, Symbol()  )).toThrow('EL01102');
        expect(()=> Type.matchType(Object, true      )).toThrow('EL01102');
        expect(()=> Type.matchType(Object, null      )).toThrow('EL01102');
    });
    // ES069
    it('- type.matchType() : object (원시 객체 기본값) ', () => {
        expect(()=> Type.matchType({},         Symbol()    )).toThrow('EL01141')
    });
    // ES026
    it('- null, undefined ', () => {
        expect(()=>Type.matchType(null,              false           )).toThrow('null');
        expect(()=>Type.matchType({aa: undefined},   {aa:null}       )).toThrow('undefined');
        expect(()=>Type.matchType(undefined,         {aa:null}       )).toThrow('EL01102');
    });
    // ES074
    it('- String, "str" : string 타입 ', () => { 
        expect(()=> Type.matchType('str',    function any(){}    )).toThrow('EL01102');
        expect(()=> Type.matchType(String,   function any(){}    )).toThrow('EL01102');  
        expect(()=> Type.matchType(String,   null                )).toThrow('EL01102');
        expect(()=> Type.matchType(String,   true                )).toThrow('EL01102');
        expect(()=> Type.matchType(String,   /reg/               )).toThrow('EL01102');
        expect(()=> Type.matchType(String,   1                   )).toThrow('EL01102');
        expect(()=> Type.matchType(String,   Symbol()            )).toThrow('EL01102');
        expect(()=> Type.matchType(String,   []                  )).toThrow('EL01102');
        expect(()=> Type.matchType(String,   {aa:1}              )).toThrow('EL01102');
        expect(()=> Type.matchType(String,   Number              )).toThrow('EL01102');
        expect(()=> Type.matchType(String,   Symbol              )).toThrow('EL01102');
    });
    it('- Number, 1,2, NaN : number 타입', () => {
        expect(()=> Type.matchType(1,        function any(){}    )).toThrow('EL01102');
        expect(()=> Type.matchType(NaN,      function any(){}    )).toThrow('EL01102');
        expect(()=> Type.matchType(Number,   function any(){}    )).toThrow('EL01102');
        expect(()=> Type.matchType(Number,   null                )).toThrow('EL01102');
        expect(()=> Type.matchType(Number,   true                )).toThrow('EL01102');
        expect(()=> Type.matchType(Number,   /reg/               )).toThrow('EL01102');
        expect(()=> Type.matchType(Number,   'str'               )).toThrow('EL01102');
        expect(()=> Type.matchType(Number,   Symbol()            )).toThrow('EL01102');
        expect(()=> Type.matchType(Number,   []                  )).toThrow('EL01102');
        expect(()=> Type.matchType(Number,   {aa:1}              )).toThrow('EL01102');
        expect(()=> Type.matchType(Number,   Symbol              )).toThrow('EL01102');
        expect(()=> Type.matchType(Number,                       )).toThrow('EL01102');
    });
    it('- Boolean, true, false : boolean 타입 ', () => {
        expect(()=> Type.matchType(true,     function any(){}    )).toThrow('EL01102');
        expect(()=> Type.matchType(Boolean,  function any(){}    )).toThrow('EL01102');
        expect(()=> Type.matchType(Boolean,  null                )).toThrow('EL01102');
        expect(()=> Type.matchType(Boolean,  'str'               )).toThrow('EL01102');
        expect(()=> Type.matchType(Boolean,  /reg/               )).toThrow('EL01102');
        expect(()=> Type.matchType(Boolean,  1                   )).toThrow('EL01102');
        expect(()=> Type.matchType(Boolean,  Symbol()            )).toThrow('EL01102');
        expect(()=> Type.matchType(Boolean,  []                  )).toThrow('EL01102');
        expect(()=> Type.matchType(Boolean,  {aa:1}              )).toThrow('EL01102');
        expect(()=> Type.matchType(Boolean,  Number              )).toThrow('EL01102');
        expect(()=> Type.matchType(Boolean,  Symbol              )).toThrow('EL01102');
    });
    it('- bigint 타입 (ES6+)', () => { 
        expect(()=> Type.matchType(BigInt,  function any(){}    )).toThrow('EL01102');
        expect(()=> Type.matchType(BigInt,  null                )).toThrow('EL01102');
        expect(()=> Type.matchType(BigInt,  'str'               )).toThrow('EL01102');
        expect(()=> Type.matchType(BigInt,  /reg/               )).toThrow('EL01102');
        expect(()=> Type.matchType(BigInt,  1                   )).toThrow('EL01102');
        expect(()=> Type.matchType(BigInt,  Symbol()            )).toThrow('EL01102');
        expect(()=> Type.matchType(BigInt,  []                  )).toThrow('EL01102');
        expect(()=> Type.matchType(BigInt,  {aa:1}              )).toThrow('EL01102');
        expect(()=> Type.matchType(BigInt,  Number              )).toThrow('EL01102');
    });
    it('- symbol 타입 (ES6+) ', () => {
        expect(()=> Type.matchType(Symbol,  function any(){}    )).toThrow('EL01102');
        expect(()=> Type.matchType(Symbol,  null                )).toThrow('EL01102');
        expect(()=> Type.matchType(Symbol,  'str'               )).toThrow('EL01102');
        expect(()=> Type.matchType(Symbol,  /reg/               )).toThrow('EL01102');
        expect(()=> Type.matchType(Symbol,  1                   )).toThrow('EL01102');
        expect(()=> Type.matchType(Symbol,  []                  )).toThrow('EL01102');
        expect(()=> Type.matchType(Symbol,  {aa:1}              )).toThrow('EL01102');
        expect(()=> Type.matchType(Symbol,  Number              )).toThrow('EL01102');
    })
    // ES07T
    it('- isMatchTypT() : choice ', () => {      
        expect(()=> Type.matchType([['_any_']],                 undefined   )).toThrow('EL01121')
        // expect(()=> Type.matchType([['_seq_']],                 [[1,2,3]]   )).toThrow(/ES0729/)
        // expect(()=> Type.matchType([['_seq_']],                 10          )).toThrow(/ES0729/)
        // expect(()=> Type.matchType([['_seq_', String, Number]], [[1,2,3]]   )).toThrow(/ES077/)
        // expect(()=> Type.matchType([['_seq_', String, Number]], 10          )).toThrow(/ES077/)
        expect(()=> Type.matchType([[ String, Number]], true       )).toThrow('EL01127')
        expect(()=> Type.matchType([[String, Number]], []          )).toThrow('EL01127')
        expect(()=> Type.matchType([[String, Number]], {}          )).toThrow('EL01127')            
        // expect(()=> Type.matchType([[String, Number]],  undefined           )).toThrow(/ES076/)
        expect(()=> Type.matchType([[String, Number]],  true                )).toThrow('EL01127')
        expect(()=> Type.matchType([[String, Number]],  [[]]                )).toThrow('EL01127')
        expect(()=> Type.matchType([[String, Number]],  {}                  )).toThrow('EL01127')
        expect(()=> Type.matchType([[String, Number]],  [[String, Boolean]] )).toThrow('EL01127') // 당연히 실패
        expect(()=> Type.matchType([[String, Number]],  [[Number, String]]  )).toThrow('EL01127')
        expect(()=> Type.matchType([[String, Number]],  [[Number, String, Boolean]] )).toThrow('EL01127')
    });
    it('- 복합 샘플 : 에러 문구 구성 ', () => {
        var type1 = { aa: { bb: [['_req_', ['_req_', [[String, [['str', 10]], {} ]] ], Boolean ]] } }
        /**
         * 1차 테스트
         *  union('aa')
         *      union('bb')
         *          choice(req)
         *              array(req)
         *                  choice(opt)
         *                      string('str')
         *                      choice(opt)
         *                          string('str')
         *                          number(10)
         *                      union
         *              boolean
         */
        var type2 = { aa: (String, [[RegExp, Number]])=>Boolean }
        class ClassA{
            bb = String
            cc = [[ Boolean, 10 ]]
        }
        var type3 = { aa: ClassA }
        var type4 = { aa: [String, {aa: String}] }

        var tar11 = { aa: { bb: 'aa' } }
        var tar12 = { aa: { bb: [20] } }
        var tar13 = { aa: { bb: [] } }
        var tar14 = { aa: 'str' }
        var tar15 = 10

        var tar21 = { aa: (String, [[RegExp, Number, Boolean]])=>Boolean}
        var tar22 = { aa: (String, [[RegExp]])=>String}
        var tar23 = { aa: ([String], [[RegExp]])=>String}
        var tar24 = { aa: ()=>[String]}
        
        var tar31 = { aa: { bb: 'str', cc: 20 } }

        var tar41 = { aa: [true] }

        expect(()=> Type.matchType(type1, tar11)).toThrow('EL01127')
        expect(()=> Type.matchType(type1, tar12)).toThrow('EL01127')
        expect(()=> Type.matchType(type1, tar13)).toThrow('EL01127')
        expect(()=> Type.matchType(type1, tar14)).toThrow('EL01141')
        expect(()=> Type.matchType(type1, tar15)).toThrow('EL0114')

        expect(()=> Type.matchType(type2, tar21)).toThrow('EL0122F')
        expect(()=> Type.matchType(type2, tar22)).toThrow('EL01157')

        expect(()=> Type.matchType(type3, tar31)).toThrow('EL01132')
        expect(()=> Type.matchType(type3, tar31, 1)).toThrow('EL01127')

        expect(()=> Type.matchType(type4, tar41)).toThrow('EL01118') 
    });

    it('- type.matchType() : class ', () => {
        var Class1 = function() { this.aa = String }
        var Class2 = function() { this.bb = Number }

        expect(()=> Type.matchType(Class2,             {aa: 'STR'}           , 1)).toThrow('EL01102')
        expect(()=> Type.matchType(Class2,             {aa: 'STR', bb: 'STR'}, 1)).toThrow('EL01102')
        expect(()=> Type.matchType([[Class1, Class2]], {cc: 'STR'}           , 1)).toThrow('EL01127')
        expect(()=> Type.matchType(Class1,             {cc: 'STR'}           , 1)).toThrow('EL01102')
        expect(()=> Type.matchType(Class2,             {cc: 'STR'}           , 1)).toThrow('EL01102')            
    });
    it('- type.matchType() : object (객체 기본값) ', () => {
        var Class1 = function() { this.aa = String };
        var Class2 = function() { this.bb = 10 };

        expect(()=> Type.matchType(Class1,         {bb: 5}               , 1)).toThrow('EL01102')
        expect(()=> Type.matchType(Class1,         {cc: 'STR'}           , 1)).toThrow('EL01102')
        expect(()=> Type.matchType(Class2,         {aa: 'STR', bb: 'STR'}, 1)).toThrow('EL01102')
    });
    
    it('- type.matchType() : choice 원시 타입 ', () => {
        expect(()=> Type.matchType([[Number, String, Boolean]], new Date()  )).toThrow('EL01127')
        expect(()=> Type.matchType([[Number, String, Boolean]], /reg/       )).toThrow('EL01127')
        expect(()=> Type.matchType([[Number, String, Boolean]], Symbol()    )).toThrow('EL01127')
        expect(()=> Type.matchType([[Number, String, Boolean]], []          )).toThrow('EL01127')
        expect(()=> Type.matchType([[Number, String, Boolean]], {}          )).toThrow('EL01127')
    });
    it('- type.matchType() : choice 내장 객체 타입 ', () => {
        expect(()=> Type.matchType([[RegExp, Date, Symbol]], 1          )).toThrow('EL01127')
        expect(()=> Type.matchType([[RegExp, Date, Symbol]], true       )).toThrow('EL01127')
        expect(()=> Type.matchType([[RegExp, Date, Symbol]], 'str'      )).toThrow('EL01127')       
        expect(()=> Type.matchType([[RegExp, Date, Symbol]], []         )).toThrow('EL01127')       
        expect(()=> Type.matchType([[RegExp, Date, Symbol]], {}         )).toThrow('EL01127')       
    });
    it('- type.matchType() : array 조건 검사  ', () => {    
        expect(()=> Type.matchType([],           10                  )).toThrow('EL01111')
        expect(()=> Type.matchType(Array,        10                  )).toThrow('EL01111')
        // expect(()=> Type.matchType(['_any_'],    [undefined]         )).toThrow(/ES075/)
        expect(()=> Type.matchType(['_any_'],    10                  )).toThrow('EL01111')
        expect(()=> Type.matchType(['_seq_'],    10                  )).toThrow('EL01101') 
        expect(()=> Type.matchType(['_seq_', String, Number], [10, 'str'])).toThrow('EL01102')
        expect(()=> Type.matchType(['_seq_', String, Number], ['str']    )).toThrow('EL01113')
        expect(()=> Type.matchType(['_seq_', String, Number], 10         )).toThrow('EL01111')
        expect(()=> Type.matchType(['_opt_'],    10                  )).toThrow('EL01101')
        expect(()=> Type.matchType(['_opt_', String, Number], [true] )).toThrow('EL01118')
        expect(()=> Type.matchType(['_opt_', String, Number], [{}]   )).toThrow('EL01118')
        expect(()=> Type.matchType(['_opt_', String, Number], 10     )).toThrow('EL01111')
        // expect(()=> Type.matchType(['_req_', String, Number], []              )).toThrow(/ES022/)
        expect(()=> Type.matchType(['_req_', String, Number], [true]          )).toThrow('EL01118')
        expect(()=> Type.matchType(['_req_', String, Number], [{}]            )).toThrow('EL01118')
        expect(()=> Type.matchType(['_req_', String, Number], 10              )).toThrow('EL01111')
        expect(()=> Type.matchType(Array, function any(){}       )).toThrow('EL01111');
        expect(()=> Type.matchType(Array, function any(){}, []   )).toThrow('EL01111');
        expect(()=> Type.matchType(Array, null                   )).toThrow('EL01111');
        expect(()=> Type.matchType(Array, 'str'                  )).toThrow('EL01111');
        expect(()=> Type.matchType(Array, /reg/                  )).toThrow('EL01111');
        expect(()=> Type.matchType(Array, 1                      )).toThrow('EL01111');
        expect(()=> Type.matchType(Array, Symbol()               )).toThrow('EL01111');
        expect(()=> Type.matchType(Array, true                   )).toThrow('EL01111');
        expect(()=> Type.matchType(Array, {aa:1}                 )).toThrow('EL01111');
        expect(()=> Type.matchType(Array, Number                 )).toThrow('EL01111');
        expect(()=> Type.matchType(Array, Symbol                 )).toThrow('EL01111');
    });
    it('- choice : or 타입 (내장 타입) ', () => {
        expect(()=> Type.matchType([[Array, String]],          1               )).toThrow('EL01127');
        expect(()=> Type.matchType([[Array]],                  function any(){})).toThrow('EL01127');
        expect(()=> Type.matchType([[String]],                 function any(){})).toThrow('EL01127');
        expect(()=> Type.matchType([[String, Number]],         null            )).toThrow('EL01127');
        expect(()=> Type.matchType([[Array, Number, Boolean]], 'str'           )).toThrow('EL01127');
    });
    it('- function() : class 타입', () => {
        const Func1 = function() { this.aa = Number };
        const Func2 = function() { this.aa = 1 };   // 기본값으로 설정
        const Func3 = function() { this.aa = Date };

        expect(()=> Type.matchType(Func1, function any(){}   )).toThrow('EL01133');
        expect(()=> Type.matchType(Func1, null               )).toThrow('EL01132');
        expect(()=> Type.matchType(Func1, 'str'              )).toThrow('EL01133');
        expect(()=> Type.matchType(Func1, /reg/              )).toThrow('EL01132');
        expect(()=> Type.matchType(Func1, 1                  )).toThrow('EL01133');
        expect(()=> Type.matchType(Func1, Symbol()           )).toThrow('EL01133');
        expect(()=> Type.matchType(Func1, true               )).toThrow('EL01133');
        expect(()=> Type.matchType(Func1, Number             )).toThrow('EL01133');
        expect(()=> Type.matchType(Func1, Symbol             )).toThrow('EL01133');
    });
    it('- Symbol() : symbol 타입', () => {
        expect(()=> Type.matchType(Symbol, function any(){}  )).toThrow('EL01102');
        expect(()=> Type.matchType(Symbol, function any(){}  )).toThrow('EL01102');
        expect(()=> Type.matchType(Symbol, null              )).toThrow('EL01102');
        expect(()=> Type.matchType(Symbol, 'str'             )).toThrow('EL01102');
        expect(()=> Type.matchType(Symbol, /reg/             )).toThrow('EL01102');
        expect(()=> Type.matchType(Symbol, 1                 )).toThrow('EL01102');
        expect(()=> Type.matchType(Symbol, true              )).toThrow('EL01102');
        expect(()=> Type.matchType(Symbol, []                )).toThrow('EL01102');
        expect(()=> Type.matchType(Symbol, {aa:1}            )).toThrow('EL01102');
        expect(()=> Type.matchType(Symbol, Number            )).toThrow('EL01102');
        expect(()=> Type.matchType(Symbol, Symbol            )).toThrow('EL01102');
    });
    it('- Date : object 타입 (class) ', () => {    
        expect(()=> Type.matchType(Date, function any(){}    )).toThrow('EL01133');
        expect(()=> Type.matchType(Date, null                )).toThrow('EL01132');
        expect(()=> Type.matchType(Date, true                )).toThrow('EL01133');
        expect(()=> Type.matchType(Date, 1                   )).toThrow('EL01133');
        expect(()=> Type.matchType(Date, 'str'               )).toThrow('EL01133');
        expect(()=> Type.matchType(Date, []                  )).toThrow('EL01132');
        expect(()=> Type.matchType(Date, {aa:1}              )).toThrow('EL01132');
        expect(()=> Type.matchType(Date, Number              )).toThrow('EL01133');
        expect(()=> Type.matchType(Date, /reg/               )).toThrow('EL01132');
        expect(()=> Type.matchType(Date, Symbol()            )).toThrow('EL01133');
        expect(()=> Type.matchType(Date, Symbol              )).toThrow('EL01133');
    });
});