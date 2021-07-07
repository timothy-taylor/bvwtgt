---
title: learning rust (basics)
tags: rust programming
layout: posts
---
Hi, I'm learning some rust on the fly. This is for my own education use, check out the Rust Book online!

* `let` creates a variable; variables are immutable by default; make it mutable with `let mut`; *this is not the same as CONSTANTS*
* you can "shadow" an immutable variable by redeclaring with `let`:

```
let x = 5;
let x = x + 1;
let x = x * 2;
// x will be 12
```

* this shadowing is essentially creating a new variable, allowing us to actually change the type of the variable:

```
let spaces = "   ";
let spaces = spaces.len();
// going from a string to a number
```

this doesn't working a with a `let mut`

```
let mut spaces = "   ";
spaces = spaces.len();
// compile-time error
```

* `const` creates a constant; they cannot be made mutable; they are valid the entire time a program runs within the scope they are declared in.
* `String::new()`; makes a new string, provides by the standard libary; `::` indicates an associated function
* `std::io::stdin()` is the same as:

```
use std::io
...
io::stdin();
```

* switching from an `.expect` to `match ... { Ok ... Err ... }` is how you move from crashing on an error to handling an error; example:

```
let guess: u32 = guess.trim().parse().expect("Error, not a number");
```
vs. 

```
let guess: u32 = match guess.trim().parse() {
    Ok(num) => num,
    Err(_) => continue,
};
```
* scalar types: integers, floats, booleans, characters
* integer types: `u-` unsigned; `i-` signed; `-8` 8bit; `-16` 16bit; `-32` 32bit; `-64` 64bit; `-128` 128bit; 
* `isize` signed arch; `usize` unsigned arch; these refer to the architecture of the machine they are on 64bit or 32bit.
* integer literals can be written as decimal (92_222); hex (0xff); octal (0o77); binary (0b1111_0000); byte (b'A')
* if you are unsure what type to use, use rust default `i32`; this type is generally fastest
* integer overflow, in debug mode causes program to exit with error; in release mode it performs two's complement wrapping. This is wild.
> use `wrapping_*` methods, `checked_*` methods, `overflowing_*` methods, or `saturating_*` methods to explicitly handle overflow.
* float types: `f32` and `f64`; `f64` is default because it about the same speed but capable of more precision

```
let x = 2.0;    // default f64
let y: f32 = 3.0;       // f32
```

* numeric operations: add, subtract, multiply, divide, modulus

```
fn main() {
    let sum = 5 + 10;

    let difference = 95.5 - 4.3;

    let product = 4 * 30;

    let quotient = 56.7 / 32.2;

    let remainder = 43 % 5;
}
```

* boolean type: true and false:

```

let t = true;
let f: bool = false; // with explicit type annotation
```

* character type; char literals use single quotes where as string literals use double quotes; char is 4 bytes in size and represents unicode scalar value

```
let c = 'c';
```

* compound types: tuples, arrays; 0 indexed
* `tup` is a tuple; it has a fixed length once declared; can contain different types; declared using a comma seperated list of values inside parantheses; can include optional type annotation:

```
let tup: (i32, f64, u8) = (500, 6.4, 1);
```

* two ways to access a tuple data: direct access and destructuring:

```
fn main() {
    let x: (i32, f64, u8) = (500, 6.4, 1);
    let five_hundred = x.0; // direct access
    let six_point_four = x.1;

    let tup = (500, 6.4, 1);
    let (a, b, c) = tup; // destructure
    println!("The value of b is: {}", b);

}
```

* arrays are fixed length, comma seperated lists of values inside square brackets; all elements must be the same type:

```
let a = [1, 2, 3, 4, 5];
```

* arrays allocate data on the stack instead of the heap; looking forward a `vector` is a more flexible but similar option to an array, and should probably be used more often.
* you can explicitly set type and length of an array:

```
let a: [i32; 5] = [1, 2, 3, 4, 5];
```

* they are accessed like usual `a[0]` ... `a[4]`; if you attempt to access something beyond the end of an array it will throw a runtime error
* functions and variables use snakecase; functions can be defined before or after they are used; rust doesn't care
* functions have parameters in which you must declare the type `function_name(x: i32){}` in this example the parameter name is and the type is signed 32bit integer.
> Rust is an expression based language; meaning the expressions in Rust evaluate to a resulting value; in contrast to a statement based language in which an action is performed but no value is returned
> function definitions are statemetns and `let y = 6` is a statement
> statements do not return values and thus you cannot assign a let statement to another variable: 

```
let x = (let y = 6);
// no good
```

> this is different than C where the assignment returns the value of the assignment; so again:

```
x = y = 6;
// works in C, not a Rust
```

* creating a block to create new scope is an expression, so:

```
let y = {
    let x = 3;
    x + 1
};
// this works
// note how x + 1 doesn't end with a semi-colon
// expression endings don't include them
// in fact if you add one, you turn it into a statement
```

