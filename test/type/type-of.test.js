//==============================================================
// gobal defined

import { jest } from '@jest/globals';
import { Type } from '../../src/type';

const T = true;
const F = false;
//==============================================================
// test
describe('Type.typeOf(target): str <타입 얻기> ', () => {
    it('- Type.typeOf() : 예외 ', () => {
        var type1 = { $type: 'Not_Type' }
        expect(()=> Type.typeOf(type1)).toThrow('EL01304');
    });
    describe('단일타입 ', () => {
        it('- Type.typeOf() : undefined ', () => {
            var type0 = { $type: 'undefined' }
            var type1
            var type2 = undefined

            expect(Type.typeOf(type0)).toBe('undefined');
            expect(Type.typeOf(type1)).toBe('undefined');
            expect(Type.typeOf(type2)).toBe('undefined');
        });
        it('- Type.typeOf() : null ', () => {
            var type0 = { $type: 'null' }
            var type1 = null
        
            expect(Type.typeOf(type0)).toBe('null')
            expect(Type.typeOf(type1)).toBe('null')
        });
        it('- Type.typeOf() : string [리터럴] ', () => {
            var type0 = { $type: 'string' }
            var type1 = String
            var type2 = 'str'  // 리터럴
            
            expect(Type.typeOf(type0)).toBe('string');
            expect(Type.typeOf(type1)).toBe('string');
            expect(Type.typeOf(type2)).toBe('string');
        });
        it('- Type.typeOf() : number [리터럴] ', () => {
            var type0 = { $type: 'number' }
            var type1 = Number
            var type2 = 2      // 리터럴
            var type3 = NaN    // 리터럴

            expect(Type.typeOf(type0)).toBe('number');
            expect(Type.typeOf(type1)).toBe('number');
            expect(Type.typeOf(type2)).toBe('number');
            expect(Type.typeOf(type3)).toBe('number');
        });
        it('- Type.typeOf() : boolean [리터럴] ', () => {
            var type0 = { $type: 'boolean' }
            var type1 = Boolean
            var type2 = true      // 리터럴
            var type3 = false     // 리터럴

            expect(Type.typeOf(type0)).toBe('boolean');
            expect(Type.typeOf(type1)).toBe('boolean');
            expect(Type.typeOf(type2)).toBe('boolean');
            expect(Type.typeOf(type3)).toBe('boolean');
        });
        it('- Type.typeOf() : regexp [리터럴] ', () => {
            var type0 = { $type: 'regexp' }
            var type1 = RegExp
            var type2 = /reg/

            expect(Type.typeOf(type0)).toBe('regexp');
            expect(Type.typeOf(type1)).toBe('regexp');
            expect(Type.typeOf(type2)).toBe('regexp');
        });
        it('- Type.typeOf() : object ', () => {
            var type0 = { $type: 'object' }
            var type1 = new function User() {}
            var type2 = new Date()
            var type3 = {}

            expect(Type.typeOf(type0)).toBe('object');
            expect(Type.typeOf(type1)).toBe('union');
            expect(Type.typeOf(type2)).toBe('object');
            expect(Type.typeOf(type3)).toBe('union');
        });
        it('- Type.typeOf() : bigint [리터럴] (ES6+) ', () => {
            var type0 = { $type: 'bigint' }
            var type1 = BigInt
            var type2 = BigInt(100)    // 리터럴
            var type3 = 100n           // 리터럴

            expect(Type.typeOf(type0)).toBe('bigint');
            expect(Type.typeOf(type1)).toBe('bigint');
            expect(Type.typeOf(type2)).toBe('bigint');
            expect(Type.typeOf(type3)).toBe('bigint');
        });
        it('- Type.typeOf() : symbol (ES6+) ', () => {
            var type0 = { $type: 'symbol' }
            var type1 = Symbol
            var type2 = Symbol('a')    // 리터럴로 취급 안함
            
            expect(Type.typeOf(type0)).toBe('symbol');
            expect(Type.typeOf(type1)).toBe('symbol');
            expect(Type.typeOf(type2)).toBe('symbol');
        });
    });
    describe('복합타입 ', () => {
        
        it('- Type.typeOf() : array ', () => {
            var type0 = { $type: 'array' }
            var type1 = []
            var type2 = Array
            var type3 = [String]
            var type4 = ['_req_', String]
            var type5 = ['_seq_', String]
            var type6 = ['_any_'] 
            var type7 = ['_all_'] 

            expect(Type.typeOf(type0)).toBe('array');
            expect(Type.typeOf(type1)).toBe('array');
            expect(Type.typeOf(type2)).toBe('array');
            expect(Type.typeOf(type3)).toBe('array');
            expect(Type.typeOf(type4)).toBe('array');
            expect(Type.typeOf(type5)).toBe('array');
            expect(Type.typeOf(type6)).toBe('array');
            expect(Type.typeOf(type7)).toBe('array');
        });
        it('- Type.typeOf() : choice ', () => {
            var type00 = { $type: 'choice', kind: '_OPT_' }
            var type01 = [[String]]
            var type02 = [[String, Number]]
            var type03 = [['_opt_', String]]
            var type04 = [['_opt_', String, Number]]
            var type05 = [['_req_', String]]
            var type06 = [['_all_']]
            var type07 = [['_any_']]
            var type08 = [[]];   // any
            var type09 = [['_non_']]
            var type10 = [['_eum_', 'blue', 'red']]
            var type11 = [['_def_', 'blue', String]] 

            expect(Type.typeOf(type00)).toBe('choice');
            expect(Type.typeOf(type01)).toBe('choice');
            expect(Type.typeOf(type02)).toBe('choice');
            expect(Type.typeOf(type03)).toBe('choice');
            expect(Type.typeOf(type04)).toBe('choice');
            expect(Type.typeOf(type05)).toBe('choice');
            expect(Type.typeOf(type06)).toBe('choice');
            expect(Type.typeOf(type07)).toBe('choice');
            expect(Type.typeOf(type08)).toBe('choice');
            expect(Type.typeOf(type09)).toBe('choice');
            expect(Type.typeOf(type10)).toBe('choice');
            expect(Type.typeOf(type11)).toBe('choice');
        });
        it('- Type.typeOf() : class ', () => {
            var type0 = { $type: 'class' }
            var type1 = function Corp() {this.nm = 1}
            var type2 = function User() {}
            var type3 = Date
            var type4 = Promise
            var type5 = Error

            expect(Type.typeOf(type0)).toBe('class');
            expect(Type.typeOf(type1)).toBe('class');
            expect(Type.typeOf(type2)).toBe('class');
            expect(Type.typeOf(type3)).toBe('class');
            expect(Type.typeOf(type4)).toBe('class');
            expect(Type.typeOf(type5)).toBe('class');
        });
        
        it('- Type.typeOf() : union ', () => {
            var type0 = { $type: 'union' }
            var type1 = new function Corp() { this.nm = 1 }
            var type2 = { fill:true }
            var type3 = JSON
            var type4 = Math
            var type5 = {}

            expect(Type.typeOf(type0)).toBe('union');
            expect(Type.typeOf(type1)).toBe('union');
            expect(Type.typeOf(type2)).toBe('union');
            expect(Type.typeOf(type3)).toBe('union');
            expect(Type.typeOf(type4)).toBe('union');
            expect(Type.typeOf(type5)).toBe('union');
        });
        it('- Type.typeOf() : function ', () => {
            var type0 = { $type: 'function' }
            var type1 = function(){}
            var type2 = ()=>{}

            expect(Type.typeOf(type0)).toBe('function');
            expect(Type.typeOf(type1)).toBe('function');
            expect(Type.typeOf(type2)).toBe('function');
        });
    });
});