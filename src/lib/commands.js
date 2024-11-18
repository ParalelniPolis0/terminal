export const commands = {
    help: {
        f: ({ term }, input) => {
            term.writeln(`there is no help yet`);
        },
    },
    ls: {
        f: ({ term }, input) => {
            term.writeln(Object.keys(term.commands).sort().join(" "))
        }
    },
    date: {
        f: ({ term }) => {
            term.writeln(new Date().toString())
        }
    },
    uptime: {
        f: ({ term }) => {
            term.writeln(` ${new Date().toLocaleTimeString()} up 16 days, 12:14, 1 user, load average: 0.00, 0.00, 0.00`)
        }
    }
};