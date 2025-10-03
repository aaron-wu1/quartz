---
date: 2025-10-02
tags:
  - summary
  - "#operating-systems"
  - "#file-system"
  - "#unix"
  - "#system-design"
  - "#file-system-implementations"
---
source: https://dl.acm.org/doi/pdf/10.1145/361011.361061

Q: What aspects of Unix as described in the 1974 paper do not survive today, or have been considerably changed?
- Inode size determined by highest bit and inode bit for "large" and "small files"
- surprisingly most haven't changed a lot 
## Abstract
UNIX is a general-purpose, multi-user, interactive operating system for PDP-11/40 and 11/45 computers.
Features:
1. Hierarchical file system incorporating demountable volumes
2. Compatible file, device, and inter-process I/O
3. Ability to initiate asynchronous processes
4. System command language selectable on per-user basis
5. over 100 subsystems including a dozen languages

## Introduction
Goals:
- simplicity
- elegance
- ease of use
Major Programs:
- shell
	- reads user commands, separate from the kernel
- assembler
	- translate assembly code -> machine code
- text editor based on QED
	- ancestor of `ed` and later `vi`
- linking loader
	- combines object files (from assembler or compiler) and "loads" the program into memory for execution
	- now called linker + loader
- symbolic debugger
	- step through programs, set breakpoints, and inspect variables using symbolic names
- compiler for a language resembling BCPL with types and structures 
	- later know as C
- interpreter for a dialect of BASIC
- text formatting program
	- `roff` and later `troff`
- Fortran compiler
	- allowed scientists to port numerical and engineering code to UNIX
- Snobol interpreter
	- Snobol = string-processing language (think regex-heavy scripting)
- top-down compiler-compiler (TMG)
	- help people build their own compiler
- bottom-up compiler-compiler (YACC)
	- yet another compiler compiler
- form letter generator
- marco processor (M6)
	- defines macros to reuse code
- premuted index program
	- make keyword-in-context indexes

## Hardware and Software Environment
UNIX implemented on a PDP-11/45 
- 16-bit word (8-bit byte) computer with 144K bytes of core memory
	- UNIX occupies 42K bytes
- 1M byte fixed-head disk for file system storage
- 4 moving-head disk drives 2.5M bytes on removable disk cartidges
- 1 moving-head disk drive uses 40M byte disk packs
Most of UNIX is written in C
- wrote it in assembly at first but rewrote it in C
- It's larger but it's easier to understand and modify and sharable code

## The File System
Three kinds of files: ordinary disk files, directories, and special files
### Ordinary disk files
File contains whatever the user places on it. The structure of files is controlled by the programs that use them, not the system (thinking of .mp4s or .txt all defined by usage)

### Directories
- Provides mapping between names of files and the files themselves, thus induce a structure on the file system as a whole
- Behaves same as an ordinary file except it cannot be written on by unprivileged programs
- System maintains several directories for its own use
	- *root* directory - starting point for system files
	- *commands* directory - contains all the programs for general use, its not necessary for a program to be here though
- Introduction of *path name* with slashes for directories
	- `.` = directory itself
	- `..` = parent of the directory
- *linking* - same non-directory file may appear in several directories with different names
### Special Files
Each I/O device supported by UNIX is associated with at least one such file. Special files are read and written just like ordinary disk files, but requests to read or write result in activation of the associated device
- resides in `/dev`
Advantages:
- file and device I/O are as similar as possible
- file and device names have the same syntax and meaning
- special files are subject to the same projection mechanism as regular files

### Removable File Systems
Although the root of the file system is always stored on the same device, it is not necessary that the entire file system hierarchy reside on this device

Introducing the *mount* system!
Two arguments:
- name of an existing ordinary file
- name of direct-access special file whose associated storage should have the structure of an independent file system (format disk)

How does it work?
- create references to ordinary file to refer to the root of the removable volume
	- replaces leaf of the hierarchy tree (ordinary file) with a whole new subtree (hierarchy on removable volume)
- after *mount* there's no distinction between files on removable volume and those in the permanent file system

One rule:
- no link may exist between one file system hierarchy to another
- avoid handling inconsistency if a volume is dismounted
	- wondering what their design choice here was... did they just say ahhh lets worry about this later just don't do this
### Protection
Each user is assigned a unique user id
When a file is created
- it marks the user ID of its owner
- given set of seven protection bits
	- 6 for read, write, exec for owner, exec for all other users
	- last bit to *set-user-id* of file to whoever is running it for privileged programs
		- allows access to files forbidden to other programs
