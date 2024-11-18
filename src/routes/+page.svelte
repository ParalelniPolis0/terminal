<script>
    import { Xterm, XtermAddon } from "@battlefieldduck/xterm-svelte";
    import { commands } from "$lib/commands.js";
    import "../app.css";

    let term;
    let command = "";
    const logo = `\x1b[33m                  __     
                /'__\`\\   
 _____   _____ /\\ \\/\\ \\  
/\\ '__\`\\/\\ '__\`\\ \\ \\ \\ \\
\\ \\ \\L\\ \\ \\ \\L\\ \\ \\ \\_\\ \\
 \\ \\ ,__/\\ \\ ,__/\\ \\____/
  \\ \\ \\/  \\ \\ \\/  \\/___/ 
   \\ \\_\\   \\ \\_\\         
    \\/_/    \\/_/         \x1b[0m`;

    let options = {
        fontFamily: "Departure Mono",
        //fontFamily: '"Cascadia Code", Menlo, monospace',
        cursorBlink: true,
    };

    async function onLoad() {
        console.log("Child component has loaded");

        term.commands = commands;
        term.prompt = () => {
            command = "";
            term.write("\x1b[33manon\x1b[0m@pp0# ");
        };
        term.focus();

        // FitAddon Usage
        const fitAddon = new (await XtermAddon.FitAddon()).default.FitAddon();
        term.loadAddon(fitAddon);
        fitAddon.fit();

        term.writeln(logo.split("\n").join("\r\n") + "\n");
        term.writeln("pp0-terminal v0.01 (2024-11-18)\r\n");
        term.prompt();
    }

    function onData(e) {
        switch (e) {
            case "\u0003": // Ctrl+C
                term.write("^C");
                term.prompt(term);
                break;
            case "\r": // Enter
                runCommand(term, command);
                command = "";
                break;
            case "\u007F": // Backspace (DEL)
                // Do not delete the prompt
                if (term._core.buffer.x > 2) {
                    term.write("\b \b");
                    if (command.length > 0) {
                        command = command.slice(0, command.length - 1);
                    }
                }
                break;
            default: // Print all other characters for demo
                if (
                    (e >= String.fromCharCode(0x20) &&
                        e <= String.fromCharCode(0x7e)) ||
                    e >= "\u00a0"
                ) {
                    command += e;
                    term.write(e);
                }
        }
    }

    async function runCommand(term, text) {
        const command = text.trim().split(" ")[0];
        if (command.length > 0) {
            term.writeln("");
            if (command in commands) {
                await commands[command].f(
                    { term },
                    text.trim().split(" ")[1]?.split(" "),
                );
                term.prompt();
                return;
            }
            term.writeln(`${command}: command not found`);
            term.prompt();
        } else {
            term.write("\r\n");
            term.prompt();
        }
    }
</script>

<Xterm
    bind:terminal={term}
    {options}
    {onLoad}
    {onData}
    style="width: 99vw; height: 98vh;"
/>
