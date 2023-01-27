---
sidebar: auto
sidebarDepth: 3
---

# vuepress-plugin-code-switcher

This is the demo page for the `vuepress-plugin-code-switcher`. Please refer to
the Readme on its [GitHub
Repository](https://github.com/padarom/vuepress-plugin-code-switcher) for more
information regarding how to use it.

All examples shown are taken from [Rosetta Code](http://rosettacode.org/).

## Synchronised switchers

These two switchers are synchronized by default, no additional settings needed
to be made.

### Longest Common Substring

<CodeSwitcher name="synchronized">
<template v-slot:julia>

```julia
function lcs(s1::AbstractString, s2::AbstractString)
    l, r = 1, 0
    sub_len = 0
    for i in 1:length(s1)
        for j in i:length(s1)
            if !contains(s2, SubString(s1, i, j)) break
            elseif sub_len < j - i
                l, r = i, j
                sub_len = j - i
            end
        end
    end 
    s1[l:r] 
end
 
@show lcs("thisisatest", "testing123testing")
```

</template>
<template v-slot:kotlin>

```kotlin
fun lcs(a: String, b: String): String {
    if (a.length > b.length) return lcs(b, a)
    var res = ""
    for (ai in 0 until a.length) {
        for (len in a.length - ai downTo 1) {
            for (bi in 0 until b.length - len) {
                if (a.regionMatches(ai, b, bi,len) && len > res.length) {
                    res = a.substring(ai, ai + len)
                }
            }
        }
    }
    return res
}
 
fun main(args: Array<String>) = println(lcs("testing123testing", "thisisatest"))
```

</template>
<template v-slot:perl>

```perl
#!/usr/bin/perl
use strict ;
use warnings ;
 
sub longestCommonSubstr {
   my $first = shift ;
   my $second = shift ;
   my %firstsubs = findSubstrings ( $first );
   my %secondsubs = findSubstrings ( $second ) ;
   my @commonsubs ;
   foreach my $subst ( keys %firstsubs ) {
      if ( exists $secondsubs{ $subst } ) {
	 push ( @commonsubs , $subst ) ;
      }
   }
   my @sorted = sort { length $b <=> length $a } @commonsubs ;
   return $sorted[0] ;
}
 
sub findSubstrings {
   my $string = shift ;
   my %substrings ;
   my $l = length $string ;
   for ( my $start = 0 ; $start < $l ; $start++ ) {
      for ( my $howmany = 1 ; $howmany < $l - $start + 1 ; $howmany++) {
	 $substrings{substr( $string , $start , $howmany) } = 1 ;
      }
   }
   return %substrings ;
}
 
my $longest = longestCommonSubstr( "thisisatest" ,"testing123testing" ) ;
print "The longest common substring of <thisisatest> and <testing123testing> is $longest !\n" ; 
```

</template>
</CodeSwitcher>

### Palindrome Detection

<CodeSwitcher name="synchronized">
<template v-slot:julia>

```julia
function palindrome(s)
    len = length(s)
    if(len==0 || len==1)
        return true
    end
    if(s[1] == s[len])
        return palindrome(SubString(s,2,len-1))
    end
    return false
end
```

</template>
<template v-slot:kotlin>

```kotlin
fun isExactPalindrome(s: String) = (s == s.reversed())
 
fun isInexactPalindrome(s: String): Boolean {
    var t = ""
    for (c in s) if (c.isLetterOrDigit()) t += c
    t = t.toLowerCase()
    return t == t.reversed()
}
```

</template>
<template v-slot:perl>

```perl
# Palindrome.pm
package Palindrome;
 
use strict;
use warnings;
 
use Exporter 'import';
our @EXPORT = qw(palindrome palindrome_c palindrome_r palindrome_e);
 
sub palindrome
{
    my $s = (@_ ? shift : $_);
    return $s eq reverse $s;
}
 
sub palindrome_c
{
    my $s = (@_ ? shift : $_);
    for my $i (0 .. length($s) >> 1)
    {
        return 0 unless substr($s, $i, 1) eq substr($s, -1 - $i, 1);
    }
    return 1;
}
 
sub palindrome_r
{
    my $s = (@_ ? shift : $_);
    if (length $s <= 1) { return 1; }
    elsif (substr($s, 0, 1) ne substr($s, -1, 1)) { return 0; }
    else { return palindrome_r(substr($s, 1, -1)); }
}

sub palindrome_e
{
    (@_ ? shift : $_) =~ /^(.?|(.)(?1)\2)$/ + 0
}
```

</template>
</CodeSwitcher>

## Isolated Switchers

The following two switchers are isolated. They do not listen to any
of the other switchers being changed.

### Letter Frequency

<CodeSwitcher :languages="{kotlin:'Kotlin',ruby:'Ruby'}" isolated>
<template v-slot:kotlin>

```kotlin
import java.io.File
 
fun main(args: Array<String>) {
    val text = File("input.txt").readText().toLowerCase()
    val letterMap = text.filter { it in 'a'..'z' }.groupBy { it }.toSortedMap()
    for (letter in letterMap) println("${letter.key} = ${letter.value.size}")
    val sum = letterMap.values.sumBy { it.size }
    println("\nTotal letters = $sum")
}
```

</template>
<template v-slot:ruby>

```ruby
def letter_frequency(file)
  letters = 'a' .. 'z'
  File.read(file) .
       split(//) .
       group_by {|letter| letter.downcase} .
       select   {|key, val| letters.include? key} .
       collect  {|key, val| [key, val.length]} 
end
 
letter_frequency(ARGV[0]).sort_by {|key, val| -val}.each {|pair| p pair}
```

</template>
</CodeSwitcher>

### Rot-13

<CodeSwitcher :languages="{kotlin:'Kotlin',ruby:'Ruby'}" isolated>
<template v-slot:kotlin>

```kotlin
import java.io.*
 
fun String.rot13() = map {
    when {
        it.isUpperCase() -> { val x = it + 13; if (x > 'Z') x - 26 else x }
        it.isLowerCase() -> { val x = it + 13; if (x > 'z') x - 26 else x }
        else -> it
    } }.toCharArray()
 
fun InputStreamReader.println() =
        try { BufferedReader(this).forEachLine { println(it.rot13()) } }
        catch (e: IOException) { e.printStackTrace() }
 
fun main(args: Array<String>) {
    if (args.any())
        args.forEach { FileReader(it).println() }
    else
        InputStreamReader(System.`in`).println()
}
```

</template>
<template v-slot:ruby>

```ruby
# Returns a copy of _s_ with rot13 encoding.
def rot13(s)
  s.tr('A-Za-z', 'N-ZA-Mn-za-m')
end
 
# Perform rot13 on files from command line, or standard input.
while line = ARGF.gets
  print rot13(line)
end
```

</template>
</CodeSwitcher>

## Multiple Switcher Groups
The following switchers are in different groups. Even though they show the same
languages, they might not be thematically related, so only some code blocks
switch, while the others stay the same.

### Group 1: FizzBuzz

<CodeSwitcher name="group-1">
<template v-slot:nim>

```nim
for i in 1..100:
  if i mod 15 == 0:
    echo("FizzBuzz")
  elif i mod 3 == 0:
    echo("Fizz")
  elif i mod 5 == 0:
    echo("Buzz")
  else:
    echo(i)
```

</template>
<template v-slot:ocaml>

```ocaml
let fizzbuzz i =
  match i mod 3, i mod 5 with
    0, 0 -> "FizzBuzz"
  | 0, _ -> "Fizz"
  | _, 0 -> "Buzz"
  | _    -> string_of_int i
 
let _ =
  for i = 1 to 100 do print_endline (fizzbuzz i) done
```

</template>
</CodeSwitcher>

### Group 1: Hello world

<CodeSwitcher name="group-1">
<template v-slot:nim>

```nim
echo("Hello world!")
```

</template>
<template v-slot:ocaml>

```ocaml
print_endline "Hello world!"
```

</template>
</CodeSwitcher>

### Group 2: String case

<CodeSwitcher name="group-2">
<template v-slot:nim>

```nim
import strutils
 
var s: string = "alphaBETA_123"
echo s," as upper case: ", toUpper(s)
echo s," as lower case: ", toLower(s)
echo s," as Capitalized: ", capitalize(s)
echo s," as normal case: ", normalize(s)  # remove underscores, toLower
```

</template>
<template v-slot:ocaml>

```ocaml
let () =
  let str = "alphaBETA" in
  print_endline (String.uppercase_ascii str); (* ALPHABETA *)
  print_endline (String.lowercase_ascii str); (* alphabeta *)
 
  print_endline (String.capitalize_ascii str); (* AlphaBETA *)
;;
```

</template>
</CodeSwitcher>

### Group 2: Strip whitespace

<CodeSwitcher name="group-2">
<template v-slot:nim>

```nim
import strutils
 
let s = " \t \n String with spaces  \t  \n  "
echo "'", s, "'"
echo "'", s.strip(trailing = false), "'"
echo "'", s.strip(leading = false), "'"
echo "'", s.strip(), "'"
```

</template>
<template v-slot:ocaml>

```ocaml
let left_pos s len =
  let rec aux i =
    if i >= len then None
    else match s.[i] with
    | ' ' | '\n' | '\t' | '\r' -> aux (succ i)
    | _ -> Some i
  in
  aux 0
 
let right_pos s len =
  let rec aux i =
    if i < 0 then None
    else match s.[i] with
    | ' ' | '\n' | '\t' | '\r' -> aux (pred i)
    | _ -> Some i
  in
  aux (pred len)
 
let trim s =
  let len = String.length s in
  match left_pos s len, right_pos s len with
  | Some i, Some j -> String.sub s i (j - i + 1)
  | None, None -> ""
  | _ -> assert false
 
let ltrim s =
  let len = String.length s in
  match left_pos s len with
  | Some i -> String.sub s i (len - i)
  | None -> ""
 
let rtrim s =
  let len = String.length s in
  match right_pos s len with
  | Some i -> String.sub s 0 (i + 1)
  | None -> ""
```

</template>
</CodeSwitcher>
