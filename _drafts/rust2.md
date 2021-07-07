---
title: learning rust 2 (modules, collections)
tags: rust programming
layout: posts
---
* modules group definitions together, making it easier to navigate the code. You use modules to organize your code just like a filesystem:

```
mod front_of_house {
    mod hosting {
        fn add_to_waitlist() {}

        fn seat_at_table() {}
    }

    mod serving {
        fn take_order() {}

        fn serve_order() {}

        fn take_payment() {}
    }
}
```

* in the module tree there are two forms for the path of a function: absolute and relative
* absolute: starts from the `crate` root using a crate name or `crate` itself
* relative: starts from the current module and uses `self`, `super`, or the indentifier of the current module
* asking how to call a function is the same as asking what is the path of the function.

*in lib.rs:*
```
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}

        fn seat_at_table() {}
    }

    mod serving {
        fn take_order() {}

        fn serve_order() {}

        fn take_payment() {}
    }
}

pub fn eat_at_restaurant() {
    // absolute path
    crate::front_of_house::hosting::add_to_waitlist();
    // relative path
    front_of_house::hosting::add_to_waitlist();
}
```

* `pub` makes a function public and signifies this is part of a library's public API.
* in Rust everything is private by default. Items in parent modules can't use private items inside child modules (unless those things are marked `pub`, but items in child modules can use items in their parent modules. This is also true for scructs. For enums, however, if you make the enum public its contents are also public.
* we can also brings paths into scope more succinctly by making a symbolic link with `use`:

*(note the `pub` signifier that makes it available in outside functions besides eat_at_restaurant)*
```
pub use crate::front_of_house::hosting;

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
}
```
* the idiomatic way to use `use` is, for functions, to bring the parent module into scope as above; for structs and enums, you should specify the whole path. for example:

```
use std::collections::HashMap;

fn main() {
    let mut map = HashMap::new();
    map.insert(1, 2);
}
```

* you can rename a `use` scope with `as`, helpful when things have the same name:

```
use std::fmt::Result;
use std::io::Result as IoResult;

fn function() -> Result {
    ...
}

fn function() -> IoResult<()> {
    ...
}
```

* `use` is also how we bring in dependencies (listed in the `cargo.toml` file or from the `std` library) into our projects:

```
use rand::Rng;

fn main() {
    let secret_number = rand::thread_rng().gen_range(1..101);
}
```

* you can bring in multiple items with nested paths:

```
use std::cmp::Ordering;
use std::io;

// becomes

use std::{cmp::Ordering, io};
```

* even for subpaths of one another:

```
use std::io;
use std::io::Write;

// becomes

use std::{self, Write};
```

* or bring in all public items from a scope with glob:

```
use std::collections::*
```

* using this `use` syntax with `mod` and `pub` you can easily seperate modules out across multiple files:

*in lib.rs:*
```
mod front_of_house;
// with a semicolon at the end of this mod
// we are saying to load the module from a different file
// which will contain a public module called hosting 
// which contains a public function called add_to_waitlist

pub use crate::front_of_house::hosting;

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist();
}
```

* we could further nest this by making a `front_of_house` directory with a `hosting.rs` file containing simply:

```
pub fn add_to_waitlist () {}
```
*and `front_of_house.rs` containing:*

```
pub mod hosting;
```

* so the `lib.rs` file looks for the `front_of_house.rs` file which looks for a nested `hosting.rs` file. The previous `use` is still valid:

```
pub use crate::front_of_house::hosting
```

### standard library collections

* the standard library includes a number of useful data structures called collections. These represent multiple values and are stored on the heap so their sizes do not have to be known at compile and they can be dynamic. We've already messed about with String, which is one of them.

* the other two important ones that will cover most use cases: vectors and hashmaps.

#### Vector

* `Vec<T>` is a vector. Vectors are implemented using generic types specified in the place of `T`

```
let v: Vec<i32> = Vec::new();
```

