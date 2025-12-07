export const ARCHETYPES = [
    // Common/Rare Producers
    { 
        type: "Tech Startup", 
        name: "Nexus Labs",
        rarity: "rare",
        pitchCost: 25.00,
        taste: "Disruptive", 
        wins: ["Scalable", "AI-Driven", "Next-Gen", "Seamless"], 
        fails: ["Traditional", "Handmade", "Slow", "Vintage"],
        postTemplates: [
            "Just launched our beta! 🚀", 
            "Disrupting the industry.", 
            "AI is the future.", 
            "Series A funding secured!",
            "Breaking barriers with innovation.",
            "The future is now.",
            "Revolutionizing how we work.",
            "Next-level technology at your fingertips."
        ]
    },
    { 
        type: "Bakery", 
        name: "Grandma's Oven",
        rarity: "rare",
        pitchCost: 20.00,
        taste: "Homey", 
        wins: ["Warm", "Authentic", "Love", "Family"], 
        fails: ["Corporate", "Cyber", "Fast", "Automated"],
        postTemplates: [
            "Fresh bread out of the oven! 🍞", 
            "Made with love.", 
            "Grandma's secret recipe.", 
            "Coffee and cake morning.",
            "Morning pastries just baked.",
            "Family recipes passed down generations.",
            "Warm cookies for the soul.",
            "Homemade goodness every day."
        ]
    },
    { 
        type: "Gym", 
        name: "Iron Forge Fitness",
        rarity: "rare",
        pitchCost: 22.00,
        taste: "Hardcore", 
        wins: ["Grind", "Power", "Sweat", "Iron"], 
        fails: ["Soft", "Relax", "Gentle", "Sleep"],
        postTemplates: [
            "No pain no gain! 💪", 
            "Leg day done.", 
            "Crushing PRs.", 
            "Grind never stops.",
            "Beast mode activated.",
            "Another day, another victory.",
            "Pushing limits every session.",
            "Strength comes from dedication."
        ]
    },
    { 
        type: "Luxury Watch", 
        name: "Chronos Elite",
        rarity: "rare",
        pitchCost: 30.00,
        taste: "Elegant", 
        wins: ["Timeless", "Classy", "Gold", "Prestige"], 
        fails: ["Cheap", "Quick", "Plastic", "Funky"],
        postTemplates: [
            "Timeless elegance. ⌚", 
            "Swiss made perfection.", 
            "A legacy for generations.", 
            "Exclusive release.",
            "Crafted for excellence.",
            "Precision meets artistry.",
            "A statement of refinement.",
            "Heritage and innovation combined."
        ]
    },
    // Epic Producers
    {
        type: "Fashion Brand",
        name: "Velvet Couture",
        rarity: "epic",
        pitchCost: 50.00,
        taste: "Sophisticated",
        wins: ["Luxury", "Exclusive", "Elegant", "Refined"],
        fails: ["Casual", "Mass", "Cheap", "Trendy"],
        postTemplates: [
            "New collection dropping soon. ✨",
            "Red carpet ready.",
            "Where fashion meets art.",
            "Exclusive designs for the elite.",
            "Couture craftsmanship at its finest.",
            "Style that transcends time.",
            "Luxury redefined.",
            "Elegance in every thread."
        ]
    },
    {
        type: "Restaurant",
        name: "Saffron Spice",
        rarity: "epic",
        pitchCost: 45.00,
        taste: "Artisanal",
        wins: ["Gourmet", "Handcrafted", "Premium", "Curated"],
        fails: ["Fast", "Generic", "Mass", "Simple"],
        postTemplates: [
            "Chef's special tonight. 🍽️",
            "Farm to table excellence.",
            "Culinary artistry on display.",
            "A feast for the senses.",
            "Signature dishes crafted with passion.",
            "Where flavor meets innovation.",
            "Premium ingredients, exceptional taste.",
            "Dining experience reimagined."
        ]
    },
    {
        type: "Music Label",
        name: "Soundwave Records",
        rarity: "epic",
        pitchCost: 40.00,
        taste: "Vibrant",
        wins: ["Energetic", "Bold", "Dynamic", "Fresh"],
        fails: ["Quiet", "Dull", "Old", "Static"],
        postTemplates: [
            "New track dropping Friday! 🎵",
            "Chart-topping vibes.",
            "The sound of tomorrow.",
            "Music that moves you.",
            "Breaking boundaries in sound.",
            "Where talent meets innovation.",
            "Fresh beats, fresh energy.",
            "The pulse of the industry."
        ]
    },
    {
        type: "Travel Agency",
        name: "Wanderlust Adventures",
        rarity: "epic",
        pitchCost: 35.00,
        taste: "Adventurous",
        wins: ["Exotic", "Bold", "Unforgettable", "Unique"],
        fails: ["Ordinary", "Safe", "Common", "Boring"],
        postTemplates: [
            "Discover hidden gems. ✈️",
            "Adventures await.",
            "Travel beyond boundaries.",
            "Memories that last forever.",
            "Exotic destinations unlocked.",
            "Journeys of a lifetime.",
            "Explore the extraordinary.",
            "Where wanderlust meets reality."
        ]
    },
    // Legendary Producers
    {
        type: "Tech Giant",
        name: "Quantum Systems",
        rarity: "legendary",
        pitchCost: 100.00,
        taste: "Revolutionary",
        wins: ["Cutting-Edge", "Innovative", "Transformative", "Next-Level"],
        fails: ["Outdated", "Basic", "Standard", "Conventional"],
        postTemplates: [
            "Changing the world, one innovation at a time. 🌐",
            "The future is quantum.",
            "Technology that shapes tomorrow.",
            "Leading the digital revolution.",
            "Innovation without limits.",
            "Where science meets possibility.",
            "Transforming industries globally.",
            "The next evolution begins now."
        ]
    },
    {
        type: "Luxury Brand",
        name: "Opulence Collection",
        rarity: "legendary",
        pitchCost: 150.00,
        taste: "Exclusive",
        wins: ["Ultra-Premium", "Elite", "Prestigious", "Rare"],
        fails: ["Common", "Accessible", "Regular", "Standard"],
        postTemplates: [
            "Exclusivity redefined. 💎",
            "For the select few.",
            "Luxury beyond compare.",
            "Where opulence meets artistry.",
            "The pinnacle of refinement.",
            "Exclusive to the elite.",
            "Heritage of excellence.",
            "A legacy of luxury."
        ]
    },
    {
        type: "Entertainment Studio",
        name: "Stellar Productions",
        rarity: "legendary",
        pitchCost: 120.00,
        taste: "Spectacular",
        wins: ["Blockbuster", "Epic", "Stunning", "Unforgettable"],
        fails: ["Small", "Quiet", "Simple", "Plain"],
        postTemplates: [
            "Creating magic on screen. 🎬",
            "Blockbuster entertainment.",
            "Where stories come alive.",
            "Epic productions, epic results.",
            "Entertainment that captivates.",
            "The art of storytelling.",
            "Spectacular experiences await.",
            "Pushing creative boundaries."
        ]
    }
];

export const VIEW_PAYOUT_THRESHOLD = 100;
export const VIEW_PAYOUT_AMOUNT = 0.50;
export const MAX_VIEWS_PER_POST = 100;
export const DAY_DURATION_MS = 20000; // 20 seconds per day
export const MAX_CLIENT_SLOTS = 2; // Starting slots, can be upgraded
