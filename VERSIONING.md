# Version History

## v0.1.1 (Current)

### Core Updates
- **Pitch System Overhaul**: Changed pitch to require preparation cost - each pitch now costs money as an investment to claim the producer
- **Preparation Turns**: Some pitches (epic/legendary) now require turn-based preparation before the producer accepts/declines
- **Client Slot Limit**: Partnered producers limited to 2 slots initially (can be upgraded later)
- **Work Day Duration**: Increased from 10 seconds to 20 seconds
- **View Generation**: Views no longer always increase - adjusted to 70% chance per interval
- **Post Generation**: Slowed down video production rate (2% chance per interval, down from 5%)

### New Features
- **Analytics Dashboard**: Added analytics button showing daily net positive/negative performance
- **Producers Page**: Created dedicated page showing all available producers with details
- **Producer Archetypes**: Added rarity system (Rare, Epic, Legendary) with different pitch costs
- **More Producers**: Added 5 new producers (Fashion Brand, Restaurant, Music Label, Travel Agency, Tech Giant, Luxury Brand, Entertainment Studio)
- **Content Variety**: Expanded post templates for all producers to reduce repetition
- **Producer Names**: Removed # numbering from producer names, using proper brand names

### UI/UX Improvements
- **SPA Routing**: Implemented React Router for single-page application navigation
- **Game UI**: Enhanced UI with rarity indicators and better visual feedback
- **Version Display**: Updated footer to show v0.1.1 and build dev info

### Technical
- Updated package.json version tracking
- Improved state management for daily history tracking
- Enhanced pitch preparation flow with turn-based mechanics

