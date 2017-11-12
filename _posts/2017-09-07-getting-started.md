---
layout: page
title: "Getting started"
category: docs
description: "Setup and start to use Generic Game"
date: 2017-09-07 20:08:02
---

## Requirements

You'll need [Node.js](https://nodejs.org/en/) installed in your machine before setting up the Generic Game.

## Installing

After creating a project using:
```sh
npm init
```
You can install Generic Game with:
```sh
npm install --save generic-game
```


## Usage

Generic Game is a superset of several utilities in a RPG enviroment, you can start using them by creating an instance. The classes will be available at `gg.class` while default constants at `gg.const`

```js
import GenericGame from 'generic-game'
const gg = new GenericGame()

// gg.class <- classes
// gg.const <- constants
```

### Quick start

Let's create a hero, for that, instanciate a `Character` class available at `gg.class`.

```js
import GenericGame from 'generic-game'
const gg = new GenericGame()

const hero = new gg.class.Character({
  name: 'Generic hero'
})
```

and now equip a weapon:
```js
const sword = new gg.class.Weapon({
  name: 'Great sword',
  type: gg.const.item.EQUIPABLE,
  slotType: {name: 'handheld'},
  attacks: [
    {damage: 10, delay: 100}
  ]
})

hero.equipment.addSlot({type: 'handheld'})
hero.equipment.equip(sword)
```

creating an enemy

```js
const mob = new gg.class.Character({
  name: 'Generic mob'
})
mob.equipment.addSlot({type: 'handheld'})
mob.equipment.equip(new gg.class.Weapon({
  name: 'Dagger',
  type: gg.const.item.EQUIPABLE,
  slotType: {name: 'handheld'},
  attacks: [
    {damage: 1, delay: 100}
  ]
}))
```

and killing it

```js
hero.events.on('battle:[after]takingDamage', ({ status }) => {
  console.log(`Hero received ${status.damage} damage!`)
})
hero.battle.conflict(mob).then(() => {
  if (hero.battle.isAlive()) console.log('Hero is alive. :)')
  if (!mob.battle.isAlive()) console.log('And mob is dead. :)')
})
```
