<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIController extends Controller
{
    /**
     * Generate content suggestions using Groq AI (FREE).
     * 
     * Groq offers free API access with generous rate limits.
     * Sign up at: https://console.groq.com
     * Get your API key from: https://console.groq.com/keys
     * 
     * Add to your .env file:
     * GROQ_API_KEY=your_groq_api_key_here
     */
    public function suggest(Request $request)
    {
        $validated = $request->validate([
            'prompt' => 'required|string|max:1000',
            'type' => 'required|in:content,title,summary,keywords',
            'context' => 'nullable|string|max:5000',
        ]);

        $apiKey = env('GROQ_API_KEY');

        if (empty($apiKey)) {
            return response()->json([
                'error' => 'AI service is not configured.',
                'message' => 'Please set GROQ_API_KEY in your .env file. Get a free API key from https://console.groq.com/keys',
            ], 500);
        }

        try {
            $systemPrompt = $this->getSystemPrompt($validated['type']);
            $userPrompt = $validated['prompt'];

            if (!empty($validated['context'])) {
                $userPrompt = "Context: {$validated['context']}\n\nRequest: {$userPrompt}";
            }

            // Groq API endpoint
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(30)->post('https://api.groq.com/openai/v1/chat/completions', [
                'model' => 'llama-3.3-70b-versatile', // Fast and capable model
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
                'top_p' => 1,
                'stream' => false,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $generatedText = $data['choices'][0]['message']['content'] ?? '';

                return response()->json([
                    'success' => true,
                    'text' => trim($generatedText),
                    'type' => $validated['type'],
                    'model' => 'Groq Llama 3.3 70B',
                ]);
            }

            Log::error('Groq AI API Error', [
                'status' => $response->status(),
                'response' => $response->json(),
            ]);

            return response()->json([
                'error' => 'Failed to generate content. Please try again.',
                'details' => $response->json(),
            ], $response->status());
        } catch (\Exception $e) {
            Log::error('Groq AI Exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

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
            'content' => 'required|string|max:5000',
            'instruction' => 'required|string|max:500',
        ]);

        $apiKey = env('GROQ_API_KEY');

        if (empty($apiKey)) {
            return response()->json([
                'error' => 'AI service is not configured.',
                'message' => 'Please set GROQ_API_KEY in your .env file. Get a free API key from https://console.groq.com/keys',
            ], 500);
        }

        try {
            $systemPrompt = 'You are a professional content editor. Improve the provided content based on the user\'s instructions. Maintain the original meaning and tone while enhancing clarity, grammar, and style.';
            $userPrompt = "Instruction: {$validated['instruction']}\n\nContent to improve:\n{$validated['content']}";

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(30)->post('https://api.groq.com/openai/v1/chat/completions', [
                'model' => 'llama-3.3-70b-versatile',
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
                'temperature' => 0.5,
                'max_tokens' => 2000,
                'top_p' => 1,
                'stream' => false,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $improvedText = $data['choices'][0]['message']['content'] ?? '';

                return response()->json([
                    'success' => true,
                    'text' => trim($improvedText),
                    'instruction' => $validated['instruction'],
                    'model' => 'Groq Llama 3.3 70B',
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
            'content' => 'You are a professional content writer. Generate high-quality, engaging blog post content based on the user\'s request. Write in a clear, informative style with proper structure and paragraphs. Use markdown formatting where appropriate.',
            'title' => 'You are a creative copywriter. Generate compelling, SEO-friendly blog post titles. Keep them concise (under 70 characters), engaging, and relevant to the content. Provide 3-5 title options.',
            'summary' => 'You are a skilled editor. Create concise, informative summaries of content. Capture the main points in 2-3 sentences that would work well as a meta description.',
            'keywords' => 'You are an SEO specialist. Generate 5-10 relevant keywords and tags for the given content. Return them as a comma-separated list of single words or short phrases.',
            default => 'You are a helpful AI assistant for content creation. Provide clear, concise, and helpful responses.',
        };
    }

    /**
     * Get max tokens based on generation type.
     */
    private function getMaxTokens(string $type): int
    {
        return match ($type) {
            'content' => 1500,
            'title' => 150,
            'summary' => 200,
            'keywords' => 100,
            default => 500,
        };
    }
}
