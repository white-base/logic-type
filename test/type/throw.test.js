//==============================================================
// gobal defined

import { jest } from '@jest/globals';
import { Type } from '../../src/type';

const T = true;
const F = false;
//==============================================================
// test
describe('예외 코드 ', () => {
    describe(' match ', () => {
        it('- [EL01101] 기본', () => {
            var type1 = ['_SEQ_'];
            var type2 = ['_OPT_'];
            var type3 = ['_REQ_'];
            var type4 = [['_EUM_']];
            var type5 = [['_DEF_']];
            var tar00 = null;
            var thr01 = 'extType: array(_SEQ_)[]'
            var thr02 = 'extType: array(_OPT_)[]'
            var thr03 = 'extType: array(_REQ_)[]'
            var thr04 = 'extType: choice(_EUM_)[]'
            var thr05 = 'extType: choice(_DEF_)[]'
           
            expect(()=> Type.matchType(type1, tar00)).toThrow(thr01)
            expect(()=> Type.matchType(type2, tar00)).toThrow(thr02)
            expect(()=> Type.matchType(type3, tar00)).toThrow(thr03)
            expect(()=> Type.matchType(type4, tar00)).toThrow(thr04)
            expect(()=> Type.matchType(type5, tar00)).toThrow(thr05)
        });
        // match primitve
        it('- [EL01102] 기본', () => {
            var type1 = null;
            var type2 = undefined;
            var type3 = 'str';
            var type4 = 10;
            var type5 = true;
            var type6 = 10n;
            var type7 = Symbol;
            var type8 = /reg/;
            var type9 = new Date();
            var tar01 = [['_NON_']];
            var thr01 = '\'null\''
            var thr02 = '\'undefined\''
            var thr03 = '\'string\''
            var thr04 = '\'number\''
            var thr05 = '\'boolean\''
            var thr06 = '\'bigint\''
            var thr07 = '\'symbol\''
            var thr08 = '\'regexp\''
            var thr09 = '\'object\''
            
            expect(()=> Type.matchType(type1, tar01)).toThrow(thr01)
            expect(()=> Type.matchType(type2, tar01)).toThrow(thr02)
            expect(()=> Type.matchType(type3, tar01)).toThrow(thr03)
            expect(()=> Type.matchType(type4, tar01)).toThrow(thr04)
            expect(()=> Type.matchType(type5, tar01)).toThrow(thr05)
            expect(()=> Type.matchType(type6, tar01)).toThrow(thr06)
            expect(()=> Type.matchType(type7, tar01)).toThrow(thr07)
            expect(()=> Type.matchType(type8, tar01)).toThrow(thr08)
            expect(()=> Type.matchType(type9, tar01)).toThrow(thr09)
        });
        it('- [EL01103] 기본', () => {
            var type1 = { $type: 'etc'};
            var tar01 = null;
            var thr01 = '[EL01103]'
            // 사전에 검사해서 처리할 수 없는 타입임
            expect(()=> Type.matchType(type1, tar01)).toThrow(thr01)
        });
        // match array
        it('- [EL01111] array', () => {
            var type1 = []
            var tar01 = null
            var thr01 = '[EL01111]'
            expect(()=> Type.matchType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01112] array(_any_)', () => {
            var type1 = ['_any_']
            var tar01 = []
            var thr01 = '[EL01112]'
            expect(()=> Type.matchType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01113] array(_seq_)', () => {
            var type1 = ['_seq_', String]
            var tar01 = []
            var thr01 = '[EL01113]'
            expect(()=> Type.matchType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01114] array(_seq_)', () => {
            var type1 = ['_seq_', 10]
            var tar01 = [20]
            var thr01 = '[EL01114]'
            expect(()=> Type.matchType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01115] array(_seq_)', () => {
            var type1 = ['_seq_', String]
            var tar01 = [10]
            var thr01 = '[EL01115]'
            expect(()=> Type.matchType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01116] array(_req_)', () => {
            var type1 = ['_req_', String]
            var tar01 = []
            var thr01 = '[EL01116]'
            expect(()=> Type.matchType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01117] array(_etc_)', () => {
            var type1 = ['_etc_']
            var tar01 = []
            var thr01 = '[EL01117]'
            expect(()=> Type.matchType(type1, tar01)).toThrow(thr01)
        });

        it('- [EL01118] array list', () => {
            var type1 = [String, Number]
            var tar01 = [true]
            var thr01 = '[EL01118]'
            expect(()=> Type.matchType(type1, tar01)).toThrow(thr01)
        });
        // match choice
        it('- [EL01121] choice(_any_)', () => {
            var type1 = [['_any_']]
            var tar01 = undefined
            var thr01 = '[EL01121]'
            expect(()=> Type.matchType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01122] choice(_non_)', () => {
            var type1 = [['_non_']]
            var tar01 = [true]
            var thr01 = '[EL01122]'
            expect(()=> Type.matchType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01123] choice(_err_)', () => {
            var type1 = [['_err_']]
            var tar01 = [true]
            var thr01 = '[EL01123]'
            expect(Type.matchType(type1, new Error())).toBe(undefined);
            expect(()=> Type.matchType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01124] choice(_eum_)', () => {
            var type1 = [['_eum_', 10, 'str', String]]
            var tar01 = [true]
            var thr01 = '[EL01124]'
            expect(()=> Type.matchType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01125] choice(_def_)', () => {
            var type1 = [['_def_', String, 10, 'str']]
            var tar01 = [true]
            var thr01 = '[EL01125]'
            expect(()=> Type.matchType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01126] choice(_etc_)', () => {
            var type1 = [['_etc_']]
            var tar01 = [true]
            var thr01 = '[EL01126]'
            expect(()=> Type.matchType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01127] choice sub', () => {
            var type1 = [[String, Number]]
            var tar01 = [true]
            var thr01 = '[EL01127]'
            expect(()=> Type.matchType(type1, tar01)).toThrow(thr01)
        });
        // match class
        it('- [EL01131] class', () => {
            class ClassA { aa = String }
            var type1 = ClassA
            var tar01 = { aa: 10 }
            var thr01 = '[EL01131]'
            expect(()=> Type.matchType(type1, tar01, 1)).toThrow(thr01)
        });
        it('- [EL01132] class', () => {
            class ClassA { aa = String }
            var type1 = ClassA
            var tar01 = { aa: 10 }
            var thr01 = '[EL01132]'
            expect(()=> Type.matchType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01133] class', () => {
            class ClassA { aa = String }
            var type1 = ClassA
            var tar01 = 10
            var thr01 = '[EL01133]'
            expect(()=> Type.matchType(type1, tar01)).toThrow(thr01)
        });
        // match union
        it('- [EL01141] union', () => {
            var type1 = {}
            var tar01 = 10
            var thr01 = '[EL01141]'
            expect(()=> Type.matchType(type1, tar01)).toThrow(thr01)
        });
        // TODO: 오류 코드 사라짐
        // it('- [EL01142] union', () => { 
        //     var type1 = {aa: String}
        //     var tar01 = {}
        //     var thr01 = '[EL01142] 유니언 매치 : target[\'aa\'] 키가 존재하지 않습니다. extType[\'aa\'] = string'
        //     expect(()=> Type.matchType(type1, tar01)).toThrow(thr01)
        // });
        it('- [EL01143] union', () => {
            var type1 = {aa: String}
            var tar01 = {aa: 10}
            var thr01 = '[EL01143]'
            expect(()=> Type.matchType(type1, tar01)).toThrow(thr01)
        });
        // match function
        it('- [EL01151] function', () => {
            var type1 = Function
            var tar01 = 10
            var thr01 = '[EL01151]'
            expect(()=> Type.matchType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01152] function', () => {
            var type1 = { $type: 'function', name: 'funcA' }
            var tar01 = { $type: 'function' }
            var thr01 = '[EL01152]'
            expect(()=> Type.matchType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01153] function', () => {
            var type1 = { $type: 'function', func: function funcA(){} }
            var tar01 = ()=>{}
            var thr01 = '[EL01153]'
            expect(()=> Type.matchType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01154] function', () => {
            var type1 = { $type: 'function', func: function funcA(){} }
            var tar01 = { $type: 'function', func: function funcB(){} }
            var thr01 = '[EL01154]'
            expect(()=> Type.matchType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01155] function', () => {
            var type1 = { $type: 'function', params: [String, Number], return: Boolean }
            var tar01 = { $type: 'function', }
            var thr01 = '[EL01155]'
            expect(()=> Type.matchType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01156] function', () => {
            var type1 = { $type: 'function', params: [String, Number] }
            var tar01 = { $type: 'function', params: [String] }
            var thr01 = '[EL01156]'
            expect(()=> Type.matchType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01157] function', () => {
            var type1 = { $type: 'function', return: String }
            var tar01 = { $type: 'function', return: Boolean }
            var thr01 = '[EL01157]'
            expect(()=> Type.matchType(type1, tar01)).toThrow(thr01)
        });
    });
    describe(' allow ', () => {
        // allow 
        it('- [EL01201] extType ', () => {
            var type0 = null;
            var type1 = ['_SEQ_'];
            var type2 = ['_OPT_'];
            var type3 = ['_REQ_'];
            var type4 = [['_EUM_']];
            var type5 = [['_DEF_']];
            var tar00 = null;
            var tar01 = ['_SEQ_'];
            var tar02 = ['_OPT_'];
            var tar03 = ['_REQ_'];
            var tar04 = [['_EUM_']];
            var tar05 = [['_DEF_']];

            var thr01 = 'extType: array(_SEQ_)[]'
            var thr02 = 'extType: array(_OPT_)[]'
            var thr03 = 'extType: array(_REQ_)[]'
            var thr04 = 'extType: choice(_EUM_)[]'
            var thr05 = 'extType: choice(_DEF_)[]'
        
            expect(()=> Type.allowType(type1, tar00)).toThrow(thr01)
            expect(()=> Type.allowType(type2, tar00)).toThrow(thr02)
            expect(()=> Type.allowType(type3, tar00)).toThrow(thr03)
            expect(()=> Type.allowType(type4, tar00)).toThrow(thr04)
            expect(()=> Type.allowType(type5, tar00)).toThrow(thr05)
        });
        it('- [EL01201] tarType ', () => {
            var type0 = null;
            var tar01 = ['_SEQ_'];
            var tar02 = ['_OPT_'];
            var tar03 = ['_REQ_'];
            var tar04 = [['_EUM_']];
            var tar05 = [['_DEF_']];

            var thr01 = 'array(_SEQ_)[]'
            var thr02 = 'array(_OPT_)[]'
            var thr03 = 'array(_REQ_)[]'
            var thr04 = 'choice(_EUM_)[]'
            var thr05 = 'choice(_DEF_)[]'
        
            expect(()=> Type.allowType(type0, tar01)).toThrow(thr01)
            expect(()=> Type.allowType(type0, tar02)).toThrow(thr02)
            expect(()=> Type.allowType(type0, tar03)).toThrow(thr03)
            expect(()=> Type.allowType(type0, tar04)).toThrow(thr04)
            expect(()=> Type.allowType(type0, tar05)).toThrow(thr05)
        });
        it('- [EL01202] 기본', () => {
            var type1 = 10
            var tar01 = 20
            var thr01 = '[EL01202]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01203] 기본', () => {
            var type1 = String
            var tar01 = 10
            var thr01 = '[EL01203]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01204] 기본', () => {      // 타입 강제 발생
            var type1 = { $type: 'etc'}
            var tar01 = null
            var thr01 = '[EL01204]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        
        // allow array
        it('- [EL01211] array', () => {
            var type1 = []
            var tar01 = 10
            var thr01 = '[EL01211]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01212] array(_any_)', () => {
            var type1 = ['_any_']
            var tar01 = ['_all_']
            var thr01 = '[EL01212]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01213] array(_seq_)', () => {
            var type1 = ['_seq_', 10]
            var tar01 = [10]
            var thr01 = '[EL01213]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01214] array(_seq_)', () => {
            var type1 =  ['_seq_', 10, 20]
            var tar01 =  ['_seq_', 10]
            var thr01 = '[EL01214]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01215] array(_seq_)', () => {
            var type1 =  ['_seq_', 10, 20]
            var tar01 =  ['_seq_', 10, 30]
            var thr01 = '[EL01215]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01216] array(_req_)', () => {
            var type1 =  ['_req_', 10, 20]
            var tar01 =  ['_all_']
            var thr01 = '[EL01216]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01217] array(_opt_)', () => {
            var type1 =  ['_opt_', 10, 20]
            var tar01 =  ['_all_']
            var thr01 = '[EL01217]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01218] array(_etc_)', () => {
            var type1 =  ['_etc_']
            var tar01 =  ['_all_']
            var thr01 = '[EL01218]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01219] array list', () => {
            var type1 =  [String]
            var tar01 =  [Number]
            var thr01 = '[EL01219]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        
        // allow choice
        it('- [EL01221] choice(_all_)', () => {
            var type1 = [['_all_']]
            var tar01 = [['_err_']]
            var thr01 = '[EL01221]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01222] choice(_any_)', () => {
            var type1 = [['_any_']]
            var tar01 = undefined
            var thr01 = '[EL01222]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01223] choice(_any_)', () => {
            var type1 = [['_any_']]
            var tar01 = [['_err_']]
            var thr01 = '[EL01223]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01224] choice(_non_)', () => {
            var type1 = [['_non_']]
            var tar01 = [['_all_']]
            var thr01 = '[EL01224]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01225] choice(_err_)', () => {
            var type1 = [['_err_']]
            var tar01 = [['_all_']]
            var thr01 = '[EL01225]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01226] choice(_req_)', () => {
            var type1 = [['_req_', 10]]
            var tar01 = [['_all_']]
            var thr01 = '[EL01226]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01227] choice(_opt_)', () => {
            var type1 = [['_opt_', 10]]
            var tar01 = [['_all_']]
            var thr01 = '[EL01227]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01228] choice(_eum_)', () => {
            var type1 = [['_eum_', 10]]
            var tar01 = 10
            var thr01 = '[EL01228]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01229] choice(_eum_)', () => {
            var type1 = [['_eum_', String]]
            var tar01 = [['_eum_', '']]
            var thr01 = '[EL01229]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL0122A] choice(_eum_)', () => {
            var type1 = [['_eum_', '']]
            var tar01 = [['_eum_', Number]]
            var thr01 = '[EL0122A]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL0122B] choice(_def_)', () => {
            var type1 = [['_def_', '']]
            var tar01 = [['_eum_', Number]]
            var thr01 = '[EL0122B]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL0122C] choice(_def_)', () => {
            var type1 = [['_def_', String]]
            var tar01 = [['_def_', Number]]
            var thr01 = '[EL0122C]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL0122D] choice(_def_)', () => {
            var type1 = [['_def_', 'a']]
            var tar01 = [['_def_', String]]
            var thr01 = '[EL0122D]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL0122E] choice(_etc_)', () => {
            var type1 = [['_etc_']]
            var tar01 = [['_any_']]
            var thr01 = '[EL0122E]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL0122F] choice sub', () => {
            var type1 = [[String, 10]]
            var tar01 = [['', Number]]
            var thr01 = '[EL0122F]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        
        // allow class
        it('- [EL01231] class', () => {
            class ClassA { aa = String }
            class ClassB { aa = Number }
            var type1 = ClassA
            var tar01 = ClassB
            var thr01 = '[EL01231]'
            expect(()=> Type.allowType(type1, tar01, 1)).toThrow(thr01)
        });
        it('- [EL01232] class', () => {
            class ClassA { aa = String }
            class ClassB { aa = Number }
            var type1 = ClassA
            var tar01 = ClassB
            var thr01 = '[EL01232]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01233] ', () => {
            class ClassA { aa = String }
            var type1 = ClassA
            var tar01 = { aa: Number }
            var thr01 = '[EL01233]'
            expect(()=> Type.allowType(type1, tar01, 1)).toThrow(thr01)
        });
        it('- [EL01234] class', () => {
            class ClassA { aa = String }
            var type1 = ClassA
            var tar01 = { aa: Number }
            var thr01 = 'EL01234]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01235] class', () => {
            class ClassA { aa = String }
            var type1 = ClassA
            var tar01 = 10
            var thr01 = '[EL01235]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });

        // allow union
        it('- [EL01241] union', () => {
            var type1 = {}
            var tar01 = 10
            var thr01 = '[EL01241]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01242] union', () => {
            var type1 = {aa: String}
            var tar01 = {}
            var thr01 = '[EL01242]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01243] union', () => {
            var type1 = {aa: String}
            var tar01 = {aa: 10}
            var thr01 = '[EL01243]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        
        // allow function
        it('- [EL01251] function', () => {
            var type1 = Function
            var tar01 = 10
            var thr01 = '[EL01251]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01252] function', () => {
            var type1 = { $type: 'function', name: 'funcA' }
            var tar01 = { $type: 'function' }
            var thr01 = '[EL01252]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01253] function', () => {
            var type1 = { $type: 'function', func: function funcA(){} }
            var tar01 = ()=>{}
            var thr01 = '[EL01253]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01254] function', () => {
            var type1 = { $type: 'function', func: function funcA(){} }
            var tar01 = { $type: 'function', func: function funcB(){} }
            var thr01 = '[EL01254]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01255] function', () => {
            var type1 = { $type: 'function', params: [String, Number], return: Boolean }
            var tar01 = { $type: 'function', }
            var thr01 = '[EL01255]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01256] function', () => {
            var type1 = { $type: 'function', params: [String, Number] }
            var tar01 = { $type: 'function', params: [String] }
            var thr01 = '[EL01256]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01257] function', () => {
            var type1 = { $type: 'function', return: String }
            var tar01 = { $type: 'function', return: Boolean }
            var thr01 = '[EL01257]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
    });
    describe(' etc ', () => {
        // etc
        it('- [EL01301] ', () => {
            // REVIEW: 오류 조건을 찾아야함
            // var type1 = (String)=>{(String)}
            // var tar01 =  (String, [])=>{}
            // var thr01 = '[EL01301]'
            // expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01302] ', () => {
            // REVIEW: 오류 조건을 찾아야함
            // var type1 = (String)=>{(String)}
            // var tar01 =  (String, [])=>{}
            // var thr01 = '[EL01301]'
            // expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL01303] ', () => {
            // REVIEW: 오류 조건을 찾아야함
            // var type1 = function (aa, bb) { cc; }
            // var tar01 = ()=>{}
            // var thr01 = '[EL01301]aaaa'
            // expect(()=> Type.extendType(type1)).toThrow(thr01)
        });
        it('- [EL01304] ', () => {
            var type1 = { $type: 'Not_Type' }
            var type2 = { $type: {} }
            var thr01 = '[EL01304]'
            var thr02 = '[[object Object]]'
            expect(()=> Type.extendType(type1)).toThrow(thr01)
            expect(()=> Type.extendType(type2)).toThrow(thr02)
        });
        it('- [EL01304] Type.extendType() ', () => {
            var type1 = { $type: 'Not_Type' }
            var thr01 = '[EL01304]'
            expect(()=> Type.extendType(type1)).toThrow(thr01)
        });
        it('- [EL01305] Type.extendType()', () => {
            var type1 = { $type: 'array', kind: -10 }
            var thr01 = '[EL01305]'
            expect(()=> Type.extendType(type1)).toThrow(thr01)
        });
        it('- [EL01306] Type.extendType()', () => {
            var type1 = { $type: 'choice', kind: -10 }
            var thr01 = '[EL01306]'
            expect(()=> Type.extendType(type1)).toThrow(thr01)
        });
        it('- [EL01307] ', () => {
            var type1 = ['_eum_']
            var thr01 = '[EL01307]'
            expect(()=> Type.extendType(type1)).toThrow(thr01)
        });
        it('- [EL01308] ', () => {
            var type1 = [['_seq_']]
            var thr01 = '[EL01308]'
            expect(()=> Type.extendType(type1)).toThrow(thr01)
        });
        it('- [EL01309] ', () => {
            // REVIEW: 오류 조건을 찾아야함
            // var type1 =  { $type: 'etc' }
            // var thr01 = '[EL01308] 타입 검사 : choice(_SEQ_) 타입은 처리할 수 없는 타입 입니다.'
            // expect(()=> Type.extendType(type1)).toThrow(thr01)
        });
        it('- [EL0130A] Type.allowType()', () => {
            var type1 = ''
            var tar01 = 10
            var thr01 = '[EL0130A]'
            expect(()=> Type.allowType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL0130B] Type.matchType()', () => {
            var type1 = ''
            var tar01 = 10
            var thr01 = '[EL0130B]'
            expect(()=> Type.matchType(type1, tar01)).toThrow(thr01)
        });
        it('- [EL0130B] getTypes()', () => {
            expect(()=> Type.getTypes({})).toThrow('EL0130C');
        });
    });



    
});