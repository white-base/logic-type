/**** util-type.js Type ****/
//==============================================================
import ExtendError      from './extend-error.js';
 
var _global = globalThis;
var OLD_ENV = _global.OLD_ENV ? _global.OLD_ENV : false;    // 커버리지 테스트 역활

/**
 * This is a type module.
 */
var Type = {};

/**
 * object 와 new 생성한 사용자 함수를 제외한 객쳐 여부  
 * 
 * @param {*} obj 
 * @returns {boolean}
 */
function _isPrimitiveObj(obj) { // REVIEW: 정리 필요, 의미적으로 명료하게..
    if(typeof obj === 'object' && obj !== null 
        && (obj instanceof RegExp || obj instanceof Date )) {
        return true;
    }
    return false;
}

/**
 * 최상위 object 이거나 사용자 함수에서 생성한 객체 여부  
 * 
 * @param {*} obj 
 * @returns {boolean}
 */
function _isObject(obj)  {  // REVIEW: 정리 필요, 의미적으로 명료하게
    if(typeof obj === 'object' && obj !== null && !_isPrimitiveObj(obj)) {
        return true;
    }
    return false;
}

/**
 * 공백객체 인지 확인  
 * 
 * @param {*} obj 검사대상
 * @returns {boolean}
 */
function _isEmptyObj(obj)  {
    if(_isObject(obj) && Object.keys(obj).length === 0 && getAllProperties(obj).length === 0) return true;
    return false;
}

/**
 * 공백이 아닌 객체 (prototype 및 속성 있는것)  
 * 
 * @param {*} obj 대상 
 * @returns {boolean}
 */
function _isFillObj(obj)  {
    if(_isObject(obj) && getAllProperties(obj).length > 0) return true;
    return false;
}

/**
 * 내장함수 유무  
 * 
 * @param {*} obj 
 * @returns {boolean}
 */
function _isBuiltFunction(obj) {
    if (typeof obj === 'function' && (false 
        || obj === Number || obj === String || obj === Boolean
        || obj === Object || obj === Array || obj === Function
        || obj === RegExp || obj === Date 
        || obj === Symbol || obj === BigInt
    )) return true;
    return false;
}

/**
 * 첫문자 대문자 여부  
 * 
 * @param {string} strValue 
 * @returns {boolean}
 */
function _isUpper(strValue) {
    var firstStr = strValue.charAt(0);
    if (firstStr === '') return false;
    if(firstStr === firstStr.toUpperCase()) return true;
    return false;
}

/**
 * 리터럴 여부  
 * number, string, boolean, bigint, RexExp instance  
 * 
 * @param {*} obj 
 * @returns {boolean}
 */
function _isLiteral(obj) {
    if (typeof obj  === 'number') return true;
    if (typeof obj  === 'string') return true;
    if (typeof obj  === 'boolean') return true;
    if (typeof obj  === 'bigint') return true;
    if (obj instanceof RegExp) return true;
    return false;
}

/**
 * 리터럴값 비교  
 * number, string, boolean, bigint, RexExp instance  
 * 
 * @param {*} obj1 
 * @param {*} obj2 
 * @returns {boolean}
 */
function _equalLiternal(obj1, obj2) {
    if (obj1 === obj2) return true;
    if (obj1 instanceof RegExp && obj2 instanceof RegExp && obj1.source === obj2.source) return true;
    return false;
}

/**
 * function 생성하는 생성자
 * @param {*} type 
 * @returns {object}
 */
var _creator = function(type) {
    return new type;
};

/**
 * 타임명 얻기  
 * 
 * @param {*} obj 
 * @returns {string}
 */
function _typeName(obj) {
    return obj['name'];
}

/**
 * kind 코드, 대문자로 얻기 '_any_'...  
 * 
 * @param {*} val 
 * @returns {string}
 */
function _getKeyCode(val) {
    var reg = /^_[a-zA-Z]+_/;
    var result;

    if (typeof val !== 'string') return '';
    result = reg.exec(val);
    if (result !== null) return result[0].toUpperCase();
    return '';
}

// 배열 구조 분해 할당을 해제 
function restoreArrowFunction(transformedCode) {
    // 1. 화살표 함수의 매개변수와 본문 전체를 추출
    const regex = /\((.*?)\)\s*=>\s*\{([\s\S]*)\}/;
    const match = transformedCode.match(regex);
  
    // 특별히 `_ref => { ... }` 형태도 대응할 수 있도록 추가 처리
    //  -> _ref => { let [String] = _ref; return Number; }
    //  -> 실제로는 ( _ref ) => { ... } 형태로 통일
    if (!match) {
        // 혹시 _ref => { ... } 형태라면, 강제로 괄호를 넣어 재시도
        const altRegex = /^(.*?)\s*=>\s*\{([\s\S]*)\}/;
        const altMatch = transformedCode.match(altRegex);
        if (!altMatch) {
            throw new Error('Invalid arrow function format.');
        }
        // altMatch[1] = "_ref"
        // altMatch[2] = "let [String] = _ref; return Number;"
        let altParams = altMatch[1].trim();
        let altBody = altMatch[2].trim();
    
        // 화살표 함수 형태 통일:  ( _ref ) => { ... }
        return restoreArrowFunction(`(${altParams}) => {${altBody}}`);
    }
  
    // 2. 매개변수와 함수 본문 부분 분리
    let params = match[1].trim();  // 함수의 매개변수 부분
    let body = match[2].trim();    // 함수 본문
  
    // 3. 구조 분해 할당 패턴 (객체/배열 모두 대응) - 여러 줄(줄바꿈)도 허용
    //    예: let { aa: String } = _ref5;  또는 let [[{ bb: Number }]] = _ref6;
    const paramAssignments = body.match(/let\s+(\{[\s\S]*?\}|\[[\s\S]*?\])\s*=\s*(\w+);/g) || [];
  
    // 4. 찾아낸 구조 분해 할당들을 순회하며 매개변수( _ref5, _ref6 등 )를 원래 형태로 치환
    paramAssignments.forEach(assign => {
        // - parts[1]: { aa: String } 또는 [String] 등 (줄바꿈 포함 가능)
        // - parts[2]: _ref5, _ref6 등
        const parts = assign.match(/let\s+(\{[\s\S]*?\}|\[[\s\S]*?\])\s*=\s*(\w+);/);
        if (parts) {
            const extractedParam = parts[1].trim(); // 원래 구조
            const originalParam = parts[2].trim();  // 변환된 변수명 (_ref5 등)
    
            // 매개변수 목록에 있던 _ref5 등을 { aa: String } 등으로 치환
            const re = new RegExp(`\\b${originalParam}\\b`, 'g');
            params = params.replace(re, extractedParam);
        }
    });
  
    // 5. return 문이 있다면 반환값을 추출
    //    예: return Number; -> "Number"
    const returnStatementMatch = body.match(/return\s+(.*?);/);
    let returnType = returnStatementMatch ? returnStatementMatch[1].trim() : '';
  
    // 6. 최종 복원 – return 문이 있다면 { return ... } 형태로, 없으면 { } 로
    if (returnType) {
        // 불필요한 공백 없애기 위해 파라메터 부분도 스페이스 정리
        params = params.replace(/\s+/g, '');
        return `(${params})=>{return ${returnType}}`;
    } else {
        params = params.replace(/\s+/g, '');
        return `(${params})=>{}`;
    }
}

