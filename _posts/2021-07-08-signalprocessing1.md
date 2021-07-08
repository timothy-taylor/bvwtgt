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
A = .8
f0 = 1000
phi = np.pi/2
fs = 44100
t = np.arange(-.002, .002, 1.0/fs)
x = A * np.cos(2*np.pi*f0*t+phi)
plt.plot(x)
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

