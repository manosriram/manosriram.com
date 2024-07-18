+++
author = "manosriram"
title = "lsof linux command"
date = "2024-07-18"
description = "Snippets"
in_search_index = true
[taxonomies]
tags = ["linux"]
+++

`lsof` command can be used to get the process/pid of a given file (or anything).


```sh
lsof ./some_file.txt
kill -9 <pid>
```

get the pid using `lsof` and kill the process holding the file. This is not recommended, but it helped me.
