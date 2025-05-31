+++
title = "Key Value Store internals"
description = "Internals of KV store and difference between KV store and a Cache"
date = 2023-11-23T00:00:00Z
updated = 2023-11-23T00:00:00Z
draft = false
slug = "key-value-stores"
+++

# Key Value store and a Cache
Doesn't Cache use key value to store objects? Then why do we need a key value store?

The answer is simple, persistence.
A key-value store is a database but instead of tables and other complex stuff, we simply use a key value structure. Cache's main purpose is to increase read performance.
Anything you think doesnt change that often, you can cache it. Whereas, KV store focuses more on writes along with reads.

## Internals of a Key Value store
There are multiple parts for a proper kv store. First one being persistence and how a store writes to disk inorder to store data.

Each entry is written to a file. The structure may vary depending on the implementation, but there will be one active datafile to which the entries are written. When this datafile reaches a threshold size, a new active datafile is created and all the entries will be written in this new datafile. The old datafile is made inactive and it cannot be edited.

If the implementation is based on BitCask, the store will keep track of all kv locations in-memory. The value will be a pointer locating to the disk location so that it'll be a single random access. Whenever the key is updated, the location is also updated.
Hence, any get calls will entirely depend on the in-memory hash table.

Inorder to maintain atomicity and consistency, WAL is created. It stands for Write Ahead Log. Before updating the hash table pointer, we first write it to the disk. We only keep appending the entries to the datafile.

In cases of failure, the kv store restarts. The in-memory hash table now needs the old data, in order to retrieve it we can traverse through all datafile and add the entries which haven't expired yet. The problem with this approach is that, there can be thousands of datafiles, millions of entries; Hence, we do something called a **merge**. At frequent intervals of time (probably when the kv store isnt very active or when idle), we merge and squash the inactive datafiles so that each inactive datafile will contain unexpired entries.

When merging, the new inactive datafile being created can exceed the threshold size; Hence, multiple inactive datafiles are created until needed. But definitely, the number of inactive datafiles after merging will either be equal or decreased.

Inorder to make things more faster, a hintfile is created for each inactive datafile. This hintfile will have the keys, and the location of value and size of the value so that its faster to navigate.