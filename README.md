# Rappakalja
Web application to replace paper in the game Rappakalja. 

# Story behind
Even with only few players, this game called Rappakalja consumes a huge amount of paper. 
Also, sometimes it is difficult to read other person's handwriting, so there was a need to implement solution for this. 
Therefore, I made this web app for mobile devices that can be used as a replacement for paper in the game Rappakalja.
This was my first time using NestJS and Vue, so this acted also as a practise project for me.
Code is not the smartest or bestest, but it works. I learned what to improve for the next time.

# How to run in your local network
This is not hosted anywhere, but you can use this easily in your local network wifi. There is no need for any databases etc. You will only need some up-to-date Node (and the Rappakalja game) to use this.

You can run this in local network with following steps:
1. (from root directory) cd server && yarn install && yarn start
2. (from root directory) cd client && yarn install && yarn dev

You should have a similar text in terminal:

```
vite vx.y.z dev server running at:

  > Local:    http://localhost:3000/
  > Network:  http://10.0.0.xx:3000/
```

Join the game with a mobile device within the same wifi network with the provided network address: `http://10.0.0.xx:3000/`

Happy playing! :]
