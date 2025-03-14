# Chichingx

This is a NES emulator originally written in C# circa 2008, to learn Silverlight and WPF, and for fun.  Online documentation in that era wasn't as complete as it is now, so it has some legacy bugs, but runs lots of titles, though has issues in advanced mappers - the only working MMC3 title is Super Mario Bros 2 since it doesn't use the scanline counting feature.

Has since been ported to javascript, and mostly serves as a fun way to practice various UI techniques.

It's last incarnation had a bunch of angular 6 stuff I don't intend to keep, UI is being trimmed down and rewritten

Until I reimplement the gamepad config, here's the keybindings:

Arrows - D-pad
S - Start
D- Select
Z - B
X - A

Roadmap / Ideas:
    - Reimplementing debugging tools in React, focus on instruction history and frame events / timing
        - Use those tools to track down 20 year old timing bugs in the emulator itself (mapper 7)
    - Migrate emulator itself to assembly script (or just plain C? WASM package)
    - Fix sound sync issue (used to rely on Atomics. to sync audio and video but browser support removed due to SPECTRE years ago )
    - Reimplement old settings page / gamepad config
    - Explore using WebRTC for two player?

