using System;
using ImposterGame.Application.Interfaces.Services;

namespace ImpostorGame.Infrastructure.Words
{
    public class WordProvider : IWordProvider
    {
        private static readonly Dictionary<string, string[]> CategoryWords = new()
{
    { "Sports", new[]
        { "football", "basketball", "tennis", "cricket", "baseball",
          "volleyball", "swimming", "boxing", "golf", "cycling",
          "running", "skiing", "surfing", "wrestling", "badminton" }
    },

    { "Food", new[]
        { "pizza", "burger", "pasta", "rice", "sushi",
          "shawarma", "kebab", "salad", "steak", "sandwich",
          "noodles", "soup", "fries", "icecream", "cake" }
    },

    { "Animals", new[]
        { "cat", "dog", "lion", "elephant", "horse",
          "tiger", "bear", "wolf", "giraffe", "monkey",
          "zebra", "kangaroo", "panda", "fox", "rabbit" }
    },

    { "Places", new[]
        { "beach", "desert", "mountain", "river", "island",
          "forest", "city", "village", "park", "airport",
          "hotel", "school", "hospital", "mall", "stadium" }
    },

    { "Jobs", new[]
        { "doctor", "engineer", "teacher", "police", "chef",
          "farmer", "pilot", "nurse", "developer", "designer",
          "architect", "lawyer", "mechanic", "driver", "firefighter",
          "scientist", "actor", "writer", "photographer", "manager" }
    },

    { "Vehicles", new[]
        { "car", "bus", "truck", "motorcycle", "bicycle",
          "airplane", "helicopter", "boat", "ship", "train",
          "submarine", "scooter", "taxi", "van", "ambulance" }
    },

    { "Electronics", new[]
        { "phone", "laptop", "tablet", "computer", "keyboard",
          "mouse", "monitor", "camera", "printer", "speaker",
          "headphones", "router", "tv", "console", "watch" }
    },

    { "Games", new[]
        { "chess", "poker", "footballgame", "basketballgame", "videogame",
          "minecraft", "fortnite", "pubg", "fifa", "callofduty",
          "amongus", "valorant", "leagueoflegends", "roblox", "tetris" }
    },

    { "Nature", new[]
        { "sun", "moon", "star", "rain", "snow",
          "wind", "storm", "rainbow", "cloud", "thunder",
          "volcano", "ocean", "lake", "waterfall", "tree" }
    },

    { "Clothes", new[]
        { "shirt", "pants", "jacket", "dress", "shoes",
          "hat", "scarf", "gloves", "socks", "coat",
          "jeans", "tshirt", "suit", "tie", "shorts" }
    }
};

        private static readonly string[] DefaultWords = new[] { "apple", "banana", "carrot", "dog", "elephant" };

        public string GetRandomWord()
        {
            var keys = CategoryWords.Keys.ToList();
            if (keys.Count == 0) return "imposter"; // Fallback
            var randomCategory = keys[Random.Shared.Next(keys.Count)];
            var list = CategoryWords[randomCategory];
            return list[Random.Shared.Next(list.Length)];
        }

        public string GetRandomWord(string category)
        {
            if (string.IsNullOrWhiteSpace(category))
                return GetRandomWord();

            if (CategoryWords.TryGetValue(category, out var list))
                return list[Random.Shared.Next(list.Length)];

            return GetRandomWord();
        }

        public IEnumerable<string> GetCategories() => CategoryWords.Keys;
    }
}
