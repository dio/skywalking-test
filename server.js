const apm = require("skywalking-apache").default;
apm.start({
  serviceName: process.env.SERVICE_NAME,
  instanceName: process.env.INSTANCE_NAME,
});

const http = require("http");

const server = new http.Server(async (_, res) => {
  await delay();
  if (process.env.NEXT_SERVICE_HOST_PORT) {
    console.log(
      `[${process.env.SERVICE_NAME}] calling ${process.env.NEXT_SERVICE_HOST_PORT}`
    );
    console.log(
      `[${process.env.SERVICE_NAME}]`,
      await get(`http://${process.env.NEXT_SERVICE_HOST_PORT}/call`)
    );
  }
  res.end(JSON.stringify({ name: process.env.SERVICE_NAME }));
});

function delay() {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
}

function get(endpoint) {
  return new Promise((resolve) => {
    http.get(endpoint, (res) => {
      let rawData = "";
      res.on("data", (chunk) => {
        rawData += chunk;
      });
      res.on("end", () => {
        resolve(rawData);
      });
    });
  });
}

server.listen(process.env.PORT);
