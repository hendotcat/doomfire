doomfire
========

Fire animation in pure CSS inspired by the PlayStation version of DOOM.

|    |                                                     |
|----|-----------------------------------------------------|
| ▶️  | [play it](https://hen.cat/doomfire)                 |
| 😳 | [look at the source code](blob/trunk/doomfire.scss) |

![Video of the fire with red flames against a black background. The bottom of the flames near the source is yellow](https://hen.cat/doomfire/videos/demo-512x512.gif)

About
-----

The algorithm for the fire itself is from Fabien Sanglard's [How DOOM fire was
done]. Fabien's write-up was so helpful that it inspired me to try and pay it
forward by explaining how my implementation works.
So here goes!

It's quite common for CSS animation demos like these to include a bunch of
placeholder HTML elements. Typically it'll be like a bunch of `<div>` elements
for the CSS to animate. This one doesn't have any of that, which is what I mean
when I call it a "pure CSS" implementation. There's no HTML involved except for
the bare minimum required to deliver the CSS in a valid way. What this means is
that at its very core, the whole animation piggybacks off a pseudo element on
the `<body>` tag. Here's one of those, with a black background color to make it
visible.

<table>
  <tbody>
    <tr>
      <td>
        <pre><code>body::after {
  background: black;
  content: "";
  position: absolute;
  width: 128px;
  height: 128px;
}</code></pre>
      </td>
      <td>
        <img
          alt="A single black square in the top right corner."
          src="https://hen.cat/doomfire/images/example-output-1-256x256.png"
        />
      </td>
    </tr>
  </tbody>
</table>

The next step is to turn that 1x1 black square into a whole 2D screen, and the
magic words for that is `box-shadow`. In most everyday web development, box
shadows are blurry and obscured by the element they belong to. To use them for
this kind of magic, there are three rules:

1. Hide the element itself: no background color.
2. Position them so that they're completely outside the element.
3. Don't set a blur radius.

So here's an updated example using the above technique to increase the
resolution from 1x1 to 1x2.

<table>
  <tbody>
    <tr>
      <td>
        <pre><code>body::after {
  content: "";
  position: absolute;
  width: 128px;
  height: 128px;
  box-shadow:
    128px calc(128px*0) yellow,
    128px calc(128px*1) red;
}</code></pre>
      </td>
      <td>
        <img
          alt="A yellow square in the top right and a red square in the bottom right."
          src="https://hen.cat/doomfire/images/example-output-2-256x256.png"
        />
      </td>
    </tr>
  </tbody>
</table>

From here, increasing the resolution beyond 1x2 is just a matter of adding more box shadows to the list.
And making them update to look like a fire is a plain old keyframe animation.

<table>
  <tbody>
    <tr>
      <td>
        <pre><code>@keyframes fire {
  33% {
    box-shadow:
      128px calc(128px*0) white,
      128px calc(128px*1) white;
  }
  66% {
    box-shadow:
      128px calc(128px*0) white,
      128px calc(128px*1) red;
  }
  99% {
    box-shadow:
      128px calc(128px*0) yellow,
      128px calc(128px*1) red;
  }
}</code></pre>
      </td>
      <td>
        <img
          alt="Animation showing a blank screen, then a red square, then a red square and a yellow square."
          src="https://hen.cat/doomfire/videos/example-output-3-256x256.gif"
        />
      </td>
    </tr>
  </tbody>
</table>

One of the downsides of this technique is how inefficient it is. Box shadows
don't animate efficiently even at small scale and this takes them to an extreme.
On the bright side, the heating effect this fire animation has on your CPU adds
an extra level of immersion and realism to the experience.

And because every pixel in every frame of the animation needs to be declared
explicitly, this is a bandwidth hog too. This 16 second animation is 3.5
megabytes of CSS! Rather than have it cut out abruptly after 16 seconds, I've
made it loop infinitely. And fortunately enough, the loop is really seamless.
But to make it loop, I've had to cut the part at the beginning where the fire
spreads in from the bottom, which is a shame.

It's not all downsides though. The original DOOM implementation has a real
videogame look to it, and the reason this implementation looks a bit more like
real flames is thanks to CSS. While the example code above uses a square pseudo
element, the real animation uses a long thin one. This stretches the flames out
a bit vertically, without changing anything about the algorithm powering it.
Combined with the blur filter, I think it produces a pretty neat effect!

License
-------

[![License: CC0-1.0](https://licensebuttons.net/l/zero/1.0/80x15.png)](http://creativecommons.org/publicdomain/zero/1.0/)

Hope somebody finds something in here that they find useful or inspiring.
Copy as much as you want.
By reading this sentence you are hereby double dog dared to ship this in a user-facing production site.

[How DOOM fire was done]: https://fabiensanglard.net/doom_fire_psx/

