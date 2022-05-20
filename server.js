const http = require("http");

const todos = [
  { id: 1, text: "todo1" },
  { id: 2, text: "todo2" },
  { id: 3, text: "todo3" },
];

const server = http.createServer((req, res) => {
  const { method, url } = req;
  let body = [];
  req
    .on("data", (chunk) => {
      body.push(chunk);
    })
    .on("end", () => {
      body = Buffer.concat(body).toString();
      let status = 404;

      const response = {
        succcess: false,
        data: null,
        error: null,
      };

      if (method === "GET" && url === "/todos") {
        status = 200;
        response.succcess = true;
        response.data = todos;
      } else if (method === "POST" && url === "/todos") {
        const { id, text } = JSON.parse(body);
        if (!text || !id) {
          status = 400;
          response.error = "Please input id and text";
        } else {
          todos.push({ id, text });
          status = 201;
          response.succcess = true;
          response.data = todos;
        }
      }
      res.writeHead(status, {
        "Content-Type": "application/JSON",
        "X-Powered-By": "Node.js",
      });

      res.end(JSON.stringify(response));
    });
});

const PORT = 5050;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
