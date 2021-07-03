const jwt = require("jsonwebtoken");

//시크릿 키는 복잡할 수록 좋다.
const token = jwt.sign({test: true}, 'my-secret-key')

console.log(token);

// token을 검증한다.
const decoded = jwt.verify(token, "my-secret-key")
console.log(decoded);