//==============================================================
// gobal defined

import { jest } from '@jest/globals';
import { Type } from '../../src/type';

const T = true;
const F = false;
//==============================================================
// test
describe('Type.isAllowType(type, target): bool  <타입 매치 여부> ', () => {
    describe('단일타입(Leaf) ', () => {
        it('- Type.isAllowType() : undefined ', () => {
            var type1 = undefined
            var type2 = { aa: undefined }
            
            // type1
            expect(Type.isAllowType(type1)                   ).toBe(T);
            expect(Type.isAllowType(type1, undefined)        ).toBe(T);
            expect(Type.isAllowType(type1, null)             ).toBe(F); 
            // type2
            expect(Type.isAllowType(type2, {aa: undefined})  ).toBe(T);
            expect(Type.isAllowType(type2, {aa: String})     ).toBe(F);
            expect(Type.isAllowType(type2, {})               ).toBe(F); // REVIEW: 검토 필요 {} 는 union 전체를 의미
        });
        it('- Type.isAllowType() : null ', () => {
            var type1 = null;
            
            expect(Type.isAllowType(type1, null)     ).toBe(T);
            expect(Type.isAllowType(type1, undefined)).toBe(F); 
        });
        it('- Type.isAllowType() : string ', () => {
            var type1 = String
            var type2 = [['_req_', String]]
            var type3 = [['_opt_', String]]
            var type4 = [['_opt_', String, Number]]

            var tar01 = String
            var tar02 = [['_req_', String]]
            var tar03 = [['_opt_', String]]
            var tar04 = [['_opt_', String, Number]]
            var tar05 = undefined
            var tar06 = Number
             
            // type1
            expect(Type.isAllowType(type1, tar01)).toBe(T);
            expect(Type.isAllowType(type1, tar02)).toBe(T);
            expect(Type.isAllowType(type1, tar03)).toBe(F);
            expect(Type.isAllowType(type1, tar04)).toBe(F);
            expect(Type.isAllowType(type1, tar05)).toBe(F);
            expect(Type.isAllowType(type1, tar06)).toBe(F);
            // type2 == type1
            expect(Type.isAllowType(type2, tar01)).toBe(T);
            expect(Type.isAllowType(type2, tar02)).toBe(T);
            expect(Type.isAllowType(type2, tar03)).toBe(F);
            expect(Type.isAllowType(type2, tar04)).toBe(F);
            expect(Type.isAllowType(type2, tar05)).toBe(F);
            expect(Type.isAllowType(type2, tar06)).toBe(F);
            // type3
            expect(Type.isAllowType(type3, tar01)).toBe(T);
            expect(Type.isAllowType(type3, tar02)).toBe(T);
            expect(Type.isAllowType(type3, tar03)).toBe(T);
            expect(Type.isAllowType(type3, tar04)).toBe(F);
            expect(Type.isAllowType(type3, tar05)).toBe(T);
            expect(Type.isAllowType(type3, tar06)).toBe(F);
            // type4
            expect(Type.isAllowType(type4, tar01)).toBe(T);
            expect(Type.isAllowType(type4, tar02)).toBe(T);
            expect(Type.isAllowType(type4, tar03)).toBe(T);
            expect(Type.isAllowType(type4, tar04)).toBe(T);
            expect(Type.isAllowType(type4, tar05)).toBe(T);
            expect(Type.isAllowType(type4, tar06)).toBe(T);
        });
        it('- Type.isAllowType() : string  리터럴 ', () => {
            var type1 = 'aa'
            var type2 = [['_req_', 'aa']]
            var type3 = [['_opt_', 'aa']]
            var type4 = [['_opt_', 'aa', 10]]

            var tar01 = 'aa'
            var tar02 = [['_req_', 'aa']]
            var tar03 = [['_opt_', 'aa']]
            var tar04 = [['_opt_', 'aa', 10]]
            var tar05 = undefined
            var tar06 = 10
             
            // type1
            expect(Type.isAllowType(type1, tar01)).toBe(T);
            expect(Type.isAllowType(type1, tar02)).toBe(T);
            expect(Type.isAllowType(type1, tar03)).toBe(F);
            expect(Type.isAllowType(type1, tar04)).toBe(F);
            expect(Type.isAllowType(type1, tar05)).toBe(F);
            expect(Type.isAllowType(type1, tar06)).toBe(F);
            // type2
            expect(Type.isAllowType(type2, tar01)).toBe(T);
            expect(Type.isAllowType(type2, tar02)).toBe(T);
            expect(Type.isAllowType(type2, tar03)).toBe(F);
            expect(Type.isAllowType(type2, tar04)).toBe(F);
            expect(Type.isAllowType(type2, tar05)).toBe(F);
            expect(Type.isAllowType(type2, tar06)).toBe(F);
            // type3
            expect(Type.isAllowType(type3, tar01)).toBe(T);
            expect(Type.isAllowType(type3, tar02)).toBe(T);
            expect(Type.isAllowType(type3, tar03)).toBe(T);
            expect(Type.isAllowType(type3, tar04)).toBe(F);
            expect(Type.isAllowType(type3, tar05)).toBe(T);
            expect(Type.isAllowType(type3, tar06)).toBe(F);
            // type4
            expect(Type.isAllowType(type4, tar01)).toBe(T);
            expect(Type.isAllowType(type4, tar02)).toBe(T);
            expect(Type.isAllowType(type4, tar03)).toBe(T);
            expect(Type.isAllowType(type4, tar04)).toBe(T);
            expect(Type.isAllowType(type4, tar05)).toBe(T);
            expect(Type.isAllowType(type4, tar06)).toBe(T);
        });
        it('- Type.isAllowType() : number ', () => {
            var type1 = Number
            var type2 = [['_req_', Number]]
            var type3 = [['_opt_', Number]]
            var type4 = [['_opt_', Number, String]]

            var tar01 = Number
            var tar02 = [['_req_', Number]]
            var tar03 = [['_opt_', Number]]
            var tar04 = [['_opt_', Number, String]]
            var tar05 = undefined
            var tar06 = String
             
            // type1
            expect(Type.isAllowType(type1, tar01)).toBe(T);
            expect(Type.isAllowType(type1, tar02)).toBe(T);
            expect(Type.isAllowType(type1, tar03)).toBe(F);
            expect(Type.isAllowType(type1, tar04)).toBe(F);
            expect(Type.isAllowType(type1, tar05)).toBe(F);
            expect(Type.isAllowType(type1, tar06)).toBe(F);
            // type2
            expect(Type.isAllowType(type2, tar01)).toBe(T);
            expect(Type.isAllowType(type2, tar02)).toBe(T);
            expect(Type.isAllowType(type2, tar03)).toBe(F);
            expect(Type.isAllowType(type2, tar04)).toBe(F);
            expect(Type.isAllowType(type2, tar05)).toBe(F);
            expect(Type.isAllowType(type2, tar06)).toBe(F);
            // type3
            expect(Type.isAllowType(type3, tar01)).toBe(T);
            expect(Type.isAllowType(type3, tar02)).toBe(T);
            expect(Type.isAllowType(type3, tar03)).toBe(T);
            expect(Type.isAllowType(type3, tar04)).toBe(F);
            expect(Type.isAllowType(type3, tar05)).toBe(T);
            expect(Type.isAllowType(type3, tar06)).toBe(F);
            // type4
            expect(Type.isAllowType(type4, tar01)).toBe(T);
            expect(Type.isAllowType(type4, tar02)).toBe(T);
            expect(Type.isAllowType(type4, tar03)).toBe(T);
            expect(Type.isAllowType(type4, tar04)).toBe(T);
            expect(Type.isAllowType(type4, tar05)).toBe(T);
            expect(Type.isAllowType(type4, tar06)).toBe(T);
        });
        it('- Type.isAllowType() : number  리터럴 ', () => {
            var type1 = 10
            var type2 = [['_req_', 10]]
            var type3 = [['_opt_', 10]]
            var type4 = [['_opt_', 10, 20]]

            var tar01 = 10
            var tar02 = [['_req_', 10]]
            var tar03 = [['_opt_', 10]]
            var tar04 = [['_opt_', 10, 20]]
            var tar05 = undefined
            var tar06 = 20
             
            // type1
            expect(Type.isAllowType(type1, tar01)).toBe(T);
            expect(Type.isAllowType(type1, tar02)).toBe(T);
            expect(Type.isAllowType(type1, tar03)).toBe(F);
            expect(Type.isAllowType(type1, tar04)).toBe(F);
            expect(Type.isAllowType(type1, tar05)).toBe(F);
            expect(Type.isAllowType(type1, tar06)).toBe(F);
            // type2
            expect(Type.isAllowType(type2, tar01)).toBe(T);
            expect(Type.isAllowType(type2, tar02)).toBe(T);
            expect(Type.isAllowType(type2, tar03)).toBe(F);
            expect(Type.isAllowType(type2, tar04)).toBe(F);
            expect(Type.isAllowType(type2, tar05)).toBe(F);
            expect(Type.isAllowType(type2, tar06)).toBe(F);
            // type3
            expect(Type.isAllowType(type3, tar01)).toBe(T);
            expect(Type.isAllowType(type3, tar02)).toBe(T);
            expect(Type.isAllowType(type3, tar03)).toBe(T);
            expect(Type.isAllowType(type3, tar04)).toBe(F);
            expect(Type.isAllowType(type3, tar05)).toBe(T);
            expect(Type.isAllowType(type3, tar06)).toBe(F);
            // type4
            expect(Type.isAllowType(type4, tar01)).toBe(T);
            expect(Type.isAllowType(type4, tar02)).toBe(T);
            expect(Type.isAllowType(type4, tar03)).toBe(T);
            expect(Type.isAllowType(type4, tar04)).toBe(T);
            expect(Type.isAllowType(type4, tar05)).toBe(T);
            expect(Type.isAllowType(type4, tar06)).toBe(T);
        });
        it('- Type.isAllowType() : boolean ', () => {
            var type1 = Boolean
            var type2 = [['_req_', Boolean]]
            var type3 = [['_opt_', Boolean]]
            var type4 = [['_opt_', Boolean, String]]

            var tar01 = Boolean
            var tar02 = [['_req_', Boolean]]
            var tar03 = [['_opt_', Boolean]]
            var tar04 = [['_opt_', Boolean, String]]
            var tar05 = undefined
            var tar06 = 'aa'
             
            // type1
            expect(Type.isAllowType(type1, tar01)).toBe(T);
            expect(Type.isAllowType(type1, tar02)).toBe(T);
            expect(Type.isAllowType(type1, tar03)).toBe(F);
            expect(Type.isAllowType(type1, tar04)).toBe(F);
            expect(Type.isAllowType(type1, tar05)).toBe(F);
            expect(Type.isAllowType(type1, tar06)).toBe(F);
            // type2
            expect(Type.isAllowType(type2, tar01)).toBe(T);
            expect(Type.isAllowType(type2, tar02)).toBe(T);
            expect(Type.isAllowType(type2, tar03)).toBe(F);
            expect(Type.isAllowType(type2, tar04)).toBe(F);
            expect(Type.isAllowType(type2, tar05)).toBe(F);
            expect(Type.isAllowType(type2, tar06)).toBe(F);
            // type3
            expect(Type.isAllowType(type3, tar01)).toBe(T);
            expect(Type.isAllowType(type3, tar02)).toBe(T);
            expect(Type.isAllowType(type3, tar03)).toBe(T);
            expect(Type.isAllowType(type3, tar04)).toBe(F);
            expect(Type.isAllowType(type3, tar05)).toBe(T);
            expect(Type.isAllowType(type3, tar06)).toBe(F);
            // type4
            expect(Type.isAllowType(type4, tar01)).toBe(T);
            expect(Type.isAllowType(type4, tar02)).toBe(T);
            expect(Type.isAllowType(type4, tar03)).toBe(T);
            expect(Type.isAllowType(type4, tar04)).toBe(T);
            expect(Type.isAllowType(type4, tar05)).toBe(T);
            expect(Type.isAllowType(type4, tar06)).toBe(T);
        });
        it('- Type.isAllowType() : boolean  리터럴 ', () => {
            var type1 = true
            var type2 = [['_req_', true]]
            var type3 = [['_opt_', true]]
            var type4 = [['_opt_', true, F]]

            var tar01 = true
            var tar02 = [['_req_', true]]
            var tar03 = [['_opt_', true]]
            var tar04 = [['_opt_', true, F]]
            var tar05 = undefined
            var tar06 = F
             
            // type1
            expect(Type.isAllowType(type1, tar01)).toBe(T);
            expect(Type.isAllowType(type1, tar02)).toBe(T);
            expect(Type.isAllowType(type1, tar03)).toBe(F);
            expect(Type.isAllowType(type1, tar04)).toBe(F);
            expect(Type.isAllowType(type1, tar05)).toBe(F);
            expect(Type.isAllowType(type1, tar06)).toBe(F);
            // type2
            expect(Type.isAllowType(type2, tar01)).toBe(T);
            expect(Type.isAllowType(type2, tar02)).toBe(T);
            expect(Type.isAllowType(type2, tar03)).toBe(F);
            expect(Type.isAllowType(type2, tar04)).toBe(F);
            expect(Type.isAllowType(type2, tar05)).toBe(F);
            expect(Type.isAllowType(type2, tar06)).toBe(F);
            // type3
            expect(Type.isAllowType(type3, tar01)).toBe(T);
            expect(Type.isAllowType(type3, tar02)).toBe(T);
            expect(Type.isAllowType(type3, tar03)).toBe(T);
            expect(Type.isAllowType(type3, tar04)).toBe(F);
            expect(Type.isAllowType(type3, tar05)).toBe(T);
            expect(Type.isAllowType(type3, tar06)).toBe(F);
            // type4
            expect(Type.isAllowType(type4, tar01)).toBe(T);
            expect(Type.isAllowType(type4, tar02)).toBe(T);
            expect(Type.isAllowType(type4, tar03)).toBe(T);
            expect(Type.isAllowType(type4, tar04)).toBe(T);
            expect(Type.isAllowType(type4, tar05)).toBe(T);
            expect(Type.isAllowType(type4, tar06)).toBe(T);
        });
        it('- Type.isAllowType() : regexp ', () => {
            var type1 = RegExp
            var type2 = [['_req_', RegExp]]
            var type3 = [['_opt_', RegExp]]
            var type4 = [['_opt_', RegExp, String]]

            var tar01 = RegExp
            var tar02 = [['_req_', RegExp]]
            var tar03 = [['_opt_', RegExp]]
            var tar04 = [['_opt_', RegExp, String]]
            var tar05 = undefined
            var tar06 = 'aa'
             
            // type1
            expect(Type.isAllowType(type1, tar01)).toBe(T);
            expect(Type.isAllowType(type1, tar02)).toBe(T);
            expect(Type.isAllowType(type1, tar03)).toBe(F);
            expect(Type.isAllowType(type1, tar04)).toBe(F);
            expect(Type.isAllowType(type1, tar05)).toBe(F);
            expect(Type.isAllowType(type1, tar06)).toBe(F);
            // type2
            expect(Type.isAllowType(type2, tar01)).toBe(T);
            expect(Type.isAllowType(type2, tar02)).toBe(T);
            expect(Type.isAllowType(type2, tar03)).toBe(F);
            expect(Type.isAllowType(type2, tar04)).toBe(F);
            expect(Type.isAllowType(type2, tar05)).toBe(F);
            expect(Type.isAllowType(type2, tar06)).toBe(F);
            // type3
            expect(Type.isAllowType(type3, tar01)).toBe(T);
            expect(Type.isAllowType(type3, tar02)).toBe(T);
            expect(Type.isAllowType(type3, tar03)).toBe(T);
            expect(Type.isAllowType(type3, tar04)).toBe(F);
            expect(Type.isAllowType(type3, tar05)).toBe(T);
            expect(Type.isAllowType(type3, tar06)).toBe(F);
            // type4
            expect(Type.isAllowType(type4, tar01)).toBe(T);
            expect(Type.isAllowType(type4, tar02)).toBe(T);
            expect(Type.isAllowType(type4, tar03)).toBe(T);
            expect(Type.isAllowType(type4, tar04)).toBe(T);
            expect(Type.isAllowType(type4, tar05)).toBe(T);
            expect(Type.isAllowType(type4, tar06)).toBe(T);
        });
        it('- Type.isAllowType() : regexp  리터럴 ', () => {
            var type1 = /aa/
            var type2 = [['_req_', /aa/]]
            var type3 = [['_opt_', /aa/]]
            var type4 = [['_opt_', /aa/, /bb/]]

            var tar01 = /aa/
            var tar02 = [['_req_', /aa/]]
            var tar03 = [['_opt_', /aa/]]
            var tar04 = [['_opt_', /aa/, /bb/]]
            var tar05 = undefined
            var tar06 = /bb/
             
            // type1
            expect(Type.isAllowType(type1, tar01)).toBe(T);
            expect(Type.isAllowType(type1, tar02)).toBe(T);
            expect(Type.isAllowType(type1, tar03)).toBe(F);
            expect(Type.isAllowType(type1, tar04)).toBe(F);
            expect(Type.isAllowType(type1, tar05)).toBe(F);
            expect(Type.isAllowType(type1, tar06)).toBe(F);
            // type2
            expect(Type.isAllowType(type2, tar01)).toBe(T);
            expect(Type.isAllowType(type2, tar02)).toBe(T);
            expect(Type.isAllowType(type2, tar03)).toBe(F);
            expect(Type.isAllowType(type2, tar04)).toBe(F);
            expect(Type.isAllowType(type2, tar05)).toBe(F);
            expect(Type.isAllowType(type2, tar06)).toBe(F);
            // type3
            expect(Type.isAllowType(type3, tar01)).toBe(T);
            expect(Type.isAllowType(type3, tar02)).toBe(T);
            expect(Type.isAllowType(type3, tar03)).toBe(T);
            expect(Type.isAllowType(type3, tar04)).toBe(F);
            expect(Type.isAllowType(type3, tar05)).toBe(T);
            expect(Type.isAllowType(type3, tar06)).toBe(F);
            // type4
            expect(Type.isAllowType(type4, tar01)).toBe(T);
            expect(Type.isAllowType(type4, tar02)).toBe(T);
            expect(Type.isAllowType(type4, tar03)).toBe(T);
            expect(Type.isAllowType(type4, tar04)).toBe(T);
            expect(Type.isAllowType(type4, tar05)).toBe(T);
            expect(Type.isAllowType(type4, tar06)).toBe(T);
        });
        it('- Type.isAllowType() : bigint (ES6+) ', () => {
            var type1 = BigInt
            var type2 = [['_req_', BigInt]]
            var type3 = [['_opt_', BigInt]]
            var type4 = [['_opt_', BigInt, String]]

            var tar01 = BigInt
            var tar02 = [['_req_', BigInt]]
            var tar03 = [['_opt_', BigInt]]
            var tar04 = [['_opt_', BigInt, String]]
            var tar05 = undefined
            var tar06 = 'aa'
             
            // type1
            expect(Type.isAllowType(type1, tar01)).toBe(T);
            expect(Type.isAllowType(type1, tar02)).toBe(T);
            expect(Type.isAllowType(type1, tar03)).toBe(F);
            expect(Type.isAllowType(type1, tar04)).toBe(F);
            expect(Type.isAllowType(type1, tar05)).toBe(F);
            expect(Type.isAllowType(type1, tar06)).toBe(F);
            // type2
            expect(Type.isAllowType(type2, tar01)).toBe(T);
            expect(Type.isAllowType(type2, tar02)).toBe(T);
            expect(Type.isAllowType(type2, tar03)).toBe(F);
            expect(Type.isAllowType(type2, tar04)).toBe(F);
            expect(Type.isAllowType(type2, tar05)).toBe(F);
            expect(Type.isAllowType(type2, tar06)).toBe(F);
            // type3
            expect(Type.isAllowType(type3, tar01)).toBe(T);
            expect(Type.isAllowType(type3, tar02)).toBe(T);
            expect(Type.isAllowType(type3, tar03)).toBe(T);
            expect(Type.isAllowType(type3, tar04)).toBe(F);
            expect(Type.isAllowType(type3, tar05)).toBe(T);
            expect(Type.isAllowType(type3, tar06)).toBe(F);
            // type4
            expect(Type.isAllowType(type4, tar01)).toBe(T);
            expect(Type.isAllowType(type4, tar02)).toBe(T);
            expect(Type.isAllowType(type4, tar03)).toBe(T);
            expect(Type.isAllowType(type4, tar04)).toBe(T);
            expect(Type.isAllowType(type4, tar05)).toBe(T);
            expect(Type.isAllowType(type4, tar06)).toBe(T);
        });
        it('- Type.isAllowType() : bigint  리터럴 (ES6+) ', () => {
            var type1 = 10n
            var type2 = [['_req_', 10n]]
            var type3 = [['_opt_', 10n]]
            var type4 = [['_opt_', 10n, 20n]]

            var tar01 = 10n
            var tar02 = [['_req_', 10n]]
            var tar03 = [['_opt_', 10n]]
            var tar04 = [['_opt_', 10n, 20n]]
            var tar05 = undefined
            var tar06 = 20n
             
            // type1
            expect(Type.isAllowType(type1, tar01)).toBe(T);
            expect(Type.isAllowType(type1, tar02)).toBe(T);
            expect(Type.isAllowType(type1, tar03)).toBe(F);
            expect(Type.isAllowType(type1, tar04)).toBe(F);
            expect(Type.isAllowType(type1, tar05)).toBe(F);
            expect(Type.isAllowType(type1, tar06)).toBe(F);
            // type2
            expect(Type.isAllowType(type2, tar01)).toBe(T);
            expect(Type.isAllowType(type2, tar02)).toBe(T);
            expect(Type.isAllowType(type2, tar03)).toBe(F);
            expect(Type.isAllowType(type2, tar04)).toBe(F);
            expect(Type.isAllowType(type2, tar05)).toBe(F);
            expect(Type.isAllowType(type2, tar06)).toBe(F);
            // type3
            expect(Type.isAllowType(type3, tar01)).toBe(T);
            expect(Type.isAllowType(type3, tar02)).toBe(T);
            expect(Type.isAllowType(type3, tar03)).toBe(T);
            expect(Type.isAllowType(type3, tar04)).toBe(F);
            expect(Type.isAllowType(type3, tar05)).toBe(T);
            expect(Type.isAllowType(type3, tar06)).toBe(F);
            // type4
            expect(Type.isAllowType(type4, tar01)).toBe(T);
            expect(Type.isAllowType(type4, tar02)).toBe(T);
            expect(Type.isAllowType(type4, tar03)).toBe(T);
            expect(Type.isAllowType(type4, tar04)).toBe(T);
            expect(Type.isAllowType(type4, tar05)).toBe(T);
            expect(Type.isAllowType(type4, tar06)).toBe(T);
        });

        it('- Type.isAllowType() : symbol (ES6+) ', () => {
            var type1 = Symbol
            var type2 = [['_req_', Symbol]]
            var type3 = [['_opt_', Symbol]]
            var type4 = [['_opt_', Symbol, String]]
            var type5 = Symbol()

            var tar01 = Symbol
            var tar02 = [['_req_', Symbol]]
            var tar03 = [['_opt_', Symbol]]
            var tar04 = [['_opt_', Symbol, String]]
            var tar05 = Symbol()
            var tar06 = undefined
            var tar07 = 'aa'

            // type1
            expect(Type.isAllowType(type1, tar01)).toBe(T);
            expect(Type.isAllowType(type1, tar02)).toBe(T);
            expect(Type.isAllowType(type1, tar03)).toBe(F);
            expect(Type.isAllowType(type1, tar04)).toBe(F);
            expect(Type.isAllowType(type1, tar05)).toBe(T);
            expect(Type.isAllowType(type1, tar06)).toBe(F);
            expect(Type.isAllowType(type1, tar07)).toBe(F);
            // type2
            expect(Type.isAllowType(type2, tar01)).toBe(T);
            expect(Type.isAllowType(type2, tar02)).toBe(T);
            expect(Type.isAllowType(type2, tar03)).toBe(F);
            expect(Type.isAllowType(type2, tar04)).toBe(F);
            expect(Type.isAllowType(type2, tar05)).toBe(T);
            expect(Type.isAllowType(type2, tar06)).toBe(F);
            expect(Type.isAllowType(type2, tar07)).toBe(F);
            // type3
            expect(Type.isAllowType(type3, tar01)).toBe(T);
            expect(Type.isAllowType(type3, tar02)).toBe(T);
            expect(Type.isAllowType(type3, tar03)).toBe(T);
            expect(Type.isAllowType(type3, tar04)).toBe(F);
            expect(Type.isAllowType(type3, tar05)).toBe(T);
            expect(Type.isAllowType(type3, tar06)).toBe(T);
            expect(Type.isAllowType(type3, tar07)).toBe(F);
            // type4
            expect(Type.isAllowType(type4, tar01)).toBe(T);
            expect(Type.isAllowType(type4, tar02)).toBe(T);
            expect(Type.isAllowType(type4, tar03)).toBe(T);
            expect(Type.isAllowType(type4, tar04)).toBe(T);
            expect(Type.isAllowType(type4, tar05)).toBe(T);
            expect(Type.isAllowType(type4, tar06)).toBe(T);
            expect(Type.isAllowType(type4, tar07)).toBe(T);
            // type5  ** type1 과 같음 **
            expect(Type.isAllowType(type5, tar01)).toBe(T);  // ** REVIEW: 검토 필요
            expect(Type.isAllowType(type5, tar02)).toBe(T);
            expect(Type.isAllowType(type5, tar03)).toBe(F);
            expect(Type.isAllowType(type5, tar04)).toBe(F);
            expect(Type.isAllowType(type5, tar05)).toBe(T);
            expect(Type.isAllowType(type5, tar06)).toBe(F);
            expect(Type.isAllowType(type5, tar07)).toBe(F);
        });
        it('- Type.isAllowType() : object ', () => {
            var type1 = Object
            var type2 = [['_req_', Object]]
            var type3 = [['_opt_', Object]]
            var type4 = [['_opt_', Object, String]]
            var type5 = new Date()

            var tar01 = Object
            var tar02 = [['_req_', Object]]
            var tar03 = [['_opt_', Object]]
            var tar04 = [['_opt_', Object, String]]
            var tar05 = new Date()
            var tar06 = undefined
            var tar07 = 'aa'

            // type1
            expect(Type.isAllowType(type1, tar01)).toBe(T);
            expect(Type.isAllowType(type1, tar02)).toBe(T);
            expect(Type.isAllowType(type1, tar03)).toBe(F);
            expect(Type.isAllowType(type1, tar04)).toBe(F);
            expect(Type.isAllowType(type1, tar05)).toBe(T);
            expect(Type.isAllowType(type1, tar06)).toBe(F);
            expect(Type.isAllowType(type1, tar07)).toBe(F);
            // type2
            expect(Type.isAllowType(type2, tar01)).toBe(T);
            expect(Type.isAllowType(type2, tar02)).toBe(T);
            expect(Type.isAllowType(type2, tar03)).toBe(F);
            expect(Type.isAllowType(type2, tar04)).toBe(F);
            expect(Type.isAllowType(type2, tar05)).toBe(T);
            expect(Type.isAllowType(type2, tar06)).toBe(F);
            expect(Type.isAllowType(type2, tar07)).toBe(F);
            // type3
            expect(Type.isAllowType(type3, tar01)).toBe(T);
            expect(Type.isAllowType(type3, tar02)).toBe(T);
            expect(Type.isAllowType(type3, tar03)).toBe(T);
            expect(Type.isAllowType(type3, tar04)).toBe(F);
            expect(Type.isAllowType(type3, tar05)).toBe(T);
            expect(Type.isAllowType(type3, tar06)).toBe(T);
            expect(Type.isAllowType(type3, tar07)).toBe(F);
            // type4
            expect(Type.isAllowType(type4, tar01)).toBe(T);
            expect(Type.isAllowType(type4, tar02)).toBe(T);
            expect(Type.isAllowType(type4, tar03)).toBe(T);
            expect(Type.isAllowType(type4, tar04)).toBe(T);
            expect(Type.isAllowType(type4, tar05)).toBe(T);
            expect(Type.isAllowType(type4, tar06)).toBe(T);
            expect(Type.isAllowType(type4, tar07)).toBe(T);
            // type5  ** type1 과 같음 **
            expect(Type.isAllowType(type5, tar01)).toBe(T);
            expect(Type.isAllowType(type5, tar02)).toBe(T);
            expect(Type.isAllowType(type5, tar03)).toBe(F);
            expect(Type.isAllowType(type5, tar04)).toBe(F);
            expect(Type.isAllowType(type5, tar05)).toBe(T);        // REVIEW: 검토 필요
            expect(Type.isAllowType(type5, tar06)).toBe(F);
            expect(Type.isAllowType(type5, tar07)).toBe(F);
        });
    });
    describe('복합타입 ', () => {
        describe('array ', () => {
            it('- Type.isAllowType() : array 단일타입 ', () => {
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
                expect(Type.isAllowType(type1, [])               ).toBe(F);     // ** any 의미가 아님 **
                expect(Type.isAllowType(type1, [''])             ).toBe(T);
                expect(Type.isAllowType(type1, [String])         ).toBe(T); 
                expect(Type.isAllowType(type1, [10])             ).toBe(F);
                expect(Type.isAllowType(type1, ['', 10])         ).toBe(F);
                // type2
                expect(Type.isAllowType(type2, [])               ).toBe(F);
                expect(Type.isAllowType(type2, [10])             ).toBe(T);
                expect(Type.isAllowType(type2, [Number])         ).toBe(T);
                expect(Type.isAllowType(type2, [''])             ).toBe(F);
                expect(Type.isAllowType(type2, ['', 10])         ).toBe(F);
                // type3
                expect(Type.isAllowType(type3, [])               ).toBe(F);
                expect(Type.isAllowType(type3, [true])           ).toBe(T);
                expect(Type.isAllowType(type3, [Boolean])        ).toBe(T);
                expect(Type.isAllowType(type3, [''])             ).toBe(F);
                expect(Type.isAllowType(type3, ['', true])       ).toBe(F);
                // type4
                expect(Type.isAllowType(type4, [])               ).toBe(F);
                expect(Type.isAllowType(type4, [10n])            ).toBe(T);
                expect(Type.isAllowType(type4, [BigInt])         ).toBe(T);
                expect(Type.isAllowType(type4, [''])             ).toBe(F);
                expect(Type.isAllowType(type4, ['', 10n])        ).toBe(F);
                // type5
                expect(Type.isAllowType(type5, [])               ).toBe(F);
                expect(Type.isAllowType(type5, [/reg/])          ).toBe(T);
                expect(Type.isAllowType(type5, [RegExp])         ).toBe(T);
                expect(Type.isAllowType(type5, [''])             ).toBe(F);
                expect(Type.isAllowType(type5, ['', /reg/])      ).toBe(F);
                // type6
                expect(Type.isAllowType(type6, [])               ).toBe(F);
                expect(Type.isAllowType(type6, [null])           ).toBe(T);
                expect(Type.isAllowType(type6, [''])             ).toBe(F);
                expect(Type.isAllowType(type6, ['', null])       ).toBe(F); 
                // type7
                expect(Type.isAllowType(type7, [])               ).toBe(F);
                expect(Type.isAllowType(type7, [undefined])      ).toBe(T);
                expect(Type.isAllowType(type7, [''])             ).toBe(F);
                expect(Type.isAllowType(type7, ['', undefined])  ).toBe(F);
                // type8
                expect(Type.isAllowType(type8, [])               ).toBe(F);
                expect(Type.isAllowType(type8, [Symbol()])       ).toBe(T);
                expect(Type.isAllowType(type8, [Symbol])         ).toBe(T);
                expect(Type.isAllowType(type8, [''])             ).toBe(F);
                expect(Type.isAllowType(type8, ['', Symbol()])   ).toBe(F);
                // type9
                expect(Type.isAllowType(type9, [])               ).toBe(F);
                expect(Type.isAllowType(type9, [Object])         ).toBe(T);
                expect(Type.isAllowType(type9, [new Date()])     ).toBe(T);
                expect(Type.isAllowType(type9, [''])             ).toBe(F);
                expect(Type.isAllowType(type9, ['', new Date()]) ).toBe(F);
            });
            it('- Type.isAllowType() : array 다중타입 ', () => {
                var type1 = [String, Number, Boolean]
                var type2 = [BigInt, RegExp, Symbol, Object]
                var type3 = [null, undefined]

                var tar01 = []
                var tar02 = [String]
                var tar03 = [Number]
                var tar04 = [Boolean]
                var tar05 = [String, Number, Boolean]

                var tar06 = [BigInt]
                var tar07 = [RegExp]
                var tar08 = [Symbol]
                var tar09 = [Object]
                var tar10 = [BigInt, RegExp, Symbol, Object]
                
                var tar11 = [null]
                var tar12 = [undefined]
                var tar13 = [null, undefined]

                // string, number, boolean
                expect(Type.isAllowType(type1, tar01)).toBe(F);  // ** 요소가 있는 곳에 any 가 들어 갈 수 없음 **
                expect(Type.isAllowType(type1, tar02)).toBe(T);
                expect(Type.isAllowType(type1, tar03)).toBe(T);
                expect(Type.isAllowType(type1, tar04)).toBe(T);
                expect(Type.isAllowType(type1, tar05)).toBe(T);
                expect(Type.isAllowType(type1, tar06)).toBe(F);
                expect(Type.isAllowType(type1, tar07)).toBe(F);
                expect(Type.isAllowType(type1, tar08)).toBe(F);
                expect(Type.isAllowType(type1, tar09)).toBe(F);
                expect(Type.isAllowType(type1, tar10)).toBe(F);
                expect(Type.isAllowType(type1, tar11)).toBe(F);
                expect(Type.isAllowType(type1, tar12)).toBe(F);
                expect(Type.isAllowType(type1, tar13)).toBe(F);
                // bigint, regexp, symbol, object
                expect(Type.isAllowType(type2, tar01)).toBe(F);
                expect(Type.isAllowType(type2, tar02)).toBe(F);
                expect(Type.isAllowType(type2, tar03)).toBe(F);
                expect(Type.isAllowType(type2, tar04)).toBe(F);
                expect(Type.isAllowType(type2, tar05)).toBe(F);
                expect(Type.isAllowType(type2, tar06)).toBe(T);
                expect(Type.isAllowType(type2, tar07)).toBe(T);
                expect(Type.isAllowType(type2, tar08)).toBe(T);
                expect(Type.isAllowType(type2, tar09)).toBe(T);
                expect(Type.isAllowType(type2, tar10)).toBe(T);
                expect(Type.isAllowType(type2, tar11)).toBe(F);
                expect(Type.isAllowType(type2, tar12)).toBe(F);
                expect(Type.isAllowType(type2, tar13)).toBe(F);
                // null, undefined
                expect(Type.isAllowType(type3, tar01)).toBe(F);
                expect(Type.isAllowType(type3, tar02)).toBe(F);
                expect(Type.isAllowType(type3, tar03)).toBe(F);
                expect(Type.isAllowType(type3, tar04)).toBe(F);
                expect(Type.isAllowType(type3, tar05)).toBe(F);
                expect(Type.isAllowType(type3, tar06)).toBe(F);
                expect(Type.isAllowType(type3, tar07)).toBe(F);
                expect(Type.isAllowType(type3, tar08)).toBe(F);
                expect(Type.isAllowType(type3, tar09)).toBe(F);
                expect(Type.isAllowType(type3, tar10)).toBe(F);
                expect(Type.isAllowType(type3, tar11)).toBe(T);
                expect(Type.isAllowType(type3, tar12)).toBe(T);
                expect(Type.isAllowType(type3, tar13)).toBe(T);
            });
            it('- Type.isAllowType() : array _opt_ vs req, opt, seq ', () => {
                var type1 = [String]           // === ['_opt_', String]   
                var type2 = [String, Number]

                var tar01 = ['_req_']
                var tar02 = ['_req_', String]
                var tar03 = ['_req_', Number]
                var tar04 = ['_req_', String, Number]
                var tar05 = ['_req_', String, Number, Boolean]
                
                var tar11 = []
                var tar12 = [String]
                var tar13 = [Number]
                var tar14 = [String, Number]
                var tar15 = [String, Number, Boolean]

                var tar21 = ['_seq_']
                var tar22 = ['_seq_', String]
                var tar23 = ['_seq_', Number]
                var tar24 = ['_seq_', String, Number]
                var tar25 = ['_seq_', String, Number, Boolean]

                var tar31 = ['_all_']
                var tar32 = ['_any_']
                var tar33 = ['_non_']   // 배열에서 사용 안함

                // all, any, non
                expect(Type.isAllowType(type1, tar31)).toBe(F);
                expect(Type.isAllowType(type1, tar32)).toBe(F);
                expect(Type.isAllowType(type1, tar33)).toBe(F);
                // type1 _req_
                expect(Type.isAllowType(type1, tar01)).toBe(F);
                expect(Type.isAllowType(type1, tar02)).toBe(T);
                expect(Type.isAllowType(type1, tar03)).toBe(F);
                expect(Type.isAllowType(type1, tar04)).toBe(F);
                expect(Type.isAllowType(type1, tar05)).toBe(F);
                // type1 _opt_
                expect(Type.isAllowType(type1, tar11)).toBe(F);
                expect(Type.isAllowType(type1, tar12)).toBe(T);
                expect(Type.isAllowType(type1, tar13)).toBe(F);
                expect(Type.isAllowType(type1, tar14)).toBe(F);
                expect(Type.isAllowType(type1, tar15)).toBe(F);
                // type1 _seq_
                expect(Type.isAllowType(type1, tar21)).toBe(F);
                expect(Type.isAllowType(type1, tar22)).toBe(T);
                expect(Type.isAllowType(type1, tar23)).toBe(F);
                expect(Type.isAllowType(type1, tar23)).toBe(F);
                expect(Type.isAllowType(type1, tar24)).toBe(F);
                // type2 _req_
                expect(Type.isAllowType(type2, tar01)).toBe(F);
                expect(Type.isAllowType(type2, tar02)).toBe(T);
                expect(Type.isAllowType(type2, tar03)).toBe(T);
                expect(Type.isAllowType(type2, tar04)).toBe(T);
                expect(Type.isAllowType(type2, tar05)).toBe(F);
                // type2 _opt_ 
                expect(Type.isAllowType(type2, tar11)).toBe(F);
                expect(Type.isAllowType(type2, tar12)).toBe(T);
                expect(Type.isAllowType(type2, tar13)).toBe(T);
                expect(Type.isAllowType(type2, tar14)).toBe(T);
                expect(Type.isAllowType(type2, tar15)).toBe(F);
                // type2 _seq_
                expect(Type.isAllowType(type2, tar21)).toBe(F);
                expect(Type.isAllowType(type2, tar22)).toBe(T);
                expect(Type.isAllowType(type2, tar23)).toBe(T);
                expect(Type.isAllowType(type2, tar24)).toBe(T);
                expect(Type.isAllowType(type2, tar25)).toBe(F);
            });
            it('- Type.isAllowType() : array _opt_ 리터럴 vs req, opt, seq', () => {
                var type1 = ['aa', 'bb']
                var type2 = [10, true, /reg/, 10n]

                var tar01 = ['_req_']
                var tar02 = ['_req_', 'aa']
                var tar03 = ['_req_', 'aa', 'bb']
                var tar04 = ['_req_', 10, true, /reg/, 10n]
                var tar05 = ['_req_', 20]
                var tar06 = ['_req_', /reg2/]
                var tar07 = ['_req_', F]
                var tar08 = ['_req_', 20n]

                var tar11 = []
                var tar12 = ['aa']
                var tar13 = ['aa', 'bb']
                var tar14 = [10, true, /reg/, 10n]
                var tar15 = [20]
                var tar16 = [/reg2/]
                var tar17 = [F]
                var tar18 = [20n]

                var tar21 = ['_seq_']
                var tar22 = ['_seq_', 'aa']
                var tar23 = ['_seq_', 'aa', 'bb']
                var tar24 = ['_seq_', 10, true, /reg/, 10n]
                var tar25 = ['_seq_', 20]
                var tar26 = ['_seq_', /reg2/]
                var tar27 = ['_seq_', F]
                var tar28 = ['_seq_', 20n]

                // type1 _req_
                expect(Type.isAllowType(type1, tar01)).toBe(F);
                expect(Type.isAllowType(type1, tar02)).toBe(T);
                expect(Type.isAllowType(type1, tar03)).toBe(T);
                expect(Type.isAllowType(type1, tar04)).toBe(F);
                expect(Type.isAllowType(type1, tar05)).toBe(F);
                expect(Type.isAllowType(type1, tar06)).toBe(F);
                expect(Type.isAllowType(type1, tar07)).toBe(F);
                expect(Type.isAllowType(type1, tar08)).toBe(F);
                // type1 _opt_
                expect(Type.isAllowType(type1, tar11)).toBe(F);
                expect(Type.isAllowType(type1, tar12)).toBe(T);
                expect(Type.isAllowType(type1, tar13)).toBe(T);
                expect(Type.isAllowType(type1, tar14)).toBe(F);
                expect(Type.isAllowType(type1, tar15)).toBe(F);
                expect(Type.isAllowType(type1, tar16)).toBe(F);
                expect(Type.isAllowType(type1, tar17)).toBe(F);
                expect(Type.isAllowType(type1, tar18)).toBe(F);
                // type1 _seq_
                expect(Type.isAllowType(type1, tar21)).toBe(F);
                expect(Type.isAllowType(type1, tar22)).toBe(T);
                expect(Type.isAllowType(type1, tar23)).toBe(T);
                expect(Type.isAllowType(type1, tar24)).toBe(F);
                expect(Type.isAllowType(type1, tar25)).toBe(F);
                expect(Type.isAllowType(type1, tar26)).toBe(F);
                expect(Type.isAllowType(type1, tar27)).toBe(F);
                expect(Type.isAllowType(type1, tar28)).toBe(F);
                // type2 _req_
                expect(Type.isAllowType(type2, tar01)).toBe(F);
                expect(Type.isAllowType(type2, tar02)).toBe(F);
                expect(Type.isAllowType(type2, tar03)).toBe(F);
                expect(Type.isAllowType(type2, tar04)).toBe(T);
                expect(Type.isAllowType(type2, tar05)).toBe(F);
                expect(Type.isAllowType(type2, tar06)).toBe(F);
                expect(Type.isAllowType(type2, tar07)).toBe(F);
                expect(Type.isAllowType(type2, tar08)).toBe(F);
                // type2 _opt_ 
                expect(Type.isAllowType(type2, tar11)).toBe(F);
                expect(Type.isAllowType(type2, tar12)).toBe(F);
                expect(Type.isAllowType(type2, tar13)).toBe(F);
                expect(Type.isAllowType(type2, tar14)).toBe(T);
                expect(Type.isAllowType(type2, tar15)).toBe(F);
                expect(Type.isAllowType(type2, tar16)).toBe(F);
                expect(Type.isAllowType(type2, tar17)).toBe(F);
                expect(Type.isAllowType(type2, tar18)).toBe(F);
                // type2 _seq_
                expect(Type.isAllowType(type2, tar21)).toBe(F);
                expect(Type.isAllowType(type2, tar22)).toBe(F);
                expect(Type.isAllowType(type2, tar23)).toBe(F);
                expect(Type.isAllowType(type2, tar24)).toBe(T);
                expect(Type.isAllowType(type2, tar25)).toBe(F);
                expect(Type.isAllowType(type2, tar26)).toBe(F);
                expect(Type.isAllowType(type2, tar27)).toBe(F);
                expect(Type.isAllowType(type2, tar28)).toBe(F);

            });
            it('- Type.isAllowType() : array _req_ vs req, opt, seq ', () => {
                var type1 = ['_req_', String]
                var type2 = ['_req_', String, Number]

                var tar01 = ['_req_']
                var tar02 = ['_req_', String]
                var tar03 = ['_req_', Number]
                var tar04 = ['_req_', String, Number]
                var tar05 = ['_req_', String, Number, Boolean]
                
                var tar11 = []
                var tar12 = [String]
                var tar13 = [Number]
                var tar14 = [String, Number]
                var tar15 = [String, Number, Boolean]

                var tar21 = ['_seq_']
                var tar22 = ['_seq_', String]
                var tar23 = ['_seq_', Number]
                var tar24 = ['_seq_', String, Number]
                var tar25 = ['_seq_', String, Number, Boolean]

                var tar31 = ['_all_']
                var tar32 = ['_any_']
                var tar33 = ['_non_']   // 배열에서 사용 안함

                // all, any, non
                expect(Type.isAllowType(type1, tar31)).toBe(F);
                expect(Type.isAllowType(type1, tar32)).toBe(F);
                expect(Type.isAllowType(type1, tar33)).toBe(F);

                // type1 _req_
                expect(Type.isAllowType(type1, tar01)).toBe(F);
                expect(Type.isAllowType(type1, tar02)).toBe(T);
                expect(Type.isAllowType(type1, tar03)).toBe(F);
                expect(Type.isAllowType(type1, tar04)).toBe(F);
                expect(Type.isAllowType(type1, tar05)).toBe(F);
                // type1 _opt_ ** 모두 실패 **
                expect(Type.isAllowType(type1, tar11)).toBe(F);
                expect(Type.isAllowType(type1, tar12)).toBe(F);
                expect(Type.isAllowType(type1, tar13)).toBe(F);
                expect(Type.isAllowType(type1, tar14)).toBe(F);
                expect(Type.isAllowType(type1, tar15)).toBe(F);
                // type1 _seq_
                expect(Type.isAllowType(type1, tar21)).toBe(F);
                expect(Type.isAllowType(type1, tar22)).toBe(T);
                expect(Type.isAllowType(type1, tar23)).toBe(F);
                expect(Type.isAllowType(type1, tar24)).toBe(F);
                expect(Type.isAllowType(type1, tar25)).toBe(F);
                // type2 _req_
                expect(Type.isAllowType(type2, tar01)).toBe(F);
                expect(Type.isAllowType(type2, tar02)).toBe(T);
                expect(Type.isAllowType(type2, tar03)).toBe(T);
                expect(Type.isAllowType(type2, tar04)).toBe(T);
                expect(Type.isAllowType(type2, tar05)).toBe(F);
                // type2 _opt_ ** 모두 실패 **
                expect(Type.isAllowType(type2, tar11)).toBe(F);
                expect(Type.isAllowType(type2, tar12)).toBe(F);
                expect(Type.isAllowType(type2, tar13)).toBe(F);
                expect(Type.isAllowType(type2, tar14)).toBe(F);
                expect(Type.isAllowType(type2, tar15)).toBe(F);
                // type2 _seq_
                expect(Type.isAllowType(type2, tar21)).toBe(F);
                expect(Type.isAllowType(type2, tar22)).toBe(T);
                expect(Type.isAllowType(type2, tar23)).toBe(T);
                expect(Type.isAllowType(type2, tar24)).toBe(T);
                expect(Type.isAllowType(type2, tar25)).toBe(F);
            });
            it('- Type.isAllowType() : array _req_ 리터럴 vs req, opt, seq ', () => {
                var type1 = ['_req_', 'aa', 'bb']
                var type2 = ['_req_', 10, true, /reg/, 10n]

                var tar01 = ['_req_']
                var tar02 = ['_req_', 'aa']
                var tar03 = ['_req_', 'aa', 'bb']
                var tar04 = ['_req_', 10, true, /reg/, 10n]
                var tar05 = ['_req_', 20]
                var tar06 = ['_req_', /reg2/]
                var tar07 = ['_req_', F]
                var tar08 = ['_req_', 20n]

                var tar11 = []
                var tar12 = ['aa']
                var tar13 = ['aa', 'bb']
                var tar14 = [10, true, /reg/, 10n]
                var tar15 = [20]
                var tar16 = [/reg2/]
                var tar17 = [F]
                var tar18 = [20n]

                var tar21 = ['_seq_']
                var tar22 = ['_seq_', 'aa']
                var tar23 = ['_seq_', 'aa', 'bb']
                var tar24 = ['_seq_', 10, true, /reg/, 10n]
                var tar25 = ['_seq_', 20]
                var tar26 = ['_seq_', /reg2/]
                var tar27 = ['_seq_', F]
                var tar28 = ['_seq_', 20n]

                // type1 _req_
                expect(Type.isAllowType(type1, tar01)).toBe(F);
                expect(Type.isAllowType(type1, tar02)).toBe(T);
                expect(Type.isAllowType(type1, tar03)).toBe(T);
                expect(Type.isAllowType(type1, tar04)).toBe(F);
                expect(Type.isAllowType(type1, tar05)).toBe(F);
                expect(Type.isAllowType(type1, tar06)).toBe(F);
                expect(Type.isAllowType(type1, tar07)).toBe(F);
                expect(Type.isAllowType(type1, tar08)).toBe(F);
                // type1 _opt_  ** 모두 실패 **
                expect(Type.isAllowType(type1, tar11)).toBe(F);
                expect(Type.isAllowType(type1, tar12)).toBe(F);
                expect(Type.isAllowType(type1, tar13)).toBe(F);
                expect(Type.isAllowType(type1, tar14)).toBe(F);
                expect(Type.isAllowType(type1, tar15)).toBe(F);
                expect(Type.isAllowType(type1, tar16)).toBe(F);
                expect(Type.isAllowType(type1, tar17)).toBe(F);
                expect(Type.isAllowType(type1, tar18)).toBe(F);
                // type1 _seq_
                expect(Type.isAllowType(type1, tar21)).toBe(F);
                expect(Type.isAllowType(type1, tar22)).toBe(T);
                expect(Type.isAllowType(type1, tar23)).toBe(T);
                expect(Type.isAllowType(type1, tar24)).toBe(F);
                expect(Type.isAllowType(type1, tar25)).toBe(F);
                expect(Type.isAllowType(type1, tar26)).toBe(F);
                expect(Type.isAllowType(type1, tar27)).toBe(F);
                expect(Type.isAllowType(type1, tar28)).toBe(F);
                // type2 _req_
                expect(Type.isAllowType(type2, tar01)).toBe(F);
                expect(Type.isAllowType(type2, tar02)).toBe(F);
                expect(Type.isAllowType(type2, tar03)).toBe(F);
                expect(Type.isAllowType(type2, tar04)).toBe(T);
                expect(Type.isAllowType(type2, tar05)).toBe(F);
                expect(Type.isAllowType(type2, tar06)).toBe(F);
                expect(Type.isAllowType(type2, tar07)).toBe(F);
                expect(Type.isAllowType(type2, tar08)).toBe(F);
                // type2 _opt_ ** 모두 실패 **
                expect(Type.isAllowType(type2, tar11)).toBe(F);
                expect(Type.isAllowType(type2, tar12)).toBe(F);
                expect(Type.isAllowType(type2, tar13)).toBe(F);
                expect(Type.isAllowType(type2, tar14)).toBe(F);
                expect(Type.isAllowType(type2, tar15)).toBe(F);
                expect(Type.isAllowType(type2, tar16)).toBe(F);
                expect(Type.isAllowType(type2, tar17)).toBe(F);
                expect(Type.isAllowType(type2, tar18)).toBe(F);
                // type2 _seq_
                expect(Type.isAllowType(type2, tar21)).toBe(F);
                expect(Type.isAllowType(type2, tar22)).toBe(F);
                expect(Type.isAllowType(type2, tar23)).toBe(F);
                expect(Type.isAllowType(type2, tar24)).toBe(T);
                expect(Type.isAllowType(type2, tar25)).toBe(F);
                expect(Type.isAllowType(type2, tar26)).toBe(F);
                expect(Type.isAllowType(type2, tar27)).toBe(F);
                expect(Type.isAllowType(type2, tar28)).toBe(F);
            });
            it('- Type.isAllowType() : array _seq_ vs req, opt, seq ', () => {
                var type1 = ['_seq_', String]
                var type2 = ['_seq_', String, Number]

                var tar01 = ['_req_']
                var tar02 = ['_req_', String]
                var tar03 = ['_req_', Number]
                var tar04 = ['_req_', String, Number]
                var tar05 = ['_req_', String, Number, Boolean]
                
                var tar11 = []
                var tar12 = [String]
                var tar13 = [Number]
                var tar14 = [String, Number]
                var tar15 = [String, Number, Boolean]

                var tar21 = ['_seq_']
                var tar22 = ['_seq_', String]
                var tar23 = ['_seq_', Number]
                var tar24 = ['_seq_', String, Number]
                var tar25 = ['_seq_', String, Number, Boolean]

                var tar31 = ['_all_']
                var tar32 = ['_any_']
                var tar33 = ['_non_']   // 배열에서 사용 안함

                // all, any, non
                expect(Type.isAllowType(type1, tar31)).toBe(F);
                expect(Type.isAllowType(type1, tar32)).toBe(F);
                expect(Type.isAllowType(type1, tar33)).toBe(F);
                // type1 _req_ ** 모두 실패 **
                expect(Type.isAllowType(type1, tar01)).toBe(F);
                expect(Type.isAllowType(type1, tar02)).toBe(F);
                expect(Type.isAllowType(type1, tar03)).toBe(F);
                expect(Type.isAllowType(type1, tar04)).toBe(F);
                expect(Type.isAllowType(type1, tar05)).toBe(F);
                // type1 _opt_ ** 모두 실패 **
                expect(Type.isAllowType(type1, tar11)).toBe(F);
                expect(Type.isAllowType(type1, tar12)).toBe(F);
                expect(Type.isAllowType(type1, tar13)).toBe(F);
                expect(Type.isAllowType(type1, tar14)).toBe(F);
                expect(Type.isAllowType(type1, tar15)).toBe(F);
                // type1 _seq_
                expect(Type.isAllowType(type1, tar21)).toBe(F);
                expect(Type.isAllowType(type1, tar22)).toBe(T);
                expect(Type.isAllowType(type1, tar23)).toBe(F);
                expect(Type.isAllowType(type1, tar24)).toBe(T);
                expect(Type.isAllowType(type1, tar25)).toBe(T);
                // type2 _req_ ** 모두 실패 **
                expect(Type.isAllowType(type2, tar01)).toBe(F);
                expect(Type.isAllowType(type2, tar02)).toBe(F);
                expect(Type.isAllowType(type2, tar03)).toBe(F);
                expect(Type.isAllowType(type2, tar04)).toBe(F);
                expect(Type.isAllowType(type2, tar05)).toBe(F);
                // type2 _opt_ ** 모두 실패 **
                expect(Type.isAllowType(type2, tar11)).toBe(F);
                expect(Type.isAllowType(type2, tar12)).toBe(F);
                expect(Type.isAllowType(type2, tar13)).toBe(F);
                expect(Type.isAllowType(type2, tar14)).toBe(F);
                expect(Type.isAllowType(type2, tar15)).toBe(F);
                // type2 _seq_
                expect(Type.isAllowType(type2, tar21)).toBe(F);
                expect(Type.isAllowType(type2, tar22)).toBe(F);
                expect(Type.isAllowType(type2, tar23)).toBe(F);
                expect(Type.isAllowType(type2, tar24)).toBe(T);
                expect(Type.isAllowType(type2, tar25)).toBe(T);
            });
            it('- Type.isAllowType() : array _seq_ 리터럴 vs req, opt, seq ', () => {
                var type1 = ['_seq_', 'aa', 'bb']
                var type2 = ['_seq_', 10, true, /reg/, 10n]

                var tar01 = ['_req_']
                var tar02 = ['_req_', 'aa']
                var tar03 = ['_req_', 'aa', 'bb']
                var tar04 = ['_req_', 10, true, /reg/, 10n]
                var tar05 = ['_req_', 20]
                var tar06 = ['_req_', /reg2/]
                var tar07 = ['_req_', F]
                var tar08 = ['_req_', 20n]

                var tar11 = []
                var tar12 = ['aa']
                var tar13 = ['aa', 'bb']
                var tar14 = [10, true, /reg/, 10n]
                var tar15 = [20]
                var tar16 = [/reg2/]
                var tar17 = [F]
                var tar18 = [20n]

                var tar21 = ['_seq_']
                var tar22 = ['_seq_', 'aa']
                var tar23 = ['_seq_', 'aa', 'bb']
                var tar24 = ['_seq_', 10, true, /reg/, 10n]
                var tar25 = ['_seq_', 20]
                var tar26 = ['_seq_', /reg2/]
                var tar27 = ['_seq_', F]
                var tar28 = ['_seq_', 20n]

                // type1 _req_  ** 모두 실패 **
                expect(Type.isAllowType(type1, tar01)).toBe(F);
                expect(Type.isAllowType(type1, tar02)).toBe(F);
                expect(Type.isAllowType(type1, tar03)).toBe(F);
                expect(Type.isAllowType(type1, tar04)).toBe(F);
                expect(Type.isAllowType(type1, tar05)).toBe(F);
                expect(Type.isAllowType(type1, tar06)).toBe(F);
                expect(Type.isAllowType(type1, tar07)).toBe(F);
                expect(Type.isAllowType(type1, tar08)).toBe(F);
                // type1 _opt_  ** 모두 실패 **
                expect(Type.isAllowType(type1, tar11)).toBe(F);
                expect(Type.isAllowType(type1, tar12)).toBe(F);
                expect(Type.isAllowType(type1, tar13)).toBe(F);
                expect(Type.isAllowType(type1, tar14)).toBe(F);
                expect(Type.isAllowType(type1, tar15)).toBe(F);
                expect(Type.isAllowType(type1, tar16)).toBe(F);
                expect(Type.isAllowType(type1, tar17)).toBe(F);
                expect(Type.isAllowType(type1, tar18)).toBe(F);
                // type1 _seq_
                expect(Type.isAllowType(type1, tar21)).toBe(F);
                expect(Type.isAllowType(type1, tar22)).toBe(F);
                expect(Type.isAllowType(type1, tar23)).toBe(T);
                expect(Type.isAllowType(type1, tar24)).toBe(F);
                expect(Type.isAllowType(type1, tar25)).toBe(F);
                expect(Type.isAllowType(type1, tar26)).toBe(F);
                expect(Type.isAllowType(type1, tar27)).toBe(F);
                expect(Type.isAllowType(type1, tar28)).toBe(F);
                // type2 _req_  ** 모두 실패 **
                expect(Type.isAllowType(type2, tar01)).toBe(F);
                expect(Type.isAllowType(type2, tar02)).toBe(F);
                expect(Type.isAllowType(type2, tar03)).toBe(F);
                expect(Type.isAllowType(type2, tar04)).toBe(F);
                expect(Type.isAllowType(type2, tar05)).toBe(F);
                expect(Type.isAllowType(type2, tar06)).toBe(F);
                expect(Type.isAllowType(type2, tar07)).toBe(F);
                expect(Type.isAllowType(type2, tar08)).toBe(F);
                // type2 _opt_ ** 모두 실패 **
                expect(Type.isAllowType(type2, tar11)).toBe(F);
                expect(Type.isAllowType(type2, tar12)).toBe(F);
                expect(Type.isAllowType(type2, tar13)).toBe(F);
                expect(Type.isAllowType(type2, tar14)).toBe(F);
                expect(Type.isAllowType(type2, tar15)).toBe(F);
                expect(Type.isAllowType(type2, tar16)).toBe(F);
                expect(Type.isAllowType(type2, tar17)).toBe(F);
                expect(Type.isAllowType(type2, tar18)).toBe(F);
                // type2 _seq_
                expect(Type.isAllowType(type2, tar21)).toBe(F);
                expect(Type.isAllowType(type2, tar22)).toBe(F);
                expect(Type.isAllowType(type2, tar23)).toBe(F);
                expect(Type.isAllowType(type2, tar24)).toBe(T);
                expect(Type.isAllowType(type2, tar25)).toBe(F);
                expect(Type.isAllowType(type2, tar26)).toBe(F);
                expect(Type.isAllowType(type2, tar27)).toBe(F);
                expect(Type.isAllowType(type2, tar28)).toBe(F);
            });
            it('- Type.isAllowType() : array _all_ vs req, opt, seq  ', () => {
                var type1 = ['_all_']  // === Array
                var type2 = Array

                var tar01 = []
                var tar02 = [String]
                var tar03 = ['_req_', String]
                var tar04 = ['_seq_', String, Number] 
                var tar05 = ['_all_']
                var tar06 = ['_any_']
                var tar07 = ['_non_']   // ** 없는 타입 **
                var tar08 = Array
                var tar09 = String

                expect(Type.isAllowType(type1, tar01)).toBe(T);
                expect(Type.isAllowType(type1, tar02)).toBe(T);
                expect(Type.isAllowType(type1, tar03)).toBe(T);
                expect(Type.isAllowType(type1, tar04)).toBe(T);
                expect(Type.isAllowType(type1, tar05)).toBe(T);
                expect(Type.isAllowType(type1, tar06)).toBe(T);
                expect(Type.isAllowType(type1, tar07)).toBe(F);
                expect(Type.isAllowType(type1, tar08)).toBe(T);
                expect(Type.isAllowType(type1, tar09)).toBe(F);

                expect(Type.isAllowType(type2, tar01)).toBe(T);
                expect(Type.isAllowType(type2, tar02)).toBe(T);
                expect(Type.isAllowType(type2, tar03)).toBe(T);
                expect(Type.isAllowType(type2, tar04)).toBe(T);
                expect(Type.isAllowType(type2, tar05)).toBe(T);
                expect(Type.isAllowType(type2, tar06)).toBe(T);
                expect(Type.isAllowType(type2, tar07)).toBe(F);
                expect(Type.isAllowType(type2, tar08)).toBe(T);
                expect(Type.isAllowType(type2, tar09)).toBe(F);
            });
            it('- Type.isAllowType() : array _any_ vs req, opt, seq  ', () => {
                var type1 = ['_any_']  // === []
                var type2 = [] 

                var tar01 = []
                var tar02 = [String]
                var tar03 = ['_req_', String]
                var tar04 = ['_seq_', String, Number]
                var tar05 = ['_all_']
                var tar06 = ['_any_']
                var tar07 = ['_non_']
                var tar08 = Array
                var tar09 = String

                expect(Type.isAllowType(type1, tar01)).toBe(T);
                expect(Type.isAllowType(type1, tar02)).toBe(F);
                expect(Type.isAllowType(type1, tar03)).toBe(T); 
                expect(Type.isAllowType(type1, tar04)).toBe(T);
                expect(Type.isAllowType(type1, tar05)).toBe(F);
                expect(Type.isAllowType(type1, tar06)).toBe(T);
                expect(Type.isAllowType(type1, tar07)).toBe(F);
                expect(Type.isAllowType(type1, tar08)).toBe(F);
                expect(Type.isAllowType(type1, tar09)).toBe(F);

                expect(Type.isAllowType(type2, tar01)).toBe(T);
                expect(Type.isAllowType(type2, tar02)).toBe(F);
                expect(Type.isAllowType(type2, tar03)).toBe(T);
                expect(Type.isAllowType(type2, tar04)).toBe(T);
                expect(Type.isAllowType(type2, tar05)).toBe(F);
                expect(Type.isAllowType(type2, tar06)).toBe(T);
                expect(Type.isAllowType(type2, tar07)).toBe(F);
                expect(Type.isAllowType(type2, tar08)).toBe(F);
                expect(Type.isAllowType(type2, tar09)).toBe(F);
            });
            
            it('- Type.isAllowType() : array 중첩타입 array ', () => { 
                // ** REVIEW: req, seq 타입은 테스트 제외함, 필요시 추가
                var type1 = ['_opt_', [String], [Number] ]
                var type2 = ['_opt_', [String, Number] ]

                var tar01 = []                              // any
                var tar02 = ['_opt_', []]                   // 배열 any 요소
                var tar03 = ['_opt_', [String]]
                var tar04 = ['_opt_', [Number]]
                var tar05 = ['_opt_', [String], [Number]]
                var tar06 = ['_opt_', [String, Number]]
                var tar07 = ['_opt_', [Boolean]]
                var tar08 = ['_opt_', String]
                var tar08 = ['_opt_']

                // type1
                expect(Type.isAllowType(type1, tar01)).toBe(F);
                expect(Type.isAllowType(type1, tar02)).toBe(F);
                expect(Type.isAllowType(type1, tar03)).toBe(T);
                expect(Type.isAllowType(type1, tar04)).toBe(T);
                expect(Type.isAllowType(type1, tar05)).toBe(T);
                expect(Type.isAllowType(type1, tar06)).toBe(F);
                expect(Type.isAllowType(type1, tar07)).toBe(F);
                expect(Type.isAllowType(type1, tar08)).toBe(F);
                // type2
                expect(Type.isAllowType(type2, tar01)).toBe(F);
                expect(Type.isAllowType(type2, tar02)).toBe(F);
                expect(Type.isAllowType(type2, tar03)).toBe(T);
                expect(Type.isAllowType(type2, tar04)).toBe(T);
                expect(Type.isAllowType(type2, tar05)).toBe(T);
                expect(Type.isAllowType(type2, tar06)).toBe(T);
                expect(Type.isAllowType(type2, tar07)).toBe(F);
                expect(Type.isAllowType(type2, tar08)).toBe(F);
            });
            it('- Type.isAllowType() : array 중첩타입 choice, opt ', () => { 
                var type1 = [ '_opt_', [[String, Number]] ]   // === type2
                var type2 = [ '_opt_', String, Number ]
                var type3 = [ '_opt_', [[String]], [[Number]] ]
                var type4 = [ '_opt_', [[String, Number]], [['aa', 'bb']] ] 

                var tar01 = [ '_opt_', [[String]] ]
                var tar02 = [ '_opt_', String ]
                var tar03 = [ '_opt_', String, Number ]
                var tar04 = [ '_opt_',[[String, Number]] ]
                var tar05 = [ '_opt_', String, Number, Boolean ] 
                var tar06 = [ '_opt_',[[String, Number, Boolean]] ]
                var tar07 = [ '_opt_', String, Number, 'aa', 'bb' ]
                var tar08 = [ '_opt_',[[String, Number, 'aa', 'bb']] ]
                var tar09 = [ '_opt_',[[String, Number]], [['aa', 'bb']] ]
                var tar10 = [ '_opt_', String, Number, 'aa', 'bb', true ]
                
                // type1
                expect(Type.isAllowType(type1, tar01)).toBe(T);
                expect(Type.isAllowType(type1, tar02)).toBe(T); 
                expect(Type.isAllowType(type1, tar03)).toBe(T);
                expect(Type.isAllowType(type1, tar04)).toBe(T); 
                expect(Type.isAllowType(type1, tar05)).toBe(F);
                expect(Type.isAllowType(type1, tar06)).toBe(F);
                expect(Type.isAllowType(type1, tar07)).toBe(T); 
                expect(Type.isAllowType(type1, tar08)).toBe(T);
                expect(Type.isAllowType(type1, tar09)).toBe(T);
                expect(Type.isAllowType(type1, tar10)).toBe(F);
                // type2 
                expect(Type.isAllowType(type2, tar01)).toBe(T);
                expect(Type.isAllowType(type2, tar02)).toBe(T); 
                expect(Type.isAllowType(type2, tar03)).toBe(T);
                expect(Type.isAllowType(type2, tar04)).toBe(T);
                expect(Type.isAllowType(type2, tar05)).toBe(F);
                expect(Type.isAllowType(type2, tar06)).toBe(F);
                expect(Type.isAllowType(type2, tar07)).toBe(T);
                expect(Type.isAllowType(type2, tar08)).toBe(T);
                expect(Type.isAllowType(type2, tar09)).toBe(T);
                expect(Type.isAllowType(type2, tar10)).toBe(F);
                // type3
                expect(Type.isAllowType(type3, tar01)).toBe(T);
                expect(Type.isAllowType(type3, tar02)).toBe(T); 
                expect(Type.isAllowType(type3, tar03)).toBe(T);
                expect(Type.isAllowType(type3, tar04)).toBe(F);  // ** 그룹 조건 실패
                expect(Type.isAllowType(type3, tar05)).toBe(F);
                expect(Type.isAllowType(type3, tar06)).toBe(F);
                expect(Type.isAllowType(type3, tar07)).toBe(T);
                expect(Type.isAllowType(type3, tar08)).toBe(F);  // ** 그룹 조건 실패
                expect(Type.isAllowType(type3, tar09)).toBe(F);  // ** 그룹 조건 실패
                expect(Type.isAllowType(type3, tar10)).toBe(F);
                // type4
                expect(Type.isAllowType(type4, tar01)).toBe(T);
                expect(Type.isAllowType(type4, tar02)).toBe(T);
                expect(Type.isAllowType(type4, tar03)).toBe(T);
                expect(Type.isAllowType(type4, tar04)).toBe(T);
                expect(Type.isAllowType(type4, tar05)).toBe(F);
                expect(Type.isAllowType(type4, tar06)).toBe(F);
                expect(Type.isAllowType(type4, tar07)).toBe(T);
                expect(Type.isAllowType(type4, tar08)).toBe(T);
                expect(Type.isAllowType(type4, tar09)).toBe(T);
                expect(Type.isAllowType(type4, tar10)).toBe(F);
            });
            // ** opt 와 동일한 결과
            it('- Type.isAllowType() : array 중첩타입 choice, req ', () => {
                var type1 = [ '_req_', [[String, Number]] ]   // === type2
                var type2 = [ '_req_', String, Number ]
                var type3 = [ '_req_', [[String]], [[Number]] ]
                var type4 = [ '_req_', [[String, Number]], [['aa', 'bb']] ] 

                var tar01 = [ '_req_', [[String]] ]
                var tar02 = [ '_req_', String ]
                var tar03 = [ '_req_', String, Number ]
                var tar04 = [ '_req_',[[String, Number]] ]
                var tar05 = [ '_req_', String, Number, Boolean ] 
                var tar06 = [ '_req_',[[String, Number, Boolean]] ]
                var tar07 = [ '_req_', String, Number, 'aa', 'bb' ]
                var tar08 = [ '_req_',[[String, Number, 'aa', 'bb']] ]
                var tar09 = [ '_req_',[[String, Number]], [['aa', 'bb']] ]
                var tar10 = [ '_req_', String, Number, 'aa', 'bb', true ]
                
                // type1
                expect(Type.isAllowType(type1, tar01)).toBe(T);
                expect(Type.isAllowType(type1, tar02)).toBe(T); 
                expect(Type.isAllowType(type1, tar03)).toBe(T);
                expect(Type.isAllowType(type1, tar04)).toBe(T); 
                expect(Type.isAllowType(type1, tar05)).toBe(F);
                expect(Type.isAllowType(type1, tar06)).toBe(F);
                expect(Type.isAllowType(type1, tar07)).toBe(T); 
                expect(Type.isAllowType(type1, tar08)).toBe(T);
                expect(Type.isAllowType(type1, tar09)).toBe(T);
                expect(Type.isAllowType(type1, tar10)).toBe(F);
                // type2 
                expect(Type.isAllowType(type2, tar01)).toBe(T);
                expect(Type.isAllowType(type2, tar02)).toBe(T); 
                expect(Type.isAllowType(type2, tar03)).toBe(T);
                expect(Type.isAllowType(type2, tar04)).toBe(T);
                expect(Type.isAllowType(type2, tar05)).toBe(F);
                expect(Type.isAllowType(type2, tar06)).toBe(F);
                expect(Type.isAllowType(type2, tar07)).toBe(T);
                expect(Type.isAllowType(type2, tar08)).toBe(T);
                expect(Type.isAllowType(type2, tar09)).toBe(T);
                expect(Type.isAllowType(type2, tar10)).toBe(F);
                // type3
                expect(Type.isAllowType(type3, tar01)).toBe(T);
                expect(Type.isAllowType(type3, tar02)).toBe(T); 
                expect(Type.isAllowType(type3, tar03)).toBe(T);
                expect(Type.isAllowType(type3, tar04)).toBe(F);  // ** 그룹 조건 실패
                expect(Type.isAllowType(type3, tar05)).toBe(F);
                expect(Type.isAllowType(type3, tar06)).toBe(F);
                expect(Type.isAllowType(type3, tar07)).toBe(T);
                expect(Type.isAllowType(type3, tar08)).toBe(F);  // ** 그룹 조건 실패
                expect(Type.isAllowType(type3, tar09)).toBe(F);  // ** 그룹 조건 실패
                expect(Type.isAllowType(type3, tar10)).toBe(F);
                // type4
                expect(Type.isAllowType(type4, tar01)).toBe(T);
                expect(Type.isAllowType(type4, tar02)).toBe(T);
                expect(Type.isAllowType(type4, tar03)).toBe(T);
                expect(Type.isAllowType(type4, tar04)).toBe(T);
                expect(Type.isAllowType(type4, tar05)).toBe(F);
                expect(Type.isAllowType(type4, tar06)).toBe(F);
                expect(Type.isAllowType(type4, tar07)).toBe(T);
                expect(Type.isAllowType(type4, tar08)).toBe(T);
                expect(Type.isAllowType(type4, tar09)).toBe(T);
                expect(Type.isAllowType(type4, tar10)).toBe(F);
            });
            it('- Type.isAllowType() : array 중첩타입 choice, seq ', () => {
                var type1 = [ '_seq_', [[String, Number]] ]   // === type2
                var type2 = [ '_seq_', String, Number ]
                var type3 = [ '_seq_', [[String]], [[Number]] ]
                var type4 = [ '_seq_', [[String, Number]], [['aa', 'bb']] ] 

                var tar01 = [ '_seq_', [[String]] ]
                var tar02 = [ '_seq_', String ]
                var tar03 = [ '_seq_', String, Number ]
                var tar04 = [ '_seq_',[[String, Number]] ]
                var tar05 = [ '_seq_', String, Number, Boolean ] 
                var tar06 = [ '_seq_',[[String, Number, Boolean]] ]
                var tar07 = [ '_seq_', String, Number, 'aa', 'bb' ]
                var tar08 = [ '_seq_',[[String, Number, 'aa', 'bb']] ]
                var tar09 = [ '_seq_',[[String, Number]], [['aa', 'bb']] ]
                var tar10 = [ '_seq_', String, Number, 'aa', 'bb', true ]
                var tar11 = [ '_seq_', Number ]
                
                // type1
                expect(Type.isAllowType(type1, tar01)).toBe(T);
                expect(Type.isAllowType(type1, tar02)).toBe(T); 
                expect(Type.isAllowType(type1, tar03)).toBe(T);
                expect(Type.isAllowType(type1, tar04)).toBe(T); 
                expect(Type.isAllowType(type1, tar05)).toBe(T);
                expect(Type.isAllowType(type1, tar06)).toBe(F);
                expect(Type.isAllowType(type1, tar07)).toBe(T); 
                expect(Type.isAllowType(type1, tar08)).toBe(T);
                expect(Type.isAllowType(type1, tar09)).toBe(T);
                expect(Type.isAllowType(type1, tar10)).toBe(T);
                expect(Type.isAllowType(type1, tar11)).toBe(T);
                // type2 
                expect(Type.isAllowType(type2, tar01)).toBe(F);
                expect(Type.isAllowType(type2, tar02)).toBe(F); 
                expect(Type.isAllowType(type2, tar03)).toBe(T);
                expect(Type.isAllowType(type2, tar04)).toBe(F);
                expect(Type.isAllowType(type2, tar05)).toBe(T);
                expect(Type.isAllowType(type2, tar06)).toBe(F);
                expect(Type.isAllowType(type2, tar07)).toBe(T);
                expect(Type.isAllowType(type2, tar08)).toBe(F);
                expect(Type.isAllowType(type2, tar09)).toBe(F);
                expect(Type.isAllowType(type2, tar10)).toBe(T);
                expect(Type.isAllowType(type2, tar11)).toBe(F);
                // type3  ** type2 와 동일
                expect(Type.isAllowType(type3, tar01)).toBe(F);
                expect(Type.isAllowType(type3, tar02)).toBe(F); 
                expect(Type.isAllowType(type3, tar03)).toBe(T);
                expect(Type.isAllowType(type3, tar04)).toBe(F);
                expect(Type.isAllowType(type3, tar05)).toBe(T);
                expect(Type.isAllowType(type3, tar06)).toBe(F);
                expect(Type.isAllowType(type3, tar07)).toBe(T);
                expect(Type.isAllowType(type3, tar08)).toBe(F);
                expect(Type.isAllowType(type3, tar09)).toBe(F);
                expect(Type.isAllowType(type3, tar10)).toBe(T);
                expect(Type.isAllowType(type3, tar11)).toBe(F);
                // type4
                expect(Type.isAllowType(type4, tar01)).toBe(F);
                expect(Type.isAllowType(type4, tar02)).toBe(F);
                expect(Type.isAllowType(type4, tar03)).toBe(F);
                expect(Type.isAllowType(type4, tar04)).toBe(F);
                expect(Type.isAllowType(type4, tar05)).toBe(F);
                expect(Type.isAllowType(type4, tar06)).toBe(F);
                expect(Type.isAllowType(type4, tar07)).toBe(F);
                expect(Type.isAllowType(type4, tar08)).toBe(F);
                expect(Type.isAllowType(type4, tar09)).toBe(T);
                expect(Type.isAllowType(type4, tar10)).toBe(F);
                expect(Type.isAllowType(type4, tar11)).toBe(F);
            });
            it('- Type.isAllowType() : array 중첩타입 class ', () => {
                class ClassA { aa = String }
                class ClassB { aa = Number }
                class ClassC { aa = Boolean }

                var type1 = [ ClassA, ClassB ]

                var tar01 = [ ClassA, ClassB ]
                var tar02 = [ ClassC ]
                var tar03 = [ {aa: 'str'}, {aa: 10} ]
                var tar04 = [ {aa: true} ]

                expect(Type.isAllowType(type1, tar01)).toBe(T);
                expect(Type.isAllowType(type1, tar02)).toBe(F);
                expect(Type.isAllowType(type1, tar03)).toBe(F);
                expect(Type.isAllowType(type1, tar04)).toBe(F);
                // opt === 1 (확장모드)
                expect(Type.isAllowType(type1, tar01, 1)).toBe(T);
                expect(Type.isAllowType(type1, tar02, 1)).toBe(F);
                expect(Type.isAllowType(type1, tar03, 1)).toBe(T);
                expect(Type.isAllowType(type1, tar04, 1)).toBe(F);
            });
            it('- Type.isAllowType() : array 중첩타입 union ', () => {
                var type1 = [ { aa: String }, { aa: Number } ]

                var tar01 = [ { aa: 'str' } ]
                var tar02 = [ { aa: 10 } ]
                var tar03 = [ { aa: 'str' }, { aa: 10 }  ]
                var tar04 = [ { aa: true } ]
                var tar05 = [ { aa: 'str' }, { aa: 10 }, { aa: true } ]

                expect(Type.isAllowType(type1, tar01)).toBe(T);
                expect(Type.isAllowType(type1, tar02)).toBe(T);
                expect(Type.isAllowType(type1, tar03)).toBe(T);
                expect(Type.isAllowType(type1, tar04)).toBe(F);
                expect(Type.isAllowType(type1, tar05)).toBe(F);
            });
            it('- Type.isAllowType() : array 중첩타입 function ', () => {
                var type1 = [String=>Number, String=>Boolean];

                var tar01 = [String=>Number]
                var tar02 = [String=>Boolean]
                var tar03 = [String=>{}]
                var tar04 = [String=>Number, String=>Boolean]

                expect(Type.isAllowType(type1, tar01)).toBe(T);
                expect(Type.isAllowType(type1, tar02)).toBe(T);
                expect(Type.isAllowType(type1, tar03)).toBe(F);
                expect(Type.isAllowType(type1, tar04)).toBe(T);
            });
        });
        describe('choice ', () => {
            it('- Type.isAllowType() : choice _opt_ ', () => {
                var type1 = [[String]]
                var type2 = [[String, Number]]

                var tar01 = [['_any_']]    // === [[]]
                var tar02 = [['_all_']]    
                var tar03 = [['_non_']]    
                var tar04 = [['_eum_']]    
                var tar05 = [['_def_']]    
                var tar06 = [['_seq_', 'aa']]    // 실패, array 타입

                var tar11 = [[String]]
                var tar12 = [[Number]]
                var tar13 = [[String, Number]]
                var tar14 = [[String, Number, Boolean]]

                var tar21 = [['_req_', String]]
                var tar22 = [['_req_', Number]]
                var tar23 = [['_req_', String, Number]]
                var tar24 = [['_req_', String, Number, Boolean]]

                // all, any, non, eum, def  ** 모두 실패 **
                expect(Type.isAllowType(type1, tar01)).toBe(F);
                expect(Type.isAllowType(type1, tar02)).toBe(F);
                expect(Type.isAllowType(type1, tar03)).toBe(F);
                expect(Type.isAllowType(type1, tar04)).toBe(F); 
                expect(Type.isAllowType(type1, tar05)).toBe(F);
                expect(Type.isAllowType(type1, tar06)).toBe(F);
                // type1 _opt_
                expect(Type.isAllowType(type1, tar11)).toBe(T);
                expect(Type.isAllowType(type1, tar12)).toBe(F);
                expect(Type.isAllowType(type1, tar13)).toBe(F);
                expect(Type.isAllowType(type1, tar14)).toBe(F);
                // type1 _req_
                expect(Type.isAllowType(type1, tar21)).toBe(T);
                expect(Type.isAllowType(type1, tar22)).toBe(F);
                expect(Type.isAllowType(type1, tar23)).toBe(F);
                expect(Type.isAllowType(type1, tar24)).toBe(F);
                // type2 all, any, non, eum, def
                expect(Type.isAllowType(type2, tar01)).toBe(F);
                expect(Type.isAllowType(type2, tar02)).toBe(F);
                expect(Type.isAllowType(type2, tar03)).toBe(F);
                expect(Type.isAllowType(type2, tar04)).toBe(F);
                expect(Type.isAllowType(type2, tar05)).toBe(F);
                // type2 _opt_
                expect(Type.isAllowType(type2, tar11)).toBe(T);
                expect(Type.isAllowType(type2, tar12)).toBe(T);
                expect(Type.isAllowType(type2, tar13)).toBe(T);
                expect(Type.isAllowType(type2, tar14)).toBe(F);
                // type2 _req_ 
                expect(Type.isAllowType(type2, tar21)).toBe(T);
                expect(Type.isAllowType(type2, tar22)).toBe(T);
                expect(Type.isAllowType(type2, tar23)).toBe(T);
                expect(Type.isAllowType(type2, tar24)).toBe(F);
            });
            it('- Type.isAllowType() : choice _opt_ 리터럴 ', () => {
                var type1 = [['aa']]
                var type2 = [['aa', 'bb']]

                var tar01 = [['_any_']]    // === [[]]
                var tar02 = [['_all_']]    //
                var tar03 = [['_non_']]    //
                var tar04 = [['_eum_']]    
                var tar05 = [['_def_']]    
                var tar06 = [['_seq_', 'aa']]    // 실패, array 타입

                var tar11 = [['aa']]
                var tar12 = [['bb']]
                var tar13 = [['aa', 'bb']]
                var tar14 = [['aa', 'bb', 'cc']]

                var tar21 = [['_req_', 'aa']]
                var tar22 = [['_req_', 'bb']]
                var tar23 = [['_req_', 'aa', 'bb']]
                var tar24 = [['_req_', 'aa', 'bb', 'cc']]

                var tar31 = [['_eum_', 'aa']]
                var tar32 = [['_eum_', 'bb']]
                var tar33 = [['_eum_', 'aa', 'bb']]
                var tar34 = [['_eum_', 'aa', 'bb', 'cc']]

                var tar41 = [['_def_', 'aa']]
                var tar42 = [['_def_', 'bb']]
                var tar43 = [['_def_', 'aa', 'bb']]
                var tar44 = [['_def_', 'aa', 'bb', 'cc']]

                // all, any, non, eum, def
                expect(Type.isAllowType(type1, tar01)).toBe(F);
                expect(Type.isAllowType(type1, tar02)).toBe(F);
                expect(Type.isAllowType(type1, tar03)).toBe(F);
                expect(Type.isAllowType(type1, tar04)).toBe(F); 
                expect(Type.isAllowType(type1, tar05)).toBe(F);
                expect(Type.isAllowType(type1, tar06)).toBe(F);
                // type1 _opt_
                expect(Type.isAllowType(type1, tar11)).toBe(T);
                expect(Type.isAllowType(type1, tar12)).toBe(F);
                expect(Type.isAllowType(type1, tar13)).toBe(F);
                expect(Type.isAllowType(type1, tar14)).toBe(F);
                // type1 _req_
                expect(Type.isAllowType(type1, tar21)).toBe(T);
                expect(Type.isAllowType(type1, tar22)).toBe(F);
                expect(Type.isAllowType(type1, tar23)).toBe(F);
                expect(Type.isAllowType(type1, tar24)).toBe(F);
                // type1 _eum_
                expect(Type.isAllowType(type1, tar31)).toBe(T);
                expect(Type.isAllowType(type1, tar32)).toBe(F);
                expect(Type.isAllowType(type1, tar33)).toBe(F);
                expect(Type.isAllowType(type1, tar33)).toBe(F);
                // type1 _def_
                expect(Type.isAllowType(type1, tar41)).toBe(T);
                expect(Type.isAllowType(type1, tar42)).toBe(F);
                expect(Type.isAllowType(type1, tar43)).toBe(F);
                expect(Type.isAllowType(type1, tar43)).toBe(F);
                // type2 all, any, non, eum, def
                expect(Type.isAllowType(type2, tar01)).toBe(F);
                expect(Type.isAllowType(type2, tar02)).toBe(F);
                expect(Type.isAllowType(type2, tar03)).toBe(F);
                expect(Type.isAllowType(type2, tar04)).toBe(F);
                expect(Type.isAllowType(type2, tar05)).toBe(F);
                // type2 _opt_
                expect(Type.isAllowType(type2, tar11)).toBe(T);
                expect(Type.isAllowType(type2, tar12)).toBe(T);
                expect(Type.isAllowType(type2, tar13)).toBe(T);
                expect(Type.isAllowType(type2, tar14)).toBe(F);
                // type2 _req_ 
                expect(Type.isAllowType(type2, tar21)).toBe(T);
                expect(Type.isAllowType(type2, tar22)).toBe(T);
                expect(Type.isAllowType(type2, tar23)).toBe(T);
                expect(Type.isAllowType(type2, tar24)).toBe(F);
                // type2 _eum_
                expect(Type.isAllowType(type2, tar31)).toBe(T);
                expect(Type.isAllowType(type2, tar32)).toBe(T);
                expect(Type.isAllowType(type2, tar33)).toBe(T);
                expect(Type.isAllowType(type2, tar34)).toBe(F);
                // type2 _def_
                expect(Type.isAllowType(type2, tar41)).toBe(T);
                expect(Type.isAllowType(type2, tar42)).toBe(T);
                expect(Type.isAllowType(type2, tar43)).toBe(T);
                expect(Type.isAllowType(type2, tar44)).toBe(F);
            });
            it('- Type.isAllowType() : choice _req_ ', () => {
                var type1 = String
                // var type1 = [['_req_', String]]  // === String 
                var type2 = [['_req_', String, Number]]

                var tar01 = [['_any_']]    // === [[]]
                var tar02 = [['_all_']]    
                var tar03 = [['_non_']]    
                var tar04 = [['_eum_']]    
                var tar05 = [['_def_']]    
                var tar06 = [['_seq_', 'aa']]    // 실패, array 타입

                var tar11 = [[String]]
                var tar12 = [[Number]]
                var tar13 = [[String, Number]]
                var tar14 = [[String, Number, Boolean]]

                var tar21 = [['_req_', String]]
                var tar22 = [['_req_', Number]]
                var tar23 = [['_req_', String, Number]]
                var tar24 = [['_req_', String, Number, Boolean]]

                // all, any, non, eum, def ** 모두 실패 **
                expect(Type.isAllowType(type1, tar01)).toBe(F);
                expect(Type.isAllowType(type1, tar02)).toBe(F);
                expect(Type.isAllowType(type1, tar03)).toBe(F);
                expect(Type.isAllowType(type1, tar04)).toBe(F); 
                expect(Type.isAllowType(type1, tar05)).toBe(F);
                expect(Type.isAllowType(type1, tar06)).toBe(F);
                // type1 _opt_ ** 모두 실패 **
                expect(Type.isAllowType(type1, tar11)).toBe(F);
                expect(Type.isAllowType(type1, tar12)).toBe(F);
                expect(Type.isAllowType(type1, tar13)).toBe(F);
                expect(Type.isAllowType(type1, tar14)).toBe(F);
                // type1 _req_
                expect(Type.isAllowType(type1, tar21)).toBe(T);
                expect(Type.isAllowType(type1, tar22)).toBe(F);
                expect(Type.isAllowType(type1, tar23)).toBe(F);
                expect(Type.isAllowType(type1, tar24)).toBe(F);
                // type2 all, any, non, eum, def ** 모두 실패 **
                expect(Type.isAllowType(type2, tar01)).toBe(F);
                expect(Type.isAllowType(type2, tar02)).toBe(F);
                expect(Type.isAllowType(type2, tar03)).toBe(F);
                expect(Type.isAllowType(type2, tar04)).toBe(F);
                expect(Type.isAllowType(type2, tar05)).toBe(F);
                // type2 _opt_ ** 모두 실패 **
                expect(Type.isAllowType(type2, tar11)).toBe(F);
                expect(Type.isAllowType(type2, tar12)).toBe(F);
                expect(Type.isAllowType(type2, tar13)).toBe(F);
                expect(Type.isAllowType(type2, tar14)).toBe(F);
                // type2 _req_ 
                expect(Type.isAllowType(type2, tar21)).toBe(T);
                expect(Type.isAllowType(type2, tar22)).toBe(T);
                expect(Type.isAllowType(type2, tar23)).toBe(T);
                expect(Type.isAllowType(type2, tar24)).toBe(F);
            });
            it('- Type.isAllowType() : choice _req_ 리터럴 ', () => {
                var type1 = [['_req_', 'aa']]
                var type2 = [['_req_', 'aa', 'bb']]

                var tar01 = [['_any_']]    // === [[]]
                var tar02 = [['_all_']]    //
                var tar03 = [['_non_']]    //
                var tar04 = [['_eum_']]    //
                var tar05 = [['_def_']]    //

                var tar11 = [['aa']]
                var tar12 = [['bb']]
                var tar13 = [['aa', 'bb']]
                var tar14 = [['aa', 'bb', 'cc']]

                var tar21 = [['_req_', 'aa']]
                var tar22 = [['_req_', 'bb']]
                var tar23 = [['_req_', 'aa', 'bb']]
                var tar24 = [['_req_', 'aa', 'bb', 'cc']]

                var tar31 = [['_eum_', 'aa']]
                var tar32 = [['_eum_', 'bb']]
                var tar33 = [['_eum_', 'aa', 'bb']]
                var tar34 = [['_eum_', 'aa', 'bb', 'cc']]

                var tar41 = [['_def_', 'aa']]
                var tar42 = [['_def_', 'bb']]
                var tar43 = [['_def_', 'aa', 'bb']]
                var tar44 = [['_def_', 'aa', 'bb', 'cc']]


                // all, any, non, eum, def  ** 모두 실패 **
                expect(Type.isAllowType(type1, tar01)).toBe(F);
                expect(Type.isAllowType(type1, tar02)).toBe(F);
                expect(Type.isAllowType(type1, tar03)).toBe(F);
                expect(Type.isAllowType(type1, tar04)).toBe(F); 
                expect(Type.isAllowType(type1, tar05)).toBe(F);
                // type1 _opt_ ** 모두 실패 **
                expect(Type.isAllowType(type1, tar11)).toBe(F);
                expect(Type.isAllowType(type1, tar12)).toBe(F);
                expect(Type.isAllowType(type1, tar13)).toBe(F);
                expect(Type.isAllowType(type1, tar14)).toBe(F);
                // type1 _req_
                expect(Type.isAllowType(type1, tar21)).toBe(T);
                expect(Type.isAllowType(type1, tar22)).toBe(F);
                expect(Type.isAllowType(type1, tar23)).toBe(F);
                expect(Type.isAllowType(type1, tar24)).toBe(F);
                // type1 _eum_
                expect(Type.isAllowType(type1, tar31)).toBe(T);
                expect(Type.isAllowType(type1, tar32)).toBe(F);
                expect(Type.isAllowType(type1, tar33)).toBe(F);
                expect(Type.isAllowType(type1, tar33)).toBe(F);
                // type1 _def_
                expect(Type.isAllowType(type1, tar41)).toBe(T);
                expect(Type.isAllowType(type1, tar42)).toBe(F);
                expect(Type.isAllowType(type1, tar43)).toBe(F);
                expect(Type.isAllowType(type1, tar43)).toBe(F);
                // type2 all, any, non, eum, def    ** 모두 실패 **
                expect(Type.isAllowType(type2, tar01)).toBe(F);
                expect(Type.isAllowType(type2, tar02)).toBe(F);
                expect(Type.isAllowType(type2, tar03)).toBe(F);
                expect(Type.isAllowType(type2, tar04)).toBe(F);
                expect(Type.isAllowType(type2, tar05)).toBe(F);
                // type2 _opt_ ** 모두 실패 **
                expect(Type.isAllowType(type2, tar11)).toBe(F);
                expect(Type.isAllowType(type2, tar12)).toBe(F);
                expect(Type.isAllowType(type2, tar13)).toBe(F);
                expect(Type.isAllowType(type2, tar14)).toBe(F);
                // type2 _req_ 
                expect(Type.isAllowType(type2, tar21)).toBe(T);
                expect(Type.isAllowType(type2, tar22)).toBe(T);
                expect(Type.isAllowType(type2, tar23)).toBe(T);
                expect(Type.isAllowType(type2, tar24)).toBe(F);
                // type2 _eum_
                expect(Type.isAllowType(type2, tar31)).toBe(T);
                expect(Type.isAllowType(type2, tar32)).toBe(T);
                expect(Type.isAllowType(type2, tar33)).toBe(T);
                expect(Type.isAllowType(type2, tar34)).toBe(F);
                // type2 _def_
                expect(Type.isAllowType(type2, tar41)).toBe(T);
                expect(Type.isAllowType(type2, tar42)).toBe(T);
                expect(Type.isAllowType(type2, tar43)).toBe(T);
                expect(Type.isAllowType(type2, tar44)).toBe(F);
            });
            it('- Type.isAllowType() : choice _all_ ', () => {
                var type1 = [['_all_']]

                // 모든 타입 허용
                expect(Type.isAllowType(type1, '')           ).toBe(T);
                expect(Type.isAllowType(type1, 10)           ).toBe(T);
                expect(Type.isAllowType(type1, true)         ).toBe(T);
                expect(Type.isAllowType(type1, 1n)           ).toBe(T);
                expect(Type.isAllowType(type1, Symbol())     ).toBe(T);
                expect(Type.isAllowType(type1, /reg/)        ).toBe(T);
                expect(Type.isAllowType(type1, {})           ).toBe(T);
                expect(Type.isAllowType(type1, {a: 1})       ).toBe(T);
                expect(Type.isAllowType(type1, Date)         ).toBe(T);
                expect(Type.isAllowType(type1, [[]])         ).toBe(T);
                expect(Type.isAllowType(type1, [])           ).toBe(T);
                expect(Type.isAllowType(type1, undefined)    ).toBe(T);
                expect(Type.isAllowType(type1, [[String]])   ).toBe(T);
                expect(Type.isAllowType(type1, [['_non_']])  ).toBe(T);
                expect(Type.isAllowType(type1, [['_any_']])  ).toBe(T);
                expect(Type.isAllowType(type1, [['_all_']])  ).toBe(T);
                expect(Type.isAllowType(type1, [['_err_']])  ).toBe(F);
            });
            it('- Type.isAllowType() : choice _any_ ', () => {
                var type1 = [['_any_']]

                // undefined 제외 허용, 필수값 의미
                expect(Type.isAllowType(type1, '')           ).toBe(T);
                expect(Type.isAllowType(type1, 10)           ).toBe(T);
                expect(Type.isAllowType(type1, true)         ).toBe(T);
                expect(Type.isAllowType(type1, 1n)           ).toBe(T);
                expect(Type.isAllowType(type1, Symbol())     ).toBe(T);
                expect(Type.isAllowType(type1, /reg/)        ).toBe(T);
                expect(Type.isAllowType(type1, {})           ).toBe(T);
                expect(Type.isAllowType(type1, {a: 1})       ).toBe(T);
                expect(Type.isAllowType(type1, Date)         ).toBe(T);
                expect(Type.isAllowType(type1, [[]])         ).toBe(T);
                expect(Type.isAllowType(type1, [])           ).toBe(T);
                expect(Type.isAllowType(type1, undefined)    ).toBe(F);
                expect(Type.isAllowType(type1, [[String]])   ).toBe(F);
                expect(Type.isAllowType(type1, [['_non_']])  ).toBe(F);
                expect(Type.isAllowType(type1, [['_any_']])  ).toBe(T);
                expect(Type.isAllowType(type1, [['_all_']])  ).toBe(F);
                expect(Type.isAllowType(type1, [['_err_']])  ).toBe(F);
            });
            it('- Type.isMatchType() : choice _non_ ', () => {
                var type1 = [['_non_']]    // === undfined

                // undefined 만 허용
                expect(Type.isMatchType(type1, '')           ).toBe(F);
                expect(Type.isMatchType(type1, 10)           ).toBe(F);
                expect(Type.isMatchType(type1, true)         ).toBe(F);
                expect(Type.isMatchType(type1, 1n)           ).toBe(F);
                expect(Type.isMatchType(type1, Symbol())     ).toBe(F);
                expect(Type.isMatchType(type1, /reg/)        ).toBe(F);
                expect(Type.isMatchType(type1, {})           ).toBe(F);
                expect(Type.isMatchType(type1, {a: 1})       ).toBe(F);
                expect(Type.isMatchType(type1, Date)         ).toBe(F);
                expect(Type.isMatchType(type1, [[]])         ).toBe(F);
                expect(Type.isMatchType(type1, [])           ).toBe(F);
                expect(Type.isMatchType(type1, undefined)    ).toBe(T);
                expect(Type.isAllowType(type1, [[String]])   ).toBe(F);
                expect(Type.isAllowType(type1, [['_non_']])  ).toBe(T);
                expect(Type.isAllowType(type1, [['_any_']])  ).toBe(F);
                expect(Type.isAllowType(type1, [['_all_']])  ).toBe(F);
                expect(Type.isAllowType(type1, [['_err_']])  ).toBe(F);
            });
            it('- Type.isAllowType() : choice _eum_ ', () => {  
                var type1 = [['_eum_']]                     // 오류
                var type2 = [['_eum_', 'aa']]
                var type3 = [['_eum_', 'aa', /reg/, 10]]
                var type4 = [['_eum_', 'aa', Number]]       // 오류 

                var tar01 = [['_eum_', 'aa']]
                var tar02 = [['_eum_', 'bb']]
                var tar03 = [['_eum_', 'aa', /reg/]]
                var tar04 = [['_eum_', 'aa', /reg/, 10]]
                var tar05 = [['_opt_', 'aa']]
                var tar06 = [['_req_', 'aa']]
                var tar07 = [['_seq_', 'aa']]
                var tar08 = [['_def_', 'aa']]

                // type1    ** 모두 실패 **
                expect(Type.isAllowType(type1, tar01)).toBe(F);
                expect(Type.isAllowType(type1, tar02)).toBe(F);
                expect(Type.isAllowType(type1, tar03)).toBe(F);
                expect(Type.isAllowType(type1, tar04)).toBe(F);
                expect(Type.isAllowType(type1, tar05)).toBe(F);
                expect(Type.isAllowType(type1, tar06)).toBe(F);
                expect(Type.isAllowType(type1, tar07)).toBe(F);
                expect(Type.isAllowType(type1, tar08)).toBe(F);
                // type2
                expect(Type.isAllowType(type2, tar01)).toBe(T);
                expect(Type.isAllowType(type2, tar02)).toBe(F);
                expect(Type.isAllowType(type2, tar03)).toBe(F);
                expect(Type.isAllowType(type2, tar04)).toBe(F);
                expect(Type.isAllowType(type2, tar05)).toBe(F);
                expect(Type.isAllowType(type2, tar06)).toBe(F);
                expect(Type.isAllowType(type2, tar07)).toBe(F);
                expect(Type.isAllowType(type2, tar08)).toBe(F);
                // type3
                expect(Type.isAllowType(type3, tar01)).toBe(T);
                expect(Type.isAllowType(type3, tar02)).toBe(F);
                expect(Type.isAllowType(type3, tar03)).toBe(T);
                expect(Type.isAllowType(type3, tar04)).toBe(T);
                expect(Type.isAllowType(type3, tar05)).toBe(F);
                expect(Type.isAllowType(type3, tar06)).toBe(F);
                expect(Type.isAllowType(type3, tar07)).toBe(F);
                expect(Type.isAllowType(type3, tar08)).toBe(F);
                // type4    ** 모두 실패 **
                expect(Type.isAllowType(type4, tar01)).toBe(F);
                expect(Type.isAllowType(type4, tar02)).toBe(F);
                expect(Type.isAllowType(type4, tar03)).toBe(F);
                expect(Type.isAllowType(type4, tar04)).toBe(F);
                expect(Type.isAllowType(type4, tar05)).toBe(F);
                expect(Type.isAllowType(type4, tar06)).toBe(F);
                expect(Type.isAllowType(type4, tar07)).toBe(F);
                expect(Type.isAllowType(type4, tar08)).toBe(F);
            });
            it('- Type.isAllowType() : choice _def_ ', () => {
                var type1 = [['_def_']]                 // 오류
                var type2 = [['_def_', 'aa']]
                var type3 = [['_def_', 'aa', /reg/, 10]]
                var type4 = [['_def_', 'aa', Number]]
                var type5 = [['_def_', String, 10]]     // 오류 

                var tar01 = [['_def_', 'aa']]
                var tar02 = [['_def_', 'bb']]
                var tar03 = [['_def_', 'aa', /reg/]]
                var tar04 = [['_def_', 'aa', 20]]
                var tar05 = [['_opt_', 'aa']]
                var tar06 = [['_req_', 'aa']]
                var tar07 = [['_seq_', 'aa']]
                var tar08 = [['_eum_', 'aa']]

                // type1    ** 모두 실패 **
                expect(Type.isAllowType(type1, tar01)).toBe(F);
                expect(Type.isAllowType(type1, tar02)).toBe(F);
                expect(Type.isAllowType(type1, tar03)).toBe(F);
                expect(Type.isAllowType(type1, tar04)).toBe(F);
                expect(Type.isAllowType(type1, tar05)).toBe(F);
                expect(Type.isAllowType(type1, tar06)).toBe(F);
                expect(Type.isAllowType(type1, tar07)).toBe(F);
                expect(Type.isAllowType(type1, tar08)).toBe(F);
                // type2
                expect(Type.isAllowType(type2, tar01)).toBe(T);
                expect(Type.isAllowType(type2, tar02)).toBe(F);
                expect(Type.isAllowType(type2, tar03)).toBe(F);
                expect(Type.isAllowType(type2, tar04)).toBe(F);
                expect(Type.isAllowType(type2, tar05)).toBe(F);
                expect(Type.isAllowType(type2, tar06)).toBe(F);
                expect(Type.isAllowType(type2, tar07)).toBe(F);
                expect(Type.isAllowType(type2, tar08)).toBe(F);
                // type3
                expect(Type.isAllowType(type3, tar01)).toBe(T);
                expect(Type.isAllowType(type3, tar02)).toBe(F);
                expect(Type.isAllowType(type3, tar03)).toBe(T);
                expect(Type.isAllowType(type3, tar04)).toBe(F);
                expect(Type.isAllowType(type3, tar05)).toBe(F);
                expect(Type.isAllowType(type3, tar06)).toBe(F);
                expect(Type.isAllowType(type3, tar07)).toBe(F);
                expect(Type.isAllowType(type3, tar08)).toBe(F);
                // type4
                expect(Type.isAllowType(type4, tar01)).toBe(T);
                expect(Type.isAllowType(type4, tar02)).toBe(F);
                expect(Type.isAllowType(type4, tar03)).toBe(F);
                expect(Type.isAllowType(type4, tar04)).toBe(T);
                expect(Type.isAllowType(type4, tar05)).toBe(F);
                expect(Type.isAllowType(type4, tar06)).toBe(F);
                expect(Type.isAllowType(type4, tar07)).toBe(F);
                expect(Type.isAllowType(type4, tar08)).toBe(F);
                // type5    ** 모두 실패 **
                expect(Type.isAllowType(type5, tar01)).toBe(F);
                expect(Type.isAllowType(type5, tar02)).toBe(F);
                expect(Type.isAllowType(type5, tar03)).toBe(F);
                expect(Type.isAllowType(type5, tar04)).toBe(F);
                expect(Type.isAllowType(type5, tar05)).toBe(F);
                expect(Type.isAllowType(type5, tar06)).toBe(F);
                expect(Type.isAllowType(type5, tar07)).toBe(F);
                expect(Type.isAllowType(type5, tar08)).toBe(F);
            });
            it('- Type.isAllowType() : choice _err_ ', () => {
                var type1 = [['_err_']]    // === undfined

                expect(Type.isAllowType(type1, '')           ).toBe(F);
                expect(Type.isAllowType(type1, 10)           ).toBe(F);
                expect(Type.isAllowType(type1, true)         ).toBe(F);
                expect(Type.isAllowType(type1, 1n)           ).toBe(F);
                expect(Type.isAllowType(type1, Symbol())     ).toBe(F);
                expect(Type.isAllowType(type1, /reg/)        ).toBe(F);
                expect(Type.isAllowType(type1, {})           ).toBe(F);
                expect(Type.isAllowType(type1, {a: 1})       ).toBe(F);
                expect(Type.isAllowType(type1, Date)         ).toBe(F);
                expect(Type.isAllowType(type1, [[]])         ).toBe(F);
                expect(Type.isAllowType(type1, [])           ).toBe(F);
                expect(Type.isAllowType(type1, undefined)    ).toBe(F);
                expect(Type.isAllowType(type1, [[String]])   ).toBe(F);
                expect(Type.isAllowType(type1, [['_non_']])  ).toBe(F);
                expect(Type.isAllowType(type1, [['_any_']])  ).toBe(F);
                expect(Type.isAllowType(type1, [['_all_']])  ).toBe(F);
                expect(Type.isAllowType(type1, [['_err_']])  ).toBe(T);
            });

            it('- Type.isAllowType() : choice 중첩타입 array ', () => {
                var type1 = [[ [String], [Number] ]]
                var type2 = [[ [String, Number] ]]
                var type3 = [[ ['aa'], [10] ]]
                var type4 = [[ ['aa', 10] ]]

                var tar01 = [[ [String]  ]]
                var tar02 = [[ [Number]  ]]
                var tar03 = [[ [String], [Number]  ]]
                var tar04 = [[ [String, Number]  ]]
                var tar05 = [[ [String], [Number], [Boolean] ]]
                var tar06 = [[ ['aa'], [10] ]]
                var tar07 = [[ ['aa', 10] ]]

                // type1
                expect(Type.isAllowType(type1, tar01)).toBe(T);
                expect(Type.isAllowType(type1, tar02)).toBe(T);
                expect(Type.isAllowType(type1, tar03)).toBe(T);
                expect(Type.isAllowType(type1, tar04)).toBe(F);
                expect(Type.isAllowType(type1, tar05)).toBe(F);
                expect(Type.isAllowType(type1, tar06)).toBe(T);
                expect(Type.isAllowType(type1, tar07)).toBe(F);
                // type2
                expect(Type.isAllowType(type2, tar01)).toBe(T);
                expect(Type.isAllowType(type2, tar02)).toBe(T);
                expect(Type.isAllowType(type2, tar03)).toBe(T);
                expect(Type.isAllowType(type2, tar04)).toBe(T);
                expect(Type.isAllowType(type2, tar05)).toBe(F);
                expect(Type.isAllowType(type2, tar06)).toBe(T);
                expect(Type.isAllowType(type2, tar07)).toBe(T);
                // type3
                expect(Type.isAllowType(type3, tar01)).toBe(F);
                expect(Type.isAllowType(type3, tar02)).toBe(F);
                expect(Type.isAllowType(type3, tar03)).toBe(F);
                expect(Type.isAllowType(type3, tar04)).toBe(F);
                expect(Type.isAllowType(type3, tar05)).toBe(F);
                expect(Type.isAllowType(type3, tar06)).toBe(T);
                expect(Type.isAllowType(type3, tar07)).toBe(F);
                // type4
                expect(Type.isAllowType(type4, tar01)).toBe(F);
                expect(Type.isAllowType(type4, tar02)).toBe(F);
                expect(Type.isAllowType(type4, tar03)).toBe(F);
                expect(Type.isAllowType(type4, tar04)).toBe(F);
                expect(Type.isAllowType(type4, tar05)).toBe(F);
                expect(Type.isAllowType(type4, tar06)).toBe(T);
                expect(Type.isAllowType(type4, tar07)).toBe(T);
            }); 
            it('- Type.isAllowType() : choice 중첩타입 choice opt ', () => {
                var type1 = [[ [['_opt_', String]], [['_opt_', Number]] ]]
                var type2 = [[ [['_opt_', String, Number]] ]]
                
                var tar01 = [[ [['_opt_', String]], [['_opt_', Number]] ]]
                var tar02 = [[ [['_opt_', String, Number]] ]]
                var tar03 = [[ [['_req_', String]], [['_req_', Number]] ]]
                var tar04 = [[ [['_req_', String, Number]] ]]
                var tar05 = [[ [['_eum_', 'aa']], [['_eum_', 10]] ]]
                var tar06 = [[ [['_eum_', 'aa', 10]] ]]
                var tar07 = [[ [['_def_', 'aa']], [['_def_', 10]] ]]
                var tar08 = [[ [['_def_', 'aa', 10]] ]]

                // type1
                expect(Type.isAllowType(type1, tar01)).toBe(T);
                expect(Type.isAllowType(type1, tar02)).toBe(F);
                expect(Type.isAllowType(type1, tar03)).toBe(T);
                expect(Type.isAllowType(type1, tar04)).toBe(F);
                expect(Type.isAllowType(type1, tar05)).toBe(T);
                expect(Type.isAllowType(type1, tar06)).toBe(F);
                expect(Type.isAllowType(type1, tar07)).toBe(T);
                expect(Type.isAllowType(type1, tar08)).toBe(F);
                // type2
                expect(Type.isAllowType(type2, tar01)).toBe(T);
                expect(Type.isAllowType(type2, tar02)).toBe(T);
                expect(Type.isAllowType(type2, tar03)).toBe(T);
                expect(Type.isAllowType(type2, tar04)).toBe(T);
                expect(Type.isAllowType(type2, tar05)).toBe(T);
                expect(Type.isAllowType(type2, tar06)).toBe(T);
                expect(Type.isAllowType(type2, tar07)).toBe(T);
                expect(Type.isAllowType(type2, tar08)).toBe(T);
            }); 
            it('- Type.isAllowType() : choice 중첩타입 choice req ', () => {
                var type1 = [[ [['_req_', String]], [['_req_', Number]] ]]
                var type2 = [[ [['_req_', String, Number]] ]]
                
                var tar01 = [[ [['_opt_', String]], [['_opt_', Number]] ]]  // ** 모두 실패
                var tar02 = [[ [['_opt_', String, Number]] ]]               // ** 모두 실패
                var tar03 = [[ [['_req_', String]], [['_req_', Number]] ]]
                var tar04 = [[ [['_req_', String, Number]] ]]
                var tar05 = [[ [['_eum_', 'aa']], [['_eum_', 10]] ]]
                var tar06 = [[ [['_eum_', 'aa', 10]] ]]
                var tar07 = [[ [['_def_', 'aa']], [['_def_', 10]] ]]
                var tar08 = [[ [['_def_', 'aa', 10]] ]]

                // type1
                expect(Type.isAllowType(type1, tar01)).toBe(F);
                expect(Type.isAllowType(type1, tar02)).toBe(F);
                expect(Type.isAllowType(type1, tar03)).toBe(T);
                expect(Type.isAllowType(type1, tar04)).toBe(F);
                expect(Type.isAllowType(type1, tar05)).toBe(T);
                expect(Type.isAllowType(type1, tar06)).toBe(F);
                expect(Type.isAllowType(type1, tar07)).toBe(T);
                expect(Type.isAllowType(type1, tar08)).toBe(F);
                // type2
                expect(Type.isAllowType(type2, tar01)).toBe(F);
                expect(Type.isAllowType(type2, tar02)).toBe(F);
                expect(Type.isAllowType(type2, tar03)).toBe(T);
                expect(Type.isAllowType(type2, tar04)).toBe(T);
                expect(Type.isAllowType(type2, tar05)).toBe(T);
                expect(Type.isAllowType(type2, tar06)).toBe(T);
                expect(Type.isAllowType(type2, tar07)).toBe(T);
                expect(Type.isAllowType(type2, tar08)).toBe(T);
            }); 
            it('- Type.isAllowType() : choice 중첩타입 choice eum ', () => {
                var type1 = [[ [['_eum_', 'aa']], [['_eum_', 10]] ]]
                var type2 = [[ [['_eum_', 'aa', 10]] ]]
                
                var tar01 = [[ [['_opt_', String]], [['_opt_', Number]] ]]  // ** 모두 실패
                var tar02 = [[ [['_opt_', String, Number]] ]]               // ** 모두 실패
                var tar03 = [[ [['_req_', String]], [['_req_', Number]] ]]  // ** 모두 실패
                var tar04 = [[ [['_req_', String, Number]] ]]               // ** 모두 실패
                var tar05 = [[ [['_eum_', 'aa']], [['_eum_', 10]] ]]        
                var tar06 = [[ [['_eum_', 'aa', 10]] ]]                     
                var tar07 = [[ [['_def_', 'aa']], [['_def_', 10]] ]]        // ** 모두 실패
                var tar08 = [[ [['_def_', 'aa', 10]] ]]                     // ** 모두 실패

                // type1
                expect(Type.isAllowType(type1, tar01)).toBe(F);
                expect(Type.isAllowType(type1, tar02)).toBe(F);
                expect(Type.isAllowType(type1, tar03)).toBe(F);
                expect(Type.isAllowType(type1, tar04)).toBe(F);
                expect(Type.isAllowType(type1, tar05)).toBe(T);
                expect(Type.isAllowType(type1, tar06)).toBe(F);
                expect(Type.isAllowType(type1, tar07)).toBe(F);
                expect(Type.isAllowType(type1, tar08)).toBe(F);
                // type2
                expect(Type.isAllowType(type2, tar01)).toBe(F);
                expect(Type.isAllowType(type2, tar02)).toBe(F);
                expect(Type.isAllowType(type2, tar03)).toBe(F);
                expect(Type.isAllowType(type2, tar04)).toBe(F);
                expect(Type.isAllowType(type2, tar05)).toBe(T);
                expect(Type.isAllowType(type2, tar06)).toBe(T);
                expect(Type.isAllowType(type2, tar07)).toBe(F);
                expect(Type.isAllowType(type2, tar08)).toBe(F);
            }); 
            it('- Type.isAllowType() : choice 중첩타입 choice def ', () => {
                var type1 = [[ [['_def_', 'aa']], [['_def_', 10]] ]]
                var type2 = [[ [['_def_', 'aa', 10]] ]]
                
                var tar01 = [[ [['_opt_', String]], [['_opt_', Number]] ]]  // ** 모두 실패
                var tar02 = [[ [['_opt_', String, Number]] ]]               // ** 모두 실패
                var tar03 = [[ [['_req_', String]], [['_req_', Number]] ]]  // ** 모두 실패
                var tar04 = [[ [['_req_', String, Number]] ]]               // ** 모두 실패
                var tar05 = [[ [['_eum_', 'aa']], [['_eum_', 10]] ]]        // ** 모두 실패
                var tar06 = [[ [['_eum_', 'aa', 10]] ]]                     // ** 모두 실패
                var tar07 = [[ [['_def_', 'aa']], [['_def_', 10]] ]]
                var tar08 = [[ [['_def_', 'aa', 10]] ]]

                // type1
                expect(Type.isAllowType(type1, tar01)).toBe(F);
                expect(Type.isAllowType(type1, tar02)).toBe(F);
                expect(Type.isAllowType(type1, tar03)).toBe(F);
                expect(Type.isAllowType(type1, tar04)).toBe(F);
                expect(Type.isAllowType(type1, tar05)).toBe(F);
                expect(Type.isAllowType(type1, tar06)).toBe(F);
                expect(Type.isAllowType(type1, tar07)).toBe(T);
                expect(Type.isAllowType(type1, tar08)).toBe(F);
                // type2
                expect(Type.isAllowType(type2, tar01)).toBe(F);
                expect(Type.isAllowType(type2, tar02)).toBe(F);
                expect(Type.isAllowType(type2, tar03)).toBe(F);
                expect(Type.isAllowType(type2, tar04)).toBe(F);
                expect(Type.isAllowType(type2, tar05)).toBe(F);
                expect(Type.isAllowType(type2, tar06)).toBe(F);
                expect(Type.isAllowType(type2, tar07)).toBe(T);
                expect(Type.isAllowType(type2, tar08)).toBe(T);
            }); 
            it('- Type.isAllowType() : choice 중첩타입 class ', () => {
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
                
                expect(Type.isAllowType(type1, tar01)).toBe(T);
                expect(Type.isAllowType(type1, tar02)).toBe(T);
                expect(Type.isAllowType(type1, tar03)).toBe(F);
                expect(Type.isAllowType(type1, tar04)).toBe(F);
                expect(Type.isAllowType(type1, tar05)).toBe(F);
                expect(Type.isAllowType(type1, tar06)).toBe(F);
                // opt = 1, 확장모드
                expect(Type.isAllowType(type1, tar01, 1)).toBe(T);
                expect(Type.isAllowType(type1, tar02, 1)).toBe(T);
                expect(Type.isAllowType(type1, tar03, 1)).toBe(F);
                expect(Type.isAllowType(type1, tar04, 1)).toBe(T);
                expect(Type.isAllowType(type1, tar05, 1)).toBe(T);
                expect(Type.isAllowType(type1, tar06, 1)).toBe(F);
            });
            it('- Type.isAllowType() : choice 중첩타입 union ', () => {
                var type1 = [[ { aa: String }, { aa: Number } ]]
                var type2 = [[ { aa: String, bb: Boolean } ]]
                
                var tar01 = { aa: 'str' }
                var tar02 = { aa: 10 }
                var tar03 = { bb: true }
                var tar04 = { aa: 'str', bb: true }

                // type1
                expect(Type.isAllowType(type1, tar01)).toBe(T);
                expect(Type.isAllowType(type1, tar02)).toBe(T);
                expect(Type.isAllowType(type1, tar03)).toBe(F);
                expect(Type.isAllowType(type1, tar04)).toBe(T);
                // type2
                expect(Type.isAllowType(type2, tar01)).toBe(F);
                expect(Type.isAllowType(type2, tar02)).toBe(F);
                expect(Type.isAllowType(type2, tar03)).toBe(F);
                expect(Type.isAllowType(type2, tar04)).toBe(T);
            }); 
            it('- Type.isAllowType() : choice 중첩타입 function ', () => {  
                var type1 = [[ String=>Number, String=>Boolean ]]
                var type2 = [[ String=>{} ]]
                var type3 = [[ { $type: 'function', return: [['_non_']] } ]]

                var fun01 = { $type: 'function', params: [String], return: Number } 
                var fun02 = { $type: 'function', params: [String], return: Boolean }
                var fun03 = { $type: 'function', params: [String], return: String }
                var fun04 = { $type: 'function', params: [String], return: [['_non_']] }
                
                var tar01 = [[ fun01, fun02 ]]
                var tar02 = [[ fun02 ]]
                var tar03 = [[ fun02, fun03 ]]
                var tar04 = [[ fun04 ]]

                // type1
                expect(Type.isAllowType(type1, tar01)).toBe(T);
                expect(Type.isAllowType(type1, tar02)).toBe(T);
                expect(Type.isAllowType(type1, tar03)).toBe(F); 
                expect(Type.isAllowType(type1, tar04)).toBe(F);
                // type2, string 으로 시작하는 모든 타입 허용  
                expect(Type.isAllowType(type2, tar01)).toBe(T);
                expect(Type.isAllowType(type2, tar02)).toBe(T);
                expect(Type.isAllowType(type2, tar03)).toBe(T);
                expect(Type.isAllowType(type2, tar04)).toBe(T);
                // type3
                expect(Type.isAllowType(type3, tar01)).toBe(F);
                expect(Type.isAllowType(type3, tar02)).toBe(F);
                expect(Type.isAllowType(type3, tar03)).toBe(F);
                expect(Type.isAllowType(type3, tar04)).toBe(T);

                // fun01
                expect(Type.isAllowType(type1, fun01)).toBe(T);
                expect(Type.isAllowType(type1, fun02)).toBe(T);
                expect(Type.isAllowType(type1, fun03)).toBe(F); 
                expect(Type.isAllowType(type1, fun04)).toBe(F);
                // fun02
                expect(Type.isAllowType(type2, fun01)).toBe(T);
                expect(Type.isAllowType(type2, fun02)).toBe(T);
                expect(Type.isAllowType(type2, fun03)).toBe(T);
                expect(Type.isAllowType(type2, fun04)).toBe(T);
                // fun03
                expect(Type.isAllowType(type3, fun01)).toBe(F);
                expect(Type.isAllowType(type3, fun02)).toBe(F);
                expect(Type.isAllowType(type3, fun03)).toBe(F);
                expect(Type.isAllowType(type3, fun04)).toBe(T);
            }); 
        });
        describe('class', () => {
            it('- Type.isAllowType() : class instainceof, union ', () => { 
                function ClassA() { this.age = Number; this.fun = (a,b)=>{} }
                class ClassB { age = 10; fun = function(){} }

                var tar01 = new ClassA()               // union
                var tar02 = new ClassB()               // union
                var tar03 = { age: 10, fun: ()=>{} }   // union
                var tar04 = { age: 10 }                // union  ** 모두 실패 **

                // class to class
                expect(Type.isAllowType(ClassA, ClassA)).toBe(T);
                expect(Type.isAllowType(ClassA, ClassB)).toBe(F);
                expect(Type.isAllowType(ClassB, ClassA)).toBe(F);
                expect(Type.isAllowType(ClassB, ClassB)).toBe(T);
                
                // class to union
                
                // opt === 0 : proto만 허용
                // ClassA
                expect(Type.isAllowType(ClassA, tar01)).toBe(F); 
                expect(Type.isAllowType(ClassA, tar02)).toBe(F);   
                expect(Type.isAllowType(ClassA, tar03)).toBe(F);
                expect(Type.isAllowType(ClassA, tar04)).toBe(F);
                // ClassB
                expect(Type.isAllowType(ClassB, tar01)).toBe(F);
                expect(Type.isAllowType(ClassB, tar02)).toBe(F);
                expect(Type.isAllowType(ClassB, tar03)).toBe(F);
                expect(Type.isAllowType(ClassB, tar04)).toBe(F);
                
                // opt == 1, 확장모드
                // ClassA
                expect(Type.isAllowType(ClassA, tar01, 1)).toBe(T); 
                expect(Type.isAllowType(ClassA, tar02, 1)).toBe(T);   
                expect(Type.isAllowType(ClassA, tar03, 1)).toBe(T);
                expect(Type.isAllowType(ClassA, tar04, 1)).toBe(F);
                // ClassB
                expect(Type.isAllowType(ClassB, tar01, 1)).toBe(F);
                expect(Type.isAllowType(ClassB, tar02, 1)).toBe(T);
                expect(Type.isAllowType(ClassB, tar03, 1)).toBe(T);
                expect(Type.isAllowType(ClassB, tar04, 1)).toBe(F);

            });
            it('- Type.isAllowType() : class (내장함수) ', () => {
                var type1 = Date

                var tar01 = {}
                var tar02 = new Date()
                var tar03 = Date

                expect(Type.isAllowType(type1, tar01)).toBe(F);
                expect(Type.isAllowType(type1, tar02)).toBe(F);
                expect(Type.isAllowType(type1, tar03)).toBe(T);
            });
            it('- Type.isAllowType() : class proto(상속)', () => {      // ** match 와 동일 **
                class ClassA { age = Number }
                class ClassB extends ClassA { color = String }
                class ClassC { color = String; age = Number }

                // ClassA
                expect(Type.isAllowType(ClassA, ClassA)).toBe(T);
                expect(Type.isAllowType(ClassA, ClassB)).toBe(T);   
                expect(Type.isAllowType(ClassA, ClassC)).toBe(F);
                // ClassB
                expect(Type.isAllowType(ClassB, ClassA)).toBe(F);
                expect(Type.isAllowType(ClassB, ClassB)).toBe(T);
                expect(Type.isAllowType(ClassB, ClassC)).toBe(F);
                // ClassC
                expect(Type.isAllowType(ClassC, ClassA)).toBe(F);
                expect(Type.isAllowType(ClassC, ClassB)).toBe(F);
                expect(Type.isAllowType(ClassC, ClassC)).toBe(T);
            });
        });
        describe('union', () => {
            it('- Type.isAllowType() : union ', () => {
                var type1 = { str: 'aa', num: Number }
                var type2 = { arr: ['blue'] }
 
                var tar11 = { str: 'aa' }
                var tar12 = { num: 10 }
                var tar13 = { str: 'aa', num: 10 }
                var tar14 = { str: 'bb', num: 10 }

                var tar21 = { arr:['blue'] }
                var tar22 = { arr:['red'] }
                var tar23 = { arr:['blue', 'red'] }
                var tar24 = { arr:[] }
                
                 // type1
                expect(Type.isAllowType(type1, tar11)).toBe(F);
                expect(Type.isAllowType(type1, tar12)).toBe(F);
                expect(Type.isAllowType(type1, tar13)).toBe(T);
                expect(Type.isAllowType(type1, tar14)).toBe(F);
                // type2
                expect(Type.isAllowType(type2, tar21)).toBe(T);
                expect(Type.isAllowType(type2, tar22)).toBe(F);
                expect(Type.isAllowType(type2, tar23)).toBe(F);
                expect(Type.isAllowType(type2, tar24)).toBe(F);
            });
            it('- Type.isAllowType() : union 단일타입 ', () => {
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
                expect(Type.isAllowType(type1, {aa: ''})         ).toBe(T);
                expect(Type.isAllowType(type1, {aa: 's'})        ).toBe(T);
                expect(Type.isAllowType(type1, {aa: 10})         ).toBe(F);
                expect(Type.isAllowType(type1, {aa: undefined})  ).toBe(F);
                // type2
                expect(Type.isAllowType(type2, {aa: 10})         ).toBe(T);
                expect(Type.isAllowType(type2, {aa: 0})          ).toBe(T);
                expect(Type.isAllowType(type2, {aa: ''})         ).toBe(F);
                expect(Type.isAllowType(type2, {aa: undefined})  ).toBe(F);
                // type3
                expect(Type.isAllowType(type3, {aa: true})       ).toBe(T);
                expect(Type.isAllowType(type3, {aa: F})      ).toBe(T);
                expect(Type.isAllowType(type3, {aa: ''})         ).toBe(F);
                expect(Type.isAllowType(type3, {aa: undefined})  ).toBe(F);
                // type4
                expect(Type.isAllowType(type4, {aa: 10n})        ).toBe(T);
                expect(Type.isAllowType(type4, {aa: 0n})         ).toBe(T);
                expect(Type.isAllowType(type4, {aa: ''})         ).toBe(F);
                expect(Type.isAllowType(type4, {aa: undefined})  ).toBe(F);
                // type5
                expect(Type.isAllowType(type5, {aa: null})       ).toBe(T);
                expect(Type.isAllowType(type5, {aa: ''})         ).toBe(F);
                expect(Type.isAllowType(type5, {aa: undefined})  ).toBe(F);
                // type6
                expect(Type.isAllowType(type6, {aa: undefined})  ).toBe(T);
                expect(Type.isAllowType(type6, {aa: null})       ).toBe(F);
                expect(Type.isAllowType(type6, {aa: ''})         ).toBe(F);
                // type7
                expect(Type.isAllowType(type7, {aa: undefined})  ).toBe(F);
                expect(Type.isAllowType(type7, {aa: [['_NON_']]})).toBe(T);
                expect(Type.isAllowType(type7, {aa: null})       ).toBe(F);
                expect(Type.isAllowType(type7, {aa: ''})         ).toBe(F);
                // type8
                expect(Type.isAllowType(type8, {aa: /reg/})      ).toBe(T);
                expect(Type.isAllowType(type8, {aa: null})       ).toBe(F);
                expect(Type.isAllowType(type8, {aa: ''})         ).toBe(F);
                // type9
                expect(Type.isAllowType(type9, {aa: new Date()}) ).toBe(T);
                expect(Type.isAllowType(type9, {aa: null})       ).toBe(F);
                expect(Type.isAllowType(type9, {aa: ''})         ).toBe(F);
                // type10
                expect(Type.isAllowType(type10, {aa: Symbol()})  ).toBe(T);
                expect(Type.isAllowType(type10, {aa: Symbol})    ).toBe(T);
                expect(Type.isAllowType(type10, {aa: ''})        ).toBe(F);
            });
            it('- Type.isAllowType() : union 중첩타입 array ', () => {
                var type1 = { aa: Array }

                var tar01 = { aa: [] }
                var tar02 = { aa: ['str', 10] }
                var tar03 = { aa: 10 }

                expect(Type.isAllowType(type1, tar01)).toBe(T);
                expect(Type.isAllowType(type1, tar02)).toBe(T);
                expect(Type.isAllowType(type1, tar03)).toBe(F);
            });
            it('- Type.isAllowType() : union 중첩타입 array + 요소 ', () => {
                var type1 = { aa: [] }
                var type2 = { aa: ['_req_', String] }
                var type3 = { aa: ['_req_', String, Number] }
                var type4 = { aa: Array }
                var type5 = { aa: [String] }
                var type6 = { aa: [String, Number] }

                var tar01 = { aa: [] }
                var tar02 = { aa: [String] } 
                var tar03 = { aa: [Number] }
                var tar04 = { aa: [String, Number] }
                var tar05 = { aa: [String, Number, Boolean] }

                // type1
                expect(Type.isAllowType(type1, tar01)).toBe(T);
                expect(Type.isAllowType(type1, tar02)).toBe(F);
                expect(Type.isAllowType(type1, tar03)).toBe(F);
                expect(Type.isAllowType(type1, tar04)).toBe(F);
                expect(Type.isAllowType(type1, tar05)).toBe(F);
                // type2    ** req 에는 모두 실패 **
                expect(Type.isAllowType(type2, tar01)).toBe(F);
                expect(Type.isAllowType(type2, tar02)).toBe(F);
                expect(Type.isAllowType(type2, tar03)).toBe(F);
                expect(Type.isAllowType(type2, tar04)).toBe(F);
                expect(Type.isAllowType(type2, tar05)).toBe(F);
                // type3    ** req 에는 모두 실패 **
                expect(Type.isAllowType(type3, tar01)).toBe(F);
                expect(Type.isAllowType(type3, tar02)).toBe(F);
                expect(Type.isAllowType(type3, tar03)).toBe(F);
                expect(Type.isAllowType(type3, tar04)).toBe(F);
                expect(Type.isAllowType(type3, tar05)).toBe(F);
                // type4    ** all 에는 모두 성공 **
                expect(Type.isAllowType(type4, tar01)).toBe(T);
                expect(Type.isAllowType(type4, tar02)).toBe(T);
                expect(Type.isAllowType(type4, tar03)).toBe(T);
                expect(Type.isAllowType(type4, tar04)).toBe(T);
                expect(Type.isAllowType(type4, tar05)).toBe(T);
                // type5
                expect(Type.isAllowType(type5, tar01)).toBe(F);
                expect(Type.isAllowType(type5, tar02)).toBe(T);
                expect(Type.isAllowType(type5, tar03)).toBe(F);
                expect(Type.isAllowType(type5, tar04)).toBe(F);
                expect(Type.isAllowType(type5, tar05)).toBe(F);
                // type6
                expect(Type.isAllowType(type6, tar01)).toBe(F);
                expect(Type.isAllowType(type6, tar02)).toBe(T);
                expect(Type.isAllowType(type6, tar03)).toBe(T);
                expect(Type.isAllowType(type6, tar04)).toBe(T);
                expect(Type.isAllowType(type6, tar05)).toBe(F);
            });
            it('- Type.isAllowType() : union 중첩타입 choice ', () => {
                var type1 = { aa: [['_req_', String, Number]] }

                var tar01 = { aa: String }
                var tar02 = { aa: Number }
                var tar03 = { aa: Boolean }

                expect(Type.isAllowType(type1, tar01)).toBe(T);
                expect(Type.isAllowType(type1, tar02)).toBe(T);
                expect(Type.isAllowType(type1, tar03)).toBe(F);
            });
            it('- Type.isAllowType() : union 중첩타입 class ', () => {
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
                expect(Type.isAllowType(type1, tar01)).toBe(F);
                expect(Type.isAllowType(type1, tar02)).toBe(F);
                expect(Type.isAllowType(type1, tar03)).toBe(T);
                expect(Type.isAllowType(type1, tar04)).toBe(T);
                expect(Type.isAllowType(type1, tar05)).toBe(F);
                // opt === 1
                expect(Type.isAllowType(type1, tar01, 1)).toBe(T);
                expect(Type.isAllowType(type1, tar02, 1)).toBe(F);
                expect(Type.isAllowType(type1, tar03, 1)).toBe(T);
                expect(Type.isAllowType(type1, tar04, 1)).toBe(T);
                expect(Type.isAllowType(type1, tar05, 1)).toBe(T);   // REVIEW: match 와 치이점
            });
            it('- Type.isAllowType() : union 복합타입 union ', () => {
                var type1 = { aa: { bb: String } }
                 
                var tar01 = { aa: { bb: 'str' } }
                var tar02 = { aa: { bb: 10 } }
                var tar03 = { aa: {} }

                expect(Type.isAllowType(type1, tar01)).toBe(T);
                expect(Type.isAllowType(type1, tar02)).toBe(F);
                expect(Type.isAllowType(type1, tar03)).toBe(F);
            });
            it('- Type.isAllowType() : union 중첩타입 function ', () => {
                var type1 = { aa: String=>Boolean }

                var tar01 = { aa: { $type: 'function', params: [String], return: Boolean } }
                var tar02 = { aa: { $type: 'function', params: [String] } }
                var tar03 = { aa: { $type: 'function', params: [] } }

                expect(Type.isAllowType(type1, tar01)).toBe(T);
                expect(Type.isAllowType(type1, tar02)).toBe(F);
                expect(Type.isAllowType(type1, tar03)).toBe(F);
            });
        });
        describe('function', () => {
            it('- Type.isAllowType() : function ', () => {
                // ** match 와 동일 **
                var type1 = Function
                var type2 = ()=>{}
                var type3 = (String, Number)=>{Object}
                
                var tar01 = { $type: 'function' }
                var tar02 = { $type: 'function', params: [String, Number], return: [Object] }
                var tar03 = { $type: 'function', params: [String, Number], return: Object }
                var tar04 = { $type: 'function', params: [], return: [[Object]] }

                // type1
                expect(Type.isAllowType(type1,tar01)).toBe(T);
                expect(Type.isAllowType(type1,tar02)).toBe(T);
                expect(Type.isAllowType(type1,tar03)).toBe(T);
                expect(Type.isAllowType(type1,tar04)).toBe(T);
                // type2
                expect(Type.isAllowType(type2,tar01)).toBe(T);
                expect(Type.isAllowType(type2,tar02)).toBe(T);
                expect(Type.isAllowType(type2,tar03)).toBe(T);
                expect(Type.isAllowType(type2,tar04)).toBe(T);
                // type3
                expect(Type.isAllowType(type3,tar01)).toBe(F);
                expect(Type.isAllowType(type3,tar02)).toBe(F);
                expect(Type.isAllowType(type3,tar03)).toBe(T);
                expect(Type.isAllowType(type3,tar04)).toBe(F);
            });
            it('- Type.isAllowType() : function 스페셜값 name, func ', () => {
                // ** match 와 동일 **
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
                expect(Type.isAllowType(type1,tar01)).toBe(T);
                expect(Type.isAllowType(type1,tar02)).toBe(T);
                expect(Type.isAllowType(type1,tar03)).toBe(T);
                expect(Type.isAllowType(type1,tar04)).toBe(T);
                expect(Type.isAllowType(type1,tar05)).toBe(T);
                // type2
                expect(Type.isAllowType(type2,tar01)).toBe(F);
                expect(Type.isAllowType(type2,tar02)).toBe(T);
                expect(Type.isAllowType(type2,tar03)).toBe(T); 
                expect(Type.isAllowType(type2,tar04)).toBe(F);
                expect(Type.isAllowType(type2,tar05)).toBe(F);
                // type3
                expect(Type.isAllowType(type3,tar01)).toBe(F); 
                expect(Type.isAllowType(type3,tar02)).toBe(F);
                expect(Type.isAllowType(type3,tar03)).toBe(T);
                expect(Type.isAllowType(type3,tar04)).toBe(T);
                expect(Type.isAllowType(type3,tar05)).toBe(F);
            });
            it('- Type.isAllowType() : function params ', () => {
                // ** match 와 동일 **
                var type1 = (String)=>{}
                var type2 = (Number)=>{}
                var type3 = (String, Number)=>{}

                var tar01 = { $type: 'function', params: [String] }
                var tar02 = { $type: 'function', params: [Number] }
                var tar03 = { $type: 'function', params: [String, Number] }
                var tar04 = { $type: 'function', params: ['str', 10] }
                var tar05 = { $type: 'function', params: [Boolean] }

                // type1 
                expect(Type.isAllowType(type1,tar01)).toBe(T);
                expect(Type.isAllowType(type1,tar02)).toBe(F);
                expect(Type.isAllowType(type1,tar03)).toBe(T);
                expect(Type.isAllowType(type1,tar04)).toBe(T);
                expect(Type.isAllowType(type1,tar05)).toBe(F);
                // type2
                expect(Type.isAllowType(type2,tar01)).toBe(F);
                expect(Type.isAllowType(type2,tar02)).toBe(T);
                expect(Type.isAllowType(type2,tar03)).toBe(F);
                expect(Type.isAllowType(type2,tar04)).toBe(F);
                expect(Type.isAllowType(type2,tar05)).toBe(F);
                // type3
                expect(Type.isAllowType(type3,tar01)).toBe(F);
                expect(Type.isAllowType(type3,tar02)).toBe(F);
                expect(Type.isAllowType(type3,tar03)).toBe(T);
                expect(Type.isAllowType(type3,tar04)).toBe(T);
                expect(Type.isAllowType(type3,tar05)).toBe(F);
            });
            it('- Type.isAllowType() : function params 리터럴 ', () => {
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
                expect(Type.isAllowType(type1,tar11)).toBe(F);
                expect(Type.isAllowType(type1,tar12)).toBe(T);
                expect(Type.isAllowType(type1,tar13)).toBe(F);
                // type2
                expect(Type.isAllowType(type2,tar21)).toBe(F);
                expect(Type.isAllowType(type2,tar22)).toBe(T);
                expect(Type.isAllowType(type2,tar23)).toBe(F);
                // type3
                expect(Type.isAllowType(type3,tar31)).toBe(T);
                expect(Type.isAllowType(type3,tar32)).toBe(T);
                expect(Type.isAllowType(type3,tar33)).toBe(F);

            });
            it('- Type.isAllowType() : function return ', () => {
                var type1 = ()=> {}
                var type2 = ()=> {String}
                var type3 = ()=> {Number}

                var tar01 = { $type: 'function' }
                var tar02 = { $type: 'function', return: String }
                var tar03 = { $type: 'function', return: Number }
                var tar04 = { $type: 'function', return: 'str' }
                var tar05 = { $type: 'function', return: 10 }

                expect(Type.isAllowType(type1,tar01) ).toBe(T);
                expect(Type.isAllowType(type1,tar02) ).toBe(T);
                expect(Type.isAllowType(type1,tar03) ).toBe(T);
                expect(Type.isAllowType(type1,tar04) ).toBe(T);
                expect(Type.isAllowType(type1,tar05) ).toBe(T);

                expect(Type.isAllowType(type2,tar01) ).toBe(F);
                expect(Type.isAllowType(type2,tar02) ).toBe(T);
                expect(Type.isAllowType(type2,tar03) ).toBe(F);
                expect(Type.isAllowType(type2,tar04) ).toBe(T);
                expect(Type.isAllowType(type2,tar05) ).toBe(F);

                expect(Type.isAllowType(type3,tar01) ).toBe(F);
                expect(Type.isAllowType(type3,tar02) ).toBe(F);
                expect(Type.isAllowType(type3,tar03) ).toBe(T);
                expect(Type.isAllowType(type3,tar04) ).toBe(F);
                expect(Type.isAllowType(type3,tar05) ).toBe(T);
            });
            it('- Type.isAllowType() : function return 리터럴 ', () => {
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
                expect(Type.isAllowType(type1,tar11)).toBe(F);
                expect(Type.isAllowType(type1,tar12)).toBe(T);
                expect(Type.isAllowType(type1,tar13)).toBe(F);
                // type2 
                expect(Type.isAllowType(type2,tar21)).toBe(F);
                expect(Type.isAllowType(type2,tar22)).toBe(T);
                expect(Type.isAllowType(type2,tar23)).toBe(F);
                // type3
                expect(Type.isAllowType(type3,tar31)).toBe(T);
                expect(Type.isAllowType(type3,tar32)).toBe(T);
                expect(Type.isAllowType(type3,tar33)).toBe(F);
                expect(Type.isAllowType(type3,tar34)).toBe(F);
            });
            it('- Type.isAllowType() : function 중첩타입 array params  ', () => {
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
                expect(Type.isAllowType(type1,tar11)).toBe(F);
                expect(Type.isAllowType(type1,tar12)).toBe(T);
                expect(Type.isAllowType(type1,tar13)).toBe(F);
                // type2 
                expect(Type.isAllowType(type2,tar21)).toBe(F);
                expect(Type.isAllowType(type2,tar22)).toBe(T);
                expect(Type.isAllowType(type2,tar23)).toBe(T);
                expect(Type.isAllowType(type2,tar24)).toBe(F);
            });
            it('- Type.isAllowType() : function 중첩타입 array return  ', () => {
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
                expect(Type.isAllowType(type1,tar11)).toBe(F);
                expect(Type.isAllowType(type1,tar12)).toBe(T);
                expect(Type.isAllowType(type1,tar13)).toBe(F);
                // type2 
                expect(Type.isAllowType(type2,tar21)).toBe(F);
                expect(Type.isAllowType(type2,tar22)).toBe(T);
                expect(Type.isAllowType(type2,tar23)).toBe(T);
                expect(Type.isAllowType(type2,tar24)).toBe(F);
            });
            it('- Type.isAllowType() : function 중첩타입 choice params  ', () => {
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
                expect(Type.isAllowType(type1,tar11)).toBe(T);
                expect(Type.isAllowType(type1,tar12)).toBe(T);
                expect(Type.isAllowType(type1,tar13)).toBe(F);
                // type2 
                expect(Type.isAllowType(type2,tar21)).toBe(T);
                expect(Type.isAllowType(type2,tar22)).toBe(T);
                expect(Type.isAllowType(type2,tar23)).toBe(T);
                expect(Type.isAllowType(type2,tar24)).toBe(T);
                expect(Type.isAllowType(type2,tar25)).toBe(F);
            });
            it('- Type.isAllowType() : function 중첩타입 choice return  ', () => {
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
                expect(Type.isAllowType(type1,tar11)).toBe(T);
                expect(Type.isAllowType(type1,tar12)).toBe(T);
                expect(Type.isAllowType(type1,tar13)).toBe(F);
                // type2 
                expect(Type.isAllowType(type2,tar21)).toBe(T);
                expect(Type.isAllowType(type2,tar22)).toBe(T);
                expect(Type.isAllowType(type2,tar23)).toBe(T);
                expect(Type.isAllowType(type2,tar24)).toBe(T);
                expect(Type.isAllowType(type2,tar25)).toBe(F);
            });
            it('- Type.isAllowType() : function 중첩타입 class params  ', () => {
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
                expect(Type.isAllowType(type1,tar11)).toBe(T);
                expect(Type.isAllowType(type1,tar12)).toBe(T);
                expect(Type.isAllowType(type1,tar13)).toBe(T);
                expect(Type.isAllowType(type1,tar14)).toBe(F);
                // type2 
                expect(Type.isAllowType(type2,tar21)).toBe(F);
                expect(Type.isAllowType(type2,tar22)).toBe(T);
                expect(Type.isAllowType(type2,tar23)).toBe(T);
                expect(Type.isAllowType(type2,tar24)).toBe(T);
                expect(Type.isAllowType(type2,tar25)).toBe(F);
            });
            it('- Type.isAllowType() : function 중첩타입 class return  ', () => {
                class ClassA { bb = String;}
                class ClassB extends ClassA { cc = Number;}
                class ClassC { bb = String;}

                var type1 = { $type: 'function', return: ClassA }
                var type2 = { $type: 'function', return: ClassB }

                var tar01 = { $type: 'function', return: ClassA }
                var tar02 = { $type: 'function', return: ClassB }
                var tar03 = { $type: 'function', return: ClassC }

                // type1
                expect(Type.isAllowType(type1,tar01)).toBe(T);
                expect(Type.isAllowType(type1,tar02)).toBe(T);
                expect(Type.isAllowType(type1,tar03)).toBe(F);
                // type2 
                expect(Type.isAllowType(type2,tar01)).toBe(F);
                expect(Type.isAllowType(type2,tar02)).toBe(T);
                expect(Type.isAllowType(type2,tar03)).toBe(F);
            });
            it('- Type.isAllowType() : function 중첩타입 union params  ', () => {
                var type1 = { $type: 'function', params: [ {} ] }
                var type2 = { $type: 'function', params: [ {aa: String} ] }
                var type3 = { $type: 'function', params: [ {aa: String, bb: Number} ] }

                var tar01 = { $type: 'function', params: [ {} ] }
                var tar02 = { $type: 'function', params: [ {aa: String} ] }
                var tar03 = { $type: 'function', params: [ {aa: String, bb: Number} ] }
                var tar04 = { $type: 'function', params: [ {aa: Boolean} ]}

                // type1
                expect(Type.isAllowType(type1,tar01)).toBe(T);
                expect(Type.isAllowType(type1,tar02)).toBe(T);
                expect(Type.isAllowType(type1,tar03)).toBe(T);
                expect(Type.isAllowType(type1,tar04)).toBe(T);
                // type2 
                expect(Type.isAllowType(type2,tar01)).toBe(F);
                expect(Type.isAllowType(type2,tar02)).toBe(T);
                expect(Type.isAllowType(type2,tar03)).toBe(T);
                expect(Type.isAllowType(type2,tar04)).toBe(F);
                // type3
                expect(Type.isAllowType(type3,tar01)).toBe(F);
                expect(Type.isAllowType(type3,tar02)).toBe(F);
                expect(Type.isAllowType(type3,tar03)).toBe(T);
                expect(Type.isAllowType(type3,tar04)).toBe(F);
            });
            it('- Type.isAllowType() : function 중첩타입 union return  ', () => {
                var type1 = { $type: 'function', return: {} }
                var type2 = { $type: 'function', return: {aa: String} }
                var type3 = { $type: 'function', return: {aa: String, bb: Number} }

                var tar01 = { $type: 'function', return: {} }
                var tar02 = { $type: 'function', return: {aa: String} }
                var tar03 = { $type: 'function', return: {aa: String, bb: Number} }
                var tar04 = { $type: 'function', return: {aa: Boolean} }

                // type1
                expect(Type.isAllowType(type1,tar01) ).toBe(T);
                expect(Type.isAllowType(type1,tar02) ).toBe(T);
                expect(Type.isAllowType(type1,tar03) ).toBe(T);
                expect(Type.isAllowType(type1,tar04) ).toBe(T);
                // type2 
                expect(Type.isAllowType(type2,tar01) ).toBe(F);
                expect(Type.isAllowType(type2,tar02) ).toBe(T);
                expect(Type.isAllowType(type2,tar03) ).toBe(T);
                expect(Type.isAllowType(type2,tar04) ).toBe(F);
                // type3
                expect(Type.isAllowType(type3,tar01) ).toBe(F);
                expect(Type.isAllowType(type3,tar02) ).toBe(F);
                expect(Type.isAllowType(type3,tar03) ).toBe(T);
                expect(Type.isAllowType(type3,tar04) ).toBe(F);
            });
            it('- Type.isAllowType() : function 중첩타입 function params  ', () => {  
                var type1 = { $type: 'function', params: [ ()=>{} ] }
                var type2 = { $type: 'function', params: [ (String)=>{} ] }
                var type3 = { $type: 'function', params: [ (String, Number)=>{} ] }

                var tar01 = { $type: 'function', params: [ ()=>{} ] }
                var tar02 = { $type: 'function', params: [ (String)=>{} ] }
                var tar03 = { $type: 'function', params: [ (String, Number)=>{} ] }

                // type1
                expect(Type.isAllowType(type1,tar01) ).toBe(T);
                expect(Type.isAllowType(type1,tar02) ).toBe(T);
                expect(Type.isAllowType(type1,tar03) ).toBe(T);
                // type2 
                expect(Type.isAllowType(type2,tar01) ).toBe(F);
                expect(Type.isAllowType(type2,tar02) ).toBe(T);
                expect(Type.isAllowType(type2,tar03) ).toBe(T);
                // type3
                expect(Type.isAllowType(type3,tar01) ).toBe(F);
                expect(Type.isAllowType(type3,tar02) ).toBe(F);
                expect(Type.isAllowType(type3,tar03) ).toBe(T);
            });
            it('- Type.isAllowType() : function 중첩타입 function return  ', () => {
                var type1 = { $type: 'function', return: ()=>{} }
                var type2 = { $type: 'function', return: (String)=>{} }
                var type3 = { $type: 'function', return: (String, Number)=>{} }

                var tar01 = { $type: 'function', return: ()=>{} }
                var tar02 = { $type: 'function', return: (String)=>{} }
                var tar03 = { $type: 'function', return: (String, Number)=>{} }

                // type1
                expect(Type.isAllowType(type1,tar01) ).toBe(T);
                expect(Type.isAllowType(type1,tar02) ).toBe(T);
                expect(Type.isAllowType(type1,tar03) ).toBe(T);
                // type2 
                expect(Type.isAllowType(type2,tar01) ).toBe(F);
                expect(Type.isAllowType(type2,tar02) ).toBe(T);
                expect(Type.isAllowType(type2,tar03) ).toBe(T);
                // type3
                expect(Type.isAllowType(type3,tar01) ).toBe(F);
                expect(Type.isAllowType(type3,tar02) ).toBe(F);
                expect(Type.isAllowType(type3,tar03) ).toBe(T);
            });
        });
    });
});

