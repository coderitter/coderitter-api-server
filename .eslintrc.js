module.exports =
{
  "root": true,
  "parserOptions": {
    "project": ["tsconfig.json"],
  },
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint"
  ],
  "extends": [
  ],
  "rules": {
    "no-console": 1,
    "semi": [1, "never"],
    "camelcase": 1,
    "object-curly-newline": 1, // enforce consistent line breaks after opening and before closing braces
    "brace-style": [1, "stroustrup"],
    "indent": [1, 4],
    "no-trailing-spaces": 1,
    "no-multi-spaces": 1,
    "quotes": [1, "single", { "avoidEscape": true, "allowTemplateLiterals": true }],
    "no-unused-vars": 0,
    "@typescript-eslint/no-unused-vars": 1,

    "@typescript-eslint/array-type": 1, //new --> only use type[] for array declaration
    "@typescript-eslint/consistent-type-definitions": [1, "interface"], //prefer interface , avoid type
    //"@typescript-eslint/explicit-function-return-type": [1, {"allowExpressions": true}],
    "@typescript-eslint/explicit-member-accessibility": [1, { "accessibility": "no-public" }],
    "@typescript-eslint/member-delimiter-style": [1, {
      "multiline": {
        "delimiter": "none",    // 'none' or 'semi' or 'comma'
        "requireLast": false
      }
    }],
    "@typescript-eslint/naming-convention": [1,
      { "selector": "default", "format": ["strictCamelCase"] },
      {
        "selector": "variable",
        "types": ["boolean"],
        "format": ["camelCase"],
        "prefix": ["is", "should", "has", "can", "did", "will"]
      },
      { "selector": "class", "format": ["StrictPascalCase"] },
      { "selector": "enum", "format": ["StrictPascalCase"] },
      { "selector": "interface", "format": ["StrictPascalCase"] },
      { "selector": "objectLiteralMethod", "format": ["StrictPascalCase", "strictCamelCase"] },
      { "selector": "enumMember", "format": ["UPPER_CASE"] },
      { "selector": "typeParameter", "format": ["UPPER_CASE"] },
      { "selector": "memberLike", "modifiers": ["private"], "format": ["strictCamelCase"], "leadingUnderscore": "require" }
    ],
    "@typescript-eslint/no-empty-interface": 1,
    // "@typescript-eslint/no-explicit-any" : 1,
    "@typescript-eslint/no-extra-non-null-assertion": 1, //bitte wer macht sowas überhaupt?!
    "@typescript-eslint/no-for-in-array": 1, //für array gilt eigl "for of", for in iteriert über die indices als string und lässt lücken im array aus
    "@typescript-eslint/no-misused-promises": 1,
    "@typescript-eslint/no-this-alias": 1
  }
}