/**
 * 함수 규칙   
 * - (params 내부에는 '()' 입력 금지)  
 * - 참조형 타입 금지 : new Function() 시점에 자동 해석됨  
 * 
 * @param {*} funBody 
 * @returns {object}
 */
function _parseFunc(funBody) {
    var syntax1 = /\([,_\[\]{:}\w\s]*\)\s*(?:=>)?\s*{\s*.*\s*.*\s*}/;    // 제한 규칙
    var syntax2 = /(\(.*\)|\w+)\s*(?:=>).*/;
    var regFunc1 = /(?:function\s)?\(([\[\]{:}\s\w,]*)\)\s*(?:=>)?\s*{(?:\s*return\s+|\s*)?([\[\]{:}\s\w,]*);?\s*}/;
    var regFunc2 = /\(?([\[\]{:}\s\w,]*)\)?\s*(?:=>)\s*{?(?:\s*return\s+|\s*)?([\[\]\s\w,]*);?\s*}?/;
    
    var arrFunc;
    var result = { params: [], return: undefined };
    var arrParam = [];
    var arrRetrun;
    
    // 배열 구조 분해 할당을 해제 
    if (/\blet\b/.test(funBody)) funBody = restoreArrowFunction(funBody);
    
    funBody = $skipComment(funBody);

    try {
        if (syntax1.test(funBody)) arrFunc = regFunc1.exec(funBody);
        else if (syntax2.test(funBody)) arrFunc = regFunc2.exec(funBody);
        else throw new ExtendError(/EL01301/, null, [funBody]);
        
        if (arrFunc === null) throw new ExtendError(/EL01302/, null, [funBody]);

        arrParam = (new Function('return ['+ arrFunc[1] +']'))();
        result['params'] = arrParam;
        
        if (arrFunc[2] !== '') arrRetrun = (new Function('return '+ arrFunc[2]))();
        result['return'] = arrRetrun;

    } catch (error) {
        throw new ExtendError(/EL01303/, error, ['']);
    }

    return result;

    // inner function
    function $skipComment(body) {    // 주석 제거 comment
        var rBody = body;
        var bloackComment = /\/\*[^](.*?)\*\//g;
        var lineComment = /\/\/[^](.*?)(\n|$)/g;

        rBody = rBody.replace(bloackComment, '');
        rBody = rBody.replace(lineComment, '');
        return rBody;
    }
}

/**
 * 타입 여부  
 * 
 * @param {string} name 
 * @returns {boolean}
 */
function _hasType(name) {
    var arr = [];
    
    if (typeof name !== 'string') return false;

    arr = arr.concat(['null', 'undefined', 'number', 'string', 'boolean']);
    arr = arr.concat(['array', 'function', 'object']);
    arr = arr.concat(['choice', 'union', 'class']);
    arr = arr.concat(['symbol', 'bigint', 'regexp']);
    arr = arr.concat(['etc']);  // 예외 오류 코드 검출 

    return arr.indexOf(name) > -1;
}

/**
 * 타입 여부  
 * 
 * @param {string} name 
 * @returns {boolean}
 */
function _isLeafType(name) {
    var arr = [];
    
    arr = arr.concat(['null', 'undefined', 'number', 'string', 'boolean']);
    arr = arr.concat(['symbol', 'bigint', 'regexp', 'object']);

    return arr.indexOf(name) > -1;
}

/**
 * choice type kind 여부  
 * 
 * @param {string} name 
 * @returns {boolean}
 */
function _hasKindChoice(name) {
    var arr = [];
    
    if (typeof name !== 'string') return false;
    
    arr = arr.concat(['_ALL_', '_ANY_', '_NON_', '_ERR_']);
    arr = arr.concat(['_REQ_', '_OPT_', '_DEF_', '_EUM_']);
    arr = arr.concat(['_ETC_']);  // 예외 오류 코드 검출 

    return arr.indexOf(name) > -1;
}

/**
 * choice type kind 여부  
 * 
 * @param {string} name 
 * @returns {boolean}
 */
function _hasKindArray(name) {
    var arr = [];
    
    if (typeof name !== 'string') return false;

    arr = arr.concat(['_ALL_', '_ANY_']);
    arr = arr.concat(['_REQ_', '_OPT_', '_SEQ_']);
    arr = arr.concat(['_ETC_']);  // 예외 오류 코드 검출 

    return arr.indexOf(name) > -1;
}

/**
 * Query all properties of the object.
 * 
 * @param {object} obj  Object to look up properties (except Object)
 * @param {boolean?} hasObj Whether to include properties of 'Object'
 * @returns {array<string>} Property Name Arrangement
 */
function getAllProperties(obj, hasObj) {
    var allProps = [], cur = obj;
    var is = hasObj || false;
    do {
        var props = Object.getOwnPropertyNames(cur);
        for (var i = 0; i < props.length; i++) {
            var prop = props[i];
            if (allProps.indexOf(prop) === -1 && (is || !Object.prototype.hasOwnProperty(prop))) allProps.push(prop);
        }
    } while (cur = Object.getPrototypeOf(cur));
    return allProps;
}
Type.getAllProperties = getAllProperties;

/**
 * Compare the two objects to see if they are the same (except Prototype)  
 * 
 * @param {any} obj1 Source object
 * @param {any} obj2 Object to compare
 * @returns {boolean} Whether the two objects are the same ('true' or 'false')
 */
function deepEqual(obj1, obj2) {
    // 두 객체가 동일한 참조를 가지면 true를 반환
    if (obj1 === obj2) return true;

    // 두 객체 중 하나가 null이거나 타입이 다르면 false를 반환
    if (obj1 === null || obj2 === null || typeof obj1 !== typeof obj2) return false;

    // 함수 비교
    if (typeof obj1 === 'function' && typeof obj2 === 'function') {
        return obj1.toString() === obj2.toString();
    }

    // 원시 값 비교
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;

    // 배열 비교
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length !== obj2.length) return false;
        for (var i = 0; i < obj1.length; i++) {
            if (!deepEqual(obj1[i], obj2[i])) return false;
        }
        return true;
    }

    // 객체 비교
    // var keys1 = Object.keys(obj1);
    // var keys2 = Object.keys(obj2);
    var keys1 = Object.getOwnPropertyNames(obj1);
    var keys2 = Object.getOwnPropertyNames(obj2);

    if (keys1.length !== keys2.length) return false;

    for (var j = 0; j < keys1.length; j++) {
        var key = keys1[j];
        if (keys2.indexOf(key) === -1 || !deepEqual(obj1[key], obj2[key])) return false;
    }

    return true;
}
Type.deepEqual = deepEqual;

