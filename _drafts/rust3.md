---
title: learning rust 3 (errors, anti-duplication)
tags: rust programming
layout: posts
---

* `panic!` is a macro that prints a failure message, unwinds, cleans up the stack, and then quits. You can call it yourself:

```
fn main() {
    panic!("crash and burn");
}
```

*or it is called automatically by a bug:*

```
fn main() {
    let v = vec![1, 2, 3];

    v[99];
}
```

* you can set `RUST_BACKTRACE=1` with `cargo run` to see a backtrace at the time of error.
* recoverable errors should use `Result` (which is included with prelude like `Option`):

```
enum Result<T, E> {
    Ok(T),
    Err(E)
}

// T is the type if success
// E is the type if error
```

> *sidebar: we can determine what a method returns by purposefully giving it a random type and then compiling.* 

* a `Result` example with std::fs::File (which naturally returns `Result`)

```
use std::fs::File;

fn main() {
    let f = File::open("hello.txt");
}
```

* if `open` succeeds it will return an instance of `Ok` that contains a file handle
* if `open` fails `f` will be an instance of `Err` that contains more information about the error.
* knowing that we can create more defensive programming logic to our function:

```
use std::fs::File;

fn main() {
    let f = File::open("hello.txt");

    let f = match f {
        Ok(file) => file,
        Err(error) => panic!("Problem opening the file: {:?}", error),
    };
}
```

*that is pretty great functionality built in.*

* what if we don't want to panic on every Error but instead want different logic for each Error? Using Errorkind from the standard library which will provide specific types of error messages, we can nest `match` statements looking out for `ErrorKind::NotFound` messages:

```
use std::fs::File;
use std::io::ErrorKind;

fn main() {
    let f = File::open("hello.txt");

    let f = match f {
        Ok(file) => file,
        Err(error) => match error.kind() {
            ErrorKind::NotFound => match File::create("hello.txt") {
                Ok(fc) => fc,
                Err(e) => panic!("problem creating file: {:?}", e);
            }, 
            other_error => {
                panic!("problem opening the file: {:?}", other_error)
            }
        },
    };
}
```

* this works, but has alot of nesting `match` statements going on; a more seasoned coder may do this:

```
use std::fs::File;
use std::io::ErrorKind;

fn main() {
    let f = File::open("hello.txt").unwrap_or_else(|error| {
        if error.kind() == ErrorKind::NotFound {
            File::create("hello.txt").unwrap_or_else(|error| {
                panic!("problem creating file: {:?}", error);
            })
        } else {
            panic!("problem opening the file: {:?}", error);
        }
    });
}
```

* `unwrap` is a shortcut helper method. If it returns `Ok` `unwrap` will return the value inside `Ok`, if it returns `Err` it will call `panic!` for us.
* `unwrap_or_else` extends this provide more functionality on error.
* `expect` is like `unwrap` except you can choose your own `panic!` error messages:

```
use std::fs::File;

fn main() {
    let f = File::open("hello.txt").expect("Failed to open hello.txt");
}
```

* we can have our functions manually return `Result<T, E>`:

```
fn read_username_from_file() -> Result<String, io::Error> {
    let f = File::open("hello.txt");

    let mut f = match f {
        Ok(file) => file,
        Err(e) => return Err(e),
    };

    let mut s = String::new();

    match f.read_to_string(&mut s) {
        Ok(_) => Ok(s),
        Err(e) => Err(e),
    }
}
```

* *if the file succeeds we are taking the file handler from `Ok` and turning it into a string, if that succeeds we are return `Ok` along with that string. If the file open fails or the `read_to_string` fails we return the error message.*


* the `?` operator is a bigtime shortcut for the above functionality. If it is `Ok` it returns the value from `Ok` from the expression. If it is `Err` it will return the error as if the whole function was explicitly returning that error. (It will return it to the place where the function was called from):

```
use std::fs::File;
use std::io;
use std::io::Read;

fn read_username_from_file() -> Result<String, io::Error> {
    let mut f = File.open("hello.txt")?;
    let mut s = String::new();
    f.read_to_string(&mut s)?;
    Ok(s)
}
```

* a note on `?` is that it returns an error through the `from` method which will convert the error in the Type that the function is explicitly set to return.
* `?` also can only be used in functions that return `Result` or `Option` type
* you can chain these methods together for the most razor-like syntax:

```
use std::fs::File;
use std::io;
use std::io::Read;

fn read_username_from_file() -> Result<String, io::Error> {
    let mut s = String::new();

    File::open("hello.txt")?.read_to_string(&mut s)?; 

    Ok(s)
}
```

* since reading from a file is such a common operation, the standard library provides `fs::read_to_string` that does all of the above automatically:

```
use std::fs;
use std::io;

fn read_username_from_file() -> Result<String, io::Error> {
    fs::read_to_string("hello.txt")
}
```

* the `main` function can only be return type `()` or `Result<T, E>`; example of return type `Result`:

```
use std::error::Error;
use std::fs::File;

fn main() -> Result<(), Box<dyn Error>> {
    let f = File::open("hello.txt")?;

    Ok(())
}
```

* return `Result` over `panic!` is generally a good choice.
* when writing examples, use `expect` and `unwrap` as placeholders, this is an understood practice! In your own code you will want to use `Result` and have logic to deal with your error.
* when you are prototyping, using `panic!` is reasonable because you haven't yet chosen how you want to deal with errors.
* when testing you want your code to `panic!` so using `expect` and `unwrap` is exactly the right thing to do.
* using `unwrap` can be legitimate if you have more information than the compiler. If there is logic that makes sure you don't have `Err` variant that the compiler doesn't understand:

```
use std::net::IpAddr;

let home: IpAddr = "127.0.0.1".parse().unwrap();
// this is hardcoded valid string, 
// so we know we can unwrap the parse results.
// if the IP came from a user, we would still want
// a Result returned.
```

* in general, using Rust's type system and compiler checks to avoid errors is your biggest and first line of defense. 
* we can create custom Types for validation purposes; for example if we want to make sure a number is between 1 and 100:

```
pub struct Guess {
    value: i32,
    // it is necessary for this value to be private,
    // so it can't be set directly
    // this ensures that all guesses are being check in the new fn
}

impl Guess {
    pub fn new(value: i32) -> Guess {
        if value < 1 || value > 100 {
            panic!("Guess must be between 1 and 100, input was {}.", value);
        }
        
        // return the guess
        Guess { value }
    }

    pub fn value(&self) -> i32 {
        self.value
    }
    // this is a getter;
    // it is necessary because value in Guess struct is not public
}

```

### remove duplication by extracting a function

*starting with this code:*

```
fn main() {
    let number_list = vec![34, 50, 25, 100, 65];

    let mut largest = number_list[0];

    for number in number_list {
        if number > largest {
            largest = number;
        }
    }

    println!("The largest number is {}", largest);
}
```

* suppose we want to run this function multiple times on different lists?

```
fn largest(list: &[i32]) -> i32 {
    let mut largest = list[0];

    for &item in list {
        if item > largest {
            largest = item;
        }
    }

    largest
}

fn main() {
    let number_list = vec![34, 50, 25, 100, 65];

    let result = largest(&number_list);
    println!("The largest number is {}", result);

    let number_list = vec![102, 34, 6000, 89, 54, 2, 43, 8];

    let result = largest(&number_list);
    println!("The largest number is {}", result);
}
```

* what if want to run a function like that this works for either `i32` or `char`? Time to work with generic data types.
*starting with this code:*

```
fn largest_i32(list: &[i32]) -> i32 {
    let mut largest = list[0];

    for &item in list {
        if item > largest {
            largest = item;
        }
    }

    largest
}

fn largest_char(list: &[char]) -> char {
    let mut largest = list[0];

    for &item in list {
        if item > largest {
            largest = item;
        }
    }

    largest
}

fn main() {
    let number_list = vec![34, 50, 25, 100, 65];

    let result = largest_i32(&number_list);
    println!("The largest number is {}", result);

    let char_list = vec!['y', 'm', 'a', 'q'];

    let result = largest_char(&char_list);
    println!("The largest char is {}", result);
}
```

* the convention for generic type definition is <T>, so:

```
fn largest<T>(list: &[T]) -> T {
    let mut largest = list[0];

    for &item in list {
        if item > largest {
            largest = item;
        }
    }

    largest
}

fn main() {
    let number_list = vec![34, 50, 25, 100, 65];

    let result = largest(&number_list);
    println!("The largest number is {}", result);

    let char_list = vec!['y', 'm', 'a', 'q'];

    let result = largest(&char_list);
    println!("The largest char is {}", result);
}

// this doesn't compile yet!
// because you can only use > operator
// on Types which can be ordered!
// so it won't work for all types
```

* going to revisit this later, but first let's look at using structs with generic types:

```
struct Point<T> {
    x: T,
    y: T,
}

fn main() {
    let integer = Point { x: 5, y: 10 };
    let float = Point { x: 1.0, y: 4.0 };
}
```

* rust can infer the type here, but if you mix it won't work:

```
fn main() {
    let mismatched = Point { x: 5, y: 4.0 }
    // nope
}
```

* we can actually redefine our struct to use two generic types that will work for all the options:

```
struct Point<T, U> {
    x: T,
    y: U,
}

fn main() {
    let both_int = Point { x: 5, y: 10 };
    let both_float = Point { x: 1.0, y: 4.0 };
    let mixed = Point { x: 5, y: 1.0 };
}
```

* this should provide more context for `Option<T>` and `Result<T, E>` which both use generics.
* you can use generics in method definitions too

```
struct Point<T> {
    x: T,
    y: T,
}

impl<T> Point<T> {
    fn x(&self) -> &T {
        &self.x
    }
}

fn main() {
    let p = Point { x: 5, y: 10 };

    println!("p.x = {}", p.x());
}
```