"Super-user" - exempt from the usual constraints on file access
### I/O Calls
New:
- size of file determined by highest byte written
- Each call can get an error return
- no distinction between sequential and random access
	- old storage devices (tape drives...) are inherently sequential
	- disk drives supported random block access - think spindle + actuator
	- prior OS had programmers declare whether to use sequential or direct access and each type had their own APIs
	- UNIX flattened it all
Programmatically I/O:
- filep = open (name, flag) - open file
	- *flag* - indicator for type of open (read, write, or updated (read and write))
	- *filep* - file descriptor

No user-visible locks in file system, nor restriction on the number of users who may have a file open for reading or writing
- their justification:  they don't deal with large, single-file databases maintained by independent processes
- claim: sufficient internal interlocks to maintain the logical consistency of the file system when two users engage simultaneously

Random access - jump to any position in file
- location = seek(filep, base, offset)
- for devices that are sequentials, seek is ignored

## Implementation of the File System
A directory entry contains only a name for the associated file and a pointer to the file itself
- The pointer is called the *i-number* for index number of the file
- when file is accessed i-number is used as an index into the a system table (*i-list*)
- *i-node* - entry in *i-list* and contains:
	- who the owner is
	- protection bits
	- physical disk or tape addresses for file contents
	- its size
	- time of last modification
	- num of links to the file, num of times it appears in a directory
	- bit indicating whether the file is a directory
	- bit indicating whether the file is a special file
	- bit indicating whether the file is "large" or "small"
- file lifecycle
	- new file is created, inode allocated
	- removing file - decrement link-count in inode
	- when link-counts of a directory = 0, any disk blocks in the file are freed

How mount works in FS?
- *mount* system call
- mount maintains a system table whose argument is i-number and device name of the ordinary file specified during the *mount*, and whose corresponding value is the device name of the indicated special file

How about reading and writing?
 - Uses a buffering mechanism to reduce I/O operations, (read and write to buffer)
 - UNIX will search its buffers to see whether the affected disk block resides in core memory, if not, it will be read in from the device. Then the affected byte is replaced in the buffer and an entry is made in a list of blocks to be written
## Processes and Images
- *image* is a computer execution environment (memory layout of a process)
	- includes a core image, general register values, status of open files, current director and the like
	- current state of a pseudo computer
- *process* is an execution of an image
	- image must be in core while processor is executing on behalf of a process
- User-core part of an image is divided into three logical segments
	- **text segment** at location 0 in the virtual address space
		- during execution, this segment is write protected and a single copy of it shared among all processes
	- **data segment** first 8K byte boundary in virtual address space begins a non-shared, writable data segment
	- **stack segment** starting at the highest address in the virtual addr space, grows downward
### Processes
New process - *fork* system call
`processid = fork(label)`
Fork has different return points, so it can determine if it's a child or not, diff pid

### Pipes
Processes may communicate with related processes using same system *read* and *write* calls for file system I/O
`filep = pipe()`

### Execution of Programs
`execute(file, args, argo, ..., arg,+)`

### Process Synchronization
`processid = wait( )`

### Termination
`exit(status)`

## The Shell
Command line interpreter - read lines from user and execute other programs
- runs files with file name or checks `/bin/`
### Standard I/O
`< or >` makes teh process' file descriptors 0 or 1
- fd 0 stdin (`<`), fd 1 stdout (`>`)

### Filters
`|` execute commands simultaneously and arrange the std output of the command to be delivered to the standard input of the next command (pipes)

### Command Separators: Multitasking
`;` inline commands
`&` will not wait for command to finish before prompting

### The Shell as a Command: Command files
The shell itself is a command and may be called recursively

### Implementation of the Shell
- Majority of time is waiting
- when user enters command and new line
	- shell parses command into execute syscall
	- fork is called to spin up the process
	- attempts to execute
	- waits for child to die, if `&` shell skips wait
	- when child dies, shell returns to prompt

### Initialization
`init` process per terminal that users might log into
- if user is logged in successfully change to their directory

### Other Programs as Shell
- Init invokes the shell to interpret command lines

### Traps
When faults cause the processor to trap to a system routine, the system terminates the process and writes the user's image on file core in the current directory to be debugged

## Perspective
Design:
- easy to write, test and run programs
- severe size constrains had to make it small
- self maintenance, modularity, debugging, separation of concerns
	- no control blocks (eg. complicated structures that are partially maintained by other system calls)

