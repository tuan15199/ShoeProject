const PROXY_CONFIG = [
  {
      context: [
          "/catalogs",
          "/brands",
          "/simpleProducts",
          "/users/signin"
      ],
      target: "localhost:8080",
      secure: false
  }
]
module.exports = PROXY_CONFIG;