+++
title = "Handling concurrency in KeyValue stores"
description = "Concurrency in golang using Locks"
date = 2023-12-10T00:00:00Z
updated = 2023-12-10T00:00:00Z
draft = false
slug = "key-value-concurrency"
+++

Key value stores might seem simple from outer view. We set and get the values which I thought the same. However, things get tricky as we dive deep. The problem is that, what happens if few processes write a key at the same time, and few processes read the same key.

We can actually simulate this using `goroutines` in golang.

```go
numGoRoutines := 1000
wg := sync.WaitGroup{}
wg.Add(numGoRoutines)

for i := 0; i < numGoRoutines; i++ {
	kv := &nimbusdb.KeyValuePair{
		Key:   []byte(fmt.Sprintf("%d", i)),
		Value: []byte(fmt.Sprintf("testvalue%d", i)),
	}
	go func() {
		defer wg.Done()
		writtenKvPair, err = d.Set(kv)
	}()
}
wg.Wait()
```

The above code creates 1000 goroutines each setting a different value. But, the problem is that multiple go routines can touch the variable where the keyvalue pairs are stored. Why is that a problem? Because we want to be 100% sure that only one process is using the variable at a given moment, which you might have guessed that we'll use locks.

```go
func (b *BTree) Set(key []byte, value KeyDirValue) *KeyDirValue {
	b.mu.Lock()
	defer b.mu.Unlock()
	i := b.tree.ReplaceOrInsert(&item{key: key, v: value})
	if i != nil {
		return &i.(*item).v
	}
	return nil
}
```

The `b.mu` is of type `sync.RWMutex` meaning it has both shared and exclusive locks available. In the Set function above we use `.Lock()` which means it is a exclusive lock. Any other goroutine cannot access the region until we call `.Unlock()`

```go
func (b *BTree) Get(key []byte) *KeyDirValue {
	b.mu.RLock()
	defer b.mu.RUnlock()
	i := b.tree.Get(&item{key: key})
	if i != nil {
		return &i.(*item).v
	}
	return nil
}
```

However, in the `.Get()` function,  we use `.RLock()` since we allow multiple process reading a value.

This command `go test ./tests -v --race` can be run to check for race conditions.

The above code is from a key-value store which I'm writing from scratch. You can find it [here](https://github.com/manosriram/nimbusdb)