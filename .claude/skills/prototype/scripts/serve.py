#!/usr/bin/env python3
"""Static file server for the prototypes, with caching turned off.

    python3 .claude/skills/prototype/scripts/serve.py [port]

Why this exists rather than `python3 -m http.server`: that server sends no
Cache-Control header, so browsers apply a heuristic freshness lifetime and keep
serving a page they already have. The symptom is nasty because it looks like a
bug in the work — you edit index.html or a file in _shared/, reload, and the old
version comes back. It cost real time twice while building admin-legal.

So every response says no-store. A prototype server has nothing to gain from
caching: the files are local and tiny, and the whole point is to see an edit.
"""
import http.server
import os
import sys


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()

    # One line per request is useful; the default logs are the same but noisier
    # about the HTTP version, which nobody reading this output cares about.
    def log_message(self, fmt, *args):
        sys.stderr.write("%s %s\n" % (self.address_string(), fmt % args))


def main() -> int:
    port = int(sys.argv[1] if len(sys.argv) > 1 else os.environ.get("PORT") or 4321)
    http.server.test(HandlerClass=NoCacheHandler, port=port, bind="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
