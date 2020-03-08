import faker from 'faker';
import uuid from 'uuid/v4';

const code = `

\tprocessor 6502
\tinclude "vcs.h"
\tinclude "macro.h"

\torg  $f000

; Now we're going to drive the TV signal properly.
; Assuming NTSC standards, we need the following:
; - 3 scanlines of VSYNC
; - 37 blank lines
; - 192 visible scanlines
; - 30 blank lines

; We'll use the VSYNC register to generate the VSYNC signal,
; and the VBLANK register to force a blank screen above
; and below the visible frame (it'll look letterboxed on
; the emulator, but not on a real TV)

; Let's define a variable to hold the starting color
; at memory address $81
BGColor\tequ $81

; The CLEAN_START macro zeroes RAM and registers
Start\tCLEAN_START

NextFrame
; Enable VBLANK (disable output)
\tlda #2
        sta VBLANK
; At the beginning of the frame we set the VSYNC bit...
\tlda #2
\tsta VSYNC
; And hold it on for 3 scanlines...
\tsta WSYNC
\tsta WSYNC
\tsta WSYNC
; Now we turn VSYNC off.
\tlda #0
\tsta VSYNC

; Now we need 37 lines of VBLANK...
\tldx #37
LVBlank\tsta WSYNC\t; accessing WSYNC stops the CPU until next scanline
\tdex\t\t; decrement X
\tbne LVBlank\t; loop until X == 0

; Re-enable output (disable VBLANK)
\tlda #0
        sta VBLANK
; 192 scanlines are visible
; We'll draw some rainbows
\tldx #192
\tlda BGColor\t; load the background color out of RAM
ScanLoop
\tadc #1\t\t; add 1 to the current background color in A
\tsta COLUBK\t; set the background color
\tsta WSYNC\t; WSYNC doesn't care what value is stored
\tdex
\tbne ScanLoop

; Enable VBLANK again
\tlda #2
        sta VBLANK
; 30 lines of overscan to complete the frame
\tldx #30
LVOver\tsta WSYNC
\tdex
\tbne LVOver
\t
; The next frame will start with current color value - 1
; to get a downwards scrolling effect
\tdec BGColor

; Go back and do another frame
\tjmp NextFrame
\t
\torg $fffc
\t.word Start
\t.word Start
`;

const getProject = () => ({
  id: uuid(),
  name: faker.name.title(),
  description: faker.lorem.sentence(),
  code,
  likes: faker.random.number(1000),
  liked: faker.random.boolean(),
  createdAt: faker.date.past(),
  user: {
    id: uuid(),
    name: faker.name.findName()
  }
});

export const getProjectAsync = async () => {
  await new Promise(r => setTimeout(r, 1000));
  return getProject();
};

export const getProjects = count => {
  let projects = [];
  for (let i = 0; i < count; i++) {
    projects[i] = getProject();
  }

  return projects;
};

export const getProjectsAsync = async count => {
  await new Promise(r => setTimeout(r, 1000));
  return getProjects(count);
};