/**
 * Gets the type of the given function (generator). (Can include '_UNION')  
 * The returned arrays are included in order from the specified function.  
 * 
 * @param {function} ctor Generator function or class
 * @param {boolean} [hasUnion= true] whether '_UNION' is included (default: 'true')
 * @returns {array<function>} Array function type
 */
function getTypes(ctor, hasUnion) {
    var arr = [];
    var tempArr = [];
    var union;
    var proto;

    hasUnion = hasUnion === false ? false : true;
    
    if (typeof ctor !== 'function') throw new ExtendError(/EL0130C/, null, [typeof ctor]);

    arr.push(ctor);
    proto = $getPrototype(ctor);        
    
    if (proto !== Function.prototype) {
        arr = arr.concat(getTypes(proto, hasUnion));
    }
    if (hasUnion) {
        union = ctor['_UNION'] || [];
        for (var i = 0; i < union.length; i++) {
            arr = arr.concat(getTypes(union[i], hasUnion));
        }
    }

    for (var j = 0; j < arr.length; j++) {
        var idx = tempArr.indexOf(arr[j]);
        if (idx < 0) tempArr.push(arr[j]);
    }
    return tempArr;

    // innner function
    function $getPrototype(ctor) {
        // if (ctor.hasOwnProperty('super')) return ctor.super;
        if (Object.prototype.hasOwnProperty.call(ctor, 'super')) return ctor.super;
        return !OLD_ENV && typeof Object.getPrototypeOf === 'function' ? Object.getPrototypeOf(ctor) : ctor.__proto__;
    }
}
Type.getTypes = getTypes;

/**
 * Verify that the prototype (inheritance) chain of the function type contains the specified target.  
 * 
 * @param {function} ctor Generator function or class
 * @param {function | string} target To be examined (generator function or class name)
 * @returns {boolean} whether to be included in the prototype chain ('true' or 'false')
 */
function isProtoChain(ctor, target) {
    var arr;
    if (typeof ctor !== 'function') return false;
    if (!(typeof target === 'function' || typeof target === 'string')) return false;

    arr = getTypes(ctor, false);
    for (var i = 0; i < arr.length; i++) {
        if (typeof target === 'string') {
            if (target === arr[i].name) return true;
        } else {
            if (target === arr[i]) return true;
        }
    }
    return false;
}
Type.isProtoChain = isProtoChain;

/**
 * Verify that the given function type is included in the prototype (inheritance) chain or is of type '_UNION'.  
 * 
 * @param {function} ctor Generator function or class
 * @param {function | string} target To be examined (generator function or class name)
 * @returns {boolean} Prototype chain or type '_UNION' ('true' or 'false')
 */
function hasType(ctor, target) {
    var arr;
    if (typeof ctor !== 'function') return false;
    if (!(typeof target === 'function' || typeof target === 'string')) return false;

    arr = getTypes(ctor);
    for (var i = 0; i < arr.length; i++) {
        if (typeof target === 'string') {
            if (target === arr[i].name) return true;
        } else {
            if (target === arr[i]) return true;
        }
    }
    return false;
}
Type.hasType = hasType;

/**
 * Returns extension information of the target type in JSON format.  
 * Analyze the internal properties of the object to transform all properties into the format 'typeObject()'.  
 * 
 * @param {*} target Target type
 * @returns {object} converted extension type object
 * @example
 * var obj = {
 *      $ype: '',
 *      default: null,                  // string, number, boolean, regexp
 *      kind: '',                       // array, choice
 *      creator: null, _instance: {},   // class
 *      _prop: {},                      // union
 *      params: [], return: null,       // function
 *      name: name, func: null,
 * }
 */
function typeObject(target) {
    var obj = {};
    var typeObj = _isObject(target) && target['$type'] ? target : extendType(target);
    var leafType = ['null', 'undefined', 'number', 'string', 'boolean', 'symbol', 'bigi¡nt', 'object', 'regexp'];

    obj['$type'] = typeObj['$type'];
    
    if (typeObj['default'] !== null && typeof typeObj['default'] !== 'undefined') obj['default'] = typeObj['default'];
    if (typeObj['kind'] !== null && typeof typeObj['kind'] !== 'undefined') obj['kind'] = typeObj['kind'];
    if (typeObj['params']) obj['params'] = typeObj['params'];
    if (typeObj['return']) obj['return'] = typeObj['return'];
    if (typeObj['creator']) obj['creator'] = typeObj['creator'];
    if (typeObj['_instance']) obj['_instance'] = typeObj['_instance'];

    if (leafType.indexOf(obj['$type']) > -1) {
        if (typeObj['default']) obj['default'] = typeObj['default'];
        return obj;
    }
    if (obj['$type'] === 'array' ||  obj['$type'] === 'choice') {
        obj['list'] = [];
        for(var i = 0; i < typeObj['list'].length; i++) {
            obj['list'][i] = typeObject(typeObj['list'][i]);
        }
    }
    if (obj['$type'] === 'function') {
        for(var j = 0; j < obj['params'].length; j++) {
            obj['params'][j] = typeObject(typeObj['params'][j]);
        }
        if (typeObj['return']) obj['return'] = typeObject(typeObj['return']);
    }
    if (obj['$type'] === 'class') {
        if (typeof typeObj['ref'] === 'function') {
            obj['creator'] = typeObj['ref'].name; 
            var temp = _creator(typeObj['ref']);
            obj['_instance'] = typeObject(temp);
        }
    }
    if (obj['$type'] === 'union') {
        obj['_prop'] = {};
        var temp2 = typeObj['ref'] || typeObj['_prop'];
        var list = getAllProperties(temp2);
        for (var k = 0; k < list.length; k++) {
            var key = list[k];
            if (key === '_interface' || key === 'isImplementOf' ) continue;             // 예약어
            obj['_prop'][key] = typeObject(temp2[key]);
        }
    }
    return obj;
}
Type.typeObject = typeObject;

/**
 * Returns the extension type name of the target object.  
 * 
 * @param {*} target Target object
 * @returns {string} extended type name
 */
function typeOf(target) {
    return extendType(target)['$type'];
}
Type.typeOf = typeOf;

/**
 * Returns the extension type of the target object.  
 * 
 * @param {any} target Target object
 * @returns {object} extended type object
 * @example
 * var singleType = ['undefined', 'null', 'number', 'string', 'boolean', 'regexp', 'object', 'symbol'];
 * var unionType = ['array', 'choice', 'function', 'class', 'union'];
 */
