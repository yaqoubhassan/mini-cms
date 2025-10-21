<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AIController extends Controller
{
    /**
     * Generate content suggestions using AI.
     */
    public function suggest(Request $request)
    {
        $validated = $request->validate([
            'prompt' => 'required|string|max:1000',
            'type' => 'required|in:content,title,summary,keywords',
            'context' => 'nullable|string|max:5000',
        ]);

        $apiKey = env('OPENAI_API_KEY');

        if (empty($apiKey)) {
            return response()->json([
                'error' => 'AI service is not configured. Please set OPENAI_API_KEY in your environment.',
            ], 500);
        }

        try {
            $systemPrompt = $this->getSystemPrompt($validated['type']);
            $userPrompt = $validated['prompt'];

            if (!empty($validated['context'])) {
                $userPrompt = "Context: {$validated['context']}\n\nRequest: {$userPrompt}";
            }

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(30)->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-4.1-mini',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => $systemPrompt,
                    ],
                    [
                        'role' => 'user',
                        'content' => $userPrompt,
                    ],
                ],
                'temperature' => 0.7,
                'max_tokens' => $this->getMaxTokens($validated['type']),
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $generatedText = $data['choices'][0]['message']['content'] ?? '';

                return response()->json([
                    'success' => true,
                    'text' => trim($generatedText),
                    'type' => $validated['type'],
                ]);
            }

            return response()->json([
                'error' => 'Failed to generate content. Please try again.',
                'details' => $response->json(),
            ], $response->status());
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while generating content.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Improve existing content using AI.
     */
    public function improve(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:10000',
            'instruction' => 'required|in:grammar,clarity,seo,expand,shorten',
        ]);

        $apiKey = env('OPENAI_API_KEY');

        if (empty($apiKey)) {
            return response()->json([
                'error' => 'AI service is not configured.',
            ], 500);
        }

        try {
            $instructions = [
                'grammar' => 'Improve the grammar and fix any spelling errors in the following text. Maintain the original tone and style.',
                'clarity' => 'Improve the clarity and readability of the following text. Make it more concise and easier to understand.',
                'seo' => 'Optimize the following text for SEO. Include relevant keywords naturally and improve the structure for better search engine visibility.',
                'expand' => 'Expand the following text with more details, examples, and explanations. Make it more comprehensive and informative.',
                'shorten' => 'Shorten the following text while keeping the key points and main message. Make it more concise.',
            ];

            $systemPrompt = $instructions[$validated['instruction']];

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(30)->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-4.1-mini',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => $systemPrompt,
                    ],
                    [
                        'role' => 'user',
                        'content' => $validated['content'],
                    ],
                ],
                'temperature' => 0.5,
                'max_tokens' => 2000,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $improvedText = $data['choices'][0]['message']['content'] ?? '';

                return response()->json([
                    'success' => true,
                    'text' => trim($improvedText),
                    'instruction' => $validated['instruction'],
                ]);
            }

            return response()->json([
                'error' => 'Failed to improve content.',
            ], $response->status());
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get system prompt based on generation type.
     */
    private function getSystemPrompt(string $type): string
    {
        return match ($type) {
            'content' => 'You are a professional content writer. Generate high-quality, engaging blog post content based on the user\'s request. Write in a clear, informative style with proper structure and paragraphs.',
            'title' => 'You are a creative copywriter. Generate compelling, SEO-friendly blog post titles. Keep them concise (under 70 characters) and engaging.',
            'summary' => 'You are a skilled editor. Create concise, informative summaries of content. Capture the main points in 2-3 sentences.',
            'keywords' => 'You are an SEO specialist. Generate relevant keywords and tags for the given content. Return them as a comma-separated list.',
            default => 'You are a helpful AI assistant for content creation.',
        };
    }

    /**
     * Get max tokens based on generation type.
     */
    private function getMaxTokens(string $type): int
    {
        return match ($type) {
            'content' => 1500,
            'title' => 100,
            'summary' => 200,
            'keywords' => 100,
            default => 500,
        };
    }
}
