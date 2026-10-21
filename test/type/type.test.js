//==============================================================
// gobal defined

import { jest } from '@jest/globals';
import { Type } from '../../src/type';

const T = true;
const F = false;
//==============================================================
// test
describe('Type.deepEqual(obj1, obj2) ', () => {
    // beforeEach(() => {
    //     jest.resetModules();
    //     globalThis.OLD_ENV = false;
    // });
    it('- Type.deepEqual() : 객체 비교 ', () => {
        var obj01 = {}
        var obj02 = {}

        var tar01 = {}
        var tar02 = 1

        expect(Type.deepEqual(obj01, obj01)).toBe(T);
        expect(Type.deepEqual(obj01, tar01)).toBe(T);
        expect(Type.deepEqual(obj02, tar02)).toBe(F);
        expect(Type.deepEqual([,], [,,])).toBe(F);
    });
    it('- type.deepEqual() : prototype 객체 비교 ', () => {
        var sup01 = Object.create({aa: 1})
        sup01.bb = 2
        var obj01 = Object.create(sup01)
        obj01.cc = 3

        var tar01 = { cc: 3 }

        expect(Type.deepEqual(obj01, tar01)).toBe(T);
    });
    it('- type.deepEqual() : 함수 비교 ', () => {
        var fun1 = function aaa(aa, bb){return true};

        var obj01 = {fun: ()=> ''}
        var obj02 = {fun: function(){return ''}}
        var obj03 = {fun: fun1}

        var tar01 = {fun: ()=> ''}
        var tar02 = {fun: function(){return ''}}
        var tar03 = {fun: fun1}

        // obj1
        expect(Type.deepEqual(obj01, tar01)).toBe(T);
        expect(Type.deepEqual(obj01, tar02)).toBe(F);
        expect(Type.deepEqual(obj01, tar03)).toBe(F);
        // obj2
        expect(Type.deepEqual(obj02, tar01)).toBe(F);
        expect(Type.deepEqual(obj02, tar02)).toBe(T);
        expect(Type.deepEqual(obj02, tar03)).toBe(F);
        // obj3
        expect(Type.deepEqual(obj03, tar01)).toBe(F);
        expect(Type.deepEqual(obj03, tar02)).toBe(F);
        expect(Type.deepEqual(obj03, tar03)).toBe(T);
    });
});
describe('Type.isProtoChain() ', () => {
    it('- Type.isProtoChain() : class ', () => {
        class ClassA { a = 1 }
        class ClassB extends ClassA { b = 2 }

        expect(Type.isProtoChain(ClassB, ClassA)).toBe(T);
        expect(Type.isProtoChain(ClassB, 'ClassA')).toBe(T);
        expect(Type.isProtoChain(ClassA, ClassB)).toBe(false);
    });
    it('- Type.isProtoChain() : etc type ', () => {
        class ClassA { a = 1 }
        expect(Type.isProtoChain({}, ClassA)).toBe(false);
        expect(Type.isProtoChain(ClassA, {})).toBe(false);
    });
});
describe('Type.getTypes(ctor) ', () => {
    it('- Type.getTypes() : 타입 조회', () => {
        class ClassA { a = 1 }
        class ClassB extends ClassA { b = 2 }
        var type1 = Type.getTypes(ClassB);
        var tar01 = [ClassB, ClassA];

        expect(type1).toEqual(tar01)
    });
    it.skip('- Type.getTypes() : old env ', () => {
        global.OLD_ENV = true;
        var Type = require('../src/type');
        class ClassA { a = 1 }
        class ClassB extends ClassA { b = 2 }
        var type1 = Type.getTypes(ClassB);
        var tar01 = [ClassB, ClassA];

        expect(type1).toEqual(tar01)
    });
});
describe('커버리지', () => {
    it('- _hasType() ', () => {
        var type1 = { $type: -1 }
        expect(()=> Type.extendType(type1)).toThrow('EL01304');
    });
});