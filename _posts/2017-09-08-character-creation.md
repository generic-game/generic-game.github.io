---
layout: page
title: "Character creation"
category: docs
description: "Creating a hero with identity, inventory, equipment, characteristics, battle, bank, experience and quests"
date: 2017-09-08 09:23:00
---

A character is composed with several classes:

- [Identity](#identity)
  <!-- - naming -->
- [Inventory](#inventory)
  <!-- - carrying items -->
  <!-- - storage limit -->
- [Equipment](#equipment)
  <!-- - slot types -->
  <!-- - limit per slot -->
- [Characteristics](#characteristics)
  <!-- - list of characteristics -->
  <!-- - stacking -->
- [Battle](#battle)
  <!-- - single attack -->
  <!-- - conflict until death -->
  <!-- - events -->
- [Bank](#bank)
  <!-- - earning -->
  <!-- - losing -->
- [Experience](#experience)
  <!-- - custom leveling algorithm -->
  <!-- - gaining -->
  <!-- - losing -->
- [Quests](#quests)
- [Status](#status)


## Identity

Character visual characteristics used only for identification

### Naming

The naming follows the complete name and a type.

```js
const king = new gg.class.Character({
  identity: {
    name: 'John Snow',
    type: 'Hero'
  }
})

king.identity.getName()
// <- John Snow

king.identity.getType()
// <- Hero

king.identity.getFullName()
// <- Hero: John Snow
```

## Inventory


A inventory is the character storage which is not equipped where items and
capacity are considered. The default inventory capacity is `1`, you can change
that in constructor:

```js
const hero = new gg.class.Character({
  identity: {
    name: 'Generic hero'
  },
  inventory: {
    capacity: 10
  }
})
```

### Carrying items

To carry some item, use `inventory.carry`:

```js
const ring = new gg.class.Item({
  name: 'Fancy ring',
  type: gg.const.EQUIPABLE,
  slotType: {
    name: 'ring'
  }
})
hero.inventory.carry(ring)
// <- Promise
```

> To check if hero can carry item:
>
```js
hero.inventory.canCarry(ring)
// <- true/false
```


You can drop it later, using:

```js
hero.inventory.drop(ring)
```


### Storage limit

If character reaches the limit, he can no long carry any items. You may increase
the capacity to carry the item.

```js
hero.inventory.increaseCapacity(10)
```


## Equipment

Is possible to equip anything and compute it's effects.

### Slot types

```js
const hero = new gg.class.Character({
  identity: {
    name: 'Generic hero'
  },
  inventory: {
    capacity: 10
  },
  equipment: {
    slots: [
      {type: 'lenses', capacity: 1}
    ]
  }
})
const fireLenses = new gg.class.Vest({
  name: 'Fire lenses',
  slotType: {name: 'lenses'},
  type: gg.const.item.EQUIPABLE,
  effects: [
    {name: gg.const.characteristic.DEFENSE, value: 12}
  ]
})

hero.equipment.equip(fireLenses).then(() => {
  hero.status.get(gg.const.characteristic.DEFENSE)
  // <- 12
})
```

### Limit per slot

Each slot has a capacity. Exceeding it will throw an exception in the promise

```js
hero.equipment.equip(fireLenses).catch((error) => {
  // <- Exceeded slot capacity
})
```

## Characteristics

A character characteristics are fixed to character should be understood as
something permanent. Equipments affect the character attributes, so as
characteristics, but cannot be traded

The life and defense are defaults character characteristics, can be increased
and decreased by using:

```js
hero.characteristics.increase('defense', 1)
hero.characteristics.decrease('defense', 1)
```

You can create custom characteristics in character instanciation

```js
new gg.class.Character({
  characteristics: [
    {name: 'wisdom', value: 1}
  ]
})
```

To get the computed status (characteristics + items buffs), use:

```js
hero.status.get('wisdom')
```


## Battle
### Single attack

Using character battle instance, you can interact with other characters.

```js
hero.battle.attack(villian)
// <- Promise
```

> To attack is required to equip a weapon

### Conflict until death

This will cause the characters to attack until death


```js
hero.battle.conflict(villian)
// <- Promise
```

> To check who is dead, use `hero.battle.isAlive()`

### Events

In battle, some events are fired. To listen them, use:


```js
villian.events.on('battle:[before]attack', ({ attack }) => {
  // <- Attack instance
})
villian.events.on('battle:[after]attack', ({ attack }) => {
  // <- Attack instance
})
villian.events.on('battle:[before]defend', ({ attack }) => {
  // <- Attack instance
})
villian.events.on('battle:[after]defend', ({ attack }) => {
  // <- Attack instance
})
villian.events.on('battle:[before]takingDamage', ({ status }) => {
  // <- status object {damage}
})
villian.events.on('battle:[after]takingDamage', ({ status }) => {
  // <- status object {damage}
})
```

## Bank

Bank can controls the currencies. A currency can be created using:

```js
new gg.class.Currency({
  name: 'Gold',
  symbol: 'G',
  value: 1000
})
```

So the bank can be initialized using:

```js
new gg.class.Bank({
  currencies: [
    {
      name: 'Gold',
      symbol: 'G',
      value: 1000
    },
    {
      name: 'Cash',
      symbol: 'CASH',
      value: 10
    }
  ]
})
```

since `Bank` is a default instance of `Character` class. That being said, character can be initialized with a custom bank using:


```js
const hero = new gg.class.Character({
  identity: {
    name: 'Generic hero'
  },
  bank: {
    currencies: [
      {
        name: 'Gold',
        symbol: 'G',
        value: 1000
      }
    ]
  }
})
```


### Transactions

To add/remove currencies, use `earn` and `lose` methods:

```js
hero.bank.earn({
  name: 'Gold',
  symbol: 'G',
  value: 1000
}).then(() => {
  hero.bank.get('Gold').getValue()
  // <- 1000
})
```


```js
hero.bank.lose(new gg.class.Currency({
  name: 'Gold',
  symbol: 'G',
  value: 100
})).then(() => {
  hero.bank.get('Gold').getValue()
  // <- 900
})
```

> `earn` and `lose` accepts either arguments, a Currency instance or a object
with the correct arguments to create a Currency instance.

## Experience

The experience is a class which stores the amount of experience calculates
character level.

### Custom leveling algorithm

The custom leveling algorithm receives the experience amount and should return
the character level. It can be setted using:

```js
hero.experience.setAlgorithm(experience => {
  return Math.floor(experience / 100)
})
```

### Gaining & Losing

Much alike with bank methods, experience class uses `gain` and `lose` to control
experience:

```js
experience.gain(100)
// <- Promise
experience.lose(1000)
// <- Promise
```


## Quests

In this class is stored all the `Character` joined quests.

See [Quests section]({{ site.baseurl }}{% post_url 2017-09-07-getting-started %}) to know more about creating a quest.

Here's an example of a `Character` instance joining a `Quest`:


```js
const quest = new gg.class.Quest({
  text: 'Become the king of this kingdom',
  steps: [{
    text: 'kill the king',
    reward: new gg.class.Experience({
      value: 1000
    }),
    action: () => !villain.battle.isAlive()
  }]
})
hero.interact(quest).join()
```

> The quest must be a `Quest` instance, otherwise will throw an error.

## Status

This class is responsible to compute all `Character` statuses.

For instance, calling `hero.status.get()` will return all `hero` character data.

```js
let status = hero.status.get()
// <- { life, defense }
```

While requesting a specific attribute, it returns it's value

```js
let status = hero.status.get('life')
// <- 100
```

> The Status class compute the character equipment and characteristics.
