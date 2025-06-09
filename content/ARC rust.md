
Atomic Reference Counter pointer - thread safe smart pointer that allows multiple parts of your program to share ownership of some data


Why arc?
- Rust by default allow only one owner to have mutable access to data
- When multiple threads need access to that data, ARC handles the access safely

How?
- Internally, `Arc` keeps a **reference count** of how many owners exist.
- When you clone an `Arc`, you get a new pointer to the same data, and the count increases.
- When an `Arc` is dropped, the count decreases.
- When count reaches zero, the data is freed.