export const logConfig = {
  MORGAN_FORMAT: `
    [
      {
        "request.id": ":id",
        "request.remote.address": ":remote-addr",
        "request.remote.user": ":remote-user",
        "request.timestamp": ":date[iso]",
        "request.method": ":method",
        "request.url": ":url",
        "request.http.version": ":http-version",
        "request.referrer": ":referrer",
        "request.user.agent": ":user-agent",
        "response.status": :status,
        "response.content.length": :res[content-length],
        "response.time": :response-time
      },
      :info,
      :error
    ]
  `,
};