* functions with return values have there type declared with an arrow function and the return value is the last value of the last expression in the block of the body of the function; once again notice the lack of semicolons here:

```
fn five() -> i32 {
    5
}

x = five();
```

* `if` statements are similar to other languages:

```
if something = true {
    // first statement
} else  if something_else = true {
    // second statement
} else { 
    // otherwise
}
```

this must be a boolean value so:

```
let number = 3;

if number > 0 {
    // this happens
}

// but

if number {
    // this is an error
}
```

* because `if` is an expression we can use it in on variable declarations:

```
let condition = true;
let number = if condition { 5 } else { 6 };
```

* Rust has three kinds of loops: `loop`, `while`, and `for`
* `loop` will keep looping until explicitly told to stop / `break`

```
fn main() {
    let mut counter = 0;

    let result = loop {
        counter += 1;

        if counter == 10 {
            break counter * 2;
        }
    };

    println!("The result is {}", result);
}
// result = 20
```

* `while` is a conditional loop

```
let mut number = 3;

while number != 0 {
    println!("{}!", number);

    number -= 1;
}
```

* `for` is iterating through some sort of collection or range

```
let a = [10, 20, 30, 40, 50];

for element in a.iter() {
    println!("the value is: {}", element);
}

// or

for number in (1..4).rev() {
    println!("{}!", number);
}
// 4, 3, 2, 1
```

### Ownership
* each value in Rust has a variablet that's called its "owner"
* there can only be one owner at a time.
* when the owner goes out of scope, the value will be dropped

* so in Rust, the memory is automatically returned once the variable goes out of scope; this is different from garbage collection.

* `String` type is a data type more complex than the ones previously shown (different than string literals which are immutable and fixed size) , since its size is dynamic it must be allocated on the heap instead of the stack. Create a string from a string literal:

```
let s = String::from("hello");
```

* this type of string can be mutated:

```
let mut s = String::from("hello");
s.push_str(", world!");
```

* iterate over a string:

```
for c in "string".chars() {
    println!("{}", c);
}
```

* when a String is declared it is basically a struct made of 3 parts: pointer to data, length, capacity. This struct is put on the stack, but the data that the pointer points to is on the heap so that it can dynamically change in size. If we do this:

```
let s1 = String::from("hello");
let s2 = s1;
```

the data on the stack is copied, but the pointer to data is still just referenced. We don't copy that data.

* so the interesting point here is that, what happens when s1 and s2 go out of scope? they will both try to free the same data that they are referencing, this is called a double free error. Rust's answer to this, to ensure memory safety, is to consider `s1` in this example to be no longer valid, and therefor, doesn't need to do anything once it goes out of scope. So if you try use `s1` after doing `s2 = s1` it will show a compile-time error.
* this is what is sometimes called a "shallow copy", but in Rust it is called a "move" since it invalidates the original variable.
* Rust will never automatically "deep copy" data, therefor any automatic copying can be assumed to inexpensive for performance.
* to copy the heap data and not just the stack data we use `clone`

```
let s1 = String::from("hello");
let s2 = s1.clone();
```

* variables like integers that are put on the stack (of a known size at compile time) are entirely copied during `let x = 5; let y = x`
* you can return multiple values as a tuple:

```
fn calculate_length(s: String) -> (String, usize) {
    let length = s.len();

    (s, length)
}
```

* ampersands in rust, like in C, are a reference to the value. They allow you to refer to a value without taking ownership of it. When explicitly labeling the type of something (in a function) if it is a reference you must `&type`; also you cannot modify a reference value (you will get a compile-time error) without making sure the value to be referenced was originally `mut` and when passing the reference to a function you use `&mut type` and, on top of that, you can only have one mutable reference per scope! Always in control, this helps prevent race conditions with data.
* the Rust compiler does not allow danging references to pass. If you need data to survive a scope change, pass the data itself directly and not a reference to it.
* String slices are a reference to part of a String:

```
let s = String::from("hello world");
let hello = &s[0..5];
let world = &s[6..11];
```

* some shorthand for beginnings and endings:

```
let s = String::from("hello world");
let hello = &s[..5];
let world = &s[6..];
let hello_world = &s[..];
```

* string literals are slices! they point to a specific place in memory. Thus you can turn a String into a string literal by `&s[..]` slicing it.
* you can also slice arrays.

```
let a = [1, 2, 3, 4, 5];
let slice = &a[1..3];
assert_eq!(slice, &[2,3]);
```

### Structs

* structs are like tuples in that they can contain different types, but in structs you name each piece of data. Declared like so:

```
struct User {
    username: String,
    email: String,
    sign_in_count: u64,
    active: bool,
}
```

* instantiated like so:

```
let mut user1 = User {
    email: String::from("gob@lorb.org"),
    username: String::from("goblorb"),
    active: true,
    sign_in_count: 1,
};

user1.email = String::from("gob33@lorb.org");
```

