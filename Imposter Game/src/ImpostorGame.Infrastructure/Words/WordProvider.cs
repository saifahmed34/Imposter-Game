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
            "umbrella", "violin", "waterfall", "xylophone", "yacht", "zebra"
        };

        public string GetRandomWord()
            => Words[Random.Shared.Next(Words.Length)];
    }
}