describe('Type.allowType(type, target): bool  <타입 매치 예외> ', () => {
    it('- Type.allowType() : S0739, 처리할 타입이 없습니다.  ', () => { 
        var type1  = { $type: 'err' }

        // expect(()=> Type.allowType(type1, null)).toThrow('S0739')
    });

    it('- Type.allowType(a, b) : 원시 자료형 : 예외 ', () => { 
        // null
        expect(()=> Type.allowType(null,      undefined   )).toThrow('EL01203')
        // Number
        expect(()=> Type.allowType(Number,    String      )).toThrow('EL01203')
        expect(()=> Type.allowType(Number,    true        )).toThrow('EL01203')
        expect(()=> Type.allowType(NaN,       Number      )).toThrow('EL01202')
        expect(()=> Type.allowType(NaN,       NaN         )).toThrow('EL01202')
        expect(()=> Type.allowType(NaN,       10          )).toThrow('EL01202')
        expect(()=> Type.allowType(10,        20          )).toThrow('EL01202')
        expect(()=> Type.allowType(10,        Number      )).toThrow('EL01202')
        expect(()=> Type.allowType(10,        NaN         )).toThrow('EL01202') 
        // String
        expect(()=> Type.allowType(String,    10          )).toThrow('EL01203')
        expect(()=> Type.allowType(String,    Boolean     )).toThrow('EL01203')
        expect(()=> Type.allowType('str',     ''          )).toThrow('EL01202')
        expect(()=> Type.allowType('str',     String      )).toThrow('EL01202')
        // Boolean
        expect(()=> Type.allowType(Boolean,   'str'       )).toThrow('EL01203')
        expect(()=> Type.allowType(true,      F       )).toThrow('EL01202')
        expect(()=> Type.allowType(true,      Boolean     )).toThrow('EL01202')
        // undefined
        expect(()=> Type.allowType(undefined, null        )).toThrow('EL01203')
        // null
        expect(()=> Type.allowType(null,      undefined   )).toThrow('EL01203')
        expect(()=> Type.allowType(null,      {}          )).toThrow('EL01203')
        expect(()=> Type.allowType(null,      Object      )).toThrow('EL01203')
        // Symbol
        expect(()=> Type.allowType(Symbol,    null        )).toThrow('EL01203')
        expect(()=> Type.allowType(Symbol,    Object      )).toThrow('EL01203')
        expect(()=> Type.allowType(Symbol(),  null        )).toThrow('EL01203')
        expect(()=> Type.allowType(Symbol(),  Object      )).toThrow('EL01203')
    });
    it('- Type.allowType(a, b) : array choice : 예외', () => {        
        // all 
        // expect(()=> Type.allowType(Array,                     ['_non_']                  )).toThrow('ES069')
        // any
        // expect(()=> Type.allowType(['_any_'],                 []                         )).toThrow('ES0727')
        expect(()=> Type.allowType(['_any_'],                 undefined                  )).toThrow('EL01211')
        expect(()=> Type.allowType(['_any_'],                 ['_seq_']                  )).toThrow('EL01201')
        expect(()=> Type.allowType(['_any_'],                 ['_opt_']                  )).toThrow('EL01201')
        // expect(()=> Type.allowType(['_any_'],                 ['_non_']                  )).toThrow('ES0727')
        // seq
        expect(()=> Type.allowType(['_seq_'],                 ['_seq_']                  )).toThrow('EL01201')
        expect(()=> Type.allowType(['_seq_'],                 ['_seq_', Boolean]         )).toThrow('EL01201')
        expect(()=> Type.allowType(['_seq_'],                 []                         )).toThrow('EL01201')
        expect(()=> Type.allowType(['_seq_', Number],         ['_seq_']                  )).toThrow('EL01201')
        expect(()=> Type.allowType(['_seq_', Number],         ['_seq_', Boolean]         )).toThrow('EL01203')
        expect(()=> Type.allowType(['_seq_', Number],         [Number]                   )).toThrow('EL01213')
        expect(()=> Type.allowType(['_seq_', Number, String], ['_seq_', Number]          )).toThrow('EL01214')
        expect(()=> Type.allowType(['_seq_', Number, String], [Number]                   )).toThrow('EL01213')
        // opt
        expect(()=> Type.allowType(['_opt_'],                 ['_opt_']                  )).toThrow('EL01201')
        expect(()=> Type.allowType(['_opt_'],                 ['_opt_', String]          )).toThrow('EL01201')
        expect(()=> Type.allowType(['_opt_'],                 ['_any_']                  )).toThrow('EL01201')
        expect(()=> Type.allowType(['_opt_'],                 []                         )).toThrow('EL01201') 
        expect(()=> Type.allowType(['_opt_'],                 [String]                   )).toThrow('EL01201')
        expect(()=> Type.allowType(['_opt_', String],         ['_opt_', Number, String]  )).toThrow('EL01219')
        expect(()=> Type.allowType(['_opt_', String],         ['_opt_', Number]          )).toThrow('EL01219')
        expect(()=> Type.allowType(['_opt_', String],         ['_opt_']                  )).toThrow('EL01201')
        expect(()=> Type.allowType(['_opt_', String],         ['_any_']                  )).toThrow('EL01217')
        expect(()=> Type.allowType(['_opt_', String],         [Number]                   )).toThrow('EL01219')
        expect(()=> Type.allowType(['_opt_', String],         [undefined]                )).toThrow('EL01219')   // length > 0 이면 true
        expect(()=> Type.allowType(['_opt_', String],         ['_any_']                  )).toThrow('EL01217')
        expect(()=> Type.allowType(['_opt_', String],         []                         )).toThrow('EL01217')
        expect(()=> Type.allowType(['_opt_', String, Number], [Number, Boolean]          )).toThrow('EL01219')
        expect(()=> Type.allowType(['_opt_', String, Number], [Number, String, Boolean]  )).toThrow('EL01219')
        expect(()=> Type.allowType(['_opt_', String, Number], ['_opt_']                  )).toThrow('EL01201')
        expect(()=> Type.allowType(['_opt_', String, Number], ['_any_']                  )).toThrow('EL01217')
        expect(()=> Type.allowType(['_opt_', String, Number], [undefined]                )).toThrow('EL01219')
        expect(()=> Type.allowType(['_opt_', String, Number], ['_opt_', Number, String, Boolean])).toThrow('EL01219')
        // val
        expect(()=> Type.allowType(['_req_', String, Number],          ['_req_', String, Boolean, Number]  )).toThrow('EL01219')
        expect(()=> Type.allowType(['_req_', String, Number],          ['_opt_']                  )).toThrow('EL01201')
        expect(()=> Type.allowType(['_req_', String, Number],          ['_any_']                  )).toThrow('EL01216')
        // non 
        // expect(()=> Type.allowType(['_non_'],                 ['_any_']                  )).toThrow('ES0728')
        // etc. 
        // expect(()=> Type.allowType(['_etc_'],                 [null]                     )).toThrow('ES0735')
    }); 
    it('- Type.allowType(a, b) : choice : 예외', () => {     
        expect(()=> Type.allowType([['_any_']],                  undefined             )).toThrow('EL01222')
        expect(()=> Type.allowType([['_any_']],                                        )).toThrow('EL01222')
        // expect(()=> Type.allowType([['_seq_']],                  [['_seq_']]           )).toThrow('ES0729')
        // expect(()=> Type.allowType([['_seq_']],                  [['_seq_', String]]   )).toThrow('ES0729') 
        // expect(()=> Type.allowType([['_seq_']],                  [['_seq_', Number]]   )).toThrow('ES0729')
        // expect(()=> Type.allowType([['_seq_', Number]],          [['_seq_']]                   )).toThrow('ES0729')
        // expect(()=> Type.allowType([['_seq_', Number]],          [['_seq_', Boolean]]          )).toThrow('ES0733')
        // expect(()=> Type.allowType([['_seq_', Number]],          [[Number]]                    )).toThrow('ES0728')
        // expect(()=> Type.allowType([['_seq_', Number, String]],  [['_seq_', Number]]           )).toThrow('ES0732')
        // expect(()=> Type.allowType([['_seq_', Number, String]],  [[Number]]                    )).toThrow('ES0728')
        expect(()=> Type.allowType([['_opt_']],                  [['_opt_']]                   )).toThrow('EL01201')
        expect(()=> Type.allowType([['_opt_']],                  [['_opt_', String]]           )).toThrow('EL01201')
        expect(()=> Type.allowType([['_opt_']],                  [['_any_']]                   )).toThrow('EL01201')
        expect(()=> Type.allowType([['_opt_']],                  undefined                     )).toThrow('EL01201')
        expect(()=> Type.allowType([['_opt_']],                  [[String]]                    )).toThrow('EL01201')
        expect(()=> Type.allowType([['_opt_', String]],          [['_opt_', Number, String]]   )).toThrow('EL0122F')
        expect(()=> Type.allowType([['_opt_', String]],          [['_opt_', Number]]           )).toThrow('EL0122F')
        expect(()=> Type.allowType([['_opt_', String]],          [['_opt_']]                   )).toThrow('EL01201')
        expect(()=> Type.allowType([['_opt_', String]],          [['_any_']]                   )).toThrow('EL01227')
        expect(()=> Type.allowType([['_opt_', String]],          [[Number]]                    )).toThrow('EL0122F')
        expect(()=> Type.allowType([['_opt_', String, Number]],  [[String, Boolean]]           )).toThrow('EL0122F')
        expect(()=> Type.allowType([['_opt_', String, Number]],  [[Number, String, Boolean]]   )).toThrow('EL0122F')
        expect(()=> Type.allowType([['_opt_', String, Number]],  [['_opt_']]                   )).toThrow('EL01201')
        expect(()=> Type.allowType([['_opt_', String, Number]],  [['_any_']]                   )).toThrow('EL01227')
        expect(()=> Type.allowType([['_opt_', String, Number]],  [['_opt_', String, Boolean, Number]])).toThrow('EL0122F')
        expect(()=> Type.allowType([['_req_', String, Number]],           [['_req_', String, Boolean, Number]]   )).toThrow('EL0122F')
        expect(()=> Type.allowType([['_req_', String, Number]],           [['_opt_']]                   )).toThrow('EL01201')
        expect(()=> Type.allowType([['_req_', String, Number]],           [['_any_']]                   )).toThrow('EL01226')
    });
    it('- Type.isAllowType(a, b) : function ', () => {
        var type1   = function(String, Number){Boolean}
        var type2   = function(){}
        type2._TYPE = {params: [String, Number], return: Boolean}
        var tar1    = function(){}
        tar1._TYPE  = {params: [String, Number], return: Boolean}

        expect(Type.isAllowType(Function, Function    )).toBe(T);
        expect(Type.isAllowType(type1, {}             )).toBe(F);
        expect(Type.isAllowType(type1, tar1           )).toBe(T);
        expect(Type.isAllowType(type2, tar1           )).toBe(T);
        // 예외 : 오류코드
        expect(()=> Type.allowType(type1, {}          )).toThrow('EL01251')
    }); 
    it('- Type.isAllowType(a, b) : object ', () => {   
        var ClassA = function(){};
        var ClassB = function(){this.aa = 1};
        var date1 = new Date('2023-01-01');
        var date2 = new Date('2023-01-01');
        var date3 = new Date('2023-01-02');

        // 예외 : 오류코드
        // expect(()=> Type.allowType(/reg/,     /reg2/          )).toThrow('ES0723')
        // expect(()=> Type.allowType({},        new ClassB()    )).toThrow('ES0713')
        expect(()=> Type.allowType({},        true            )).toThrow('EL01241')
    });
    it('- Type.isAllowType(a, b) : class ', () => {
        var ClassA = function(){this.a = 1}
        var ClassB = function(){this.a = 10}
        var ClassC = function(){this.b = 10}
        var ClassD = function(){this.b = 10}
        var ClassE = function(){throw new Error('강제예외')}

        expect(Type.isAllowType(ClassA,       ClassA)).toBe(T);
        expect(Type.isAllowType(ClassA,       ClassB)).toBe(F);
        expect(Type.isAllowType(ClassA,       ClassC)).toBe(F);
        expect(Type.isAllowType(ClassC,       ClassD, 0)).toBe(F);
        expect(Type.isAllowType(ClassC,       ClassD, 1)).toBe(T );
        expect(Type.isAllowType(String,       String)).toBe(T );
        expect(Type.isAllowType(ClassA,       ClassE)).toBe(F );
        // 예외 : 오류코드
        expect(()=> Type.allowType(ClassA,       ClassB)).toThrow('EL01232')
        expect(()=> Type.allowType(ClassA,       ClassC)).toThrow('EL01232')
        expect(()=> Type.allowType(ClassA,       ClassE)).toThrow('EL01232')
    }); 
    it('- Type.isAllowType(a, b) : union (기본) ', () => {
        var type1      = {str: String, num: Number};

        expect(Type.isAllowType(type1,    {str: String, num: Number}  )).toBe(true);
        expect(Type.isAllowType(type1,    {str: '', num: 0}           )).toBe(true);
        expect(Type.isAllowType(type1,    {str: ''}                   )).toBe(F);
        // 예외 : 오류코드
        expect(()=> Type.allowType(type1,    {str: ''}                )).toThrow('EL01242')
    });
    it('- Type.isAllowType(a, b) : union (choice) ', () => {        
        var type1   = {str: [[String, Number]], bool: [['_any_']], num: [['_opt_', Number]]}; 

        expect(Type.isAllowType(type1, {str: String, bool: null, num: Number}           )).toBe(T);
        expect(Type.isAllowType(type1, {str: '', bool: true, num: [['_opt_', Number]]}  )).toBe(T);
        expect(Type.isAllowType(type1, {str: '', bool: null, num: [['_opt_', String]]}  )).toBe(F);
        expect(Type.isAllowType(type1, {str: String, bool: F, num: String}          )).toBe(F);
        expect(Type.isAllowType(type1, {str: String}                                    )).toBe(F);
        // 예외 : 오류코드
        expect(()=> Type.allowType(type1, {str: '', bool: null, num: [['_opt_', String]]}  )).toThrow('EL0122F')
        expect(()=> Type.allowType(type1, {str: String, bool: F, num: String}          )).toThrow('EL0122F')
        expect(()=> Type.allowType(type1, {str: String}                                    )).toThrow('EL01242')
    });
});