* you can also declare methods only on specific type instances:

```
impl Point<f32> {
    fn distance_from_origin(&self) -> f32 {
        (self.x.powi(2) + self.y.powi(2)).sqrt()
    }
}
```

* you can also use different types in a struct's method definiton than those that are in a struct definition; this wild stuff:

```
struct Point<T, U> {
    x: T,
    y: U,
}

impl<T, U> Point<T, U> {
    fn mixup<V, W>(self, other: Point<V, W>) -> Point<T, W> {
        Point {
            x: self.x,
            y: other.y,
        }
    }
}

fn main() {
    let p1 = Point { x: 5, y: 10.4 };
    let p2 = Point { x: "Hello", y: 'c' };

    let p3 = p1.mixup(p2);

    println!("p3.x = {}, p3.y = {}", p3.x, p3.y);
}
```

### traits

* traits define shared behavior
* *in src/lib.rs:*

```
pub trait Summary {
    fn summarize(&self) -> String;
}
```

* in this trait called Summary is the prototype for a function. These functions must be defined by the type implementing this trait method.
* *in src/lib.rs:*

```
pub struct NewsArticle {
    pub headline: String,
    pub location: String,
    pub author: String,
    pub content: String,
}

impl Summary for NewsArticle {
    fn summarize(&self) -> String {
        format!("{}, by {} ({})", self.headline, self.author, self.location)
    }
}

pub struct Tweet {
    pub username: String,
    pub content: String,
    pub reply: bool,
    pub retweet: bool,
}

impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("{}: {}", self.username, self.content)
    }
}
```

* notice the `impl ... for` syntax.
* the above is than used like:

```
let tweet = Tweet {
    username: String::from("horse_ebooks"),
    content: String::from(
        "Of course, as you probably already know, people",
    ),
    reply: false,
    retweet: false,
};

println("1 new tweet: {}", tweet.summarize());
```

* you can also create a default implementation insted of having to implement seperately:

```
pub trait Summary {
    fn summarize(&self) -> String {
        String::from("...")
    }
}
```

* the syntax for overriding the default implementation is the same as the syntax for creating a seperate implementation, but if we don't define a default implementation then there has to be a seperate implementation.
* you can pass these `impl Trait` as parameters in functions; this parameter accepts any type that implements the given trait.

```
pub fn notify(item: &impl Summary) {
    println!("Breaking news! {}", item.summarize());
}
```

* let's fix our earlier larger function using our newfound `trait` knowledge:
* we need to to specicify `PartialOrd` in our trait bounds to use our `>` operator; this is in the prelude:

```
// change this:
fn largest<T>(list: &[T]) -> T {...}

// to this:
fn largest<T: PartialOrd>(list: &[T]) -> T {...}
```

* now this fails to compile for a new reason: you need to be able to implement the `Copy` trait; so we can add that to our type:
```
fn largest<T: PartialOrd + Copy>(list: &[T]) -> T {
    let mut largest = list[0];

    for &item in list {
        if item > largest {
            largest = item;
        }
    }

    largest
}

fn main() {
    let number_list = vec![34, 50, 25, 100, 65];

    let result = largest(&number_list);
    println!("The largest number is {}", result);

    let char_list = vec!['y', 'm', 'a', 'q'];

    let result = largest(&char_list);
    println!("The largest char is {}", result);
}

// it works!
```

* you can use this concept of trait bounds to conditionally implement methods on any Type that satifies that trait bounds:

```
use std::fmt::Display;

struct Pair<T> {
    x: T,
    y: T,
}

impl<T> Pair<T> {
    fn new(x: T, y: T) -> Self {
        Self { x, y }
    }
}

impl<T: Display + PartialOrd> Pair<T> {
    fn cmp_display(&self) {
        if self.x >= self.y {
            println!("The largest member is x = {}", self.x);
        } else {
            println!("The largest member is y = {}", self.y);
        }
    }
}
```

* and can conditionally implement a trait for any type that implements another trait. This is called blanket implementations.

### lifetimes

```
&i32        // a reference
&'a i32     // a reference with an explicit lifetime
&'a mut i32 // a mutable reference with an explicit lifetime
```

* *a function to find longest strings:*

```
fn longest(x: &str, y: &str) -> &str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

fn main() {
    let string1 = String::from("abcd");
    let string2 = "xyz";

    let result = longest(string1.as_str(), string2);
    println!("The longest string is {}", result);
}
// this won't work because of lifetime error
```

* we rewrite the `longest` function to explicitly set lifetime so that both arguments and the return call all have the same lifetime of `'a`:

```
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

* if structs are going to hold references you need to add lifetime annotation to them:

```
struct ImportantExcerpt<'a> {
    part: &'a str,
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first_sentence = novel.split('.').next().expect("Could not find a '.'");
    let i = ImportantExcerpt {
        part: first_sentence,
    };
}
```
