Space efficient data structure that quickly checks if given element **e** is **not in** the dataset. 

## How?
- Uses multiple hash functions that hash e
- For every result, if the hash has a bit of 1, turn bit in an comparison vector to 1.
- Given new element **e'**. If for all hashes of **e'**, for all the 1 bits, the comparison vector has the same 1 bits, **e'** **might** be in the dataset. 
- If one of the hashes' 0 bits don't match up with the comparison vector. It's **guaranteed** that **e'** is not in the dataset.