function extendType(target) {
    var obj =  { $type: '', ref: undefined };

    obj.toString = function(){
        var temp = '';
        var arr = [];
        if (this['$type'] === 'array' || this['$type'] === 'choice') {
            for (var i = 0; i < this['list'].length; i++) {
                var _type = extendType(this['list'][i]);
                if (_type['default'] && _type['default'] !== null) {
                    var def;
                    if (_type['$type'] === 'string') def = '\''+ _type['default'] +'\'';
                    else def = _type['default'];
                    arr.push(_type['$type'] + '('+ def +')');
                } else arr.push(_type['$type']);
            }
            if (this['kind'] === '_OPT_' || this['kind'] === '_REQ_' || this['kind'] === '_SEQ_' || this['kind'] === '_EUM_' || this['kind'] === '_DEF_') {
                temp = this['$type'] +'('+ this['kind'] +')['+ arr.join(', ')+ ']';
            } else temp = this['$type'] +'('+ this['kind'] +')';
            
        } else {
            temp = this['$type'];
            if (this['default'] && this['default'] !== null) {
                if (this['$type'] === 'string') temp += '(\''+ this['default'] +'\')';
                else temp += '('+this['default']+')';
            }
        }
        return temp;
    };
    // special type
    if (typeof target === 'object'  && target !== null && target['$type']) {
        obj['$type'] = target['$type'];
        if (target['default']) obj['default'] = target['default'];
        if (target['kind']) obj['kind'] = target['kind'];
        if (target['ref']) obj['ref'] = target['ref'];
        if (target['list']) obj['list'] = target['list'];
        if (target['name']) obj['name'] = target['name'];
        if (target['func']) obj['func'] = target['func'];
        if (target['params']) obj['params'] = target['params'];
        if (target['return']) obj['return'] = target['return'];
        if (!_hasType(obj['$type'])) throw new ExtendError(/EL01304/, null, [obj['$type']]);
        if (obj['$type'] === 'array') {
            obj['kind'] = obj['kind'] || '_ALL_';
            if (!_hasKindArray(obj['kind'])) throw new ExtendError(/EL01305/, null, [obj['kind']]);
        }
        if (obj['$type'] === 'choice') {
            if (!_hasKindChoice(obj['kind'])) throw new ExtendError(/EL01306/, null, [obj['kind']]);
        }
        return obj;
    } else {
        obj['ref'] = target;
    }

    // step : operation
    if (target === null) {
        obj['$type'] = 'null';
    } else if (target === Number) {
        obj['$type'] = 'number';
        obj['default'] = null;            
    } else if (target === String) {
        obj['$type'] = 'string';
        obj['default'] = null;
    } else if (target === Boolean) {
        obj['$type'] = 'boolean';
        obj['default'] = null;
    } else if (target === Array) {
        obj['$type'] = 'array';
        obj['kind'] = '_ALL_';
        obj['list'] = [];
    } else if (target === Function) {
        obj['$type'] = 'function';
        obj['params'] = [];
    } else if (target === Object) {
        obj['$type'] = 'object';
    } else if (target === RegExp) {
        obj['$type'] = 'regexp';
        obj['default'] = null;
    } else if (target === Symbol) {      // ES6+
        obj['$type'] = 'symbol';
    } else if (target === BigInt) {      // ES6+
        obj['$type'] = 'bigint';
        obj['default'] = null;
    } else if (target instanceof RegExp) {
        obj['$type'] = 'regexp';
        obj['default'] = target;
    // step : typeof
    } else if (typeof target === 'undefined') {
        obj['$type'] = 'undefined';
    } else if (typeof target === 'number') {
        obj['$type'] = 'number';
        obj['default'] = target;
    } else if (typeof target === 'string') {
        obj['$type'] = 'string';
        obj['default'] = target;
    } else if (typeof target === 'boolean') {
        obj['$type'] = 'boolean';
        obj['default'] = target;
    } else if (typeof target === 'bigint') { // ES6+
        obj['$type'] = 'bigint';
        obj['default'] = target;
    } else if (typeof target === 'symbol') { // ES6+
        obj['$type'] = 'symbol';
    // step : function
    } else if (typeof target === 'function') {
        var kind = target['_KIND'];
        if (kind) {
            kind = kind.toLowerCase();
            if (kind === 'function') obj['$type'] = 'function';
            else obj['$type'] = 'class';    // class, interface, abstract
        } else obj['$type'] = _isUpper(target.name) ? 'class' : 'function';
            
        if (obj['$type'] === 'function') {
            try {
                var funcType  = target['_TYPE'] ? target['_TYPE'] : _parseFunc(target.toString());
                obj['params'] = funcType['params'];
                obj['return'] = funcType['return'];
            } catch (_err) {
                obj['params'] = [];
            }
        }
    // step : array
    } else if (Array.isArray(target)) {
        if (target.length ===  1 && Array.isArray(target[0])) {
            obj['$type'] = 'choice';
            if (target[0].length === 0) obj['kind'] = '_ANY_';
            else obj['kind'] = _getKeyCode(target[0][0]);
            obj['list'] = obj['kind'] ? target[0].slice(1) : target[0];
        } else {
            obj['$type'] = 'array';
            if (target.length === 0) obj['kind'] = '_ANY_';
            else obj['kind'] = _getKeyCode(target[0]);
            obj['list'] = obj['kind'] ? target.slice(1) : target;
        }
        if (!obj['kind']) obj['kind'] = '_OPT_';
        // kind 검사
        if (obj['$type'] === 'array' && !_hasKindArray(obj['kind'])) throw new ExtendError(/EL01307/, null, [obj['kind']]);
        if (obj['$type'] === 'choice' && !_hasKindChoice(obj['kind'])) throw new ExtendError(/EL01308/, null, [obj['kind']]);

    // step : object
    } else if (_isFillObj(target) || _isEmptyObj(target)) {
        obj['$type'] = 'union';
    
    // REVIEW:  기타 모든 함수는 object 로 처리한다. 더 좋은 방법이 있으면 대체 한다.
    } else {
    // } else if(_isPrimitiveObj(type)) {
        obj['$type'] = 'object';
    }
    // } else throw new ExtendError(/EL01309/, null, []);    // REVIEW: 커버리지 확인시 주석 처리
    return obj;
}
Type.extendType = extendType;

/**
 * 원본타입에 대상타입이 덮어쓰기가 허용 가능한지 검사합니다.  
 * 원본타입에 대상타입으로 캐스팅이 가능하지 확인합니다.
 * @param {any} extType 원본 타입
 * @param {any} tarType 대상 타입
 * @param {number} opt 허용옵션 : 0 = 기본, 1 = 타입생성 비교 
 * @param {string?} pathName '' 공백시 성공
 * @returns {throw?}
 */
