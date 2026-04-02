using System;
using ImposterGame.Application.Interfaces.Services;

namespace ImpostorGame.Infrastructure.Words
{
    public class WordProvider : IWordProvider
    {
        private static readonly string[] Words = new[]
        {
            "apple", "banana", "carrot", "dog", "elephant",
            "football", "guitar", "house", "island", "jacket",
            "kite", "laptop", "mountain", "notebook", "ocean",
            "piano", "queen", "rainbow", "sunset", "tree",
            "teacher", "doctor", "engineer", "artist",
            "school", "hospital", "restaurant", "cinema",
            "phone", "laptop", "keyboard", "mouse",
            "football", "basketball", "tennis",
            "beach", "desert", "mountain", "river",
            "pizza", "burger", "pasta", "rice",
            "cat", "dog", "lion", "elephant","naif","omar ehab","reda"
        };

        public string GetRandomWord()
            => Words[Random.Shared.Next(Words.Length)];
    }
}
