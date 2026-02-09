# 🎭 Imposter Game - Frontend

A multi-page web application for the Imposter Game where players try to find the imposter among them.

## Features

- **Multi-page Architecture**: Separate pages for each game phase
- **Fixed API URL**: No need to type API endpoint (configured to `localhost:5289`)
- **Session Persistence**: Uses sessionStorage to maintain game state across pages
- **Auto-refresh**: Real-time updates without manual refresh
- **Responsive Design**: Works on desktop and mobile devices
- **Beautiful UI**: Modern gradient design with smooth animations

## Pages

1. **index.html** - Home page (enter name, create/join room)
2. **join.html** - Join existing room with code
3. **lobby.html** - Waiting room before game starts
4. **game.html** - Main game page showing role and word
5. **voting.html** - Vote for suspected imposter
6. **results.html** - Game results and winner

## Setup

### 1. Configure API URL

Edit `config.js` and set your API URL (default is `http://localhost:5289`):

```javascript
const API_BASE_URL = 'http://localhost:5289';
```

### 2. Run Your Backend API

Make sure your .NET API is running on port 5289.

### 3. Serve the Frontend

You have several options:

#### Option A: Using Python
```bash
cd imposter-game
python -m http.server 8000
```
Then open: `http://localhost:8000`

#### Option B: Using Node.js (http-server)
```bash
npm install -g http-server
cd imposter-game
http-server -p 8000
```
Then open: `http://localhost:8000`

#### Option C: Using VS Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

#### Option D: Direct File Opening
Simply open `index.html` in your browser (may have CORS issues)

## How to Play

### Creating a Room
1. Enter your name on the home page
2. Click "Create New Room"
3. Share the Room ID with other players
4. Wait for players to join in the lobby
5. Click "Start Game" when ready

### Joining a Room
1. Enter your name on the home page
2. Click "Join Existing Room"
3. Enter the room code provided by the host
4. Wait in lobby for game to start

### Playing
1. View your role and word (if you're a civilian)
2. Discuss with other players to find the imposter
3. When ready, click "Start Voting Phase"
4. Vote for who you think is the imposter
5. View results to see if you found them!

## Game Flow

```
Home (index.html)
  ↓
Create Room → Join Room (join.html)
  ↓
Lobby (lobby.html)
  ↓
Game (game.html)
  ↓
Voting (voting.html)
  ↓
Results (results.html)
```

## Technical Details

### Session Management
- Player name stored in `localStorage` (persists across sessions)
- Room ID and Player ID stored in `sessionStorage` (cleared when browser closes)
- Automatic redirect to home if session expires

### API Integration
- All API calls use the fixed URL from `config.js`
- Smart response parsing handles empty responses and various formats
- Prevents duplicate API calls with debouncing and refresh flags

### Auto-refresh Intervals
- Lobby: Every 2 seconds
- Game: Every 3 seconds
- Voting: Every 2 seconds

### Error Handling
- Handles "Unexpected end of JSON input" by checking for empty responses
- Graceful fallbacks for network errors
- User-friendly error messages

## Customization

### Change Colors
Edit `style.css` variables:
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --success-color: #4caf50;
    --danger-color: #f44336;
}
```

### Change Refresh Interval
Edit `config.js`:
```javascript
const REFRESH_INTERVAL = 2000; // milliseconds
```

### Change API URL
Edit `config.js`:
```javascript
const API_BASE_URL = 'https://your-api-url.com';
```

## Troubleshooting

### "0 players" showing after join
- **Fixed**: Uses proper room data structure from API response
- Checks `data.room.players` array correctly

### Page refreshes go to home
- **Fixed**: Session data preserved in sessionStorage
- Auto-redirect only on session expiry

### Multiple API calls in console
- **Fixed**: Refresh intervals properly managed with flags
- Intervals cleared on page navigation

### CORS errors
- Make sure your API has CORS enabled
- Check that API URL in `config.js` matches your backend

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Files Structure

```
imposter-game/
├── index.html      # Home page
├── join.html       # Join room page
├── lobby.html      # Lobby/waiting room
├── game.html       # Main game page
├── voting.html     # Voting phase
├── results.html    # Results page
├── style.css       # All styles
├── config.js       # Configuration
├── utils.js        # Utility functions
└── README.md       # This file
```

## License

MIT License - Feel free to use and modify!

## Support

For issues or questions, please check:
1. API is running on correct port
2. `config.js` has correct API URL
3. Browser console for errors
4. Network tab for failed requests