function _execAllow(extType, tarType, opt, pathName) {
    var eType = extendType(extType);
    var tType = extendType(tarType);
    var prop = {};
    var sExt = eType.toString(), sTar = tType.toString();
    
    pathName = pathName ? pathName : 'extType';
    if (pathName !== 'extType' || !pathName) prop['error path'] = pathName;
    opt = opt || 0;

    // if (_isObject(eType['ref']) && _isObject(tType['ref']) && deepEqual(eType, tType)) return; // REVIEW: 필요없어  보이지만 잠시 남겨둠
    // origin seq, opt 필수 검사
    if (eType['kind']) {
        if ((eType['kind'] === '_SEQ_' || eType['kind'] === '_OPT_' || eType['kind'] === '_REQ_' || eType['kind'] === '_EUM_'|| eType['kind'] === '_DEF_') 
        && eType['list'].length === 0) {
            throw new ExtendError(/EL01201/, prop, ['extType', sExt]);
        }
    }
    // tarType seq, opt 필수 검사
    if (tType['kind']) {
        if ((tType['kind'] === '_SEQ_' || tType['kind'] === '_OPT_' || tType['kind'] === '_REQ_'  || tType['kind'] === '_EUM_'|| tType['kind'] === '_DEF_') 
        && tType['list'].length === 0) {
            throw new ExtendError(/EL01201/, prop, ['tarType', sTar]);
        }
    }
    //  원본은 초이스가 아니고, tarType choice 의 인 경우
    if (eType['$type'] !== 'choice' && tType['$type'] === 'choice' ) {
        var choType = { $type: 'choice', kind: '_REQ_', list: [extType] };
        _execAllow(choType, tarType, opt, pathName);
        return;
    }
    // check allow type
    if (_isLeafType(eType['$type'])) {
        if(typeof eType['default'] !== 'undefined' && eType['default'] !== null && !_equalLiternal(eType['default'], tType['default'])) {
            throw new ExtendError(/EL01202/, prop, [eType['$type'], eType, tType]);
        }
        if (eType['$type'] !== tType['$type']) throw new ExtendError(/EL01203/, prop, [eType['$type'], tType['$type']]);
    
    } else if (eType['$type'] === 'array')  $arrayAllow();
    else if (eType['$type'] === 'choice') $choiceAllow();
    else if (eType['$type'] === 'class') $classAllow();
    else if (eType['$type'] === 'union') $unionAllow();
    else if (eType['$type'] === 'function') $functionAllow();
    else throw new ExtendError(/EL01204/, prop, []);

    // inner function
    function $arrayAllow() {
        if (tType['$type'] !== 'array' || !Array.isArray(tType['list'])) throw new ExtendError(/EL01211/, prop, [tType['$type']]);
        
        // _ALL_ (all)
        if (eType['kind'] === '_ALL_') {
            return;

        // _ANY_ (any)
        } else if (eType['kind'] === '_ANY_') {
            if (tType['kind'] === '_ANY_') return;
            if (tType['kind'] === '_ALL_' || tType['kind'] === '_OPT_') {
                throw new ExtendError(/EL01212/, prop, [sTar]);
            }
            return;

        // _SEQ_ (sequence)
        } else if (eType['kind'] === '_SEQ_') {
            if (eType['kind'] !== tType['kind'])  throw new ExtendError(/EL01213/, prop, [tType]);
            if (eType['list'].length > tType['list'].length) {
                throw new ExtendError(/EL01214/, prop, [eType.list.length, tType.list.length]);
            }

            // element check
            for (var i = 0; i < eType['list'].length; i++) {
                try {
                    _execAllow(eType['list'][i], tType['list'][i], opt, pathName);
                } catch (error) {
                    throw new ExtendError(/EL01215/, error, [i]);
                }
            }
            return;
        
        // _REQ_ (require)
        } else if (eType['kind'] === '_REQ_') {
            if (tType['kind'] === '_ALL_' || tType['kind'] === '_ANY_' || tType['kind'] === '_OPT_') {
                throw new ExtendError(/EL01216/, prop, [eType['$type'], sTar]);
            }

        // _OPT_ (option)
        } else if (eType['kind'] === '_OPT_') {
            if (tType['kind'] === '_ALL_' || tType['kind'] === '_ANY_' ) {
                throw new ExtendError(/EL01217/, prop, [eType['$type'], sTar]);
            }
        
        // _ETC_
        } else {
            throw new ExtendError(/EL01218/, prop, [eType['kind']]);
        }

        // element check
        for (var k = 0; k < tType['list'].length; k++) {
            var success = false;
            for (var j = 0; j < eType['list'].length; j++) {
                try {
                    if (success) break;
                    if (extendType(tType['list'][k])['$type'] === 'choice' && extendType(eType['list'][j])['$type'] !== 'choice' ) {
                        var oriChoice = { $type: 'choice', kind: '_OPT_', list: eType['list'] };
                        _execAllow(oriChoice, tType['list'][k], opt, pathName);
                    } else {
                        _execAllow(eType['list'][j], tType['list'][k], opt, pathName);
                    }
                    success = true;
                } catch (error) {
                    continue;
                }
            }
            if (!success) throw new ExtendError(/EL01219/, prop, [eType, tType]);
        }
    }

    function $choiceAllow() {
        // _ALL_ (all)
        if (eType['kind'] === '_ALL_') {
            if (tType['$type'] === tType['$type'] && tType['kind'] === '_ERR_') {
                throw new ExtendError(/EL01221/, prop, [eType['$type'], sTar]);
            }
            return;

        // _ANY_ (any)
        } else if (eType['kind'] === '_ANY_') {
            if (tType['$type'] === 'undefined') throw new ExtendError(/EL01222/, prop, ['_ANY_', 'undefined']);
            if (eType['$type'] === tType['$type'] && (tType['kind'] === '_ALL_' || tType['kind'] === '_OPT_' || tType['kind'] === '_ERR_' || tType['kind'] === '_NON_')) {
                throw new ExtendError(/EL01223/, prop, [sTar]);
            }
            return;
        
        // _NON_ 
        } else if  (eType['kind'] === '_NON_') {
            if (eType['$type'] !== tType['$type'] || eType['kind'] !== tType['kind']) {
                // 4
                throw new ExtendError(/EL01224/, prop, [sTar]);
            }
            return;

        // _ERR_ (error)
        } else if (eType['kind'] === '_ERR_') {
            if (eType['$type'] !== tType['$type'] || eType['kind'] !== tType['kind']) {
                // 5
                throw new ExtendError(/EL01225/, prop, [sTar]);
            }
            return;

        // _REQ_ (require)
        } else if (eType['kind'] === '_REQ_') {
            if (eType['$type'] === tType['$type'] && (tType['kind'] === '_ALL_' || tType['kind'] === '_ANY_' 
            || tType['kind'] === '_OPT_' || tType['kind'] === '_NON_' || tType['kind'] === '_ERR_')) {
                // 6
                throw new ExtendError(/EL01226/, prop, [sTar]);
            }

        // _OPT_ (option)
        } else if (eType['kind'] === '_OPT_') {
            if (tType['$type'] === 'undefined') return;
            if (eType['$type'] === tType['$type'] && (tType['kind'] === '_ALL_' || tType['kind'] === '_ANY_' 
            || tType['kind'] === '_NON_' || tType['kind'] === '_ERR_')) {
                // 7
                throw new ExtendError(/EL01227/, prop, [sTar]);
            }
        
            // _EUN_ (enumeration)
        } else if (eType['kind'] === '_EUM_') {
            if (eType['$type'] !== tType['$type'] || eType['kind'] !== tType['kind']) {
                throw new ExtendError(/EL01228/, prop, []);
            }
            for (var i = 0; i < eType['list'].length; i++) {
                if (!_isLiteral(eType['list'][i])) throw new ExtendError(/EL01229/, prop, [i, extendType(eType['list'][i])]);
            }
            for (var j = 0; j < tType['list'].length; j++) {
                if (!_isLiteral(tType['list'][j])) throw new ExtendError(/EL0122A/, prop, [j, extendType(tType['list'][j])]);
            }

        // _DEF_ (default)
        } else if (eType['kind'] === '_DEF_') {
            if (eType['$type'] !== tType['$type'] || eType['kind'] !== tType['kind']) {
                throw new ExtendError(/EL0122B/, prop, []);
            }
            if (!_isLiteral(eType['list'][0])) throw new ExtendError(/EL0122C/, prop, [extendType(eType['list'][0])]);
            if (!_isLiteral(tType['list'][0])) throw new ExtendError(/EL0122D/, prop,  [extendType(tType['list'][0])]);

        // _ETC_
        } else {
            throw new ExtendError(/EL0122E/, prop, [eType['kind']]);
        }

        // element check
        var arrTarget = (tType['kind']) ? tType['list'] : [tarType];
        for (var m = 0; m < arrTarget.length; m++) {
            var success = false;
            for (var n = 0; n < eType['list'].length; n++) {
                try {
                    if (success) continue;
                    _execAllow(eType['list'][n], arrTarget[m], opt, pathName);
                    success = true;
                } catch (error) {
                    continue;
                }
            }
            if (!success) throw new ExtendError(/EL0122F/, prop, [m, eType, extendType(arrTarget[m])['$type']]);
        }
    }
    
    function $classAllow() {
        var oriObj;
        var tarObj;
        if (tType['$type'] === 'class') {         // # class to class
            if (isProtoChain(tType['ref'], eType['ref'])) return undefined;   // 1.proto check
            if (opt === 1) {
                try {
                    // 생성비교
                    oriObj = new eType['ref']();
                    tarObj = new tType['ref']();
                    return _execAllow(oriObj, tarObj, opt, pathName);
                } catch (error) {
                    throw new ExtendError(/EL01231/, error, []);
                }                    
            }
            throw new ExtendError(/EL01232/, prop, [opt]);

        } else if (tType['$type'] === 'union') {  // # class to union
            if (opt === 1) {
                try {
                    // 생성비교
                    oriObj = new eType['ref']();
                    return _execAllow(oriObj, tType['ref'], opt, pathName);
                } catch (error) {
                    throw new ExtendError(/EL01233/, error, []);
                }                    
            }
            throw new ExtendError(/EL01234/, prop, [opt]);

        }
        throw new ExtendError(/EL01235/, prop, [tType]);
    }

    function $unionAllow() {
        var list;

        if (tType['$type'] !== 'union') throw new ExtendError(/EL01241/, prop, [tType]);
        list = getAllProperties(eType['ref']);

        for (var i = 0; i < list.length; i++) {
            var key = list[i];
            if (!(key in tType['ref'])) throw new ExtendError(/EL01242/, prop, [key, typeOf(extType[key])]);      
            try {
                _execAllow(eType['ref'][key], tType['ref'][key], opt, pathName);
            } catch (error) {
                throw new ExtendError(/EL01243/, error, [key]);
            }
        }
    }

    function $functionAllow() {
        if (tType['$type'] !== 'function')  throw new ExtendError(/EL01251/, prop, [tType]);
        if (eType['ref'] === Function) return;
        // special type check
        if (eType['name']) {
            if (eType['name'] === tarType.name  
            || eType['name'] === tType['name'] 
            || (tType['func'] && eType['name'] === tType['func'].name)) return;
            throw new ExtendError(/EL01252/, prop, [eType['name'], tType.name]);
        }
        if (eType['func']) {
            if (typeof tType['func'] !== 'function') throw new ExtendError(/EL01253/, prop, []);
            if (isProtoChain(tType['func'], eType['func'])) return;
            throw new ExtendError(/EL01254/, prop, []);
        }

        if (!eType['return'] && (!eType['params'] || eType['params'].length === 0)) return;
        if (typeof tType['params'] === 'undefined' && typeof tType['return'] === 'undefined') { 
            throw new ExtendError(/EL01255/, prop, [extendType(eType.params), typeOf(eType.return)]);
        }
        if (Array.isArray(eType['params']) && eType['params'].length > 0) {  
            try {   // params check
                _execAllow(['_SEQ_'].concat(eType['params']), ['_SEQ_'].concat(tType['params']), opt, pathName);
            } catch (error) {
                throw new ExtendError(/EL01256/, error, []);
            }
        }
        if (eType['return']) {            
            try {   // return check
                _execAllow(eType['return'], tType['return'], opt, pathName);
            } catch (error) {
                throw new ExtendError(/EL01257/, error, []);
            }
        }
    }
}

