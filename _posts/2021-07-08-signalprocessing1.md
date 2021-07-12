---
title: basic audio signal processing (some math + some python)
tags: sound python math
layout: posts
---

using python to plot and experiment with basic audio math things...

install numpy, scipy, and matplotlib:

```
python3.9 -m pip install numpy matplotlib scipy
```

to use:

```
import numpy as np
from matplotlib import pyplot as plt

// or

import matplotlib.pyplot as plt
```

simple sine example:

```
A = .8                             # amplitude
f0 = 1000                          # frequency
phi = np.pi/2                      # phase
fs = 44100                         # sampling rate
t = np.arange(-.002, .002, 1.0/fs) # an array of discrete points
x = A * np.cos(2 * np.pi * f0 * t + phi)

plt.plot(t, x)
plt.axis([-0.002, 0.002, -0.8, 0.8])
plt.xlabel('time')
plt.ylabel('amplitude')

plt.show()
```

complex sinusoid example:

```
N = 500                  # size of the sequence
k = 3                    # periodicity
n = np.arange(-N/2, N/2) # time index
s = np.exp(1j * 2 * np.pi * k * n / N)

plt.plot(n, np.real(s)) # plot the real part of the complex sinusoid
plt.axis([-N/2, N/2 - 1, -1, 1])
plt.xlabel('time index "n"')
plt.ylabel('amplitude')
plt.show()

plt.plot(n, np.imag(s)) # plot the imaginary part of the complex sinusoid
plt.axis([-N/2, N/2 - 1, -1, 1])
plt.xlabel('time index "n"')
plt.ylabel('amplitude')
plt.show()
```

* when plotting a complex sinusoid it is customary to plot the real and imaginary part seperately, otherwise we need a 3D space.
* a scalar (dot) product takes two equal length sequences of numbers (ie vector) and returns a single value; it is the sum of the products of the corresponding entries of the two sequences of numbers; generic c++ code example:

```
float dot_product(float *a,float *b,int size)
{
    float dp = 0.0f;
    for (int i=0;i<size;i++)
        dp += a[i] * b[i];
    return dp;
}
```

> *however, a dot product of complex vector is slightly different: we use the complex conjugate of `B` so any imaginary parts of the second sequence are of the opposite sign.*

* read sound files in python

```
from scipy.io.wavfile import read
import matplotlib.pyplot as plt
import numpy as np

(fs, x) = read('filename.wav');
// returns samplerate and an array of samples
fs
// samplerate
x
// array

x.size
// how many samples in the file

x.size/fs
// number of samples / samplerate = length in seconds
x.size/float(fs)
// length in seconds, as decimal

t = np.arange(x.size)
// creates a ranged array from 0 to the given value
time = t / float(fs)
// make it in seconds
plt.plot(time, x)
plt.show()

np.max(x)
// biggest value
np.max(abs(x))
// since sounds oscillate around 0, you want absolute value
```

* write sound files in python

```
from scipy.io.wavfile import write

write('test.wav', fs, y)
// file to write to, sample rate, array of values
```

### DFT in python

*basics:*

```
import numpy as np

X = np.array([])

for k in Range(N):
    s = np.exp(1j * 2 * np.pi * k / N * np.arange(N))
    X = np.append(X, sum(x*np.conjugate(s)))
```

all of the variables are theoretically supplied by the complex input signal, like so:

```
import numpy as np
import matplotlib.pyplot as plt

N = 64 # size
k0 = 7 # periodicity / frequency
x = np.exp(1j * 2 * np.pi * k0 / N * np.arange(N))

X = np.array([])

for k in range(N):
    s = np.exp(1j * 2 * np.pi * k / N * np.arange(N))
    X = np.append(X, sum(x*np.conjugate(s)))

plt.plot(np.arange(N), abs(X))
plt.axis([0, N - 1, 0, N])
plt.show()
```
this will show one peak of size 64 at period 6

and on a real signal:

```
import numpy as np
import matplotlib.pyplot as plt

N = 64 # size
k0 = 7 # periodicity / frequency
x = np.cos(2 * np.pi * k0 / N * np.arange(N))

X = np.array([])
nv = np.arange(-N/2, N/2) # time index
kv = np.arange(-N/2, N/2) # frequency index

## DFT

for k in kv:
    s = np.exp(1j * 2 * np.pi * k / N * nv)
    X = np.append(X, sum(x*np.conjugate(s)))

plt.plot(kv, abs(X))
plt.axis([-N/2, N/2 - 1, 0, N])
plt.show()

## Inverse DFT

y = np.array([])
for n in nv:
    s = np.exp(1j * 2 * np.pi * n / N * kv)
    y = np.append(y, 1.0/N * sum(X*s))

plt.plot(kv, y)
plt.axis([-N/2, N/2 - 1, -1, 1])
plt.show()
```
