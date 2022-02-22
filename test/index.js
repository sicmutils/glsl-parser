const test = require("tape");
const path = require("path");
const fs = require("fs");

const TokenString = require("glsl-tokenizer/string");
const ParseArray = require("../direct");

const expectSelectors = require("./selectors-expected.json");
const fixture = path.join(__dirname, "fixture.glsl");

[false].forEach(function (streaming) {
  const prefix = (streaming ? "stream" : "sync") + ": ";

  test(prefix + "scope", function (t) {
    getAST(streaming, function (err, ast) {
      if (err) return t.fail(err.message);

      const actual = Object.keys(ast.scope).sort();
      const expect = [
        "a",
        "b",
        "c",
        "distance",
        "eigth",
        "empty",
        "emptyname",
        "emptynameemptyname",
        "fifth",
        "first",
        "forwarddecl",
        "fourth",
        "gary",
        "main",
        "one",
        "position",
        "proj",
        "second",
        "seventh",
        "sixth",
        "texcoord",
        "third",
        "two",
        "vPosition",
        "vTexcoord",
        "view",
        "www",
        "xxx",
      ];

      t.deepEqual(expect, actual, "contains all expected values in root scope");
      t.equal(ast.scope.xxx.type, "ident", 'xxx.type === "ident"');
      t.equal(
        ast.scope.gary.parent.type,
        "struct",
        'gary.parent.type === "struct"'
      );
      t.equal(
        ast.scope.vTexcoord.parent.parent.token.type,
        "keyword",
        'vTexcoord.parent.parent.token.type === "keyword"'
      );

      t.end();
    });
  });
});

function getAST(_streaming, done) {
  const src = fs.readFileSync(fixture, "utf8");
  const tokens = TokenString(src);
  const ast = ParseArray(tokens);

  done(null, ast);
}