/**
 * 타입을 검사하여 메세지를 리턴
 * @param {any} extType 검사할 타입 , extType 
 * @param {any} target 검사대상
 * @param {number} [opt] 허용옵션 : 0 = 기본, 1 = 타입생성 비교 
 * @param {string} [pathName] '' 공백시 성공
 * @throws {ExtendError}
 */
function _execMatch(extType, target, opt, pathName) {
    var eType = extendType(extType);
    var tType = extendType(target);
    var prop = {};
    var sExt = eType.toString(), sTar = tType.toString();
    
    pathName = pathName ? pathName : 'extType';
    if (pathName !== 'extType') prop['error path'] = pathName;    // TODO: 'target' 명칭의 중복 수정필요
    opt = opt || 0;

    // seq, opt 필수 검사
    if (eType['kind']) {
        if ((eType['kind'] === '_SEQ_' || eType['kind'] === '_OPT_' || eType['kind'] === '_REQ_' || eType['kind'] === '_EUM_'|| eType['kind'] === '_DEF_') 
        && (typeof eType['ref'] === 'undefined' || eType['list'].length === 0)) {
            throw new ExtendError(/EL01101/, prop, ['extType', sExt]);
        }
    }

    // check match type
    if (eType['$type'] === 'null') {
        if (target !== null) throw new ExtendError(/EL01102/, prop, ['null', sTar]);
    
    } else if (eType['$type'] === 'undefined') {
        if (typeof target !== 'undefined') throw new ExtendError(/EL01102/, prop, ['undefined', sTar]);
    
    } else if (eType['$type'] === 'string') {
        if (typeof eType['default'] === 'string' && typeof target === 'undefined') target = eType['default'];
        if (typeof target !== 'string') throw new ExtendError(/EL01102/, prop, ['string', sTar]);
    
    } else if (eType['$type'] === 'number') {
        if (typeof eType['default'] === 'number' && typeof target === 'undefined') target = eType['default']; 
        if (typeof target !== 'number') throw new ExtendError(/EL01102/, prop, ['number', sTar]);
    
    } else if (eType['$type'] === 'boolean') {
        if (typeof eType['default'] === 'boolean' && typeof target === 'undefined') target = eType['default'];
        if (typeof target !== 'boolean') throw new ExtendError(/EL01102/, prop, ['boolean', sTar]);
    
    } else if (eType['$type'] === 'bigint') {    // ES6+
        if (typeof eType['default'] === 'bigint' && typeof target === 'undefined') target = eType['default'];
        if (typeof target !== 'bigint') throw new ExtendError(/EL01102/, prop, ['bigint', sTar]);
    
    } else if(eType['$type'] === 'symbol') {    // ES6+
        if (typeof target !== 'symbol') throw new ExtendError(/EL01102/, prop, ['symbol', sTar]);
    
    } else if (eType['$type'] === 'regexp') {
        if (eType['default'] && eType['default'] !== null && typeof target === 'undefined') target = eType['default'];
        if (!(target instanceof RegExp)) throw new ExtendError(/EL01102/, prop, ['regexp', sTar]);
    
    } else if (eType['$type'] === 'object') {
        if (tType['$type'] !== 'object') throw new ExtendError(/EL01102/, prop, ['object', sTar]);

    } else if (eType['$type'] === 'array') $arrayMatch();
    else if (eType['$type'] === 'choice') $choiceMatch();
    else if (eType['$type'] === 'class') $classMatch();
    else if (eType['$type'] === 'union') $unionMatch();
    else if (eType['$type'] === 'function') $functionMatch();        
    else throw new ExtendError(/EL01103/, prop, []);

    // inner function
    function $arrayMatch() {
        if (!Array.isArray(target)) throw new ExtendError(/EL01111/, prop, [sTar]);
        
        // _ALL_ (all)
        if (eType['kind'] === '_ALL_') {      
            return;

        // _ANY_ (any)
        } else if (eType['kind'] === '_ANY_') {
            if (target.length === 0) throw new ExtendError(/EL01112/, prop, [target.length]);
            return;

        // _SEQ_ (sequence)
        } else if (eType['kind'] === '_SEQ_') {
            if (eType['list'].length > target.length) throw new ExtendError(/EL01113/, prop, [eType['list'].length, tType['list'].length]);    // REVIEW: 세부정보 표현
            for(var i = 0; i < eType['list'].length; i++) {
                var _elem   = eType['list'][i];
                var _tar    = tType['list'][i];
                if (_isLiteral(_elem)) {
                    if (!_equalLiternal(_elem, _tar)) throw new ExtendError(/EL01114/, prop, [i, _elem, _tar]);
                } else {
                    try {
                        _execMatch(_elem, _tar, opt, pathName);
                    } catch (error) {
                        throw new ExtendError(/EL01115/, error, [i, typeOf(_elem)]);
                    }
                }
            }
            return;

        // _REQ_ (require)
        } else if (eType['kind'] === '_REQ_') {
            if (target.length === 0) throw new ExtendError(/EL01116/,  prop, [target.length]);

        // _OPT_ (option)
        } else if (eType['kind'] === '_OPT_') {
            if (Array.isArray(target) && target.length === 0) return;

        // _ETC_
        } else {
            throw new ExtendError(/EL01117/,  prop, [eType['kind']]);
        }
        

        // element check
        for (var k = 0; k < target.length; k++) {
            var tar = target[k];
            var success = false;
            for (var j = 0; j < eType['list'].length; j++) {
                try {
                    var elem = eType['list'][j];
                    if (_isLiteral(elem)) {
                        if (_equalLiternal(elem, tar)) {
                            success = true;
                            break;
                        }
                    } else {
                        _execMatch(elem, tar, opt, pathName);    // REVIEW: pathName + '['+i+']'  이렇게 들어가야 함
                        success = true;
                        break;
                    }
                } catch (error) {
                    continue;
                }
            }
            if (!success) {
                throw new ExtendError(/EL01118/, prop, [eType.toString(), tType.toString()]);
            }
        }
    }

    function $choiceMatch() {
        // _ALL_ (all)
        if (eType['kind'] === '_ALL_') {
            return undefined;

        // _ANY_ (any)
        } else if (eType['kind'] === '_ANY_') {
            if (typeof target !== 'undefined') return undefined;
            throw new ExtendError(/EL01121/, prop, []);

        // _NON_ (none)
        } else if (eType['kind'] === '_NON_') {
            if (typeof target === 'undefined') return undefined;
            throw new ExtendError(/EL01122/, []);
            
        // _ERR_ (error)
        } else if (eType['kind'] === '_ERR_') {
            if (target instanceof Error) return undefined;
            throw new ExtendError(/EL01123/, []);

        // _REQ_ (require)
        } else if (eType['kind'] === '_REQ_') {

        // _OPT_ (option)
        } else if (eType['kind'] === '_OPT_') {
            if (typeof target === 'undefined') return undefined;

        // _EUN_ (enumeration)
        } else if (eType['kind'] === '_EUM_') {
            for (var i = 0; i < eType['list'].length; i++) {
                if (!_isLiteral(eType['list'][i])) throw new ExtendError(/EL01124/, prop, [i, typeOf(eType['list'][i])]);
            }

        // _DEF_ (default)
        } else if (eType['kind'] === '_DEF_') {
            if (!_isLiteral(eType['list'][0])) throw new ExtendError(/EL01125/, prop, [typeOf(eType['list'][0])]);
            if (typeof target === 'undefined') {
                target = eType['list'][0];
                return undefined;
            }
            // _IDX_ (index)
            // } else if (eType['kind'] === '_IDX_') {
            /**
             * POINT:
             * - 검사
             *  + target object 검사
             *  -\+ 파라메터 2개 검사
             * 
             * - 인덱스 타입 목록 추출
             * 
             * - 초이스로 변환
             *  + 허용타입들 + 
             * 
             * this.command = [['_AND_',  { aa: 1 }, ClassA ]]
             * [['_IDX_', String]]
             * [['_KEY_', Number, String, '리터럴']]
             * 
             * this.command = [['_AND_', [['_IDX_', String]], [['_KEY_', Number, String, '리터럴']] ]]
             * 
             * 마지막에 리턴 및 실패 처리
             */

            /**
             * - 검사
             *  + 타겟의 object 여부 검사
             *  + 파라메터 1개 이상 검사
             * - 조건문 처리
             *  + 둘다 성공해야 성공
             */
            // POINT: 개발 해야함
            // if (eType['list'].length === 0) throw new ExtendError('TODO: IDX 는 검사 타입이 없습니다. 하나이상 있어야 합니다.', prop, []);
            // if (tType['$type'] !== 'union') throw new ExtendError('TODO: IDX 는 검사 대상이 object(union) 타입만 가능합니다.', prop, ['object', sTar]);

            // for(var i = 0; i < eType['list'].length; i++) {
            //     var _elem   = eType['list'][i];
                
            //     // var _tar    = tType['list'][i];
            //     try {
            //         _execMatch(_elem, target);
            //     } catch (error) {
            //         throw new ExtendError('TODO: ', error, []);
            //     }
                
            // }
        
        // _ETC_
        } else {
            throw new ExtendError(/EL01126/,  prop, [eType['kind']]);
        }

        // element check
        for (var j = 0; j < eType['list'].length; j++) {
            try {
                var elem = eType['list'][j];
                if (_isLiteral(elem)) {
                    if (_equalLiternal(elem, target)) return undefined;
                } else {
                    return _execMatch(elem, target, opt, pathName);
                }
            } catch (error) {
                continue;
            }
        }
        throw new ExtendError(/EL01127/, prop,[eType, tType]);
    }

    function $classMatch() {
        if (tType['$type'] === 'class') {         // # class to class
            if (typeof eType['ref'] === 'undefined') return undefined;  // 전역 클래스 타입
            if (isProtoChain(tType['ref'], eType['ref'])) return undefined;
        } else if (typeof target === 'object') {    // # class to typeof 'object'
            if (target instanceof extType) return undefined;     
            if (!_isBuiltFunction(extType) && target !== null && opt === 1) {
                try {
                    var subPath = pathName === 'extType' ? '<instance>' : pathName + '<instance>';
                    return _execMatch(_creator(extType), target, opt, subPath);
                } catch (error) {
                    throw new ExtendError(/EL01131/, error);
                }
            }
            throw new ExtendError(/EL01132/, prop, [_typeName(extType)]);
        }
        throw new ExtendError(/EL01133/, prop, [tType]);                
    }

    function $unionMatch() {
        var list;
        
        if (tType['$type'] !== 'union') throw new ExtendError(/EL01141/, prop, [tType]);
        list = getAllProperties(eType.ref);

        for (var i = 0; i < list.length; i++) {
            var key = list[i];
            var listDefType = extendType(extType[key]);
            // REVIEW: for 위쪽으로 이동 검토!
            if (key === '_interface' || key === 'isImplementOf') continue;             // 예약어
            // REVIEW: 재귀로 구현 체크
            // default 설정
            if (typeof listDefType['default'] !== 'undefined' && listDefType['default'] !== null && typeof target[key] === 'undefined') target[key] = listDefType['default'];
            // POINT:
            // if (target !== null && !(key in target)) throw new ExtendError(/EL01142/, prop, [key, typeOf(extType[key])]);    
            try {
                var subPath = pathName +'[\''+ key+'\']';
                _execMatch(extType[key], target[key], opt, subPath);
            } catch (error) {
                throw new ExtendError(/EL01143/, error, [key]);
            }
        }
    }

    function $functionMatch() {
        if (tType['$type'] !== 'function') throw new ExtendError(/EL01151/, prop, [tType]);
        if (eType['ref'] === Function) return;
        // special type check
        if (eType['name']) {
            if (eType['name'] === target.name 
            || eType['name'] === tType['name'] 
            || (tType['func'] && eType['name'] === tType['func'].name)) return;
            throw new ExtendError(/EL01152/, prop, [eType['name'], target.name]);
        }
        if (eType['func']) {
            if (typeof tType['func'] !== 'function') throw new ExtendError(/EL01153/, prop, []);
            if (isProtoChain(tType['func'], eType['func'])) return;
            throw new ExtendError(/EL01154/, prop, []);
        }

        if (!eType['return'] && (!eType['params'] || eType['params'].length === 0)) return;
        if (typeof tType['params'] === 'undefined' && typeof tType['return'] === 'undefined') { 
            throw new ExtendError(/EL01155/, prop, [extendType(eType.params), typeOf(eType.return)]);
        }
        // params check
        if (Array.isArray(eType['params']) && eType['params'].length > 0) {  
            try {
                _execAllow(['_SEQ_'].concat(eType['params']), ['_SEQ_'].concat(tType['params']), opt, pathName);
            } catch (error) {
                throw new ExtendError(/EL01156/, error, []);
            }
        }
        // return check
        if (eType['return']) {            
            try {
                _execAllow(eType['return'], tType['return'], opt, pathName);
            } catch (error) {
                throw new ExtendError(/EL01157/, prop, []);
            }
        }
    }
}

