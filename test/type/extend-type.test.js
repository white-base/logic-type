//==============================================================
// gobal defined

import { jest } from '@jest/globals';
import { Type } from '../../src/type';

const T = true;
const F = false;
//==============================================================
// test
describe('Type.extendType(target) <타입객체 얻기> ', () => {
    describe('리터럴타입 ', () => {
        it('- Type.extendType() : string [리터럴] ', () => {
            var type1 = String
            var type2 = 'str'  // 리터럴
            var type3 = { $type: 'string', default: 'str' }
            
            // type1
            expect(Type.extendType(type1).$type  ).toBe('string');
            expect(Type.extendType(type1).default).toBe(null);
            // type2
            expect(Type.extendType(type2).$type  ).toBe('string');
            expect(Type.extendType(type2).default).toBe(type2);
            // type3
            expect(Type.extendType(type3).$type  ).toBe('string');
            expect(Type.extendType(type3).default).toBe(type2);
        });
        it('- Type.extendType() : number [리터럴] ', () => {
            var type1 = Number
            var type2 = 2      // 리터럴
            var type3 = NaN    // 리터럴

            // type1
            expect(Type.extendType(type1).$type   ).toBe('number');
            expect(Type.extendType(type1).default).toBe(null);
            // type2
            expect(Type.extendType(type2).$type   ).toBe('number');
            expect(Type.extendType(type2).default).toBe(type2);
            // type3                
            expect(Type.extendType(type3).$type   ).toBe('number');
            expect(Type.extendType(type3).default).toBe(type3);
        });
        it('- Type.extendType() : boolean [리터럴] ', () => {
            var type1 = Boolean
            var type2 = true      // 리터럴
            var type3 = false     // 리터럴

            // type1
            expect(Type.extendType(type1).$type   ).toBe('boolean');
            expect(Type.extendType(type1).default).toBe(null);
            // type2
            expect(Type.extendType(type2).$type   ).toBe('boolean');
            expect(Type.extendType(type2).default).toBe(type2);
            // type3                
            expect(Type.extendType(type3).$type   ).toBe('boolean');
            expect(Type.extendType(type3).default).toBe(type3);
        });
        it('- Type.extendType() : bigint [리터럴] (ES6+) ', () => {
            var type1 = BigInt
            var type2 = BigInt(100)    // 리터럴
            var type3 = 100n;          // 리터럴

            // type1
            expect(Type.extendType(type1).$type   ).toBe('bigint');
            expect(Type.extendType(type1).default).toBe(null);
            // type2
            expect(Type.extendType(type2).$type   ).toBe('bigint');
            expect(Type.extendType(type2).default).toBe(type2);
            // type3                
            expect(Type.extendType(type3).$type   ).toBe('bigint');
            expect(Type.extendType(type3).default).toBe(type3);
        });
        it('- Type.extendType() : regexp [리터럴] ', () => {
            var type1 = RegExp
            var type2 = /reg/

            // type1
            expect(Type.extendType(type1).$type  ).toBe('regexp');
            expect(Type.extendType(type1).default).toEqual(null);
            // type2
            expect(Type.extendType(type2).$type  ).toBe('regexp');
            expect(Type.extendType(type2).default).toEqual(/reg/);
        });
    });
    describe('복합타입 ', () => {
        it('- Type.extendType() : array ', () => {
            var type1 = [];
            var type2 = Array;
            var type3 = [String]
            var type4 = ['_req_', String]
            var type5 = ['_seq_', String]
            var type6 = ['_any_']
            var type7 = ['_all_'] 
            var type8 = ['_opt_', String] 

            // type1
            expect(Type.extendType(type1).$type).toBe('array');
            expect(Type.extendType(type1).kind).toBe('_ANY_');
            // type2                
            expect(Type.extendType(type2).$type).toBe('array');
            expect(Type.extendType(type2).kind).toBe('_ALL_');
            // type3                
            expect(Type.extendType(type3).$type).toBe('array');
            expect(Type.extendType(type3).kind).toBe('_OPT_');
            expect(Type.extendType(type3).list).toEqual([String]);
            // type4                
            expect(Type.extendType(type4).$type).toBe('array');
            expect(Type.extendType(type4).kind).toBe('_REQ_');
            expect(Type.extendType(type4).list).toEqual([String]);
            // type5                
            expect(Type.extendType(type5).$type).toBe('array');
            expect(Type.extendType(type5).kind).toBe('_SEQ_');
            expect(Type.extendType(type5).list).toEqual([String]);
            // type6                
            expect(Type.extendType(type6).$type).toBe('array');
            expect(Type.extendType(type6).kind).toBe('_ANY_');
            // type7                
            expect(Type.extendType(type7).$type).toBe('array');
            expect(Type.extendType(type7).kind).toBe('_ALL_');
            // type8
            expect(Type.extendType(type8).$type).toBe('array');
            expect(Type.extendType(type8).kind).toBe('_OPT_');
            expect(Type.extendType(type8).list).toEqual([String]);
        });
        it('- Type.extendType() : choice ', () => {
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
            var type11 = [['_def_', 'blue', 'red']]

            // type1
            expect(Type.extendType(type01).$type ).toBe('choice');
            expect(Type.extendType(type01).kind  ).toBe('_OPT_');
            expect(Type.extendType(type01).list  ).toEqual([String]);
            // type2
            expect(Type.extendType(type02).$type ).toBe('choice');
            expect(Type.extendType(type02).kind  ).toBe('_OPT_');
            expect(Type.extendType(type02).list  ).toEqual([String, Number]);
            // type3
            expect(Type.extendType(type03).$type ).toBe('choice');
            expect(Type.extendType(type03).kind  ).toBe('_OPT_');
            expect(Type.extendType(type03).list  ).toEqual([String]);
            // type4
            expect(Type.extendType(type04).$type ).toBe('choice');
            expect(Type.extendType(type04).kind  ).toBe('_OPT_');
            expect(Type.extendType(type04).list  ).toEqual([String, Number]);
            // type5
            expect(Type.extendType(type05).$type ).toBe('choice');
            expect(Type.extendType(type05).kind  ).toBe('_REQ_');
            expect(Type.extendType(type05).list  ).toEqual([String]);
            // type6
            expect(Type.extendType(type06).$type ).toBe('choice');
            expect(Type.extendType(type06).kind  ).toBe('_ALL_');
            // type7
            expect(Type.extendType(type07).$type ).toBe('choice');
            expect(Type.extendType(type07).kind  ).toBe('_ANY_');
            // type8
            expect(Type.extendType(type08).$type ).toBe('choice');
            expect(Type.extendType(type08).kind  ).toBe('_ANY_');
            // type9
            expect(Type.extendType(type09).$type ).toBe('choice');
            expect(Type.extendType(type09).kind  ).toBe('_NON_');
            // type10
            expect(Type.extendType(type10).$type ).toBe('choice');
            expect(Type.extendType(type10).kind  ).toBe('_EUM_');
            expect(Type.extendType(type10).list  ).toEqual(['blue', 'red']);
            // type11
            expect(Type.extendType(type11).$type ).toBe('choice');
            expect(Type.extendType(type11).kind  ).toBe('_DEF_');
            expect(Type.extendType(type11).list  ).toEqual(['blue', 'red']);
        });
        it('- Type.extendType() : class ', () => {
            var type1 = function Class1(){ this.age = 1; this.fun = (a,b)=>{} }
            var type2 = Date
            function IClassA(){}
            IClassA._KIND = 'interface'
            var type3 = IClassA;

            // type1
            expect(Type.extendType(type1).$type      ).toBe('class');
            expect(Type.extendType(type1).ref        ).toBe(type1);
            // type2
            expect(Type.extendType(type2).$type      ).toBe('class');
            expect(Type.extendType(type2).ref        ).toBe(type2);
            // type3
            expect(Type.extendType(type3).$type      ).toBe('class');
            expect(Type.extendType(type3).ref        ).toBe(type3);
        });
        it('- Type.extendType() : union ', () => {
            var type1 = { str: 'blue', num: Number }
            var type2 = { arr: [String], sub: {bool: true} }
            var type3 = {}

            // type1
            expect(Type.extendType(type1).$type      ).toBe('union');
            expect(Type.extendType(type1).ref        ).toBe(type1);
            // type2
            expect(Type.extendType(type2).$type      ).toBe('union');
            expect(Type.extendType(type2).ref        ).toBe(type2);
            // type3
            expect(Type.extendType(type3).$type      ).toBe('union');
            expect(Type.extendType(type3).ref        ).toBe(type3);
        });
        it('- Type.extendType() : function ', () => {
            var type01 = Function; 
            // 표현식
            var type02 = function(){}
            var type02 = function( ) {   } // 공백
            var type03 = function(String, Number){Object}
            var type04 = function(){[Object]}
            var type05 = function(aa, bb){cc}
            
            // 표현식 (화살표)
            var type06 = ()=>{}
            var type07 = ([String])=>{return Number}
            var type08 = (String, Boolean)=>{Number}
            var type09 = ()=>String
            var type10 = String=>Number
            var type11 = String=>{Number}
            var type12 = String=>{return Number /** aaa */}
            // 선언식
            var type13 = function func (aa, bb){cc}
            var type14 = function func(String){Number}
            var type15 = function func(String){return Number}
            // 스페설 
            var type16 = { $type: 'function', ref: function funcA(){}, 
                params: [String], return: Number 
            }
            // 정적설정
            function funcA(){}
            funcA._KIND = 'function'
            funcA._TYPE = { params: [String], return: Number }
            var type17 = funcA


            // type1
            expect(Type.extendType(type01).$type  ).toBe('function');
            expect(Type.extendType(type01).params ).toEqual([]);
            expect(Type.extendType(type01).return ).toEqual(undefined);
            // type2
            expect(Type.extendType(type02).$type  ).toBe('function');
            expect(Type.extendType(type02).params ).toEqual([]);
            expect(Type.extendType(type02).return ).toEqual(undefined);
            // type3
            expect(Type.extendType(type03).$type  ).toBe('function');
            expect(Type.extendType(type03).params ).toEqual([String, Number]);
            expect(Type.extendType(type03).return ).toEqual(Object);
            // type4
            expect(Type.extendType(type04).$type  ).toBe('function');
            expect(Type.extendType(type04).params ).toEqual([]);
            expect(Type.extendType(type04).return ).toEqual([Object]);
            // type5
            expect(Type.extendType(type05).$type  ).toBe('function');
            expect(Type.extendType(type05).params ).toEqual([]);
            expect(Type.extendType(type05).return ).toEqual(undefined);
            // type6
            expect(Type.extendType(type06).$type  ).toBe('function');
            expect(Type.extendType(type06).params ).toEqual([]);
            expect(Type.extendType(type06).return ).toEqual(undefined);
            // type7
            expect(Type.extendType(type07).$type  ).toBe('function');
            expect(Type.extendType(type07).params ).toEqual([[String]]);
            expect(Type.extendType(type07).return ).toEqual(Number);
            // type8
            expect(Type.extendType(type08).$type  ).toBe('function');
            expect(Type.extendType(type08).params ).toEqual([String, Boolean]);
            expect(Type.extendType(type08).return ).toEqual(Number);
            // type9
            expect(Type.extendType(type09).$type  ).toBe('function');
            expect(Type.extendType(type09).params ).toEqual([]);
            expect(Type.extendType(type09).return ).toEqual(String);
            // type10
            expect(Type.extendType(type10).$type  ).toBe('function');
            expect(Type.extendType(type10).params ).toEqual([String]);
            expect(Type.extendType(type10).return ).toEqual(Number);
            // type11
            expect(Type.extendType(type11).$type  ).toBe('function');
            expect(Type.extendType(type11).params ).toEqual([String]);
            expect(Type.extendType(type11).return ).toEqual(Number);
            // type12
            expect(Type.extendType(type12).$type  ).toBe('function');
            expect(Type.extendType(type12).params ).toEqual([String]);
            expect(Type.extendType(type12).return ).toEqual(Number);
            // type13
            expect(Type.extendType(type13).$type  ).toBe('function');
            expect(Type.extendType(type13).params ).toEqual([]);
            expect(Type.extendType(type13).return ).toEqual(undefined);
            // type14
            expect(Type.extendType(type14).$type  ).toBe('function');
            expect(Type.extendType(type14).params ).toEqual([String]);
            expect(Type.extendType(type14).return ).toEqual(Number);
            // type15
            expect(Type.extendType(type15).$type  ).toBe('function');
            expect(Type.extendType(type15).params ).toEqual([String]);
            expect(Type.extendType(type15).return ).toEqual(Number);
            // type16
            expect(Type.extendType(type16).$type  ).toBe('function');
            expect(Type.extendType(type16).params ).toEqual([String]);
            expect(Type.extendType(type16).return ).toEqual(Number);
            // type17
            expect(Type.extendType(type17).$type  ).toBe('function');
            expect(Type.extendType(type17).params ).toEqual([String]);
            expect(Type.extendType(type17).return ).toEqual(Number);
        });
    });
});