* return it in a function (again, notice lack of semicolon):

```
fn build_user(email: String, username: String) -> User {
    User {
        email: email,
        username: username,
        active: true,
        sign_in_count = 1,
    }
}

// shorthand when variables and fields have same name

fn build_user(email: String, username: String) -> User {
    User {
        email,
        username,
        active: true,
        sign_in_count = 1,
    }
}
```

* shorthand for using create instances from other instance data:

```
let user2 = User {
    email: String::from("newemail@email.com"),
    username: String::from("newuser2"),
    active: user1.active,
    sign_in_count: user1.sign_in_count,
};

// and even shorter:

let user2 = User {
    email: String::from("newemail@email.com"),
    username: String::from("newuser2"),
    ..user1
};
```

* tuple structs look like tuples (don't have names, just types); useful when you want to give the whole tuple a unique name despite being the same type:

```
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);

let black = Color(0, 0, 0);
let origin = Point(0, 0, 0);
```

* you can create structs without any fields, these are called unit-like structs.
* structs can store referenced data owned by something else, but you must use `lifetimes` feature.
* nice example of Struct flow:

```
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };

    println!(
        "The area of the rectangle is {} square pixels.",
        area(&rect1)
    );
}

fn area(rectangle: &Rectangle) -> u32 {
    rectangle.width * rectangle.height
}
```

* methods are similar to functions: declared with `fn` and a name, but they defined with the context of a struct and the first parameter is always `self` which represents the instance of the struct the method is being called on. Updating the previous example:

```
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };

    println!(
        "The area of the rectange is {} square pixels.",
        rect1.area()
    );
}
```

* functions that don't take `self` as the first parameters are not methods, but associated functions. Associated functions are called with `::` instead of `.`

```
impl Rectangle {
    fn square(size: u32) -> Rectangle {
        Rectangle {
            width: size,
            height: size,
        }
    }
}

let sq = Rectange::square(3);
```

* you can create multiple `impl` blocks for the same namespace if you'd like.

### enums

* list possible variants in a namespace

```
enum IpAddrKind {
    V4,
    V6,
}

let four  = IpAddrKind::V4;
```

* you can put data directly into each enum variant:

```

enum IpAddr {
    V4(String),
    V6(String),
}

let home = IpAddr::V4(String::from("127.0.0.1"));
```
* you can put any kind of data in the enum, including structs. This is the standard lib defition of IpAddr:

```
struct Ipv4Addr {
    // --snip--
}

struct Ipv6Addr {
    // --snip--
}

enum IpAddr {
    V4(Ipv4Addr),
    V6(Ipv6Addr),
}
```

* and another possible enum, to show the flexibility:

```
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}
```

* you can create methods on enums via `impl` the same way you can for structs:

```
impl Message {
    fn call(&self) {
        // method body would be defined here
    }
}

let m = Message::Write(String::from("hello"));
m.call();
```
* `Option` is another enum that is in the standard library (and the prelude so you don't need to explicitly bring it in), it used to decide if something is something or nothing. This is important since Rust does not have a null feature / type. In rust, null is a value that means there is no value present. So `Option`:

```
enum Option<T> {
    Some(T),
    None
}
```
> <T> means generic type

* the interesting part here is that, if you are using None, you must explicitly give it a Option<T>. I think I will need to see this in the wild a bit before I totally understand. 

### match

* `match` is an extremely powerful control flow operator allowing you to use all kinds of patterns, with the added bonus that compiler confirms all possible cases are handled! Similar to `if`, but `if` requires a boolen expresssion, where `match` can be any type. example:

```
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}
```

* [pattern] `->` [code]
* matches will stop in the first arm that matches. this is a nice way to use `Option<T>`:

```
fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(i) => Some(i + 1),
    }
}

let five = Some(5);
let six = plus_one(five);
let none = plus_one(None);
```

* You’ll see this pattern a lot in Rust code: match against an enum, bind a variable to the data inside, and then execute code based on it.
* `match` has a `_` placeholder to cover the matches you don't care about, since a `u8` can be from 0-255 and we need to be exhaustive in our matches or the compiler will yell at us :

```
let some_u8_value = 0u8;
match some_u8_value {
    1 => println!("one"),
    3 => println!("three"),
    5 => println!("five"),
    7 => println!("seven"),
    _ => (),
}
```
* to match just one case; `if let` is the way to go:

```
let some_u8_value = Some(0u8);
match some_u8_value {
    Some(3) => println!("three"),
    _ => (),
}

// same as

let some_u8_value = Some(0u8);
if let Some(3) = some_u8_value {
    println!("three");
}
```

* `if let ... else`:

```
let mut count = 0;
match coin {
    Coin::Quarter(state) => println!("State quarter from {:?}!", state),
    _ => count += 1,
}

// same as

let mut count = 0;
if let Coin::Quarter(state) = coin {
    println!("State quarter from {:?}!", state);
} else {
    count += 1;
}
```