/**
 * Verify that the extension type allows the target type.  
 * 
 * @param {any} extType Extension Type
 * @param {any} tarType What type to check
 * @param {number} [opt=0] Allow option (0 = Keep existing, 1 = Create class type)
 * @returns {throw?} Exception occurs if extension type does not allow target type
 */
function allowType(extType, tarType, opt) {
    try {
        _execAllow(extType, tarType, opt);
    } catch (error) {
        throw new ExtendError(/EL0130A/, error);
    }
}
Type.allowType = allowType;

/**
 * Verify that the extension type matches the target.  
 * 
 * @param {any} extType Extension Type
 * @param {any} target For inspection
 * @param {number} [opt=0] Allow option (0 = Keep existing, 1 = Create class type)
 * @returns {throw?} Exception occurs when failing
 */
function matchType(extType, target, opt) {
    try {
        _execMatch(extType, target, opt);
    } catch (error) {
        throw new ExtendError(/EL0130B/, error);
    }
}
Type.matchType = matchType;

/**
 * Determine whether the extension type allows the target type.  
 * 
 * @param {any} extType Extension Type
 * @param {any} target Type to be examined
 * @param {number} opt Allow option (0 = Keep existing, 1 = Create class type)
 * @returns {boolean} whether to allow ('true' or 'false')
 */
function isAllowType(extType, target, opt) {
    try {
        _execAllow(extType, target, opt);
    } catch (error) {
        return false;
    }
    return true;
}
Type.isAllowType = isAllowType;

/**
 * Verify that the extension type matches the target.  
 * 
 * @param {any} extType Extension Type
 * @param {any} target Type to be examined
 * @param {number} [opt] Allow option (0 = Keep existing, 1 = Create class type)
 * @returns {boolean} Match or not ('true' or 'false')
 */
function isMatchType(extType, target, opt) {
    try {
        _execMatch(extType, target, opt);
        return true;
    } catch (error) {
        return false;
    }
}
Type.isMatchType = isMatchType;

export default Type;
export { Type };