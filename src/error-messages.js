/**** error-messages.js | Internal error message templates ****/
const message = {
    "ES010": "Other errors",
    "ES011": "Failed to get module ['$1']",
    "ES012": "Failed to get function ['$1'()",
    "ES013": "[$1] failed to process [$2]",
    "ES021": "[$1] can only be of type [$2]",
    "ES022": "[$1] is an unprocessable typo",
    "ES023": "[$1] is not type [$2]",
    "ES031": "[$1] is not an object",
    "ES032": "[$1] is not an instance of [$2]",
    "ES033": "The object in [$1] is different from [$2]",
    "ES041": "[$1] is duplicated with [$2]",
    "ES042": "[$2] exists in [$1] and cannot measure [$3]",
    "ES043": "[$1] cannot be added because [$1] exists in [$1] ",
    "ES044": "[$1] is a reserved word ",
    "ES051": "Required value [$1] not found",
    "ES052": "[$1] requires [$2]",
    "ES053": "[$2] does not exist in [$1]",
    "ES054": "[$1] cannot be blanked",
    "ES061": "Exceeded the range [$2] of [$1]",
    "ES062": "[$1] cannot be less than [$2]",
    "ES063": "[$1] and [$2] have different lengths",
    "ES064": "and(&) condition check failed. $1",
    "ES065": "Or(|) condition check failed. $1",
    "ES066": "[$1] ranges from [$2] to [$3]",

    // util-type.js match
    "EL01101": "Type match: You must specify a detailed type of $1.$1: $2",
    "EL01102": "Type match : target is not type '$1'. tarType : $2",
    "EL01103": "Type match: cannot handle type",

    // match array
    "EL01111": "Array match: target is not array type. tarType: $1",
    "EL01112": "Array match : array(_ANY_) type must have at least one element of target array. target.length = $1",
    "EL01113": "Array match: target array is less than array(_SEQ_) type length. extType.length = $1, target.length = $2",
    "EL01114": "Array match: array(_SEQ_) [$1]th literal type is different from target value. extType[$1] = $2, target[$1] = $3",
    "EL01115": "Array match: array(_SEQ_) [$1]th type check failed. extType[$1] = $2",
    "EL01116": "Array match : array(_REQ_) type must have at least one element of target array. target.length = $1",
    "EL01117": "Array match : array($1) is the type of array that cannot be handled",
    "EL01118": "Array match: array element check failed. extType: $1, tarType: $2",

    // match choice
    "EL01121": "Choice match: 'undefined' is not available for choice(_ANY_) type",
    "EL01122": "Choice match: 'undefined' only for choice(_NON_) type",
    "EL01123": "Choice match: Error instance only for choice(_ERR_) type",
    "EL01124": "Choice match: choice(_EUM_) type details can only be literal. extType[$1]: $2",
    "EL01125": "Choice match: the first subtype of choice(_DEF_) type is literal only. extType[0]: $1",
    "EL01126": "Choice match : choice($1) is a type of choice that cannot be handled",
    "EL01127": "Choice match: choice detailed type check failed. extType: $1, tarType: $2",

    // match class
    "EL01131": "Class match: Inspection failed after creating class type as union type (opt = 1)",
    "EL01132": "Class match: target is not an instance of [$1]",
    "EL01133": "Class match: target is not class, object, or union type. tarType: $1",

    // match union
    "EL01141": "Union match: target is not union type. tarType: $1",
    "EL01142": "Union match: target['$1'] key does not exist. extType['$1'] = $2",
    "EL01143": "Union match: '$1' type check failed",

    // match function
    "EL01151": "Function match: target is not function type. tarType: $1",
    "EL01152": "Function match: declared extType.name = '$1' and target name do not match: function.name = '$2'",
    "EL01153": "Function match : declared extType.func, target.func is not function type",
    "EL01154": "Function match: extType.func and target.func are different (proto check)",
    "EL01155": "Function match: You must set the params or return object of the target. extType.param = $1, extType.return = $2",
    "EL01156": "Function match: params acceptance test denied. <array(_SEQ_) conversion>",
    "EL01157": "Function Match: Return Acceptance Test Denied",

    // allow
    "EL01201": "Type allowed: You must specify a subtype of $1.$1: $2",
    "EL01202": "Type allowed: different from type 1 literal value. extType = $2, tarType = $3",
    "EL01203": "Type allowed: not type $1. tarType = $2",
    "EL01204": "Type allowed: type not processable",

    // allow array
    "EL01211": "Array permit: Not array type. tarType: $1",
    "EL01212": "Type allowed: array(_ALL_, _OPT_) type is not allowed for array(_ANY_) type. tarType: $1",
    "EL01213": "Allow array: Only array(_SEQ_) type is allowed for array(_SEQ_) type. tarType: $1",
    "EL01214": "Array permit: tarType must be equal to or greater than the length of array(_SEQ_) type of extType.length = $1, target.length = $2",
    "EL01215": "Array Allowance: array(_SEQ_) [$1]th type check failed",
    "EL01216": "Allow array : Do not allow array(_ALL_, _ANY_, _OPT_) type for array(_REQ_). tarType: $2",
    "EL01217": "Allow array: Do not allow array(_ALL_, _ANY_) type for array(_OPT_). tarType: $2",
    "EL01218": "Allow array : array($1) is the type of array that cannot be handled",
    "EL01219": "Array element check failed. extType: $1, tarType: $2",

    // allow choice
    "EL01221": "Choice allowed: do not allow choice(_ERR_) type for choice(_ALL_). tarType: $1",
    "EL01222": "Choice allowed: 'undefined' type is not allowed for choice(_ANY_) type",
    "EL01223": "Choice allowed: choice(_NON_, _ERR_) type is not allowed for choice(_ANY_) type. tarType: $1",
    "EL01224": "Choice allowed: only choice(_NON_) type and choice(_NON_) type. tarType: $1",
    "EL01225": "Choice allowed: choice(_ERR_) type and choice(_ERR_) type only. tarType: $1",
    "EL01226": "Choice allowed: do not allow choice(_ALL_, _ANY_, _OPT_, _NON_, _ERR_) type for choice(_REQ_). tarType: $1",
    "EL01227": "Choice allowed: do not allow choice(_ALL_, _ANY_, _NON_, _ERR_) type for choice(_OPT_). tarType: $1",
    "EL01228": "Choice allowed: choice(_EUM_) type and choice(_EUM_) type only",
    "EL01229": "Choice allowed: choice(_EUM_) subtype can only be literal. extType[$1]: $2",
    "EL0122A": "Choice allowed: the subtype of tarType choice(_EUM_) can only be literal. tarType[$1]: $2",
    "EL0122B": "Choice allowed: choice(_DEF_) type and choice(_DEF_) type only",
    "EL0122C": "Choice allowed: the first subtype of extType choice(_DEF_) is literal only. extType[0]: $1",
    "EL0122D": "Choice allowed: the first subtype of tarType choice(_DEF_) is literal only. tarType[0]: $1",
    "EL0122E": "Choice allowed: choice($1) is a type of choice that cannot be handled",
    "EL0122F": "Choice allowed: tarType[$1] = $3, no extType allowed. extType = $2",

    // allow class
    "EL01231": "Class allowed: ExtType, tarType class failed after creating a union type. (opt = 1)",
    "EL01232": "Class allowed: class to class denied. (opt = $1)",
    "EL01233": "Class allowed: Inspection failed after creating tarType class type as union type (opt = 1)",
    "EL01234": "Class allowed: class to union denied. (opt = $1)",
    "EL01235": "Class allowed: tarType is not class, union type. tarType: $1",

    // allow union
    "EL01241": "Union allowed: tarType is not a union type. tarType: $1",
    "EL01242": "Union allowed: tarType['$1'] key does not exist. extType['$1'] = $2",
    "EL01243": "Union allowed: Type '$1' check failed",

    // allow function
    "EL01251": "Allow function : tarType is not function type. tarType : $1",
    "EL01252": "Function allowed: declared extType.name = '$1' and target name do not match: function.name = '$2'",
    "EL01253": "Function allowed: declared extType.func, target.func is not of function type",
    "EL01254": "Function allowed: extType.func and target.func are different (proto check)",
    "EL01255": "Function permit: params or return object of tarType must be set. extType.param = $1, extType.return = $2",
    "EL01256": "Function permit: params permit test denied. <array(_SEQ_) conversion>",
    "EL01257": "Function Permitted: Return Permitted Test Denied",

    // util-type.js
    "EL01301": "Parcing check: function is not a rule: '$1'",
    "EL01302": "Parcing inspection: function has no argument, body content. '$1'",
    "EL01303": "Parcing inspection: function parsing failed $1",
    "EL01304": "Type check: [$1] is a special type to handle",
    "EL01305": "Type check: array($1) type is a specular type that cannot be handled",
    "EL01306": "Type check: choice($1) type is a special type that cannot be handled",
    "EL01307": "Type check: array($1) type is a type that cannot be handled",
    "EL01308": "Type check: choice($1) type is a type that cannot be handled",
    "EL01309": "REVIEW:",
    "EL0130A": "Type allowed: allowType (extType, tarType) scan failed",
    "EL0130B": "Type match: matchtype (extType, target) check failed",
    "EL0130C": "ctor is not function type. type aperture = $1"
};

export default Object.freeze(message);
