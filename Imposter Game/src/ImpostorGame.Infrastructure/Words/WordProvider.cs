using System;
using System.Collections.Generic;
using System.Text;

using ImposterGame.Application.Interfaces.Services;

namespace ImpostorGame.Infrastructure.Words
{
    public class WordProvider : IWordProvider
    {
        // Simple placeholder implementation
        private static readonly string[] Words = new[] { "apple", "banana", "carrot" };

        public string GetRandomWord()
            => Words[Random.Shared.Next(Words.Length)];
    }
}