* however if you create a vector with initial values , Rust can infer the type from the values. There is a macro available for this situation:

```
let v = vec![1, 2, 3];
// this will create vector of type i32
```

* add elements to a mutable vector, Rust infers i32 type:

```
let mut v = Vec::new();

v.push(5);
v.push(6);
```

* vectors are dropped when they go out of scope
* you can access elements by index or a get method:

```
let v = vec![1, 2, 3, 4, 5];

let third: &i32 = &v[2];
println!("The third element is {}", third);
// this gives a reference to the value

match v.get(2) {
    Some(third) => println!("The third element is {}", third),
    None => println!("There is no third element"),
}
// this returns a Option<&T>
```

* if you try to access the index of a vector that doesn't exist: `[]` will crash and `.get` will return `None` and keep running
* remember you can't have mutable and immutable references in the same scope so:

```
let mut v = vec![1, 2, 3, 4, 5];
let first = &v[0];
v.push(6);
println!("The first element is {}", first);
// this code will not compile
```

* we iterate over all elements of a vector instead of accessing them index

```
let v = vec![1, 2, 3, 4, 5];
for i in &v {
    println!("{}", i);
}
```

* we can do this in a mutable vector to change each element:

```
let mut v = vec![1, 2, 3, 4, 5];
for i in &mut v {
    *i += 50;
}
// note how we have dereference (*) i to get its value
```

* since vectors can only store one type, we can store an enum (storing different types) in our vector

```
enum SpreadsheetCell {
    Int(i32),
    Float(f64),
    Text(String),
}

let row = vec![
    SpreadsheetCell::Int(3),
    SpreadsheetCell::Text(String::from("blue")),
    SpreadsheetCell::Float(10.12),
];
```

#### Hashmaps!
* `HashMap<K, V>` stores key value pairs. Useful when you want look up data not by index, but by a key:

```
use std::collections::HashMap;

let mut scores = HashMap::new();

scores.insert(String::from("blue"), 10);
scores.insert(String::from("yellow"), 50);
```

* all hashmap keys need to have the same type and all values need to have the same type, like vectors. 

* another way to create a hashmap is to create a vector of keys and a vector of values and collect them:

```
use std::collections::HashMap;

let team = vec![String::from("blue"), String::from("yellow")];
let scores = vec![10, 50];

let mut scores: HashMap<_, _> = 
    teams.into_iter().zip(scores.into_iter()).collect();
```

* `HashMap<_, _>` is the usual syntax here so that Rust can infer the data types from the vectors.
* adding values to a Hashmap invalidates the original variables just like `Copy`
* you can access a value from a hashmap using `get` method. `Get` always returns an `Option<&V>`

```
use std::collections::HashMap;

let mut scores = HashMap::new();

scores.insert(String::from("blue"), 10);
scores.insert(String::from("yellow"), 50);

let team_name = String::from("blue");
let score = scores.get(&team_name);

// and we can iterate through hashmaps

for (key, value) in &scores {
    println!("{}: {}", key, values);
}
```

* using the `insert` method on the same key more than once will overwrite the orignal value by default
* we can only insert a value if the key has no value using `entry` and `or_insert`:

```
use std::collections::HashMap;

let mut scores = HashMap::new();
scores.insert(String::from("Blue"), 10);

scores.entry(String::from("Yellow")).or_insert(50);
scores.entry(String::from("Blue")).or_insert(50);
// this checks whether the entry exists, and insert the value if its doesn't
// this will be much cleaner than trying to write the logic ourselves

println!("{:?}", scores);
```

* we can also update a value based on a previous value using `entry` and `or_insert` as before:

```
use std::collections::HashMap;

let text = "hello world wonderful world";

let mut map = HashMap::new();

for word in text.split_whitespace() {
    let count = map.entry(word).or_insert(0);
    // if entry doesn't find the word it adds a 0 value to the word (key)
    // if it finds it, it dereferences the value and adds 1 to it (below)
    *count += 1;
}

println!("{:?}", map);
```
