import {
  SandpackCodeViewer,
  useSandpackConsole,
} from "@codesandbox/sandpack-react";

function stringifyConsoleMessage(msg: unknown): string {
  let message: string;

  try {
    message = JSON.stringify(msg, null, 2);
  } catch (_e) {
    try {
      message = Object.prototype.toString.call(msg);
    } catch (_e) {
      message = `['${typeof msg}']`;
    }
  }

  return message;
}

export function SandpackConsole() {
  const { logs } = useSandpackConsole({
    resetOnPreviewRestart: true,
  });

  const logsData = logs
    .filter(
      (
        log,
      ): log is {
        data: (string | Record<string, string>)[];
        id: string;
        method:
          | "log"
          | "debug"
          | "info"
          | "warn"
          | "error"
          | "table"
          | "clear"
          | "time"
          | "timeEnd"
          | "count"
          | "assert";
      } => log.data !== undefined,
    )
    .map((log) => ({ data: log.data, id: log.id, method: log.method }));

  return (
    <ol className="list-none font-mono">
      {logsData.map((log) => (
        <li
          key={log.id}
          className="p-2 border-b border-b-foreground/50 last:border-b-0"
        >
          {log.data.map((data, index) => {
            let key: string;

            try {
              key = `${index}-${data}`;
            } catch (_e) {
              key = `${index}`;
            }

            if (typeof data === "string") {
              return (
                <p key={key} className="text-foreground">
                  {data}
                </p>
              );
            }

            let children: string;

            if (data !== null && typeof data["@t"] === "string") {
              children = data["@t"];
            } else {
              children = stringifyConsoleMessage(data);
            }

            return (
              <span key={key} className="[&_code]:p-0! [&_code]:ml-0!">
                <SandpackCodeViewer showTabs={false} code={children} />
              </span>
            );
          })}
        </li>
      ))}
    </ol>
  );
}
