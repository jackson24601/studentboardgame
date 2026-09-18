# 🎲 Shoots and Ladders Review Game

A web-based implementation of the classic Shoots and Ladders (Snakes and Ladders) board game, designed for educational review activities with multiple teams.

## Features

- **1-4 Team Support**: Choose between 1 to 4 teams to compete
- **Random Turn Order**: Computer randomly determines the play order at game start
- **Dice Rolling Mechanism**: Roll two six-sided dice and move the sum of the values
- **Classic Board**: 100-square board with snakes (shoots) that slide you down and ladders that move you up
- **Visual Feedback**: Animated dice rolling, piece movement, and special square indicators
- **Responsive Design**: Works on desktop and mobile devices

## Game Rules

1. **Setup**: Select the number of teams (1-4) and click "Start Game"
2. **Turn Order**: The game randomly assigns turn order at the start
3. **Rolling**: Click the "Roll Dice" button to roll two six-sided dice
4. **Movement**: Your team piece automatically moves the sum of the two dice
5. **Snakes (🐍)**: Landing on a snake square sends you down to a lower square
6. **Ladders (🪜)**: Landing on a ladder square moves you up to a higher square
7. **Winning**: The first team to reach square 100 wins the game!

## Board Layout

The game board consists of 100 squares arranged in a 10x10 grid:
- **Square 1**: Starting position (🏁)
- **Square 100**: Finish position (🏆)
- **Red squares**: Snake positions that move you down
- **Green squares**: Ladder positions that move you up

### Snake Positions (Shoots)
- 16 → 6
- 47 → 26
- 49 → 11
- 56 → 53
- 62 → 19
- 64 → 60
- 87 → 24
- 93 → 73
- 95 → 75
- 98 → 78

### Ladder Positions
- 1 → 38
- 4 → 14
- 9 → 31
- 21 → 42
- 28 → 84
- 36 → 44
- 51 → 67
- 71 → 91
- 80 → 100

## Team Colors

- **Red Team**: Red piece
- **Blue Team**: Blue piece
- **Yellow Team**: Yellow piece
- **Green Team**: Green piece

## How to Use

1. Open `index.html` in a web browser
2. Select the number of teams
3. Click "Start Game"
4. Take turns clicking "Roll Dice" for each team
5. Watch the pieces move automatically
6. First team to reach 100 wins!

## Files

- `index.html` - Main HTML structure
- `style.css` - Styling and animations
- `game.js` - Game logic and mechanics

## Educational Use

This game is perfect for:
- Review sessions before tests
- Team-based learning activities
- Engaging students in a fun, competitive format
- Breaking up lecture time with interactive activities

## Future Enhancements

Possible additions:
- Custom question integration on each square
- Sound effects
- Score tracking across multiple games
- Customizable snake and ladder positions
- Timer for turns
- Player names instead of team colors

---

**Created for educational purposes** - Have fun reviewing!
