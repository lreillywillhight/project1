MAZE_RUNNER

You control Meatball. Collect keys, unlock doors, put Goomber in jail, and reach the exit.


School Stuff
_________________________________
A primitive maze game (similar to Pac-Man). Player navigates a maze to the exit, where a new level is loaded.

MVP is a basic maze to navigate.

Stretch goals - multiple maps/environments monsters to avoid, keys/doors, powerups, bonus items(treasure)/points system, graphics/sound/animation, longer levels (screen scrolling? multiple rooms?), hazards, puppies? *PROCEDURAL MAP GENERATION*


DAY 1 - PURELY RESEARCH, FOLLOWED A TUTORIAL AND BROWSED EXAMPLES ON THE PHASER.IO WEBSITE

DAY 2 - MORE RESEARCH, GOT A TILEMAP TO TEST GAME ENVIRONMENT, SPENT ABOUT 6 HOURS GETTING THE DAMN THING TO LOAD INTO CHROME (PROBLEM WAS WITH HOW TILED HANDLES EMBEDDED TILESETS IN A TILEMAP. GETTING A CHARACTER AND COLLISION DETECTION SHOULD BE TRIVIAL... BIGGEST PROBLEM FACING ME RIGHT NOW IS HOW TO GENERATE MAPS (JSON) IN CONSOLE. WILL ASK A TA ABOUT IT, TOMORROW.

DAY 3 - PUT THE RANDOM MAP GENERATOR ON THE BACK BURNER FOR NOW; GOT SOME GRAPHICS, PLAYER MOVEMENT, COLLISION, PHYSICS WORKED ON; TA'S SEEM STUMPED BY MY PROBABLY AUTISTIC SELF; DISCOVERED THAT THE .JSON TILEMAP RECURSES ON ITSELF AFTER LOADING INTO CACHE (PHASER LIBRARY METHODS WILL BE REQUIRED FOR IN-SCRIPT MAP GENERATION, I THINK);
TODO -
    -ANIMATIONS
    -SOUNDS
    -KEYS / DOORS
    -MONSTERS
    -TREASURE / POINTS
    -INTERACTABLE OBJECTS
    -PROCEDURAL LEVEL GENERATION
    -TITLE SCREEN / OPTIONS

DAY 4-7 - FORGOT TO JOURNAL THESE DAYS.. DAY 4 I TOOK A BREAK ON ACCOUNT OF SANITY

DUE DATE - IT'S A GAME. FEATURES:
- MOVABLE PLAYER SPRITE
- TILED GAME ENVIRONMENT
    - COLLISION, KEYS/DOORS, KICKABLE GOOMBER, EXIT STATE
- RANDOM CORRIDOR GENERATOR THAT IS FUNCTIONING BUT NOT REALLY PLAYABLE

//all in all, i'd say this project has potential to be a good game, but I spent so much time researching how to manipulate data with phaser and how to properly generate a dungeon, that it's really not much of an actual game.
